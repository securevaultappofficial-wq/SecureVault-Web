/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import FeaturesView from "./components/FeaturesView";
import TrustPrivacy from "./components/TrustPrivacy";
import ScamSafety from "./components/ScamSafety";
import AiReportsView from "./components/AiReportsView";
import ComingSoon from "./components/ComingSoon";
import Support from "./components/Support";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfUse from "./components/TermsOfUse";
import AuthView from "./components/AuthView";
import DeveloperPortfolio from "./components/DeveloperPortfolio";
import BlogView from "./components/BlogView";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";

const pagePathMap: Record<string, string> = {
  home: "/",
  features: "/features.html",
  blogs: "/blog.html",
  scams: "/scam-protection.html",
  "ai-reports": "/ai-security-adviser.html",
  "developer-portfolio": "/developer-portfolio.html",
};

const pathPageMap: Record<string, string> = Object.fromEntries(
  Object.entries(pagePathMap).map(([page, path]) => [path, page])
);

function getPageFromLocation() {
  const pathPage = pathPageMap[window.location.pathname];
  if (pathPage) return pathPage;

  const params = new URLSearchParams(window.location.search);
  return params.get("page") || window.location.hash.replace("#", "") || "home";
}

export default function App() {
  const [page, setPageState] = useState<string>(() => getPageFromLocation());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize Google Auth session state across turns
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Keep routing state aligned with browser back/forward on clean static URLs.
  useEffect(() => {
    const handlePopState = () => setPageState(getPageFromLocation());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setPage = (newPage: string) => {
    setPageState(newPage);
    const nextPath = pagePathMap[newPage] || `/#${encodeURIComponent(newPage)}`;
    if (window.location.pathname + window.location.search + window.location.hash !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  };

  const renderActiveView = () => {
    switch (page) {
      case "home":
        return <HomeView setPage={setPage} />;
      case "features":
        return <FeaturesView />;
      case "trust":
        return <TrustPrivacy />;
      case "scams":
        return <ScamSafety />;
      case "ai-reports":
        return <AiReportsView />;
      case "download":
        return <ComingSoon />;
      case "support":
        return <Support />;
      case "developer-portfolio":
        return <DeveloperPortfolio />;
      case "blogs":
        return <BlogView />;
      case "privacy":
        return <PrivacyPolicy />;
      case "terms":
        return <TermsOfUse />;
      case "auth":
        return <AuthView user={user} loading={loading} setPage={setPage} />;
      default:
        return <HomeView setPage={setPage} />;
    }
  };

  return (
    <div id="securevault-root" className="min-h-screen flex flex-col justify-between bg-cyber-bg text-gray-300">
      
      {/* Dynamic Navigation Header */}
      <Header currentPage={page} setPage={setPage} user={user} loading={loading} />


      {/* Main Responsive Transition Stage */}
      <main className="flex-1 bg-cyber-bg relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Trust footer banner */}
      <Footer setPage={setPage} />

    </div>
  );
}
