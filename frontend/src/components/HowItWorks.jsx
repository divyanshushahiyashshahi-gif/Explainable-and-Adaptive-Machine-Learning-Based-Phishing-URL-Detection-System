import React from 'react';
import { Search, Sliders, Cpu, HelpCircle, RefreshCw, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Enter URL',
      description: 'User inputs any target web link, IP address, or shortened URL to initiate security inspection.',
      icon: Search,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30'
    },
    {
      step: '02',
      title: 'Extract 15 Features',
      description: 'Lexical, statistical, entropy, and domain indicators are extracted without loading malicious web content.',
      icon: Sliders,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    },
    {
      step: '03',
      title: 'AI Prediction',
      description: 'Random Forest classifier infers classification (0=Phishing, 1=Legitimate) with calibrated probabilities.',
      icon: Cpu,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30'
    },
    {
      step: '04',
      title: 'Explanation + Feedback',
      description: 'System details specific risk indicators, trusted status, and prompts user verification.',
      icon: HelpCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30'
    },
    {
      step: '05',
      title: 'Adaptive Learning',
      description: 'Feedback dataset incrementally trains model iterations, ensuring defense against emerging phishing campaigns.',
      icon: RefreshCw,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    }
  ];

  return (
    <section aria-label="Pipeline Architecture" className="mb-8">
      <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-7 shadow-lg">
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            How It Works
            <span className="text-xs font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-2.5 py-0.5 rounded-full">
              5-Stage Pipeline
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            End-to-end architecture from raw string analysis to continuous adaptive retraining.
          </p>
        </div>

        {/* 5-Step Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-4 rounded-xl bg-slate-950/70 border border-cyber-borderLight hover:border-slate-600 transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                      {item.step}
                    </span>
                    <div className={`p-2 rounded-lg ${item.bg} ${item.border} ${item.color} border`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
