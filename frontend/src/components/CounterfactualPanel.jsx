import React from 'react';
import { TrendingUp, X, CheckCircle2, ArrowRight, Sparkles, Cpu } from 'lucide-react';

export default function CounterfactualPanel({ result, onClose, onApplyToCanvas }) {
  if (!result) return null;

  const { original_scores, refactored_scores, score_deltas, summary, applied_mutation } = result;
  const metrics = ['Overall', 'Reliability', 'Scalability', 'Coupling', 'Availability'];

  return (
    <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-indigo-300 dark:border-blue-500/40 p-6 shadow-xl shadow-indigo-100/50 dark:shadow-2xl overflow-hidden animate-fadeIn">
      {/* Background ambient accent */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">Prescriptive Refactoring Engine</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Counterfactual Tensor Mutation Studio</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-gray-800 text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mutation Operator Summary */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-50 dark:bg-gray-950/80 border border-indigo-200 dark:border-blue-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs text-slate-800 dark:text-gray-200 font-medium">
              <strong className="text-indigo-600 dark:text-blue-400 font-mono">T_c(G):</strong> {applied_mutation?.description || summary}
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
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
                className="p-3 rounded-xl bg-white dark:bg-gray-950/70 border border-slate-200 dark:border-white/10 text-center hover:border-indigo-400 dark:hover:border-blue-500/30 shadow-sm transition-all"
              >
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400 tracking-wider">{k}</span>
                <div className="flex items-center justify-center space-x-1.5 my-1.5 font-mono">
                  <span className="text-xs text-slate-400 dark:text-gray-500">{orig}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400 dark:text-gray-600" />
                  <span className="text-sm font-bold text-slate-900 dark:text-gray-100">{ref}</span>
                </div>
                <span className={`inline-flex items-center text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                  isPositive ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/20 dark:border-emerald-500/30' : 'text-slate-500 bg-slate-100 dark:text-gray-400 dark:bg-gray-900'
                }`}>
                  {isPositive ? `+${delta}` : delta} pts
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-white/10">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Quantified delta score calculated via in-memory tensor perturbation with zero retraining.
          </p>

          {onApplyToCanvas && (
            <button
              onClick={onApplyToCanvas}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-emerald-600 dark:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2"
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
