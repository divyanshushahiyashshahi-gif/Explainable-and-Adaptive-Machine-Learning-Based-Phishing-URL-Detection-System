import React from 'react';
import { Shield, Terminal, Database, Cpu, Code2 } from 'lucide-react';
import { API_BASE_URL, isMockMode } from '../services/api';

export default function Footer() {
  return (
    <footer className="border-t border-cyber-border/80 bg-cyber-bg/95 py-8 mt-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-cyber-border/60">
          
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Explainable & Adaptive Phishing URL Detection
              </div>
              <div className="text-xs text-slate-500">
                Machine Learning-Based Cybersecurity Intelligence
              </div>
            </div>
          </div>

          {/* Quick Technical Specs */}
          <div className="flex items-center flex-wrap gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300">
              <Database className="w-3.5 h-3.5 text-cyan-400" /> PhiUSIIL Dataset
            </span>
            <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Random Forest (~99.5%)
            </span>
            <span className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md text-slate-300">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Contract: POST /analyze
            </span>
          </div>

        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 text-xs text-slate-500 gap-2">
          <div>
            Built with React, Vite & Tailwind CSS for modern threat detection.
          </div>
          <div className="flex items-center space-x-2">
            <span>API Target: <code className="text-cyan-400">{API_BASE_URL}</code></span>
            <span>•</span>
            <span>{isMockMode() ? 'Standalone Mock Engine Active' : 'Connected to FastAPI Backend'}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
