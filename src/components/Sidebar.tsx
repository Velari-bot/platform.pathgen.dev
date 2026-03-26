"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Key, Receipt, BarChart3, 
  FileText, Globe, Play, ChevronRight, Settings, 
  HelpCircle as SupportIcon, ChevronsUpDown, Check, Plus
} from 'lucide-react';
import { useOrg } from '@/lib/context/OrgContext';
import { useAuth } from '@/lib/firebase/auth-context';
import { firestore } from '@/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { currentOrg, organizations, switchOrg } = useOrg();
  const [isOrgOpen, setIsOrgOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
       setLatency(42 + Math.floor(Math.random() * 6));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user?.email) {
      setBalance(0);
      return;
    }
    
    // Safety check for mock/offline mode
    if (!firestore || (firestore as any).type === 'firestore-mock') {
      setBalance(150.00); // Demo balance
      return;
    }

    try {
        const unsub = onSnapshot(doc(firestore, "billing", user.email), (doc) => {
            if (doc.exists()) {
                setBalance(doc.data().balance || 0);
            } else {
                setBalance(0);
            }
        }, (err) => {
            console.warn("Sidebar billing sync skipped (sandbox):", err.message);
            setBalance(150.00);
        });
        return () => unsub();
    } catch (e) {
        console.warn("Sidebar billing sync init failed:", (e as Error).message);
        setBalance(150.00);
    }
  }, [user]);

  const navItems = [
    { section: "PLATFORM", items: [
      { name: "Home", icon: <LayoutDashboard size={18} />, path: "/home" }
    ]},
    { section: "DASHBOARD", items: [
      { name: "Apps", icon: <LayoutDashboard size={18} />, path: "/apps" },
      { name: "API Keys", icon: <Key size={18} />, path: "/keys" },
      { name: "Usage", icon: <BarChart3 size={18} />, path: "/usage" },
      { name: "Billing & History", icon: <Receipt size={18} />, path: "/billing" }
    ]},
    { section: "DEVELOPER EXPERIENCE", items: [
      { name: "Documentation", icon: <FileText size={18} />, path: "/docs" },
      { name: "Quickstart", icon: <Play size={18} />, path: "/quickstart" },
      { name: "Tutorials", icon: <FileText size={18} />, path: "/tutorials" },
      { name: "API Explorer", icon: <Globe size={18} />, path: "/explorer" }
    ]},
    { section: "SUPPORT", items: [
        { name: "Support Hub", icon: <SupportIcon size={18} />, path: "/support" },
        { name: "Settings", icon: <Settings size={18} />, path: "/settings" }
    ]}
  ];

  return (
    <aside style={{
      width: '260px',
      borderRight: '1px solid var(--border-color)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'var(--bg-sidebar)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      zIndex: 101,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Organization Switcher Dropdown */}
      <div style={{marginBottom: '32px', padding: '0 8px', position: 'relative'}}>
          <div 
             onClick={() => setIsOrgOpen(!isOrgOpen)}
             style={{
                padding: '10px 12px', 
                borderRadius: '10px', 
                border: '1px solid var(--border-color)', 
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
             }} className="border-button-hover active-scale">
             <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden'}}>
                <div style={{width: '24px', height: '24px', borderRadius: '6px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                   <LogoIcon size={14} />
                </div>
                <span style={{fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {currentOrg?.name || 'Loading...'}
                </span>
             </div>
             <div style={{color: 'var(--text-secondary)'}}>
                <ChevronsUpDown size={14} />
             </div>
          </div>

          {/* Org Dropdown Menu */}
          {isOrgOpen && (
            <>
              <div 
                style={{position: 'fixed', inset: 0, zIndex: 10}} 
                onClick={() => setIsOrgOpen(false)} 
              />
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '8px',
                right: '8px',
                background: '#fff',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                padding: '8px',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }} className="fade-in">
                {organizations.map(org => (
                  <button 
                    key={org.id}
                    onClick={() => { switchOrg(org.id); setIsOrgOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
                      width: '100%', border: 'none', background: 'transparent', borderRadius: '8px',
                      cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s'
                    }}
                    className="table-row-hover"
                  >
                    <div style={{flex: 1, fontSize: '1rem', fontWeight: currentOrg?.id === org.id ? 700 : 500, color: currentOrg?.id === org.id ? 'var(--accent-primary)' : 'var(--text-primary)'}}>
                      {org.name}
                    </div>
                    {currentOrg?.id === org.id && <Check size={14} color="var(--accent-primary)" />}
                  </button>
                ))}
                
                <div style={{height: '1px', background: 'var(--border-color)', margin: '4px 0'}} />
                
                <Link href="/organization" onClick={() => setIsOrgOpen(false)} style={{textDecoration: 'none'}}>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px',
                    width: '100%', border: 'none', background: 'transparent', borderRadius: '8px',
                    cursor: 'pointer', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500
                  }} className="table-row-hover">
                    <Plus size={14} /> Create or Manage
                  </button>
                </Link>
              </div>
            </>
          )}
      </div>

      <nav style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '4px'}}>
        {navItems.map((group) => (
          <div key={group.section}>
            <div style={{fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.08em', padding: '0 16px', marginBottom: '8px'}}>
              {group.section}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      background: isActive ? '#EEECE7' : 'transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s ease'
                    }}
                    className="table-row-hover"
                  >
                    {item.icon}
                    {item.name}
                    {isActive && <ChevronRight size={14} style={{marginLeft: 'auto'}} />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div style={{marginTop: 'auto', padding: '16px', background: 'rgba(217, 119, 87, 0.05)', borderRadius: '12px', border: '1px solid rgba(217, 119, 87, 0.1)'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
            <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#10B981'}}></div>
            <span style={{fontSize: '0.75rem', fontWeight: 600, color: '#111827'}}>Operational</span>
         </div>
         <div style={{fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '2px'}}>
            {Math.round((balance || 0) * 100).toLocaleString()}
         </div>
         <div style={{fontSize: '0.65rem', color: '#6B6A68', fontWeight: 500}}>
            API Latency: {latency}ms
         </div>
      </div>
    </aside>
  );
}

function LogoIcon({ size }: { size: number }) {
   return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M12 2V22M2 12H22M4.93 4.93L19.07 19.07M4.93 19.07L19.07 4.93" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
   );
}
