import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, increment } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
const firestoreDbId = (firebaseConfig as any).firestoreDatabaseId;
export const db = firestoreDbId ? getFirestore(app, firestoreDbId) : getFirestore(app);

// Initialize Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// Operations context
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Function to handle automatic profile sync on login
export async function syncUserProfile(user: any) {
  const userRef = doc(db, "users", user.uid);
  const path = `users/${user.uid}`;
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      // First time login -> Create
      await setDoc(userRef, {
        userId: user.uid,
        displayName: user.displayName || "SecureVault User",
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        noOfScans: 0,
        threatsFound: 0,
        safeJunkRemoved: 0,
        scannedLinksCount: 0,
      });
    } else {
      // Returning user -> Ensure all stats properties exist, update lastLoginAt
      const existingData = docSnap.data();
      await setDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        noOfScans: existingData?.noOfScans !== undefined ? existingData.noOfScans : 0,
        threatsFound: existingData?.threatsFound !== undefined ? existingData.threatsFound : 0,
        safeJunkRemoved: existingData?.safeJunkRemoved !== undefined ? existingData.safeJunkRemoved : 0,
        scannedLinksCount: existingData?.scannedLinksCount !== undefined ? existingData.scannedLinksCount : 0,
      }, { merge: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Function to safely update user metrics upon completes of simulator actions
export async function incrementUserStat(
  userId: string,
  stats: {
    noOfScans?: number;
    threatsFound?: number;
    safeJunkRemoved?: number;
    scannedLinksCount?: number;
  }
) {
  const userRef = doc(db, "users", userId);
  const path = `users/${userId}`;
  try {
    const updateData: Record<string, any> = {
      lastLoginAt: serverTimestamp(),
    };
    if (stats.noOfScans !== undefined) {
      updateData.noOfScans = increment(stats.noOfScans);
    }
    if (stats.threatsFound !== undefined) {
      updateData.threatsFound = increment(stats.threatsFound);
    }
    if (stats.safeJunkRemoved !== undefined) {
      updateData.safeJunkRemoved = increment(stats.safeJunkRemoved);
    }
    if (stats.scannedLinksCount !== undefined) {
      updateData.scannedLinksCount = increment(stats.scannedLinksCount);
    }
    await setDoc(userRef, updateData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

// Validation connection to Firestore on initialization
async function testConnection() {
  try {
    const testRef = doc(db, "test_connection_placeholder", "ping");
    await getDoc(testRef);
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firebase client appears to be offline. Verify credentials.");
    }
  }
}
testConnection();
