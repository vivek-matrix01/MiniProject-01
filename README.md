# AI-Powered System Design Reviewer 🚀
### Hybrid Neuro-Symbolic Graph Neural Network (GraphSAGE + GATv2 + Tarjan's SCC)

An enterprise-grade, end-to-end system design analyzer that evaluates microservice topologies for architectural anti-patterns, predicts continuous resilience sub-scores, and generates counterfactual graph mutations with quantified delta score improvements ($\Delta \text{Score}$).

---

## 🏗️ Polyglot Architecture Overview

The system is decoupled into four dedicated tiers:

```
MiniProject/
├── docker-compose.yml          # PostgreSQL 16 Docker container (:5432)
├── docker/
│   └── init.sql                # Pre-configured schema for architecture designs & reports
├── backend/                    # Java 21 + Spring Boot 3 Enterprise Backend (:8080)
│   ├── pom.xml                 # Maven configuration for Java 21 & Spring Data JPA
│   ├── src/main/java/...       # REST Controllers, Repositories, DTOs & Deterministic Tarjan DFS
│   └── src/main/resources/...  # application.yml (PostgreSQL + H2 fallback)
├── ai-engine/                  # Python + PyTorch Geometric ML Engine (:8000)
│   ├── train_reviewer_gnn.py   # Synthetic generator, RF baseline, GraphSAGE + GATv2 training
│   ├── service.py              # Hybrid Tarjan SCC + GNN Inference + CounterfactualRefactorer
│   ├── main.py                 # FastAPI microservice (/api/v1/analyze, /api/v1/refactor)
│   ├── arch_smell_gnn.pt       # Pre-trained multi-task GNN weights
│   └── requirements.txt
├── frontend/                   # React 18 + Vite + TailwindCSS (:5173)
│   ├── src/components/         # TopologyCanvas, HealthRadar, SmellList, VivaReport
│   └── src/App.jsx             # Live Visualizer, Topology Studio & Refactoring Simulator
└── README.md
```

---

## ⚡ Quick Start Guide

### Step 1: Run Java Backend in IntelliJ IDEA (JDK 21) — Auto Docker DB!
Thanks to the `spring-boot-docker-compose` integration, **you don't even need to run `docker compose up` manually**!
1. Make sure **Docker Desktop** is running.
2. Open **IntelliJ IDEA**.
3. Click **File → Open** and select:
   `e:\MiniProject\backend`
4. IntelliJ automatically detects Maven and sets SDK to **Java 21**.
5. Run [ReviewerApplication.java](file:///e:/MiniProject/backend/src/main/java/com/architecture/reviewer/ReviewerApplication.java).
6. **Spring Boot automatically starts the PostgreSQL container from `compose.yaml`**, applies [init.sql](file:///e:/MiniProject/backend/init.sql), connects to the database, and begins serving on **http://localhost:8080**!

*(Note: If Docker Desktop is not running, the backend falls back to in-memory mode seamlessly without crashing).*

---

### Step 3: Run the Python AI Engine (FastAPI + GNN)
Open a terminal in `ai-engine/`:
```bash
cd ai-engine
python main.py
```
> The GNN engine loads `arch_smell_gnn.pt` and starts on **http://localhost:8000**.
> Interactive Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

To retrain the model or re-evaluate the tabular Random Forest baseline:
```bash
python train_reviewer_gnn.py
```

---

### Step 4: Run the React Frontend
Open a terminal in `frontend/`:
```bash
cd frontend
npm run dev
```
> Access the interactive reviewer UI at **http://localhost:5173**.

---

## 🔬 Deep Learning & Graph Theory Architecture

### 1. Mathematical Formulation
* **Inductive Aggregation (GraphSAGE Layer 1):**
  $$\mathbf{h}_v^{(1)} = \sigma\left(\mathbf{W}_1 \cdot \left[\mathbf{h}_v^{(0)} \,\Vert\, \text{MEAN}\left(\left\{\mathbf{h}_u^{(0)}, \forall u \in \mathcal{N}(v)\right\}\right)\right]\right)$$
  Preserves node root identity, preventing database state from being washed out by stateless services.
* **Edge-Conditioned Dynamic Attention (GATv2 Layers 2 & 3):**
  $$e(\mathbf{h}_u, \mathbf{h}_v, \mathbf{e}_{uv}) = \mathbf{a}^\top \text{LeakyReLU}\left(\mathbf{W}_{\text{left}}\mathbf{h}_u + \mathbf{W}_{\text{right}}\mathbf{h}_v + \mathbf{W}_{\text{edge}}\mathbf{e}_{uv}\right)$$
  Explicitly differentiates blocking synchronous REST ($e_{\text{sync}}=1$) from asynchronous queues ($e_{\text{sync}}=0$).
* **Jumping Knowledge (JK) Fusion:**
  $$\mathbf{h}_v^{\text{JK}} = \text{ReLU}\left(\mathbf{W}_{\text{JK}} \left[\mathbf{h}_v^{(1)} \,\Vert\, \mathbf{h}_v^{(2)} \,\Vert\, \mathbf{h}_v^{(3)}\right]\right)$$
  Mitigates over-smoothing across 3 message-passing hops.

### 2. Multi-Task Target Labels
* **Node-Level Multi-Label Smells ($\mathbf{y}_i \in \{0, 1\}^6$):**
  `[SPOF, Circular_Dependency, Shared_Database, Excessive_Sync_Chain, Hub_Dependency, Service_Intimacy]`
* **Graph-Level Continuous Health Sub-Scores ($\mathbf{y}_G \in [0, 100]^4$):**
  `[Reliability, Scalability, Coupling, Availability]`

---

## 🧪 Counterfactual Recommendation Engine
When a smell is detected with high confidence:
1. Target mutation operator $T_c(G)$ is applied in memory (e.g. `replication_factor: 1 -> 3` or `sync_nature: 1 -> 0`).
2. The mutated tensor $G'$ is re-evaluated by the GNN in **< 5 ms**.
3. The UI presents the exact mathematically grounded impact:
   $$\Delta \text{Score} = \hat{\mathbf{y}}_G(G') - \hat{\mathbf{y}}_G(G)$$
