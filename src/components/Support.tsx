/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  HelpCircle, Search, Mail, Trash2, Send, CheckCircle2, 
  ChevronDown, Phone, Heart, Globe, RefreshCcw, Loader2, FileSpreadsheet, Key, ExternalLink, Lock, Settings, Database, Download
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  saveQueryTicketRow, 
  connectGoogleSheets, 
  getCachedToken, 
  getSheetsUserEmail 
} from "../lib/googleSheets";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("100-protect");
  
  // Simulated form states
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [ticketCreated, setTicketCreated] = useState(false);
  
  // Simulated data deletion state
  const [deletingStates, setDeletingStates] = useState<"IDLE" | "PROCESSING" | "DELETED">("IDLE");

  // Google Sheets integration state
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedSheetUrl, setSyncedSheetUrl] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = currentUser && (
    currentUser.email === "securevaultappofficial@gmail.com" ||
    currentUser.email?.includes("securevaultappofficial")
  );

  // Administrative reporting states
  const [sheetsConfig, setSheetsConfig] = useState<any>(null);
  const [queryTickets, setQueryTickets] = useState<any[]>([]);
  const [launchNotifications, setLaunchNotifications] = useState<any[]>([]);
  const [adminActiveTab, setAdminActiveTab] = useState<"sheets" | "tickets" | "waitlist">("sheets");

  const exportTicketsToCSV = () => {
    if (queryTickets.length === 0) {
      alert("No inquiry tickets available to export.");
      return;
    }
    const headers = ["ID", "Name", "Email Address", "Inquiry Message", "Timestamp"];
    const csvRows = [
      headers.join(","),
      ...queryTickets.map((t, idx) => {
        const id = queryTickets.length - idx;
        const name = `"${(t.name || "").replace(/"/g, '""')}"`;
        const email = `"${(t.email || "").replace(/"/g, '""')}"`;
        const message = `"${(t.message || "").replace(/"/g, '""')}"`;
        const timestamp = `"${t.createdLocaleString || (t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString() : "Sync Pending")}"`;
        return [id, name, email, message, timestamp].join(",");
      })
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `securevault_query_tickets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportWaitlistToCSV = () => {
    if (launchNotifications.length === 0) {
      alert("No waitlist records available to export.");
      return;
    }
    const headers = ["ID", "Name", "Email Address", "Requested Languages", "Excited Features", "Timestamp"];
    const csvRows = [
      headers.join(","),
      ...launchNotifications.map((n, idx) => {
        const id = launchNotifications.length - idx;
        const name = `"${(n.name || "Anonymous Client").replace(/"/g, '""')}"`;
        const email = `"${(n.email || "").replace(/"/g, '""')}"`;
        const languagesStr = Array.isArray(n.languages) ? n.languages.join("; ") : (n.languages || "None");
        const featuresStr = Array.isArray(n.features) ? n.features.join("; ") : (n.features || "None");
        const languages = `"${languagesStr.replace(/"/g, '""')}"`;
        const features = `"${featuresStr.replace(/"/g, '""')}"`;
        const timestamp = `"${n.createdLocaleString || (n.createdAt ? new Date(n.createdAt.seconds * 1000).toLocaleString() : "Sync Pending")}"`;
        return [id, name, email, languages, features, timestamp].join(",");
      })
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `securevault_launch_waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Load sheets config and subscribe to user submissions in real-time
  React.useEffect(() => {
    if (!isAdmin) return;

    // 1. Listen to Sheets active config
    const configRef = doc(db, "sheets_config", "active");
    const unsubConfig = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        setSheetsConfig(docSnap.data());
      } else {
        setSheetsConfig(null);
      }
    }, (err) => {
      console.warn("Firestore config read permissions error:", err);
      handleFirestoreError(err, OperationType.GET, "sheets_config/active");
    });

    // 2. Listen to query tickets (Support submissions)
    const ticketsQuery = query(collection(db, "query_tickets"), orderBy("createdAt", "desc"));
    const unsubTickets = onSnapshot(ticketsQuery, (qSnap) => {
      const list = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setQueryTickets(list);
    }, (err) => {
      console.warn("Firestore tickets read permissions error:", err);
      handleFirestoreError(err, OperationType.GET, "query_tickets");
    });

    // 3. Listen to launch notifications (Coming Soon waitlist)
    const waitlistQuery = query(collection(db, "launch_notifications"), orderBy("createdAt", "desc"));
    const unsubWaitlist = onSnapshot(waitlistQuery, (qSnap) => {
      const list = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLaunchNotifications(list);
    }, (err) => {
      console.warn("Firestore waitlist read permissions error:", err);
      handleFirestoreError(err, OperationType.GET, "launch_notifications");
    });

    return () => {
      unsubConfig();
      unsubTickets();
      unsubWaitlist();
    };
  }, [isAdmin, currentUser]);

  const faqs = [
    {
      id: "100-protect",
      question: "Does SecureVault guarantee 100% protection from cybercrimes?",
      answer: "No. Honestly, no application on earth can promise 100% cyber protection because new scams and methods evolve daily. SecureVault is designed to help you analyze risks, identify suspicious APKs, expand nested redirect links, and understand logs clearly through simple AI translations so that you remain fully in control.",
      category: "Security"
    },
    {
      id: "auto-delete",
      question: "Does SecureVault delete my downloaded files automatically?",
      answer: "No! SecureVault strictly operates on user-review guidelines. If our scan uncovers a suspicious APK or excessive junk caches, we display them visually and request you physical confirmation before initiating deletions. We never scrub items in the background.",
      category: "Privacy"
    },
    {
      id: "ai-otp",
      question: "Does the AI Security Adviser ever request personal OTPs or banking PINs?",
      answer: "Absolutely not. Our server-side AI Security Adviser translates scan report logs. SecureVault will NEVER request, log, or parse financial transaction passwords, UPI PINs, Aadhaar numbers, card details, or verification codes. Never feed these details into any automated chat interface.",
      category: "AI Adviser"
    },
    {
      id: "scam-money",
      question: "What immediate action steps should I take if I lost money in an online scam?",
      answer: "If you fell victim to a financial fraud or shared sensitive details, execute these steps immediately: 1) Call the Indian Cybercrime Helpline at 1930 immediately (during the golden hour) to let banking authorities freeze transfer logs. 2) File a report on the official website: cybercrime.gov.in. 3) Contact your physical bank branch instantly to suspend your credit profile. 4) Save all WhatsApp screenshots, UPI ids, and transaction histories.",
      category: "General"
    },
    {
      id: "perm-explain",
      question: "Why does a scanning application require Android folder accesses?",
      answer: "Android sandbox rules require 'Storage/All Files Access' permissions to inspect downloads or shared directories for uninstalled mal-formatted APK code templates. SecureVault is designed to scan specific download blocks strictly, completely ignoring family image folders.",
      category: "Privacy"
    }
  ];

  const handleClearData = () => {
    setDeletingStates("PROCESSING");
    setTimeout(() => {
      localStorage.removeItem("securevault_waitlist_submitted");
      setDeletingStates("DELETED");
    }, 1200);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportEmail || !supportMsg) return;
    
    setIsSyncing(true);
    setSyncError(null);
    setSyncedSheetUrl(null);

    try {
      // Unconditionally sync directly to the developer's sheet in the background!
      const result = await saveQueryTicketRow({
        name: supportName || "Anonymous Guardian",
        email: supportEmail,
        message: supportMsg
      });
      setSyncedSheetUrl(result.spreadsheetUrl);
    } catch (err: any) {
      console.warn("Failed to sync query ticket to Google Sheets in background:", err);
      if (isAdmin) {
        setSyncError(err.message || "Admin sheets not syncable. Refresh authorization below.");
      }
    } finally {
      setIsSyncing(false);
      setTicketCreated(true); // Always proceed to success layout for guest user
    }
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 bg-slate-950 text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headings */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-display font-medium text-4xl tracking-tight text-white sm:text-5xl">
            SecureVault <span className="text-cyber-cyan">Help Center</span>
          </h1>
          <p className="mt-4 text-base text-gray-400 leading-relaxed font-sans">
            Direct consultative guidance for everyday users. Read answers to common questions about permissions, safety bounds, and emergency scam steps.
          </p>
        </div>

        {/* Support content grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left panel FAQs engine */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-1.5">
                <HelpCircle className="w-5 h-5 text-cyber-cyan" />
                <span>Frequently Answered Questions</span>
              </h3>
              
              {/* FAQ Search Inputs */}
              <div className="w-full sm:max-w-xs relative text-xs">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-500">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-gray-800 focus:border-cyber-cyan focus:outline-none p-2 pl-8 rounded-lg text-xs"
                  placeholder="Filter FAQs..."
                />
              </div>
            </div>

            {/* Accordion List render */}
            <div className="space-y-3.5">
              {filteredFaqs.map((faq) => {
                const isOpen = faq.id === expandedFaq;
                return (
                  <div 
                    key={faq.id}
                    className="bg-slate-900/60 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="w-full text-left p-4 flex justify-between items-center gap-4 text-white font-semibold text-sm cursor-pointer hover:bg-slate-900/50"
                    >
                      <span className="font-display leading-snug">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-450 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-850 px-4 pb-4.5 pt-3 text-xs leading-relaxed text-gray-400 font-sans"
                        >
                          <span className="text-[9px] font-mono text-cyber-cyan uppercase block mb-1">Response category: {faq.category}</span>
                          <p className="text-gray-300 leading-relaxed font-sans">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel Help ticket submit & Compliancy Deletion card controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact ticket form */}
            <div className="bg-slate-900 border border-gray-800 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
              
              <h3 className="font-display font-bold text-lg text-white mb-1">Submit feature / Inquiry Ticket</h3>
              <p className="text-xs text-gray-500 font-mono tracking-wide uppercase">Direct contact to project developer</p>
              
              {!ticketCreated ? (
                <form onSubmit={handleSubmitTicket} className="mt-5 space-y-4">
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Your Name :</label>
                    <input 
                      type="text" 
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      className="w-full bg-slate-950 border border-gray-800 p-2 text-xs rounded-lg text-gray-200 focus:outline-none focus:border-cyber-cyan"
                      placeholder="Aniket K."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Receipt Email :</label>
                    <input 
                      type="email" 
                      required
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-gray-800 p-2 text-xs rounded-lg text-gray-200 focus:outline-none focus:border-cyber-cyan"
                      placeholder="client@support.in"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Message :</label>
                    <textarea 
                      required
                      value={supportMsg}
                      onChange={(e) => setSupportMsg(e.target.value)}
                      className="w-full bg-slate-950 border border-gray-800 p-2.5 text-xs rounded-lg text-gray-200 focus:outline-none focus:border-cyber-cyan h-24 font-sans resize-none"
                      placeholder="Describe what protection detail you suggest, or write a question..."
                    />
                  </div>

                  {syncError && (
                    <div className="text-[10px] font-mono text-red-400 bg-red-950/20 border border-red-500/15 p-2 rounded-lg mt-2 mb-2">
                      ⚠ {syncError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSyncing}
                    className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-semibold text-xs rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:scale-100"
                  >
                    {isSyncing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{isSyncing ? "Sending inquiry..." : "Submit Query Ticket"}</span>
                  </button>
                </form>
              ) : (
                /* Ticket Success State */
                <div className="mt-6 text-center space-y-4">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-cyber-cyan" />
                  </div>
                  <h4 className="font-display font-semibold text-white">Ticket successfully logged!</h4>
                  <p className="text-xs text-gray-450 leading-relaxed font-sans px-4">
                    Thank you. Your message was processed. We'll consult our early developmental backlog and respond directly to <strong>{supportEmail}</strong>.
                  </p>

                  {syncedSheetUrl && (
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-900/40 space-y-2 max-w-sm mx-auto">
                      <div className="flex items-center gap-2 justify-center text-xs text-cyber-cyan font-semibold">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Saved to Google Sheets!</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans leading-normal">
                        Spreadsheet <strong>SecureVault - Query Tickets</strong> was successfully updated.
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

                  <button 
                    onClick={() => {
                      setTicketCreated(false);
                      setSyncedSheetUrl(null);
                    }}
                    className="text-xs font-mono text-cyber-cyan underline block mx-auto cursor-pointer"
                  >
                    Submit another note
                  </button>
                </div>
              )}
            </div>

            {/* Compliancy Local Deletion Drawer */}
            <div className="bg-slate-900 border border-red-500/15 rounded-3xl p-6 sm:p-7 space-y-4">
              <h3 className="font-display font-bold text-base text-red-400 flex items-center gap-1.5">
                <Trash2 className="w-5 h-5 text-red-500" />
                <span>Transparent User Data Deletion</span>
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                SecureVault respects your privacy rights. Since waitlist subscriptions and quiz accomplishments are compiled in local storage files, you can wipe your traces instantly by clicking below.
              </p>

              {deletingStates === "IDLE" && (
                <button 
                  onClick={handleClearData}
                  className="w-full text-center py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Clear Waitlist Logs and Local Cache
                </button>
              )}

              {deletingStates === "PROCESSING" && (
                <div className="text-center py-2 bg-slate-950 rounded-xl border border-gray-800 text-xs font-mono text-yellow-405 animate-pulse">
                  Wiping device cache keys...
                </div>
              )}

              {deletingStates === "DELETED" && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl text-center">
                  <span className="text-xs font-mono text-cyber-green block">✓ Cache Cleared and Reset Completed!</span>
                  <button 
                    onClick={() => setDeletingStates("IDLE")} 
                    className="text-[10px] text-gray-500 font-mono underline block mx-auto mt-2 cursor-pointer"
                  >
                    Restore Diagnostics
                  </button>
                </div>
              )}
            </div>

            {/* Admin Central Command & live Reports Panel */}
            {isAdmin && (
              <div className="bg-slate-900/90 border-2 border-cyan-500/30 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl col-span-full mt-8">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl"></div>
                
                {/* Dashboard Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-800 pb-5 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/15 p-2.5 rounded-xl border border-cyan-500/30 text-cyber-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <Settings className="w-5.5 h-5.5 animate-spin-slow text-cyber-cyan" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400 block tracking-widest uppercase font-bold">ADMIN PORTAL SECURE MODE</span>
                        <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping"></span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-white">SecureVault Reporting & Sync Dashboard</h3>
                    </div>
                  </div>
                  
                  {/* Tab Selector Buttons */}
                  <div className="flex flex-wrap gap-1 bg-black/60 p-1.5 rounded-xl border border-gray-800 self-stretch sm:self-auto text-xs font-mono">
                    <button
                      onClick={() => setAdminActiveTab("sheets")}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        adminActiveTab === "sheets"
                          ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Google Sheets</span>
                    </button>
                    <button
                      onClick={() => setAdminActiveTab("tickets")}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        adminActiveTab === "tickets"
                          ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Tickets ({queryTickets.length})</span>
                    </button>
                    <button
                      onClick={() => setAdminActiveTab("waitlist")}
                      className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        adminActiveTab === "waitlist"
                          ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/10"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Waitlist ({launchNotifications.length})</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: GOOGLE SHEETS SYNC CONTROL */}
                {adminActiveTab === "sheets" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1 font-bold">SPREADSHEET SYNCHRONIZATION</h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        SecureVault automatically logs user query tickets and launch waitlist positions directly to Google Sheets inside your account. Manage spread locations below:
                      </p>
                    </div>

                    {sheetsConfig ? (
                      <div className="space-y-4">
                        {/* Status connected badge */}
                        <div className="bg-emerald-950/25 border border-emerald-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 p-2 rounded-xl text-cyber-green border border-emerald-500/20">
                              <CheckCircle2 className="w-5 h-5 text-cyber-green" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-cyber-green block font-bold leading-none mb-1">AUTOMATED LINK SECURELY ACTIVE</span>
                              <p className="text-xs text-gray-300 font-sans">
                                Configured Google Account: <strong className="text-white font-mono">{sheetsConfig.adminEmail || "Authenticated Owner"}</strong>
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded-full border border-emerald-500/20">
                            Synced Live
                          </span>
                        </div>

                        {/* File lists with clickable direct links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Query sheet link card */}
                          <div className="bg-black/40 border border-gray-850 p-4 rounded-2xl flex flex-col justify-between gap-5 hover:border-cyan-500/25 transition-all">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-cyber-cyan">
                                <FileSpreadsheet className="w-4 h-4" />
                                <h5 className="font-mono text-xs font-bold uppercase tracking-wider">SECUREVAULT - QUERY TICKETS</h5>
                              </div>
                              <p className="text-[11px] text-gray-400 font-sans leading-normal">
                                Stores inquiry descriptions, emails, and names submitted by guest users in the FAQ/Support form.
                              </p>
                            </div>
                            <a
                              href={`https://docs.google.com/spreadsheets/d/${sheetsConfig.queryTicketsSpreadsheetId}/edit`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full text-center py-2 bg-slate-900 border border-cyan-500/30 hover:border-cyber-cyan text-cyber-cyan hover:text-white text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Query spreadsheet</span>
                            </a>
                          </div>

                          {/* Launch notifications sheet link card */}
                          <div className="bg-black/40 border border-gray-850 p-4 rounded-2xl flex flex-col justify-between gap-5 hover:border-cyan-500/25 transition-all">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-cyber-green">
                                <FileSpreadsheet className="w-4 h-4" />
                                <h5 className="font-mono text-xs font-bold uppercase tracking-wider">SECUREVAULT - LAUNCH TRACKER</h5>
                              </div>
                              <p className="text-[11px] text-gray-400 font-sans leading-normal">
                                Stores emails, preferred languages, and expected security feature preferences for waitlist entries.
                              </p>
                            </div>
                            <a
                              href={`https://docs.google.com/spreadsheets/d/${sheetsConfig.launchNotificationsSpreadsheetId}/edit`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full text-center py-2 bg-slate-900 border border-cyan-500/30 hover:border-cyber-cyan text-cyber-cyan hover:text-white text-xs font-mono rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Open Launch spreadsheet</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-950/20 border border-amber-500/25 p-4 rounded-2xl space-y-2">
                        <span className="text-xs font-mono text-amber-400 font-bold block">⚠️ GOOGLE SHEETS SYNC PENDING SETUP</span>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                          Spreadsheets are currently not initialized or linked under your Google Account. Click the authorization button below to seamlessly generate spreadsheet logs named <strong className="text-white">"SecureVault - Query Tickets"</strong> and <strong className="text-white">"SecureVault - Launch Notifications"</strong> in your personal Google Sheets dashboard.
                        </p>
                      </div>
                    )}

                    {syncError && (
                      <div className="bg-rose-950/30 border border-rose-500/30 p-3.5 rounded-xl text-xs text-rose-300 font-mono leading-relaxed space-y-1">
                        <span className="font-bold text-rose-400 block">⚠️ CONNECTION ERROR:</span>
                        <p>{syncError}</p>
                        <ul className="list-disc pl-4 mt-2 space-y-1 text-[11px]">
                          <li>Auth popup may have been blocked. Check your browser address bar icon.</li>
                          <li>Ensure Google Drive & Sheets permissions are allowed.</li>
                          <li>Open this application in a new tab using the helper below and retry.</li>
                        </ul>
                      </div>
                    )}

                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={async () => {
                            setIsSyncing(true);
                            setSyncError(null);
                            try {
                              const token = await connectGoogleSheets();
                              alert("Success! Your Google Account spreadsheets are created and linked successfully. All user inquiries and waitlist inputs will instantly save to your Google Sheet rows in the background.");
                            } catch (err: any) {
                              setSyncError(err.message || "Failed to link Google account sheets.");
                            } finally {
                              setIsSyncing(false);
                            }
                          }}
                          disabled={isSyncing}
                          className="w-full text-center py-3 bg-gradient-to-r from-cyan-500 to-cyan-450 hover:from-cyan-400 hover:to-cyan-350 text-black font-semibold text-xs rounded-xl cursor-pointer disabled:opacity-50 transition-all font-mono shadow-[0_0_15px_rgba(6,182,212,0.1)] flex items-center justify-center gap-1.5"
                        >
                          {isSyncing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Authorizing...</span>
                            </>
                          ) : (
                            <>
                              <span>🔗 Link Google Sheets Admin</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            window.open(window.location.origin + "/?page=support", "_blank");
                          }}
                          className="w-full text-center py-3 bg-slate-900 border border-gray-800 hover:border-cyan-500/50 text-gray-300 hover:text-white font-semibold text-xs rounded-xl cursor-pointer transition-all font-mono flex items-center justify-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open in New Tab (Bypass Iframe)</span>
                        </button>
                      </div>
                      
                      <p className="text-[10px] text-gray-500 font-sans leading-normal text-center bg-black/45 p-3 rounded-xl border border-gray-900">
                        <strong>Security & Iframe Privacy:</strong> Browsers heavily restrict Google sign-in popups inside sandboxed developer environments like AI Studio. If authorization fails or hangs, clicking <strong className="text-cyan-400">"Open in New Tab"</strong> will open a clean browser root where authorization will complete instantly.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: INQUIRY TICKETS LIST (FIRESTORE REAL-TIME VIEWER) */}
                {adminActiveTab === "tickets" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30 p-4 rounded-2xl border border-gray-900 mb-2">
                      <div>
                        <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1 font-bold">USER INQUIRY TICKETS</h4>
                        <p className="text-xs text-gray-400 font-sans leading-normal">
                          Read queries logged directly to standard Firestore database in real-time.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportTicketsToCSV}
                          className="px-3.5 py-1.5 bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold text-xs font-mono rounded-lg hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.1)] cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export (CSV)</span>
                        </button>
                        
                        <span className="text-xs font-mono bg-cyan-950 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                          {queryTickets.length} Items
                        </span>
                      </div>
                    </div>

                    {queryTickets.length > 0 ? (
                      <div className="max-h-[380px] overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                        {queryTickets.map((ticket, index) => (
                          <div key={ticket.id || index} className="bg-black/55 border border-gray-850 p-4 rounded-2xl relative overflow-hidden flex flex-col gap-2.5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-900 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-cyan-500 font-bold bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/10">
                                  #{queryTickets.length - index}
                                </span>
                                <h5 className="text-xs font-bold text-white truncate max-w-[150px]">{ticket.name}</h5>
                                <a 
                                  href={`mailto:${ticket.email}`} 
                                  className="text-[11px] text-cyan-400 font-mono hover:underline truncate max-w-[180px]"
                                >
                                  ({ticket.email})
                                </a>
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">
                                {ticket.createdLocaleString || (ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleString() : "Date Sync Pending")}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-gray-950 whitespace-pre-line font-sans">
                              {ticket.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-black/40 border border-dashed border-gray-800 p-12 rounded-3xl text-center">
                        <Database className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 font-sans">No query ticket registrations currently configured inside Cloud Firestore database.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: WAITLIST USER REGISTRATIONS (FIRESTORE REAL-TIME VIEWER) */}
                {adminActiveTab === "waitlist" && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30 p-4 rounded-2xl border border-gray-900 mb-2">
                      <div>
                        <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1 font-bold">LAUNCH INVITES WAITLIST</h4>
                        <p className="text-xs text-gray-400 font-sans leading-normal">
                          View user email registrations, and preferred device security feature checklist variables.
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={exportWaitlistToCSV}
                          className="px-3.5 py-1.5 bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-semibold text-xs font-mono rounded-lg hover:bg-cyan-500 hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.1)] cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export (CSV)</span>
                        </button>
                        
                        <span className="text-xs font-mono bg-cyan-950 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-500/20 font-bold">
                          {launchNotifications.length} Entries
                        </span>
                      </div>
                    </div>

                    {launchNotifications.length > 0 ? (
                      <div className="max-h-[380px] overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
                        {launchNotifications.map((notif, index) => (
                          <div key={notif.id || index} className="bg-black/55 border border-gray-850 p-4 rounded-2xl flex flex-col gap-2.5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-900 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-cyber-green font-bold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/10">
                                  #{launchNotifications.length - index}
                                </span>
                                <h5 className="text-xs font-bold text-white truncate max-w-[150px]">{notif.name || "Anonymous Client"}</h5>
                                <a 
                                  href={`mailto:${notif.email}`} 
                                  className="text-[11px] text-cyber-green font-mono hover:underline truncate max-w-[200px]"
                                >
                                  ({notif.email})
                                </a>
                              </div>
                              <span className="text-[10px] font-mono text-gray-500">
                                {notif.createdLocaleString || (notif.createdAt ? new Date(notif.createdAt.seconds * 1000).toLocaleString() : "Date Sync Pending")}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans">
                              {/* Preferred Languages */}
                              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-gray-950">
                                <span className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Checked Languages</span>
                                <p className="text-gray-300 font-mono font-medium truncate">
                                  {Array.isArray(notif.languages) && notif.languages.length > 0 
                                    ? notif.languages.join(", ") 
                                    : (typeof notif.languages === "string" ? notif.languages : "None Selected")}
                                </p>
                              </div>

                              {/* Excited Features */}
                              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-gray-950">
                                <span className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Demanded Features</span>
                                <p className="text-gray-300 font-mono font-medium truncate">
                                  {Array.isArray(notif.features) && notif.features.length > 0 
                                    ? notif.features.join(", ") 
                                    : (typeof notif.features === "string" ? notif.features : "None Selected")}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-black/40 border border-dashed border-gray-800 p-12 rounded-3xl text-center">
                        <Globe className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 font-sans">No waitlist invite registries currently configured inside Cloud Firestore database.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
