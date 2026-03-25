"use client"
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { firestore } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';

interface Organization {
  id: string;
  name: string;
  role: string;
}

interface OrgContextType {
  currentOrg: Organization | null;
  organizations: Organization[];
  setOrganizations: (orgs: Organization[]) => void;
  switchOrg: (id: string) => void;
  loading: boolean;
  refreshOrgs: () => Promise<void>;
}

const OrgContext = createContext<OrgContextType>({
  currentOrg: null,
  organizations: [],
  setOrganizations: () => {},
  switchOrg: () => {},
  loading: true,
  refreshOrgs: async () => {},
});

export const OrgProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshOrgs = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    
    // Safety check for mock/offline mode
    if (!firestore || (firestore as any).name === "mock-app") {
      const mockOrg = { id: 'personal', name: 'Personal (Local)', role: 'Owner' };
      setOrganizations([mockOrg]);
      setCurrentOrg(mockOrg);
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(firestore, "organizations"), where("ownerEmail", "==", user.email));
      const snapshot = await getDocs(q).catch(() => null);
      
      if (!snapshot) {
        throw new Error("Local Network/Offline");
      }

      const orgs: Organization[] = [];
      snapshot.forEach(doc => {
        orgs.push({ id: doc.id, ...doc.data() } as Organization);
      });

      if (orgs.length === 0) {
        // Auto-provision personal org if none exist
        const newDocRef = doc(collection(firestore, "organizations"));
        const defOrg = { 
          id: newDocRef.id,
          name: 'Personal Org', 
          ownerEmail: user.email, 
          role: 'Owner', 
          createdAt: Timestamp.now() 
        };
        await setDoc(newDocRef, defOrg).catch(() => {});
        const createdOrg = { id: defOrg.id, name: defOrg.name, role: defOrg.role };
        setOrganizations([createdOrg]);
        setCurrentOrg(createdOrg);
      } else {
        setOrganizations(orgs);
        const savedId = localStorage.getItem(`lastOrg_${user.email}`);
        const found = orgs.find(o => o.id === savedId) || orgs[0];
        setCurrentOrg(found);
      }
    } catch (e) {
      console.warn("Org Context running in restricted mode:", (e as Error).message);
      const fallback = { id: 'temp', name: 'Sandbox Org', role: 'Maintainer' };
      setOrganizations([fallback]);
      setCurrentOrg(fallback);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshOrgs();
    }
  }, [user, refreshOrgs]);

  const switchOrg = (id: string) => {
    const found = organizations.find(o => o.id === id);
    if (found) {
      setCurrentOrg(found);
      if (user?.email) localStorage.setItem(`lastOrg_${user.email}`, id);
    }
  };

  return (
    <OrgContext.Provider value={{ currentOrg, organizations, setOrganizations, switchOrg, loading, refreshOrgs }}>
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => useContext(OrgContext);
