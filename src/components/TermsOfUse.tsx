/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Info, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function TermsOfUse() {
  const lastUpdated = "May 24, 2026";

  return (
    <div className="py-12 bg-slate-950 text-gray-300 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header segment */}
        <div className="border-b border-gray-800 pb-8 mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 py-0.5 px-2.5 rounded text-yellow-400 text-xs font-mono">
            <span>SECUREVAULT COMPLIANCE RULES</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Terms of Use
          </h1>
          <div className="text-xs font-mono text-gray-500">
            <span>Last Updated: {lastUpdated} | Early-Stage Project Disclosure</span>
          </div>
        </div>

        {/* Content terms */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-300 font-sans">
          
          <div className="bg-slate-900/40 border border-gray-800 p-5 rounded-2xl flex gap-3.5 items-start">
            <Info className="w-5 h-5 text-cyber-cyan flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <strong className="text-white block mb-0.5 font-display text-[14px]">General Acceptance Terms:</strong>
              <p className="text-xs text-gray-400">
                Please review these Terms carefully before using our pre-launch trust builder software. By browsing this diagnostic space, you acknowledge our limitations and accept these operational conditions.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">1. SecureVault V1 Scope of Purpose</h3>
            <p className="text-gray-400">
              SecureVault V1 is an early advisory and diagnostic tool built to highlight device settings vulnerabilities, analyze clipboard links, and locate junk log buffers. Because our scanner lives in your standard system userspace and avoids background system injection routines, <strong>we do not operate as an automatic, kernel-level system-wide firewall or active real-time virus blocks suite</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">2. No Guarantee of 100% Protection</h3>
            <p className="text-gray-400">
              By using this application, you explicitly consent that **no digital safety company or algorithm can block 100% of cyberthreats**. Security is a combination of software warnings and your alert behavior. SecureVault advises on patterns, but accepts no liability for final damages incurred from manual wire transfers or passwords surrendered to external scammers.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">3. AI Security Adviser consultative boundaries</h3>
            <p className="text-gray-400">
              The AI Security Adviser produces consultative explanations based on local heuristics report. It translates technical codes into easy terms. AI recommendations **do not replace legal advice, official banking supports, or official cybercrime reporting portals**. If you face extortions or financial loss, do not rely on AI; call **1930** helpline immediately.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">4. User Responsibility</h3>
            <p className="text-gray-400">
              You maintain full authority and responsibility over your device. Actions like enabling USB debugging, installing external APK packages, or clicking shortened web linkages received in chats require your final checking. SecureVault provides context but cannot replace physical caution.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">5. Acceptable Use Policy</h3>
            <p className="text-gray-400">
              Users are prohibited from trying to reverse-engineer our proprietary heuristic scanners, injecting false reports, spamming the ticket consoles, or using our name to publish clone installers on unverified blogs. Official downloads originate strictly from authorized paths.
            </p>
          </div>

          {/* Contact segment */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
            <span>SecureVault Project. Saathvik Bonakurthi, Student Director.</span>
            <span>Emergency Portal: cybercrime.gov.in</span>
          </div>

        </div>

      </div>
    </div>
  );
}
