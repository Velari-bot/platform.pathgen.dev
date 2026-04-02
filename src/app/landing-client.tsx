"use client"


import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, BookOpen, Code, Lightbulb, Zap, Globe, MessageSquare, Mail, Lock, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { auth } from '@/lib/firebase/config';
import { Turnstile } from '@marsidev/react-turnstile';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

export default function LandingClient({ defaultIsRegistering = false }: { defaultIsRegistering?: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(defaultIsRegistering);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!turnstileToken) {
       setError('Please complete the security check');
       return;
    }

    setLoading(true);
    try {
      // Verify token with our API
      const verifyRes = await fetch('/api/turnstile/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: turnstileToken }),
      });

      if (!verifyRes.ok) {
          setError('Security check failed. Please refresh and try again.');
          setLoading(false);
          return;
      }

      // Pathgen Mock Mode
      if (!auth) {
        if (typeof window !== 'undefined') localStorage.setItem('mock_user_logged_in', 'true');
        window.location.href = '/home';
        return;
      }

      if (isRegistering) {
        await createUserWithEmailAndPassword(auth!, email, password);
      } else {
        await signInWithEmailAndPassword(auth!, email, password);
      }
      router.push('/home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Pathgen Mock Mode Logic
    if (!auth) {
       setError("Firebase config is missing or invalid. Please check your .env file to enable the Google Auth popup.");
       console.warn("Mock mode bypass blocked to show popup requirement.");
       return;
    }

    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const { user } = await signInWithPopup(auth!, provider);
      
      // Sync with Firestore (Ensure user doc exists)
      const { doc, setDoc, getDoc } = await import('firebase/firestore');
      const { firestore } = await import('@/lib/firebase/config');
      
      if (firestore) {
        const userRef = doc(firestore, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            credits: 100,
            created_at: new Date().toISOString(),
            setup_complete: true,
            provider: 'google'
          });
        }
      }

      router.push('/home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during Google sign-in');
      }
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = [
    {
      title: 'Products',
      links: [
        { name: 'Pathgen API', href: '/docs' },
        { name: 'Pathgen SDK', href: '/docs' },
        { name: 'Enterprise', href: '/support' },
        { name: 'Max plan', href: '/pricing' },
        { name: 'Team plan', href: '/pricing' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Log in', href: '/' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { name: 'AI agents', href: '/docs#ai' },
        { name: 'Code Security', href: '/docs#security' },
        { name: 'Telemedicine', href: '/tutorials' },
        { name: 'Education', href: '/tutorials' },
        { name: 'Government', href: '/support' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/docs' },
        { name: 'Community', href: '/' },
        { name: 'Status', href: '/status' },
        { name: 'Tutorials', href: '/tutorials' },
        { name: 'Use cases', href: '/quickstart' }
      ]
    },
    {
      title: 'Help',
      links: [
        { name: 'Support center', href: '/support' },
        { name: 'Contact us', href: '/support' },
        { name: 'Documentation', href: '/docs' },
        { name: 'API Reference', href: '/docs#reference' }
      ]
    }
  ];

  const secondaryFooterLinks = [
    {
      title: 'Features',
      links: [
        { name: 'Replay Parsing', href: '/docs' },
        { name: 'Movement Telemetry', href: '/docs' },
        { name: 'AI Analytics', href: '/docs' },
        { name: 'Stats Engine', href: '/docs' }
      ]
    },
    {
      title: 'Models',
      links: [
        { name: 'Pathgen V2', href: '/docs' },
        { name: 'Pathgen Lite', href: '/docs' },
        { name: 'Vison (Alpha)', href: '/docs' }
      ]
    },
    {
       title: 'Company',
       links: [
         { name: 'About Pathgen', href: '/docs' },
         { name: 'Our Mission', href: '/docs' },
         { name: 'Research', href: '/docs' }
       ]
    },
    {
       title: 'Terms and policies',
       links: [
         { name: 'Privacy choices', href: '/privacy' },
         { name: 'Privacy policy', href: '/privacy' },
         { name: 'Terms of service', href: '/terms' },
         { name: 'Usage policy', href: '/usage-policy' }
       ]
    }
  ];

  return (
    <div className="fade-in" style={{
      minHeight: '100vh', 
      background: '#FAF9F6', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '0 80px',
      color: '#111111',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      
      {/* Header */}
       <header style={{
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%', 
          maxWidth: '1200px', 
          margin: '0 auto'
       }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
             <Image 
               src="/Pathgen Base Platform logo.png" 
               alt="Pathgen Logo" 
               width={44} 
               height={44} 
               style={{objectFit: 'contain'}}
             />
             <span style={{fontSize: '1.25rem', fontWeight: 600, color: '#111111'}}>Pathgen Console</span>
          </div>
          <button style={{
            padding: '8px 14px', 
            borderRadius: '8px', 
            border: '1px solid #E5E5E5', 
            background: 'transparent', 
            fontSize: '0.9rem', 
            fontWeight: 500, 
            color: '#111111',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}>
             Documentation
             <ArrowUpRight size={14} />
          </button>
       </header>

       {/* Main Landing/Auth Section */}
       <main style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0'}}>
          <h1 style={{fontSize: '2.75rem', fontWeight: 500, textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.02em', color: '#111111'}}>
             Build on the Pathgen <br/> Platform
          </h1>
          <p style={{color: '#6B6A68', fontSize: '0.95rem', fontWeight: 400, textAlign: 'center', marginBottom: '32px'}}>
             Sign in or create a developer account to build with the Pathgen API
          </p>

          <div style={{width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {/* Google Login */}
            <button 
                onClick={handleGoogleSignIn}
                style={{
                    background: '#ECE9E1', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    color: '#111111'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
               <svg width="16" height="16" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
                  <path fill="#FBBC05" d="M3.964 10.706c-.18-.54-.282-1.117-.282-1.706s.102-1.166.282-1.706V4.962H.957a8.996 8.996 0 000 8.076l3.007-2.332z" />
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.582C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" />
               </svg>
               Continue with Google
            </button>

            <div style={{textAlign: 'center', fontSize: '0.75rem', color: '#6B6A68', margin: '4px 0'}}>OR</div>

            <form onSubmit={handleEmailAuth} style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {error && <div style={{color: '#D93025', fontSize: '0.8rem', marginBottom: '4px', textAlign: 'center'}}>{error}</div>}
                <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        width: '100%',
                        padding: '12px 14px', 
                        borderRadius: '10px', 
                        border: '1px solid #E5E5E5', 
                        background: '#fff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        color: '#111111'
                    }}
                />
                {(email || isRegistering) && (
                   <input 
                      type="password" 
                      placeholder="Password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                          width: '100%',
                          padding: '12px 14px', 
                          borderRadius: '10px', 
                          border: '1px solid #E5E5E5', 
                          background: '#fff',
                          fontSize: '0.9rem',
                          outline: 'none',
                          color: '#111111'
                      }}
                  />
                )}
                
                <div className="flex justify-center my-2">
                  <Turnstile 
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACxrtv94QGjXeUxO"} 
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    onError={() => {
                        setError('Security check failed. Please refresh.');
                        setTurnstileToken(null);
                    }}
                    options={{
                        theme: 'light'
                    }}
                  />
                </div>

                <button type="submit" style={{
                    background: '#111111', 
                    color: '#fff', 
                    padding: '12px', 
                    borderRadius: '10px', 
                    fontSize: '0.9rem', 
                    fontWeight: 500, 
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
                disabled={!turnstileToken || loading}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : (isRegistering ? 'Create account' : 'Continue with email')}
                </button>
            </form>

            <p style={{fontSize: '0.75rem', color: '#6B6A68', textAlign: 'center', marginTop: '8px', lineHeight: 1.4}}>
               By continuing, you agree to Pathgen&apos;s <Link href="/terms" style={{color: '#111111', textDecoration: 'underline'}}>Commercial Terms</Link> and <Link href="/usage-policy" style={{color: '#111111', textDecoration: 'underline'}}>Usage Policy</Link>, 
               <br/> and acknowledge our <Link href="/privacy" style={{color: '#111111', textDecoration: 'underline'}}>Privacy Policy</Link>.
            </p>

            <div style={{textAlign: 'center', marginTop: '16px'}}>
               <button 
                  onClick={() => setIsRegistering(!isRegistering)}
                  style={{background: 'none', border: 'none', color: '#6B6A68', fontWeight: 500, cursor: 'pointer', fontSize: '0.85rem'}}
               >
                   {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
               </button>
            </div>
         </div>
       </main>

      <div style={{
         width: '100%', 
         maxWidth: '1000px', 
         margin: '0 auto 120px', 
         display: 'grid', 
         gridTemplateColumns: 'repeat(4, 1fr)', 
         gap: '16px'
      }}>
         {[
            { title: "Developer Docs", desc: "Get started with the Pathgen Platform.", icon: <BookOpen size={18} />, href: "/docs" },
            { title: "API Reference", desc: "Integrate and scale using our endpoints.", icon: <Code size={18} />, href: "/docs#reference" },
            { title: "Cookbooks", desc: "Practical code examples and implementations.", icon: <Lightbulb size={18} />, href: "/tutorials" },
            { title: "Quickstarts", desc: "Sample apps built with our engine.", icon: <Zap size={18} />, href: "/quickstart" }
         ].map((card, i) => (
            <Link key={i} href={card.href} style={{textDecoration: 'none', color: 'inherit'}}>
               <div style={{
                  padding: '24px', 
                  background: '#F5F2EA', 
                  border: '1px solid #E5E5E5', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out'
               }} className="pop-out-hover">
                  <div style={{marginBottom: '16px', color: '#6B6A68'}}>
                     {card.icon}
                  </div>
                  <div style={{fontSize: '1rem', fontWeight: 500, marginBottom: '6px', color: '#111111'}}>{card.title}</div>
                  <p style={{fontSize: '0.85rem', color: '#6B6A68', lineHeight: 1.4}}>{card.desc}</p>
               </div>
            </Link>
         ))}
      </div>

      {/* Massive Dark Footer */}
      <footer style={{
          background: '#111111', 
          color: '#fff', 
          padding: '120px 80px', 
          margin: '0 -80px', 
          flexShrink: 0
      }}>
         <div style={{width: '100%', maxWidth: '1400px', margin: '0 auto'}}>
            <div style={{display: 'flex', gap: '80px', flexWrap: 'wrap'}}>
               {/* Left Side: Logo (Top) and Branding (Bottom) */}
               <div style={{flex: '1 0 300px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '300px'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Image 
                      src="/Pathgen Base Platform logo.png" 
                      alt="Pathgen Logo" 
                      width={44} 
                      height={44} 
                      style={{objectFit: 'contain'}}
                    />
                    <span style={{fontSize: '1.5rem', fontWeight: 500, color: '#fff'}}>Pathgen</span>
                  </div>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                     <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1rem', color: '#888', fontWeight: 500}}>
                        Developed By 
                        <a href="https://x.com/WrenchDevelops" target="_blank" style={{
                           display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none'
                        }} className="pop-out-hover">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/>
                           </svg>
                           WrenchDevelops
                        </a>
                     </div>
                     
                     <div style={{display: 'flex', gap: '20px', color: '#6B6A68'}}>
                        <a href="https://x.com/WrenchDevelops" target="_blank" style={{color: 'inherit'}} className="pop-out-hover"><Globe size={18} /></a>
                        <a href="https://discord.gg/3zQEdVWHpg" target="_blank" style={{color: 'inherit'}} className="pop-out-hover"><MessageSquare size={18} /></a>
                        <Mail size={18} style={{cursor: 'pointer'}} />
                        <Lock size={18} style={{cursor: 'pointer'}} />
                     </div>
                     <div style={{fontSize: '0.8rem', color: '#444'}}>© 2026 PATHGEN AI CORE</div>
                  </div>
               </div>

               {/* Right Side: Grid Links */}
               <div style={{flex: 3, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px'}}>
                  {footerLinks.map((col) => (
                    <div key={col.title}>
                        <div style={{fontSize: '0.9rem', color: '#6B6A68', marginBottom: '24px', fontWeight: 500}}>{col.title}</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                           {col.links.map((link) => (
                             <Link key={link.name} href={link.href} style={{fontSize: '0.85rem', color: '#fff', textDecoration: 'none', opacity: 0.9}} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}>
                                {link.name}
                             </Link>
                           ))}
                        </div>
                    </div>
                  ))}
                   {secondaryFooterLinks.map((col) => (
                    <div key={col.title}>
                        <div style={{fontSize: '0.9rem', color: '#6B6A68', marginBottom: '24px', fontWeight: 500}}>{col.title}</div>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                           {col.links.map((link) => (
                             <Link key={typeof link === 'string' ? link : link.name} href={typeof link === 'string' ? '#' : link.href} style={{fontSize: '0.85rem', color: '#fff', textDecoration: 'none', opacity: 0.9}} onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')} onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}>
                                {typeof link === 'string' ? link : link.name}
                             </Link>
                           ))}
                        </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </footer>
   </div>
  );
}

