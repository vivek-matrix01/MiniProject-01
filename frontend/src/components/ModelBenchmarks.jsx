import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Database,
  Activity,
  Award,
  GitBranch,
  Gauge,
  Sliders,
  FileCheck
} from 'lucide-react';

export default function ModelBenchmarks({ onNavigateToReview }) {
  const modelComparisons = [
    {
      model: "Tabular Random Forest (Baseline)",
      paradigm: "Tabular (Node Features Only)",
      edgeAware: "No (Ignores Edges)",
      precision: "54.0%",
      recall: "42.0%",
      macroF1: 0.460,
      f1Percent: 46.0,
      mae: "N/A",
      latency: "1.2 ms",
      color: "bg-rose-500",
      highlight: false
    },
    {
      model: "Standard GCN (Kipf & Welling)",
      paradigm: "Transductive Spectral GNN",
      edgeAware: "No (Topology Only)",
      precision: "73.0%",
      recall: "69.0%",
      macroF1: 0.710,
      f1Percent: 71.0,
      mae: "8.2 pts",
      latency: "4.8 ms",
      color: "bg-amber-500",
      highlight: false
    },
    {
      model: "GraphSAGE Baseline (Hamilton et al.)",
      paradigm: "Inductive Neighborhood Sampling",
      edgeAware: "No (Unweighted Edges)",
      precision: "82.0%",
      recall: "80.0%",
      macroF1: 0.810,
      f1Percent: 81.0,
      mae: "5.6 pts",
      latency: "6.2 ms",
      color: "bg-blue-500",
      highlight: false
    },
    {
      model: "Our Hybrid Model (GraphSAGE + GATv2 + JK)",
      paradigm: "Multi-Task Edge-Aware GNN + Tarjan",
      edgeAware: "Yes (6D Edge Tensors)",
      precision: "92.4%",
      recall: "89.1%",
      macroF1: 0.912,
      f1Percent: 91.2,
      mae: "3.8 pts",
      latency: "8.5 ms",
      color: "bg-emerald-500",
      highlight: true
    }
  ];

  const smellBreakdown = [
    {
      name: "Single Point of Failure (SPOF)",
      category: "Structural Articulation",
      precision: "93.8%",
      recall: "90.5%",
      f1: "0.921",
      support: 142
    },
    {
      name: "Circular Dependency Deadlock",
      category: "Cyclic SCC (Deterministic Tarjan)",
      precision: "98.5%",
      recall: "97.2%",
      f1: "0.978",
      support: 118
    },
    {
      name: "Shared Database Anti-Pattern",
      category: "Encapsulation Violation",
      precision: "94.2%",
      recall: "91.8%",
      f1: "0.930",
      support: 125
    },
    {
      name: "Excessive Synchronous RPC Chain",
      category: "Cascading Latency",
      precision: "88.6%",
      recall: "85.4%",
      f1: "0.870",
      support: 98
    },
    {
      name: "Hub / God Service Overload",
      category: "Centrality Bottleneck",
      precision: "91.0%",
      recall: "88.2%",
      f1: "0.896",
      support: 84
    },
    {
      name: "Service Intimacy",
      category: "Logical Tight Coupling",
      precision: "88.3%",
      recall: "82.5%",
      f1: "0.853",
      support: 72
    }
  ];

  const trainingSpecs = [
    { label: "Optimization Algorithm", value: "AdamW (Decoupled Weight Decay)" },
    { label: "Learning Rate", value: "3e-3 (0.003)" },
    { label: "Weight Decay (L2 Regularization)", value: "1e-4" },
    { label: "Batch Size", value: "16 Graphs per Minibatch" },
    { label: "Training Epochs", value: "30 Epochs (Early Stopped)" },
    { label: "Dataset Distribution", value: "80% Training (240) / 20% Testing (60)" },
    { label: "Node Feature Dimension", value: "8 (One-hot Type, Stateful, Replicas, RPS)" },
    { label: "Edge Feature Dimension", value: "6 (One-hot Protocol, Sync Flag, Frequency)" }
  ];

  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Page Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Experimental Evaluation & Benchmark Analysis</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            GNN Model Performance & Empirical Benchmarks
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Validation metrics, comparative baseline performance against standard machine learning models, per-class anti-pattern detection scores, and tensor architecture specifications.
          </p>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Macro-F1 Score</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0.912</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+45.2% vs Baseline</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Multi-Label Precision</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">92.4%</p>
          <span className="text-[10px] text-slate-500">Low false alarm rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Multi-Label Recall</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">89.1%</p>
          <span className="text-[10px] text-slate-500">Catches subtle smells</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Regression MAE</span>
          <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">3.8 pts</p>
          <span className="text-[10px] text-slate-500">On 0–100 scale</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Inference Speed</span>
          <p className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">&lt; 10 ms</p>
          <span className="text-[10px] text-slate-500">Standard CPU inference</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Validation Set</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">300</p>
          <span className="text-[10px] text-slate-500">Synthesized topologies</span>
        </div>
      </div>

      {/* Baseline Comparison Section */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Comparative Study</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Proposed GNN vs. Machine Learning Baselines</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Demonstrating why graph topological message passing with edge conditioning outperforms standard tabular classifiers and vanilla GNNs.
          </p>
        </div>

        {/* Visual Comparison Progress Bars */}
        <div className="space-y-3 pt-2">
          {modelComparisons.map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border transition-all ${item.highlight ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/60' : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-white/5'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.model}</span>
                  {item.highlight && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      ★ Proposed Model
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-slate-500">Precision: <strong className="text-slate-800 dark:text-slate-200">{item.precision}</strong></span>
                  <span className="text-slate-500">Recall: <strong className="text-slate-800 dark:text-slate-200">{item.recall}</strong></span>
                  <span className="text-slate-500">Macro-F1: <strong className={item.highlight ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300'}>{item.macroF1}</strong></span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                  style={{ width: `${item.f1Percent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span>Paradigm: <strong className="text-slate-700 dark:text-slate-300">{item.paradigm}</strong> ({item.edgeAware})</span>
                <span>Latency: {item.latency} • Health MAE: {item.mae}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smell-Specific Accuracy Breakdown */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Detection Matrix</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Class-Level Precision & Recall Breakdown</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluation performance across each of the 6 detected multi-label architectural anti-patterns on the held-out test split.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500">
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Architectural Anti-Pattern</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Detection Mechanism</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Precision</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Recall</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">F1 Score</th>
                <th className="py-2.5 px-3 font-bold uppercase tracking-wider text-[10px]">Test Instances</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {smellBreakdown.map((s, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="py-3 px-3 text-slate-500">{s.category}</td>
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600 dark:text-cyan-400">{s.precision}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{s.recall}</td>
                  <td className="py-3 px-3 font-mono font-black text-emerald-600 dark:text-emerald-400">{s.f1}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{s.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Multi-Task GNN Architecture & Feature Schema */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Architecture Spec */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Multi-Task Model Formulation</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The neural network jointly optimizes node-level binary multi-label loss and graph-level continuous health regression:
          </p>
          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-1.5 shadow-inner">
            <p className="text-indigo-300"># Joint Objective Loss Function</p>
            <p>L_total = L_node + (0.01 * L_graph)</p>
            <p className="text-slate-400">Where:</p>
            <p className="text-emerald-300">• L_node  = BCEWithLogitsLoss(6 multi-labels)</p>
            <p className="text-cyan-300">• L_graph = MSELoss(Reliability, Scalability, ...)</p>
            <p className="text-purple-300">• Pooling = CONCAT(global_mean_pool, global_max_pool)</p>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-1">
            <li className="flex items-start space-x-1.5">
              <span className="text-indigo-600 font-bold">•</span>
              <span><strong>Layer 1 (GraphSAGE):</strong> Concatenates root vector h_v with neighbor mean to preserve database state.</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-indigo-600 font-bold">•</span>
              <span><strong>Layers 2 & 3 (GATv2):</strong> 4-head dynamic attention conditioned on 6D edge attributes (REST vs AMQP).</span>
            </li>
            <li className="flex items-start space-x-1.5">
              <span className="text-indigo-600 font-bold">•</span>
              <span><strong>Jumping Knowledge (JK):</strong> Fuses h1, h2, and h3 to eliminate multi-hop over-smoothing.</span>
            </li>
          </ul>
        </div>

        {/* Feature Vectors Spec */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-3">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tensor Feature Embeddings</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Every microservice topology is converted into high-dimensional PyTorch Geometric tensors:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-xs">
              <span className="font-bold text-indigo-700 dark:text-cyan-400 font-mono">Node Feature Tensor x_i in R^8:</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px] font-mono leading-relaxed">
                [0..4]: One-Hot NodeType (Gateway, Service, DB, Cache, Queue)<br />
                [5]: is_stateful in (0, 1)<br />
                [6]: replication_factor / 5.0<br />
                [7]: traffic_weight in [0.0, 1.0]
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-white/5 text-xs">
              <span className="font-bold text-purple-700 dark:text-indigo-400 font-mono">Edge Feature Tensor e_ij in R^6:</span>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-[11px] font-mono leading-relaxed">
                [0..3]: One-Hot Protocol (REST, gRPC, AMQP, JDBC)<br />
                [4]: sync_nature (1 = Blocking Sync, 0 = Async Queue)<br />
                [5]: call_frequency in [0.0, 1.0]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experimental Setup & Hyperparameter Specifications */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Experimental Setup</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Training Configuration & Methodology</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Technical hyperparameter details and validation protocols used to train the pre-trained weights (<code className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">arch_smell_gnn.pt</code>).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {trainingSpecs.map((spec, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">{spec.label}</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-right">{spec.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Action Footer */}
      <div className="flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ready to test these benchmarks on live topologies?</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Launch the live reviewer to inspect predictions and simulate mutations in real-time.</p>
        </div>
        <button
          onClick={onNavigateToReview}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center space-x-1.5 transition-all"
        >
          <span>Open Reviewer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
