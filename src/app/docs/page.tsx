"use client"
import { useState, useEffect, useRef } from 'react';
import { Shield, CreditCard, Box, Terminal, AlertTriangle, Clock, History, Package } from 'lucide-react';
import { ENDPOINTS_DATA } from '@/data/endpoints';
import CopyButton from '@/components/CopyButton';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // The scrollable container is the .content-area div
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
      section: "PLATFORM", 
      items: [
        { id: 'overview', title: 'Overview', icon: <Box size={18} /> },
        { id: 'auth', title: 'Authentication', icon: <Shield size={18} /> },
        { id: 'credits', title: 'Credits & Billing', icon: <CreditCard size={18} /> }
      ]
    },
    { 
      section: "API REFERENCE", 
      items: [
        { id: 'reference', title: 'Full API Reference', icon: <Terminal size={18} /> },
        { id: 'schema', title: 'Response Schema', icon: <Package size={18} /> },
        { id: 'errors', title: 'Error Codes', icon: <AlertTriangle size={18} /> },
        { id: 'limits', title: 'Rate Limits', icon: <Clock size={18} /> },
        { id: 'versions', title: 'Game Versions', icon: <History size={18} /> }
      ]
    }
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
      
      {/* Anchor Navigation */}
      <div style={{width: '240px', position: 'sticky', top: '48px', height: 'fit-content'}}>
         <h4 style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px'}}>DOCUMENTATION</h4>
         <nav style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
            {groups.map((group) => (
              <div key={group.section}>
                <div style={{fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', marginBottom: '12px'}}>{group.section}</div>
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
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        color: activeSection === item.id ? '#000' : '#6B7280',
                        background: activeSection === item.id ? '#F3F4F6' : 'transparent',
                        fontWeight: activeSection === item.id ? 600 : 500,
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      {item.icon}
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
         </nav>
      </div>

      {/* Main Content Area */}
      <div style={{flex: 1, maxWidth: '900px'}}>
         
         <section id="overview" style={{paddingTop: '0', marginBottom: '80px', scrollMarginTop: '48px'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '24px'}}>Documentation Overview</h1>
            <p style={{fontSize: '1.25rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Welcome to the Pathgen API. Our high-fidelity replay processing engine and game world data API allow you to build next-generation Fortnite tools and integrations.
            </p>
            <div className="card" style={{background: '#F3F4F6', border: 'none', padding: '32px'}}>
               <h3 style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px'}}>Read This First</h3>
               <p style={{fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.6}}>
                  All requests must use HTTPS and include a valid API key in the <code>Authorization</code> header (except for Free Endpoints). 
                  Our API is REST-compliant and returns JSON for all responses and errors.
               </p>
            </div>
         </section>

         <section id="auth" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Authentication</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px'}}>
               API keys are used to authenticate requests. You can manage your keys in the <a href="/keys" style={{color: '#000', fontWeight: 600}}>API Keys</a> dashboard.
            </p>
            <div style={{position: 'relative'}}>
              <pre style={{width: '100%', background: '#000', color: '#fff', padding: '24px', borderRadius: '16px', fontSize: '0.95rem', fontFamily: 'JetBrains Mono', border: '1px solid #1f1f1f'}}>
                 Authorization: Bearer rs_your_api_key_here
              </pre>
              <div style={{position: 'absolute', top: '16px', right: '16px'}}>
                 <CopyButton text="Authorization: Bearer rs_your_api_key_here" color="#6B7280" />
              </div>
            </div>
            <div style={{marginTop: '32px', display: 'flex', gap: '16px', padding: '20px', borderRadius: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB'}}>
               <Shield size={20} color="#000" />
               <p style={{fontSize: '0.9rem', color: '#4B5563'}}>
                  <strong>Security Best Practice:</strong> We recommend rotating your keys every 90 days. Keep your keys secret—stolen keys can drain your credit balance.
               </p>
            </div>
         </section>

         <section id="credits" style={{paddingTop: '80px', marginBottom: '120px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Credits & Billing</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Pathgen operates on a credit-based model. Some endpoints are free, while others consume credits based on processing complexity.
            </p>
            <div className="card" style={{padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB'}}>
               <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                     <tr style={{background: '#F9FAFB'}}>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>ENDPOINT TYPE</th>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>COST</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px'}}>Free Data & Lookup</td>
                        <td style={{padding: '16px 24px', fontWeight: 700, color: '#10B981'}}>FREE</td>
                     </tr>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px'}}>Replay Summaries</td>
                        <td style={{padding: '16px 24px', fontWeight: 700}}>5-10 Credits</td>
                     </tr>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px'}}>Full Analysis & Exclusive Data</td>
                        <td style={{padding: '16px 24px', fontWeight: 700}}>20-50 Credits</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>

         <section id="reference" style={{paddingTop: '80px', marginBottom: '120px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Full API Reference</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '48px'}}>
               Exhaustive reference for every available endpoint. Includes methods, costs, and response shapes.
            </p>

            {ENDPOINTS_DATA.map((section, sIdx) => (
              <div key={sIdx} style={{marginBottom: '64px'}}>
                 <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px'}}>{section.title}</h3>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                   {section.endpoints.map((ep, eIdx) => (
                      <div key={eIdx} className="card" style={{padding: '32px', border: '1px solid #E5E7EB', borderRadius: '24px'}}>
                         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                            <span style={{
                               padding: '4px 10px', 
                               borderRadius: '6px', 
                               background: '#F3F4F6', 
                               color: '#000', 
                               fontSize: '0.75rem', 
                               fontWeight: 800
                            }}>{ep.method}</span>
                            <span style={{fontFamily: 'JetBrains Mono', fontSize: '1rem', fontWeight: 600, color: '#111827'}}>{ep.path}</span>
                            {ep.credits && (
                              <span style={{marginLeft: 'auto', background: '#000', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700}}>
                                 {ep.credits} Credits
                              </span>
                            )}
                         </div>
                         <p style={{fontSize: '0.95rem', color: '#4B5563', marginBottom: '20px', lineHeight: 1.5}}>{ep.description}</p>
                         
                         <div style={{background: '#000', borderRadius: '16px', padding: '24px', border: '1px solid #1f1f1f', overflowX: 'auto', position: 'relative'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                               <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase'}}>Response Example</div>
                               <CopyButton text={ep.response || ''} size={14} color="#6B7280" />
                            </div>
                            <pre style={{margin: 0, fontSize: '0.85rem', color: '#fff', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono', background: 'transparent', padding: 0, opacity: 0.9}}>
                               {ep.response}
                            </pre>
                         </div>
                      </div>
                   ))}
                 </div>
              </div>
            ))}
         </section>

         <section id="schema" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Response Schema</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               A full replay parse returns the following core structure.
            </p>
            <div style={{background: '#000', color: '#fff', padding: '32px', borderRadius: '24px', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', overflowX: 'auto', border: '1px solid #1f1f1f', opacity: 0.9, position: 'relative'}}>
               <div style={{position: 'absolute', top: '24px', right: '24px'}}>
                  <CopyButton text={`{
  "match_id": "string",
  "version": "string",
  "data": {
    "overview": { ... },
    "combat_log": [ ... ],
    "player_path": [ { x, y, z, t }, ... ]
  }
}`} color="#6B7280" />
               </div>
               <pre style={{margin: 0}}>{`{
  "match_id": "string",
  "version": "string",
  "data": {
    "overview": { ... },
    "combat_log": [ ... ],
    "player_path": [ { x, y, z, t }, ... ]
  }
}`}</pre>
            </div>
         </section>

         <section id="errors" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Error Codes</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Common error codes returned by the API.
            </p>
            <div className="card" style={{padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB'}}>
               <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                     <tr style={{background: '#F9FAFB'}}>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>CODE</th>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>STATUS</th>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>REASON</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px', fontWeight: 700}}>INVALID_KEY</td>
                        <td style={{padding: '16px 24px'}}>401</td>
                        <td style={{padding: '16px 24px', color: '#6B7280'}}>API key is missing or invalid.</td>
                     </tr>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px', fontWeight: 700}}>INSUFFICIENT_CREDITS</td>
                        <td style={{padding: '16px 24px'}}>402</td>
                        <td style={{padding: '16px 24px', color: '#6B7280'}}>Account balance is below the required amount.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>

         <section id="limits" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Rate Limits</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px'}}>
               <div style={{flex: 1, padding: '24px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB'}}>
                  <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px'}}>FREE TIER</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 800}}>60 / min</div>
               </div>
               <div style={{flex: 1, padding: '24px', background: '#F4F4F5', borderRadius: '16px', border: '1px solid #E5E7EB'}}>
                  <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px'}}>PAID TIER</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 800}}>2,000 / min</div>
               </div>
            </div>
         </section>

         <section id="versions" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Game Versions</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px'}}>
               We currently support all replays generated in <strong>Fortnite Chapter 7 Season 2</strong>.
            </p>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px'}}>
               <History size={20} color="#000" />
               <span style={{fontSize: '0.9rem', color: '#000', fontWeight: 500}}>Backwards compatibility for Chapter 4-6 is currently in beta.</span>
            </div>
         </section>

      </div>
    </div>
  );
}
