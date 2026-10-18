import React from 'react';
import { AlertCircle, Zap, ShieldCheck, RefreshCw, ArrowUpRight, Flame } from 'lucide-react';

export default function SmellList({ smells = [], recommendations = [], onRefactor, isRefactoring }) {
  if (!smells || smells.length === 0) {
    return (
      <div className="rounded-2xl glass-surface border border-emerald-500/20 p-8 text-center shadow-2xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-gray-100">Zero Architectural Anti-Patterns</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
          Every microservice respects bounded context encapsulation with independent databases, asynchronous queue decoupling, and multi-replica failover.
        </p>
      </div>
    );
  }

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10',
          border: 'border-l-rose-500',
          icon: <Flame className="w-3.5 h-3.5 text-rose-400" />
        };
      case 'HIGH':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10',
          border: 'border-l-amber-500',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        };
      default:
        return {
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/10',
          border: 'border-l-blue-500',
          icon: <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
        };
    }
  };

  return (
    <div className="rounded-2xl glass-surface border border-white/[0.08] p-5 shadow-2xl">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Vulnerability Engine</span>
          <h3 className="text-sm font-bold text-gray-100">
            Detected Architectural Anti-Patterns ({smells.length})
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            {smells.filter(s => s.severity === 'CRITICAL').length} Critical Risk
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
        {smells.map((smell, idx) => {
          const style = getSeverityStyle(smell.severity);
          const rec = recommendations.find(r => r.node_id === smell.node_id);

          return (
            <div
              key={`smell-${idx}`}
              className={`p-4 rounded-xl bg-gray-950/60 border border-white/[0.06] border-l-4 ${style.border} hover:border-white/[0.15] transition-all duration-200 shadow-md`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase shadow-sm ${style.badge}`}>
                    {style.icon}
                    <span>{smell.severity}</span>
                  </span>
                  <span className="text-xs font-bold text-gray-100 tracking-wide">
                    {smell.smell_name.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-gray-900 border border-white/[0.06]">
                  <span className="text-[10px] text-gray-400 font-mono">GNN Prob:</span>
                  <span className="text-[11px] font-mono font-bold text-cyan-400">
                    {(smell.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-300 flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Target Component:</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-[11px]">
                  {smell.node_label || `Node #${smell.node_id}`}
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                {smell.description}
              </p>

              {/* Remediation & Action Strip */}
              <div className="mt-3 p-3 rounded-lg bg-gray-900/90 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-gray-300">
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">Recommended Mutation: </span>
                  <span>{smell.suggested_action}</span>
                </div>

                {rec && (
                  <button
                    disabled={isRefactoring}
                    onClick={() => onRefactor(rec)}
                    className="flex-shrink-0 inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                  >
                    {isRefactoring ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3 text-amber-300" />
                    )}
                    <span>⚡ Simulate Refactoring</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
