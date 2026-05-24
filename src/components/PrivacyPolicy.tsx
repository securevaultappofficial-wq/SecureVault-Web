/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Eye, Database, HelpCircle } from "lucide-react";

export default function PrivacyPolicy() {
  const lastUpdated = "May 24, 2026";

  return (
    <div className="py-12 bg-slate-950 text-gray-300 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header detail */}
        <div className="border-b border-gray-800 pb-8 mb-8 space-y-2">
          <div className="inline-flex items-center gap-1 bg-cyan-400/10 border border-cyan-400/20 py-0.5 px-2.5 rounded text-cyber-cyan text-xs font-mono">
            <span>SECUREVAULT LAUNCH ETHICS</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Privacy Policy
          </h1>
          <div className="text-xs font-mono text-gray-500">
            <span>Last Redrafted: {lastUpdated} | Non-corporate Simplified Format</span>
          </div>
        </div>

        {/* Content body blocks */}
        <div className="space-y-8 text-sm leading-relaxed text-gray-300 font-sans">
          
          <div className="bg-slate-900/60 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-2.5">
            <h4 className="font-display font-bold text-white text-base">Our Core Promise</h4>
            <p className="text-gray-400">
              At SecureVault V1, we believe that security should never cost you your privacy. Unlike complex security apps that monitor every URL you visit in the background or scan your personal chat databases continuously, SecureVault strictly operates on a <strong>local-first</strong>, <strong>user-controlled manual diagnostic setup</strong>.
            </p>
          </div>

          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">1. Information We Process (And why)</h3>
            <p className="text-gray-400">
              SecureVault V1 only analyzes device safety variables when you physically trigger a scan:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-400">
              <li><strong>Heuristic file name identifiers:</strong> To warn you if file installers in your Download folder mimic financial malware templates (e.g. KYC, bills).</li>
              <li><strong>Storage cache size tags:</strong> To calculate transient storage data sizes that can be cleaned safely.</li>
              <li><strong>Clipboard URLs:</strong> Paste checkups strictly within our app tab to verify phishing domain structures prior to click-throughs.</li>
              <li><strong>Device configurations:</strong> Evaluating if debug permissions or developer options exist to let you lock them safely.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">2. What We NEVER Collect or Store</h3>
            <p className="text-gray-400">
              We stand stringently against hidden harvesting. SecureVault does NOT collect, duplicate, transmit, or cache the following properties:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs">
              <div className="bg-red-500/3 border border-red-500/10 p-4 rounded-xl space-y-1">
                <strong className="text-red-400 block font-display">No Private Files:</strong>
                <p className="text-gray-400 leading-normal">
                  Your private camera images, documents libraries, downloaded PDFs, WhatsApp databases, and downloads are completely untouched and safe.
                </p>
              </div>
              <div className="bg-red-500/3 border border-red-500/10 p-4 rounded-xl space-y-1">
                <strong className="text-red-400 block font-display">No Secure Codes:</strong>
                <p className="text-gray-400 leading-normal">
                  No passwords, OTPs, credit cards, bank credentials, Aadhar IDs, or mobile communication structures are ever parsed or read.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">3. Firestore Storage Safe Synchronization</h3>
            <p className="text-gray-400">
              SecureVault V1 utilizes cloud resources (Firebase Firestore) if you optional register your account. Under this setup, we sync only numeric summary metadata (e.g. cumulative scan runs, total junk deleted megabytes counters, account date metrics) so you can audit history across machines. Real file paths remain locked on-device.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="font-display font-bold text-lg text-white">4. Your Control and Deletion Rights</h3>
            <p className="text-gray-400 font-sans">
              You own your data files and analytics summaries. At any point, you can completely erase your synced metadata profile directly from the SecureVault settings panels. This initiates a total cryptographic erase of database logs.
            </p>
          </div>

          {/* Contact help block */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-500">
            <span>SecureVault Project. Created in Indian Android Context.</span>
            <span>Support: securevaultappofficial@gmail.com</span>
          </div>

        </div>

      </div>
    </div>
  );
}
