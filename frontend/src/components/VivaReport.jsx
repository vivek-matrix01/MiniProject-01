import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Cpu, Network, ShieldCheck, Zap } from 'lucide-react';

const VIVA_QUESTIONS = [
  {
    q: "Question 1: If you can detect cycles with Tarjan's algorithm and SPOFs with articulation points in O(V+E) time, why do you need a Graph Neural Network at all?",
    a: "Deterministic graph algorithms only inspect unweighted or single-rule binary topology. In real microservice systems, architectural risk is latent and multidimensional. For example, a service that is not a strict graph articulation point can still act as a functional SPOF if it has replication_factor = 1, handles traffic_weight = 0.85, and sits at the end of four synchronous REST chains. Hard-coding nested if-else rules for every combination of node type, protocol, frequency, replication factor, and multi-hop neighborhood quickly becomes brittle and unmaintainable. The GNN learns continuous representations of these multi-attribute interactions across K-hop neighborhoods, while deterministic algorithms handle exact global properties like long cycles."
  },
  {
    q: "Question 2: Why did you choose GraphSAGE and GATv2 over a standard Graph Convolutional Network (GCN)?",
    a: "Two critical reasons: (1) Inductive vs. Transductive Learning: Standard spectral GCNs depend on the fixed graph Laplacian of a single graph and struggle to generalize to completely new graph topologies. GraphSAGE learns aggregator functions over sampled neighborhoods, making it inductive—it can evaluate brand-new microservice diagrams of any size at inference time without retraining. (2) Edge Feature Awareness: Standard GCN and GraphSAGE layers only pass node features along edges; they ignore edge attributes (protocol, sync_nature, frequency). By combining GraphSAGE with GATv2 (edge_dim=6), our attention weights explicitly factor in whether an edge is a blocking REST call or an asynchronous Kafka queue."
  },
  {
    q: "Question 3: Why use GATv2 instead of the original GAT (Velickovic et al., 2018)?",
    a: "In the original GAT formulation, the linear layers and the attention vector are applied sequentially without an intervening non-linearity (aᵀ LeakyReLU(W[h_i || h_j])), which causes static attention: the ranking of attention scores is unconditioned on the query node. GATv2 applies the linear projection after concatenation and before LeakyReLU, achieving dynamic attention where every node can attend differently to its neighbors depending on both node states and the connecting edge attributes."
  },
  {
    q: "Question 4: Where did you get the training dataset? How do you defend using synthetic data?",
    a: "Enterprise microservice dependency graphs with labeled architectural failures are proprietary and rarely released publicly in the thousands required for deep learning. To overcome this cold-start bottleneck, we built a domain-constrained synthetic topology generator using NetworkX that models realistic microservice tiers (API Gateways → Stateless Services → Caches/Queues → Stateful Databases) and programmatically injects anti-patterns using software engineering literature thresholds (Taibi et al.'s catalog of microservice smells). To prevent the GNN from simply memorizing trivial rules, we introduce stochastic noise in traffic weights, degree distributions, and graph sizes (15 to 100+ nodes)."
  },
  {
    q: "Question 5: What is the Over-Smoothing problem in GNNs, and how did you prevent it in your architecture?",
    a: "In GNNs, if you stack too many message-passing layers (e.g. 6+ layers), every node's embedding converges to the same global average of the connected component, making individual nodes indistinguishable. We solved this in two ways: (1) We restricted message passing to 3 hops, which is sufficient to capture microservice call chains and local star/hub topologies. (2) We implemented a Jumping Knowledge (JK) skip connection (torch.cat([h1, h2, h3], dim=-1)), which preserves the localized 1-hop representation alongside the 2-hop and 3-hop contextual embeddings before feeding the classification head."
  },
  {
    q: "Question 6: Why did you use BCEWithLogitsLoss instead of CrossEntropyLoss for node smell classification?",
    a: "CrossEntropyLoss applies a Softmax across classes, assuming classes are mutually exclusive (multi-class classification). In software architecture, anti-patterns frequently co-occur on the exact same node—for example, a centralized PostgreSQL instance with 1 replica accessed by 6 services is simultaneously a Shared Database Bottleneck and a Single Point of Failure (SPOF). Therefore, we formulated smell detection as a multi-label classification problem using BCEWithLogitsLoss, applying an independent Sigmoid activation per smell class."
  },
  {
    q: "Question 7: How does your system handle directed edges during message passing?",
    a: "Microservice call graphs are inherently directed (Caller → Callee). However, failure cascades travel upstream (if OrderDB fails, OrderService fails, which causes APIGateway to time out), whereas load travels downstream. In PyTorch Geometric, edge_index is stored in directed COO format [2, E]. To allow nodes to be aware of both incoming load (fan-in) and downstream failure dependencies (fan-out), we pass messages along directed edges and can augment the graph with reverse edges tagged with a directional flag in edge_attr."
  },
  {
    q: "Question 8: Why did you combine global_mean_pool and global_max_pool for the Graph-Level Risk Score?",
    a: "If a large architecture has 50 healthy microservices and 1 catastrophic SPOF database, global_mean_pool alone would average out the node embeddings across all 51 nodes, diluting the critical flaw and producing an overly optimistic health score. By concatenating global_mean_pool (which captures overall systemic coupling and average topology health) with global_max_pool (which isolates the most extreme bottleneck activation anywhere in the graph), the regression head accurately penalizes architectures containing isolated critical vulnerabilities."
  },
  {
    q: "Question 9: Why use a Polyglot Backend (Java Spring Boot + Python FastAPI) instead of writing everything in Python?",
    a: "This follows enterprise separation of concerns: (1) Java 21 + Spring Boot 3 provides type-safe enterprise orchestration, Spring Data JPA with PostgreSQL persistence, transactional integrity, and production-grade REST APIs. (2) Python 3.11/3.14 + FastAPI is the native ecosystem for PyTorch Geometric, NetworkX, and GPU tensor acceleration. Decoupling the ML engine into a stateless FastAPI microservice allows GPU/CPU inference workers to scale independently from the core web application."
  },
  {
    q: "Question 10: How does your Recommendation Engine calculate the 'Expected Impact' (e.g., Availability 59 → 84)?",
    a: "Rather than guessing impact numbers with static heuristics, we use Counterfactual Inference. When the system recommends a refactoring action—such as adding read-replicas (replication_factor: 1 → 3) or replacing synchronous REST edges with an asynchronous Kafka queue (sync_nature: 1 → 0)—the backend clones the PyG Data tensor in memory, applies those exact tensor modifications, and runs a forward pass through the trained GNN. The difference between the new predicted score and the original score gives a mathematically grounded impact estimate."
  },
  {
    q: "Question 11: What is the time and space complexity of your inference pipeline?",
    a: "Rule-Based Baseline (Tarjan's SCC & Articulation Points): O(V + E) time and O(V) auxiliary space. GNN Forward Pass (GraphSAGE + GATv2): For L layers, hidden dimension d, V nodes, and E edges, sparse message passing in PyTorch Geometric scales linearly with the number of edges: O(L · (V · d² + E · d)) time and O(L · V · d + E) memory. Because microservice architecture graphs typically have V ∈ [10, 500] and sparse edges, full inference executes in under 15 milliseconds on a standard CPU."
  },
  {
    q: "Question 12: What are the limitations of your current system, and how do Phases 8–10 address them?",
    a: "Manual YAML/JSON Input: Currently, architects must define or export the topology in JSON/YAML. Phase 8 adds a Vision-Language / Object Detection pipeline (YOLO / VLM) to parse whiteboard/AWS architecture diagrams directly into graph schemas. Static Load Estimates: traffic_weight and frequency are static estimates. Phase 10 introduces discrete-event cascading failure simulation (or OpenTelemetry trace ingestion) to model dynamic queue backpressure and retry storms over time."
  }
];

export default function VivaReport() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="space-y-6">
      {/* Mathematical Formulation Header */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <Cpu className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg font-bold text-gray-100">AI Model Mathematical Formulation & Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
            <h4 className="text-xs font-bold uppercase text-blue-400 mb-1">Layer 1: Inductive Aggregation</h4>
            <div className="text-xs font-mono text-gray-300">
              h<sub>v</sub><sup>(1)</sup> = σ(W<sub>1</sub> · [h<sub>v</sub><sup>(0)</sup> || MEAN(h<sub>u</sub><sup>(0)</sup>)])
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              GraphSAGE preserves node root identity via concatenation, ensuring database state is never diluted by stateless callers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
            <h4 className="text-xs font-bold uppercase text-purple-400 mb-1">Layers 2 & 3: Dynamic GATv2</h4>
            <div className="text-xs font-mono text-gray-300">
              e(u, v, e<sub>uv</sub>) = aᵀ LeakyReLU(W<sub>l</sub>h<sub>u</sub> + W<sub>r</sub>h<sub>v</sub> + W<sub>e</sub>e<sub>uv</sub>)
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Dynamic multi-head edge attention explicitly differentiates blocking synchronous REST from non-blocking AMQP events.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-950 border border-gray-800">
            <h4 className="text-xs font-bold uppercase text-emerald-400 mb-1">Multi-Task Readout & JK</h4>
            <div className="text-xs font-mono text-gray-300">
              h<sub>v</sub><sup>JK</sup> = ReLU(W<sub>JK</sub>[h<sub>v</sub><sup>(1)</sup> || h<sub>v</sub><sup>(2)</sup> || h<sub>v</sub><sup>(3)</sup>])
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Jumping Knowledge prevents over-smoothing while Global Mean + Max Pooling captures both average health and isolated SPOFs.
            </p>
          </div>
        </div>

        {/* Feature Dimension Specification */}
        <div className="p-4 rounded-xl bg-gray-950/70 border border-gray-800/80 text-xs">
          <h4 className="font-semibold text-gray-200 mb-2">Exact Tensor Feature Dimensions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
            <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800">
              <span className="font-bold text-blue-400">Node Feature Vector x<sub>i</sub> ∈ ℝ⁸:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-400">
                <li>0–4: One-hot node_type [Service, Database, Cache, Queue, Gateway]</li>
                <li>5: is_stateful ∈ &#123;0, 1&#125;</li>
                <li>6: replication_factor (normalized replicas / 5.0)</li>
                <li>7: traffic_weight (normalized RPS ∈ [0.0, 1.0])</li>
              </ul>
            </div>
            <div className="bg-gray-900 p-2.5 rounded-lg border border-gray-800">
              <span className="font-bold text-purple-400">Edge Feature Vector e<sub>ij</sub> ∈ ℝ⁶:</span>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-400">
                <li>0–3: One-hot protocol [REST, gRPC, AMQP, JDBC]</li>
                <li>4: sync_nature ∈ &#123;0, 1&#125; (1=sync, 0=async)</li>
                <li>5: frequency (normalized call volume ∈ [0.0, 1.0])</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Viva Q&A Accordion */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <HelpCircle className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="text-lg font-bold text-gray-100">Viva & Technical Defense Guide</h2>
            <p className="text-xs text-gray-400">Examiner questions & architectural justifications (12 Comprehensive Answers)</p>
          </div>
        </div>

        <div className="space-y-3">
          {VIVA_QUESTIONS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-gray-800 bg-gray-950/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full text-left p-4 flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-200 hover:text-blue-400 transition-colors"
                >
                  <span className="pr-4">{item.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-gray-850">
                    <p className="bg-gray-900/80 p-3.5 rounded-lg border border-gray-800">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
