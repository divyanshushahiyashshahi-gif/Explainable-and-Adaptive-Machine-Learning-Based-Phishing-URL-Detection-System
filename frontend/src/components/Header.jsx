import React from 'react';
import { Shield, ShieldAlert, Cpu, Radio, Sparkles } from 'lucide-react';
import { isMockMode } from '../services/api';

export default function Header({ mockModeActive, onToggleMockMode }) {
  return (
    <header className="border-b border-cyber-border/80 bg-cyber-bg/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Security Logo */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 text-cyan-400 shadow-cyber-sm">
              <Shield className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  AI Defense v2.0
                </span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline-flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" /> Random Forest
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Explainable & Adaptive Phishing URL Detection System
              </h1>
            </div>
          </div>

          {/* Environment / Mode Badge */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMockMode}
              title="Click to toggle between Mock API and Live Backend"
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
                mockModeActive
                  ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:bg-amber-900/40'
                  : 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${mockModeActive ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}`} />
              <span>{mockModeActive ? 'Mock API (Dev)' : 'Live API (FastAPI)'}</span>
            </button>
          </div>

        </div>
      </div>
      
      {/* Subtitle Banner */}
      <div className="bg-gradient-to-r from-cyan-950/30 via-slate-900/40 to-cyan-950/30 border-t border-cyber-border/40 py-2">
        <p className="text-xs sm:text-sm text-center text-slate-400 px-4">
          <Sparkles className="w-3.5 h-3.5 inline-block text-cyan-400 mr-1.5" />
          AI-powered URL analysis with explainable and adaptive phishing detection.
        </p>
      </div>
    </header>
  );
}
