"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, firestore } from './config';
import { useRouter, usePathname } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if running in mock/offline mode (auth is null)
    if (!auth) {
      const isMockLoggedIn = typeof window !== 'undefined' && localStorage.getItem('mock_user_logged_in') === 'true';
      if (isMockLoggedIn) {
        setUser({
          email: 'developer@pathgen.dev',
          displayName: 'Pathgen Developer',
          uid: 'mock-user-123',
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [],
          refreshToken: '',
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => 'mock-token',
          getIdTokenResult: async () => ({ token: 'mock-token', authTime: '', expirationTime: '', issuedAtTime: '', signInProvider: '', claims: {} }),
          reload: async () => {},
          toJSON: () => ({}),
          phoneNumber: null,
          photoURL: null,
          providerId: 'firebase'
        } as any);
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      
      // Only attempt to sync with Firestore if we have a real user and a real Firestore instance
      if (u && u.uid && firestore) {
        try {
          await updateDoc(doc(firestore, "users", u.uid), {
            last_login: serverTimestamp()
          });
        } catch (e) {
          console.debug("Login sync skipped");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle redirects in a separate effect to avoid flashing/loading toggles
  useEffect(() => {
    if (loading) return;

    const isPublicPath = pathname === '/' || pathname === '/map-demo';
    
    if (!user && !isPublicPath) {
      router.push('/');
    } else if (user && (pathname === '/')) {
      router.push('/home');
    }
  }, [user, loading, pathname, router]);

  const logout = async () => {
    try {
      if (typeof window !== 'undefined') localStorage.removeItem('mock_user_logged_in');
      
      if (auth) {
        await auth.signOut();
      }
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
