/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Megaphone, Heart, Sparkles, Check, Smartphone, 
  ChevronRight, Calendar, Mail, User, ShieldAlert, Loader2, FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import appLogo from "../assets/images/secure_vault_logo_1779581755129.png";
import { 
  saveLaunchNotificationRow, 
  connectGoogleSheets, 
  getCachedToken, 
  getSheetsUserEmail 
} from "../lib/googleSheets";
import { auth } from "../lib/firebase";

export default function ComingSoon() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>([]);
  const [expectedFeatures, setExpectedFeatures] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1482);
  
  // Google Sheets integration state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSheetUrl, setSyncedSheetUrl] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [recentSupporters, setRecentSupporters] = useState<{ name: string; city: string; time: string }[]>([
    { name: "Aarav S.", city: "Hyderabad", time: "2 mins ago" },
    { name: "Priya M.", city: "Mumbai", time: "15 mins ago" },
    { name: "Ketan D.", city: "Bengaluru", time: "34 mins ago" },
    { name: "Sunita G.", city: "Jaipur", time: "1 hr ago" }
  ]);

  useEffect(() => {
    // Increment waitlist from LocalStorage memory
    const storedCount = localStorage.getItem("securevault_waitlist_count");
    if (storedCount) {
      setWaitlistCount(parseInt(storedCount));
    } else {
      localStorage.setItem("securevault_waitlist_count", "1482");
    }
    
    const isSubmitted = localStorage.getItem("securevault_waitlist_submitted");
    if (isSubmitted === "true") {
      setSubmitted(true);
    }
  }, []);

  const handleLanguageToggle = (lang: string) => {
    if (preferredLanguages.includes(lang)) {
      setPreferredLanguages(preferredLanguages.filter(l => l !== lang));
    } else {
      setPreferredLanguages([...preferredLanguages, lang]);
    }
  };

  const handleFeatureToggle = (feat: string) => {
    if (expectedFeatures.includes(feat)) {
      setExpectedFeatures(expectedFeatures.filter(f => f !== feat));
    } else {
      setExpectedFeatures([...expectedFeatures, feat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    setIsSyncing(true);
    setSyncError(null);
    setSyncedSheetUrl(null);

    const isAdmin = auth.currentUser?.email === "securevaultappofficial@gmail.com" ||
      auth.currentUser?.email?.includes("securevaultappofficial");

    try {
      // Unconditionally sync to the developer's sheet in the background!
      const result = await saveLaunchNotificationRow({
        name: userName,
        email: userEmail,
        languages: preferredLanguages,
        features: expectedFeatures
      });
      setSyncedSheetUrl(result.spreadsheetUrl);
    } catch (err: any) {
      console.warn("Failed to sync launch notification to Google Sheets in background:", err);
      if (isAdmin) {
        setSyncError(err.message || "Admin sheets not syncable. Refresh authorization in Support screen.");
      }
    } finally {
      setIsSyncing(false);

      // Simulate database persistent backup
      const newCount = waitlistCount + 1;
      setWaitlistCount(newCount);
      localStorage.setItem("securevault_waitlist_count", newCount.toString());
      localStorage.setItem("securevault_waitlist_submitted", "true");
      
      // Add client user to anonymous log
      const initials = userName.split(" ")[0];
      const userLog = {
        name: initials.substring(0, 10) + (userName.length > 10 ? "..." : "") + ".",
        city: "Your Location",
        time: "Just now"
      };

      setRecentSupporters([userLog, ...recentSupporters.slice(0, 3)]);
      setSubmitted(true);
    }
  };

  const IndianLanguages = [
    "English", "Hindi (हिन्दी)", "Telugu (తెలుగు)", "Tamil (தமிழ்)", 
    "Kannada (ಕನ್ನಡ)", "Marathi (मराठी)", "Bengali (বাংলা)", "Gujarati (ગુજરાતી)"
  ];

  const expectationList = [
    "Smart Scan Heuristics", "Malware Risk Checker", "Link Protection Sandbox",
    "AI Explanatory Adviser", "Daily Scam Warning Feeds", "Local Language Translation"
  ];

  return (
    <div className="py-12 bg-slate-950 text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel Waitlist form details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 bg-cyan-400/10 border border-cyan-400/20 py-1.5 px-4 rounded-full text-cyber-cyan text-xs font-mono select-none">
              <img 
                src={appLogo} 
                alt="SecureVault Logo" 
                className="w-4 h-4 rounded-md object-cover border border-cyan-500/30" 
                referrerPolicy="no-referrer"
              />
              <span className="font-semibold tracking-wider">Launch Tracker: V1 Under Construction</span>
            </div>

            <h1 className="font-display font-medium text-4xl sm:text-5xl text-white tracking-tight leading-none">
              Witness the <span className="text-cyber-cyan">SecureVault</span> Journey
            </h1>

            <p className="text-base text-gray-400 leading-relaxed max-w-xl font-sans">
              We are actively coding the initial launch of SecureVault V1. When ready, the application package will be available <strong>exclusively</strong> from official safe repositories to guarantee secure verification.
            </p>

            {/* Social Trust count counters */}
            <div className="grid grid-cols-3 gap-4 border-y border-gray-900 py-6 max-w-lg">
              <div>
                <span className="text-2xl font-bold font-mono text-white block">{waitlistCount}</span>
                <span className="text-[10px] text-gray-500 font-mono uppercase block">Supporters Enrolled</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-cyber-green block">98%</span>
                <span className="text-[10px] text-gray-500 font-mono uppercase block">Transparency Rating</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-mono text-purple-400 block">8+ Dialects</span>
                <span className="text-[10px] text-gray-500 font-mono uppercase block">Indian Languages</span>
              </div>
            </div>

            {/* Safety Warning Notice from prompt */}
            <div className="bg-[#0b0f16] border border-gray-800 p-5 rounded-2xl flex gap-3.5 items-start max-w-xl text-xs">
              <ShieldAlert className="w-5 h-5 text-cyber-cyan flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-0.5 uppercase tracking-wide font-display text-[11px]">Download Authenticity warning:</strong>
                <p className="text-gray-400 leading-relaxed font-sans">
                  Always download SecureVault strictly from our official website or Google Play Store listing. Never register packages shared via unsolicited WhatsApp messages or third-party blogs.
                </p>
              </div>
            </div>

            {/* Recent Supporters logs */}
            <div className="max-w-xl">
              <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-wide mb-2.5">Global Engagement Track:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                {recentSupporters.map((sup, idx) => (
                  <div key={idx} className="bg-slate-900/40 border border-gray-900 p-2.5 rounded-xl">
                    <span className="text-white block font-semibold truncate">{sup.name}</span>
                    <span className="text-gray-500 text-[10px] block">{sup.city}</span>
                    <span className="text-cyber-cyan/60 text-[9px] block font-mono mt-0.5">{sup.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel Waitlist signup form cards */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="bg-slate-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl"></div>
                  
                  <h3 className="font-display font-bold text-xl text-white tracking-tight mb-4">Request Launch Notification</h3>
                  
                  <div className="space-y-4">
                    
                    {/* User Name input */}
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-gray-400">FullName :</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          <User className="w-4 h-4" />
                        </span>
                        <input 
                          type="text" 
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full bg-slate-950 border border-gray-800 focus:border-cyber-cyan focus:outline-none p-2.5 pl-9 rounded-xl text-xs text-gray-200 font-sans"
                          placeholder="Saathvik B."
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-gray-400">Email Address :</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input 
                          type="email" 
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-gray-800 focus:border-cyber-cyan focus:outline-none p-2.5 pl-9 rounded-xl text-xs text-gray-200 font-sans"
                          placeholder="client@mail.in"
                        />
                      </div>
                    </div>

                    {/* Preferred native languages checkboxes */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 block pb-0.5">Which languages do you check logs in? (Optional)</label>
                      <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto border border-gray-900 bg-slate-950 p-2 rounded-xl scrollbar-thin">
                        {IndianLanguages.map((lang) => {
                          const isChecked = preferredLanguages.includes(lang);
                          return (
                            <label key={lang} className="flex items-center gap-2 text-[11px] p-1 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleLanguageToggle(lang)}
                                className="accent-cyber-cyan rounded"
                              />
                              <span className={isChecked ? "text-white" : "text-gray-400"}>{lang}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Expectations checklists */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 block pb-0.5">Which features are you most excited about?</label>
                      <div className="grid grid-cols-2 gap-1.5 border border-gray-900 bg-slate-950 p-2 rounded-xl text-[10px]">
                        {expectationList.map((feat) => {
                          const isChecked = expectedFeatures.includes(feat);
                          return (
                            <label key={feat} className="flex items-center gap-2 p-1 cursor-pointer">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleFeatureToggle(feat)}
                                className="accent-cyber-cyan rounded"
                              />
                              <span className={isChecked ? "text-white" : "text-gray-450"}>{feat}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {syncError && (
                    <div className="text-[10px] font-mono text-left text-red-400 bg-red-950/20 border border-red-500/15 p-2 rounded-lg mt-2 font-sans">
                      ⚠ {syncError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSyncing}
                    className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold font-display text-sm py-3.5 rounded-xl shadow-md active:scale-95 transition-transform duration-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:scale-100"
                  >
                    <span>{isSyncing ? "Saving position..." : "Secure My Free Invite Tracker"}</span>
                    {isSyncing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <div className="mt-3.5 text-center">
                    <span className="text-[10px] text-gray-500 font-mono">WE PROMISE ZERO MARKETING SMS SPAM</span>
                  </div>
                </motion.form>
              ) : (
                /* SUCCESS VIEW STATE */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl relative"
                >
                  <div className="w-14 h-14 bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-xl font-bold shadow-[0_0_15px_rgba(0,212,255,0.15)]">
                    <Check className="w-7 h-7 text-cyber-cyan" />
                  </div>

                  <h3 className="font-display font-bold text-xl text-white">You're on the Secure list!</h3>
                  
                  <p className="text-sm text-gray-400 font-sans leading-relaxed">
                    Thank you <strong>{userName}</strong>! We'll notify you securely at <strong>{userEmail}</strong> the moment SecureVault V1 enters public testing directories.
                  </p>

                  <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 text-left text-xs font-mono text-gray-500">
                    <span className="text-cyber-green font-bold block mb-1">WAITLIST RECEIPT ISSUED:</span>
                    <div>• Verified Slot: #{waitlistCount}</div>
                    <div>• Preferred Languages: {preferredLanguages.join(", ") || "English"}</div>
                    <div>• Notification Preference: Secured email-dispatch only</div>
                  </div>

                  {syncedSheetUrl && (
                    <div className="bg-slate-950 p-4 rounded-xl border border-cyan-900/40 space-y-2 text-center max-w-sm mx-auto shadow-inner">
                      <div className="flex items-center gap-2 justify-center text-xs text-cyber-cyan font-semibold">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Saved to Google Sheets!</span>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal font-sans">
                        Spreadsheet <strong>SecureVault - Launch Notifications</strong> was updated.
                      </p>
                      <a 
                        href={syncedSheetUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-400 text-[10px] font-mono font-bold px-3 py-1.5 rounded-lg border border-cyan-500/30 transition-colors"
                      >
                        Open Spreadsheet ↗
                      </a>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 font-mono flex items-center justify-center gap-1">
                    <Heart className="w-3 px-0.5 text-red-500 fill-red-500" />
                    <span>Saathvik Bonakurthi says big thank you!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
