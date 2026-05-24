/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Shield, Phone, Globe, ShieldAlert, Heart } from "lucide-react";
import appLogo from "../assets/images/secure_vault_logo_1779581755129.png";

interface FooterProps {
  setPage: (page: string) => void;
}

export default function Footer({ setPage }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavigate = (pageId: string) => {
    setPage(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 border-t border-gray-800 text-gray-400 font-sans">
      
      {/* Dynamic Urgent Awareness segment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-gray-800 pb-12">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate("home")}>
              <div className="relative bg-black border border-cyan-500/30 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src={appLogo} 
                  alt="SecureVault Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-bold text-white text-base tracking-tight">
                Secure<span className="text-cyber-cyan">Vault</span> <span className="text-xs text-gray-400 font-normal font-mono">V1</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-md">
              SecureVault is a transparent, honest digital safety initiative built representing high-integrity cybersecurity values. We translate technical scan jargon into human relief—specifically designed to look out for Indian smartphone users and their families.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-slate-900/60 p-3 rounded-lg border border-gray-800/80 max-w-md">
              <Heart className="w-4.5 h-4.5 fill-red-500 stroke-red-500 text-red-500 flex-shrink-0" />
              <span>
                Created with a mission to protect families. Conceptualized by <strong>Saathvik Bonakurthi</strong>, a student developer.
              </span>
            </div>
          </div>

          {/* Quick Navigations */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-white text-sm font-semibold tracking-wider uppercase mb-4">Official Sections</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              <button onClick={() => handleNavigate("home")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer">1. Home</button>
              <button onClick={() => handleNavigate("features")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer">2. Features V1</button>
              <button onClick={() => handleNavigate("trust")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer">3. Trust & Privacy</button>
              <button onClick={() => handleNavigate("scams")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer">4. Scam Safety</button>
              <button onClick={() => handleNavigate("ai-reports")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer">5. AI & Reports</button>
              <button onClick={() => handleNavigate("download")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer">6. Coming Soon</button>
              <button onClick={() => handleNavigate("support")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer">7. Support & FAQ</button>
              <button onClick={() => handleNavigate("privacy")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer text-xs underline">8. Privacy Policy</button>
              <button onClick={() => handleNavigate("terms")} className="text-left hover:text-cyber-cyan transition-colors cursor-pointer text-xs underline">9. Terms of Use</button>
            </div>
          </div>

          {/* National Cybercrime Warning Corner */}
          <div className="lg:col-span-4 bg-slate-900 border border-red-900/30 rounded-xl p-5 shadow-inner">
            <div className="flex items-center gap-2.5 text-red-400 font-semibold text-sm font-display mb-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>National Cybercrime Helpline</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-4">
              If you or a family member fell key to an ongoing fraud, acted on a fake video 'arrest' threat, or wire-transferred money, report it within the golden hour to retrieve blocks on transaction routes.
            </p>
            <div className="space-y-2 font-mono">
              <a href="tel:1930" className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-bold py-2 px-3 rounded-lg transition-all cursor-pointer">
                <Phone className="w-3.5 h-3.5" />
                <span>Call Indian Hotline: 1930</span>
              </a>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-gray-700 text-gray-300 text-xs py-2 px-3 rounded-lg transition-all cursor-pointer">
                <Globe className="w-3.5 h-3.5" />
                <span>Official: cybercrime.gov.in</span>
              </a>
            </div>
          </div>

        </div>

        {/* Brand Bottom Accents */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
          <div className="text-center md:text-left space-y-1">
            <p>&copy; {currentYear} SecureVault. General Early-Stage App Identity Project.</p>
            <p className="text-gray-500">
              Disclaimer: SecureVault V1 is designed as a consultative risk warning advisor. It is not an anti-virus suite capable of direct low-level kernel virus eradication.
            </p>
          </div>
          <div className="flex items-center gap-4 text-gray-500 divide-x divide-gray-800">
            <button onClick={() => handleNavigate("privacy")} className="hover:text-gray-300 cursor-pointer">Privacy Policy</button>
            <button onClick={() => handleNavigate("terms")} className="pl-4 hover:text-gray-300 cursor-pointer">Terms of Use</button>
            <button onClick={() => handleNavigate("support")} className="pl-4 hover:text-gray-300 cursor-pointer">Support</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
