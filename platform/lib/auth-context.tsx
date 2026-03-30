"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserData {
  credits: number;
  displayName?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser && db) {
        // Real-time listener for user data (credits, tier, etc.)
        const userDocRef = doc(db, "users", authUser.uid);
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          }
          setLoading(false);
        });
        
        return () => unsubDoc();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
