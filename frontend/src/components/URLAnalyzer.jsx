import React, { useState } from 'react';
import { Search, RotateCcw, AlertCircle, Loader2, ArrowRight, Link2, ShieldCheck, ShieldAlert, Globe } from 'lucide-react';

export default function URLAnalyzer({ onAnalyze, onReset, isLoading, error, currentUrl }) {
  const [inputUrl, setInputUrl] = useState(currentUrl || '');
  const [localValidationWarning, setLocalValidationWarning] = useState('');

  const sampleUrls = [
    {
      label: 'Google (Trusted)',
      url: 'https://www.google.com/search?q=cybersecurity',
      type: 'trusted'
    },
    {
      label: 'Phishing Keyword Sample',
      url: 'http://secure-login-account-update.xyz/verify?account=99881',
      type: 'phishing'
    },
    {
      label: 'IP & Special Chars Threat',
      url: 'http://192.168.1.1/banking@login/confirm%20password',
      type: 'phishing'
    },
    {
      label: 'Legitimate Web Page',
      url: 'https://en.wikipedia.org/wiki/Phishing',
      type: 'trusted'
    },
    {
      label: 'Standard URL',
      url: 'https://docs.python.org/3/library/urllib.parse.html',
      type: 'legit'
    }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    setLocalValidationWarning('');

    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setLocalValidationWarning('Please enter a URL before initiating analysis.');
      return;
    }

    onAnalyze(trimmed);
  };

  const handleClear = () => {
    setInputUrl('');
    setLocalValidationWarning('');
    onReset();
  };

  const handleSelectSample = (sampleUrl) => {
    setInputUrl(sampleUrl);
    setLocalValidationWarning('');
    onAnalyze(sampleUrl);
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-5 sm:p-7 shadow-lg mb-8 relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">URL Threat Inspection</h2>
              <p className="text-xs text-slate-400">
                Submit any target address to extract 15 lexical features and generate explainable ML inference.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analyzer Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Globe className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (localValidationWarning) setLocalValidationWarning('');
            }}
            placeholder="Enter a URL to analyze..."
            disabled={isLoading}
            className="w-full pl-11 pr-28 py-3.5 bg-slate-950/80 border border-cyber-borderLight rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 font-mono text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <div className="absolute inset-y-0 right-1.5 flex items-center space-x-1.5">
            {inputUrl && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                title="Clear input"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Validation or Error Message */}
        {(localValidationWarning || error) && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-950/40 border border-rose-600/40 rounded-xl text-rose-300 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              {localValidationWarning || error}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Quick preset samples */}
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <span className="text-xs font-mono text-slate-400 mr-1">Quick Test:</span>
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(s.url)}
                disabled={isLoading}
                className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors disabled:opacity-50"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Main Action CTA */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading || (!inputUrl && !currentUrl)}
              className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl border border-cyber-border bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-cyber-sm hover:shadow-cyber-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing URL...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze URL</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
