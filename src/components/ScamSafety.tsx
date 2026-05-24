/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SCAMS_DATA } from "../data/scams";
import { ScamInfo } from "../types";
import { 
  Search, ShieldAlert, AlertTriangle, AlertCircle, Phone, 
  HelpCircle, ArrowRight, CheckCircle2, ChevronRight, X, Heart, Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ScamSafety() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScamId, setSelectedScamId] = useState<string | null>(null);
  
  // Interactive Quiz state states
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const filterScams = SCAMS_DATA.filter((scam) =>
    scam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scam.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scam.whatItIs.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedScam = SCAMS_DATA.find((s) => s.id === selectedScamId);

  // Interactive Quiz questions list
  const quizQuestions = [
    {
      scenario: "You receive an urgent text message claiming your SIM card is deactivating in 2 hours. It displays a telephone number to complete immediate 'KYC verification' over WhatsApp.",
      choices: [
        "Call the mobile number and give details immediately so they do not cut your SIM connection.",
        "Ignore the SMS. Call your telecom provider's official customer line printed on their official website or visit a verified outlet."
      ],
      correctIndex: 1,
      explanation: "Humble Cyber Tip: Authentic telecom companies never request PAN card or Aadhar card details over unverified WhatsApp numbers under short 2-hour blocking warnings. No bank or SIM provider coordinates urgent KYC updates via random text lines!"
    },
    {
      scenario: "A caller claiming to be a CBI officer states that a parcel containing narcotic substances was intercepted in your name. They order you to join a Skype video call immediately for 'Digital Arrest'.",
      choices: [
        "Panickedly follow orders, lock your room, remain on video, and deposit verification cash.",
        "Hang up immediately! There is no legal procedure called 'Digital Arrest' in India. Genuine state authorities never execute arrest protocols or issue bail via Skype videos."
      ],
      correctIndex: 1,
      explanation: "Emergency Safety Protocol: Police units do not audit cash holdings dynamically. Never cooperate with video video investigators threatening immediate jail unless money transfers occur."
    },
    {
      scenario: "A net banking helper requests you download 'AnyDesk' or 'TeamViewer' to help reverse an unauthorized ₹5,000 debit from your UPI account.",
      choices: [
        "Download the screen-sharing utility and read the 9-digit connection key.",
        "Refuse immediately! Screen sharing utilities cast your smartphone stream directly onto scammers' panels, allowing them to capture bank password sequences and secure OTP SMS."
      ],
      correctIndex: 1,
      explanation: "Diagnostic rule: Authentic merchant supports never demand screen configuration access or require screenshare connections to approve transaction reversals."
    },
    {
      scenario: "A buyer on OLX sends GPay message collect notification stating: 'Complete UPI PIN authorization to accept ₹15,000 lottery cash prize'.",
      choices: [
        "Enter your secure UPI app PIN to finalize the lottery receipt.",
        "Decline the collect push request. You never need a UPI PIN to accept or credit money into your bank."
      ],
      correctIndex: 1,
      explanation: "Heuristic absolute truth: A UPI PIN is strictly an outgoing debit authorization key. If you enter your PIN, money exits your ledger. Period."
    },
    {
      scenario: "You downloaded a local sports app from a browser blog. On startup, Android shows system dialog alert: 'Allow app permission to read notifications and SMS'.",
      choices: [
        "Approve the permission so you do not freeze the background video stream.",
        "Deny permissions and delete the app immediately! Read SMS triggers are hijacked by SMS-Trojans to intercept secure bank OTP logins without your physical awareness."
      ],
      correctIndex: 1,
      explanation: "Mobile protection rule: Simple utilities should never claim authority over your physical SMS block. Keep unverified packages strictly off-system."
    }
  ];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    if (index === quizQuestions[currentQuestion].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizCompleted(false);
    setQuizActive(true);
  };

  return (
    <div className="py-12 bg-cyber-bg text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Headings */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="font-display font-medium text-4xl tracking-tight text-white sm:text-5xl">
            National <span className="text-red-400">Scam Safety</span> Library
          </h1>
          <p className="mt-4 text-base text-gray-400 leading-relaxed font-sans">
            Knowledge is the best firewall. Filter and explore active cyber traps targeting Indian users. Read how they execute tricks and learn safe immediate exits.
          </p>
        </div>

        {/* Dynamic Quiz Spotlight segment */}
        <div className="bg-gradient-to-r from-purple-950/20 via-slate-900 to-indigo-950/20 border border-purple-500/20 rounded-3xl p-6 sm:p-8 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl opacity-60"></div>
          
          {!quizActive && !quizCompleted ? (
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 font-mono text-xs text-purple-400 rounded-full py-1 px-3">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Test Your Cyber Instincts</span>
                </div>
                <h3 className="font-display font-bold text-xl text-white">Scam Risk Diagnostic interactive test</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  How well do you guard against video threats, unverified APK download requests, or sticky SMS traps? Answer 5 rapid real-world scenarios to verify if you are safe!
                </p>
              </div>
              <button 
                onClick={() => setQuizActive(true)}
                className="bg-purple-500 text-white font-semibold font-display text-sm py-3 px-6 rounded-xl hover:bg-purple-400 transition-all shadow-md shadow-purple-500/20 cursor-pointer flex items-center gap-2"
              >
                <span>Launch Survival Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : quizActive && !quizCompleted ? (
            <div className="space-y-6">
              
              {/* Question header trackers */}
              <div className="flex justify-between items-center text-xs font-mono text-purple-300">
                <span>SCENARIO STUDY: QUESTION {currentQuestion + 1} OF {quizQuestions.length}</span>
                <span>CRITICAL INSTINCT SCORE: {score}</span>
              </div>

              {/* Scenario problem descriptions */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-purple-500/10">
                <p className="text-gray-200 text-sm md:text-base leading-relaxed font-sans font-medium">
                  {quizQuestions[currentQuestion].scenario}
                </p>
              </div>

              {/* Interactive choice elements */}
              <div className="space-y-3">
                {quizQuestions[currentQuestion].choices.map((choice, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === quizQuestions[currentQuestion].correctIndex;
                  const showExplanation = selectedAnswer !== null;

                  return (
                    <button
                      key={index}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4.5 rounded-xl border text-sm transition-all duration-300 relative flex items-start gap-4 ${
                        selectedAnswer === null 
                          ? "bg-slate-900 border-gray-800 hover:border-purple-400 hover:text-white cursor-pointer"
                          : isSelected && isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                            : isSelected && !isCorrect
                              ? "bg-red-500/10 border-red-500/40 text-red-300"
                              : isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                                : "bg-slate-950/40 border-gray-800/60 text-gray-500"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-gray-700 flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="leading-relaxed font-sans">{choice}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanatory notes display on submission */}
              {selectedAnswer !== null && (
                <div className="bg-slate-950 border border-gray-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    {selectedAnswer === quizQuestions[currentQuestion].correctIndex ? (
                      <span className="text-emerald-400 font-bold font-display text-sm">✓ Perfect Survival Choice!</span>
                    ) : (
                      <span className="text-red-400 font-bold font-display text-sm">✕ Incorrect Choice (Risk Exposed)</span>
                    )}
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed font-sans border-l-2 border-purple-500 pl-3">
                    {quizQuestions[currentQuestion].explanation}
                  </p>

                  <div className="text-right">
                    <button 
                      onClick={handleNextQuestion}
                      className="bg-purple-500 text-white font-semibold font-display text-xs py-2 px-5 rounded-lg hover:bg-purple-400 transition-all cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Continue Simulation</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* QUIZ COMPLETED status */
            <div className="text-center py-4 space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold font-mono shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                {score}/{quizQuestions.length}
              </div>
              <h3 className="font-display font-bold text-2xl text-white">
                {score === quizQuestions.length ? "👑 Fully Certified Cyber-Defender!" : "🛡️ Study Secure Guides"}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                {score === quizQuestions.length 
                  ? "Outstanding instincts! You completely identified every trick, bypass trap, and fraud mechanism. Keep educating your older family members."
                  : "Good start! Some digital trap strategies remain highly sneaky. Review our curated cybercrime summaries below to safeguard your profile."
                }
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button 
                  onClick={resetQuiz}
                  className="bg-purple-500 text-white font-semibold font-display text-xs py-2.5 px-6 rounded-xl hover:bg-purple-400 transition-all cursor-pointer"
                >
                  Restart Instinct Quiz
                </button>
                <button 
                  onClick={() => setQuizActive(false)}
                  className="bg-slate-900 border border-gray-800 text-gray-300 py-2.5 px-6 rounded-xl text-xs hover:text-white cursor-pointer"
                >
                  Close Test
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Directory filter head */}
        <div className="bg-slate-900/60 border border-gray-800 p-4.5 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:max-w-md relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <Search className="w-4 h-4 text-gray-500" />
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-gray-800 focus:border-red-400 focus:outline-none p-2.5 pl-9 rounded-xl text-sm text-gray-200 font-sans"
              placeholder="Search active scams (e.g. Digital Arrest, KYC, OLX)..."
            />
          </div>
          <span className="text-xs font-mono text-gray-500">{filterScams.length} Scams Found inside Catalog</span>
        </div>

        {/* Scams Cards List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filterScams.map((scam) => (
            <div 
              key={scam.id}
              className={`bg-slate-900/50 border rounded-2xl p-5 hover:border-red-500/25 transition-all duration-300 flex flex-col justify-between group ${
                scam.dangerLevel === "Critical" ? "border-red-950/40" : "border-yellow-950/40"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-3.5">
                  <span className={`text-[9px] font-mono border py-0.5 px-2 rounded-full font-bold uppercase ${
                    scam.dangerLevel === "Critical" 
                      ? "bg-red-500/10 text-red-400 border-red-500/20" 
                      : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}>
                    {scam.dangerLevel} Threat
                  </span>
                  <AlertCircle className={`w-4 h-4 ${scam.dangerLevel === "Critical" ? "text-red-500" : "text-yellow-500"}`} />
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-red-400 transition-colors tracking-tight">
                  {scam.title}
                </h3>
                
                <p className="text-xs text-gray-400 font-sans italic mt-1 mb-3">
                  {scam.subtitle}
                </p>

                <p className="text-sm text-gray-300 font-sans leading-relaxed line-clamp-3">
                  {scam.whatItIs}
                </p>
              </div>

              <button 
                onClick={() => setSelectedScamId(scam.id)}
                className="w-full mt-5 bg-slate-950 border border-gray-800 hover:border-red-500/30 text-gray-300 hover:text-white py-2 px-1 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Read Protection Guide</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Dynamic Detailed Drawer Modal */}
        <AnimatePresence>
          {selectedScamId && selectedScam && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-[#070D19] border border-gray-800 w-full max-w-3xl rounded-3xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl relative"
              >
                
                {/* Modal close icon */}
                <button 
                  onClick={() => setSelectedScamId(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white p-2 bg-slate-950 rounded-full border border-gray-800 cursor-pointer z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Cover header block */}
                <div className="p-6 sm:p-8 border-b border-gray-800 flex items-start gap-4 bg-slate-950 pr-14">
                  <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex-shrink-0 animate-pulse">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-semibold block">TACTICAL SAFETY BLUEPRINT</span>
                    <h2 className="font-display font-extrabold text-2xl text-white tracking-tight mt-0.5">{selectedScam.title}</h2>
                    <p className="text-xs text-gray-400 mt-1 leading-snug">{selectedScam.subtitle}</p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-gray-300">
                  
                  {/* Detailed explanation */}
                  <div>
                    <h4 className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1.5 font-bold">What It Is:</h4>
                    <p className="text-[#D1D5DB] leading-relaxed font-sans">{selectedScam.whatItIs}</p>
                  </div>

                  {/* Operational checklist timeline */}
                  <div className="bg-slate-950/60 p-4.5 rounded-2xl border border-gray-850">
                    <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-3 font-bold">How Scammers Play This Trap:</h4>
                    <ol className="space-y-3 font-sans text-gray-300">
                      {selectedScam.howItWorks.map((step, i) => (
                        <li key={i} className="flex gap-3 items-start text-xs leading-relaxed">
                          <span className="w-5 h-5 rounded bg-slate-900 border border-gray-850 text-red-400 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Caution Warning flags */}
                  <div>
                    <h4 className="text-xs font-mono text-yellow-500 uppercase tracking-wider mb-2 font-bold">Warning Signs to Flag:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {selectedScam.warningSigns.map((sig, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-normal bg-yellow-500/2 border border-yellow-500/8 p-2.5 rounded-lg text-yellow-150">
                          <AlertTriangle className="w-4.5 h-4.5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          <span>{sig}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom comparative controls lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    
                    {/* RED: DO NOT DO */}
                    <div className="bg-red-500/3 border border-red-500/12 p-4.5 rounded-2xl">
                      <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-bold">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span>ABSOLUTE STOP LIST</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-gray-300">
                        {selectedScam.whatNotToDo.map((not, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <span className="w-4 h-4 bg-red-500/10 text-red-400 text-[10px] rounded flex items-center justify-center flex-shrink-0 font-bold">✕</span>
                            <span>{not}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* GREEN: DO THIS */}
                    <div className="bg-emerald-500/3 border border-emerald-500/12 p-4.5 rounded-2xl">
                      <h4 className="text-xs font-mono text-cyber-green uppercase tracking-wider mb-3 flex items-center gap-1.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-cyber-green" />
                        <span>SAFE FIRST ACTIONS</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-gray-300">
                        {selectedScam.safeActions.map((safe, i) => (
                          <li key={i} className="flex items-start gap-2 leading-relaxed">
                            <span className="w-4 h-4 bg-emerald-500/10 text-cyber-green text-[10px] rounded flex items-center justify-center flex-shrink-0 font-bold">✓</span>
                            <span>{safe}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

                {/* Footer buttons controls */}
                <div className="p-5 border-t border-gray-800 bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    <span>Share guidelines with older family members immediately.</span>
                  </div>
                  <button 
                    onClick={() => setSelectedScamId(null)}
                    className="w-full sm:w-auto bg-slate-900 border border-gray-800 hover:text-white py-2 px-6 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Close Blueprint
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
