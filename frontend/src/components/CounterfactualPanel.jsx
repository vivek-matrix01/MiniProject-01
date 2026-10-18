import React from 'react';
import { TrendingUp, X, CheckCircle2, ArrowRight, Sparkles, Cpu } from 'lucide-react';

export default function CounterfactualPanel({ result, onClose, onApplyToCanvas }) {
  if (!result) return null;

  const { original_scores, refactored_scores, score_deltas, summary, applied_mutation } = result;
  const metrics = ['Overall', 'Reliability', 'Scalability', 'Coupling', 'Availability'];

  return (
    <div className="relative rounded-2xl glass-surface border border-blue-500/40 p-6 shadow-2xl overflow-hidden animate-fadeIn">
      {/* Background ambient accent */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Prescriptive Refactoring Engine</span>
              <h3 className="text-sm font-bold text-gray-100">Counterfactual Tensor Mutation Studio</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-900 border border-white/[0.06] hover:bg-gray-800 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mutation Operator Summary */}
        <div className="my-4 p-3.5 rounded-xl bg-gray-950/80 border border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-xs text-gray-200 font-medium">
              <strong className="text-blue-400 font-mono">T_c(G):</strong> {applied_mutation?.description || summary}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Forward Pass: &lt; 5 ms
          </span>
        </div>

        {/* Delta Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-4">
          {metrics.map((k) => {
            const orig = original_scores?.[k] || 0;
            const ref = refactored_scores?.[k] || 0;
            const delta = score_deltas?.[k] || 0;
            const isPositive = delta > 0;

            return (
              <div
                key={k}
                className="p-3 rounded-xl bg-gray-950/70 border border-white/[0.06] text-center hover:border-blue-500/30 transition-all"
              >
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{k}</span>
                <div className="flex items-center justify-center space-x-1.5 my-1.5 font-mono">
                  <span className="text-xs text-gray-500">{orig}</span>
                  <ArrowRight className="w-3 h-3 text-gray-600" />
                  <span className="text-sm font-bold text-gray-100">{ref}</span>
                </div>
                <span className={`inline-flex items-center text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                  isPositive ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-500/30' : 'text-gray-400 bg-gray-900'
                }`}>
                  {isPositive ? `+${delta}` : delta} pts
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <p className="text-xs text-gray-400">
            Quantified delta score calculated via in-memory tensor perturbation with zero retraining.
          </p>

          {onApplyToCanvas && (
            <button
              onClick={onApplyToCanvas}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Refactoring to Active Canvas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
