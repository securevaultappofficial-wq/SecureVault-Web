/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import HeroScanner from "./HeroScanner";
import { 
  Shield, AlertTriangle, Battery, Trash2, Link2, Sparkles, 
  FileText, ArrowRight, UserCheck, CheckCircle2, User, HelpCircle, Heart, Lock 
} from "lucide-react";
import appLogo from "../assets/images/secure_vault_logo_1779581755129.png";

interface HomeViewProps {
  setPage: (page: string) => void;
}

export default function HomeView({ setPage }: HomeViewProps) {
  
  const handleExploreFeatures = () => {
    setPage("features");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScamSafety = () => {
    setPage("scams");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJoinWaitlist = () => {
    setPage("download");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-cyber-bg text-gray-300 font-sans selection:bg-cyan-500/30 selection:text-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28 border-b border-gray-900 cyber-grid">
        <div className="absolute top-1/4 left-1/12 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/12 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Message text block */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2.5 bg-cyan-500/10 border border-cyan-500/20 py-1.5 px-4 rounded-full text-cyber-cyan text-xs font-mono select-none">
                <img 
                  src={appLogo} 
                  alt="SecureVault Logo" 
                  className="w-5 h-5 rounded-md object-cover border border-cyan-500/30 shadow-[0_0_8px_rgba(0,212,255,0.3)]" 
                  referrerPolicy="no-referrer"
                />
                <span className="font-semibold tracking-wider">SecureVault V1 Trust Campaign</span>
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight">
                SecureVault V1
                <span className="block mt-2 bg-gradient-to-r from-cyber-cyan via-cyber-green to-emerald-400 bg-clip-text text-transparent">
                  Smart Security. Simple Guidance.
                </span>
              </h1>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                SecureVault helps users scan device risks, detect suspicious installer files, check risky clipboard links, clean cache junk safely, and stay alert from digital scams with clear AI-powered explanations.
              </p>

              {/* Action Buttons blocks */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <button
                  onClick={handleExploreFeatures}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold font-display text-sm px-6 py-3.5 rounded-xl transition-all shadow-md active:scale-95 duration-200 cursor-pointer flex items-center gap-2"
                >
                  <span>Explore Features V1</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
                <button
                  onClick={handleScamSafety}
                  className="bg-slate-900 border border-gray-800 hover:border-gray-700 text-gray-200 hover:text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Scam Safety Tutorials
                </button>
                <button
                  onClick={handleJoinWaitlist}
                  className="bg-purple-950/20 border border-purple-500/30 hover:border-purple-400/50 text-purple-300 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-250 cursor-pointer"
                >
                  Join Waitlist
                </button>
              </div>

              {/* Best Trust Message from prompt requirements */}
              <div className="border-t border-gray-900 pt-6.5 max-w-xl mx-auto lg:mx-0">
                <p className="text-xs text-gray-500 font-sans italic leading-relaxed text-center lg:text-left">
                  🇮🇳 <strong>Best Trust Clause:</strong> SecureVault is built to help users understand digital risks clearly — without fake 100% protection claims, fear-based alerts, or confusing reports.
                </p>
              </div>

            </div>

            {/* Right Hero Mobile Simulator Embeds */}
            <div className="lg:col-span-5 flex justify-center w-full">
              <HeroScanner />
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION */}
      <section className="py-20 border-b border-gray-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block">Active Threat Context</span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight mt-1">
              Digital risks are becoming harder to understand
            </h2>
            <p className="mt-4 text-base text-gray-400 leading-relaxed font-sans">
              Everyday users face suspicious APK files, fake links, digital arrest extortion threats, storage junk, and security logs they literally do not understand. Here is the daily friction we address:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Suspicious APK Installers",
                desc: "Apps sent directly inside messaging apps claiming to represent electricity boards or free rewards that silently intercept your banking SMS."
              },
              {
                title: "Fake Login Links",
                desc: "Text messages containing shortened masked URLs mimicking NetBanking pages to capture passwords underSIM block threats."
              },
              {
                title: "Confusing Risk Scores",
                desc: "Antivirus reports using deep technical jargon that scare citizens instead of instructing them on how to fix things."
              },
              {
                title: "Invasive Screensharing Traps",
                desc: "Tricksters direct older family members to install remote controllers (AnyDesk) to look into accounts, draining them fully."
              },
              {
                title: "Accumulated Cache Clutter",
                desc: "Temporary residual files and folders that clog handset storage space, making mobile hardware laggy."
              },
              {
                title: "Digital Arrest Spoofing",
                desc: "Extortionists calling parents posing as CBI or police investigators over video, blackmailing under arrest pretexts."
              }
            ].map((prob, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/45 border border-gray-900 p-5 rounded-2xl hover:border-gray-800 transition-all group"
              >
                <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center mb-4 border border-red-500/10 group-hover:bg-red-500/15">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="font-display font-bold text-white text-base tracking-tight mb-2">
                  {prob.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {prob.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. SOLUTION SECTION */}
      <section className="py-20 border-b border-gray-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-cyber-cyan uppercase tracking-widest block">Safe Solutions</span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight mt-1">
              SecureVault turns security confusion into clear action
            </h2>
            <p className="mt-4 text-base text-gray-400 leading-relaxed font-sans">
              SecureVault V1 empowers family safety through lightweight, manual, and highly informative modules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Smart Scan Audit",
                desc: "Checks accessible handset risk indicators, unverified permissions status, and summarizes health status dynamically.",
                icon: <FileText className="w-5 h-5" />
              },
              {
                title: "Malware Risk Check",
                desc: "Scans Download folders pattern matrices to locate unverified APK installers posing Trojan elements.",
                icon: <Shield className="w-5 h-5" />
              },
              {
                title: "Safe Junk Cleaner",
                desc: "Extracts system cache files, obsolete log leftovers, and residual directories with clear user review controls.",
                icon: <Trash2 className="w-5 h-5" />
              },
              {
                title: "Link Protection Sandbox",
                desc: "Unmasks shortened URLs and highlights phishing domains before you physically direct browser entries.",
                icon: <Link2 className="w-5 h-5" />
              },
              {
                title: "AI Security Adviser",
                desc: "Integrates with modern Gemini intelligence to translate technical report parameters into simple plain-English directives.",
                icon: <Sparkles className="w-5 h-5 text-purple-400" />
              },
              {
                title: "Chronicle Reports",
                desc: "Saves a diagnostic timeline history on-device to track risk logs resolves over current quarters.",
                icon: <FileText className="w-5 h-5" />
              }
            ].map((sol, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/60 border border-gray-800 p-6 rounded-2xl flex flex-col justify-between hover:border-cyan-500/20 transition-all cursor-pointer"
                onClick={handleExploreFeatures}
              >
                <div>
                  <div className="p-2.5 bg-cyan-500/10 text-cyber-cyan w-fit rounded-xl border border-cyan-500/10 mb-4.5">
                    {sol.icon}
                  </div>
                  <h3 className="font-display font-bold text-white text-base tracking-tight mb-2">
                    {sol.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-sans">
                    {sol.desc}
                  </p>
                </div>
                
                <span className="text-[10px] text-cyber-cyan font-mono flex items-center gap-1 mt-4 hover:underline">
                  <span>Learn how this protects trust</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. TRUST BUILDER SECTION */}
      <section className="py-20 border-b border-gray-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block">Ethical Integrity Manifesto</span>
            <h2 className="font-display font-semibold text-3xl sm:text-4xl text-white tracking-tight mt-1">
              Built with honesty, not fear
            </h2>
            <p className="mt-4 text-sm sm:text-base text-gray-400 leading-relaxed font-sans">
              We stand strictly against modern cybersecurity software traps that inflate risk ratings to frighten grandparents. SecureVault uses transparent rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            {[
              {
                badge: "No Fake 100% Protection Claims",
                desc: "No software is omnipotent. We explicitly declare that safety counts on client behavioral logic alongside software warning parameters."
              },
              {
                badge: "Strict User Confirmation Required",
                desc: "We never hijack handset system controllers. All logs deletions are physically verified and clicked by you."
              },
              {
                badge: "Plain Language Explanations",
                desc: "Our server-side AI model translates scary binary log structures into helpful guidelines suitable for parents."
              },
              {
                badge: "Android Permissions Disclosure",
                desc: "We explain exactly why a permission is requested under standard Android directories before you grant them."
              },
              {
                badge: "Pristine Privacy Priority",
                desc: "No collection of contacts lists, photo files, SMS logs, or net-banking account codes occurs."
              },
              {
                badge: "Active Social Mission focus",
                desc: "The applet represents a community-centric awareness campaign targeting vulnerable Indian mobile users."
              }
            ].map((badgeItem, idx) => (
              <div 
                key={idx} 
                className="bg-[#0b0e14] border border-gray-900/60 p-6 rounded-2xl text-center flex flex-col items-center justify-center p-5 scale-98 hover:scale-100 transition-transform hover:border-gray-800"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-cyber-green border border-emerald-500/15 flex items-center justify-center mb-3 text-xs font-mono">
                  ✓
                </div>
                <h4 className="font-display font-bold text-white text-sm mb-1.5">{badgeItem.badge}</h4>
                <p className="text-gray-400 text-xs leading-relaxed font-sans">{badgeItem.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. DEVELOPER / MISSION SECTION */}
      <section className="py-20 border-b border-gray-900 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-gray-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl opacity-40"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-mono text-cyber-green uppercase tracking-wider block">Initiative Founder Profile</span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                  Built with a mission to protect everyday users
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
                  The digital explosion in India has connected millions—including parents, rural families, and small merchants. Unfortunately, these early smartphone users have become primary targets for extremely predatory scam networks using fake court notices, video arrest threats, and fake banking updates.
                </p>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                  SecureVault represents a passionate effort to protect our families by replacing fear with practical, easily understandable local guidance.
                </p>
                
                {/* Team member citation details */}
                <div className="flex items-center gap-3 pt-3">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 text-cyber-cyan rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-semibold tracking-wide">Saathvik Bonakurthi</h4>
                    <span className="text-[10px] text-gray-500 font-mono block">Student Developer & Digital Safety Campaigner</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-950 border border-gray-855 rounded-2xl p-5 text-center space-y-4 relative">
                <div className="w-12 h-12 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl mx-auto flex items-center justify-center">
                  <Lock className="w-6 h-6 text-red-500" />
                </div>
                <h4 className="font-display font-bold text-white text-sm">Emergency Indian Telephony Escapes</h4>
                <p className="text-xs text-gray-400 leading-normal">
                  OTP compromised or money wired within the last hour? Dial Indian National Cyber Bureau helpline immediately.
                </p>
                <a 
                  href="tel:1930" 
                  className="bg-red-500/15 hover:bg-red-500 hover:text-white border border-red-500/40 text-red-400 font-mono font-bold text-xs py-2 px-4 rounded-lg block cursor-pointer"
                >
                  Dial Helpline: 1930
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-500/2 blur-3xl opacity-30"></div>
        <div className="max-w-3xl mx-auto px-4 relative space-y-6">
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-white tracking-tight">
            SecureVault V1 is coming soon
          </h2>
          <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed font-sans">
            Follow our pre-launch diagnostics journey and keep your parents fully secure from predatory click-baits. Get notified the moment we enter active directories.
          </p>
          <div className="pt-2">
            <button 
              onClick={handleJoinWaitlist}
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold font-display text-sm px-8 py-3.5 rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <span>Join Free Launch Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
