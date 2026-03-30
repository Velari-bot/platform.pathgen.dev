"use client"
// Syncing v1.2.9 - Force Reload Trigger
import { useState, useEffect, useRef } from 'react';
import { Shield, CreditCard, Box, Terminal, AlertTriangle, Clock, History, Zap, Check, Map, Coins, HardDrive, Lock, Globe, Database, Cpu, Activity, Layout, HeartPulse, Braces } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { ENDPOINTS_DATA } from '@/data/endpoints';

export default function DocsClient() {
  const [activeSection, setActiveSection] = useState('overview');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const scrollContainer = document.querySelector('.content-area');
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      root: scrollContainer,
      rootMargin: '-10% 0px -80% 0px',
      threshold: [0, 0.1]
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.current?.observe(section));

    return () => observer.current?.disconnect();
  }, []);

  const groups = [
    { 
      section: "Platform Essentials", 
      items: [
        { id: 'overview', title: 'Architecture Overview', icon: <Globe size={18} /> },
        { id: 'auth', title: 'Authentication & Rates', icon: <Lock size={18} /> },
      ]
    },
    ...ENDPOINTS_DATA.map((section, idx) => {
      const title = section.title.replace(/^[0-9.]+\s+/, '');
      let icon = <Terminal size={18} />;
      if (title.includes('Infrastructure')) icon = <Activity size={18} />;
      if (title.includes('Metadata')) icon = <Database size={18} />;
      if (title.includes('Intelligence')) icon = <Cpu size={18} />;
      if (title.includes('Replay')) icon = <History size={18} />;
      if (title.includes('Visualization')) icon = <Map size={18} />;
      if (title.includes('AI Coaching')) icon = <Zap size={18} />;
      if (title.includes('Billing')) icon = <CreditCard size={18} />;
      if (title.includes('Automation')) icon = <Zap size={18} />;

      return {
        section: title.toUpperCase(),
        items: [
          { id: `section-${idx}`, title: title, icon }
        ]
      };
    })
  ];

  const scrollToSection = (id: string) => {
     setActiveSection(id);
     const element = document.getElementById(id);
     if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  };

  return (
    <div className="fade-in" style={{display: 'flex', gap: '64px', minHeight: '100vh', paddingBottom: '120px'}}>
      
      {/* Documentation Navigation */}
      <div style={{
         width: '280px', position: 'sticky', top: '24px', 
         height: 'calc(100vh - 150px)', overflowY: 'auto',
         paddingRight: '12px', scrollbarWidth: 'none'
      }} className="docs-sidebar">
         <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', paddingLeft: '16px'}}>
            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981'}}></div>
            <h4 style={{fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em'}}>v1.2.9 Technical Docs</h4>
         </div>
         
         <nav style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
            {groups.map((group) => (
              <div key={group.section}>
                <div style={{fontSize: '0.65rem', fontWeight: 900, color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '12px', paddingLeft: '16px'}}>{group.section}</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                   {group.items.map((item) => (
                    <a 
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        color: activeSection === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: activeSection === item.id ? 'var(--bg-sidebar)' : 'transparent',
                        fontWeight: activeSection === item.id ? 700 : 500,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        borderLeft: activeSection === item.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                        paddingLeft: activeSection === item.id ? '13px' : '16px'
                      }}
                      className="active-scale"
                    >
                      <span style={{color: activeSection === item.id ? 'var(--accent-primary)' : 'inherit'}}>
                        {item.icon}
                      </span>
                      <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem'}}>
                        {item.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
         </nav>
      </div>

      {/* Content */}
      <div style={{flex: 1, maxWidth: '1000px'}}>
         
         <section id="overview" style={{paddingTop: '0', marginBottom: '100px', scrollMarginTop: '48px'}}>
            <div style={{marginBottom: '48px'}}>
               <span style={{fontSize: '0.65rem', fontWeight: 900, background: 'rgba(217, 119, 87, 0.05)', color: '#D97757', padding: '6px 12px', borderRadius: '100px', letterSpacing: '0.1em'}}>SYSTEM OVERVIEW</span>
            </div>
            <h1 style={{fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '32px', lineHeight: 1.0, color: '#111827'}}>
               The PathGen Engine.
            </h1>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '40px', maxWidth: '800px'}}>
               PathGen provides the infrastructure for high-performance Fortnite applications. We abstract the complexity of raw replay streams and Epic Games service logic into a unified, high-speed API layer. All game assets are mirrored to our globally distributed CDN for near-zero latency.
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
               <div style={{background: '#fff', border: '1px solid #F3F4F6', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)'}}>
                  <div style={{width: '40px', height: '40px', background: 'rgba(217, 119, 87, 0.05)', color: '#D97757', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                    <Braces size={20} />
                  </div>
                  <h3 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px'}}>Unified JSON Output</h3>
                  <p style={{fontSize: '0.9rem', color: '#6B7280', margin: 0, lineHeight: 1.6}}>Our fuser engine normalizes data from Fortnite-API and Epic Games into a consistent, predictable schema.</p>
               </div>
               <div style={{background: '#fff', border: '1px solid #F3F4F6', padding: '32px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)'}}>
                  <div style={{width: '40px', height: '40px', background: 'rgba(217, 119, 87, 0.05)', color: '#D97757', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                    <Cpu size={20} />
                  </div>
                  <h3 style={{fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px'}}>High-Speed Processing</h3>
                  <p style={{fontSize: '0.9rem', color: '#6B7280', margin: 0, lineHeight: 1.6}}>Replay binary parsing is offloaded to a dedicated edge engine, returning full telemetry results in seconds.</p>
               </div>
            </div>
         </section>

         <section id="auth" style={{paddingTop: '100px', marginBottom: '100px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px', color: '#111827', display: 'flex', alignItems: 'center', gap: '16px'}}>
               <Lock size={32} /> Authentication
            </h2>
            <p style={{fontSize: '1rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '40px'}}>
               All requests must include your API key in the <code>Authorization</code> header using the <code>Bearer</code> scheme. You can generate keys in your Account Settings.
            </p>
            
            <div style={{background: '#111827', color: '#fff', padding: '32px', borderRadius: '24px', position: 'relative', marginBottom: '64px', border: '1px solid #1F2937'}}>
               <div style={{fontSize: '0.7rem', fontWeight: 900, color: '#9CA3AF', marginBottom: '12px', letterSpacing: '0.1em'}}>CURL EXAMPLE</div>
               <div style={{fontFamily: 'JetBrains Mono', fontSize: '0.95rem', lineHeight: 1.6}}>
                  curl -X GET https://api.pathgen.dev/v1/health \<br/>
                  &nbsp;&nbsp;-H &quot;Authorization: Bearer rs_your_key_here&quot;
               </div>
               <div style={{position: 'absolute', top: '32px', right: '32px'}}>
                  <CopyButton text={`curl -X GET https://api.pathgen.dev/v1/health -H "Authorization: Bearer rs_your_key_here"`} color="#9CA3AF" />
               </div>
            </div>

            <div style={{borderRadius: '24px', border: '1px solid #F3F4F6', overflow: 'hidden', background: '#fff'}}>
               <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                     <tr style={{background: '#F9FAFB', borderBottom: '1px solid #F3F4F6', textAlign: 'left'}}>
                        <th style={{padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700}}>Feature Package</th>
                        <th style={{padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700}}>Free Tier</th>
                        <th style={{padding: '20px 24px', fontSize: '0.85rem', fontWeight: 700}}>Pro Tier</th>
                     </tr>
                  </thead>
                  <tbody>
                     {[
                        { f: 'Replay Data & Discovery', free: 'Included', pro: 'Included' },
                        { f: 'Refill Credit Pricing', free: 'Standard Rate', pro: '25% Discount' },
                        { f: 'Gemini AI Intelligence', free: 'N/A', pro: 'Full Access' },
                        { f: 'Rate Limit (Burst)', free: '60 req/min', pro: '2,000 req/min' },
                        { f: 'Webhooks & Automation', free: 'N/A', pro: 'Unlimited' }
                     ].map((row, i) => (
                        <tr key={i} style={{borderBottom: '1px solid #F9FAFB'}}>
                           <td style={{padding: '18px 24px', fontSize: '0.9rem', fontWeight: 600, color: '#374151'}}>{row.f}</td>
                           <td style={{padding: '18px 24px', fontSize: '0.9rem', color: '#6B7280'}}>{row.free}</td>
                           <td style={{padding: '18px 24px', fontSize: '0.9rem', fontWeight: 700, color: '#D97757'}}>{row.pro}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </section>

         {/* DYNAMIC SECTIONS FOR ALL 50+ ENDPOINTS */}
         {ENDPOINTS_DATA.map((section, sIdx) => (
            <section key={sIdx} id={`section-${sIdx}`} style={{paddingTop: '100px', marginBottom: '100px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
               <div style={{marginBottom: '40px'}}>
                  <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px', color: '#111827'}}>{section.title}</h2>
                  <p style={{fontSize: '1rem', color: '#6B7280'}}>Functional endpoints for {section.title.split('. ')[1].toLowerCase()}.</p>
               </div>

               <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
                  {section.endpoints.map((ep, eIdx) => (
                     <div key={eIdx} style={{background: '#fff', border: '1.5px solid #F3F4F6', borderRadius: '24px', overflow: 'hidden'}}>
                        {/* Summary Header */}
                        <div style={{padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderBottom: '1px solid #F3F4F6'}}>
                           <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                              <span style={{
                                 fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: '0.75rem', padding: '6px 10px', borderRadius: '8px',
                                 background: ep.method === 'GET' ? 'rgba(16, 185, 129, 0.05)' : ep.method === 'POST' ? 'rgba(37, 99, 235, 0.05)' : 'rgba(220, 38, 38, 0.05)',
                                 color: ep.method === 'GET' ? '#10B981' : ep.method === 'POST' ? '#2563EB' : '#DC2626'
                              }}>{ep.method}</span>
                              <code style={{fontSize: '1rem', fontWeight: 700, color: '#111827', background: 'transparent', padding: 0}}>{ep.path}</code>
                           </div>
                           <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              {ep.tier === 'pro' && (
                                <span style={{fontSize: '0.65rem', fontWeight: 900, background: 'rgba(217, 119, 87, 0.05)', color: '#D97757', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(217, 119, 87, 0.1)'}}>PRO</span>
                              )}
                              {ep.credits && (
                                <span style={{fontSize: '0.75rem', fontWeight: 700, color: '#9CA3AF', fontFamily: 'JetBrains Mono'}}>{ep.credits} Credits</span>
                              )}
                           </div>
                        </div>

                        {/* Details Body */}
                        <div style={{padding: '32px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px'}}>
                           <div>
                              <div style={{fontSize: '0.65rem', fontWeight: 900, color: '#9CA3AF', marginBottom: '12px', letterSpacing: '0.1em'}}>DESCRIPTION</div>
                              <p style={{fontSize: '0.95rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px'}}>{ep.description}</p>
                              
                              {ep.parameters && ep.parameters.length > 0 && (
                                <>
                                  <div style={{fontSize: '0.65rem', fontWeight: 900, color: '#9CA3AF', marginBottom: '16px', letterSpacing: '0.1em'}}>PARAMETERS</div>
                                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                     {ep.parameters.map((p, pIdx) => (
                                        <div key={pIdx} style={{display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #F9FAFB'}}>
                                           <div style={{display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '100px'}}>
                                              <code style={{fontSize: '0.8rem', fontWeight: 700, color: '#111827', background: 'transparent', padding: 0}}>{p.name}</code>
                                              <span style={{fontSize: '0.65rem', fontWeight: 600, color: p.required ? '#EF4444' : '#9CA3AF'}}>{p.required ? 'REQUIRED' : 'OPTIONAL'}</span>
                                           </div>
                                           <p style={{fontSize: '0.85rem', color: '#6B7280', margin: 0, lineHeight: 1.5}}>{p.description}</p>
                                        </div>
                                     ))}
                                  </div>
                                </>
                              )}
                           </div>

                           <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                              <div style={{fontSize: '0.65rem', fontWeight: 900, color: '#9CA3AF', letterSpacing: '0.1em'}}>RESPONSE JSON</div>
                              <div style={{background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '16px', padding: '24px', position: 'relative'}}>
                                 <pre style={{margin: 0, background: 'transparent', color: '#374151', fontSize: '0.85rem', padding: 0, whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono'}}>
                                    {(() => {
                                      try {
                                        const parsed = JSON.parse(ep.response || '{}');
                                        return JSON.stringify(parsed, null, 2);
                                      } catch (e) {
                                        return ep.response || '{}';
                                      }
                                    })()}
                                 </pre>
                                 <div style={{position: 'absolute', top: '16px', right: '16px'}}>
                                    <CopyButton text={ep.response || ''} color="#9CA3AF" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         ))}

         {/* GOVERNANCE */}
         <section id="governance" style={{paddingTop: '100px', marginBottom: '120px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px', color: '#111827', display: 'flex', alignItems: 'center', gap: '16px'}}>
               <AlertTriangle size={32} /> Error Handling
            </h2>
            <p style={{fontSize: '1rem', color: '#4B5563', lineHeight: 1.7, marginBottom: '32px'}}>
               PathGen uses standard HTTP status codes. All errors return a JSON object containing an <code>error</code> type and a descriptive <code>message</code>.
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
               {[
                  { code: '401 Unauthorized', msg: 'Missing or invalid API key.' },
                  { code: '402 Payment Required', msg: 'Zero credit balance.' },
                  { code: '403 Forbidden', msg: 'Tier mismatch or Direct IP access detected.' },
                  { code: '429 Rate Limit', msg: 'Burst threshold exceeded.' }
               ].map((err, i) => (
                  <div key={i} style={{padding: '24px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '20px'}}>
                     <div style={{fontSize: '1.1rem', fontWeight: 700, color: '#991B1B', marginBottom: '4px'}}>{err.code}</div>
                     <p style={{fontSize: '0.9rem', color: '#B91C1C', margin: 0}}>{err.msg}</p>
                  </div>
               ))}
            </div>
         </section>
      </div>
    </div>
  );
}
