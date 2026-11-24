import React from 'react';
import { Activity, ShieldAlert, Cpu, GitFork, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function HealthRadar({ scores, inferenceTimeMs, engineName, isDark = false }) {
  if (!scores) return null;

  const overall = scores.overall_score || 0;

  // Grade calculation
  const getGrade = (val) => {
    if (val >= 85) return { grade: 'GRADE A', label: 'Resilient Microservice Topology', color: 'text-emerald-700 dark:text-emerald-400', stroke: '#10B981', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' };
    if (val >= 70) return { grade: 'GRADE B', label: 'Stable with Moderate Coupling', color: 'text-cyan-700 dark:text-cyan-400', stroke: '#06B6D4', bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30' };
    if (val >= 55) return { grade: 'GRADE C', label: 'Bottlenecks Require Attention', color: 'text-amber-700 dark:text-amber-400', stroke: '#F59E0B', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30' };
    return { grade: 'GRADE F', label: 'Critical Architectural Anti-Patterns', color: 'text-rose-700 dark:text-rose-400', stroke: '#F43F5E', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30' };
  };

  const gradeInfo = getGrade(overall);

  // SVG Radial Gauge Calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, overall)) / 100) * circumference;

  const metrics = [
    {
      label: 'Reliability',
      value: scores.reliability_score || 0,
      icon: <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      color: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      desc: 'SPOF & sync cascade mitigation'
    },
    {
      label: 'Scalability',
      value: scores.scalability_score || 0,
      icon: <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      desc: 'Shared DB & queue buffer headroom'
    },
    {
      label: 'Coupling',
      value: scores.coupling_score || 0,
      icon: <GitFork className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
      color: 'from-cyan-500 to-teal-500',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      desc: 'Tarjan SCC cycle & domain independence'
    },
    {
      label: 'Availability',
      value: scores.availability_score || 0,
      icon: <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      color: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      desc: 'Replication factor & failover posture'
    },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-blue-400">Telemetry Engine</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Architectural Health Index</h3>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-blue-500/10 border border-indigo-200 dark:border-blue-500/20 text-[11px] font-mono text-indigo-700 dark:text-blue-300 font-bold">
          <Sparkles className="w-3 h-3 text-indigo-500 dark:text-cyan-400 animate-spin" />
          <span>{inferenceTimeMs ? `${inferenceTimeMs} ms` : '< 10 ms'}</span>
        </div>
      </div>

      {/* Radial Gauge & Grade Showcase */}
      <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
        <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={isDark ? "#1E293B" : "#E2E8F0"}
              strokeWidth="10"
            />
            {/* Animated Progress Arc */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={gradeInfo.stroke}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">{overall}</span>
            <span className="text-[9px] font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-widest">/ 100</span>
          </div>
        </div>

        <div className="pl-4 flex-1">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border ${gradeInfo.bg} ${gradeInfo.color}`}>
              {gradeInfo.grade}
            </span>
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-gray-200 mt-1">{gradeInfo.label}</h4>
          <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 leading-snug">
            {overall >= 75
              ? 'Multi-hop GraphSAGE inductive pass confirmed balanced fan-out with high fault tolerance.'
              : 'GATv2 dynamic attention detected excessive blocking synchronous dependencies or un-replicated state.'}
          </p>
        </div>
      </div>

      {/* 4 Continuous Regression Sub-Score Telemetry Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map(m => (
          <div key={m.label} className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5">
                {m.icon}
                <span className="text-xs font-bold text-slate-700 dark:text-gray-200">{m.label}</span>
              </div>
              <span className={`text-xs font-mono font-bold ${m.textColor}`}>{m.value}</span>
            </div>
            {/* Gradient progress bar */}
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700`}
                style={{ width: `${Math.min(100, Math.max(0, m.value))}%` }}
              />
            </div>
            <p className="mt-1.5 text-[9px] text-slate-500 dark:text-gray-500 leading-tight truncate">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
