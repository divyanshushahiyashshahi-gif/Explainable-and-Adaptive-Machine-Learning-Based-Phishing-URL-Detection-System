import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, Globe } from 'lucide-react';

export default function ResultCard({ resultData }) {
  const [copied, setCopied] = useState(false);

  if (!resultData) return null;

  const {
    url,
    prediction, // 0 = Phishing, 1 = Legitimate
    result,     // "PHISHING URL" or "LEGITIMATE URL"
    phishing_probability,
    legitimate_probability,
    trusted_domain
  } = resultData;

  const isPhishing = prediction === 0 || result === 'PHISHING URL';
  const isTrusted = !!trusted_domain;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl border p-6 sm:p-7 shadow-xl transition-all relative overflow-hidden mb-8 ${
        isPhishing
          ? 'bg-gradient-to-b from-rose-950/40 via-cyber-card to-cyber-card border-rose-600/50 shadow-danger-glow'
          : 'bg-gradient-to-b from-emerald-950/40 via-cyber-card to-cyber-card border-emerald-600/50 shadow-safe-glow'
      }`}
    >
      {/* Top Banner Stripe */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          isPhishing
            ? 'bg-gradient-to-r from-rose-600 via-red-500 to-amber-500'
            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500'
        }`}
      />

      {/* Header Result Line */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyber-border">
        
        <div className="flex items-start sm:items-center space-x-4">
          <div
            className={`p-3.5 rounded-2xl flex-shrink-0 border ${
              isPhishing
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isPhishing ? (
              <ShieldAlert className="w-8 h-8 sm:w-9 sm:h-9" />
            ) : (
              <ShieldCheck className="w-8 h-8 sm:w-9 sm:h-9" />
            )}
          </div>

          <div>
            <div className="flex items-center flex-wrap gap-2 mb-1">
              <span
                className={`text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isPhishing
                    ? 'bg-rose-950 border-rose-600/60 text-rose-300'
                    : 'bg-emerald-950 border-emerald-600/60 text-emerald-300'
                }`}
              >
                {isPhishing ? 'High Risk' : 'Safe / Legitimate'}
              </span>

              {/* Trusted Domain Badge */}
              {isTrusted && (
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  ✓ Verified Trusted Domain
                </span>
              )}
            </div>

            <h3
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isPhishing ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isPhishing ? 'PHISHING URL' : 'LEGITIMATE URL'}
            </h3>
          </div>
        </div>

        {/* URL chip with copy */}
        <div className="flex items-center space-x-2 bg-slate-950/70 border border-cyber-borderLight rounded-xl px-3.5 py-2 max-w-full md:max-w-md">
          <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-mono text-xs text-slate-300 truncate flex-1 select-all" title={url}>
            {url}
          </span>
          <button
            onClick={handleCopy}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Probabilities Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        
        {/* Phishing Probability Card */}
        <div
          className={`p-4 rounded-xl border ${
            isPhishing
              ? 'bg-rose-950/30 border-rose-700/50'
              : 'bg-slate-900/60 border-cyber-border'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-300">Phishing Probability</span>
            <span className="text-sm font-mono font-bold text-rose-400">
              {Number(phishing_probability).toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, phishing_probability))}%` }}
            />
          </div>
        </div>

        {/* Legitimate Probability Card */}
        <div
          className={`p-4 rounded-xl border ${
            !isPhishing
              ? 'bg-emerald-950/30 border-emerald-700/50'
              : 'bg-slate-900/60 border-cyber-border'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-300">Legitimate Probability</span>
            <span className="text-sm font-mono font-bold text-emerald-400">
              {Number(legitimate_probability).toFixed(2)}%
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, legitimate_probability))}%` }}
            />
          </div>
        </div>

      </div>

      {/* Safety Disclaimer */}
      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-2">
        <AlertTriangle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span>
          {isPhishing
            ? 'Warning: This link exhibits strong statistical and structural characteristics typical of malicious phishing campaigns.'
            : 'Note: Legitimate classification indicates absence of known phishing signatures. Always verify domain authenticity before entering credentials.'}
        </span>
      </div>
    </div>
  );
}
