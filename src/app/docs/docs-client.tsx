"use client"
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  Terminal, Search, Copy, ChevronRight, Check, BookOpen, 
  Code, Command, AlertTriangle, Shield, Zap, Globe, 
  Lock, Key, HelpCircle, Layers, Cpu, Database, ChevronLeft,
  Activity, Map as MapIcon, History, Info, ExternalLink
} from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { ENDPOINTS_DATA } from '@/data/endpoints';
import { ERROR_CODES, FAQ_DATA, SCHEMA_REFERENCE, CREDIT_PACKS, RATE_LIMITS } from '@/data/docs_content';
import { useAuth } from '@/lib/firebase/auth-context';

export default function DocsClient() {
  const { user } = useAuth();
  const backUrl = user ? '/home' : '/';
  
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [activeSection, setActiveSection] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPage, setCopiedPage] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: <BookOpen size={16} /> },
    { id: 'endpoints', name: 'API Reference', icon: <Terminal size={16} /> },
    { id: 'schema', name: 'Response Schema', icon: <Database size={16} /> },
    { id: 'faq', name: 'FAQ & Help', icon: <HelpCircle size={16} /> },
  ];

  const tocItems = useMemo(() => {
    if (activeCategory === 'getting-started') {
      return [
        { id: 'intro', title: 'Introduction' },
        { id: 'getting-started-core', title: 'Getting Started' },
        { id: 'error-codes', title: 'Error Codes' },
        { id: 'rate-limits', title: 'Rate Limits' }
      ];
    }
    if (activeCategory === 'endpoints') {
      return ENDPOINTS_DATA.map((s, i) => ({ id: `section-${i+1}`, title: s.title }));
    }
    if (activeCategory === 'schema') {
       return SCHEMA_REFERENCE.map(s => ({ id: `schema-${s.section}`, title: s.section.replace('_', ' ').toUpperCase() }));
    }
    if (activeCategory === 'faq') {
       return [{ id: 'faq-section', title: 'Frequently Asked Questions' }, { id: 'changelog', title: 'Changelog' }];
    }
    return [];
  }, [activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      if (sections.length === 0) return;

      // We want to find the LAST section that has its top above the 200px mark
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 200) {
          current = section.id;
        } else {
          break;
        }
      }
      
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, activeCategory, searchQuery]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div style={{ background: '#FAF9F6', minHeight: '100vh', color: '#1A1A1A', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Search Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100, background: 'rgba(250, 249, 246, 0.95)', 
        backdropFilter: 'blur(12px)', borderBottom: '1px solid #EEECE7', height: '64px',
        display: 'flex', alignItems: 'center', padding: '0 32px'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginRight: '48px'}}>
           <Link href={backUrl} style={{display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: '#6B6A68', fontSize: '0.85rem', fontWeight: 600}}>
              <ChevronLeft size={16} /> {user ? 'Dashboard' : 'Home'}
           </Link>
           <div style={{width: '1px', height: '24px', background: '#EEECE7'}} />
           <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <img src="/Pathgen Platform.png" alt="Pathgen Logo" style={{height: '24px', width: 'auto', borderRadius: '6px'}} />
              <span style={{fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em'}}>Pathgen Docs</span>
           </div>
        </div>

        <nav style={{display: 'flex', gap: '4px', flex: 1}}>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                background: activeCategory === cat.id ? 'rgba(0,0,0,0.05)' : 'transparent',
                color: activeCategory === cat.id ? '#000' : '#6B6A68',
                fontSize: '0.85rem', fontWeight: activeCategory === cat.id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
              }}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        <div style={{position: 'relative', width: '300px'}}>
           <Search size={14} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
           <input type="text" placeholder="Search API..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
             style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid #EEECE7', background: '#fff', fontSize: '0.85rem', outline: 'none' }}
           />
        </div>
      </div>

      <div style={{
        display: 'grid', 
        gridTemplateColumns: 'minmax(240px, 280px) 1fr minmax(200px, 260px)', 
        maxWidth: '1600px', 
        margin: '0 auto',
        width: '100%'
      }}>
        
        {/* Navigation Sidebar */}
        <aside style={{ position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', padding: '32px 16px', borderRight: '1px solid #EEECE7', overflowY: 'auto' }}>
           <div style={{fontSize: '11px', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: '16px', paddingLeft: '16px'}}>
              {activeCategory.toUpperCase().replace('-', ' ')}
           </div>
           <div style={{display: 'flex', flexDirection: 'column', gap: '2px'}}>
              {tocItems.map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  style={{
                    padding: '10px 16px', borderRadius: '10px', border: 'none', textAlign: 'left', fontSize: '0.9rem', cursor: 'pointer',
                    background: activeSection === item.id ? 'rgba(0,0,0,0.05)' : 'transparent',
                    color: activeSection === item.id ? '#000' : '#6B6A68', fontWeight: activeSection === item.id ? 700 : 500,
                    width: '100%', outline: 'none'
                  }}
                >
                  {item.title}
                </button>
              ))}
           </div>
        </aside>

        {/* Content Area */}
        <main style={{padding: '48px 40px 120px', minWidth: 0}}>
           
           <div className="fade-in">
              {searchQuery ? (
                <div style={{marginBottom: '64px'}}>
                   <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '32px'}}>Search Results for &quot;{searchQuery}&quot;</h2>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                      {(() => {
                        const lowQuery = searchQuery.toLowerCase();
                        const results: any[] = [];
                        
                        // Search Static Sections
                        const staticSections = [
                          { title: 'Introduction', desc: 'Overview of Pathgen API and core features.', cat: 'getting-started', id: 'intro' },
                          { title: 'Getting Started', desc: 'Base URL, Authentication, and Credits.', cat: 'getting-started', id: 'getting-started-core' },
                          { title: 'Error Codes', desc: 'Directory of platform errors and handling.', cat: 'getting-started', id: 'error-codes' },
                          { title: 'Rate Limits', desc: 'Request thresholds and tier limits.', cat: 'getting-started', id: 'rate-limits' },
                        ];
                        staticSections.forEach(s => {
                          if (s.title.toLowerCase().includes(lowQuery) || s.desc.toLowerCase().includes(lowQuery)) {
                            results.push({ type: 'Guide', title: s.title, desc: s.desc, cat: s.cat, id: s.id });
                          }
                        });

                        // Search Endpoints
                        ENDPOINTS_DATA.forEach(s => {
                          if (s.title.toLowerCase().includes(lowQuery)) {
                             results.push({ type: 'Category', title: s.title, desc: `API endpoints for ${s.title}.`, cat: 'endpoints', id: `section-${ENDPOINTS_DATA.indexOf(s)+1}` });
                          }
                          s.endpoints.forEach(ep => {
                            if (ep.path.toLowerCase().includes(lowQuery) || ep.description.toLowerCase().includes(lowQuery)) {
                              results.push({ type: 'Endpoint', title: ep.path, desc: ep.description, cat: 'endpoints', id: `section-${ENDPOINTS_DATA.indexOf(s)+1}` });
                            }
                          });
                        });

                        // Search FAQ
                        FAQ_DATA.forEach(cat => {
                          cat.items.forEach(item => {
                            if (item.q.toLowerCase().includes(lowQuery) || item.a.toLowerCase().includes(lowQuery)) {
                              results.push({ type: 'FAQ', title: item.q, desc: item.a, cat: 'faq', id: 'faq-section' });
                            }
                          });
                        });

                        // Search Schema
                        SCHEMA_REFERENCE.forEach(s => {
                          s.items.forEach(item => {
                            if (item.field.toLowerCase().includes(lowQuery) || item.desc.toLowerCase().includes(lowQuery)) {
                              results.push({ type: 'Schema', title: item.field, desc: item.desc, cat: 'schema', id: `schema-${s.section}` });
                            }
                          });
                        });

                        if (results.length === 0) return <div style={{color: '#9CA3AF', fontSize: '1.1rem'}}>No results found.</div>;

                        return results.map((r, i) => (
                          <button key={i} onClick={() => { setActiveCategory(r.cat); setSearchQuery(''); setTimeout(() => scrollToSection(r.id), 100); }}
                            style={{
                              padding: '24px', background: '#fff', border: '1px solid #EEECE7', borderRadius: '20px', textAlign: 'left', cursor: 'pointer',
                              display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', outline: 'none'
                            }}
                            className="pop-out-hover"
                          >
                             <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                <span style={{fontSize: '10px', fontWeight: 900, background: 'rgba(217,119,87,0.1)', color: '#D97757', padding: '2px 8px', borderRadius: '4px'}}>{r.type.toUpperCase()}</span>
                                <div style={{fontWeight: 800, fontSize: '1rem'}}>{r.title}</div>
                             </div>
                             <p style={{fontSize: '0.9rem', color: '#6B6A68', margin: 0, lineClamp: 2}}>{r.desc}</p>
                          </button>
                        ));
                      })()}
                   </div>
                </div>
              ) : (
                <>
              {/* Common Page Header */}
              <div style={{marginBottom: '64px'}}>
                 <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: '#9CA3AF', marginBottom: '16px'}}>
                    PATHGEN <ChevronRight size={12} /> {activeCategory.toUpperCase()}
                 </div>
                 <h1 style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.06em', marginBottom: '20px', lineHeight: 1.1}}>
                    {activeCategory === 'endpoints' ? 'API Reference' : 'Pathgen API Documentation'}
                 </h1>
                 <p style={{fontSize: '1.25rem', color: '#6B6A68', lineHeight: 1.6, maxWidth: '800px'}}>
                    Everything you need to build on top of Fortnite&apos;s data layer. High-fidelity telemetry, player intelligence, and AI-powered strategy.
                 </p>
              </div>

              {activeCategory === 'getting-started' && (
                <>
                  <section id="intro" style={{marginBottom: '100px'}}>
                    <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '24px'}}>Introduction</h2>
                    <p style={{fontSize: '1.1rem', color: '#6B6A68', lineHeight: 1.7, marginBottom: '32px'}}>
                       Pathgen is a Fortnite data API that gives developers access to replay parsing, player stats, AI coaching, tournament analytics, and game metadata through a single API key and credit system. Some endpoints are free with no key required, while professional-grade endpoints utilize credits. 
                       <Link href="/quickstart" style={{color: '#D97757', fontWeight: 600, marginLeft: '8px'}}>Jump to Quickstart &rarr;</Link>
                    </p>
                  </section>

                  <section id="getting-started-core" style={{marginBottom: '100px'}}>
                    <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '24px'}}>Getting Started</h2>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '48px'}}>
                       <div>
                          <h4 style={{fontWeight: 800, marginBottom: '12px'}}>Base URL</h4>
                          <code style={{padding: '12px 20px', display: 'block', background: '#fff', border: '1px solid #EEECE7', borderRadius: '12px', fontSize: '1rem', fontWeight: 700}}>api.pathgen.dev/v1</code>
                       </div>
                       <div>
                          <h4 style={{fontWeight: 800, marginBottom: '12px'}}>Authentication</h4>
                          <p style={{color: '#6B6A68', marginBottom: '16px'}}>Paid endpoints require an API key passed as a Bearer token in the <code>Authorization</code> header. Free public data endpoints require no key.</p>
                          <div style={{background: '#111827', color: '#fff', padding: '24px', borderRadius: '16px', fontFamily: 'JetBrains Mono', fontSize: '0.9rem'}}>
                             Authorization: Bearer rs_your_key_here
                          </div>
                          <p style={{fontSize: '0.85rem', marginTop: '12px', color: '#9CA3AF'}}>Get your key at <Link href="/keys" style={{color: '#D97757'}}>platform.pathgen.dev/keys</Link></p>
                       </div>
                       <div>
                          <h4 style={{fontWeight: 800, marginBottom: '12px'}}>Credits</h4>
                          <p style={{color: '#6B6A68', marginBottom: '24px'}}>Credits are purchased in packs. Charges only occur on successful (200 OK) responses. Failed parses or server errors are never billed.</p>
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
                             {CREDIT_PACKS.map(p => (
                               <div key={p.name} style={{padding: '24px', background: '#fff', border: '1px solid #EEECE7', borderRadius: '16px'}}>
                                  <div style={{fontSize: '0.8rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px'}}>{p.name.toUpperCase()}</div>
                                  <div style={{fontSize: '1.5rem', fontWeight: 900}}>{p.price}</div>
                                  <div style={{fontSize: '0.9rem', color: '#6B6A68', marginTop: '4px'}}>{p.credits} Credits</div>
                                </div>
                             ))}
                          </div>
                       </div>
                       <div>
                          <h4 style={{fontWeight: 800, marginBottom: '12px'}}>Request Format</h4>
                          <p style={{color: '#6B6A68', marginBottom: '16px'}}>Replay endpoints use <code>multipart/form-data</code> with the file in a field called <code>replay</code>. All other endpoints use JSON or Query Params.</p>
                       </div>
                       <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                          <div>
                            <h5 style={{fontSize: '0.75rem', fontWeight: 900, color: '#9CA3AF', marginBottom: '12px'}}>SUCCESS RESPONSE</h5>
                            <div style={{background: '#111827', padding: '20px', borderRadius: '12px', fontSize: '0.85rem', color: '#fff', fontFamily: 'JetBrains Mono'}}>
                               {`{
  "credits_used": 20,
  "credits_remaining": 1430,
  "data": { ... }
}`}
                            </div>
                          </div>
                          <div>
                            <h5 style={{fontSize: '0.75rem', fontWeight: 900, color: '#9CA3AF', marginBottom: '12px'}}>ERROR RESPONSE</h5>
                            <div style={{background: '#111827', padding: '20px', borderRadius: '12px', fontSize: '0.85rem', color: '#fff', fontFamily: 'JetBrains Mono'}}>
                               {`{
  "error": true,
  "code": "INVALID_KEY",
  "message": "The provided key is invalid."
}`}
                            </div>
                          </div>
                       </div>
                    </div>
                  </section>

                  <section id="error-codes" style={{marginBottom: '100px'}}>
                    <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '24px'}}>Error Codes</h2>
                    <div style={{background: '#fff', border: '1px solid #EEECE7', borderRadius: '24px', overflow: 'hidden'}}>
                       <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                          <thead style={{background: '#F9FAFB', borderBottom: '1px solid #EEECE7'}}>
                             <tr>
                                <th style={{padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800}}>Code</th>
                                <th style={{padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800}}>Status</th>
                                <th style={{padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800}}>Cause & Handling</th>
                             </tr>
                          </thead>
                          <tbody>
                             {ERROR_CODES.map(err => (
                               <tr key={err.code} style={{borderBottom: '1px solid #F9FAFB'}}>
                                  <td style={{padding: '16px 24px', fontWeight: 700}}><code style={{background: '#FEF2F2', color: '#991B1B', border: 'none'}}>{err.code}</code></td>
                                  <td style={{padding: '16px 24px', color: '#6B6A68'}}>{err.status}</td>
                                  <td style={{padding: '16px 24px'}}>
                                     <div style={{fontSize: '0.9rem', fontWeight: 600}}>{err.cause}</div>
                                     <div style={{fontSize: '0.8rem', color: '#9CA3AF'}}>{err.handle}</div>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </section>

                  <section id="rate-limits" style={{marginBottom: '100px'}}>
                    <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '24px'}}>Rate Limits</h2>
                    <div style={{background: '#fff', border: '1px solid #EEECE7', borderRadius: '24px', overflow: 'hidden'}}>
                       <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
                          <thead style={{background: '#F9FAFB', borderBottom: '1px solid #EEECE7'}}>
                             <tr>
                                <th style={{padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800}}>Tier / Endpoint</th>
                                <th style={{padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800}}>Limit</th>
                                <th style={{padding: '16px 24px', fontSize: '0.8rem', fontWeight: 800}}>Scope</th>
                             </tr>
                          </thead>
                          <tbody>
                             {RATE_LIMITS.map(rl => (
                               <tr key={rl.tier} style={{borderBottom: '1px solid #F9FAFB'}}>
                                  <td style={{padding: '16px 24px', fontWeight: 700}}>{rl.tier}</td>
                                  <td style={{padding: '16px 24px', fontWeight: 700, color: '#D97757'}}>{rl.limit}</td>
                                  <td style={{padding: '16px 24px', color: '#6B6A68'}}>{rl.scope}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </section>
                </>
              )}

              {activeCategory === 'endpoints' && ENDPOINTS_DATA.map((s, sIdx) => (
                <section key={s.title} id={`section-${sIdx+1}`} style={{marginBottom: '100px', scrollMarginTop: '100px'}}>
                   <div style={{marginBottom: '32px', borderBottom: '1px solid #EEECE7', paddingBottom: '24px'}}>
                      <h2 style={{fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em'}}>{s.title}</h2>
                      <p style={{fontSize: '1.1rem', color: '#6B6A68', marginTop: '8px'}}>{s.description}</p>
                   </div>
                   <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
                      {s.endpoints.map(ep => (
                <section key={`${ep.method}-${ep.path}`} id={`${ep.method}-${ep.path}`} style={{background: '#fff', border: '1px solid #EEECE7', borderRadius: '24px', overflow: 'hidden', scrollMarginTop: '100px'}}>
                            <div style={{padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F9FAFB'}}>
                               <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                                  <span style={{fontSize: '10px', fontWeight: 900, padding: '4px 8px', borderRadius: '6px', background: ep.method === 'GET' ? '#ecfdf5' : '#eff6ff', color: ep.method === 'GET' ? '#059669' : '#2563eb'}}>{ep.method}</span>
                                  <code style={{fontSize: '1rem', fontWeight: 800, color: '#000', background: 'transparent'}}>{ep.path}</code>
                               </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                   {typeof ep.credits === 'number' && ep.credits > 0 && <span style={{fontSize: '13px', fontWeight: 700, color: '#D97757', border: '1px solid rgba(217,119,87,0.2)', padding: '4px 10px', borderRadius: '8px', background: 'rgba(217,119,87,0.05)'}}>{ep.credits} Credits</span>}
                                </div>
                            </div>
                            <div style={{padding: '32px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px'}}>
                               <div>
                                  <h6 style={{fontSize: '11px', fontWeight: 900, color: '#9CA3AF', marginBottom: '12px', letterSpacing: '0.05em'}}>DESCRIPTION</h6>
                                  <p style={{fontSize: '1rem', color: '#4B5563', lineHeight: 1.6}}>{ep.description}</p>
                                  {ep.parameters && (
                                     <div style={{marginTop: '24px'}}>
                                        <h6 style={{fontSize: '11px', fontWeight: 900, color: '#9CA3AF', marginBottom: '12px', letterSpacing: '0.05em'}}>PARAMETERS</h6>
                                        {ep.parameters.map(p => (
                                          <div key={p.name} style={{display: 'flex', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #F9FAFB'}}>
                                             <div style={{minWidth: '100px'}}><code style={{fontSize: '13px', fontWeight: 800}}>{p.name}</code></div>
                                             <div style={{fontSize: '13px', color: '#6B6A68'}}>{p.description}</div>
                                          </div>
                                        ))}
                                     </div>
                                  )}
                               </div>
                               <div>
                                  <h6 style={{fontSize: '11px', fontWeight: 900, color: '#9CA3AF', marginBottom: '12px', letterSpacing: '0.05em'}}>RESPONSE PREVIEW</h6>
                                  <div style={{background: '#111827', padding: '24px', borderRadius: '16px', position: 'relative', overflowX: 'auto'}}>
                                     <pre style={{
                                       margin: 0, 
                                       padding: 0, 
                                       fontSize: '13px', 
                                       color: '#fff', 
                                       fontFamily: 'JetBrains Mono', 
                                       lineHeight: 1.5,
                                       whiteSpace: 'pre',
                                     }}>
                                        {(() => { try { return JSON.stringify(JSON.parse(ep.response || '{}'), null, 2); } catch { return ep.response; }})()}
                                     </pre>
                                  </div>
                               </div>
                            </div>
                         </section>
                      ))}
                   </div>
                </section>
              ))}

              {activeCategory === 'schema' && (
                <div style={{display: 'flex', flexDirection: 'column', gap: '80px'}}>
                   {SCHEMA_REFERENCE.map(s => (
                     <section key={s.section} id={`schema-${s.section}`} style={{scrollMarginTop: '100px'}}>
                        <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '24px', borderBottom: '1px solid #EEECE7', paddingBottom: '16px'}}>{s.section.replace('_', ' ').toUpperCase()}</h2>
                        <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                           {s.items.map(item => (
                             <div key={item.field} style={{display: 'grid', gridTemplateColumns: 'minmax(200px, 250px) 1fr', gap: '32px', padding: '20px', background: '#fff', border: '1px solid #EEECE7', borderRadius: '16px'}}>
                                <div>
                                   <code style={{fontSize: '14px', fontWeight: 800, color: '#D97757'}}>{item.field}</code>
                                   <div style={{fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginTop: '4px'}}>{item.type.toUpperCase()}</div>
                                </div>
                                <div style={{fontSize: '14px', color: '#6B6A68', lineHeight: 1.5}}>
                                   {item.desc}
                                   <div style={{marginTop: '8px', fontSize: '12px', fontFamily: 'JetBrains Mono'}}>Example: <span style={{color: '#000'}}>{item.example}</span></div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>
                   ))}
                </div>
              )}

              {activeCategory === 'faq' && (
                <>
                  <section id="faq-section" style={{marginBottom: '100px', scrollMarginTop: '100px'}}>
                    <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '40px'}}>Frequently Asked Questions</h2>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '48px'}}>
                       {FAQ_DATA.map(cat => (
                         <div key={cat.category}>
                            <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: '#D97757', marginBottom: '24px', letterSpacing: '0.02em'}}>{cat.category.toUpperCase()}</h3>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                               {cat.items.map(f => (
                                 <div key={f.q} style={{padding: '32px', background: '#fff', border: '1px solid #EEECE7', borderRadius: '24px'}}>
                                    <h4 style={{fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px'}}>{f.q}</h4>
                                    <p style={{fontSize: '1rem', color: '#6B6A68', lineHeight: 1.6}}>{f.a}</p>
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>
                  </section>
                  <section id="changelog" style={{marginBottom: '100px', scrollMarginTop: '100px'}}>
                    <h2 style={{fontSize: '2.5rem', fontWeight: 800, marginBottom: '32px'}}>Changelog</h2>
                    <div style={{background: '#fff', border: '1px solid #EEECE7', borderRadius: '24px', padding: '40px'}}>
                       <div style={{display: 'flex', gap: '24px', borderLeft: '2px solid #D97757', paddingLeft: '32px'}}>
                          <div>
                             <div style={{fontSize: '1.25rem', fontWeight: 900}}>v1.0.0</div>
                             <div style={{fontSize: '0.85rem', color: '#9CA3AF', marginBottom: '16px'}}>Released March 2024</div>
                             <ul style={{fontSize: '0.95rem', color: '#6B6A68', lineHeight: 1.8}}>
                                <li>Initial production rollout of the Pathgen Platform.</li>
                                <li>50+ endpoints across fused metadata, replay parsing, and AI intelligence.</li>
                                <li>Full Gemini 2.0 Flash integration for tactical coaching.</li>
                                <li>Support for high-fidelity replay ingestion up to 50MB.</li>
                             </ul>
                          </div>
                       </div>
                    </div>
                  </section>
                </>
              )}
                </>
              )}
            </div>
         </main>

        {/* TOC Sidebar */}
        <aside style={{ position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', padding: '32px 24px', borderLeft: '1px solid #EEECE7' }}>
           <div style={{fontSize: '12px', fontWeight: 800, color: '#000', marginBottom: '20px'}}>On this page</div>
           <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {tocItems.map(item => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  style={{
                    border: 'none', background: 'transparent', padding: '4px 0', textAlign: 'left', fontSize: '0.8rem', cursor: 'pointer', outline: 'none',
                    color: activeSection === item.id ? '#000' : '#9CA3AF', fontWeight: activeSection === item.id ? 700 : 500,
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    width: '100%', lineHeight: 1.4
                  }}
                >
                  <div style={{width: '2px', height: '14px', background: activeSection === item.id ? '#D97757' : 'transparent', marginTop: '4px', flexShrink: 0}} />
                  <span style={{ flex: 1 }}>{item.title}</span>
                </button>
              ))}
           </div>
        </aside>

      </div>
    </div>
  );
}
