/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScamInfo {
  id: string;
  title: string;
  subtitle: string;
  dangerLevel: "Critical" | "High" | "Medium";
  whatItIs: string;
  howItWorks: string[];
  warningSigns: string[];
  whatNotToDo: string[];
  safeActions: string[];
  bannerPrompt: string;
}

export interface FeatureInfo {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  helpsWith: string[];
  honestNote: string;
  capabilityDetails: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Security" | "Privacy" | "AI Advisor";
}

export interface WaitlistRecord {
  email: string;
  name: string;
  date: string;
  languagePrefs: string[];
}
