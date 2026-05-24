/**
 * Mock Accounts definitions matching the SecureVault Prototype video.
 */

export interface MockAccount {
  id: string;
  name: string;
  email: string;
  initial: string;
  avatarBg: string;
}

export const MOCK_GOOGLE_ACCOUNTS: MockAccount[] = [
  {
    id: "elena-v",
    name: "Elena Vance",
    email: "elena.vance@privacyguard.net",
    initial: "E",
    avatarBg: "bg-emerald-850"
  },
  {
    id: "marcus-t",
    name: "Marcus Thorne",
    email: "m.thorne@cyberops.org",
    initial: "M",
    avatarBg: "bg-slate-700"
  },
  {
    id: "aria-s",
    name: "Aria Shield",
    email: "aria.shield@valorguard.io",
    initial: "A",
    avatarBg: "bg-rose-900"
  },
  {
    id: "dev-zero",
    name: "Agent Zero",
    email: "agent.zero@secureserver.tech",
    initial: "Z",
    avatarBg: "bg-yellow-600"
  },
  {
    id: "shield-admin",
    name: "Shield Vault Admin",
    email: "admin@shieldgate.com",
    initial: "S",
    avatarBg: "bg-indigo-950"
  },
  {
    id: "cipher-guardian",
    name: "Cipher Guardian",
    email: "cipher@cryptmail.net",
    initial: "C",
    avatarBg: "bg-pink-700"
  }
];

export interface ResolvedUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  providerId: string;
}

/**
 * Resolves overridden display properties if logged in with a mock Google account.
 * This ensures no real sensitive Google credentials are visible in the browser UI,
 * while maintaining Firebase session integrity.
 */
export function getResolvedUser(firebaseUser: any): ResolvedUser | null {
  if (!firebaseUser) return null;

  const mockEmail = localStorage.getItem("securevault_mock_email");
  const mockName = localStorage.getItem("securevault_mock_name");

  if (mockEmail && mockName) {
    const matchedAccount = MOCK_GOOGLE_ACCOUNTS.find(acc => acc.email === mockEmail);
    return {
      uid: firebaseUser.uid,
      displayName: mockName,
      email: mockEmail,
      photoURL: matchedAccount ? `https://ui-avatars.com/api/?name=${encodeURIComponent(mockName)}&background=${matchedAccount.avatarBg.replace("bg-", "") || "0D8ABC"}&color=fff` : null,
      providerId: "google.com"
    };
  }

  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || "SecureVault Guardian",
    email: firebaseUser.email || "guardian@securevault.com",
    photoURL: firebaseUser.photoURL,
    providerId: firebaseUser.providerData?.[0]?.providerId || "password"
  };
}
