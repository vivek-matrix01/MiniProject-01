import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Activity,
  GitFork,
  Database,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  Search,
  Zap,
  Server,
  Inbox,
  HardDrive,
  Flame,
  Code2,
  FileText,
  Boxes,
  Compass,
  TrendingUp,
  Workflow,
  Check
} from 'lucide-react';

export default function HomePage({ onSelectTemplate, onNavigateToReview, onNavigateToStudio, benchmarkTemplates }) {
  const features = [
    {
      title: "Automated Architectural Smell Detection",
      badge: "Zero False Negatives",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
      icon: <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      description: "Instantly uncovers catastrophic architectural anti-patterns including Single Points of Failure (SPOF), cyclic deadlocks via Tarjan SCC, shared database bottlenecks, hub services, and synchronous blocking cascades.",
      details: [
        "Hopcroft-Tarjan Articulation Points for structural SPOF",
        "Tarjan's Strongly Connected Components (O(V+E)) for circular cycles",
        "Multi-service shared database violation detection",
        "Synchronous RPC cascade and Service Intimacy flags"
      ]
    },
    {
      title: "Hybrid Neuro-Symbolic GNN Engine",
      badge: "GraphSAGE + GATv2",
      badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
      icon: <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      description: "Combines mathematically rigorous deterministic graph theory with edge-conditioned dynamic graph attention to evaluate continuous resilience and multi-hop dependency degradation.",
      details: [
        "Inductive GraphSAGE layer preserves node-root identity",
        "Edge-conditioned dynamic attention distinguishes sync REST vs async queues",
        "Jumping Knowledge (JK) network mitigates multi-hop over-smoothing",
        "Blazing fast < 5ms PyTorch Geometric tensor inference"
      ]
    },
    {
      title: "Continuous 4-Pillar Health Radar",
      badge: "Quantified Metrics",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
      icon: <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      description: "Replaces vague subjective code reviews with continuous 0-100 resilience scoring across four fundamental microservice dimensions, complete with automated Grade A-F certifications.",
      details: [
        "Reliability: SPOF blast-radius and cascade mitigation",
        "Scalability: Shared DB limits and queue buffer capacity",
        "Coupling: Tarjan cyclic independence & domain boundaries",
        "Availability: Cluster replication factor & quorum failover"
      ]
    },
    {
      title: "Prescriptive Counterfactual Refactoring",
      badge: "ΔScore Mutation Operator",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
      icon: <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      description: "Doesn't just identify bugs—prescribes verified solutions. Simulates in-memory graph mutation operators Tc(G) to prove quantitative score improvements before writing a single line of code.",
      details: [
        "Simulates replica scale-up, cache insertion & async decoupling",
        "Immediate delta score calculation (ΔScore = y'(G') - y(G))",
        "Forward pass simulated in under 5ms",
        "1-Click 'Apply Refactoring' updates the active topology live"
      ]
    },
    {
      title: "1-Click GitHub Repository Scanner",
      badge: "Automated Ingestion",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
      icon: <Workflow className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />,
      description: "Ingests public GitHub repositories, scanning docker-compose.yml files, service manifests, and project modules to formulate dynamic directed multigraph tensors automatically.",
      details: [
        "Auto-classifies Gateways, Microservices, Databases, Caches & Queues",
        "Infers sync REST vs async AMQP inter-service edges",
        "Pre-bundled with PetClinic, Google Cloud Demo, and PiggyMetrics",
        "Fallback live heuristic tensor synthesizer if offline"
      ]
    },
    {
      title: "Interactive Topology Canvas & Studio",
      badge: "Visual DAG Editor",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
      icon: <Code2 className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      description: "Explore microservice layouts across 3 distinct architectural tiers with animated traffic flows, live node inspection, traffic weight sliders, and raw JSON descriptor validation.",
      details: [
        "Three distinct architectural tiers: Ingress, Domain Services, Data/Events",
        "Animated flowing particle edges with sync/async visual differentiation",
        "Real-time telemetry inspector for individual microservice nodes",
        "Raw JSON Graph Studio for custom architecture modeling"
      ]
    }
  ];

  const smellsCatalog = [
    {
      name: "Single Point of Failure (SPOF)",
      severity: "CRITICAL",
      sevColor: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300",
      detection: "Hopcroft-Tarjan Articulation Points & Replica Count = 1",
      impact: "If the node crashes, downstream services are partitioned and become unreachable.",
      remedy: "Increase replication factor (≥ 3) with multi-zone automated failover."
    },
    {
      name: "Circular Dependency Deadlock",
      severity: "CRITICAL",
      sevColor: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300",
      detection: "Tarjan's Strongly Connected Components (SCC) with |SCC| > 1",
      impact: "High latency lockup, recursive deadlocks, and impossible independent deployments.",
      remedy: "Decouple directed cycles with an asynchronous event broker (Kafka / RabbitMQ)."
    },
    {
      name: "Shared Database Anti-Pattern",
      severity: "HIGH",
      sevColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
      detection: "Stateful Database node with in-degree ≥ 2 across different services",
      impact: "Breaks microservice bounded context encapsulation, creates schema lock-in and connection contention.",
      remedy: "Adopt Database-per-Service pattern or introduce event-driven data replication."
    },
    {
      name: "Hub (God Service) Dependency",
      severity: "HIGH",
      sevColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
      detection: "Service with high degree centrality and out-degree ≥ 4 synchronous connections",
      impact: "High blast radius; any downstream slowdown halts the entire central orchestrator.",
      remedy: "Decompose into choreographer sagas or introduce a distributed caching layer."
    },
    {
      name: "Excessive Synchronous RPC Chain",
      severity: "MEDIUM",
      sevColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      detection: "Synchronous REST/gRPC paths exceeding hop length threshold ≥ 3",
      impact: "Compounding network latency, thread starvation, and cascading timeout failures.",
      remedy: "Transition long call sequences to asynchronous pub/sub messaging."
    },
    {
      name: "Service Intimacy",
      severity: "MEDIUM",
      sevColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      detection: "Unbalanced bidirectional traffic frequency between a pair of microservices",
      impact: "Indicates tight logical coupling that defeats the purpose of separate microservices.",
      remedy: "Merge into a unified bounded context or refactor shared contracts."
    }
  ];

  return (
    <div className="space-y-12 pb-12 animate-fadeIn">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 dark:from-slate-900 dark:via-slate-900/80 dark:to-indigo-950/30 border border-slate-200/80 dark:border-white/10 p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
        {/* Decorative background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            <span>Hybrid Neuro-Symbolic Graph Neural Network Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Autonomous System Design Reviewer{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              & Architecture Optimizer
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Evaluate distributed microservice topologies for catastrophic architectural anti-patterns, calculate continuous resilience sub-scores, and generate prescriptive counterfactual refactorings with mathematically proven <span className="font-semibold text-slate-900 dark:text-white">ΔScore</span> improvements.
          </p>

          {/* Key CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onNavigateToReview}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Live Architecture Reviewer</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onNavigateToStudio}
              className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-slate-700 shadow-sm flex items-center space-x-2 transition-all"
            >
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>Open Topology Studio</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/70 dark:border-white/10 text-left">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inference Speed</span>
              <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">&lt; 5 ms</p>
              <span className="text-[10px] text-slate-500">PyTorch Geometric GNN</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Anti-Pattern Detection</span>
              <p className="text-xl font-extrabold text-rose-600 dark:text-rose-400 mt-0.5">6 Smells</p>
              <span className="text-[10px] text-slate-500">Multi-label classification</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cycle Detection</span>
              <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">O(V + E)</p>
              <span className="text-[10px] text-slate-500">Tarjan Deterministic DFS</span>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Health Evaluation</span>
              <p className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">4 Pillars</p>
              <span className="text-[10px] text-slate-500">Continuous 0-100 radar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workflow Pipeline */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">End-to-End Pipeline</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">How ArchSense AI Works</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            From raw repository manifests to mathematically verified counterfactual graph refactorings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: "01",
              title: "Topology Ingestion",
              desc: "Parses public GitHub repos, Docker Compose files, or raw JSON descriptors into directed multigraph tensors.",
              icon: <Boxes className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            },
            {
              step: "02",
              title: "Hybrid Neuro-Symbolic Analysis",
              desc: "Combines Tarjan's SCC and Hopcroft articulation points with GraphSAGE and edge-conditioned GATv2 attention.",
              icon: <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            },
            {
              step: "03",
              title: "Health Radar & Smell Feed",
              desc: "Generates continuous 0-100 scores for Reliability, Scalability, Coupling & Availability with actionable root-cause smells.",
              icon: <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            },
            {
              step: "04",
              title: "Counterfactual Refactoring",
              desc: "Applies mutation operators Tc(G) in memory, calculating immediate ΔScore lift before any code changes are deployed.",
              icon: <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            }
          ].map((item, idx) => (
            <div key={idx} className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-500/25 dark:text-indigo-400/25 font-mono">{item.step}</span>
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Features Grid */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Core Capabilities</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Important Architecture Features</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Explore the key capabilities that differentiate ArchSense AI from conventional static linters.
            </p>
          </div>
          <button
            onClick={onNavigateToReview}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center space-x-1"
          >
            <span>Try these in the Reviewer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {f.icon}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${f.badgeColor}`}>
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{f.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 space-y-1.5">
                {f.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Architectural Smells / Anti-Patterns Matrix */}
      <section className="space-y-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 p-6 sm:p-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Detection Matrix</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">6 Multi-Label Architectural Smells</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ArchSense AI flags fine-grained architectural anti-patterns with exact severity, detection algorithms, and automated refactoring remedies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {smellsCatalog.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</h4>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.sevColor}`}>
                  {s.severity}
                </span>
              </div>
              <div className="text-[11px] space-y-1">
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-slate-100">Detection:</strong> {s.detection}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-300">Hazard:</strong> {s.impact}
                </p>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                  <strong>Remedy:</strong> {s.remedy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ready-to-Test Benchmark Topologies */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Instant Hands-On Demos</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Launch Benchmark Topologies</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any pre-configured enterprise topology to inspect anti-patterns and run counterfactual mutations immediately.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benchmarkTemplates.map((tmpl, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{tmpl.name}</h3>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tmpl.nodes.length} Nodes • {tmpl.edges.length} Links
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {tmpl.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                  <Server className="w-3.5 h-3.5 text-blue-500" />
                  <span>{tmpl.nodes.filter(n => n.node_type === 'Service').length} Services</span>
                  <span>•</span>
                  <Database className="w-3.5 h-3.5 text-amber-500" />
                  <span>{tmpl.nodes.filter(n => n.node_type === 'Database').length} DBs</span>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onNavigateToReview();
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <span>Review Topology</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Polyglot Architecture & Defense Reference */}
      <section className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Polyglot Enterprise Architecture & Examiner Defense</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Built on Java 21 Spring Boot 3 enterprise tier (:8080), Python FastAPI PyTorch Geometric engine (:8000), PostgreSQL 16 (:5432), and React 18 (:5173).
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateToReview}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold transition-colors"
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
