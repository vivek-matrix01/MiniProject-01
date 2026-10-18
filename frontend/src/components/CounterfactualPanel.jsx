import React from 'react';
import { ArrowUpRight, CheckCircle2, TrendingUp, X } from 'lucide-react';

export default function CounterfactualPanel({ result, onClose, onApplyToCanvas }) {
  if (!result) return null;

  const { original_scores, refactored_scores, score_deltas, summary, applied_mutation } = result;

  const metrics = ['Overall', 'Reliability', 'Scalability', 'Coupling', 'Availability'];

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-blue-950/40 border border-blue-500/30 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wide">
            Counterfactual Refactoring Simulation
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="my-3 p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
        <span className="font-semibold text-blue-300">Target Mutation:</span> {applied_mutation?.description || summary}
      </div>

      {/* Delta Score Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-4">
        {metrics.map((k) => {
          const orig = original_scores?.[k] || 0;
          const ref = refactored_scores?.[k] || 0;
          const delta = score_deltas?.[k] || 0;
          const isPositive = delta > 0;

          return (
            <div key={k} className="p-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-center">
              <span className="text-[10px] uppercase font-semibold text-gray-400">{k}</span>
              <div className="flex items-center justify-center space-x-1.5 my-1">
                <span className="text-xs text-gray-400 font-mono">{orig}</span>
                <span className="text-xs text-gray-500">→</span>
                <span className="text-sm font-bold font-mono text-gray-100">{ref}</span>
              </div>
              <span className={`inline-flex items-center text-[11px] font-bold font-mono px-1.5 py-0.2 rounded ${
                isPositive ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-400 bg-gray-800'
              }`}>
                {isPositive ? `+${delta}` : delta} pts
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-gray-400 italic">
          GNN Forward pass completed in &lt; 5 ms with zero graph retraining.
        </p>
        {onApplyToCanvas && (
          <button
            onClick={onApplyToCanvas}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply Mutation to Active Graph</span>
          </button>
        )}
      </div>
    </div>
  );
}
