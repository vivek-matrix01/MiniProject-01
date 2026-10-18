import React from 'react';
import { Activity, ShieldAlert, Cpu, GitFork, CheckCircle2 } from 'lucide-react';

export default function HealthRadar({ scores, inferenceTimeMs, engineName }) {
  if (!scores) return null;

  const getScoreColor = (val) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getBarColor = (val) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const metrics = [
    { label: 'Reliability', value: scores.reliability_score || 0, icon: <ShieldAlert className="w-4 h-4 text-blue-400" />, desc: 'SPOF & sync chain fault tolerance' },
    { label: 'Scalability', value: scores.scalability_score || 0, icon: <Cpu className="w-4 h-4 text-purple-400" />, desc: 'Bottleneck & throughput headroom' },
    { label: 'Coupling', value: scores.coupling_score || 0, icon: <GitFork className="w-4 h-4 text-cyan-400" />, desc: 'Decoupling & bounded contexts' },
    { label: 'Availability', value: scores.availability_score || 0, icon: <Activity className="w-4 h-4 text-emerald-400" />, desc: 'Uptime & failover protection' },
  ];

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Architecture Health Index</h3>
          <p className="text-xs text-gray-500">{engineName || 'Hybrid Neuro-Symbolic GNN'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Inference:</span>
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
            {inferenceTimeMs ? `${inferenceTimeMs} ms` : '< 15 ms'}
          </span>
        </div>
      </div>

      {/* Overall Score Highlight */}
      <div className="my-5 flex items-center justify-between p-4 rounded-xl bg-gray-950/60 border border-gray-800">
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center font-bold text-2xl ${getScoreColor(scores.overall_score)}`}>
            {scores.overall_score || 0}
            <span className="text-[9px] uppercase tracking-wider text-gray-400">Score</span>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-200">System Architecture Rating</h4>
            <p className="text-xs text-gray-400">
              {scores.overall_score >= 80 ? 'Production Grade: Resilient microservice topology' :
               scores.overall_score >= 60 ? 'Moderate Risk: Multiple anti-patterns require refactoring' :
               'High Architectural Risk: Critical bottlenecks & SPOFs detected'}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Score Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-3 rounded-xl bg-gray-950/40 border border-gray-850">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                {m.icon}
                <span className="text-xs font-semibold text-gray-200">{m.label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-gray-300">{m.value} / 100</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(m.value)}`}
                style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] text-gray-500">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
