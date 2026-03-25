"use client"
import { useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/home');
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px'
    }}>
      <div className="fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        background: '#fff',
        borderRadius: '32px',
        padding: '56px',
        boxShadow: '0 20px 80px rgba(0,0,0,0.06)',
        border: '1px solid var(--border-color)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Dynamic decorative element */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          width: '120px',
          height: '120px',
          background: 'var(--accent-primary)',
          opacity: 0.03,
          borderRadius: '50%'
        }}></div>

        <div style={{textAlign: 'center', marginBottom: '48px'}}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'var(--accent-primary)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '8px'}}>
            {isRegistering ? 'Create account' : 'Welcome back'}
          </h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '1rem'}}>
            {isRegistering ? 'Join Pathgen for exclusive API access' : 'Enter your credentials to access the console'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '16px',
            background: '#FEF2F2',
            border: '1px solid #FEE2E2',
            borderRadius: '12px',
            color: '#EF4444',
            fontSize: '0.85rem',
            marginBottom: '24px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{width: '6px', height: '6px', borderRadius: '50%', background: '#EF4444'}}></div>
            {error}
          </div>
        )}

        <div style={{display: 'flex', gap: '12px', marginBottom: '32px'}}>
          <button 
            onClick={handleGoogleSignIn}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            className="table-row-hover"
          >
            <div style={{
              width: '18px', 
              height: '18px', 
              background: '#4285F4', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 900
            }}>G</div>
            Google
          </button>
          <button 
            disabled
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              background: '#F9FAFB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'not-allowed',
              opacity: 0.5
            }}
          >
            <div style={{
              width: '18px', 
              height: '18px', 
              background: '#333', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 900
            }}>GH</div>
            GitHub
          </button>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
          <div style={{flex: 1, height: '1px', background: 'var(--border-color)'}}></div>
          <span style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}>or continue with email</span>
          <div style={{flex: 1, height: '1px', background: 'var(--border-color)'}}></div>
        </div>

        <form onSubmit={handleEmailAuth} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
          <div style={{position: 'relative'}}>
            <Mail size={18} style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                fontSize: '0.95rem',
                outline: 'none',
                background: '#fff'
              }}
            />
          </div>
          <div style={{position: 'relative'}}>
            <Lock size={18} style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                fontSize: '0.95rem',
                outline: 'none',
                background: '#fff'
              }}
            />
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
              background: 'var(--accent-primary)',
              color: '#fff',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '12px',
              boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)'
            }}
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
            <LogIn size={20} />
          </button>
        </form>

        <div style={{textAlign: 'center', marginTop: '32px'}}>
          <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>
            {isRegistering ? 'Already have an account?' : 'Don\'t have an account?'} {' '}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-primary)',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        <div style={{marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center'}}>
           <Link href="/" style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
              Go back to Home <ArrowRight size={16} />
           </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
