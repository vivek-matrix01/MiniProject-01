import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any, Dict

from service import HybridArchReviewer
from train_reviewer_gnn import generate_microservice_graph

app = FastAPI(
    title="AI-Powered System Design Reviewer - GNN Engine",
    description="Hybrid Neuro-Symbolic Graph Neural Network (GraphSAGE + GATv2 + Tarjan's SCC)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

reviewer = HybridArchReviewer()

class NodeModel(BaseModel):
    id: int
    label: Optional[str] = None
    node_type: Optional[str] = "Service"
    is_stateful: Optional[int] = 0
    replication_factor: Optional[int] = 1
    traffic_weight: Optional[float] = 0.5

class EdgeModel(BaseModel):
    source: int
    target: int
    protocol: Optional[str] = "REST"
    sync_nature: Optional[int] = 1
    frequency: Optional[float] = 0.5

class GraphModel(BaseModel):
    name: Optional[str] = "Microservice Topology"
    description: Optional[str] = None
    nodes: List[NodeModel]
    edges: List[EdgeModel]

class RefactorRequestModel(BaseModel):
    graph: Optional[GraphModel] = None
    name: Optional[str] = None
    description: Optional[str] = None
    nodes: Optional[List[NodeModel]] = None
    edges: Optional[List[EdgeModel]] = None
    mutation: Optional[Dict[str, Any]] = None
    action_type: Optional[str] = None
    node_id: Optional[int] = None
    new_value: Optional[Any] = None

@app.get("/health")
def health():
    return {
        "status": "UP",
        "service": "AI-Powered Architecture Reviewer Engine",
        "model_loaded": reviewer.model_loaded,
        "device": str(reviewer.device),
        "engine": "GraphSAGE + Edge-Aware GATv2 + Tarjan SCC",
    }

@app.post("/api/v1/analyze")
def analyze_architecture(graph: GraphModel):
    try:
        graph_dict = graph.model_dump()
        result = reviewer.analyze(graph_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/api/v1/refactor")
def refactor_architecture(req: RefactorRequestModel):
    try:
        # Extract graph dict
        if req.graph:
            graph_dict = req.graph.model_dump()
        else:
            graph_dict = {
                "name": req.name or "Architecture",
                "description": req.description or "",
                "nodes": [n.model_dump() for n in (req.nodes or [])],
                "edges": [e.model_dump() for e in (req.edges or [])],
            }

        # Extract mutation
        if req.mutation:
            mutation = req.mutation
        else:
            mutation = {
                "node_id": req.node_id if req.node_id is not None else 0,
                "action_type": req.action_type or "INCREASE_REPLICAS",
                "new_value": req.new_value if req.new_value is not None else 3,
            }

        result = reviewer.counterfactual_refactor(graph_dict, mutation)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Refactoring error: {str(e)}")

@app.get("/api/v1/synthetic")
def get_synthetic_graph(num_nodes: int = 20):
    try:
        G, labels, scores = generate_microservice_graph(num_nodes)
        nodes = []
        for n, d in G.nodes(data=True):
            nodes.append({
                "id": n,
                "label": f"{d['node_type']}_{n}",
                "node_type": d["node_type"],
                "is_stateful": d["is_stateful"],
                "replication_factor": d["replication_factor"],
                "traffic_weight": d["traffic_weight"],
            })
        edges = []
        for u, v, d in G.edges(data=True):
            edges.append({
                "source": u,
                "target": v,
                "protocol": d.get("protocol", "REST"),
                "sync_nature": d.get("sync_nature", 1),
                "frequency": d.get("frequency", 0.5),
            })
        return {
            "name": f"Synthetic Scale-Free Topology ({num_nodes} Nodes)",
            "description": "Programmatically generated synthetic microservice topology with injected anti-patterns",
            "nodes": nodes,
            "edges": edges,
            "ground_truth_scores": {
                "Reliability": scores[0],
                "Scalability": scores[1],
                "Coupling": scores[2],
                "Availability": scores[3],
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Synthetic generation error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
