import os
import copy
import time
import networkx as nx
import torch
import numpy as np
from train_reviewer_gnn import (
    ArchSmellGNN,
    nx_to_pyg_data,
    NODE_TYPES,
    PROTOCOLS,
    SMELL_NAMES,
    generate_microservice_graph,
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "arch_smell_gnn.pt")

class HybridArchReviewer:
    def __init__(self, model_path=MODEL_PATH):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = ArchSmellGNN().to(self.device)
        self.model_loaded = False

        if os.path.exists(model_path):
            try:
                self.model.load_state_dict(torch.load(model_path, map_location=self.device, weights_only=True))
                self.model.eval()
                self.model_loaded = True
                print(f"[HybridArchReviewer] Loaded trained weights from {model_path}")
            except Exception as e:
                print(f"[HybridArchReviewer] Could not load {model_path}: {e}")

        if not self.model_loaded:
            print("[HybridArchReviewer] Initializing model with default weights (training can be run via train_reviewer_gnn.py)")
            self.model.eval()

    def build_networkx_graph(self, nodes_data, edges_data):
        G = nx.DiGraph()
        for nd in nodes_data:
            nid = int(nd.get("id", 0))
            ntype = nd.get("node_type", "Service")
            is_st = int(nd.get("is_stateful", 1 if ntype in ["Database", "Cache", "Queue"] else 0))
            replicas = int(nd.get("replication_factor", 1))
            traffic = float(nd.get("traffic_weight", 0.5))
            label = nd.get("label", f"Node_{nid}")

            G.add_node(
                nid,
                label=label,
                node_type=ntype,
                is_stateful=is_st,
                replication_factor=replicas,
                traffic_weight=traffic,
            )

        for ed in edges_data:
            u = int(ed.get("source", 0))
            v = int(ed.get("target", 0))
            proto = ed.get("protocol", "REST")
            sync = int(ed.get("sync_nature", 1))
            freq = float(ed.get("frequency", 0.5))
            G.add_edge(u, v, protocol=proto, sync_nature=sync, frequency=freq)

        return G

    def run_deterministic_analysis(self, G):
        # 1. Tarjan's SCC for directed cycles of any length O(V+E)
        sccs = [comp for comp in nx.strongly_connected_components(G) if len(comp) > 1]
        cycle_nodes = set().union(*sccs) if sccs else set()

        # 2. Articulation Points on undirected projection O(V+E)
        undirected = G.to_undirected()
        art_points = set(nx.articulation_points(undirected)) if G.number_of_nodes() > 1 else set()

        # 3. Synchronous Chains (depth >= 4)
        sync_edges = [(u, v) for u, v, d in G.edges(data=True) if d.get("sync_nature", 1) == 1]
        sync_subgraph = nx.DiGraph(sync_edges)
        sync_chain_nodes = set()
        for u in sync_subgraph.nodes():
            try:
                lengths = nx.single_source_shortest_path_length(sync_subgraph, u)
                for target, dist in lengths.items():
                    if dist >= 4:
                        path = nx.shortest_path(sync_subgraph, u, target)
                        sync_chain_nodes.update(path)
            except Exception:
                pass

        return {
            "sccs": [list(comp) for comp in sccs],
            "cycle_nodes": list(cycle_nodes),
            "art_points": list(art_points),
            "sync_chain_nodes": list(sync_chain_nodes),
        }

    def analyze(self, graph_dict):
        start_t = time.time()
        nodes_data = graph_dict.get("nodes", [])
        edges_data = graph_dict.get("edges", [])

        G = self.build_networkx_graph(nodes_data, edges_data)
        det_metrics = self.run_deterministic_analysis(G)

        # Encode to PyG Data object
        pyg_data = nx_to_pyg_data(G).to(self.device)

        # GNN Forward Pass
        with torch.no_grad():
            node_logits, graph_scores = self.model(pyg_data)
            node_probs = torch.sigmoid(node_logits).cpu().numpy()
            sub_scores = graph_scores[0].cpu().numpy()

        reliability = float(round(sub_scores[0], 1))
        scalability = float(round(sub_scores[1], 1))
        coupling = float(round(sub_scores[2], 1))
        availability = float(round(sub_scores[3], 1))
        overall = float(round(np.mean([reliability, scalability, coupling, availability]), 1))

        smells_list = []
        counterfactual_recommendations = []

        # Map smell names & thresholds
        for nid in G.nodes():
            n_idx = nid if nid < len(node_probs) else 0
            probs = node_probs[n_idx]
            d = G.nodes[nid]
            label = d.get("label", f"Node_{nid}")

            # SPOF Check (Hybrid: GNN prob > 0.5 or (Deterministic Articulation Point + 1 replica))
            is_det_spof = (nid in det_metrics["art_points"] and d.get("replication_factor", 1) == 1)
            spof_score = max(float(probs[0]), 0.92 if is_det_spof else 0.0)
            if spof_score > 0.5:
                smells_list.append({
                    "node_id": nid,
                    "node_label": label,
                    "smell_name": "SPOF",
                    "confidence": round(spof_score, 3),
                    "severity": "CRITICAL" if spof_score > 0.8 else "HIGH",
                    "description": f"Component '{label}' acts as a Single Point of Failure with {d.get('replication_factor', 1)} replica and high load.",
                    "suggested_action": f"Increase replication factor of '{label}' from {d.get('replication_factor', 1)} to 3.",
                })
                counterfactual_recommendations.append({
                    "node_id": nid,
                    "action_type": "INCREASE_REPLICAS",
                    "description": f"Scale '{label}' replicas to 3",
                    "target_attribute": "replication_factor",
                    "new_value": 3,
                })

            # Circular Dependency (Hybrid: exact Tarjan SCC match or high GNN confidence)
            is_cycle = nid in det_metrics["cycle_nodes"]
            cycle_score = max(float(probs[1]), 0.98 if is_cycle else 0.0)
            if cycle_score > 0.5:
                smells_list.append({
                    "node_id": nid,
                    "node_label": label,
                    "smell_name": "Circular_Dependency",
                    "confidence": round(cycle_score, 3),
                    "severity": "CRITICAL",
                    "description": f"Component '{label}' is bound in a directed cycle (deadlock / cascading failure risk).",
                    "suggested_action": f"Decouple '{label}' using an asynchronous message queue (AMQP/Kafka) or event bus.",
                })
                counterfactual_recommendations.append({
                    "node_id": nid,
                    "action_type": "CONVERT_TO_ASYNC",
                    "description": f"Convert incoming edges to '{label}' from sync to async queue",
                    "target_attribute": "sync_nature",
                    "new_value": 0,
                })

            # Shared Database
            in_deg = G.in_degree(nid)
            shared_db_score = max(float(probs[2]), 0.90 if (d.get("node_type") == "Database" and in_deg >= 3) else 0.0)
            if shared_db_score > 0.5:
                smells_list.append({
                    "node_id": nid,
                    "node_label": label,
                    "smell_name": "Shared_Database",
                    "confidence": round(shared_db_score, 3),
                    "severity": "HIGH",
                    "description": f"Database '{label}' is directly accessed by {in_deg} services, violating bounded context encapsulation.",
                    "suggested_action": f"Split database into domain schemas or insert a distributed cache (Redis) in front of '{label}'.",
                })
                counterfactual_recommendations.append({
                    "node_id": nid,
                    "action_type": "INSERT_CACHE",
                    "description": f"Add cache buffer in front of '{label}'",
                    "target_attribute": "cache_attached",
                    "new_value": True,
                })

            # Excessive Sync Chain
            is_sync_chain = nid in det_metrics["sync_chain_nodes"]
            sync_chain_score = max(float(probs[3]), 0.88 if is_sync_chain else 0.0)
            if sync_chain_score > 0.5:
                smells_list.append({
                    "node_id": nid,
                    "node_label": label,
                    "smell_name": "Excessive_Sync_Chain",
                    "confidence": round(sync_chain_score, 3),
                    "severity": "HIGH",
                    "description": f"Component '{label}' participates in a blocking synchronous call chain of length >= 4.",
                    "suggested_action": f"Refactor call chain into asynchronous event streams to prevent thread starvation.",
                })

            # Hub Dependency
            if float(probs[4]) > 0.5 or (d.get("node_type") == "Service" and (in_deg + G.out_degree(nid)) >= 6):
                smells_list.append({
                    "node_id": nid,
                    "node_label": label,
                    "smell_name": "Hub_Dependency",
                    "confidence": round(float(probs[4]), 3),
                    "severity": "MEDIUM",
                    "description": f"Service '{label}' acts as a God Service with {in_deg + G.out_degree(nid)} total links.",
                    "suggested_action": f"Decompose '{label}' into dedicated microservices per domain entity.",
                })

            # Service Intimacy
            if float(probs[5]) > 0.5:
                smells_list.append({
                    "node_id": nid,
                    "node_label": label,
                    "smell_name": "Service_Intimacy",
                    "confidence": round(float(probs[5]), 3),
                    "severity": "MEDIUM",
                    "description": f"Service '{label}' exhibits high-frequency chatter or tight multi-DB coupling.",
                    "suggested_action": f"Consolidate shared logic or migrate to bulk asynchronous messaging.",
                })

        duration_ms = round((time.time() - start_t) * 1000.0, 2)

        return {
            "overall_score": overall,
            "reliability_score": reliability,
            "scalability_score": scalability,
            "coupling_score": coupling,
            "availability_score": availability,
            "deterministic_cycles": len(det_metrics["sccs"]),
            "deterministic_spofs": len(det_metrics["art_points"]),
            "smells": smells_list,
            "counterfactual_recommendations": counterfactual_recommendations,
            "inference_time_ms": duration_ms,
            "analysis_engine": "Hybrid Neuro-Symbolic GNN (Tarjan's SCC + GraphSAGE + GATv2)",
        }

    def counterfactual_refactor(self, graph_dict, mutation):
        """
        Applies a counterfactual mutation operator T_c(G) and re-evaluates
        through the GNN to compute the exact delta score improvement.
        """
        # Baseline analysis
        baseline = self.analyze(graph_dict)

        # Deep clone nodes and edges
        nodes_copy = copy.deepcopy(graph_dict.get("nodes", []))
        edges_copy = copy.deepcopy(graph_dict.get("edges", []))

        target_node_id = mutation.get("node_id")
        action_type = mutation.get("action_type")

        # Mutate graph
        if action_type == "INCREASE_REPLICAS":
            for n in nodes_copy:
                if n.get("id") == target_node_id:
                    n["replication_factor"] = int(mutation.get("new_value", 3))

        elif action_type == "CONVERT_TO_ASYNC":
            for e in edges_copy:
                if e.get("target") == target_node_id or e.get("source") == target_node_id:
                    e["sync_nature"] = 0
                    e["protocol"] = "AMQP"

        elif action_type == "INSERT_CACHE":
            for n in nodes_copy:
                if n.get("id") == target_node_id:
                    n["traffic_weight"] = max(0.1, float(n.get("traffic_weight", 0.5)) * 0.4)
            # Add a cache node attached to it
            new_id = len(nodes_copy) + 100
            nodes_copy.append({
                "id": new_id,
                "label": f"Cache_{target_node_id}",
                "node_type": "Cache",
                "is_stateful": 1,
                "replication_factor": 2,
                "traffic_weight": 0.3,
            })
            edges_copy.append({
                "source": target_node_id,
                "target": new_id,
                "protocol": "REST",
                "sync_nature": 1,
                "frequency": 0.4,
            })

        mutated_graph = {
            "name": graph_dict.get("name", "") + " (Refactored)",
            "description": "Counterfactual mutated graph",
            "nodes": nodes_copy,
            "edges": edges_copy,
        }

        # Re-run inference on mutated graph
        refactored = self.analyze(mutated_graph)

        orig_map = {
            "Reliability": baseline["reliability_score"],
            "Scalability": baseline["scalability_score"],
            "Coupling": baseline["coupling_score"],
            "Availability": baseline["availability_score"],
            "Overall": baseline["overall_score"],
        }
        ref_map = {
            "Reliability": refactored["reliability_score"],
            "Scalability": refactored["scalability_score"],
            "Coupling": refactored["coupling_score"],
            "Availability": refactored["availability_score"],
            "Overall": refactored["overall_score"],
        }
        deltas = {k: round(ref_map[k] - orig_map[k], 1) for k in orig_map}

        return {
            "original_scores": orig_map,
            "refactored_scores": ref_map,
            "score_deltas": deltas,
            "summary": f"Refactoring '{action_type}' improved Overall score from {orig_map['Overall']} to {ref_map['Overall']} (+{deltas['Overall']} pts) in {refactored['inference_time_ms']} ms.",
            "applied_mutation": mutation,
            "refactored_graph": mutated_graph,
        }
