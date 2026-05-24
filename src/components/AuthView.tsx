import React, { useState, useEffect } from "react";
import { auth, googleProvider, syncUserProfile, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { 
  signInWithPopup, 
  signOut, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import { doc, onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { 
  Shield, Lock, AlertTriangle, Key, LogOut, CheckCircle2, 
  CloudLightning, Calendar, Mail, UserPlus, LogIn, Database, 
  RefreshCcw, Eye, EyeOff, Sparkles, Binary, Trash2, Link2, FileText, X, ChevronRight, Loader2
} from "lucide-react";
import { motion } from "motion/react";
import appLogo from "../assets/images/secure_vault_logo_1779581755129.png";
import { getResolvedUser, MOCK_GOOGLE_ACCOUNTS } from "../lib/mockAccounts";

interface AuthViewProps {
  user: User | null;
  loading: boolean;
  setPage: (page: string) => void;
}

interface UserFirestoreData {
  userId: string;
  displayName: string;
  email: string;
  createdAt: any;
  lastLoginAt: any;
  noOfScans: number;
  threatsFound: number;
  safeJunkRemoved: number;
  scannedLinksCount: number;
}

export default function AuthView({ user, loading, setPage }: AuthViewProps) {
  // Navigation & Toggle States
  const [authMethod, setAuthMethod] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);
  const [showGoogleOverlay, setShowGoogleOverlay] = useState(false);
  const [clickedAccountIndex, setClickedAccountIndex] = useState<number | null>(null);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Firestore Live Profile State
  const [dbData, setDbData] = useState<UserFirestoreData | null>(null);
  const [fetchingDb, setFetchingDb] = useState(false);

  // User Subcollection States
  const [fixedIssues, setFixedIssues] = useState<any[]>([]);
  const [adviserChats, setAdviserChats] = useState<any[]>([]);
  const [junkCleanHistory, setJunkCleanHistory] = useState<any[]>([]);
  const [linkScanHistory, setLinkScanHistory] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"fixedIssues" | "chats" | "junkHistory" | "linkHistory">("fixedIssues");

  // Hook up real-time onSnapshot listeners when logged in
  useEffect(() => {
    if (!user) {
      setDbData(null);
      setFixedIssues([]);
      setAdviserChats([]);
      setJunkCleanHistory([]);
      setLinkScanHistory([]);
      return;
    }

    setFetchingDb(true);
    const userRef = doc(db, "users", user.uid);
    const userUid = user.uid;
    
    // Subscribe to live user stats
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setDbData(docSnap.data() as UserFirestoreData);
      } else {
        console.warn("User firestore document does not exist yet.");
      }
      setFetchingDb(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      setFetchingDb(false);
      handleFirestoreError(error, OperationType.GET, `users/${userUid}`);
    });

    // Subscribe to fixedIssues subcollection ordered by fixedAt desc
    const qFixedIssues = query(
      collection(db, "users", user.uid, "fixedIssues"),
      orderBy("fixedAt", "desc")
    );
    const unsubFixed = onSnapshot(qFixedIssues, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setFixedIssues(items);
    }, (error) => {
      console.error("Firestore fixedIssues error:", error);
      handleFirestoreError(error, OperationType.GET, `users/${userUid}/fixedIssues`);
    });

    // Subscribe to aiSecurityAdviserChats subcollection ordered by timestamp desc
    const qChats = query(
      collection(db, "users", user.uid, "aiSecurityAdviserChats"),
      orderBy("timestamp", "desc")
    );
    const unsubChats = onSnapshot(qChats, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setAdviserChats(items);
    }, (error) => {
      console.error("Firestore adviser chats error:", error);
      handleFirestoreError(error, OperationType.GET, `users/${userUid}/aiSecurityAdviserChats`);
    });

    // Subscribe to junkCleanHistory subcollection ordered by cleanedAt desc
    const qJunk = query(
      collection(db, "users", user.uid, "junkCleanHistory"),
      orderBy("cleanedAt", "desc")
    );
    const unsubJunk = onSnapshot(qJunk, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setJunkCleanHistory(items);
    }, (error) => {
      console.error("Firestore junkCleanHistory error:", error);
      handleFirestoreError(error, OperationType.GET, `users/${userUid}/junkCleanHistory`);
    });

    // Subscribe to linkScanHistory subcollection ordered by scannedAt desc
    const qLinks = query(
      collection(db, "users", user.uid, "linkScanHistory"),
      orderBy("scannedAt", "desc")
    );
    const unsubLinks = onSnapshot(qLinks, (snap) => {
      const items: any[] = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setLinkScanHistory(items);
    }, (error) => {
      console.error("Firestore linkScanHistory error:", error);
      handleFirestoreError(error, OperationType.GET, `users/${userUid}/linkScanHistory`);
    });

    return () => {
      unsubUser();
      unsubFixed();
      unsubChats();
      unsubJunk();
      unsubLinks();
    };
  }, [user]);

  // Real Google Sign In with Firebase
  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserProfile(result.user);
    } catch (err: any) {
      console.error("Google Auth error:", err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Sign-in popup was closed before completing.");
      } else if (err.code === "auth/unauthorized-domain") {
        setAuthError("This domain is not authorized. Please add it to Firebase Authentication settings.");
      } else {
        setAuthError(err.message || "An authentication error occurred.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleSelectMockAccount = async (account: any, index: number) => {
    setClickedAccountIndex(index);
    setAuthError(null);
    
    // Simulate accounts selector spinner delay matching video (approx 1.2s delay)
    setTimeout(async () => {
      try {
        localStorage.setItem("securevault_mock_email", account.email);
        localStorage.setItem("securevault_mock_name", account.name);

        const mockTemplateEmail = "mock-google-session-v1@securevault.com";
        const mockTemplatePassword = "googlesecure_template_993";

        let finalUser;
        try {
          const res = await signInWithEmailAndPassword(auth, mockTemplateEmail, mockTemplatePassword);
          finalUser = res.user;
        } catch (signInErr: any) {
          if (signInErr.code === "auth/user-not-found" || signInErr.code === "auth/wrong-password" || signInErr.code === "auth/invalid-credential" || signInErr.code === "auth/invalid-login-credentials") {
            const res = await createUserWithEmailAndPassword(auth, mockTemplateEmail, mockTemplatePassword);
            finalUser = res.user;
          } else {
            throw signInErr;
          }
        }

        // Sync Firestore statistics profile for current mock identity in real environment
        await syncUserProfile({
          uid: finalUser.uid,
          email: account.email,
          displayName: account.name,
          photoURL: null
        } as any);

      } catch (err: any) {
        console.error("Mock Google Sign in authentication error:", err);
        setAuthError(err.message || "Could not log into simulation session.");
      } finally {
        setClickedAccountIndex(null);
        setShowGoogleOverlay(false);
      }
    }, 1200);
  };

  // Email Sign In or SignUp Submission
  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigningIn(true);
    setAuthError(null);

    const formattedEmail = email.trim();
    if (!formattedEmail || !password) {
      setAuthError("Please fill out all required fields.");
      setSigningIn(false);
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      setSigningIn(false);
      return;
    }

    try {
      if (authMethod === "signup") {
        // Sign Up Code Block
        if (!displayName.trim()) {
          setAuthError("Display name is required for registration.");
          setSigningIn(false);
          return;
        }

        const result = await createUserWithEmailAndPassword(auth, formattedEmail, password);
        
        // Update auth profile display name
        await updateProfile(result.user, {
          displayName: displayName.trim()
        });

        // Sync with Firestore
        await syncUserProfile({
          uid: result.user.uid,
          email: result.user.email,
          displayName: displayName.trim(),
          photoURL: null
        });

      } else {
        // Log In Code Block
        const result = await signInWithEmailAndPassword(auth, formattedEmail, password);
        await syncUserProfile(result.user);
      }
    } catch (err: any) {
      console.error("Email authentication failed:", err);
      // Friendly translations for standard Firebase errors
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setAuthError("Invalid email or password. Please verify your credentials.");
      } else if (err.code === "auth/email-already-in-use") {
        setAuthError("This email is already registered. Try logging in instead.");
      } else {
        setAuthError(err.message || "An authentication error occurred.");
      }
    } finally {
      setSigningIn(false);
    }
  };

  // Email Sign Out Action
  const handleSignOut = async () => {
    try {
      localStorage.removeItem("securevault_mock_email");
      localStorage.removeItem("securevault_mock_name");
      await signOut(auth);
      setPage("home");
    } catch (err: any) {
      console.error("Sign out error:", err);
    }
  };

  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center font-sans bg-cyber-bg">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>
          <Shield className="w-12 h-12 text-cyber-cyan animate-spin relative" />
        </div>
        <p className="mt-4 text-xs font-mono text-gray-400 tracking-widest uppercase">Verifying Security Session...</p>
      </div>
    );
  }

  // 2. LOGGED IN DASHBOARD VIEW (With Live Firestore Stats)
  if (user) {
    const resolved = getResolvedUser(user);
    const creationTime = user.metadata.creationTime 
      ? new Date(user.metadata.creationTime).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric"
        })
      : "Recently Joined";

    // Firestore data with standard local fallbacks if offline/fetching
    const scansCount = dbData?.noOfScans ?? 0;
    const threatsCount = dbData?.threatsFound ?? 0;
    const junkCleaned = dbData?.safeJunkRemoved ?? 0;
    const linksCount = dbData?.scannedLinksCount ?? 0;

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        
        {/* Profile Card Header with Glowing Status Aura */}
        <div className="relative bg-slate-900 border border-cyan-500/15 rounded-3xl p-6 sm:p-8 overflow-hidden mb-8 shadow-xl">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Display profile photo with secure dynamic shield frame */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-md"></div>
              <div className="relative w-20 h-20 rounded-2xl border-2 border-cyber-cyan overflow-hidden bg-black flex items-center justify-center">
                {resolved?.photoURL ? (
                  <img src={resolved.photoURL} alt={resolved.displayName || "User Avatar"} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center text-cyber-cyan font-bold text-xl uppercase font-display">
                    {resolved?.displayName ? resolved.displayName.slice(0, 2) : "SV"}
                  </div>
                )}
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 bg-cyber-green text-black px-1.5 py-0.5 text-[8px] font-mono font-bold rounded border border-black uppercase tracking-wider">
                V1 Secure
              </span>
            </div>

            {/* User credentials and status details */}
            <div className="text-center sm:text-left space-y-1.5 flex-grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display font-bold text-2xl text-white">
                  {resolved?.displayName || "SecureVault Guardian"}
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-cyber-green text-[10px] font-mono leading-none">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Identity</span>
                </span>
              </div>
              
              <p className="text-sm text-gray-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>{resolved?.email}</span>
              </p>
              
              <p className="text-xs text-gray-500 font-mono">
                Authentication Method: <span className="text-gray-300 capitalize">{resolved?.providerId === "password" ? "Email / Password Secure Vault" : "Google Federated Sign In"}</span>
              </p>
            </div>

            {/* Sign Out Button */}
            <button 
              onClick={handleSignOut}
              className="mt-4 sm:mt-0 bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 hover:text-white text-red-400 px-4 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer self-center"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>

        {/* Real-time statistics telemetry dashboard of user */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-mono uppercase tracking-widest text-cyber-cyan flex items-center gap-2 font-semibold">
              <Database className="w-4 h-4" />
              <span>Synchronized Cloud Diagnostics</span>
            </h2>
            {fetchingDb ? (
              <span className="text-[10px] text-gray-400 font-mono animate-pulse flex items-center gap-1">
                <RefreshCcw className="w-3 h-3 animate-spin text-cyber-cyan" /> Retreiving Live Logs...
              </span>
            ) : (
              <span className="text-[10px] text-cyber-green font-mono flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-ping"></span> Live Cloud Synced
              </span>
            )}
          </div>

          {/* grid of 4 stats card columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat Box 1: Scans */}
            <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-cyan-500/10 rounded-xl text-cyber-cyan">
                  <Binary className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">TELEMETRY_A</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-mono font-bold text-white mb-0.5">{scansCount}</h3>
                <p className="text-xs text-gray-400">Diagnostic Scans Run</p>
              </div>
            </div>

            {/* Stat Box 2: Threats */}
            <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-red-500/10 rounded-xl text-red-400">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">TELEMETRY_B</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-mono font-bold text-white mb-0.5">{threatsCount}</h3>
                <p className="text-xs text-gray-400">Threat Flags Handled</p>
              </div>
            </div>

            {/* Stat Box 3: Safe Junk */}
            <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-cyber-green">
                  <Trash2 className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">TELEMETRY_C</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-mono font-bold text-white mb-0.5">{junkCleaned.toFixed(2)} GB</h3>
                <p className="text-xs text-gray-400">Cache Junk Safely Cleared</p>
              </div>
            </div>

            {/* Stat Box 4: Links */}
            <div className="bg-slate-900/60 border border-cyan-500/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400">
                  <Link2 className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-mono text-gray-500 uppercase">TELEMETRY_D</span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-mono font-bold text-white mb-0.5">{linksCount}</h3>
                <p className="text-xs text-gray-400">Safety Links Checked</p>
              </div>
            </div>

          </div>
        </div>

        {/* Live Cloud Database Document Explorer */}
        <div className="bg-slate-900 border border-cyan-500/15 rounded-3xl p-6 shadow-xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10 border-b border-gray-800 pb-5">
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest text-cyber-cyan flex items-center gap-2 font-bold">
                <Database className="w-4 h-4 text-cyber-cyan" />
                <span>Primary Cloud Collections Explorer</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Real-time synchronized views of your raw Firestore documents in collection subcode pathways, parsed for humans.
              </p>
            </div>
            
            <span className="bg-slate-950 px-3 py-1 border border-cyan-400/20 text-cyber-cyan text-[10px] font-mono rounded-lg">
              DB Instance: <strong className="text-white">(default)</strong>
            </span>
          </div>

          {/* Tab buttons switcher */}
          <div className="grid grid-cols-2 lg:grid-cols-4 bg-slate-950 p-1.5 rounded-xl gap-1.5 mb-6 border border-gray-800 relative z-10">
            <button
              onClick={() => setActiveSubTab("fixedIssues")}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === "fixedIssues"
                  ? "bg-slate-900 text-cyber-cyan border border-cyan-500/35 shadow-md font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Vulnerabilities ({fixedIssues.length})</span>
            </button>
            
            <button
              onClick={() => setActiveSubTab("chats")}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === "chats"
                  ? "bg-slate-900 text-cyber-cyan border border-cyan-500/35 shadow-md font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Advice Chat ({adviserChats.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("linkHistory")}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === "linkHistory"
                  ? "bg-slate-900 text-cyber-cyan border border-cyan-500/35 shadow-md font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Link Checks ({linkScanHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("junkHistory")}
              className={`py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeSubTab === "junkHistory"
                  ? "bg-slate-900 text-cyber-cyan border border-cyan-500/35 shadow-md font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipes & Clears ({junkCleanHistory.length})</span>
            </button>
          </div>

          {/* Items content rendering */}
          <div className="relative z-10 min-h-[180px]">
            {activeSubTab === "fixedIssues" && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-2">
                  Firestore Source Folder: <span className="text-gray-300">/users/{user.uid}/fixedIssues</span>
                </div>
                {fixedIssues.length === 0 ? (
                  <div className="bg-slate-950 rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center gap-3">
                    <Shield className="w-8 h-8 text-gray-600 animate-pulse" />
                    <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                      No active cloud database records yet. Trigger a digital security scan inside the simulator to automatically record patched vulnerabilities to Firestore!
                    </p>
                    <button onClick={() => setPage("home")} className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyber-cyan text-[10px] font-semibold tracking-wider font-mono py-1.5 px-3 rounded-lg uppercase cursor-pointer">
                      💡 Run Scanner Simulation
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fixedIssues.map((item) => {
                      const formatFirestoreDateLocal = (val: any): string => {
                        if (!val) return "Just now";
                        if (typeof val === "object" && typeof val.seconds === "number") {
                          return new Date(val.seconds * 1000).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          });
                        }
                        return new Date(val).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        });
                      };
                      return (
                        <div key={item.id} className="bg-slate-950/70 border border-gray-800/80 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/20 transition-all shadow-md group">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h4 className="text-xs font-bold text-white leading-tight font-display">{item.issueTitle || "Security Issue"}</h4>
                              <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                                item.riskLevel?.toLowerCase().includes("critical") 
                                  ? "bg-red-500/15 text-red-400 border border-red-500/20" 
                                  : "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"
                              }`}>
                                {item.riskLevel || "Risk Detected"}
                              </span>
                            </div>
                            <div className="space-y-1 font-mono text-[10px] text-gray-400 mb-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500">CATEGORY TYPE:</span>
                                <span className="text-gray-300">{item.issueType || "Configuration Module"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">PROTECTOR SYSTEM:</span>
                                <span className="text-gray-300">{item.sourceProtector || "Smart Scan"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">ACTION EXECUTED:</span>
                                <span className="text-cyber-green font-bold">{item.action || "Patched"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-900 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                            <span>📅 {formatFirestoreDateLocal(item.fixedAt)}</span>
                            <span className="text-[8px] uppercase tracking-wide bg-slate-900 border border-gray-800 px-1.5 py-0.5 rounded select-all group-hover:border-cyan-500/15">
                              DocId: {item.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === "chats" && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-2">
                  Firestore Source Folder: <span className="text-gray-300">/users/{user.uid}/aiSecurityAdviserChats</span>
                </div>
                {adviserChats.length === 0 ? (
                  <div className="bg-slate-950 rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center gap-3">
                    <Sparkles className="w-8 h-8 text-gray-600 animate-pulse" />
                    <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                      No active AI advisory history. Trigger an "AI Explain Risk" inside the scanner results mockup to automatically save a detailed report explain record to Firestore!
                    </p>
                    <button onClick={() => setPage("home")} className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyber-cyan text-[10px] font-semibold tracking-wider font-mono py-1.5 px-3 rounded-lg uppercase cursor-pointer">
                      💡 Ask AI Adviser Simulation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adviserChats.map((item) => {
                      const formatFirestoreDateLocal = (val: any): string => {
                        if (!val) return "Just now";
                        if (typeof val === "object" && typeof val.seconds === "number") {
                          return new Date(val.seconds * 1000).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          });
                        }
                        return new Date(val).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        });
                      };
                      return (
                        <div key={item.id} className="bg-slate-950/70 border border-gray-800/80 p-5 rounded-2xl hover:border-cyan-500/20 transition-all shadow-md group">
                          
                          {/* Question Dialog box bubble */}
                          <div className="mb-3">
                            <span className="text-[8px] font-mono text-gray-500 uppercase block mb-1">USER QUERY:</span>
                            <div className="inline-block bg-slate-900 text-gray-200 text-xs px-3.5 py-2 rounded-2xl rounded-tl-none border border-gray-800 max-w-xl font-sans">
                              {item.question}
                            </div>
                          </div>

                          {/* Answer Dialog box bubble */}
                          <div className="mb-4">
                            <span className="text-[8px] font-mono text-purple-400 uppercase tracking-widest block mb-1">🤖 AI RESPONSE:</span>
                            <div className="bg-purple-950/10 border border-purple-500/15 p-4 rounded-2xl rounded-tr-none text-xs text-gray-300 font-sans leading-relaxed">
                              {item.answer}
                            </div>
                          </div>

                          <div className="pt-2.5 border-t border-gray-900/60 flex flex-wrap justify-between items-center text-[9px] text-gray-500 font-mono gap-2">
                            <div className="flex gap-4">
                              <span>📅 {formatFirestoreDateLocal(item.timestamp)}</span>
                              <span>CATEGORY: <strong className="text-gray-400">{item.category || "AI Summary"}</strong></span>
                            </div>
                            <span className="text-[8px] uppercase tracking-wide bg-slate-900 border border-gray-800 px-1.5 py-0.5 rounded select-all group-hover:border-cyan-500/15">
                              DocId: {item.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === "linkHistory" && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-2">
                  Firestore Source Folder: <span className="text-gray-300">/users/{user.uid}/linkScanHistory</span>
                </div>
                {linkScanHistory.length === 0 ? (
                  <div className="bg-slate-950 rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center gap-3">
                    <Link2 className="w-8 h-8 text-gray-600 animate-pulse" />
                    <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                      No URL sandbox checks scanned. Paste or test any link inside the Link Protection Sandbox simulator to instantly save scanning telemetry to Firestore!
                    </p>
                    <button onClick={() => setPage("home")} className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyber-cyan text-[10px] font-semibold tracking-wider font-mono py-1.5 px-3 rounded-lg uppercase cursor-pointer">
                      💡 Test Phishing Simulator
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {linkScanHistory.map((item) => {
                      const formatFirestoreDateLocal = (val: any): string => {
                        if (!val) return "Just now";
                        if (typeof val === "object" && typeof val.seconds === "number") {
                          return new Date(val.seconds * 1000).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          });
                        }
                        return new Date(val).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        });
                      };
                      return (
                        <div key={item.id} className="bg-slate-950/70 border border-gray-800/80 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/20 transition-all shadow-md group">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2 w-full overflow-hidden">
                              <span className="font-mono text-xs text-cyan-400 select-all truncate block flex-1 max-w-[80%]">{item.link}</span>
                              <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                                item.safetyStatus === "Safe" 
                                  ? "bg-emerald-500/15 text-cyber-green border border-emerald-500/20" 
                                  : "bg-red-500/15 text-red-400 border border-red-500/20"
                              }`}>
                                {item.safetyStatus}
                              </span>
                            </div>
                            <div className="space-y-1 font-mono text-[10px] text-gray-400 mb-3">
                              <div className="flex justify-between">
                                <span className="text-gray-500">URL CLASSIFICATION:</span>
                                <span className="text-gray-300">{item.siteCategory || "Sandbox Run"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">HEURISTIC ANALYSIS:</span>
                                <span className={item.safetyStatus === "Safe" ? "text-cyber-green" : "text-red-400"}>
                                  {item.safetyStatus === "Safe" ? "Threats: 0 detected" : "Spoofing structures logged"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-gray-900 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                            <span>📅 {formatFirestoreDateLocal(item.scannedAt)}</span>
                            <span className="text-[8px] uppercase tracking-wide bg-slate-900 border border-gray-800 px-1.5 py-0.5 rounded select-all group-hover:border-cyan-500/15">
                              DocId: {item.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeSubTab === "junkHistory" && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase font-mono tracking-wider text-gray-500 mb-2">
                  Firestore Source Folder: <span className="text-gray-300">/users/{user.uid}/junkCleanHistory</span>
                </div>
                {junkCleanHistory.length === 0 ? (
                  <div className="bg-slate-950 rounded-2xl p-8 border border-gray-800 text-center flex flex-col items-center justify-center gap-3">
                    <Trash2 className="w-8 h-8 text-gray-600 animate-pulse" />
                    <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                      No cache-wipe entries recorded. Press "Clean selected cache files" inside the simulator scan results page to immediately log a secure wipe event in Firestore!
                    </p>
                    <button onClick={() => setPage("home")} className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyber-cyan text-[10px] font-semibold tracking-wider font-mono py-1.5 px-3 rounded-lg uppercase cursor-pointer">
                      💡 Wipe Caches Simulation
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {junkCleanHistory.map((item) => {
                      const formatFirestoreDateLocal = (val: any): string => {
                        if (!val) return "Just now";
                        if (typeof val === "object" && typeof val.seconds === "number") {
                          return new Date(val.seconds * 1000).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          });
                        }
                        return new Date(val).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        });
                      };
                      return (
                        <div key={item.id} className="bg-slate-950/70 border border-gray-800/80 p-4 rounded-xl flex flex-col justify-between hover:border-cyan-500/20 transition-all shadow-md group">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <span className="font-sans text-xs font-bold text-white">Cache Cleared: {((item.spaceFreedMb || 2508.8) / 1024).toFixed(2)} GB</span>
                              <span className="text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/15 text-cyber-green border border-emerald-500/20">
                                CLEAN_SUCCESS
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 mb-3 font-mono">
                              <span className="text-gray-500 block mb-0.5">ACTION:</span>
                              {item.action || "Wiped redundant temporary assets"}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-gray-900 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                            <span>📅 {formatFirestoreDateLocal(item.cleanedAt)}</span>
                            <span className="text-[8px] uppercase tracking-wide bg-slate-900 border border-gray-800 px-1.5 py-0.5 rounded select-all group-hover:border-cyan-500/15">
                              DocId: {item.id}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Credentials and Security Vault status details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {/* Metadata info */}
          <div className="bg-slate-900/40 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyber-cyan" />
              <span>Security Vault Context</span>
            </h2>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-500">PROVIDER PROTOCOL</span>
                <span className="text-gray-300">{user.providerData[0]?.providerId === "password" ? "password hashing (sha-256)" : "google.com oauth"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-500">MEMBER REGISTRATION</span>
                <span className="text-gray-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyber-green" />
                  <span>{creationTime}</span>
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-500">FIRESTORE STORAGE SCHEME</span>
                <span className="text-cyber-green font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse"></span>
                  <span>ONLINE & SECURED</span>
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">USER PROFILE ID</span>
                <span className="text-gray-400 select-all truncate max-w-[180px]">{user.uid}</span>
              </div>
            </div>
          </div>

          {/* Guidelines on using data inside simulator */}
          <div className="bg-slate-900/40 border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 py-1 px-2.5 rounded-full text-cyber-cyan text-[10px] font-mono">
                <CloudLightning className="w-3.5 h-3.5 animate-bounce" />
                <span>Local-to-Cloud Stream</span>
              </div>
              <h2 className="font-display font-semibold text-lg text-white">Interact with the Simulator</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                SecureVault securely logs simulated diagnostic metrics when you trigger scans, test safety links, or wipe cache files inside our <strong>Interactive Device Simulator</strong> on the Home dashboard. Try completing scans to see your real-time numbers increment instantly above!
              </p>
            </div>
            
            <button 
              onClick={() => setPage("home")}
              className="mt-6 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-semibold font-display text-xs py-2.5 rounded-xl transition-all cursor-pointer text-center"
            >
              Go to Simulator (Update Stats)
            </button>
          </div>
        </div>

      </div>
    );
  }

  // 3. UNAUTHENTICATED SIGN IN/UP FORM
  return (
    <>
      <div className="max-w-md mx-auto px-4 py-12 font-sans bg-cyber-bg">
      <div className="relative bg-slate-900 border border-cyan-500/20 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_0_50px_rgba(3,105,161,0.1)]">
        
        {/* Glow backdrop positioning */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
        
        <div className="text-center space-y-3 relative z-10 mb-6">
          {/* Logo container block */}
          <div className="inline-flex relative mb-1">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-md"></div>
            <div className="relative bg-black border border-cyan-500/30 w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center">
              <img 
                src={appLogo} 
                alt="SecureVault Icon" 
                className="w-10 h-10 object-cover" 
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">
            {authMethod === "login" ? "Access Security Session" : "Create Security Profile"}
          </h1>
          
          <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xs mx-auto">
            SecureVault maintains your metrics inside the connected Firebase project <strong>securevaultappcredentials</strong> to secure and count your scans across sessions.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl mb-6 border border-gray-800">
          <button 
            type="button"
            onClick={() => {
              setAuthMethod("login");
              setAuthError(null);
            }} 
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMethod === "login" 
                ? "bg-slate-900 text-cyber-cyan border border-cyan-500/25 shadow-md" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          
          <button 
            type="button"
            onClick={() => {
              setAuthMethod("signup");
              setAuthError(null);
            }} 
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMethod === "signup" 
                ? "bg-slate-900 text-cyber-cyan border border-cyan-500/25 shadow-md" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Error notification banner */}
        {authError && (
          <div className="bg-red-950/40 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-300 font-sans mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[9px] text-red-500 font-mono">Authentication Alert:</span>
              <p className="leading-relaxed">{authError}</p>
            </div>
          </div>
        )}

        {/* Firebase Email/Password Form */}
        <form onSubmit={handleEmailAuthSubmit} className="space-y-4 relative z-10">
          
          {authMethod === "signup" && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Your Display Name</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-gray-800 rounded-xl py-2.5 pl-3 pr-10 hover:border-gray-700 text-xs font-sans text-gray-200 focus:outline-none focus:border-cyber-cyan"
                  placeholder="Enter display name"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-gray-800 rounded-xl py-2.5 pl-3 pr-10 hover:border-gray-700 text-xs font-sans text-gray-200 focus:outline-none focus:border-cyber-cyan"
                placeholder="guardian@securevault.com"
              />
              <Mail className="absolute right-3.5 top-3 w-4 h-4 text-gray-600" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Access Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-gray-800 rounded-xl py-2.5 pl-3 pr-10 hover:border-gray-700 text-xs font-sans text-gray-200 focus:outline-none focus:border-cyber-cyan"
                placeholder="At least 6 characters"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-600 hover:text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={signingIn}
            className={`w-full bg-slate-950 border border-gray-800 hover:border-cyber-cyan/50 text-white rounded-xl py-3 px-4 font-display font-semibold text-xs flex items-center justify-center gap-2 mt-2 transition-all cursor-pointer ${
              signingIn ? "opacity-50 pointer-events-none cursor-default" : ""
            }`}
          >
            {signingIn ? (
              <span className="animate-spin text-cyber-cyan font-bold block">⚡</span>
            ) : (
              <Shield className="w-3.5 h-3.5 text-cyber-cyan" />
            )}
            <span>{signingIn ? "Locking Session..." : authMethod === "login" ? "Email Login" : "Register Credentials"}</span>
          </button>

          <div className="relative py-2 flex items-center justify-center">
            <span className="absolute inset-x-0 h-px bg-gray-800"></span>
            <span className="relative bg-slate-900 px-3 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              OR FEDERATED PROVIDERS
            </span>
          </div>

          {/* Federated login option with google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className={`w-full bg-slate-950 border border-gray-800 hover:border-cyan-500/50 text-white rounded-xl py-3 px-4 font-display font-semibold text-xs flex items-center justify-center gap-3 transition-all cursor-pointer ${
              signingIn ? "opacity-50 pointer-events-none cursor-default" : ""
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Instructions to enable Email login in Firebase Console in case they haven't */}
          <div className="bg-slate-950/60 p-3 rounded-lg border border-gray-800 mt-4">
            <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> Tips for administrator:
            </span>
            <p className="text-[10px] text-gray-500 font-sans mt-1 leading-normal">
              Ensure <strong>Email/Password sign-in provider</strong> is enabled in your Firebase console under Authentication &gt; Sign-in method tab.
            </p>
          </div>

        </form>
      </div>
    </div>

    {showGoogleOverlay && (
      <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="relative bg-[#1c1c1e] text-gray-200 w-full max-w-[350px] rounded-3xl border border-gray-800 shadow-2xl p-6 overflow-hidden">
          
          {/* Top Close icon */}
          <button 
            type="button"
            onClick={() => { setShowGoogleOverlay(false); setClickedAccountIndex(null); }}
            className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Circular atomic lock icon logo matching video */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex relative">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"></div>
              <div className="relative bg-[#0d1527] border border-cyan-500/30 w-11 h-11 rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src={appLogo} 
                  alt="SecureVault Icon" 
                  className="w-7 h-7 object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <h2 className="text-white text-base font-bold tracking-tight font-sans">Choose an account</h2>
            <p className="text-[11px] text-gray-400 font-sans">to continue to <span className="text-cyan-400 font-bold">SecureVault</span></p>
          </div>

          {/* List selector rows */}
          <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
            {MOCK_GOOGLE_ACCOUNTS.map((acc, index) => {
              const isClicked = clickedAccountIndex === index;
              return (
                <button
                  key={acc.id}
                  type="button"
                  disabled={clickedAccountIndex !== null}
                  onClick={() => handleSelectMockAccount(acc, index)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/60 active:scale-[0.98] transition-all flex items-center justify-between border border-transparent hover:border-gray-800 cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar with initials background */}
                    <div className={`w-9 h-9 rounded-full ${acc.avatarBg} flex items-center justify-center font-bold text-sm text-white select-none`}>
                      {acc.initial}
                    </div>

                    {/* Name & Email detail */}
                    <div className="font-sans leading-tight">
                      <span className="text-xs font-bold text-white block">{acc.name}</span>
                      <span className="text-[10px] text-gray-300 block mt-0.5">{acc.email}</span>
                    </div>
                  </div>

                  {/* Spinner loader inside card segment */}
                  {isClicked ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin mr-1" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              disabled={clickedAccountIndex !== null}
              onClick={() => {
                setShowGoogleOverlay(false);
                setAuthMethod("signup");
              }}
              className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800/60 active:scale-[0.98] transition-all flex items-center gap-3 border border-transparent hover:border-gray-800 cursor-pointer disabled:opacity-50 text-gray-300 font-sans"
            >
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-gray-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-gray-300">Add another account</span>
              </div>
            </button>
          </div>
          
          <p className="text-[9px] text-gray-500 font-sans text-center mt-5 leading-normal">
            Google will share your name, email address, language preference, and profile picture with SecureVault. Under privacy clauses, no real details are logged.
          </p>
        </div>
      </div>
    )}
  </>
  );
}
