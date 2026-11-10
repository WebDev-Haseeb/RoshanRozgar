import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  Auth,
} from "firebase/auth";
import { getDatabase, ref, set, get, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAf5tOrB2-HzkO7vNozlNXjdNuxHwjQZo8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "blackhack-pk.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://blackhack-pk-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "blackhack-pk",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "blackhack-pk.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "895078373806",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:895078373806:web:92f8edf73eecb020ca903f",
};

// Singleton pattern for client-side and server-side safety
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const rtdb: Database = getDatabase(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: "customer" | "worker";
  trade?: string | null;
  sector?: string | null;
  createdAt: number;
}

/**
 * Persist user role and metadata to Firebase Realtime Database
 */
export async function saveUserProfile(data: UserProfileData) {
  try {
    const userRef = ref(rtdb, `users/${data.uid}`);
    await set(userRef, {
      ...data,
      updatedAt: Date.now(),
    });
  } catch (err) {
    console.error("Failed to save user profile to RTDB:", err);
  }
}

/**
 * Fetch user profile from Firebase Realtime Database
 */
export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  try {
    const userRef = ref(rtdb, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val() as UserProfileData;
    }
    return null;
  } catch (err) {
    console.error("Failed to get user profile from RTDB:", err);
    return null;
  }
}

export {
  app,
  auth,
  rtdb,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
};
