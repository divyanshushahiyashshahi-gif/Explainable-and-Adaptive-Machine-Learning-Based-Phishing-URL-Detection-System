import React from 'react';
import { Sliders, HelpCircle, RefreshCw, Award, Activity } from 'lucide-react';

export default function DashboardStats() {
  const stats = [
    {
      id: 'features',
      value: '15',
      label: 'URL Features',
      description: 'Lexical, statistical, and structural attributes extracted per URL',
      icon: Sliders,
      accent: 'text-cyan-400',
      badge: 'Real-time',
      bgGlow: 'from-cyan-500/10'
    },
    {
      id: 'xai',
      value: 'Explainable AI',
      label: 'Prediction Reasons',
      description: 'Transparent justification for every phishing / legitimate decision',
      icon: HelpCircle,
      accent: 'text-indigo-400',
      badge: 'Auditable',
      bgGlow: 'from-indigo-500/10'
    },
    {
      id: 'adaptive',
      value: 'Adaptive Learning',
      label: 'Feedback-driven model updates',
      description: 'Continuous model retraining on validated user corrections',
      icon: RefreshCw,
      accent: 'text-emerald-400',
      badge: 'Active Loop',
      bgGlow: 'from-emerald-500/10'
    },
    {
      id: 'accuracy',
      value: '99.5%',
      label: 'Model Accuracy',
      description: 'Random Forest benchmark tested on PhiUSIIL dataset',
      icon: Award,
      accent: 'text-amber-400',
      badge: 'Benchmarked',
      bgGlow: 'from-amber-500/10'
    }
  ];

  return (
    <section aria-label="System Metrics" className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`relative overflow-hidden rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-borderLight transition-all p-5 flex flex-col justify-between group shadow-sm`}
            >
              {/* Subtle gradient background */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${stat.bgGlow} to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform`} />

              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 ${stat.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-800/60 border border-slate-700/40 px-2 py-0.5 rounded-md">
                  {stat.badge}
                </span>
              </div>

              <div>
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-slate-300 mb-1">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
