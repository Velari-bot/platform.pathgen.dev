"use client"
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ExternalLink, MessageSquareText, X, Send, User, Settings, CreditCard, LogOut, Building, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { firestore } from '@/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

import { useAuth } from '@/lib/firebase/auth-context';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const userEmail = user?.email || "aiden@pathgen.dev";
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [userName, setUserName] = useState(user?.displayName || 'User');
  const [userImage, setUserImage] = useState('');

  // Sync user data from Firestore
  useEffect(() => {
    // Safety check for mock/offline mode
    if (!firestore || (firestore as any).type === 'firestore-mock') return;
    
    try {
        const unsub = onSnapshot(doc(firestore, "users", userEmail), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.profile?.name) setUserName(data.profile.name);
                if (data.profile?.image) setUserImage(data.profile.image);
            }
        }, (err) => {
            console.warn("Firestore sync failed (expected in sandbox):", err.message);
        });
        return () => unsub();
    } catch (e) {
        console.warn("Header Firestore sync skipped:", (e as Error).message);
    }
  }, [userEmail]);

  // Close account menu on outside click
  useEffect(() => {
    const handleOutsideClick = () => setIsAccountOpen(false);
    if (isAccountOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isAccountOpen]);

  const getPageTitle = (path: string) => {
    if (path === '/organization') return 'Organization';
    if (path === '/apps') return 'Applications';
    
    switch (path) {
      case '/': return 'Overview';
      case '/keys': return 'API Keys';
      case '/billing': return 'Billing';
      case '/docs': return 'Documentation';
      case '/explorer': return 'API Explorer';
      case '/pricing': return 'Pricing';
      case '/status': return 'Systems Status';
      case '/usage': return 'Usage Analytics';
      case '/home': return 'Home';
      case '/settings': return 'Settings';
      case '/quickstart': return 'Quickstart';
      case '/tutorials': return 'Tutorials';
      case '/support': return 'Support Hub';
      case '/terms': return 'Terms';
      case '/privacy': return 'Privacy';
      default: return 'Pathgen';
    }
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setIsFeedbackOpen(false);
      setFeedbackText('');
    }, 2000);
  };

  return (
    <header style={{
      height: '80px',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(250, 249, 246, 0.8)', 
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
         <div style={{fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '-0.01em'}}>
            Platform <span style={{color: 'var(--border-color)'}}>/</span> <span style={{color: 'var(--text-primary)'}}>{getPageTitle(pathname)}</span>
         </div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: '32px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <Link href="/docs" style={{
               fontSize: '0.9rem', 
               fontWeight: 600, 
               color: 'var(--text-secondary)', 
               textDecoration: 'none',
               display: 'flex',
               alignItems: 'center',
               gap: '6px',
               transition: 'color 0.2s'
            }}>
               Docs
               <ExternalLink size={14} style={{opacity: 0.5}} />
            </Link>
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.9rem', 
                fontWeight: 600, 
                color: 'var(--text-secondary)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s'
             }}>
               Feedback
               <MessageSquareText size={14} style={{opacity: 0.5}} />
            </button>
         </div>

         <div style={{width: '1px', height: '24px', background: 'var(--border-color)'}}></div>

         <div style={{position: 'relative'}}>
            <div 
              onClick={(e) => { e.stopPropagation(); setIsAccountOpen(!isAccountOpen); }}
              style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '6px 14px', 
                background: isAccountOpen ? '#EEECE7' : 'var(--bg-sidebar)', 
                borderRadius: '40px', 
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
             }} className="border-button-hover active-scale">
                 <div style={{
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'rgba(217, 119, 87, 0.1)', 
                    color: 'var(--accent-primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    border: '1.5px solid #fff',
                    boxShadow: '0 0 0 1px var(--border-color)',
                    overflow: 'hidden',
                    position: 'relative'
                 }}>
                    {userImage ? (
                      <Image src={userImage} alt="Avatar" fill unoptimized style={{objectFit: 'cover'}} />
                    ) : (
                      userName.charAt(0)
                    )}
                 </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                   <span style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2, letterSpacing: '-0.01em'}}>{userName.split(' ')[0]}</span>
                </div>
                <ChevronDown size={14} color="var(--text-secondary)" style={{transform: isAccountOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}} />
            </div>

            {/* Account Dropdown Menu */}
            {isAccountOpen && (
              <div className="fade-in" style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '240px',
                background: '#fff',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 1000
              }}>
                 <div style={{padding: '12px 16px', borderBottom: '1px solid var(--border-color)', marginBottom: '6px'}}>
                    <div style={{fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)'}}>{userName}</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>{userEmail}</div>
                 </div>
                 
                 <Link href="/settings" style={{textDecoration: 'none'}}>
                    <button style={{width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'}} className="table-row-hover">
                       <User size={16} />
                       Profile Settings
                    </button>
                 </Link>
                 <Link href="/organization" style={{textDecoration: 'none'}}>
                    <button style={{width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'}} className="table-row-hover">
                       <Building size={16} />
                       Organization Info
                    </button>
                 </Link>
                 <Link href="/billing" style={{textDecoration: 'none'}}>
                    <button style={{width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'}} className="table-row-hover">
                       <CreditCard size={16} />
                       Billing & History
                    </button>
                 </Link>
                 <Link href="/docs" style={{textDecoration: 'none'}}>
                    <button style={{width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer'}} className="table-row-hover">
                       <Settings size={16} />
                       Integrations
                    </button>
                 </Link>
                 
                 <div style={{height: '1px', background: 'var(--border-color)', margin: '4px 0'}}></div>
                                  <button 
                    onClick={logout}
                    style={{width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '12px', background: 'transparent', border: 'none', borderRadius: '10px', color: '#EF4444', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'}} 
                    className="table-row-hover"
                  >
                     <LogOut size={16} />
                     Log out
                  </button>
              </div>
            )}
         </div>
      </div>

      {isFeedbackOpen && typeof document !== 'undefined' && (
        require('react-dom').createPortal(
          <div style={{
            position: 'fixed',
            top: 0, 
            left: 0, 
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.2)', // Slightly darker for better contrast
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 100000,
            pointerEvents: 'all',
            padding: '24px' // Padding for small screens
          }}>
            <div className="fade-in" style={{
              width: '100%', maxWidth: '480px',
              background: '#fff', borderRadius: '24px',
              padding: '48px', position: 'relative',
              boxShadow: '0 20px 80px rgba(0,0,0,0.1)',
              border: '1px solid var(--border-color)',
              margin: 'auto' // Secondary insurance for centering
            }}>
              <button 
                onClick={() => setIsFeedbackOpen(false)} 
                style={{position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px'}}
              >
                 <X size={24} color="var(--text-secondary)" />
              </button>
              
              {feedbackSent ? (
                 <div style={{textAlign: 'center', padding: '20px 0'}}>
                   <div style={{width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                      <CheckCircle2 size={32} />
                   </div>
                   <h2 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px'}}>Feedback Sent</h2>
                   <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                      Thank you for helping us improve Pathgen.
                   </p>
                 </div>
              ) : (
                 <>
                   <h2 style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px'}}>Send Feedback</h2>
                   <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.6}}>
                      Tell us what&apos;s on your mind. Before reporting a <strong>bug</strong>, please check our <a href="https://status.pathgen.dev" target="_blank" style={{color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none'}}>System Status</a>.
                   </p>
                   
                   <div style={{marginBottom: '24px'}}>
                      <label style={{display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>MESSAGE</label>
                      <textarea 
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        autoFocus
                        placeholder="Found a bug? Have a feature request? Let us know..." 
                        style={{
                           width: '100%', 
                           height: '140px', 
                           padding: '16px', 
                           borderRadius: '16px', 
                           border: '1px solid var(--border-color)', 
                           fontSize: '0.95rem', 
                           outline: 'none',
                           resize: 'none',
                           fontFamily: 'inherit',
                           lineHeight: 1.6,
                           background: '#fff'
                        }}
                      />
                    </div>
  
                   <button 
                     onClick={handleSendFeedback}
                     disabled={!feedbackText.trim()}
                     style={{
                       width: '100%', 
                       background: feedbackText.trim() ? 'var(--accent-primary)' : 'var(--bg-sidebar)', 
                       color: feedbackText.trim() ? '#fff' : 'var(--text-secondary)', 
                       padding: '14px', 
                       borderRadius: '12px', 
                       fontWeight: 600, 
                       border: 'none', 
                       cursor: feedbackText.trim() ? 'pointer' : 'not-allowed',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       gap: '10px',
                       transition: 'all 0.2s'
                     }}
                   >
                      <Send size={16} />
                      Submit Feedback
                   </button>
                 </>
              )}
            </div>
          </div>,
          document.body
        )
      )}
    </header>
  );
}
