import React, { useState } from 'react';
import { Sliders, ChevronDown, ChevronUp, Layers, Check, X, Binary } from 'lucide-react';

export default function FeatureExtractorTable({ features = null }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!features) return null;

  // Metadata definition for all 15 features
  const featureDefinitions = [
    { key: 'URLLength', name: 'URL Length', type: 'numeric', desc: 'Total number of characters in the full URL' },
    { key: 'DomainLength', name: 'Domain Length', type: 'numeric', desc: 'Character length of host / domain' },
    { key: 'IsDomainIP', name: 'Is Domain IP', type: 'boolean', desc: 'Whether host is an IPv4 address' },
    { key: 'NoOfSubDomain', name: 'Subdomain Count', type: 'numeric', desc: 'Number of subdomains beyond base domain' },
    { key: 'IsHTTPS', name: 'Is HTTPS', type: 'boolean', desc: 'Whether URL utilizes TLS/SSL protocol' },
    { key: 'NoOfDegitsInURL', name: 'Digits Count', type: 'numeric', desc: 'Total digits present throughout URL' },
    { key: 'NoOfOtherSpecialCharsInURL', name: 'Special Chars Count', type: 'numeric', desc: 'Count of symbols (@?=&;%_~)' },
    { key: 'HasAtSymbol', name: 'Has @ Symbol', type: 'boolean', desc: 'Presence of @ delimiter in URL authority' },
    { key: 'HasSuspiciousKeyword', name: 'Suspicious Keyword', type: 'boolean', desc: 'Match with credential/banking phishing terms' },
    { key: 'PathLength', name: 'Path Length', type: 'numeric', desc: 'Length of URL path component' },
    { key: 'QueryParameterCount', name: 'Query Params Count', type: 'numeric', desc: 'Number of query string parameters' },
    { key: 'URLEntropy', name: 'URL Entropy', type: 'float', desc: 'Shannon entropy measuring randomness of URL characters' },
    { key: 'HasObfuscation', name: 'Has Obfuscation', type: 'boolean', desc: 'Hex or percent-encoded obfuscation detected' },
    { key: 'NoOfURLRedirect', name: 'URL Redirect Count', type: 'numeric', desc: 'Number of // redirect indicator occurrences' },
    { key: 'IsShortenedURL', name: 'Is Shortened URL', type: 'boolean', desc: 'Domain belongs to known URL shortening services' },
  ];

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl shadow-lg mb-8 overflow-hidden">
      {/* Header Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 sm:p-6 flex items-center justify-between hover:bg-slate-900/40 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              View Extracted URL Features
              <span className="text-xs font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                15 ML Attributes
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Complete feature vector passed to the Random Forest model for inference.
            </p>
          </div>
        </div>

        <div className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 border border-slate-700">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Feature Table / Grid */}
      {isOpen && (
        <div className="p-5 sm:p-6 pt-0 border-t border-cyber-border/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cyber-border text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Feature Name</th>
                  <th className="py-3 px-3">Raw Key</th>
                  <th className="py-3 px-3">Extracted Value</th>
                  <th className="py-3 px-3 hidden md:table-cell">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyber-border/40 font-mono text-xs">
                {featureDefinitions.map((def, idx) => {
                  const rawVal = features[def.key];
                  
                  let formattedVal;
                  let badgeColor = 'bg-slate-800 text-slate-300 border-slate-700';

                  if (def.type === 'boolean') {
                    const isTrue = rawVal === 1 || rawVal === true;
                    formattedVal = (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border font-semibold ${
                        isTrue
                          ? (def.key === 'IsHTTPS' 
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300' 
                              : 'bg-rose-950/80 border-rose-700 text-rose-300')
                          : (def.key === 'IsHTTPS' 
                              ? 'bg-rose-950/80 border-rose-700 text-rose-300' 
                              : 'bg-slate-800/80 border-slate-700 text-slate-400')
                      }`}>
                        {isTrue ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {isTrue ? '1 (True)' : '0 (False)'}
                      </span>
                    );
                  } else if (def.type === 'float') {
                    formattedVal = (
                      <span className={`px-2.5 py-0.5 rounded-md border font-semibold ${
                        Number(rawVal) >= 4.5 
                          ? 'bg-amber-950/80 border-amber-700 text-amber-300' 
                          : 'bg-slate-800 border-slate-700 text-cyan-300'
                      }`}>
                        {Number(rawVal).toFixed(4)}
                      </span>
                    );
                  } else {
                    formattedVal = (
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-cyan-300 font-semibold">
                        {rawVal !== undefined ? rawVal : '0'}
                      </span>
                    );
                  }

                  return (
                    <tr key={def.key} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-200">{def.name}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{def.key}</td>
                      <td className="py-2.5 px-3">{formattedVal}</td>
                      <td className="py-2.5 px-3 font-sans text-xs text-slate-400 hidden md:table-cell">{def.desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
