/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";

// In-memory token cache for admin session
let cachedAccessToken: string | null = null;
let googleSheetsUserEmail: string | null = null;

export interface SheetsConfig {
  adminEmail: string;
  queryTicketsSpreadsheetId: string;
  launchNotificationsSpreadsheetId: string;
  accessToken: string;
  updatedAt: string;
}

// Scopes required for complete Google Drive and Sheets capability
export const REQUIRED_SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file"
];

let activeConnectionPromise: Promise<string> | null = null;

/**
 * Handle Admin Google Authentication and retrieve access token
 */
export async function connectGoogleSheets(): Promise<string> {
  if (activeConnectionPromise) {
    return activeConnectionPromise;
  }

  activeConnectionPromise = (async () => {
    const provider = new GoogleAuthProvider();
    REQUIRED_SCOPES.forEach(scope => provider.addScope(scope));
    provider.setCustomParameters({
      prompt: "consent",
      access_type: "offline"
    });

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error("Unable to obtain standard Google OAuth access token.");
      }
      
      cachedAccessToken = credential.accessToken;
      googleSheetsUserEmail = result.user.email || "Authorized Member";
      
      // Setup and persist spreadsheets to Firestore instantly for this administrator
      await initializeAndSaveAdminConfig(cachedAccessToken, googleSheetsUserEmail);
      
      return cachedAccessToken;
    } catch (error: any) {
      console.error("Google Sheets OAuth error:", error);
      let userFriendlyMessage = "OAuth synchronization failed.";
      
      const errorCode = error?.code || "";
      const errorMessage = error?.message || "";
      
      if (errorCode === "auth/popup-closed-by-user" || errorMessage.includes("popup-closed-by-user")) {
        userFriendlyMessage = "Authentication cancelled: Google sign-in window was closed before completion.";
      } else if (errorCode === "auth/cancelled-popup-request" || errorMessage.includes("cancelled-popup-request")) {
        userFriendlyMessage = "Request cancelled: Another authentication is already running or was interrupted.";
      } else if (errorCode === "auth/popup-blocked" || errorMessage.includes("popup-blocked") || errorMessage.includes("cancelled by the browser")) {
        userFriendlyMessage = "Security warning: Google authorization popup was blocked by your browser shield. Please allow popups for this site, or toggle Brave shields/adblockers off, or open the app in a new tab.";
      } else {
        userFriendlyMessage = errorMessage || "Failed to link Google account. Try again.";
      }
      
      throw new Error(userFriendlyMessage);
    } finally {
      activeConnectionPromise = null;
    }
  })();

  return activeConnectionPromise;
}

export function getCachedToken(): string | null {
  return cachedAccessToken;
}

export function getSheetsUserEmail(): string | null {
  return googleSheetsUserEmail;
}

export function disconnectSheets() {
  cachedAccessToken = null;
  googleSheetsUserEmail = null;
}

/**
 * Retreive Google Sheets active configurations from Firestore
 */
export async function getActiveConfigFromFirestore(): Promise<SheetsConfig | null> {
  const path = "sheets_config/active";
  try {
    const configRef = doc(db, "sheets_config", "active");
    const docSnap = await getDoc(configRef);
    if (docSnap.exists()) {
      return docSnap.data() as SheetsConfig;
    }
  } catch (err) {
    console.error("Error reading sheets config from Firestore:", err);
    handleFirestoreError(err, OperationType.GET, path);
  }
  return null;
}

/**
 * Create or check Google Sheets and store configuration block securely to Firestore
 */
async function initializeAndSaveAdminConfig(token: string, email: string): Promise<void> {
  const querySheetName = "SecureVault - Query Tickets";
  const queryHeaders = ["Timestamp", "Client Name", "Receipt Email Address", "Inquiry / Feature Suggestion Message"];

  const launchSheetName = "SecureVault - Launch Notifications";
  const launchHeaders = ["Timestamp", "Full Name", "Email Address", "Checked Native Log Languages", "Excited Security Features"];

  // 1. Locate or create Query tickets sheet
  let queryTicketsSpreadsheetId = await findSpreadsheet(token, querySheetName);
  if (!queryTicketsSpreadsheetId) {
    const freshSheet = await createSpreadsheet(token, querySheetName, queryHeaders);
    queryTicketsSpreadsheetId = freshSheet.spreadsheetId;
  }

  // 2. Locate or create Launch notifications sheet
  let launchNotificationsSpreadsheetId = await findSpreadsheet(token, launchSheetName);
  if (!launchNotificationsSpreadsheetId) {
    const freshSheet = await createSpreadsheet(token, launchSheetName, launchHeaders);
    launchNotificationsSpreadsheetId = freshSheet.spreadsheetId;
  }

  // 3. Write config document to Firestore
  const configRef = doc(db, "sheets_config", "active");
  const path = "sheets_config/active";
  try {
    await setDoc(configRef, {
      adminEmail: email,
      queryTicketsSpreadsheetId,
      launchNotificationsSpreadsheetId,
      accessToken: token,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error writing sheets config to Firestore:", err);
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Find an existing spreadsheet by name inside Google Drive
 */
async function findSpreadsheet(token: string, name: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`name = '${name}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Drive list error response:", errBody);
      return null;
    }

    const data = await res.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  } catch (err) {
    console.error("Error finding spreadsheet:", err);
  }
  return null;
}

/**
 * Create a new spreadsheet inside Google Sheets
 */
async function createSpreadsheet(token: string, name: string, headers: string[]): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  try {
    const res = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: {
          title: name
        },
        sheets: [
          {
            properties: {
              title: "Responses"
            }
          }
        ]
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Sheets API responded with ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const spreadsheetId = data.spreadsheetId;
    const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Append headers row
    await appendRow(token, spreadsheetId, "Responses!A1", headers);

    return { spreadsheetId, spreadsheetUrl };
  } catch (err: any) {
    console.error("Error creating spreadsheet:", err);
    throw err;
  }
}

/**
 * Append a row of cell data to a Google Sheet
 */
async function appendRow(token: string, spreadsheetId: string, range: string, row: string[]): Promise<any> {
  const encRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encRange}:append?valueInputOption=USER_ENTERED`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      values: [row]
    })
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Failed to append row data to Google Sheets: ${errBody}`);
  }

  return await res.json();
}

/**
 * Save a dynamic ticket form entry using persisted admin sheet credentials
 */
export async function saveQueryTicketRow(data: {
  name: string;
  email: string;
  message: string;
}): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // Always log to Firestore collection immediately as native backup
  try {
    await addDoc(collection(db, "query_tickets"), {
      name: data.name,
      email: data.email,
      message: data.message,
      createdAt: serverTimestamp(),
      createdLocaleString: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    });
  } catch (fsErr) {
    console.error("Failed to store ticket copy in Firestore:", fsErr);
    handleFirestoreError(fsErr, OperationType.CREATE, "query_tickets");
  }

  // 1. Fetch current active configuration from public Firestore document
  const activeConfig = await getActiveConfigFromFirestore();
  if (!activeConfig || !activeConfig.accessToken || !activeConfig.queryTicketsSpreadsheetId) {
    throw new Error("Google Sheets is currently unconfigured or requires re-linking by the administrator. Submit is recorded locally.");
  }

  const token = activeConfig.accessToken;
  const spreadsheetId = activeConfig.queryTicketsSpreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Prepare row values
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const rowValues = [timestamp, data.name, data.email, data.message];

  // 3. Append values
  try {
    await appendRow(token, spreadsheetId, "Responses!A:D", rowValues);
  } catch (error: any) {
    console.error("Google Sheets write error:", error);
    throw new Error("Spreadsheet credentials expired. Project administrator must refresh their Google account link inside the settings dashboard.");
  }

  return { spreadsheetId, spreadsheetUrl };
}

/**
 * Save a dynamic launch waitlist notification entry using persisted admin sheet credentials
 */
export async function saveLaunchNotificationRow(data: {
  name: string;
  email: string;
  languages: string[];
  features: string[];
}): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  // Always log to Firestore collection immediately as native backup
  try {
    await addDoc(collection(db, "launch_notifications"), {
      name: data.name,
      email: data.email,
      languages: data.languages,
      features: data.features,
      createdAt: serverTimestamp(),
      createdLocaleString: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    });
  } catch (fsErr) {
    console.error("Failed to store launch notification copy in Firestore:", fsErr);
    handleFirestoreError(fsErr, OperationType.CREATE, "launch_notifications");
  }

  // 1. Fetch current active configuration from public Firestore document
  const activeConfig = await getActiveConfigFromFirestore();
  if (!activeConfig || !activeConfig.accessToken || !activeConfig.launchNotificationsSpreadsheetId) {
    throw new Error("Google Sheets is currently unconfigured or requires re-linking by the administrator. Submit is recorded locally.");
  }

  const token = activeConfig.accessToken;
  const spreadsheetId = activeConfig.launchNotificationsSpreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Prepare row values
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  const languagesStr = data.languages.length > 0 ? data.languages.join(", ") : "None Selected";
  const featuresStr = data.features.length > 0 ? data.features.join(", ") : "None Selected";
  const rowValues = [timestamp, data.name, data.email, languagesStr, featuresStr];

  // 3. Append values
  try {
    await appendRow(token, spreadsheetId, "Responses!A:E", rowValues);
  } catch (error: any) {
    console.error("Google Sheets write error:", error);
    throw new Error("Spreadsheet credentials expired. Project administrator must refresh their Google account link inside the settings dashboard.");
  }

  return { spreadsheetId, spreadsheetUrl };
}
