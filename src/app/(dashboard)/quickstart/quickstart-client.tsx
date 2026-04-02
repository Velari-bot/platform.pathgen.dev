"use client"
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Terminal, Key, Rocket, ExternalLink, ChevronRight, Zap, Database, Code, Globe } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export default function QuickstartClient() {

  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '1000px', margin: '0 auto'}}>

      <div style={{marginBottom: '80px'}}>
         <div style={{width: '64px', height: '64px', borderRadius: '18px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)'}}>
            <Rocket size={28} color="#fff" />
         </div>
         <h1 style={{fontSize: '4.5rem', fontWeight: 900, letterSpacing: '-0.06em', marginBottom: '20px', lineHeight: 1.0}}>Zero to API call <br /> in 5 minutes.</h1>
         <p style={{fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '700px'}}>
            Go from zero to your first high-fidelity telemetry extracted in under 5 minutes. No complex infrastructure required.
         </p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '100px'}}>
         
         {/* Step 1 */}
         <div style={{display: 'flex', gap: '48px'}}>
            <div style={{width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-sidebar)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, flexShrink: 0, border: '1px solid var(--border-color)'}}>1</div>
            <div style={{flex: 1}}>
               <h3 style={{fontSize: '1.75rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em'}}>Create an API Key</h3>
               <p style={{fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6}}>
                  Head to your keys dashboard to generate a new authentication token. All platform requests use Bearer Authorization.
               </p>
               <Link href="/keys" style={{textDecoration: 'none'}}>
                  <button style={{padding: '14px 28px', background: '#000', color: '#fff', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}} className="pop-out-hover active-scale">
                     <Key size={18} />
                     Generate API Key
                  </button>
               </Link>
            </div>
         </div>

         {/* Step 2 */}
         <div style={{display: 'flex', gap: '48px'}}>
            <div style={{width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-sidebar)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, flexShrink: 0, border: '1px solid var(--border-color)'}}>2</div>
            <div style={{flex: 1}}>
               <h3 style={{fontSize: '1.75rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em'}}>Submit a Replay Parse</h3>
               <p style={{fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6}}>
                  PathGen thrives on telemetry. For your first call, we&apos;ll use the POST /v1/replay/parse endpoint with a sample FN_REPLAY file.
               </p>
               
               <div style={{background: '#111827', borderRadius: '24px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{padding: '16px 32px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                     <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                        <Terminal size={14} />
                        cURL CLI
                     </div>
                      <CopyButton 
                         text='curl -X POST "https://api.pathgen.dev/v1/replay/parse" \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d "{ \"file_url\": \"https://assets.pathgen.dev/samples/replays/S2.replay\" }"'
                         size={14}
                         color="#fff"
                      />
                  </div>
                  <pre style={{margin: 0, padding: '32px', background: 'transparent', fontSize: '0.95rem', color: '#D97757', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono', lineHeight: 1.6}}>
                     <code>
{`curl -X POST "https://api.pathgen.dev/v1/replay/parse" \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{ "file_url": "https://assets.pathgen.dev/samples/replays/S2.replay" }'`}
                     </code>
                  </pre>
               </div>
            </div>
         </div>

         {/* Step 3 */}
         <div style={{display: 'flex', gap: '48px'}}>
            <div style={{width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-sidebar)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 900, flexShrink: 0, border: '1px solid var(--border-color)'}}>3</div>
            <div style={{flex: 1}}>
               <h3 style={{fontSize: '1.75rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.02em'}}>Explore the API</h3>
               <p style={{fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6}}>
                  Now that you&apos;ve made your first call, dive into our interactive explorer to test every endpoint in the PathGen ecosystem.
               </p>
               <Link href="/explorer" style={{textDecoration: 'none'}}>
                  <button style={{padding: '14px 28px', background: '#000', color: '#fff', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}} className="pop-out-hover active-scale">
                     <Terminal size={18} />
                     Open API Explorer
                  </button>
               </Link>
            </div>
         </div>

      </div>

      <div style={{marginTop: '150px', padding: '100px 64px', background: '#000', borderRadius: '48px', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden'}}>
         <div style={{position: 'relative', zIndex: 2}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.04em'}}>You&apos;re officially a PathGen developer.</h2>
            <p style={{fontSize: '1.1rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto 48px', lineHeight: 1.6}}>
               Dive into our expert guides to learn how to visualize movement maps, track real-time stats, and leverage Gemini-powered match analysis.
            </p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
               <Link href="/tutorials" style={{textDecoration: 'none'}}>
                  <button style={{padding: '16px 32px', background: '#D97757', color: '#fff', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer'}} className="pop-out-hover active-scale">
                     Master Tutorials
                  </button>
               </Link>
               <Link href="/explorer" style={{textDecoration: 'none'}}>
                  <button style={{padding: '16px 32px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}} className="pop-out-hover active-scale">
                     API Explorer
                  </button>
               </Link>
            </div>
         </div>
         {/* Decorative Blur */}
         <div style={{position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'rgba(217, 119, 87, 0.1)', filter: 'blur(100px)', borderRadius: '50%'}}></div>
      </div>

      <div style={{marginTop: '120px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px'}}>
         <div style={{display: 'flex', gap: '40px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
               <span style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)'}}>RESOURCES</span>
               <a href="https://status.pathgen.dev" target="_blank" style={{color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600}}>System Status</a>
               <Link href="/docs" style={{color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600}}>Changelog</Link>
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
               <span style={{fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)'}}>COMMUNITY</span>
               <Link href="https://discord.gg/3zQEdVWHpg" target="_blank" style={{color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600}}>Discord Server</Link>
               <Link href="https://github.com/pathgen" style={{color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600}}>GitHub</Link>
            </div>
         </div>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-sidebar)', padding: '12px 20px', borderRadius: '16px', border: '1px solid var(--border-color)'}}>
            <Globe size={18} color="var(--accent-primary)" />
            <span style={{fontSize: '0.9rem', fontWeight: 700}}>Global Network: Online</span>
         </div>
      </div>
    </div>
  );
}

