import React from 'react';
import { HelpCircle, AlertCircle, CheckCircle, Info, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';

export default function ExplanationSection({ reasons = [], isPhishing = false, isTrusted = false }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-7 shadow-lg mb-8">
      <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-cyber-border">
        <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Why this result?</h3>
          <p className="text-xs text-slate-400">
            Explainable AI (XAI) feature-attribution reasons provided directly by the prediction pipeline.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {reasons.map((reason, index) => {
          const isPositive = reason.includes('trusted') || reason.includes('No major suspicious');
          const isSevere = reason.includes('Suspicious keyword') || 
                           reason.includes('IP address') || 
                           reason.includes('@ symbol') || 
                           reason.includes('obfuscation');

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                isPositive
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                  : isSevere
                  ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                  : 'bg-amber-950/20 border-amber-800/40 text-amber-200'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isPositive ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : isSevere ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {reason}
                </p>
              </div>

              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-slate-400 flex-shrink-0">
                {isPositive ? 'Clean' : isSevere ? 'High Risk' : 'Suspicious'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
