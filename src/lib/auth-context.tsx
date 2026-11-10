"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, saveUserProfile, getUserProfile, UserProfileData } from "./firebase";

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  signInWithGoogle: (
    preferredRole?: "customer" | "worker",
    preferredTrade?: string,
    preferredSector?: string
  ) => Promise<{ user: User; profile: UserProfileData | null }>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role: "customer" | "worker",
    trade?: string,
    sector?: string
  ) => Promise<User>;
  updateUserBioProfile: (data: Partial<UserProfileData>) => Promise<UserProfileData | null>;
  refreshProfile: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {
    throw new Error("AuthProvider not mounted");
  },
  signInWithEmail: async () => {
    throw new Error("AuthProvider not mounted");
  },
  signUpWithEmail: async () => {
    throw new Error("AuthProvider not mounted");
  },
  updateUserBioProfile: async () => null,
  refreshProfile: async () => {},
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string) => {
    try {
      const p = await getUserProfile(uid);
      setProfile(p);
      return p;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async (
    preferredRole: "customer" | "worker" = "customer",
    preferredTrade: string = "electrician",
    preferredSector: string = "Islamabad · G-9 / G-10 / G-11"
  ) => {
    const cred = await signInWithPopup(auth, googleProvider);
    let existing = await getUserProfile(cred.user.uid);

    if (!existing || !existing.trade || !existing.sector) {
      existing = await saveUserProfile({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        role: existing?.role || preferredRole,
        trade: existing?.trade || preferredTrade,
        sector: existing?.sector || preferredSector,
        createdAt: existing?.createdAt || Date.now(),
      });
    }

    setProfile(existing);
    return { user: cred.user, profile: existing };
  };

  const handleEmailSignIn = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    await fetchProfile(cred.user.uid);
    return cred.user;
  };

  const handleEmailSignUp = async (
    email: string,
    pass: string,
    displayName: string,
    role: "customer" | "worker",
    trade?: string,
    sector?: string
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    if (displayName) {
      try {
        await updateProfile(cred.user, { displayName });
      } catch (e) {
        console.warn("Could not set displayName on Firebase Auth user:", e);
      }
    }
    const saved = await saveUserProfile({
      uid: cred.user.uid,
      email: cleanEmail,
      displayName,
      role,
      trade: trade || "electrician",
      sector: sector || "Islamabad · G-9 / G-10 / G-11",
      createdAt: Date.now(),
    });
    setProfile(saved);
    return cred.user;
  };

  const updateUserBioProfile = async (data: Partial<UserProfileData>) => {
    if (!user) return null;
    const updated = await saveUserProfile({
      ...data,
      uid: user.uid,
    });
    if (updated) {
      setProfile(updated);
    }
    return updated;
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle: handleGoogleSignIn,
        signInWithEmail: handleEmailSignIn,
        signUpWithEmail: handleEmailSignUp,
        updateUserBioProfile,
        refreshProfile,
        logOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
