/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SECURE_VAULT_FEATURES } from "../data/features";
import { 
  ShieldAlert, Binary, Trash2, Link2, Sparkles, 
  FileText, AlertTriangle, Megaphone, Languages, Info, Check, AlertOctagon, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FeaturesView() {
  const [activeFeatureId, setActiveFeatureId] = useState("smart-scan");

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-cyber-cyan" />;
      case "Binary": return <Binary className="w-5 h-5 text-cyber-cyan" />;
      case "Trash2": return <Trash2 className="w-5 h-5 text-cyber-cyan" />;
      case "Link2": return <Link2 className="w-5 h-5 text-cyber-cyan" />;
      case "Sparkles": return <Sparkles className="w-5 h-5 text-purple-400" />;
      case "FileText": return <FileText className="w-5 h-5 text-cyber-cyan" />;
      case "AlertTriangle": return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "Megaphone": return <Megaphone className="w-5 h-5 text-cyber-cyan" />;
      case "Languages": return <Languages className="w-5 h-5 text-cyber-cyan" />;
      default: return <Info className="w-5 h-5 text-cyber-cyan" />;
    }
  };

  const selectedFeature = SECURE_VAULT_FEATURES.find(f => f.id === activeFeatureId) || SECURE_VAULT_FEATURES[0];

  return (
    <div className="py-12 bg-slate-950 text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Headings */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display font-medium text-4xl tracking-tight text-white sm:text-5xl">
            SecureVault <span className="text-cyber-cyan">V1 Features</span>
          </h1>
          <p className="mt-4 text-lg text-gray-400 leading-relaxed">
            Everyday cybersecurity tools designed to be completely honest, easy for parents to grasp, and robust. Transparently built without fake claims.
          </p>
        </div>

        {/* Feature Selector layout grids */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Vertical Navigation Pill rails */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest pl-3 mb-2">Available in V1:</span>
            {SECURE_VAULT_FEATURES.map((feat) => {
              const isActive = feat.id === activeFeatureId;
              return (
                <button
                  key={feat.id}
                  onClick={() => setActiveFeatureId(feat.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 border-cyber-cyan text-white shadow-[0_0_15px_rgba(0,212,255,0.08)]" 
                      : "bg-slate-950/40 border-gray-800 hover:border-gray-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-cyan-500/10 text-cyber-cyan" : "bg-slate-900 text-gray-400"}`}>
                      {getIcon(feat.iconName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm tracking-wide">{feat.title}</h3>
                      <p className="text-[11px] text-gray-500 truncate max-w-[180px] sm:max-w-xs">{feat.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "translate-x-1 text-cyber-cyan" : "text-gray-600"}`} />
                </button>
              );
            })}
          </div>

          {/* Interactive Feature details card section */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-900/60 border border-gray-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative"
              >
                
                {/* Visual glow background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl opacity-60"></div>
                
                {/* Card Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20 rounded-2xl shadow-inner">
                      {getIcon(selectedFeature.iconName)}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-cyber-cyan uppercase tracking-wider">{selectedFeature.subtitle}</span>
                      <h2 className="font-display font-bold text-2xl text-white tracking-tight mt-0.5">{selectedFeature.title}</h2>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-emerald-500/12 text-cyber-green text-[10px] font-mono border border-emerald-500/20 py-1 px-3 rounded-full font-semibold uppercase">
                      V1 Active Feature
                    </span>
                  </div>
                </div>

                {/* Primary Description */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Description:</h4>
                    <p className="text-[15px] text-gray-300 leading-relaxed font-sans">
                      {selectedFeature.description}
                    </p>
                  </div>

                  {/* Operational checklists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* What it helps with */}
                    <div className="bg-slate-950/60 border border-gray-800/80 p-5 rounded-2xl shadow-inner">
                      <h4 className="text-xs font-mono text-cyber-cyan hover:text-cyber-green transition-colors uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-bold">
                        <Check className="w-4 h-4 text-cyber-cyan stroke-[2.5]" />
                        <span>Core Capabilities</span>
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        {selectedFeature.capabilityDetails.map((cap, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-snug">
                            <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full mt-2 flex-shrink-0" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Threat targets address */}
                    <div className="bg-slate-950/60 border border-gray-800/80 p-5 rounded-2xl shadow-inner">
                      <h4 className="text-xs font-mono text-cyber-cyan uppercase tracking-wider mb-3.5 flex items-center gap-1.5 font-bold">
                        <Info className="w-4 h-4 text-cyber-cyan" />
                        <span>What It Helps Diagnose</span>
                      </h4>
                      <ul className="space-y-2.5 text-sm text-gray-300">
                        {selectedFeature.helpsWith.map((help, idx) => (
                          <li key={idx} className="flex items-center gap-2.5">
                            <span className="w-4 h-4 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] text-cyber-cyan font-semibold flex items-center justify-center flex-shrink-0 font-mono">
                              ✓
                            </span>
                            <span className="truncate">{help}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Contrast Honest Note segment */}
                  <div className="bg-amber-500/3 border border-amber-500/15 p-5 rounded-2xl flex items-start gap-3.5 text-sm">
                    <AlertOctagon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-yellow-400 font-display mb-1 text-[13px] uppercase tracking-wide">Honest Boundary: What counts as limits</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {selectedFeature.honestNote}
                      </p>
                    </div>
                  </div>

                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Feature grid footnotes */}
        <div className="mt-16 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-gray-800 rounded-3xl p-6 sm:p-8 text-center">
          <h3 className="font-display font-bold text-lg text-white tracking-wide">SecureVault V1 completely avoids background overpromises</h3>
          <p className="text-xs text-gray-500 font-mono max-w-xl mx-auto mt-2 leading-relaxed">
            By forgoing persistent VPN layers, real-time unrequested scanners, and intrusive root scripts, SecureVault remains fully optimized for battery safety and retains an ultra-light local signature.
          </p>
        </div>

      </div>
    </div>
  );
}
