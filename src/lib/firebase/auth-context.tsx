"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config';
import { useRouter, usePathname } from 'next/navigation';

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
    // Check if running in mock/offline mode
    if ((auth as any).name === "mock-app" || !(auth as any).app) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle redirects in a separate effect to avoid flashing/loading toggles
  useEffect(() => {
    if (loading) return;

    const isPublicPath = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/map-demo';
    
    if (!user && !isPublicPath) {
      router.push('/login');
    } else if (user && isPublicPath) {
      router.push('/home');
    }
  }, [user, loading, pathname, router]);

  const logout = async () => {
    try {
      await auth.signOut();
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
