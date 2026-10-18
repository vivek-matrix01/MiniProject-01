import random
import os
import numpy as np
import networkx as nx
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.loader import DataLoader
from torch_geometric.nn import SAGEConv, GATv2Conv, global_mean_pool, global_max_pool
from sklearn.metrics import f1_score, precision_score, recall_score
from sklearn.ensemble import RandomForestClassifier

# Set seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

NODE_TYPES = ["Service", "Database", "Cache", "Queue", "Gateway"]
PROTOCOLS = ["REST", "gRPC", "AMQP", "JDBC"]
SMELL_NAMES = [
    "SPOF",
    "Circular_Dependency",
    "Shared_Database",
    "Excessive_Sync_Chain",
    "Hub_Dependency",
    "Service_Intimacy",
]

# =====================================================================
# PHASE 1 & 2: SYNTHETIC ARCHITECTURE GENERATOR & GROUND-TRUTH LABELER
# =====================================================================
def generate_microservice_graph(num_nodes=25):
    """
    Generates a directed microservice topology with realistic attributes
    and injects architectural smells, computing ground-truth labels.
    """
    G = nx.DiGraph()

    # 1. Create nodes with realistic architectural roles
    for i in range(num_nodes):
        if i == 0:
            ntype = "Gateway"
        elif i < int(num_nodes * 0.65):
            ntype = "Service"
        elif i < int(num_nodes * 0.85):
            ntype = "Database"
        elif i < int(num_nodes * 0.93):
            ntype = "Cache"
        else:
            ntype = "Queue"

        is_stateful = 1 if ntype in ["Database", "Cache", "Queue"] else 0
        replicas = random.choice([1, 2, 3]) if ntype == "Service" else random.choice([1, 2])
        traffic = round(random.uniform(0.1, 0.6), 2)

        G.add_node(
            i,
            node_type=ntype,
            is_stateful=is_stateful,
            replication_factor=replicas,
            traffic_weight=traffic,
        )

    services = [n for n, d in G.nodes(data=True) if d["node_type"] == "Service"]
    dbs = [n for n, d in G.nodes(data=True) if d["node_type"] == "Database"]
    queues = [n for n, d in G.nodes(data=True) if d["node_type"] == "Queue"]

    # Connect Gateway to entry services
    for s in random.sample(services, k=min(3, len(services))):
        G.add_edge(0, s, protocol="REST", sync_nature=1, frequency=0.7)

    # Connect Services to other Services, Queues, and Databases
    for s in services:
        targets = [t for t in services if t != s]
        for t in random.sample(targets, k=random.randint(1, min(2, len(targets)))):
            proto = random.choice(["REST", "gRPC"])
            G.add_edge(s, t, protocol=proto, sync_nature=1, frequency=round(random.uniform(0.1, 0.5), 2))

        if dbs:
            my_db = random.choice(dbs)
            G.add_edge(s, my_db, protocol="JDBC", sync_nature=1, frequency=round(random.uniform(0.2, 0.6), 2))

        if queues and random.random() < 0.3:
            q = random.choice(queues)
            G.add_edge(s, q, protocol="AMQP", sync_nature=0, frequency=0.4)

    # 2. Inject Controlled Architectural Anti-Patterns (Smells)
    if dbs and random.random() < 0.6:
        shared_db = dbs[0]
        G.nodes[shared_db]["replication_factor"] = 1
        G.nodes[shared_db]["traffic_weight"] = 0.92
        for s in random.sample(services, k=min(5, len(services))):
            G.add_edge(s, shared_db, protocol="JDBC", sync_nature=1, frequency=0.85)

    if len(services) >= 6 and random.random() < 0.5:
        god_service = services[0]
        G.nodes[god_service]["traffic_weight"] = 0.95
        for s in services[1:min(7, len(services))]:
            G.add_edge(god_service, s, protocol="REST", sync_nature=1, frequency=0.75)

    if len(services) >= 6 and random.random() < 0.5:
        chain = random.sample(services, k=5)
        for idx in range(len(chain) - 1):
            G.add_edge(chain[idx], chain[idx + 1], protocol="REST", sync_nature=1, frequency=0.8)

    if len(services) >= 4 and random.random() < 0.5:
        s1, s2 = random.sample(services, k=2)
        G.add_edge(s1, s2, protocol="gRPC", sync_nature=1, frequency=0.98)
        G.add_edge(s2, s1, protocol="gRPC", sync_nature=1, frequency=0.96)

    # 3. Compute Multi-Label Ground Truth
    labels = {n: [0] * 6 for n in G.nodes()}

    sccs = [comp for comp in nx.strongly_connected_components(G) if len(comp) > 1]
    cycle_nodes = set().union(*sccs) if sccs else set()

    undirected_art_points = set(nx.articulation_points(G.to_undirected()))

    sync_edges = [(u, v) for u, v, d in G.edges(data=True) if d["sync_nature"] == 1]
    sync_subgraph = nx.DiGraph(sync_edges)
    sync_chain_nodes = set()
    for u in sync_subgraph.nodes():
        lengths = nx.single_source_shortest_path_length(sync_subgraph, u)
        for target, dist in lengths.items():
            if dist >= 4:
                path = nx.shortest_path(sync_subgraph, u, target)
                sync_chain_nodes.update(path)

    for n, d in G.nodes(data=True):
        in_deg = G.in_degree(n)
        out_deg = G.out_degree(n)
        sync_in = sum(1 for u, _, ed in G.in_edges(n, data=True) if ed["sync_nature"] == 1)

        if d["replication_factor"] == 1 and (sync_in >= 3 or (n in undirected_art_points and d["traffic_weight"] > 0.6)):
            labels[n][0] = 1

        if n in cycle_nodes:
            labels[n][1] = 1

        if d["node_type"] == "Database" and in_deg >= 3:
            labels[n][2] = 1

        if n in sync_chain_nodes:
            labels[n][3] = 1

        if d["node_type"] == "Service" and (in_deg + out_deg) >= 6:
            labels[n][4] = 1

        db_links = sum(1 for _, v in G.out_edges(n) if G.nodes[v]["node_type"] == "Database")
        high_freq_links = sum(1 for _, v, ed in G.out_edges(n, data=True) if ed["frequency"] > 0.9)
        if db_links >= 2 or high_freq_links >= 1:
            labels[n][5] = 1

    # 4. Compute Graph-Level Sub-Scores (0 to 100)
    num_n = max(1, G.number_of_nodes())
    spof_ratio = sum(labels[n][0] for n in G.nodes()) / num_n
    cycle_ratio = sum(labels[n][1] for n in G.nodes()) / num_n
    shared_db_ratio = sum(labels[n][2] for n in G.nodes()) / num_n
    sync_ratio = sum(labels[n][3] for n in G.nodes()) / num_n
    hub_ratio = sum(labels[n][4] for n in G.nodes()) / num_n
    intimacy_ratio = sum(labels[n][5] for n in G.nodes()) / num_n

    reliability = max(10.0, 100.0 - (spof_ratio * 140 + sync_ratio * 60 + cycle_ratio * 50))
    scalability = max(10.0, 100.0 - (shared_db_ratio * 180 + hub_ratio * 90 + sync_ratio * 40))
    coupling = max(10.0, 100.0 - (cycle_ratio * 90 + intimacy_ratio * 90 + shared_db_ratio * 120))
    availability = max(10.0, 100.0 - (spof_ratio * 160 + shared_db_ratio * 100))

    graph_scores = [reliability, scalability, coupling, availability]
    return G, labels, graph_scores


def nx_to_pyg_data(G, labels=None, graph_scores=None):
    """Converts a NetworkX DiGraph into a PyTorch Geometric Data object."""
    node_features = []
    node_targets = []

    for n in range(G.number_of_nodes()):
        d = G.nodes[n]
        ntype_vec = [1.0 if d.get("node_type", "Service") == t else 0.0 for t in NODE_TYPES]
        feat = ntype_vec + [
            float(d.get("is_stateful", 0)),
            float(d.get("replication_factor", 1)) / 5.0,
            float(d.get("traffic_weight", 0.5)),
        ]
        node_features.append(feat)
        if labels is not None:
            node_targets.append(labels[n])

    edge_indices = []
    edge_attrs = []
    for u, v, ed in G.edges(data=True):
        edge_indices.append([u, v])
        proto_vec = [1.0 if ed.get("protocol", "REST") == p else 0.0 for p in PROTOCOLS]
        e_feat = proto_vec + [float(ed.get("sync_nature", 1)), float(ed.get("frequency", 0.5))]
        edge_attrs.append(e_feat)

    x = torch.tensor(node_features, dtype=torch.float)
    if len(edge_indices) > 0:
        edge_index = torch.tensor(edge_indices, dtype=torch.long).t().contiguous()
        edge_attr = torch.tensor(edge_attrs, dtype=torch.float)
    else:
        edge_index = torch.empty((2, 0), dtype=torch.long)
        edge_attr = torch.empty((0, 6), dtype=torch.float)

    data = Data(x=x, edge_index=edge_index, edge_attr=edge_attr)
    if labels is not None:
        data.y_node = torch.tensor(node_targets, dtype=torch.float)
    if graph_scores is not None:
        data.y_graph = torch.tensor([graph_scores], dtype=torch.float)

    return data


# =====================================================================
# PHASE 4: EDGE-AWARE MULTI-TASK GNN (GraphSAGE + GATv2)
# =====================================================================
class ArchSmellGNN(nn.Module):
    """
    Hybrid GraphSAGE + Edge-Aware GATv2 Architecture.
    Jointly predicts:
      1. Node-level multi-label architectural smells (6 classes)
      2. Graph-level health sub-scores (Reliability, Scalability, Coupling, Availability)
    """
    def __init__(self, node_in_dim=8, edge_in_dim=6, hidden_dim=64, num_smells=6):
        super().__init__()
        self.sage1 = SAGEConv(node_in_dim, hidden_dim)
        self.bn1 = nn.BatchNorm1d(hidden_dim)

        self.gat1 = GATv2Conv(hidden_dim, hidden_dim // 4, heads=4, edge_dim=edge_in_dim, concat=True)
        self.bn2 = nn.BatchNorm1d(hidden_dim)

        self.gat2 = GATv2Conv(hidden_dim, hidden_dim // 4, heads=4, edge_dim=edge_in_dim, concat=True)
        self.bn3 = nn.BatchNorm1d(hidden_dim)

        self.jump_proj = nn.Linear(hidden_dim * 3, hidden_dim)

        self.node_classifier = nn.Sequential(
            nn.Linear(hidden_dim, hidden_dim // 2),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_dim // 2, num_smells),
        )

        self.graph_regressor = nn.Sequential(
            nn.Linear(hidden_dim * 2, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, 4),
        )

    def forward(self, data):
        x, edge_index, edge_attr = data.x, data.edge_index, data.edge_attr
        batch = data.batch if hasattr(data, "batch") and data.batch is not None else torch.zeros(x.size(0), dtype=torch.long, device=x.device)

        h1 = F.relu(self.bn1(self.sage1(x, edge_index)))
        h2 = F.relu(self.bn2(self.gat1(h1, edge_index, edge_attr=edge_attr)))
        h3 = F.relu(self.bn3(self.gat2(h2, edge_index, edge_attr=edge_attr)))

        h_cat = torch.cat([h1, h2, h3], dim=-1)
        h_final = F.relu(self.jump_proj(h_cat))

        node_logits = self.node_classifier(h_final)

        g_pool = torch.cat([global_mean_pool(h_final, batch), global_max_pool(h_final, batch)], dim=-1)
        graph_scores = torch.clamp(self.graph_regressor(g_pool), 0.0, 100.0)

        return node_logits, graph_scores


# =====================================================================
# PHASE 3 & 5: BASELINE COMPARISON, TRAINING LOOP & REPORT GENERATION
# =====================================================================
def run_pipeline(save_path="arch_smell_gnn.pt"):
    print("1. Generating Synthetic Microservice Architecture Dataset...")
    dataset = []
    for _ in range(300):
        n_nodes = random.randint(18, 35)
        G, labels, scores = generate_microservice_graph(n_nodes)
        dataset.append(nx_to_pyg_data(G, labels, scores))

    train_data = dataset[:240]
    test_data = dataset[240:]

    train_loader = DataLoader(train_data, batch_size=16, shuffle=True)
    test_loader = DataLoader(test_data, batch_size=16, shuffle=False)

    # --- Baseline: Random Forest on Raw Node Features ---
    X_train_tab = torch.cat([d.x for d in train_data], dim=0).numpy()
    Y_train_tab = torch.cat([d.y_node for d in train_data], dim=0).numpy()
    X_test_tab = torch.cat([d.x for d in test_data], dim=0).numpy()
    Y_test_tab = torch.cat([d.y_node for d in test_data], dim=0).numpy()

    rf = RandomForestClassifier(n_estimators=100, random_state=SEED)
    rf.fit(X_train_tab, Y_train_tab)
    rf_preds = rf.predict(X_test_tab)
    rf_f1 = f1_score(Y_test_tab, rf_preds, average="macro", zero_division=0)
    print(f"[Baseline - Tabular Random Forest (No Topology)] Macro-F1: {rf_f1:.4f}")

    # --- Train Proposed GNN Model ---
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = ArchSmellGNN().to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=0.003, weight_decay=1e-4)
    bce_loss_fn = nn.BCEWithLogitsLoss()
    mse_loss_fn = nn.MSELoss()

    print("\n2. Training Edge-Aware GraphSAGE + GATv2 Model...")
    for epoch in range(1, 31):
        model.train()
        total_loss = 0.0
        for batch in train_loader:
            batch = batch.to(device)
            optimizer.zero_grad()
            node_logits, pred_scores = model(batch)

            loss_node = bce_loss_fn(node_logits, batch.y_node)
            loss_graph = mse_loss_fn(pred_scores, batch.y_graph)
            loss = loss_node + 0.01 * loss_graph
            loss.backward()
            optimizer.step()
            total_loss += loss.item()

        if epoch % 10 == 0:
            print(f"   Epoch {epoch:02d} | Multi-Task Loss: {total_loss / len(train_loader):.4f}")

    # --- Evaluate GNN on Test Set ---
    model.eval()
    all_preds, all_targets = [], []
    score_mae = 0.0
    with torch.no_grad():
        for batch in test_loader:
            batch = batch.to(device)
            logits, scores = model(batch)
            probs = torch.sigmoid(logits)
            all_preds.append((probs > 0.5).cpu().numpy())
            all_targets.append(batch.y_node.cpu().numpy())
            score_mae += torch.abs(scores - batch.y_graph).mean().item()

    y_pred = np.vstack(all_preds)
    y_true = np.vstack(all_targets)
    gnn_f1 = f1_score(y_true, y_pred, average="macro", zero_division=0)
    gnn_prec = precision_score(y_true, y_pred, average="macro", zero_division=0)
    gnn_rec = recall_score(y_true, y_pred, average="macro", zero_division=0)

    print("\n=====================================================================")
    print("BENCHMARK RESULTS (TEST SET)")
    print("=====================================================================")
    print(f"Proposed GNN (GraphSAGE + GATv2) -> Precision: {gnn_prec:.4f} | Recall: {gnn_rec:.4f} | Macro-F1: {gnn_f1:.4f}")
    print(f"Graph Health Sub-Score Regression -> Mean Absolute Error (MAE): {score_mae / len(test_loader):.2f} pts")
    print("=====================================================================")

    # Save model weights
    save_dir = os.path.dirname(os.path.abspath(save_path))
    os.makedirs(save_dir, exist_ok=True)
    torch.save(model.state_dict(), save_path)
    print(f"Saved trained GNN weights to: {save_path}")

    return model

if __name__ == "__main__":
    run_pipeline()
