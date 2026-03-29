"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface AuthState {
  user: User | null;
  loading: boolean;
  userData: Record<string, unknown> | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    loading: !!auth && !!db, // only loading if firebase is actually configured
    userData: null,
  }));

  useEffect(() => {
    if (!auth || !db) return;

    const firebaseDb = db;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user data from Firestore (credits, etc)
        const userRef = doc(firebaseDb, "users", user.uid);
        
        // Listen to changes in real-time
        const unsubDoc = onSnapshot(userRef, (snapshot) => {
          setState({
            user,
            loading: false,
            userData: snapshot.exists() ? (snapshot.data() as Record<string, unknown>) : null,
          });
        });

        return () => unsubDoc();
      } else {
        setState({ user: null, loading: false, userData: null });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
}
