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
import { getDatabase, Database } from "firebase/database";

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
  phone?: string | null;
  isVerified?: boolean;
  rating?: number;
  jobsCompleted?: number;
  bioUrdu?: string | null;
  bioEnglish?: string | null;
  tagline?: string | null;
  skills?: string[];
  experienceYears?: number | null;
  voiceNoteTranscript?: string | null;
  createdAt?: number;
}

/**
 * Persist user profile and metadata to Supabase Postgres via /api/profile
 */
export async function saveUserProfile(data: Partial<UserProfileData> & { uid: string }): Promise<UserProfileData | null> {
  try {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.warn("Failed to persist user profile to Supabase:", await res.text());
      return null;
    }
    const json = await res.json();
    return json.profile || null;
  } catch (err) {
    console.error("Error calling /api/profile:", err);
    return null;
  }
}

/**
 * Fetch user profile from Supabase Postgres via /api/profile
 */
export async function getUserProfile(uid: string): Promise<UserProfileData | null> {
  try {
    const res = await fetch(`/api/profile?uid=${encodeURIComponent(uid)}`);
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.profile || null;
  } catch (err) {
    console.error("Error fetching /api/profile:", err);
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
