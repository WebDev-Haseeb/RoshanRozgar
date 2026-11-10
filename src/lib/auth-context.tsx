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
import { auth, googleProvider, rtdb, saveUserProfile, getUserProfile, UserProfileData } from "./firebase";

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  signInWithGoogle: (preferredRole?: "customer" | "worker") => Promise<{ user: User; profile: UserProfileData | null }>;
  signInWithEmail: (email: string, pass: string) => Promise<User>;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    role: "customer" | "worker",
    trade?: string,
    sector?: string
  ) => Promise<User>;
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
  logOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const p = await getUserProfile(currentUser.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async (preferredRole: "customer" | "worker" = "customer") => {
    const cred = await signInWithPopup(auth, googleProvider);
    let existingProfile = await getUserProfile(cred.user.uid);
    if (!existingProfile) {
      existingProfile = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        role: preferredRole,
        createdAt: Date.now(),
      };
      await saveUserProfile(existingProfile);
    }
    setProfile(existingProfile);
    return { user: cred.user, profile: existingProfile };
  };

  const handleEmailSignIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const existingProfile = await getUserProfile(cred.user.uid);
    setProfile(existingProfile);
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
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    const newProfile: UserProfileData = {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName,
      role,
      trade: trade || null,
      sector: sector || null,
      createdAt: Date.now(),
    };
    await saveUserProfile(newProfile);
    setProfile(newProfile);
    return cred.user;
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
