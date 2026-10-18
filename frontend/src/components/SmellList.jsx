import React from 'react';
import { AlertCircle, Zap, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function SmellList({ smells = [], recommendations = [], onRefactor, isRefactoring }) {
  if (!smells || smells.length === 0) {
    return (
      <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-gray-200">Zero Anti-Patterns Detected</h4>
        <p className="text-xs text-gray-400 mt-1">This architecture graph complies with clean distributed systems best practices.</p>
      </div>
    );
  }

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Detected Architectural Smells ({smells.length})
          </h3>
          <p className="text-xs text-gray-500">Multi-label node classification via GraphSAGE + GATv2</p>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
          {smells.filter(s => s.severity === 'CRITICAL').length} Critical
        </span>
      </div>

      <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
        {smells.map((smell, idx) => {
          // Find matching recommendation
          const rec = recommendations.find(r => r.node_id === smell.node_id);

          return (
            <div
              key={`smell-${idx}`}
              className="p-3.5 rounded-xl bg-gray-950/70 border border-gray-800 hover:border-gray-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getSeverityBadge(smell.severity)}`}>
                    {smell.severity}
                  </span>
                  <span className="text-xs font-bold text-gray-100">{smell.smell_name.replace(/_/g, ' ')}</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  {(smell.confidence * 100).toFixed(1)}% Conf
                </span>
              </div>

              <div className="mt-2 text-xs text-gray-300">
                <span className="font-semibold text-gray-400">Target:</span> {smell.node_label || `Node #${smell.node_id}`}
              </div>

              <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                {smell.description}
              </p>

              <div className="mt-2.5 p-2 rounded-lg bg-gray-900 border border-gray-800/80 flex items-center justify-between">
                <div className="text-[11px] text-gray-300 pr-2">
                  <span className="text-emerald-400 font-semibold">Remedy:</span> {smell.suggested_action}
                </div>

                {rec && (
                  <button
                    disabled={isRefactoring}
                    onClick={() => onRefactor(rec)}
                    className="flex-shrink-0 inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[11px] font-medium transition-colors shadow"
                  >
                    {isRefactoring ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Zap className="w-3 h-3 text-amber-300" />
                    )}
                    <span>Refactor</span>
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
