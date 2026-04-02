"use client"
import { useState } from 'react';
import { 
  MessageSquare, BookOpen, AlertCircle, Send, ChevronDown, CheckCircle, 
  Loader2, Terminal, Code, Cpu, Shield, Globe, Layers, Activity 
} from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import Link from 'next/link';

export default function Support() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const troubleshooting = [
    { 
      q: "My API Key returns 401 Unauthorized", 
      a: "Ensure your key starts with 'rs_' and is passed in the 'Authorization: Bearer <key>' header. If you recently rotated your key, wait 60 seconds for global replication." 
    },
    { 
      q: "Received 429 Too Many Requests", 
      a: "You've hit your tier's burst limit. Check the 'X-RateLimit-Reset' header for when your window clears. For higher throughput, consider moving to a paid credit pack." 
    },
    { 
      q: "Why are some fields 'null' in the response?", 
      a: "This typically indicates the data wasn't recorded in that replay chunk or requires an Epic Account connection. Check parser_meta.phase for data completeness." 
    },
    { 
      q: "Replay failed to parse (500 Error)", 
      a: "This happens if a file is corrupted or from an unsupported old version. Credits are NOT deducted for 5xx errors." 
    }
  ];

  const toggleFaq = (i: number) => {
    setActiveFaq(activeFaq === i ? null : i);
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken) {
        setError('Please complete the security check');
        return;
    }
    
    setLoading(true);
    setError(null);

    try {
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

        // Mock submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitSuccess(true);
    } catch (err) {
        setError('An error occurred. Please try again later.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '1200px', margin: '0 auto'}}>
      
      {/* Hero Section */}
      <div style={{marginBottom: '100px'}}>
         <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(217, 119, 87, 0.1)', color: '#D97757', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '0.05em'}}>
            <Activity size={14} /> SYSTEM STATUS: OPERATIONAL
         </div>
         <h1 style={{fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.06em', marginBottom: '24px', lineHeight: 1}}>How can we help?</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280', maxWidth: '750px', lineHeight: 1.6}}>
            Access technical documentation, troubleshooting guides, or connect with our engineering team directly via Discord or support tickets.
         </p>
      </div>

      {/* Primary Action Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '100px'}}>
         {[
            { title: "Documentation", desc: "API Reference & Schemas", icon: <BookOpen size={22} />, link: "/docs", color: "#1A1A1A" },
            { title: "Discord", desc: "Real-time dev community", icon: <MessageSquare size={22} />, link: "https://discord.gg/3zQEdVWHpg", color: "#5865F2" },
            { title: "System Status", desc: "Live API Health", icon: <Globe size={22} />, link: "https://status.pathgen.dev", color: "#10B981" },
            { title: "Tutorials", desc: "Step-by-step guides", icon: <Terminal size={22} />, link: "/tutorials", color: "#D97757" }
         ].map((card, i) => (
            <a key={i} href={card.link} target={card.link.startsWith('http') ? '_blank' : undefined} 
               style={{
                padding: '32px', background: '#fff', border: '1px solid #EEECE7', borderRadius: '32px', 
                textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '20px'
               }} className="pop-out-hover"
            >
               <div style={{width: '48px', height: '48px', borderRadius: '14px', background: '#F9FAFB', border: '1px solid #EEECE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color}}>
                  {card.icon}
               </div>
               <div>
                  <h3 style={{fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px'}}>{card.title}</h3>
                  <p style={{fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.4}}>{card.desc}</p>
               </div>
            </a>
         ))}
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '64px', alignItems: 'center'}}>
         {/* Contact Form */}
         <div style={{background: '#000', borderRadius: '40px', padding: '48px 64px', color: '#fff', width: '100%', maxWidth: '1200px'}}>
            {isSubmitSuccess ? (
               <div style={{textAlign: 'center', padding: '40px 0'}}>
                  <div style={{width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
                     <CheckCircle size={32} />
                  </div>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px'}}>Request Sent</h3>
                  <p style={{color: '#9CA3AF', fontSize: '0.95rem', lineHeight: 1.6}}>Our engineers typically respond within 24 hours.</p>
                  <button onClick={() => setIsSubmitSuccess(false)} style={{marginTop: '32px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'}}>Send another</button>
               </div>
            ) : (
               <>
                  <div style={{marginBottom: '32px', textAlign: 'center'}}>
                     <h3 style={{fontSize: '2rem', fontWeight: 900, marginBottom: '8px'}}>Direct Support</h3>
                     <p style={{color: '#9CA3AF', fontSize: '1rem', lineHeight: 1.5}}>Stuck on a specific match or billing issue? Submit a ticket below.</p>
                  </div>
                  
                  <form onSubmit={handleSupportSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                     <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                        <div>
                           <label style={{display: 'block', fontSize: '0.7rem', fontWeight: 900, color: '#4B5563', marginBottom: '8px', letterSpacing: '0.05em'}}>TOPIC</label>
                           <select style={{width: '100%', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', outline: 'none', cursor: 'pointer'}}>
                              <option>Technical Blocker</option>
                              <option>Billing / Stripe Issue</option>
                              <option>Enterprise / High Volume</option>
                              <option>Reporting a Bug</option>
                           </select>
                        </div>
                        <div>
                           <label style={{display: 'block', fontSize: '0.7rem', fontWeight: 900, color: '#4B5563', marginBottom: '8px', letterSpacing: '0.05em'}}>REPLAY ID / PARSER META (OPTIONAL)</label>
                           <input type="text" placeholder="rs_meta_..." style={{width: '100%', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'JetBrains Mono'}} />
                        </div>
                     </div>
                     <div>
                        <label style={{display: 'block', fontSize: '0.7rem', fontWeight: 900, color: '#4B5563', marginBottom: '8px', letterSpacing: '0.05em'}}>REASONING</label>
                        <textarea required placeholder="Describe the behavior..." style={{width: '100%', height: '110px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.95rem', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.6}} />
                     </div>
                     
                     <div style={{display: 'flex', justifyContent: 'center', padding: '8px 0'}}>
                        <Turnstile 
                            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAACxrtv94QGjXeUxO"} 
                            onSuccess={(token) => setTurnstileToken(token)}
                            options={{ theme: 'dark', size: 'normal' }}
                        />
                     </div>

                     {error && <div style={{color: '#EF4444', fontSize: '0.8rem', textAlign: 'center'}}>{error}</div>}

                     <button type="submit" disabled={!turnstileToken || loading} style={{padding: '18px', background: '#fff', color: '#000', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', opacity: (!turnstileToken || loading) ? 0.5 : 1}} className="pop-out-hover active-scale">
                        {loading ? <Loader2 size={20} className="animate-spin" /> : (
                           <>
                              <Send size={20} />
                              Open Support Ticket
                           </>
                        )}
                     </button>
                  </form>
               </>
            )}
         </div>

         {/* Troubleshooting */}
         <div style={{width: '100%', maxWidth: '800px'}}>
            <div style={{textAlign: 'center', marginBottom: '48px'}}>
               <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.04em'}}>Technical Triage</h2>
               <p style={{color: '#6B7280', fontSize: '1.1rem'}}>Common integration blockers and their sub-60s resolutions.</p>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               {troubleshooting.map((item, i) => (
                  <div key={i} style={{background: '#fff', border: '1px solid #EEECE7', borderRadius: '24px', overflow: 'hidden'}}>
                     <button 
                        onClick={() => toggleFaq(i)}
                        style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left'}}
                     >
                        <span style={{fontSize: '1.1rem', fontWeight: 800, color: '#111827'}}>{item.q}</span>
                        <div style={{width: '32px', height: '32px', borderRadius: '50%', background: activeFaq === i ? '#F9FAFB' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'}}>
                           <ChevronDown size={18} color="#9CA3AF" style={{transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s'}} />
                        </div>
                     </button>
                     {activeFaq === i && (
                        <div style={{fontSize: '1rem', color: '#6B7280', lineHeight: 1.7, padding: '0 32px 24px 32px'}} className="fade-in">
                           <div style={{padding: '24px', background: '#F9FAFB', borderRadius: '16px'}}>
                              {item.a}
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
