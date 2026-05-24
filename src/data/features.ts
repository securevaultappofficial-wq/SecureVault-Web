/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FeatureInfo } from "../types";

export const SECURE_VAULT_FEATURES: FeatureInfo[] = [
  {
    id: "smart-scan",
    title: "Smart Scan",
    subtitle: "Unified device risk evaluation",
    iconName: "ShieldAlert",
    description: "Smart Scan checks available device risk signals, permissions, suspicious files, junk indicators, previous link risks, and scan history to calculate a clear security score.",
    helpsWith: [
      "Device risk overview",
      "Key permissions review",
      "Suspicious APK / file warnings",
      "Junk indicator volume check",
      "Security score breakdown",
      "Items requiring manual user review"
    ],
    honestNote: "Some checks may depend on Android permissions and available device access levels. We do not run intrusive system kernel monitors.",
    capabilityDetails: [
      "Calculates a security score from 0-100 indicating general exposure.",
      "Identifies developer options or USB debugging status.",
      "Summarizes high-priority items so you don't hunt through settings.",
      "Exposes inactive high-risk permissions."
    ]
  },
  {
    id: "malware-scan",
    title: "Malware Risk Scan",
    subtitle: "Identify suspicious installers & patterns",
    iconName: "Binary",
    description: "Malware Risk Scan helps detect suspicious APKs, risky file names, dangerous extensions, double-extension files, and malware-like patterns.",
    helpsWith: [
      "APK files lingering in standard download folders",
      "Suspicious files masquerading as 'KYC Update', 'Free Reward' or 'Bank Support'",
      "Risky permission combinations in unverified APKs",
      "Double-extension trickery (e.g., photo.jpg.apk)",
      "Uncommon and risky file types on active storage paths"
    ],
    honestNote: "SecureVault marks pattern-based risks as suspicious or needing review. It only flags known malware when verified by trusted cryptographic hashes or public threat intelligence. We do not promise 100% real-time malware interception.",
    capabilityDetails: [
      "Scans `.apk` headers to identify hidden app properties.",
      "Detects mimicry where a malicious app names itself identically to trusted services.",
      "Helps locate deep-hidden files that may occupy system cache.",
      "No real-time background engine is loaded, saving battery life."
    ]
  },
  {
    id: "junk-cleaner",
    title: "Junk Cleaner",
    subtitle: "Transparent storage reclamation",
    iconName: "Trash2",
    description: "Junk Cleaner finds unnecessary files and lets users review exactly what is being deleted before taking action.",
    helpsWith: [
      "Application cache cleanup",
      "Temporary log files and old installer scraps",
      "Leftover empty folders",
      "Residual files from uninstalled apps",
      "Stale downloaded APK packages wasting space"
    ],
    honestNote: "SecureVault does NOT delete personal photos, videos, document libraries, or user downloads automatically or hidden in the background.",
    capabilityDetails: [
      "Grouped visualization allows interactive select-all or piece-by-piece checkboxes.",
      "Shows actual megabytes to be saved with absolute user confirmation.",
      "Clearly categorizes leftover APKs separately from pure transient cache.",
      "Safe-by-design boundaries protect secure download paths."
    ]
  },
  {
    id: "link-protection",
    title: "Link Protection",
    subtitle: "Scan links and URLs before clicking",
    iconName: "Link2",
    description: "Link Protection checks URLs for suspicious patterns, phishing keywords, unsafe formats, shortened links, fake login signs, and risky domains.",
    helpsWith: [
      "Checking links parsed inside SMS messages or chat text",
      "Spotting phishing indicators in domain names (e.g. pay-secure-bank.ms)",
      "Identifying hidden URL redirects and masked shortened links",
      "Warning against unencrypted (HTTP) banking login clones",
      "Scanning suspicious domain ages and registration details"
    ],
    honestNote: "SecureVault protects links that are scanned or opened inside our secure environment. It does NOT claim device-wide Web firewalling, VPN tunneling, or background system-wide DNS hijacking.",
    capabilityDetails: [
      "Analyzes strings using advanced offline heuristic scan rules.",
      "Queries secure API models for reputation scoring of complex paths.",
      "Gives high, medium, and low risk summaries with clear reasoning.",
      "Provides a sandboxed preview view before forwarding you to standard browsers."
    ]
  },
  {
    id: "ai-adviser",
    title: "AI Security Adviser",
    subtitle: "Translate technical jargon to plain words",
    iconName: "Sparkles",
    description: "AI Security Adviser explains scan reports, security scores, suspicious files, risky links, and recommended actions in simple, friendly language designed for Indian families.",
    helpsWith: [
      "Understanding what a specific warning means (e.g. APK sharing risks)",
      "Answering general safety questions without jargon",
      "Explaining why a particular permission has high-use privileges",
      "Recommending clear manual action steps when Android system restrictions apply",
      "Translating scary technical warnings into simple guidance"
    ],
    honestNote: "AI Security Adviser explains risks and helps outline safer actions. It will never ask you for UPI PINs, bank passwords, credit card credentials, or OTPs, and does NOT speak with absolute legal authority.",
    capabilityDetails: [
      "Integrates with Gemini-powered models server-side for accurate answers.",
      "Accepts local Indian dialect styles for easier reading.",
      "Allows manual typing of digital alerts seen on WhatsApp/SMS to query safety.",
      "Provides actionable checkboxes corresponding directly to real cybercrime help."
    ]
  },
  {
    id: "reports",
    title: "Secure Reports",
    subtitle: "Personal safety history & audit trail",
    iconName: "FileText",
    description: "Reports help users review scan history, issues found, actions completed, manual review items, and safety score changes over time.",
    helpsWith: [
      "Providing a clean chronological receipt of device scans",
      "Checking previous alerts that were bypassed or ignored",
      "Keeping logs of deleted cache sizes",
      "Reviewing previous AI Advice queries",
      "Exporting safe summaries to family members about a parent's device security"
    ],
    honestNote: "All reports are saved on your local device. If Firebase Authentication sync is explicitly toggled, only non-private summaries (e.g. aggregate stats, risk level counts) are backed up.",
    capabilityDetails: [
      "Maintains a locally searchable calendar of previous scan outcomes.",
      "Separates resolved items cleanly from outstanding safety risks.",
      "Uses a high-contrast format readable under bright daylight.",
      "Exposes exactly what file properties were analyzed for transparent auditing."
    ]
  },
  {
    id: "scam-safety-adviser",
    title: "Scam Safety Adviser",
    subtitle: "Immediate action cards for active scams",
    iconName: "AlertTriangle",
    description: "An interactive, curated database outlining active high-risk scams targeting Indian mobile users, providing simple do's and don'ts.",
    helpsWith: [
      "Recognizing active traps like 'Digital Arrest' and 'KYC Blocked' stories",
      "Explaining UPI collect request tricks simply",
      "Providing emergency hotline contact shortcuts (1930) and cybercrime portals",
      "Prepping parents and grandparents to pause before sending money",
      "Clarifying that state units or banks never ask for critical pins"
    ],
    honestNote: "Scam databases are regular reviews. Users must rely on caution. The app does not possess real-time psychic abilities to prevent a user from making manual payments.",
    capabilityDetails: [
      "Covers 11 major categories of active Indian digital frauds.",
      "Clear, sequential walkthrough of how fraudsters establish trust.",
      "Immediate button to trigger an educational mock-scam simulation.",
      "One-tap copying of emergency reporting instructions."
    ]
  },
  {
    id: "cyber-news",
    title: "Cyber News & Alerts",
    subtitle: "Real time alerts from official bureaus",
    iconName: "Megaphone",
    description: "Curated safety feeds displaying verified digital scam alerts, critical security warnings from CERT-In, and simple awareness blogs.",
    helpsWith: [
      "Staying aware of newly reported app fraud campaigns",
      "Alerting you to major system vulnerability updates",
      "Providing verified advice before scam techniques gain wide steam",
      "Dispelling widespread online chain-messages and misinformation hoax posts"
    ],
    honestNote: "News is aggregated for general awareness. We do not write or control official government press releases.",
    capabilityDetails: [
      "Presents aggregated alerts in standard text segments for slow networks.",
      "Highlights key takeaways in 2-3 simple summary points per alert.",
      "Allows toggling bookmarks for sharing with relatives."
    ]
  },
  {
    id: "language-translator",
    title: "Language Translator",
    subtitle: "Understanding security in your language",
    iconName: "Languages",
    description: "Translates security alerts, scan reports, and AI advice into principal Indian languages including Hindi, Telugu, Tamil, and Bengali.",
    helpsWith: [
      "Helping older family members who aren't fluent in English tech terms",
      "Translating suspicious message screens into native script",
      "Creating localized safety report printouts",
      "Simplifying understanding of why a tool has high-security status"
    ],
    honestNote: "Translation works through server translation APIs. Idioms and specialized jargon may occasionally map to best equivalent localized terms.",
    capabilityDetails: [
      "Instant toggling from English to Indian regional languages.",
      "Generates clear, readable native scripts for high accessibility.",
      "Integrates with the AI Security Adviser to deliver explanations in native dialects."
    ]
  }
];
