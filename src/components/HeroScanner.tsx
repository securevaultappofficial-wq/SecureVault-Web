/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, ShieldAlert, ShieldCheck, Binary, Trash2, 
  Link2, Sparkles, FileText, AlertTriangle, Languages, 
  Loader2, Check, ArrowRight, ChevronRight, RefreshCw, Play, Lock, Send, Smartphone, Terminal, Eye, HelpCircle, Power, UserPlus, LogIn, Mail, EyeOff, X, User, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { auth, incrementUserStat, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import appLogo from "../assets/images/secure_vault_logo_1779581755129.png";
import { MOCK_GOOGLE_ACCOUNTS } from "../lib/mockAccounts";

type AppState = 
  | "BOOT" 
  | "SIM_LOGIN"
  | "DASHBOARD" 
  | "SMART_SCAN" 
  | "SMART_SCANNING" 
  | "SMART_RESULTS" 
  | "MALWARE_SCAN" 
  | "MALWARE_SCANNING" 
  | "MALWARE_RESULTS" 
  | "JUNK_CLEANER" 
  | "JUNK_SCANNING" 
  | "JUNK_RESULTS" 
  | "LINK_PROTECTION" 
  | "LINK_SCAN_RESULTS" 
  | "AI_ADVISER"
  | "SCANS_MENU"
  | "SIM_REPORTS"
  | "SIM_MY_ACCOUNT"
  | "SIM_SETTINGS";

interface DeviceError {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  severity: "critical" | "high" | "medium";
}

const SIMULATED_DEVICE_ERRORS: DeviceError[] = [
  {
    id: "err-1",
    title: "Suspicious Script Signature Detected",
    category: "Trojan.SMS_Intercept",
    description: "Detected background listener attempting to monitor incoming SMS parameters for OTP interception.",
    location: "storage/emulated/0/Download/update_service.apk",
    severity: "critical"
  },
  {
    id: "err-2",
    title: "USB Debugging Interface Enabled",
    category: "Vulnerability.ADB_Control",
    description: "USB Debugging allows connected hosts to execute commands and copy files without credential challenge.",
    location: "System / Developer Options",
    severity: "medium"
  },
  {
    id: "err-3",
    title: "Unsigned Executable Package",
    category: "Adware.Click_Trap.Spoof",
    description: "Application package lacks a verified developer signature string, enabling automated background ad clicks.",
    location: "storage/emulated/0/Download/ad_games_installer.apk",
    severity: "high"
  },
  {
    id: "err-4",
    title: "Loose System Overlay Permission",
    category: "Risk.UI_Hijacking",
    description: "An unverified app possesses raw overlay permissions which can mimic legitimate banking inputs.",
    location: "com.whatsapp.modded.launcher",
    severity: "high"
  },
  {
    id: "err-5",
    title: "Weak Wireless handshake Protocol",
    category: "Network.MITM_Vulnerability",
    description: "Current network is configured with weak legacy key-exchange formats, susceptible to active passive sniffing.",
    location: "Wi-Fi Config / Router handshake",
    severity: "medium"
  }
];

export default function HeroScanner() {
  const [phoneState, setPhoneState] = useState<AppState>("BOOT");
  const [simSelectedAccount, setSimSelectedAccount] = useState<any>(null);
  
  // Custom device settings states
  const [settingsHeuristics, setSettingsHeuristics] = useState(true);
  const [settingsMalware, setSettingsMalware] = useState(true);
  const [settingsLink, setSettingsLink] = useState(true);
  const [settingsBattery, setSettingsBattery] = useState(false);
  const [settingsDeepDir, setSettingsDeepDir] = useState(true);

  // Simulated malware scan error list state
  const [malwareErrors, setMalwareErrors] = useState<DeviceError[]>([
    {
      id: "err-1",
      title: "Suspicious Script Signature Detected",
      category: "Trojan.SMS_Intercept",
      description: "Detected background listener attempting to monitor incoming SMS parameters for OTP interception.",
      location: "storage/emulated/0/Download/update_service.apk",
      severity: "critical"
    },
    {
      id: "err-2",
      title: "USB Debugging Interface Enabled",
      category: "Vulnerability.ADB_Control",
      description: "USB Debugging allows connected hosts to execute commands and copy files without credential challenge.",
      location: "System / Developer Options",
      severity: "medium"
    }
  ]);

  const [showSimGoogleChooser, setShowSimGoogleChooser] = useState(false);
  const [simClickedIndex, setSimClickedIndex] = useState<number | null>(null);
  
  // Loading Boot subtitles array matching video
  const [bootText, setBootText] = useState("Initializing SecureVault...");
  const [bootProgress, setBootProgress] = useState(0);

  // Smart scan states
  const [smartProgress, setSmartProgress] = useState(0);
  const [smartAppsCount, setSmartAppsCount] = useState(0);
  const [smartRisksCount, setSmartRisksCount] = useState(0);
  const [smartStatusMsg, setSmartStatusMsg] = useState("Starting Heuristics Engine...");

  // Malware scan states
  const [malwareProgress, setMalwareProgress] = useState(0);
  const [malwareFilesCount, setMalwareFilesCount] = useState(0);
  const [malwareStatusMsg, setMalwareStatusMsg] = useState("Analyzing system build files...");

  // Junk cleaner state
  const [junkScanned, setJunkScanned] = useState(false);
  const [junkScanningProgress, setJunkScanningProgress] = useState(0);
  const [junkCleaned, setJunkCleaned] = useState(false);
  const [cacheSelected, setCacheSelected] = useState(true);
  const [tempSelected, setTempSelected] = useState(false);
  const [largeSelected, setLargeSelected] = useState(false);

  // Link Protection states
  const [linkInput, setLinkInput] = useState("securevaultapp.com");
  const [linkActiveTab, setLinkActiveTab] = useState<"scan" | "history">("scan");
  const [linkRiskScore, setLinkRiskScore] = useState(0);
  const [linkRiskLevel, setLinkRiskLevel] = useState<"Safe" | "Suspicious" | "Critical">("Safe");
  const [linkReason, setLinkReason] = useState("");
  const [isScanningLink, setIsScanningLink] = useState(false);

  // Chat interface states
  const [chatInput, setChatInput] = useState("");
  const [isTypingReply, setIsTypingReply] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    {
      sender: "bot",
      text: "Greetings. I am SecureVault AI. I can provide you with a comprehensive overview of your environment, answer any security questions or explain scan reports."
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Bootup loading simulation sequence
  useEffect(() => {
    if (phoneState === "BOOT") {
      setBootProgress(0);
      setBootText("Initializing SecureVault...");
      
      const interval = setInterval(() => {
        setBootProgress((prev) => {
          const next = prev + 2;
          if (next >= 100) {
            clearInterval(interval);
            setPhoneState("SIM_LOGIN");
            return 100;
          }
          
          if (next < 25) {
            setBootText("Initializing SecureVault...");
          } else if (next < 50) {
            setBootText("Activating security core...");
          } else if (next < 70) {
            setBootText("Syncing scan modules...");
          } else if (next < 90) {
            setBootText("Preparing protection dashboard...");
          } else {
            setBootText("SecureVault Ready...");
          }
          return next;
        });
      }, 70);
      
      return () => clearInterval(interval);
    }
  }, [phoneState]);

  // Smart scan animation sequence
  useEffect(() => {
    if (phoneState === "SMART_SCANNING") {
      setSmartProgress(0);
      setSmartAppsCount(0);
      setSmartRisksCount(0);
      
      const interval = setInterval(() => {
        setSmartProgress((prev) => {
          const next = prev + 2.5;
          setSmartAppsCount(Math.min(538, Math.floor((next / 100) * 538)));
          setSmartRisksCount(Math.min(282, Math.floor((next / 100) * 282)));

          if (next < 20) {
            setSmartStatusMsg("Checking apps, permissions, storage, device settings, and network status...");
          } else if (next < 45) {
            setSmartStatusMsg("Starting Smart Scan... Your device security score is being calculated.");
          } else if (next < 75) {
            setSmartStatusMsg("Evaluating risky notification system listener filters...");
          } else if (next < 95) {
            setSmartStatusMsg("Inspecting potential background clipboard links...");
          } else {
            setSmartStatusMsg("Finalizing cryptographic summary check...");
          }

          if (next >= 100) {
            clearInterval(interval);
            setPhoneState("SMART_RESULTS");
            
            // Increment statistics in real Cloud Firestore database
            if (auth.currentUser) {
              const currentUid = auth.currentUser.uid;
              incrementUserStat(currentUid, {
                noOfScans: 1,
                threatsFound: 2
              }).catch(err => {
                console.error("Error updating scan statistics: ", err);
                handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}`);
              });

              addDoc(collection(db, "users", currentUid, "fixedIssues"), {
                issueTitle: "UrgentBillSupport.apk listen permissions",
                issueType: "Risky App Installer",
                riskLevel: "Critical Risk",
                action: "Selected issues resolved",
                sourceProtector: "Smart Scan",
                spaceFreedBytes: 0,
                fixedAt: serverTimestamp()
              }).catch(err => {
                console.error("Error logging fixedIssue to Firestore:", err);
                handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/fixedIssues`);
              });
            }
            return 100;
          }
          return next;
        });
      }, 80);
      
      return () => clearInterval(interval);
    }
  }, [phoneState]);

  // Malware scan animation sequence
  useEffect(() => {
    if (phoneState === "MALWARE_SCANNING") {
      setMalwareProgress(0);
      setMalwareFilesCount(0);
      
      // Shuffle and pick 2-3 random simulated device errors
      const shuffled = [...SIMULATED_DEVICE_ERRORS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
      setMalwareErrors(selected);
      
      const interval = setInterval(() => {
        setMalwareProgress((prev) => {
          const next = prev + 3;
          setMalwareFilesCount(Math.min(432, Math.floor((next / 100) * 432)));

          if (next < 30) {
            setMalwareStatusMsg("Checking files, apps, APKs, and dangerous permissions...");
          } else if (next < 65) {
            setMalwareStatusMsg("Sweeping application lists for high risk signature packages...");
          } else if (next < 90) {
            setMalwareStatusMsg("Validating installer headers against threat blacklist databases...");
          } else {
            setMalwareStatusMsg("Compiling final threat radar logs...");
          }

          if (next >= 100) {
            clearInterval(interval);
            setPhoneState("MALWARE_RESULTS");
            return 100;
          }
          return next;
        });
      }, 70);

      return () => clearInterval(interval);
    }
  }, [phoneState]);

  // Junk Cleaner scanning progress
  useEffect(() => {
    if (phoneState === "JUNK_SCANNING") {
      setJunkScanningProgress(0);
      
      const interval = setInterval(() => {
        setJunkScanningProgress((prev) => {
          const next = prev + 5;
          if (next >= 100) {
            clearInterval(interval);
            setJunkScanned(true);
            setPhoneState("JUNK_RESULTS");
            return 100;
          }
          return next;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [phoneState]);

  // Scroll to bottom of chat automatically
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTypingReply]);

  // Helper trigger boot
  const rebootSimulator = () => {
    setJunkScanned(false);
    setJunkCleaned(false);
    setPhoneState("BOOT");
  };

  // Helper scan smart
  const startSmartDiagnostic = () => {
    setPhoneState("SMART_SCANNING");
  };

  // Helper scan malware
  const startMalwareScan = () => {
    setPhoneState("MALWARE_SCANNING");
  };

  // Helper junk clean action
  const executeJunkClean = () => {
    setJunkCleaned(true);
    
    if (auth.currentUser) {
      const currentUid = auth.currentUser.uid;
      incrementUserStat(currentUid, {
        safeJunkRemoved: 2.45
      }).catch(err => {
        console.error("Error updating junk telemetry: ", err);
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}`);
      });

      addDoc(collection(db, "users", currentUid, "junkCleanHistory"), {
        spaceFreedMb: 2508.8, // 2.45 GB
        action: "Cleaned system caches & redundant temporary log packages via Simulator screen",
        cleanedAt: serverTimestamp()
      }).catch(err => {
        console.error("Error logging junk clean history to Firestore:", err);
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/junkCleanHistory`);
      });
    }
  };

  // Helper test URL safe check
  const checkLinkSafety = (url: string) => {
    setIsScanningLink(true);
    
    setTimeout(() => {
      setIsScanningLink(false);
      const formatted = url.toLowerCase().trim();
      let risk: "Safe" | "Suspicious" | "Critical" = "Safe";
      let score = 0;
      let reason = "";

      if (formatted.includes("kyc") || formatted.includes("blocked") || formatted.includes("bank") || formatted.includes("verify")) {
        risk = "Critical";
        score = 95;
        reason = "Phishing Domain Trick: Domain matches high-risk bank names paired with high-urgency words and fake verification directories.";
      } else if (formatted.includes("arrest") || formatted.includes("police") || formatted.includes("gov-cbi")) {
        risk = "Critical";
        score = 98;
        reason = "Digital Arrest Spoofing alert: Spoofs law enforcement agency identity. Official institutions only operate via .gov.in URLs.";
      } else if (formatted.includes("win") || formatted.includes("prize") || formatted.includes("gift") || formatted.includes("refund")) {
        risk = "Suspicious";
        score = 75;
        reason = "Redirect traps & UPI reward phishing pattern. High likelihood of immediate monetary debit scammers.";
      } else {
        risk = "Safe";
        score = 5;
        reason = "Clear certificate. No suspicious keywords or unencrypted banking redirects found.";
      }

      setLinkRiskScore(score);
      setLinkRiskLevel(risk);
      setLinkReason(reason);
      setPhoneState("LINK_SCAN_RESULTS");

      // Increment link stats in Firebase
      if (auth.currentUser) {
        const currentUid = auth.currentUser.uid;
        incrementUserStat(currentUid, {
          scannedLinksCount: 1
        }).catch(err => {
          console.error("Error updating scanned links count: ", err);
          handleFirestoreError(err, OperationType.UPDATE, `users/${currentUid}`);
        });

        addDoc(collection(db, "users", currentUid, "linkScanHistory"), {
          link: url,
          safetyStatus: risk,
          siteCategory: risk === "Safe" ? "Reputable Portal" : "Phishing Trap",
          scannedAt: serverTimestamp()
        }).catch(err => {
          console.error("Error logging link scan history: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/linkScanHistory`);
        });
      }
    }, 1500);
  };

  // Helper AI adviser prompt responder
  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = text.trim();
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsTypingReply(true);

    // Track AI questions count
    if (auth.currentUser) {
      const currentUid = auth.currentUser.uid;
      addDoc(collection(db, "users", currentUid, "aiSecurityAdviserChats"), {
        question: userMsg,
        answer: "Typing automated response...",
        category: "interactive_simulator_chat_prompt",
        timestamp: serverTimestamp()
      }).catch(err => {
        console.error("Error logging chat query to Firestore:", err);
        handleFirestoreError(err, OperationType.CREATE, `users/${currentUid}/aiSecurityAdviserChats`);
      });
    }

    // Dynamic responses matching standard options
    setTimeout(() => {
      setIsTypingReply(false);
      let reply = "I am analyzing your prompt. Remember: Never share bank OTP, credit credentials, or UPI PIN with any callers claiming to be law authorities or customer support representatives.";
      
      const queryText = userMsg.toLowerCase();
      if (queryText.includes("firestore")) {
        reply = "Cloud Firestore (often simply called Firestore) is a flexible, highly scalable NoSQL cloud database built by Google.\n\n### Key Functional Characteristics\n* **NoSQL Document Model:** Stores data inside documents grouped into collections.\n* **Serverless structure:** Scaled automatically.\n\n### Security Perspective\nFirestore uses client-side Firebase Security Rules to restrict unauthorized reads and writes safely, enforcing secure owner-only document parameters.";
      } else if (queryText.includes("score")) {
        reply = "SecureVault measures active application access settings, clipboard state files, junk data reserves, and scan results. Your Current score is **82/100 (Good)**.\n\nTo raise this to a perfect 100/100:\n- Clean Safe Cache files (frees 2.45 GB).\n- Uninstall unverified suspicious apk bundles.";
      } else if (queryText.includes("scan")) {
        reply = "SecureVault scans files by parsing installers metadata, file extensions, and double suffixes. We flag double extension anomalies (e.g., invoice.pdf.apk) and scam package names beforehand.";
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: reply }]);
    }, 1500);
  };

  return (
    <div className="relative w-full max-w-[340px] md:max-w-[365px] mx-auto z-10 transition-all duration-300">
      
      {/* Dynamic colorful retro glowing backdrop */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-400/10 via-purple-500/10 to-emerald-400/10 rounded-[48px] blur-2xl animate-pulse"></div>
      
      {/* CSS internal keyframe animations styled beautifully */}
      <style>{`
        @keyframes spin-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .glowing-orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid transparent;
          background: linear-gradient(#050c18, #050c18) padding-box,
                      linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #06b6d4, #6366f1, #a855f7) border-box;
        }
      `}</style>

      {/* Phone physical bezel mockup */}
      <div className="relative bg-[#0d1527] border-[7px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden outline outline-1 outline-gray-700/60">
        
        {/* Notch dynamic island element */}
        <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-slate-900 rounded-full mr-12 border border-slate-800"></div>
          <div className="w-1 h-1 bg-slate-950 rounded-full"></div>
        </div>

        {/* Operating System Screen Frame wrapper */}
        <div id="phone-screen-display" className="bg-[#050A12] h-[645px] pt-10 pb-6 px-4 flex flex-col justify-between select-none relative font-sans text-white overflow-hidden">
          
          {/* OS status bar */}
          <div className="absolute top-1 left-0 right-0 px-6 flex justify-between items-center text-[9px] font-mono text-gray-500 z-30 select-none">
            <span className="font-semibold text-[8.5px] uppercase tracking-wider text-cyan-500/80">SecureVault OS V1</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4.5 h-2.5 bg-cyan-400/20 rounded-sm overflow-hidden flex items-center p-0.5">
                <div className="w-3 bg-cyber-green h-full rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* TRANSITION VIEWS WRAPPER */}
          <AnimatePresence mode="wait">
            
            {/* 1. SPLASH BOOT VIEW */}
            {phoneState === "BOOT" && (
              <motion.div 
                key="boot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between items-center py-12"
              >
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  
                  {/* Glowing atomic layout lock logo from the video */}
                  <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                    {/* Glowing outer atom orbital path lines */}
                    <div className="absolute inset-0 border border-red-500/35 rounded-full animate-spin [animation-duration:12s] rotate-12"></div>
                    <div className="absolute inset-1.5 border border-amber-500/35 rounded-full animate-spin [animation-duration:9s] -rotate-45"></div>
                    <div className="absolute inset-3 border border-green-500/40 rounded-full animate-spin [animation-duration:7s] rotate-45"></div>
                    <div className="absolute inset-5.5 border border-cyan-400/40 rounded-full animate-spin [animation-duration:5s] -rotate-12"></div>
                    <div className="absolute inset-7 border border-indigo-400/45 rounded-full animate-spin [animation-duration:11s] rotate-90"></div>
                    <div className="absolute inset-9 border border-purple-500/45 rounded-full animate-spin [animation-duration:13s] -rotate-90"></div>
                    
                    {/* Central cyber key lock circle */}
                    <div className="absolute w-14 h-14 bg-[#0a1224] rounded-full border border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.35)] z-10 scale-95">
                      <Lock className="w-5.5 h-5.5 text-cyber-cyan" />
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold tracking-wide text-gray-200">DEVICE PROTECTION LABS</h3>
                  <span className="text-[10px] text-gray-500 font-mono mt-1">Smart Security Diagnostic Simulator</span>
                </div>

                <div className="w-full max-w-[200px] text-center space-y-2">
                  <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden border border-gray-800">
                    <motion.div 
                      className="bg-gradient-to-r from-cyber-cyan via-purple-500 to-cyber-green h-full rounded-full"
                      style={{ width: `${bootProgress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono tracking-wide h-6">
                    {bootText}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SIMULATED LOGIN VIEW FOR PROTOTYPE STAGE */}
            {phoneState === "SIM_LOGIN" && (
              <motion.div 
                key="sim_login"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-center items-center relative py-4 text-left font-sans"
              >
                <div className="w-full space-y-4 max-w-[280px]">
                  
                  {/* Brand App Logo */}
                  <div className="text-center space-y-1.5">
                    <div className="inline-flex relative">
                      <div className="absolute inset-0 bg-cyan-400/10 rounded-xl blur-md"></div>
                      <div className="relative bg-black border border-cyan-500/30 w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center">
                        <img 
                          src={appLogo} 
                          alt="SecureVault Icon" 
                          className="w-8 h-8 object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                    <h2 className="text-white text-base font-black tracking-tight font-display">SecureVault</h2>
                    <p className="text-[10px] text-gray-500 font-mono tracking-wider">Device Protection Agent</p>
                  </div>

                  {/* Fields Container */}
                  <div className="space-y-2 text-xs">
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Email Address</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          readOnly 
                          value="securevaultappofficial@gmail.com" 
                          className="w-full bg-[#080e19] border border-gray-800 rounded-lg py-2 pl-2.5 pr-8 text-[10.5px] text-gray-300 focus:outline-none"
                        />
                        <Mail className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-600" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider block">Password</label>
                      <div className="relative">
                        <input 
                          type="password" 
                          readOnly 
                          value="dummy_password_length_here_long" 
                          className="w-full bg-[#080e19] border border-gray-800 rounded-lg py-2 pl-2.5 pr-8 text-[10.5px] text-gray-500 focus:outline-none"
                        />
                        <EyeOff className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-600" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-gray-500 py-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded border-gray-800 bg-[#080e19] accent-cyan-500 text-cyan-500 focus:ring-0" />
                        <span>Remember Me</span>
                      </label>
                      <span className="hover:text-cyan-400 transition-colors cursor-pointer">Forgot?</span>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        // Directly boot with default user index (saathvik-b849) if regular email login pressed
                        setSimSelectedAccount(MOCK_GOOGLE_ACCOUNTS[4]); // default to SECUREVAULTAPP OFFICIAL
                        setPhoneState("DASHBOARD");
                      }}
                      className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white py-2 px-3 rounded-lg text-[11px] font-bold tracking-tight text-center flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <Lock className="w-3 h-3 text-cyan-300" />
                      <span>Login</span>
                    </button>

                    <div className="relative py-1 flex items-center justify-center">
                      <span className="absolute inset-x-0 h-px bg-gray-800/80"></span>
                      <span className="relative bg-[#050A12] px-2 text-[8px] font-mono text-gray-500 uppercase tracking-wider">
                        or continue with
                      </span>
                    </div>

                    <button 
                      type="button"
                      onClick={() => setShowSimGoogleChooser(true)}
                      className="w-full bg-white hover:bg-gray-100 text-gray-800 py-2 px-3 rounded-lg text-[11px] font-bold tracking-tight text-center flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                    
                  </div>
                </div>

                {/* Google Chooser Overlay (within smartphone mock limits!) */}
                {showSimGoogleChooser && (
                  <div className="absolute inset-0 bg-black/95 z-55 flex items-center justify-center p-3">
                    <div className="bg-[#1c1c1e] text-gray-200 w-full rounded-2xl border border-gray-800 shadow-2xl p-4 flex flex-col justify-between max-h-[500px] overflow-hidden">
                      
                      {/* Close button inside chooser */}
                      <button 
                        type="button"
                        onClick={() => { setShowSimGoogleChooser(false); setSimClickedIndex(null); }}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Header */}
                      <div className="text-center space-y-1 mb-4 pt-1">
                        <div className="inline-flex relative mb-1">
                          <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-sm"></div>
                          <div className="relative bg-[#0d1527] border border-cyan-500/30 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                            <img 
                              src={appLogo} 
                              alt="SecureVault Icon" 
                              className="w-5.5 h-5.5 object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        <h3 className="text-white text-[12.5px] font-bold tracking-tight">Choose an account</h3>
                        <p className="text-[9.5px] text-gray-400 font-sans">to continue to <span className="text-cyber-cyan font-bold">SecureVault</span></p>
                      </div>

                      {/* Options Scrollable rows list */}
                      <div className="space-y-1 overflow-y-auto max-h-[290px] pr-0.5 scrollbar-none text-left">
                        {MOCK_GOOGLE_ACCOUNTS.map((acc, index) => {
                          const isClicked = simClickedIndex === index;
                          return (
                            <button
                              key={acc.id}
                              type="button"
                              disabled={simClickedIndex !== null}
                              onClick={() => {
                                setSimClickedIndex(index);
                                setTimeout(() => {
                                  setSimSelectedAccount(acc);
                                  setSimClickedIndex(null);
                                  setShowSimGoogleChooser(false);
                                  setPhoneState("DASHBOARD");
                                }, 1200);
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 active:scale-[0.98] transition-all flex items-center justify-between border border-transparent hover:border-gray-800 cursor-pointer disabled:opacity-50"
                            >
                              <div className="flex items-center gap-2.5">
                                {/* Letter circle avatar */}
                                <div className={`w-7.5 h-7.5 rounded-full ${acc.avatarBg} flex items-center justify-center font-bold text-xs text-white select-none`}>
                                  {acc.initial}
                                </div>
                                <div className="leading-tight">
                                  <span className="text-[11px] font-bold text-white block truncate max-w-[145px] font-sans">{acc.name}</span>
                                  <span className="text-[9px] text-gray-400 block mt-0.5 truncate max-w-[145px] font-sans">{acc.email}</span>
                                </div>
                              </div>

                              {isClicked ? (
                                <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin mr-1" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-gray-655" />
                              )}
                            </button>
                          );
                        })}

                        <button 
                          type="button"
                          disabled={simClickedIndex !== null}
                          onClick={() => {
                            setShowSimGoogleChooser(false);
                            setSimSelectedAccount(MOCK_GOOGLE_ACCOUNTS[4]); // default
                            setPhoneState("DASHBOARD");
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-800/80 active:scale-[0.98] transition-all flex items-center gap-2.5 text-gray-450 font-sans"
                        >
                          <div className="w-7.5 h-7.5 rounded-full bg-slate-800 flex items-center justify-center text-gray-400">
                            <UserPlus className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-[11px] font-bold text-gray-300">Add another account</span>
                        </button>
                      </div>

                      {/* Footer Info text */}
                      <p className="text-[8.5px] text-gray-500 text-center leading-normal pt-3 border-t border-gray-900 mt-2 font-sans">
                        No sensitive credentials are logged in secure mode.
                      </p>

                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* 2. MAIN DASHBOARD VIEW - IDENTICAL LAYOUT TO THE MOUNTED VIDEO */}
            {phoneState === "DASHBOARD" && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: -15 }}
                className="flex-1 flex flex-col justify-between py-1 mt-1 text-left"
              >
                
                {/* Security Score Dial Circular Block */}
                <div className="bg-[#080e1a]/85 border border-gray-800/85 p-3.5 rounded-2xl relative shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest font-bold">AI Power Securitas</span>
                    <span className="text-[8.5px] uppercase tracking-wider bg-purple-500/10 text-purple-400 py-0.5 px-2 rounded-full border border-purple-500/25">Premium Active</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-mono tracking-wider">Security Score</span>
                      
                      {/* Sub-text circular alignment dial values */}
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-3xl font-black font-display text-cyber-green leading-none">82</span>
                        <span className="text-xs text-gray-500 font-mono">/100</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-cyber-cyan bg-cyan-500/5 px-2.5 py-0.5 rounded-full border border-cyan-500/20 uppercase tracking-widest">Good Rating</span>
                        
                        <button 
                          onClick={() => {
                            setChatMessages(prev => [
                              ...prev, 
                              { sender: "user", text: "Explain why my security score is 82." },
                              { sender: "bot", text: "Your score is 82/100 because your simulator diagnostic profile indicates: (1) 2.45 GB of safe junk log files can be reclaimed, (2) One unverified suspicious installer app file 'UrgentBillSupport.apk' resides unscanned in background folders." }
                            ]);
                            setPhoneState("AI_ADVISER");
                          }}
                          className="bg-purple-600 hover:bg-purple-500 text-[8.5px] font-bold tracking-wider font-mono text-white py-0.5 px-2 rounded cursor-pointer transition-transform active:scale-95 shadow-sm shadow-purple-500/25"
                        >
                          AI Explain
                        </button>
                      </div>
                    </div>

                    {/* Circular dial tracker canvas layout */}
                    <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-900"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-cyber-green"
                          strokeDasharray="82, 100"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-cyber-green" />
                      </div>
                    </div>
                  </div>

                  {/* Checked Banner */}
                  <div className="mt-3.5 pt-2.5 border-t border-gray-900 flex items-center gap-1.5 text-cyber-green text-[10px] font-medium leading-tight">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Your device is protected. Last scanned check: Today, 10:30 AM</span>
                  </div>
                </div>

                {/* 5 core simulator buttons from the video */}
                <div className="space-y-2 mt-3 flex-1 overflow-y-auto pr-1 select-none scrollbar-thin">
                  
                  {/* Button 1: Smart Scan Check (Primary featured row full width) */}
                  <button 
                    onClick={() => setPhoneState("SMART_SCAN")}
                    className="w-full text-left bg-gradient-to-r from-emerald-950/20 to-slate-900 border border-cyber-green/30 hover:border-cyber-green/50 p-3 rounded-xl flex items-center justify-between transition-all active:scale-[0.98] group cursor-pointer shadow-[0_0_10px_rgba(0,255,136,0.05)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-cyber-green/10 text-cyber-green rounded-xl border border-cyber-green/15 group-hover:scale-105 transition-transform">
                        <Shield className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-[11.5px] font-bold text-white leading-tight">Smart Scan</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-sans">Full device health and privacy check</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cyber-green" />
                  </button>

                  {/* 2x2 grid of other 4 primary feature buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    
                    {/* Active Malware Card */}
                    <button 
                      onClick={() => setPhoneState("MALWARE_SCAN")}
                      className="text-left bg-slate-900/60 border border-gray-800/80 hover:border-red-500/20 p-3 rounded-xl flex flex-col justify-between h-[85px] active:scale-[0.97] transition-all group cursor-pointer"
                    >
                      <div className="p-1.5 bg-red-500/10 text-red-400 rounded-lg border border-red-500/15 w-fit">
                        <Binary className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-white">Malware Scan</h5>
                        <p className="text-[8.5px] text-gray-500 mt-0.5 truncate">Scan threats and logs</p>
                      </div>
                    </button>

                    {/* Active Junk Cleaner Card */}
                    <button 
                      onClick={() => setPhoneState("JUNK_CLEANER")}
                      className="text-left bg-slate-900/60 border border-gray-800/80 hover:border-cyan-400/20 p-3 rounded-xl flex flex-col justify-between h-[85px] active:scale-[0.97] transition-all group cursor-pointer"
                    >
                      <div className="p-1.5 bg-cyan-500/10 text-cyber-cyan rounded-lg border border-cyan-500/15 w-fit">
                        <Trash2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-white">Junk Cleaner</h5>
                        <p className="text-[8.5px] text-gray-500 mt-0.5 truncate">Free up space cleanly</p>
                      </div>
                    </button>

                    {/* Active Link Protection Card */}
                    <button 
                      onClick={() => setPhoneState("LINK_PROTECTION")}
                      className="text-left bg-slate-900/60 border border-gray-800/80 hover:border-emerald-400/20 p-3 rounded-xl flex flex-col justify-between h-[85px] active:scale-[0.97] transition-all group cursor-pointer"
                    >
                      <div className="p-1.5 bg-emerald-500/10 text-cyber-green rounded-lg border border-emerald-500/15 w-fit">
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-white">Link Protection</h5>
                        <p className="text-[8.5px] text-gray-500 mt-0.5 truncate">Analyze SMS urls</p>
                      </div>
                    </button>

                    {/* Active AI security Adviser Card */}
                    <button 
                      onClick={() => setPhoneState("AI_ADVISER")}
                      className="text-left bg-slate-900/60 border border-purple-500/15 hover:border-purple-400/40 p-3 rounded-xl flex flex-col justify-between h-[85px] active:scale-[0.97] transition-all group cursor-pointer"
                    >
                      <div className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/15 w-fit">
                        <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/10" />
                      </div>
                      <div>
                        <h5 className="text-[10.5px] font-bold text-white">AI Adviser</h5>
                        <p className="text-[8.5px] text-gray-500 mt-0.5 truncate">Ask queries in chat</p>
                      </div>
                    </button>

                  </div>

                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-900 flex justify-between items-center text-[10px] text-gray-500 font-mono">
                  <span>Simulated Unit OS</span>
                  <button onClick={rebootSimulator} className="text-gray-400 hover:text-white flex items-center gap-1 p-1 hover:bg-slate-900 rounded cursor-pointer">
                    <RefreshCw className="w-3 h-3" /> Reboot
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. SMART SCAN PREVIEW */}
            {phoneState === "SMART_SCAN" && (
              <motion.div 
                key="smart_scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-2 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4.5 h-4.5 text-cyber-green" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-cyber-green font-mono">Smart Scan Settings</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug">
                    Performs checks of all core parameters on this simulated unit, reviewing unverified apks and dangerous clipboard link flags.
                  </p>

                  <div className="mt-6 bg-[#080d19] p-4 rounded-xl border border-gray-800 space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Scan parameters loaded:</span>
                      <strong className="text-white font-mono">7 Sub-suites</strong>
                    </div>
                    <div className="space-y-2 text-[10.5px] text-gray-400">
                      <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyber-green" /> Clipboard monitoring buffer</div>
                      <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyber-green" /> Cache directories search</div>
                      <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyber-green" /> Background installer files</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={startSmartDiagnostic}
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold font-display py-2.5 rounded-xl active:scale-95 transition-transform cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Start Simulation Scan</span>
                  </button>
                  <button onClick={() => setPhoneState("DASHBOARD")} className="w-full bg-slate-900 border border-gray-800 hover:text-white py-2.5 rounded-xl text-xs text-gray-400 cursor-pointer">
                    Back Report
                  </button>
                </div>
              </motion.div>
            )}

            {/* 4. SMART SCAN IN PROGRESS SCREEN - MATCHING VIDEO SPECIFIC GRAPHICS */}
            {phoneState === "SMART_SCAN_REBUILDING" || phoneState === "SMART_SCANNING" && (
              <motion.div 
                key="smart_scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-2 text-left"
              >
                <div className="text-center pt-1.5">
                  <span className="inline-flex items-center bg-cyan-400/10 border border-cyan-400/20 py-1 px-3.5 rounded-full text-cyber-cyan text-[10px] uppercase tracking-wider font-mono font-semibold mb-2 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Protection Scan Active</span>
                  </span>
                  <p className="text-[10px] text-gray-500 font-mono">DO NOT MINIMIZE DIALOG SIMULATION</p>
                </div>

                {/* Video Orbit Shield Animation element */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-6">
                  {/* Cyber glowing sweep rings */}
                  <div className="absolute inset-0 border border-dashed border-cyan-400/20 rounded-full animate-spin [animation-duration:15s]" />
                  <div className="absolute inset-2 border border-cyan-400/40 rounded-full animate-spin [animation-duration:8s] border-t-cyan-400 border-r-transparent" />
                  
                  {/* Sub-icons scattered along standard positions */}
                  <div className="absolute top-1 left-8 w-4 h-4 rounded-full bg-[#0d1e3a] border border-cyan-400/40 flex items-center justify-center text-[8px] text-cyber-cyan"><Lock className="w-2.5 h-2.5" /></div>
                  <div className="absolute bottom-2 right-6 w-4 h-4 rounded-full bg-[#0d1e3a] border border-cyan-400/40 flex items-center justify-center text-[8px] text-cyber-cyan"><Binary className="w-2.5 h-2.5" /></div>
                  <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-[#0d1e3a] border border-cyan-400/40 flex items-center justify-center text-[8px] text-cyber-cyan"><FileText className="w-2.5 h-2.5" /></div>

                  <div className="text-center z-10 bg-[#060c18]/90 rounded-full p-4 w-24 h-24 border border-cyan-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                    <ShieldCheck className="w-7 h-7 text-cyber-green animate-bounce" />
                    <span className="text-xl font-bold font-mono text-cyan-400 mt-1">{Math.floor(smartProgress)}%</span>
                  </div>
                </div>

                {/* Sub status descriptions tracking progress */}
                <div className="bg-[#03060c] border border-gray-800 p-3 rounded-xl text-[10px] font-mono text-gray-400 flex flex-col gap-1 min-h-[50px]">
                  <span className="text-[8.5px] text-cyber-cyan uppercase font-bold tracking-wider">Scanning Device...</span>
                  <p className="leading-snug text-gray-300 text-[9.5px]">
                    {smartStatusMsg}
                  </p>
                </div>

                {/* Scanned counters bottom bars */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-900 border border-gray-800 p-2 rounded-xl flex items-center gap-2">
                    <Binary className="w-4.5 h-4.5 text-gray-500" />
                    <div>
                      <div className="font-bold text-gray-300 font-mono text-[11px]">{smartAppsCount}</div>
                      <span className="text-gray-500 text-[8.5px]">Apps Checked</span>
                    </div>
                  </div>
                  <div className="bg-slate-900 border border-gray-800 p-2 rounded-xl flex items-center gap-2">
                    <Eye className="w-4.5 h-4.5 text-gray-500" />
                    <div>
                      <div className="font-bold text-gray-300 font-mono text-[11px]">{smartRisksCount}</div>
                      <span className="text-gray-500 text-[8.5px]">Privacy Risks</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* 5. SMART SCAN COMPLETED / RESULTS TAB */}
            {phoneState === "SMART_RESULTS" && (
              <motion.div 
                key="smart_results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1.5 text-left"
              >
                <div className="bg-slate-900/40 p-3 rounded-xl border border-gray-800 text-center space-y-1 select-none">
                  <span className="text-[9px] uppercase tracking-wider text-amber-500 font-bold font-mono">Smart Scan Completed</span>
                  <div className="flex items-center justify-center gap-4 py-1">
                    <div className="w-12 h-12 rounded-full border-4 border-yellow-500/40 border-t-yellow-400 flex items-center justify-center">
                      <span className="text-xs font-black font-mono text-yellow-400">72%</span>
                    </div>
                    <div className="text-left">
                      <h4 className="text-[11.5px] font-bold text-yellow-400">Medium Danger Risks</h4>
                      <p className="text-[9.5px] text-gray-400">2 Items Require Manual Action</p>
                    </div>
                  </div>
                </div>

                {/* Core warnings list matching video flow exactly */}
                <div className="space-y-2 mt-2 flex-1 overflow-y-auto max-h-[310px] scrollbar-thin pr-1">
                  
                  {/* Warning item 1: UrgentBillSupport APK */}
                  <div className="bg-[#0b101c] p-2.5 rounded-xl border border-red-500/25 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold text-red-400 font-mono flex items-center gap-1.5">
                        <Binary className="w-3.5 h-3.5" />
                        UrgentBillSupport.apk
                      </span>
                      <span className="bg-red-500/10 text-[8px] text-red-400 uppercase tracking-wider py-0.5 px-2 rounded-full border border-red-500/20 font-bold">Risky installer APK</span>
                    </div>
                    <p className="text-[9.5px] text-gray-400 leading-relaxed font-sans">
                      SMS_READ_LISTENERS: App silently registers background SMS intercept filters. Frequently used by OTP draining bank scanners.
                    </p>
                    <button 
                      onClick={() => {
                        setChatMessages(prev => [
                          ...prev,
                          { sender: "user", text: "Explain UrgentBillSupport.apk scam details." },
                          { sender: "bot", text: "UrgentBillSupport.apk replicates a popular WhatsApp remote scam tactic. Fake electricity or utility desk employees coerce families to install an APK file under the pretext of clarifying bill defaults. Once executed, the code silently forwards incoming banking SMS OTP verification details directly to their server endpoint targets." }
                        ]);
                        setPhoneState("AI_ADVISER");
                      }}
                      className="bg-purple-900/10 hover:bg-purple-900/30 text-purple-400 font-mono font-bold text-[9px] py-1 px-3 rounded border border-purple-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer w-full"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Explain Risk with AI
                    </button>
                  </div>

                  {/* Warning item 2: Clipboard Phishing Link */}
                  <div className="bg-[#0b101c] p-2.5 rounded-xl border border-yellow-500/25 space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase font-bold text-yellow-500 font-mono flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" />
                        sbi-kyc-verify-login.net
                      </span>
                      <span className="bg-yellow-500/10 text-[8px] text-yellow-500 uppercase tracking-wider py-0.5 px-2 rounded-full border border-yellow-500/20 font-bold">Unsafe Link Clipboard</span>
                    </div>
                    <p className="text-[9.5px] text-gray-400 leading-relaxed font-sans">
                      Captured clipboard URL targets unverified non-encrypted official bank spoof sites. Might capture NetBanking passwords.
                    </p>
                    <button 
                      onClick={() => {
                        setLinkInput("sbi-kyc-verify-login.net");
                        setPhoneState("LINK_PROTECTION");
                        checkLinkSafety("sbi-kyc-verify-login.net");
                      }}
                      className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-[10px] font-bold py-1 px-2.5 rounded border border-yellow-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer w-full"
                    >
                      Test in Link Protector
                    </button>
                  </div>

                  {/* Clean Caches Module Card */}
                  <div className="bg-[#080d1a] p-2.5 rounded-xl border border-gray-800 space-y-1.5">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-gray-300 font-medium font-sans flex items-center gap-1.5">
                        <Trash2 className="w-4 h-4 text-cyber-cyan" />
                        Trash Cache indicators
                      </span>
                      <strong className="text-cyber-cyan font-mono">2.45 GB Found</strong>
                    </div>
                    {junkCleaned ? (
                      <span className="text-[10px] text-cyber-green flex items-center gap-1 font-mono font-bold pt-1">
                        <Check className="w-3.5 h-3.5" /> Space removed. Personal files fully safe.
                      </span>
                    ) : (
                      <button 
                        onClick={executeJunkClean}
                        className="w-full bg-slate-800 hover:bg-slate-700 font-sans text-white text-[10px] font-bold py-1 px-2 rounded transition-transform cursor-pointer"
                      >
                        Wipe redundant log indicators
                      </button>
                    )}
                  </div>

                </div>

                <div className="mt-2.5 flex gap-2">
                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:text-black font-semibold text-black text-xs rounded-xl active:scale-95 transition-transform text-center cursor-pointer"
                  >
                    Go Back Home
                  </button>
                  <button 
                    onClick={startSmartDiagnostic}
                    className="p-2 border border-gray-800 hover:border-gray-700 text-gray-400 rounded-xl cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 6. MALWARE SCAN INDEX DETAIL PREVIEW */}
            {phoneState === "MALWARE_SCAN" && (
              <motion.div 
                key="malware_scan"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-2 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Binary className="w-4.5 h-4.5 text-red-400" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 font-mono">Threat Radar Scan</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-snug font-sans">
                    Sweeps system files recursively detecting malware signatures, Trojan interceptors, empty registries, and corrupted download APK installers.
                  </p>

                  <div className="mt-6 bg-[#080d19] p-4 rounded-xl border border-gray-800 space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Total scanners loaded:</span>
                      <strong className="text-white font-mono">Quarantined filters</strong>
                    </div>
                    <div className="space-y-1.5 text-[10.5px] text-red-400/80 font-mono">
                      <div>* Trojan.SMS_Intercept.Android</div>
                      <div>* Dialer.Click_Traps.Spoof</div>
                      <div>* Malware.Crypto_Wipers.Core</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={startMalwareScan}
                    className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold py-2.5 rounded-xl active:scale-95 transition-transform cursor-pointer text-xs flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Run Interactive Scan</span>
                  </button>
                  <button onClick={() => setPhoneState("DASHBOARD")} className="w-full bg-slate-900 border border-gray-800 hover:text-white py-2.5 rounded-xl text-xs text-gray-400 cursor-pointer text-center">
                    Return Home
                  </button>
                </div>
              </motion.div>
            )}

            {/* 7. MALWARE SCAN IN PROGRESS SWEEPER */}
            {phoneState === "MALWARE_SCANNING" && (
              <motion.div 
                key="malware_scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-2 text-left"
              >
                <div className="text-center pt-1.5">
                  <span className="inline-flex items-center bg-red-400/10 border border-red-400/20 py-1 px-3.5 rounded-full text-red-400 text-[10px] uppercase tracking-wider font-mono font-semibold mb-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 text-red-400" />
                    <span>Radar Threat Scan Active</span>
                  </span>
                </div>

                {/* Rotating threat scan sweep target */}
                <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-6">
                  {/* Outer sweeping line */}
                  <div className="absolute inset-0 border border-red-500/30 rounded-full animate-spin [animation-duration:10s]"></div>
                  
                  {/* Sweep gradient radar overlay */}
                  <div className="absolute inset-2 border-2 border-red-500/40 border-t-red-500 border-r-transparent rounded-full animate-spin [animation-duration:3s]" />

                  <div className="text-center z-10 bg-[#060c18]/90 rounded-full p-4 w-24 h-24 border border-red-500/20 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <AlertTriangle className="w-7 h-7 text-red-500 animate-pulse" />
                    <span className="text-xl font-bold font-mono text-red-400 mt-1">{Math.floor(malwareProgress)}%</span>
                  </div>
                </div>

                {/* Sub status descriptions tracking progress */}
                <div className="bg-[#03060c] border border-gray-800 p-3 rounded-xl text-[10px] font-mono text-gray-400 flex flex-col gap-1 min-h-[50px]">
                  <span className="text-[8.5px] text-red-400 uppercase font-bold tracking-wider">Analyzing logs...</span>
                  <p className="leading-snug text-gray-300 text-[9.5px]">
                    {malwareStatusMsg}
                  </p>
                </div>

                {/* Scanned logs counter boxes */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-900 border border-gray-800 p-2 rounded-xl flex items-center gap-2">
                    <Terminal className="w-4.5 h-4.5 text-gray-500" />
                    <div>
                      <div className="font-bold text-gray-300 font-mono text-[11px]">{malwareFilesCount}</div>
                      <span className="text-gray-500 text-[8.5px]">Files Quarantined</span>
                    </div>
                  </div>
                  <button onClick={() => setPhoneState("MALWARE_RESULTS")} className="bg-slate-900 hover:bg-slate-800 border border-gray-800 p-2 rounded-xl flex items-center justify-center text-[10px] text-gray-400 font-bold font-mono uppercase cursor-pointer">
                    Fast Results
                  </button>
                </div>
              </motion.div>
            )}

            {/* 8. MALWARE RESULTS VIEW - SHOWING DYNAMIC RANDOM DEVICE ERRORS AND NO FIREBASE ERROR */}
            {phoneState === "MALWARE_RESULTS" && (
              <motion.div 
                key="malware_results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-gray-900 pb-1.5 mb-2">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-bold">Threat Quarantine Report</span>
                    <span className="text-[8.5px] uppercase font-bold font-mono tracking-wider bg-red-500/10 border border-red-500/20 text-red-500 py-0.5 px-1.5 rounded">{malwareErrors.length} Risks</span>
                  </div>

                  <p className="text-[9.5px] text-gray-400 leading-snug font-sans mb-3 select-none">
                    Heuristic signature comparison completed successfully. The following warning indicators require correction tags to ensure device isolation integrity:
                  </p>

                  {/* List of randomized device errors */}
                  <div className="space-y-2 max-h-[195px] overflow-y-auto pr-0.5 scrollbar-thin">
                    {malwareErrors.map((err) => (
                      <div 
                        key={err.id} 
                        className="bg-red-950/20 border border-red-500/25 p-2.5 rounded-xl text-[10px] text-red-200 font-sans space-y-1 shadow-[0_2px_8px_rgba(239,68,68,0.02)]"
                      >
                        <div className="flex justify-between items-start gap-1">
                          <div className="flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 select-none mt-0.5 animate-pulse" />
                            <div>
                              <span className="font-bold block text-red-355 font-sans text-[10px] leading-tight">{err.title}</span>
                              <span className="text-[8px] font-mono text-red-400 font-semibold block mt-0.5">{err.category}</span>
                            </div>
                          </div>
                          <span className={`text-[7.5px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                            err.severity === "critical" 
                              ? "bg-red-500 text-white" 
                              : err.severity === "high" 
                                ? "bg-amber-600 text-white" 
                                : "bg-yellow-500 text-black"
                          }`}>
                            {err.severity}
                          </span>
                        </div>

                        <p className="text-[9.5px] text-gray-400 font-sans leading-snug border-l border-red-500/10 pl-2 py-0.5 mt-1.5">
                          {err.description}
                        </p>

                        <div className="text-[8px] font-mono bg-black/40 border border-red-500/5 p-1 rounded break-all text-gray-500 select-all font-semibold">
                          Loc: {err.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <button 
                    onClick={() => {
                      setPhoneState("DASHBOARD");
                    }}
                    className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold py-2 px-3 rounded-xl text-[10.5px] transition-all cursor-pointer text-center"
                  >
                    Apply Quarantine Isolator
                  </button>
                  <button 
                    onClick={() => setPhoneState("SCANS_MENU")}
                    className="w-full bg-slate-900 border border-gray-850 text-gray-400 hover:text-white py-1.5 rounded-lg text-[9.5px] cursor-pointer text-center"
                  >
                    Back to Scans
                  </button>
                </div>
              </motion.div>
            )}

            {/* 9. JUNK CLEANER INTERACTIVE FORM */}
            {phoneState === "JUNK_CLEANER" && (
              <motion.div 
                key="junk_cleaner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Trash2 className="w-4.5 h-4.5 text-cyber-cyan" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-cyber-cyan font-mono">Junk Cleaner Unit</h4>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-snug">
                    Frees storage buffers safely without affecting personal assets like family images or private text files.
                  </p>

                  <div className="bg-[#03060c] p-3.5 rounded-xl border border-gray-800 space-y-2 mt-4">
                    <div className="flex justify-between border-b border-gray-900 pb-1.5">
                      <span className="text-gray-500 text-[10px] font-mono">Storage Permission:</span>
                      <strong className="text-cyber-green text-[10px] font-mono">Enabled</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 text-[10px] font-mono">Last Wipe run:</span>
                      <strong className="text-gray-300 text-[10px] font-mono">None logged yet</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => setPhoneState("JUNK_SCANNING")}
                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyber-cyan font-semibold text-xs py-2.5 rounded-xl transition-all font-display uppercase tracking-wider cursor-pointer"
                  >
                    Scan Storage Space
                  </button>
                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full bg-slate-900 border border-gray-850 hover:text-white py-2.5 rounded-xl text-xs text-gray-450 cursor-pointer text-center"
                  >
                    Back Report
                  </button>
                </div>
              </motion.div>
            )}

            {/* 10. JUNK SCANNING IN PROGRESS ANIMATION VIEW */}
            {phoneState === "JUNK_SCANNING" && (
              <motion.div 
                key="junk_scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-2 text-left"
              >
                <div className="text-center pt-1.5">
                  <span className="inline-flex items-center bg-cyan-400/10 border border-cyan-400/20 py-1 px-3 rounded-full text-cyber-cyan text-[10px] uppercase font-mono font-semibold animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Analyzing temporary files...</span>
                  </span>
                </div>

                <div className="relative w-36 h-36 mx-auto flex items-center justify-center my-6">
                  <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-2xl font-black font-mono text-cyber-cyan">{junkScanningProgress}%</span>
                </div>

                <div className="bg-[#03060c] border border-gray-800 p-3 rounded-xl text-[9.5px] font-mono text-gray-500">
                  Checking Cache log pathways, system folders, double zip files, old logs...
                </div>
              </motion.div>
            )}

            {/* 11. JUNK SCANNING COMPLETED / ACTIVE RESULTS FROM TELEMETRY VIDEO EXAMPLES */}
            {phoneState === "JUNK_RESULTS" && (
              <motion.div 
                key="junk_results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left"
              >
                <div>
                  <div className="bg-[#080d19] rounded-xl border border-gray-900 p-3 flex justify-between items-center items-stretch gap-3 mb-3">
                    <div className="flex-1 text-left">
                      <span className="text-[11px] font-bold text-white block">Clean Storage Safely</span>
                      <p className="text-[9.5px] text-gray-400 mt-1">
                        Select files safe to clear. Personal images are kept secure.
                      </p>
                    </div>

                    <div className="relative w-12 h-12 flex items-center justify-center bg-cyan-950/10 border border-cyan-500/20 rounded-full shrink-0">
                      <Trash2 className="w-5.5 h-5.5 text-cyber-cyan" />
                    </div>
                  </div>

                  {/* 6 Grid Metrics Details from the real video */}
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    
                    <div className="bg-slate-900 border border-gray-850 p-1.5 rounded-lg">
                      <span className="text-cyan-400 text-xs font-bold block">{junkCleaned ? "0 B" : "3.51 GB"}</span>
                      <span className="text-[7.5px] text-gray-500 uppercase tracking-tight">Junk Found</span>
                    </div>

                    <div className="bg-slate-900 border border-gray-850 p-1.5 rounded-lg border-emerald-500/20">
                      <span className="text-cyber-green text-xs font-bold block">{junkCleaned ? "0" : "283.15M"}</span>
                      <span className="text-[7.5px] text-gray-500 uppercase tracking-tight">Clean Safe</span>
                    </div>

                    <div className="bg-slate-900 border border-gray-850 p-1.5 rounded-lg border-yellow-500/20">
                      <span className="text-amber-400 text-xs font-bold block">{junkCleaned ? "0" : "30.15M"}</span>
                      <span className="text-[7.5px] text-gray-500 uppercase tracking-tight">Need Review</span>
                    </div>

                    <div className="bg-slate-900 border border-gray-850 p-1.5 rounded-lg">
                      <span className="text-blue-400 text-xs font-bold block">1.42 MB</span>
                      <span className="text-[7.5px] text-gray-500 uppercase tracking-tight">Duplicates</span>
                    </div>

                    <div className="bg-slate-900 border border-gray-850 p-1.5 rounded-lg">
                      <span className="text-purple-400 text-xs font-bold block">3.20 GB</span>
                      <span className="text-[7.5px] text-gray-500 uppercase tracking-tight">Large Files</span>
                    </div>

                    <div className="bg-slate-900 border border-gray-850 p-1.5 rounded-lg border-cyan-500/10">
                      <span className="text-cyber-cyan text-xs font-bold block">{junkCleaned ? "60.98G" : "57.47G"}</span>
                      <span className="text-[7.5px] text-gray-500 uppercase tracking-tight">Free Space</span>
                    </div>

                  </div>

                  {/* Checklist options of sub categories */}
                  <div className="space-y-1.5 mt-3 max-h-[170px] overflow-y-auto scrollbar-thin pr-1 text-[10px]">
                    <div className="flex items-center justify-between border-b border-gray-900 pb-1.5">
                      <span className="text-gray-400 uppercase font-bold tracking-wider font-mono text-[8.5px]">Junk Categories:</span>
                      <span className="text-amber-500 font-bold font-mono text-[8.5px]">Review before clearing</span>
                    </div>

                    {/* Category 1 */}
                    <div className="flex items-center justify-between p-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={cacheSelected} 
                        onChange={() => setCacheSelected(!cacheSelected)} 
                        className="rounded border-gray-700 pointer-events-auto"
                        disabled={junkCleaned}
                      />
                      <span className="text-gray-300 font-sans ml-2 flex-1">Cache Files (34.17 MB)</span>
                      <span className="text-cyber-green text-[9px] font-mono">Safe</span>
                    </div>

                    {/* Category 2 */}
                    <div className="flex items-center justify-between p-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tempSelected} 
                        onChange={() => setTempSelected(!tempSelected)} 
                        className="rounded border-gray-700 pointer-events-auto"
                        disabled={junkCleaned}
                      />
                      <span className="text-gray-400 font-sans ml-2 flex-1">Temporary logs (0 B)</span>
                      <span className="text-gray-500 text-[9px]">None</span>
                    </div>

                    {/* Category 3 */}
                    <div className="flex items-center justify-between p-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={largeSelected} 
                        onChange={() => setLargeSelected(!largeSelected)} 
                        className="rounded border-gray-700 pointer-events-auto"
                        disabled={junkCleaned}
                      />
                      <span className="text-gray-400 font-sans ml-2 flex-1">Large files (3.20 GB)</span>
                      <span className="text-amber-400 text-[9px]">Review</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  {junkCleaned ? (
                    <div className="bg-emerald-950/15 text-cyber-green border border-emerald-500/20 rounded-xl p-2.5 text-center font-mono font-bold font-display leading-relaxed text-[10px]">
                      ✓ Space reclaimed successfully! Temporary system logs flushed cleanly. Home score improved.
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setCacheSelected(true); setTempSelected(true); }}
                        className="flex-1 py-2 bg-slate-900 border border-gray-800 hover:text-white rounded-lg text-[9.5px] font-semibold text-gray-300 text-center cursor-pointer"
                      >
                        SELECT SAFE
                      </button>
                      
                      <button 
                        onClick={executeJunkClean}
                        className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 font-semibold text-white rounded-lg text-[9.5px] text-center cursor-pointer active:scale-95 transition-transform font-mono"
                      >
                        CLEAN SELECTED
                      </button>
                    </div>
                  )}

                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full py-1.5 bg-slate-950 border border-gray-850 rounded-lg text-gray-400 hover:text-white text-[10px] text-center cursor-pointer"
                  >
                    DASHBOARD HOME
                  </button>
                </div>
              </motion.div>
            )}

            {/* 12. LINK PROTECTION FORM - MULTIPAGE TABS STYLE */}
            {phoneState === "LINK_PROTECTION" && (
              <motion.div 
                key="link_protection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left font-sans"
              >
                <div>
                  <div className="flex border-b border-gray-900 pb-2 mb-3 justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyber-green font-mono flex items-center gap-1">
                      <Link2 className="w-4 h-4 text-cyber-green" /> URL SANDBOX CHECK
                    </span>

                    {/* Sub tabs line */}
                    <div className="flex bg-slate-900/50 p-0.5 rounded-lg border border-gray-805/80 text-[9px] font-bold">
                      <button 
                        onClick={() => setLinkActiveTab("scan")} 
                        className={`py-1 px-2.5 rounded ${linkActiveTab === "scan" ? "bg-slate-950 text-white border border-gray-800" : "text-gray-500"}`}
                      >
                        Scan URL
                      </button>
                      <button 
                        onClick={() => {
                          setLinkActiveTab("history");
                          // Direct test presets if history tapped
                        }} 
                        className={`py-1 px-2.5 rounded ${linkActiveTab === "history" ? "bg-slate-950 text-white border border-gray-800" : "text-gray-500"}`}
                      >
                        History
                      </button>
                    </div>
                  </div>

                  {linkActiveTab === "scan" ? (
                    <div className="space-y-4">
                      <p className="text-[10px] text-gray-400 leading-snug">
                        Scan URLs before opening. Protects against fake utility claims, banking bait profiles, or spoofed credentials logs.
                      </p>

                      <div className="space-y-2.5 mt-2">
                        <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Enter Link below:</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            className="w-full bg-slate-950 border border-gray-850 focus:border-cyber-cyan focus:outline-none p-2 rounded-lg text-xs font-mono text-gray-200"
                            placeholder="sbi-verify-kyk.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[8px] font-mono text-gray-500 block uppercase font-bold tracking-wider">Tap preset to test simulator output:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            "securevaultapp.com",
                            "sbi-kyc-verify-login.net",
                            "gov-cbi-arrest-notice.cc",
                            "free-gift-withdraw.org"
                          ].map((url) => (
                            <button
                              key={url}
                              onClick={() => { setLinkInput(url); checkLinkSafety(url); }}
                              className="text-[9px] font-sans font-medium hover:border-cyber-cyan/35 bg-[#09101f] py-1 px-2.5 rounded-lg border border-gray-850 hover:text-white transition-all text-gray-400 cursor-pointer"
                            >
                              {url}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3.5 mt-2 text-[10px] font-mono">
                      <div className="text-gray-400 flex justify-between items-center bg-slate-950 p-2 rounded border border-gray-855/80">
                        <span className="truncate">securevaultapp.com</span>
                        <span className="text-cyber-green">✓ SAFE</span>
                      </div>
                      <div className="text-gray-400 flex justify-between items-center bg-slate-950 p-2 rounded border border-gray-855/80">
                        <span className="truncate">gov-cbi-arrest-notice.cc</span>
                        <span className="text-red-400">⚠️ CRITICAL</span>
                      </div>
                      <p className="text-[9px] leading-snug text-gray-500 italic text-center font-sans pb-4">
                        All link scans are logged inside your persistent Cloud profile safely. Check "Primary Cloud Explorer" in administrative details!
                      </p>
                    </div>
                  )}

                </div>

                <div className="space-y-2 mt-4">
                  {isScanningLink ? (
                    <div className="bg-[#03060c] p-3 text-center border border-cyan-500/10 rounded-xl flex items-center justify-center gap-2 text-cyan-400 font-mono text-[10px]">
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-cyber-cyan" />
                      <span>Heuristics sweep. Testing URL redirect structure...</span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => checkLinkSafety(linkInput)}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold text-xs rounded-xl hover:from-cyan-400 active:scale-95 transition-transform text-center cursor-pointer font-sans"
                    >
                      SCAN URL
                    </button>
                  )}

                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full py-1.5 bg-slate-950 text-gray-500 hover:text-white font-sans text-[10px] text-center border border-gray-850 rounded-lg cursor-pointer"
                  >
                    RETURN HOME
                  </button>
                </div>
              </motion.div>
            )}

            {/* 13. LINK SCAN RESULTS DETAILED SCREEN */}
            {phoneState === "LINK_SCAN_RESULTS" && (
              <motion.div 
                key="link_results_view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left font-sans"
              >
                <div>
                  <div className="flex justify-between items-center border-b border-gray-900 pb-1 mb-2.5">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyber-green font-bold">Heuristic analysis</span>
                    <button onClick={() => setPhoneState("LINK_PROTECTION")} className="text-[9.5px] text-cyber-cyan font-bold font-sans cursor-pointer hover:underline">
                      Scan another
                    </button>
                  </div>

                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-gray-850/80 text-center space-y-1 mt-2 mb-3">
                    <span className="text-[8.5px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Rating threat rating score</span>
                    
                    <div className="flex items-center justify-center gap-2">
                      <span className={`text-[10.5px] font-bold font-mono py-1 px-3.5 rounded-full border ${
                        linkRiskLevel === "Safe" 
                          ? "bg-emerald-500/10 text-cyber-green border-emerald-500/25" 
                          : linkRiskLevel === "Suspicious"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/25"
                            : "bg-red-500/10 text-red-400 border-red-500/25"
                      }`}>
                        {linkRiskLevel} Status ({linkRiskScore}/100)
                      </span>
                    </div>

                    <div className="pt-2 font-mono text-[10px] text-cyan-400 select-all bg-black/40 p-2.5 rounded text-center truncate italic">
                      {linkInput}
                    </div>
                  </div>

                  <div className="bg-[#03060c] border border-gray-800 p-3 rounded-xl text-[10px] leading-relaxed relative overflow-hidden text-gray-300">
                    <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block font-bold mb-1">Details breakdown:</span>
                    <p className="font-sans text-[9.5px]">
                      {linkReason}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 mt-4">
                  
                  {linkRiskLevel !== "Safe" && (
                    <button 
                      onClick={() => {
                        setChatMessages(prev => [
                          ...prev,
                          { sender: "user", text: `Why is the link ${linkInput} dangerous?` },
                          { sender: "bot", text: `The URL ${linkInput} is classified as highly risky. We analyzed the lexical components and detected unencrypted landing coordinates hosted outside verified bank server parameters. Hackers deploy these lookalike portals to silently log credentials.` }
                        ]);
                        setPhoneState("AI_ADVISER");
                      }}
                      className="w-full py-2 bg-purple-950/20 text-purple-400 font-bold font-mono text-[9.5px] border border-purple-500/15 rounded-lg text-center cursor-pointer flex gap-1.5 items-center justify-center hover:bg-purple-900/15"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                      <span>Explain Link Risk with AI</span>
                    </button>
                  )}

                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full py-2 bg-slate-900 border border-gray-800 rounded-lg text-gray-300 text-[10px] text-center font-bold cursor-pointer hover:text-white"
                  >
                    DASHBOARD HOME
                  </button>
                </div>
              </motion.div>
            )}

            {/* 14. AI SECURITY ADVISER CHAT SCREEN */}
            {phoneState === "AI_ADVISER" && (
              <motion.div 
                key="ai_adviser"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left font-sans h-full"
              >
                {/* Chat header welcoming the logged-in user email */}
                <div className="border-b border-gray-900 pb-1.5 mb-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold font-display">
                    <Sparkles className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                    <span>AI Security Adviser</span>
                  </div>
                  <button 
                    onClick={() => setPhoneState("DASHBOARD")} 
                    className="text-[9.5px] text-gray-400 hover:text-white cursor-pointer hover:underline"
                  >
                    Dashboard Home
                  </button>
                </div>

                {/* Simulated chat timeline logs list */}
                <div className="bg-[#03060c] border border-gray-850 p-2.5 rounded-2xl flex-1 flex flex-col text-[10px] overflow-y-auto max-h-[300px] space-y-3.5 mb-3 scrollbar-thin">
                  
                  {/* welcome user card */}
                  <div className="bg-slate-900/50 p-2 rounded-lg border border-cyan-500/5 text-center text-[9px] font-mono text-gray-500 leading-snug font-medium select-text">
                    ACCOUNT DETAILS SINCE MOUNT:<br/>
                    <strong className="text-cyber-green">{auth.currentUser?.email || "securevaultappofficial@gmail.com"}</strong>
                  </div>

                  {chatMessages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end text-right" : "self-start items-start text-left"}`}
                    >
                      <span className="text-[8.5px] text-gray-500 uppercase tracking-widest font-mono mb-0.5 font-bold">
                        {msg.sender === "user" ? "You" : "🤖 SecureVault AI"}
                      </span>
                      <div 
                        className={`p-2.5 rounded-2xl text-[10px] whitespace-pre-line leading-relaxed ${
                          msg.sender === "user" 
                            ? "bg-cyan-950/20 text-cyan-200 border border-cyan-500/15 rounded-tr-none font-sans" 
                            : "bg-purple-950/10 text-gray-300 border border-purple-500/10 rounded-tl-none font-sans"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isTypingReply && (
                    <div className="self-start flex flex-col max-w-[85%] items-start text-left animate-pulse">
                      <span className="text-[8.5px] text-purple-400 font-mono font-bold">🤖 SecureVault AI thinking...</span>
                      <div className="p-2 bg-slate-900 text-gray-400 rounded-2xl rounded-tl-none text-[9.5px]">
                        Formulating clean cybersecurity diagnostic response...
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Preset query chips */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    "what is firestore",
                    "Security Score meaning",
                    "How SecureVault scans"
                  ].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleSendChat(chip)}
                      className="text-[9px] font-sans font-medium text-gray-400 hover:text-white bg-[#09101f] py-1 px-2.5 rounded-full border border-gray-850 hover:border-purple-500/20 transition-all cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input block form list */}
                <div className="flex gap-2 relative">
                  <input 
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendChat(chatInput);
                    }}
                    placeholder="Type safety question here..."
                    className="flex-1 bg-slate-950 border border-gray-800 text-xs text-gray-200 p-2 rounded-xl focus:outline-none focus:border-purple-500/40 font-sans"
                  />
                  <button 
                    onClick={() => handleSendChat(chatInput)}
                    className="p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl cursor-pointer transition-transform active:scale-95 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* 15. SCANS MENU (Interactive scan tools portal) */}
            {phoneState === "SCANS_MENU" && (
              <motion.div 
                key="scans_portal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left font-sans"
              >
                <div>
                  <div className="flex items-center gap-1.5 border-b border-gray-900 pb-1.5 mb-2">
                    <Shield className="w-4.5 h-4.5 text-cyan-400" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00f2fe] font-mono">Interactive Swiper Tools</h4>
                  </div>
                  
                  <p className="text-[9.5px] text-gray-400 leading-normal mb-3 leading-snug">
                    Select a core containment module to perform simulated device scanning or audit live threat sandboxes:
                  </p>

                  <div className="space-y-1.5 max-h-[195px] overflow-y-auto pr-0.5 scrollbar-thin select-none">
                    
                    {/* Tool 1 */}
                    <button 
                      onClick={() => setPhoneState("SMART_SCAN")}
                      className="w-full text-left bg-[#070e19] hover:bg-slate-900 border border-gray-850 p-2 py-2 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-emerald-500/10 text-cyber-green rounded-lg border border-emerald-500/15">
                          <Check className="w-4 h-4 text-cyber-green" />
                        </div>
                        <div>
                          <h5 className="text-[10.5px] font-bold text-white transition-colors group-hover:text-cyan-400">Heuristic Smart Scan</h5>
                          <p className="text-[8.5px] text-gray-500">Heuristic files & app-risk sweeping</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                    {/* Tool 2 */}
                    <button 
                      onClick={() => setPhoneState("MALWARE_SCAN")}
                      className="w-full text-left bg-[#070e19] hover:bg-slate-900 border border-gray-850 p-2 py-2 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-red-400/10 text-red-400 rounded-lg border border-red-400/15">
                          <Binary className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <h5 className="text-[10.5px] font-bold text-white transition-colors group-hover:text-red-400 font-sans">Malware Radar Check</h5>
                          <p className="text-[8.5px] text-gray-500">Vulnerability signatures auditing</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                    {/* Tool 3 */}
                    <button 
                      onClick={() => setPhoneState("JUNK_CLEANER")}
                      className="w-full text-left bg-[#070e19] hover:bg-slate-900 border border-gray-850 p-2 py-2 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-cyan-500/10 text-cyber-cyan rounded-lg border border-cyan-500/15">
                          <Trash2 className="w-4 h-4 text-cyber-cyan" />
                        </div>
                        <div>
                          <h5 className="text-[10.5px] font-bold text-white transition-colors group-hover:text-cyan-400 font-sans">Safe Cache Cleaner</h5>
                          <p className="text-[8.5px] text-gray-500">Wipe unneeded buffers cleanly</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                    {/* Tool 4 */}
                    <button 
                      onClick={() => setPhoneState("LINK_PROTECTION")}
                      className="w-full text-left bg-[#070e19] hover:bg-slate-900 border border-gray-850 p-2 py-2 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-amber-500/10 text-yellow-500 rounded-lg border border-amber-500/15">
                          <Link2 className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <h5 className="text-[10.5px] font-bold text-white transition-colors group-hover:text-yellow-400 font-sans">Link Safety Sandbox</h5>
                          <p className="text-[8.5px] text-gray-500">Test SMS link redirects safely</p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    </button>

                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full bg-slate-950 border border-gray-850 text-gray-400 py-1.5 rounded-xl text-[9.5px] text-center font-bold cursor-pointer hover:text-white"
                  >
                    Dashboard Home
                  </button>
                </div>
              </motion.div>
            )}

            {/* 16. REPORTS/DIAGNOSTICS PANEL */}
            {phoneState === "SIM_REPORTS" && (
              <motion.div 
                key="reports_page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left font-sans"
              >
                <div>
                  <div className="flex items-center gap-1.5 border-b border-gray-900 pb-1.5 mb-2">
                    <FileText className="w-4.5 h-4.5 text-[#00f2fe]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00f2fe] font-mono">Protection Reports</h4>
                  </div>

                  <div className="bg-[#080f1b] p-3 rounded-xl border border-gray-850 mb-3 space-y-2 select-noneScale text-[10px]">
                    <div className="flex justify-between items-center text-[10.5px]">
                      <span className="text-gray-400 font-mono">Security Score Index</span>
                      <strong className="text-cyber-green font-display text-xs">82/100 Good</strong>
                    </div>
                    
                    {/* Tiny stats progress indicators */}
                    <div className="relative w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                      <div className="absolute top-0 left-0 bg-cyber-green h-full rounded-full" style={{ width: "82%" }}></div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-gray-500 font-mono">
                      <span>Completed Fixes: 4</span>
                      <span>Link Queries: {localStorage.getItem("securevault_links_count") || "18"}</span>
                    </div>
                  </div>

                  {/* Highlight items */}
                  <div className="space-y-1.5 max-h-[155px] overflow-y-auto pr-0.5 scrollbar-thin text-[9.5px]">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-gray-850 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-300 block">Junk Cache Clean History Log</span>
                        <span className="text-gray-500 font-mono text-[8px]">Cleaned 2.45 GB safely</span>
                      </div>
                      <span className="text-cyber-green font-mono text-[8px] font-bold">SAVED</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-lg border border-gray-850 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-300 block">Dangerous APK Heuristic Scan</span>
                        <span className="text-gray-500 font-mono text-[8px]">Scan swept 432 core files</span>
                      </div>
                      <span className="text-yellow-500 font-mono text-[8px] font-bold">COMPLETED</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded-lg border border-gray-850 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-300 block">AI Security Adviser Consultation</span>
                        <span className="text-gray-500 font-mono text-[8px]">Analyzed threat levels index rules</span>
                      </div>
                      <span className="text-purple-400 font-mono text-[8px] font-bold">READY</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <button 
                    onClick={() => setPhoneState("AI_ADVISER")}
                    className="w-full bg-purple-950/20 text-purple-400 border border-purple-500/15 py-1.5 rounded-xl text-[9px] font-bold font-mono tracking-wider flex items-center justify-center gap-1.5 cursor-pointer hover:bg-purple-900/15 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
                    <span>CONSULT AI ADVISER ON DEMAND</span>
                  </button>
                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full bg-slate-950 border border-gray-850 text-gray-400 py-1 rounded-lg text-[9px] text-center font-bold cursor-pointer hover:text-white"
                  >
                    Dashboard Home
                  </button>
                </div>
              </motion.div>
            )}

            {/* 17. MY ACCOUNT PANEL */}
            {phoneState === "SIM_MY_ACCOUNT" && (
              <motion.div 
                key="my_account_page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left font-sans"
              >
                <div>
                  <div className="flex items-center gap-1.5 border-b border-gray-900 pb-1.5 mb-2.5">
                    <User className="w-4.5 h-4.5 text-[#00f2fe]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00f2fe] font-mono">My Account</h4>
                  </div>

                  {/* Account detail section */}
                  <div className="bg-[#080e19] p-3 rounded-2xl border border-gray-850 text-center space-y-2 py-4">
                    <div className="relative inline-flex mx-auto mb-1 animate-pulse">
                      <div className="absolute inset-0 bg-cyan-400/10 rounded-full blur-md"></div>
                      <div className={`w-11 h-11 rounded-full ${simSelectedAccount?.avatarBg || "bg-indigo-950"} flex items-center justify-center text-white text-base font-bold select-none border border-cyan-500/20 shadow`}>
                        {simSelectedAccount?.initial || "G"}
                      </div>
                    </div>

                    <div className="leading-tight">
                      <h5 className="text-[11px] font-bold text-white font-sans">{simSelectedAccount?.name || "Elena Vance"}</h5>
                      <span className="text-[9px] text-gray-400 font-mono block mt-0.5">{simSelectedAccount?.email || "elena.vance@privacyguard.net"}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/25 py-0.5 px-2 rounded-full text-cyber-cyan text-[8px] uppercase tracking-wider font-mono font-bold leading-normal">
                      <Check className="w-2.5 h-2.5 text-cyan-400 font-black" />
                      <span>Enterprise Protection Enabled</span>
                    </span>
                  </div>

                  {/* Simple stats numbers */}
                  <div className="grid grid-cols-2 gap-2 mt-3 select-none text-[9.5px] font-mono">
                    <div className="bg-slate-955 border border-gray-850 p-2 rounded-xl text-center">
                      <span className="text-gray-500 block text-[7.5px] uppercase">Scans Run</span>
                      <strong className="text-cyan-400 block text-xs mt-0.5">12</strong>
                    </div>
                    <div className="bg-slate-955 border border-gray-850 p-2 rounded-xl text-center">
                      <span className="text-gray-500 block text-[7.5px] uppercase">Wiped Junk</span>
                      <strong className="text-cyber-green block text-xs mt-0.5">2.4 GB</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <button 
                    onClick={() => {
                      setSimSelectedAccount(null);
                      setPhoneState("SIM_LOGIN");
                    }}
                    className="w-full bg-red-950/20 text-red-400 border border-red-500/15 hover:bg-red-900/15 py-1.5 rounded-lg text-[9px] text-center font-bold cursor-pointer"
                  >
                    Disconnect Profile Session
                  </button>
                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full bg-slate-900 border border-gray-850 text-gray-400 py-1 rounded-lg text-[9px] text-center font-bold cursor-pointer hover:text-white"
                  >
                    Return to Home Dashboard
                  </button>
                </div>
              </motion.div>
            )}

            {/* 18. SETTINGS PANEL */}
            {phoneState === "SIM_SETTINGS" && (
              <motion.div 
                key="settings_page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between py-1 text-left font-sans"
              >
                <div>
                  <div className="flex items-center gap-1.5 border-b border-gray-900 pb-1.5 mb-2.5">
                    <Settings className="w-4.5 h-4.5 text-[#00f2fe]" />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#00f2fe] font-mono">Simulator Settings</h4>
                  </div>

                  <p className="text-[9.5px] text-gray-400 leading-snug mb-3">
                    Configure the active components of the virtual diagnostics protection suite:
                  </p>

                  <div className="space-y-1.5 select-none text-[9px] font-sans max-h-[175px] overflow-y-auto pr-0.5 scrollbar-thin">
                    {/* Toggle row 1 */}
                    <label className="flex justify-between items-center p-2 rounded-xl bg-slate-950/85 border border-gray-855 hover:border-gray-800 transition-all cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Real-time Threat Interception</span>
                        <span className="text-[7.5px] text-gray-500 block">Monitors downloaded file signatures</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsMalware} 
                        onChange={() => setSettingsMalware(!settingsMalware)}
                        className="rounded border-gray-800 bg-[#080e19] accent-cyber-cyan text-cyber-cyan w-3.5 h-3.5 cursor-pointer" 
                      />
                    </label>

                    {/* Toggle row 2 */}
                    <label className="flex justify-between items-center p-2 rounded-xl bg-slate-950/85 border border-gray-855 hover:border-gray-800 transition-all cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Deep Heuristic Scanner</span>
                        <span className="text-[7.5px] text-gray-500 block">Advanced scanning on background registries</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsHeuristics} 
                        onChange={() => setSettingsHeuristics(!settingsHeuristics)}
                        className="rounded border-gray-800 bg-[#080e19] accent-cyber-cyan text-cyber-cyan w-3.5 h-3.5 cursor-pointer" 
                      />
                    </label>

                    {/* Toggle row 3 */}
                    <label className="flex justify-between items-center p-2 rounded-xl bg-slate-950/85 border border-gray-855 hover:border-gray-800 transition-all cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">SMS Link Redirection Guard</span>
                        <span className="text-[7.5px] text-gray-500 block">Auto-sweeps incoming threat urls</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsLink} 
                        onChange={() => setSettingsLink(!settingsLink)}
                        className="rounded border-gray-800 bg-[#080e19] accent-cyber-cyan text-cyber-cyan w-3.5 h-3.5 cursor-pointer" 
                      />
                    </label>

                    {/* Toggle row 4 */}
                    <label className="flex justify-between items-center p-2 rounded-xl bg-slate-950/85 border border-gray-855 hover:border-gray-800 transition-all cursor-pointer">
                      <div>
                        <span className="font-bold text-white block">Low Battery Optimizer</span>
                        <span className="text-[7.5px] text-gray-500 block">Scales back engine CPU cycles</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settingsBattery} 
                        onChange={() => setSettingsBattery(!settingsBattery)}
                        className="rounded border-gray-800 bg-[#080e19] accent-cyber-cyan text-cyber-cyan w-3.5 h-3.5 cursor-pointer" 
                      />
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => setPhoneState("DASHBOARD")}
                    className="w-full bg-slate-950 border border-gray-850 text-cyber-cyan py-1.5 rounded-lg text-[9.5px] text-center font-bold cursor-pointer hover:text-white"
                  >
                    Apply Settings
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Android persistent bottom utility bar pins */}
          {phoneState !== "BOOT" && phoneState !== "SIM_LOGIN" && (
            <div className="mt-2 pt-2 border-t border-gray-900 flex justify-between items-center select-none z-30 px-1 gap-1">
              
              {/* Home tab */}
              <button 
                onClick={() => setPhoneState("DASHBOARD")}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg transition-all cursor-pointer border ${
                  phoneState === "DASHBOARD" ? "text-cyber-cyan bg-cyan-500/10 border-cyan-500/20" : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
                title="Home Dashboard"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[7.5px] font-mono mt-0.5 uppercase tracking-wide font-extrabold">Home</span>
              </button>

              {/* Scans tab */}
              <button 
                onClick={() => setPhoneState("SCANS_MENU")}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg transition-all cursor-pointer border ${
                  ["SCANS_MENU", "SMART_SCAN", "SMART_SCANNING", "MALWARE_SCAN", "MALWARE_SCANNING", "MALWARE_RESULTS", "JUNK_CLEANER", "JUNK_SCANNING", "JUNK_RESULTS", "LINK_PROTECTION", "LINK_SCAN_RESULTS"].includes(phoneState) ? "text-cyber-cyan bg-cyan-500/10 border-cyan-500/20" : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
                title="Security Scans"
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[7.5px] font-mono mt-0.5 uppercase tracking-wide font-extrabold font-mono">Scans</span>
              </button>

              {/* Reports tab */}
              <button 
                onClick={() => setPhoneState("SIM_REPORTS")}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg transition-all cursor-pointer border ${
                  ["SIM_REPORTS", "SMART_RESULTS", "AI_ADVISER"].includes(phoneState) ? "text-cyber-cyan bg-cyan-500/10 border-cyan-500/20" : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
                title="Logs & Reports"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[7.5px] font-mono mt-0.5 uppercase tracking-wide font-extrabold">Reports</span>
              </button>

              {/* My Account tab */}
              <button 
                onClick={() => setPhoneState("SIM_MY_ACCOUNT")}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg transition-all cursor-pointer border ${
                  phoneState === "SIM_MY_ACCOUNT" ? "text-cyber-cyan bg-cyan-500/10 border-cyan-500/20" : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
                title="My Account Profile"
              >
                <User className="w-3.5 h-3.5" />
                <span className="text-[7.5px] font-mono mt-0.5 uppercase tracking-wide font-extrabold">Account</span>
              </button>

              {/* Settings tab */}
              <button 
                onClick={() => setPhoneState("SIM_SETTINGS")}
                className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg transition-all cursor-pointer border ${
                  phoneState === "SIM_SETTINGS" ? "text-cyber-cyan bg-cyan-500/10 border-cyan-500/20" : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
                title="Simulator Settings"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="text-[7.5px] font-mono mt-0.5 uppercase tracking-wide font-extrabold">Settings</span>
              </button>

            </div>
          )}

          {/* Android screen bottom navigation white bar overlay */}
          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-gray-800 rounded-full select-none"></div>
        </div>

      </div>

      {/* Simulator subtitle caption */}
      <div className="mt-4 text-center bg-[#070e1b] border border-gray-800/80 py-2.5 px-4 rounded-2xl select-none">
        <span className="text-[10px] text-gray-400 font-mono flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
          <span>Interactive OS Heuristics Prototyper</span>
        </span>
      </div>

    </div>
  );
}
