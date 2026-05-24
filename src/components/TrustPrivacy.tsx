/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, ShieldX, Database, Lock, Eye, CheckCircle2, 
  HelpCircle, EyeOff, KeyRound, Smartphone, AlertTriangle, Users
} from "lucide-react";
import { motion } from "motion/react";

export default function TrustPrivacy() {
  const [selectedPermission, setSelectedPermission] = useState("all-files");

  const permissionList = [
    {
      id: "all-files",
      title: "Storage (All Files Access)",
      purpose: "Allows the Malware Risk Scan and Junk Cleaner to locate leftover cached folders and check if downloaded installer APK files resemble Trojan templates.",
      honestDisclosure: "We only read file metaheaders (like extensions and names) in download folders. We NEVER scan or copy your private photos, videos, or personal PDF bank statements."
    },
    {
      id: "notifications",
      title: "Notifications Support",
      purpose: "Required to deliver high-priority alerts regarding new circulating cyber-crimes (CERT-In notifications, news) or immediate critical threats.",
      honestDisclosure: "SecureVault does not run a heavy background execution engine, meaning you only receive local signals we distribute weekly. No constant vibration spam."
    },
    {
      id: "clipboard",
      title: "Clipboard Access",
      purpose: "Allows Link Protection to instantly evaluate a pasted URL you copied from WhatsApp or SMS when inside the scanner tab.",
      honestDisclosure: "We only analyze links. We do not transmit clip buffers or credit card numbers to external servers. Verification is strictly diagnostic."
    }
  ];

  return (
    <div className="py-12 bg-slate-950 text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headings */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display font-medium text-4xl tracking-tight text-white sm:text-5xl">
            Our <span className="text-cyber-green">Trust & Privacy</span> Shield
          </h1>
          <p className="mt-4 text-base text-gray-400 leading-relaxed font-sans">
            Highly professional cybersecurity means zero deception. We do not use fear tactics. We don't ask you for permissions we don't need, and we never make false promises.
          </p>
        </div>

        {/* Side-by-Side Trust Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* What We Scan */}
          <div className="bg-slate-900/60 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 hover:border-emerald-500/35 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-500/10 text-cyber-green rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-lg text-white">What SecureVault V1 Checks</h2>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              With your explicit permissions, our local heuristics engine checks files and folders to warn you:
            </p>

            <ul className="space-y-4">
              {[
                { title: "Device Settings Risks", desc: "Flagging developer modes or suspicious USB debug settings that scammers leverage." },
                { title: "Heuristic APK Names", desc: "Flagging installers that masquerade as financial boards under download paths." },
                { title: "Clipboard Link Headers", desc: "Analyzing suspicious domains inside the app tab prior to click-throughs." },
                { title: "Storage Cache Logs", desc: "Locating leftover residual empty spaces and application crash debris." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-5 h-5 bg-emerald-500/10 text-cyber-green rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-white text-sm font-semibold">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* What We NEVER Do */}
          <div className="bg-slate-900/60 border border-red-500/20 rounded-3xl p-6 sm:p-8 hover:border-red-500/35 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-red-400/10 text-red-400 rounded-xl">
                <ShieldX className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-lg text-white">What SecureVault NEVER Does</h2>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              We stand against modern app tracking and malicious extortion models:
            </p>

            <ul className="space-y-4">
              {[
                { title: "Never asks for UPI PINs or OTPs", desc: "We NEVER ask you for UPI keys, verification numbers, or net banking passwords." },
                { title: "Never steals contact or files", desc: "No background phone registries, call histories, or contacts harvesting occurs." },
                { title: "Never deletes personal data", desc: "We never delete a physical photo, family video, or PDF statement automatically." },
                { title: "Never makes 100% false promises", desc: "We explicitly declare that no software guarantees 100% hacking blockades." }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="w-5 h-5 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold font-mono">
                    ✕
                  </span>
                  <div>
                    <h4 className="text-white text-sm font-semibold">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Firestore Storage & Database Transparent disclosures */}
        <div className="bg-slate-900/40 border border-gray-800 rounded-3xl p-6 sm:p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-cyan-400/10 border border-cyan-400/20 font-mono py-1 px-3 rounded-full text-cyber-cyan text-xs">
                <Database className="w-3.5 h-3.5" />
                <span>Cloud Transparency Disclosure</span>
              </div>
              
              <h2 className="font-display font-semibold text-2xl text-white tracking-tight">
                How Firestore Data is Handled
              </h2>
              
              <p className="text-sm text-gray-400 leading-relaxed">
                If you opt to log into an account via Firebase to backup your security analytics, SecureVault stores only high-level dashboard summaries to preserve storage. We strictly do not duplicate local file structures to the cloud.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 text-xs">
                  <strong className="text-cyber-cyan block mb-1">Stored in Cloud Database:</strong>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    <li>Completed Diagnostic Counts</li>
                    <li>Malware Risk Check Logs (metrics only)</li>
                    <li>AI Adviser Chat Query stats</li>
                    <li>Device model descriptors (V1)</li>
                  </ul>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 text-xs">
                  <strong className="text-red-400 block mb-1">NEVER Transmitted to Cloud:</strong>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    <li>Photos, videos, or SMS texts</li>
                    <li>Files names outside of flagged APKs</li>
                    <li>Full system filepath folders</li>
                    <li>Browsing history lists</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative bg-slate-950 border border-gray-800 p-6 rounded-2xl max-w-xs w-full text-center hover:border-cyber-cyan/30 transition-all">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl"></div>
                
                <div className="w-12 h-12 bg-purple-500/10 text-purple-400 border border-purple-500/20 mx-auto rounded-xl flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6 text-purple-300" />
                </div>
                
                <h4 className="font-display font-bold text-white text-sm mb-1.5">AI Security Ethics</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  The AI Security Adviser responds strictly to active scan results that are anonymized. It can never collect, request, or parse personal identification credentials.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-800/80 text-[10px] font-mono text-purple-400">
                  GEMINI ETHICAL PROTOCOL ENFORCED
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Android permissions simulator */}
        <div className="bg-slate-900/60 border border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h3 className="font-display font-bold text-xl text-white">Interactive Android Permission Clarifier</h3>
            <p className="text-sm text-gray-400 mt-1">
              Click a standard Android permission class below to understand why an app might request it and how SecureVault defends your security boundaries honestly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {permissionList.map((perm) => (
              <button
                key={perm.id}
                onClick={() => setSelectedPermission(perm.id)}
                className={`p-4 text-left rounded-xl border flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  selectedPermission === perm.id 
                    ? "bg-slate-900 border-cyber-cyan text-white shadow-[0_0_12px_rgba(0,212,255,0.06)]"
                    : "bg-slate-950 border-gray-800 hover:border-gray-700 hover:text-white"
                }`}
              >
                <span className="font-mono text-xs text-gray-500 font-semibold uppercase">Android Flag:</span>
                <span className="font-display font-medium text-sm text-gray-200 mt-1">{perm.title}</span>
              </button>
            ))}
          </div>

          {/* Explanation panel with state-driven view */}
          <div className="bg-slate-950 border border-gray-800 p-5 rounded-2xl relative overflow-hidden min-h-[140px] flex flex-col justify-center">
            {permissionList.filter(p => p.id === selectedPermission).map((permDetail) => (
              <div key={permDetail.id} className="space-y-3.5">
                <div>
                  <span className="text-[10px] font-mono text-cyber-cyan uppercase tracking-wider">How we use it:</span>
                  <p className="text-sm text-gray-300 mt-0.5 leading-relaxed">{permDetail.purpose}</p>
                </div>
                <div className="border-t border-gray-800/80 pt-3 flex gap-2.5 items-start text-xs text-yellow-400 bg-amber-500/2 p-3 rounded-lg border border-amber-500/10">
                  <Smartphone className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>SecureVault Honest Privacy Oath:</strong> {permDetail.honestDisclosure}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
