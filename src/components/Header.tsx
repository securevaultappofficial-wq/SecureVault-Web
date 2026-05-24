/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Menu, X, Phone, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import appLogo from "../assets/images/secure_vault_logo_1779581755129.png";

import { User as FirebaseUser } from "firebase/auth";
import { User, LogIn, Key } from "lucide-react";
import { getResolvedUser } from "../lib/mockAccounts";

interface HeaderProps {
  currentPage: string;
  setPage: (page: string) => void;
  user: FirebaseUser | null;
  loading: boolean;
}

export default function Header({ currentPage, setPage, user, loading }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resolvedUser = getResolvedUser(user);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "features", label: "Features V1" },
    { id: "trust", label: "Trust & Privacy" },
    { id: "scams", label: "Scam Safety" },
    { id: "ai-reports", label: "AI & Reports" },
    { id: "download", label: "Coming Soon" },
    { id: "support", label: "Support & FAQ" },
  ];


  const handleNavClick = (id: string) => {
    setPage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top Banner Alert Segment */}
      <div className="bg-gradient-to-r from-red-950/80 via-black to-slate-950 text-xs py-2 px-4 border-b border-red-500/20 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 font-mono">
          <div className="flex items-center gap-2 text-red-400">
            <Megaphone className="w-3 px-0.5 animate-bounce text-red-500" />
            <span>CRITICAL ADVISORY: State departments do not execute Arrests on video calls.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Lost money in a scam? Dial immediately:</span>
            <a
              href="tel:1930"
              className="flex items-center gap-1 bg-red-500/15 text-red-400 px-2 py-0.5 rounded border border-red-500/30 font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              <Phone className="w-3 h-3" />
              <span>1930 Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Primary Header */}
      <header className="bg-slate-950/80 border-b border-gray-800 backdrop-blur-lg sticky top-[33px] sm:top-[37px] z-40">
        <div id="nav-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-md group-hover:bg-cyan-400/35 transition-all"></div>
              <div className="relative bg-black border border-cyan-500/40 w-10 h-10 rounded-xl overflow-hidden group-hover:border-cyber-green transition-all duration-300 flex items-center justify-center">
                <img 
                  src={appLogo} 
                  alt="SecureVault Icon" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-tight text-white">
                  Secure<span className="text-cyber-cyan group-hover:text-cyber-green transition-all">Vault</span>
                </span>
                <span className="bg-cyan-500/10 text-[10px] font-mono text-cyber-cyan border border-cyan-500/20 px-1.5 py-0.2 rounded">V1</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-widest hidden sm:block">SMART SECURITY. SIMPLE GUIDANCE.</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative font-display text-sm tracking-wide px-3.5 py-2 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? "text-cyber-cyan bg-cyan-500/5" 
                      : "text-gray-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div 
                      layoutId="activeGlow"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full shadow-[0_0_8px_rgba(0,212,255,0.7)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Call to Action Button */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full border border-slate-800 animate-pulse bg-slate-900"></div>
            ) : resolvedUser ? (
              <button
                onClick={() => handleNavClick("auth")}
                className="flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 hover:border-cyber-cyan text-white text-xs font-mono py-1.5 px-3 rounded-full hover:bg-slate-950 transition-all cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.1)]"
              >
                {resolvedUser.photoURL ? (
                  <img src={resolvedUser.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-5.5 h-5.5 rounded-full border border-cyber-cyan/50" />
                ) : (
                  <User className="w-3.5 h-3.5 text-cyber-cyan" />
                )}
                <span className="whitespace-nowrap">{resolvedUser.displayName || "Account"}</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick("auth")}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-cyan-950/25 text-cyber-cyan hover:text-white border border-cyan-500/30 hover:border-cyber-cyan text-xs font-mono font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            <button 
              onClick={() => handleNavClick("download")}
              className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 text-white font-mono text-xs font-semibold px-4 py-2 rounded-lg border border-cyan-500/30 hover:border-cyber-cyan/60 glow-cyan transition-all duration-300 cursor-pointer"
            >
              Join Early Waitlist
            </button>
          </div>

          {/* Mobile Action toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950 border-b border-gray-800"
            >
              <div className="px-4 pt-2 pb-6 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left font-display text-sm px-4 py-3 rounded-lg font-medium flex items-center justify-between transition-all ${
                        isActive 
                          ? "text-cyber-cyan bg-cyan-500/10 border-l-2 border-cyber-cyan" 
                          : "text-gray-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 bg-cyber-cyan rounded-full shadow-[0_0_4px_rgba(0,212,255,1)]" />}
                    </button>
                  );
                })}
                <div className="pt-4 px-2 space-y-3">
                  {!loading && (
                  resolvedUser ? (
                      <button
                        onClick={() => handleNavClick("auth")}
                        className="w-full text-left bg-slate-900 border border-cyan-500/20 rounded-xl p-3.5 flex items-center gap-3 cursor-pointer"
                      >
                        {resolvedUser.photoURL ? (
                          <img src={resolvedUser.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full border border-cyber-cyan" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-cyan-500/30">
                            <User className="w-4 h-4 text-cyber-cyan" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-white">{resolvedUser.displayName || "SecureVault User"}</p>
                          <p className="text-[10px] text-cyber-cyan font-mono leading-none mt-1">Portal Secure Mode</p>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleNavClick("auth")}
                        className="w-full text-center bg-slate-950 border border-cyan-500/40 text-cyber-cyan text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In with Google</span>
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handleNavClick("download")}
                    className="w-full text-center bg-gradient-to-r from-cyber-cyan to-cyber-green text-black font-semibold text-sm py-2.5 rounded-lg active:scale-95 transition-all shadow-md shadow-cyan-500/15 cursor-pointer"
                  >
                    Join Early Waitlist
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
