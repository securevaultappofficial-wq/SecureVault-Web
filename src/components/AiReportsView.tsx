/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, FileText, ShieldAlert, Binary, Link2, 
  Trash2, HelpCircle, Loader2, RefreshCw, AlertTriangle, Play 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AiReportsView() {
  const [selectedReport, setSelectedReport] = useState("smart-scan");
  const [generating, setGenerating] = useState(false);
  const [explanationGenerated, setExplanationGenerated] = useState(true);

  const reportPresets = [
    {
      id: "smart-scan",
      title: "Smart Scan Audit",
      subtitle: "Full-profile security summary",
      icon: <FileText className="w-4 h-4 text-cyber-cyan" />,
      rawReport: {
        timestamp: "2026-05-24 00:01:22 UTC",
        score: 72,
        meta: "DEVICE_RISK_SIGNALS_ALERT",
        flags: [
          "DEVELOPER_REQS: USB_DEBUGGING_ON",
          "THIRD_PARTY_INSTALLERS_BLOCKED: OFF",
          "NOTIFICATION_ACCESSIBILITY_LISTENERS: [1 ACTIVE]"
        ]
      },
      aiResponse: {
        summary: "Your device currently has USB Debugging enabled along with custom notification readers. Scammers can leverage debugging slots to send commands during screensharing attacks.",
        whyItMatters: "USB debugging is a powerful developer setting. If left active, a user on a screen share call (such as on AnyDesk) can let hackers push stealth background installer codes onto your handset without physical taps.",
        riskExplanation: "Active notification listeners are highly risky because they can read security codes emitted in background SMS. Normal family apps do not need full visibility over background system notifies.",
        canFix: "SecureVault identifies and outlines these entries globally in seconds, sparing you from browsing deep handset settings.",
        manualReviewNeeded: "You must manually navigate to Android Settings > Developer Options and toggle USB debug to OFF. We can guide you there but cannot override standard Android security privileges.",
        nextSteps: [
          "Navigate to Settings > System > Developer Settings.",
          "Locate 'USB Debugging' and toggle it to Disabled.",
          "Ensure secondary notification listeners are locked."
        ],
        safetyNote: "SecureVault reports analyze settings locally. No personal communication content is compiled or moved."
      }
    },
    {
      id: "malware-scan",
      title: "Malware Risk Report",
      subtitle: "Package installation metrics",
      icon: <Binary className="w-4 h-4 text-cyber-cyan" />,
      rawReport: {
        timestamp: "2026-05-24 00:03:10 UTC",
        score: 45,
        meta: "SUSPICIOUS_PACKAGE_WARNING",
        flags: [
          "PATH_DETECTED: /sdcard/Download/KYC_QuickSupport_v4.apk",
          "SUSP_NAME_MATCH: bank/kyc/card keywords detected",
          "PERMISSIONS_DEMANDED: [READ_SMS, RECEIVE_SMS, SYSTEM_ALERT_WINDOW]"
        ]
      },
      aiResponse: {
        summary: "A file named KYC_QuickSupport_v4.apk is residing in your download folder. It possesses dangerous permission requests typical of SMS hijacking utilities.",
        whyItMatters: "Scammers ask you to download these kits from WhatsApp. Once loaded, the Trojan listens silently and relays all bank transaction PIN codes directly to fraudsters over the web.",
        riskExplanation: "This package demands background authority to see overlapping windows and read incoming text messages, allowing behind-the-scene OTP captures.",
        canFix: "Our scanner instantly flags uninstalled packages and identifies risky naming structures targeting financial boards.",
        manualReviewNeeded: "Locate this file inside your Downloads directory or via your files application and delete it completely.",
        nextSteps: [
          "Delete the unverified APK installer.",
          "Check Android Settings > Special Apps to ensure no weird administrative privileges exist."
        ],
        safetyNote: "Heuristic reports are advisory. Always prefer downloading apps strictly from official Play Store directories."
      }
    },
    {
      id: "link-protection",
      title: "Link Protection Report",
      subtitle: "Unmasked domain audit",
      icon: <Link2 className="w-4 h-4 text-cyber-cyan" />,
      rawReport: {
        timestamp: "2026-05-24 00:04:15 UTC",
        score: 20,
        meta: "PHISHING_URL_DETECTED",
        flags: [
          "DOMAIN: sbi-kyc-verify-login.net",
          "ENCRYPTION: HTTP (NOT SECURE)",
          "KEYWORD_SPOOF: sbi, kyc, login",
          "REDIRECT_LOOPS: 3 HOP CHAINS DETECTED"
        ]
      },
      aiResponse: {
        summary: "The scanned link is a flagrant phishing page masquerading as the State Bank of India's update gateway. It uses insecure hosting to steal login credentials.",
        whyItMatters: "Clicking this leads to a clone of your banking screen. Credential fields submit directly to hackers instead of the true bank servers.",
        riskExplanation: "Fraudsters transmit links in SMS claiming SIM blocks. Real corporate domains use premium certified top-level domains (like .co.in or .com) and never utilize .net or .cc for authentication.",
        canFix: "We unmask shortenings and dissect keyword combinations beforehand using clean secure sandboxes.",
        manualReviewNeeded: "Simply delete the text message. Never enter transactional passwords on links received externally.",
        nextSteps: [
          "Delete the WhatsApp or SMS chain containing this link.",
          "Instruct family members to never open external banking links."
        ],
        safetyNote: "Heuristics verify pattern rules. Brand spoofing databases update dynamically, but caution remains paramount."
      }
    },
    {
      id: "junk-cleaner",
      title: "Junk Cleaner Report",
      subtitle: "Cache optimization receipt",
      icon: <Trash2 className="w-4 h-4 text-cyber-cyan" />,
      rawReport: {
        timestamp: "2026-05-24 00:05:01 UTC",
        score: 95,
        meta: "STORAGE_OPTIMIZE_SUMMARY",
        flags: [
          "APP_CACHE_SIZE: 1.82 GB",
          "RESIDUAL_LOGFILES: 420 MB",
          "EMPTY_DIRFILES: 14 folders",
          "LEFTOVER_TEMPFILES: 230 MB"
        ]
      },
      aiResponse: {
        summary: "You possess roughly 2.45 GB of easily removable junk caching that lags system storage. Photos and essential folders are completely green.",
        whyItMatters: "Excess cached files degrade solid-state read performance. Removing debris frees valuable gigabytes for new applications.",
        riskExplanation: "This cache resides inside standard public app directories and only represents old graphics previews, logs, or uninstalled residues.",
        canFix: "We isolate these zones safely and delete them altogether with a single tap.",
        manualReviewNeeded: "Review the items checklist inside SecureVault and tap clear. SecureVault never operates in the background.",
        nextSteps: [
          "Audit cache list in our dashboard.",
          "Check 'Leftover APKs' category manually prior to deletion."
        ],
        safetyNote: "SecureVault strictly forbids the deletion of private documents, image galleries, or downloaded attachments."
      }
    }
  ];

  const handleGenerateAi = () => {
    setGenerating(true);
    setExplanationGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setExplanationGenerated(true);
    }, 1200);
  };

  const activePreset = reportPresets.find(r => r.id === selectedReport) || reportPresets[0];

  return (
    <div className="py-12 bg-slate-950 text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display font-medium text-4xl tracking-tight text-white sm:text-5xl">
            AI Adviser & <span className="text-purple-400">Reports</span>
          </h1>
          <p className="mt-4 text-base text-gray-400 leading-relaxed font-sans">
            SecureVault V1 integrates a Gemini-powered <strong>AI Security Adviser</strong> to explain raw technical scanning data in clear, simple language suitable for parents and students.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel Selection of Report types */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block pl-2">Select Report Category:</span>
            {reportPresets.map((rep) => {
              const isSelected = rep.id === selectedReport;
              return (
                <button
                  key={rep.id}
                  onClick={() => {
                    setSelectedReport(rep.id);
                    setExplanationGenerated(true);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? "bg-slate-900 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.06)]"
                      : "bg-slate-950/40 border-gray-800 hover:border-gray-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-purple-500/10 text-purple-400" : "bg-slate-900 text-gray-400"}`}>
                      {rep.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm tracking-wide">{rep.title}</h4>
                      <span className="text-[10px] text-gray-500 font-mono tracking-wider block uppercase">{rep.subtitle}</span>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* AI Warning Box */}
            <div className="bg-purple-950/20 border border-purple-500/20 p-5 rounded-2xl">
              <span className="text-purple-400 font-bold font-display text-xs tracking-wider uppercase block mb-1">Our Safety Guarantee:</span>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                Our server-side AI strictly processes heuristic codes (flag names, settings indicators, file names). We never feed personal message content, passwords, or images to AI backends, respecting pristine privacy mandates.
              </p>
            </div>
          </div>

          {/* Right panel Technical console output + AI layout generator */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Raw System Report Card Mockup */}
            <div className="bg-slate-950 border border-gray-800 rounded-2xl p-5 font-mono text-xs">
              <div className="flex justify-between items-center text-gray-500 border-b border-gray-900 pb-2.5 mb-3">
                <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> SECUREVAULT REPORT ID: {activePreset.id.toUpperCase()}_LOG</span>
                <span>SYSTEM VERSION: V1.0.0</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
                <div>
                  <span className="text-gray-500 block uppercase text-[10px]">TIMESTAMP:</span>
                  <span className="text-gray-300">{activePreset.rawReport.timestamp}</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase text-[10px]">RISK CLASSIFICATION:</span>
                  <span className={`font-bold ${activePreset.rawReport.score < 50 ? "text-red-400" : activePreset.rawReport.score < 80 ? "text-yellow-400" : "text-emerald-400"}`}>
                    {activePreset.rawReport.meta} ({activePreset.rawReport.score}%)
                  </span>
                </div>
              </div>

              <div className="mt-4 bg-slate-900/60 p-3.5 border border-gray-900 rounded-lg text-gray-400 space-y-1 py-2.5">
                <span className="text-[9px] text-gray-600 block mb-1 uppercase tracking-widest font-bold">Heuristic Flag Records:</span>
                {activePreset.rawReport.flags.map((flag, idx) => (
                  <div key={idx} className="truncate text-gray-300 font-semibold text-[11px]">
                    &gt; {flag}
                  </div>
                ))}
              </div>

              {explanationGenerated ? (
                <div className="text-right mt-4">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-medium">
                    ✓ Report successfully compiled and linked with AI
                  </span>
                </div>
              ) : (
                <div className="text-right mt-4">
                  <button 
                    onClick={handleGenerateAi}
                    className="bg-purple-500 text-white font-semibold font-display text-xs py-2 px-5 rounded-lg hover:bg-purple-400 transition-all cursor-pointer flex items-center gap-1 ml-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Compile AI Explain</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI SECURITY ADVISER EXPLAINER PANEL */}
            <AnimatePresence mode="wait">
              {generating ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-900/50 border border-purple-500/20 p-8 rounded-3xl text-center"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
                  <h4 className="font-display font-semibold text-white">Gemini AI Model Translating Signals...</h4>
                  <p className="text-xs text-gray-500 font-mono mt-1">GENERATING EASY-TO-READ SURVIVAL GUIDE</p>
                </motion.div>
              ) : explanationGenerated ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 border border-purple-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                  
                  {/* AI Header */}
                  <div className="flex items-center gap-3 border-b border-gray-800 pb-5 mb-5">
                    <div className="p-2.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl">
                      <Sparkles className="w-5 h-5 fill-purple-400/10" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">AI SECURITY ADVISER REPORT TRANSLATION</span>
                      <h3 className="font-display font-bold text-lg text-white">How to Resolve This Scan Alert</h3>
                    </div>
                  </div>

                  {/* Standardized 7 parts format */}
                  <div className="space-y-6 text-sm text-gray-300">
                    
                    {/* 1. Simple Summary */}
                    <div>
                      <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 font-bold">1. Simple Summary:</h4>
                      <p className="text-gray-200 font-sans leading-relaxed">{activePreset.aiResponse.summary}</p>
                    </div>

                    {/* 2. Why This Matters */}
                    <div>
                      <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 font-bold">2. Why This Matters:</h4>
                      <p className="text-gray-200 font-sans leading-relaxed">{activePreset.aiResponse.whyItMatters}</p>
                    </div>

                    {/* 3. Risk Explanation */}
                    <div>
                      <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 font-bold">3. Risk Explanation:</h4>
                      <p className="text-gray-200 font-sans leading-relaxed">{activePreset.aiResponse.riskExplanation}</p>
                    </div>

                    {/* 4. What SecureVault Can Fix */}
                    <div>
                      <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-1 font-bold">4. What SecureVault Can Fix:</h4>
                      <p className="text-gray-200 font-sans leading-relaxed">{activePreset.aiResponse.canFix}</p>
                    </div>

                    {/* 5. Manual Review Needed */}
                    <div className="bg-yellow-500/3 border border-yellow-500/10 p-4 rounded-xl">
                      <h4 className="text-[10px] font-mono text-yellow-500 uppercase tracking-widest mb-1.5 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>5. Manual Review Required:</span>
                      </h4>
                      <p className="text-gray-250 text-xs font-sans leading-relaxed">{activePreset.aiResponse.manualReviewNeeded}</p>
                    </div>

                    {/* 6. Recommended Next Steps */}
                    <div>
                      <h4 className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mb-2.5 font-bold">6. Recommended Next Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-300 font-mono">
                        {activePreset.aiResponse.nextSteps.map((step, idx) => (
                          <li key={idx} className="leading-snug">
                            <span className="text-gray-200 font-sans">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* 7. Safety Note */}
                    <div className="border-t border-gray-800/85 pt-4 text-xs font-mono text-gray-500 leading-normal">
                      <strong>7. Technical Security Note:</strong> {activePreset.aiResponse.safetyNote}
                    </div>

                  </div>

                </motion.div>
              ) : null}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
