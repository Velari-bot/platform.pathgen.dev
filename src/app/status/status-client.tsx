"use client"
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle, Activity, ChevronDown, ChevronUp, Database, Zap, HardDrive, Cpu, Cloud, Globe } from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  status: 'resolved' | 'investigating' | 'identified' | 'monitoring';
  severity: 'minor' | 'major' | 'critical';
  components_affected: string[];
  started_at: string;
  resolved_at: string | null;
  duration_minutes: number | null;
  updates: { timestamp: string; message: string }[];
}

interface ComponentStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down' | 'loading';
  uptime?: string;
  latency?: string | number;
  details?: any;
}

export default function StatusClient() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
  const [overallStatus, setOverallStatus] = useState<{label: string, color: string, icon: any}>({
    label: 'Checking...',
    color: '#6B7280',
    icon: Clock
  });

  const [components, setComponents] = useState<Record<string, ComponentStatus>>({
    'platform': { name: 'platform.pathgen.dev', status: 'loading' },
    'api': { name: 'api.pathgen.dev', status: 'loading' },
    'parser': { name: 'Replay Parser', status: 'loading' },
    'database': { name: 'Database (Firestore)', status: 'loading' },
    'storage': { name: 'Storage (Cloudflare R2)', status: 'loading' },
    'aes': { name: 'AES Key Service', status: 'loading' },
    'cdn': { name: 'Epic CDN (Server Replays)', status: 'loading' },
    'vertex': { name: 'AI Endpoints (Vertex AI)', status: 'loading' },
  });

  const getStatus = (status: string, extra?: boolean) => {
    if (status === 'ok') return extra ? 'degraded' : 'operational';
    if (status === 'unhealthy' || status === 'down') return 'down';
    return 'down';
  };

  const fetchAndSetStatus = useCallback(async () => {
    const API_BASE = 'https://api.pathgen.dev';
    
    try {
      const [apiAlive, apiDetailed, parserHealth, dbHealth, platformAlive, incidentsRes] = await Promise.allSettled([
        fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) }),
        fetch(`${API_BASE}/health/detailed`, { signal: AbortSignal.timeout(8000) }),
        fetch(`${API_BASE}/health/parser`, { signal: AbortSignal.timeout(8000) }),
        fetch(`${API_BASE}/health/db`, { signal: AbortSignal.timeout(5000) }),
        fetch('/api/health', { signal: AbortSignal.timeout(3000) }),
        fetch('/api/v1/status/incidents', { signal: AbortSignal.timeout(5000) })
      ]);

      const newComponents: Record<string, ComponentStatus> = { ...components };
      
      // Platform Check
      if (platformAlive.status === 'fulfilled' && platformAlive.value.ok) {
        newComponents.platform = { ...newComponents.platform, status: 'operational' };
      } else {
        newComponents.platform = { ...newComponents.platform, status: 'down' };
      }

      // API Core Check
      if (apiAlive.status === 'fulfilled' && apiAlive.value.ok) {
        newComponents.api = { ...newComponents.api, status: 'operational' };
      } else {
        newComponents.api = { ...newComponents.api, status: 'down' };
      }

      // Detailed Health
      if (apiDetailed.status === 'fulfilled' && apiDetailed.value.ok) {
        const data = await apiDetailed.value.json();
        const c = data.components;
        
        // Parser
        let parserStatus: any = getStatus(c.parser.status);
        if (c.parser.avg_parse_ms > 5000) parserStatus = 'degraded';
        newComponents.parser = { ...newComponents.parser, status: parserStatus, latency: c.parser.avg_parse_ms, details: { uptime: data.uptime_seconds, memory: data.memory_mb } };

        // Database
        let dbStatus: any = getStatus(c.database.status);
        if (c.database.latency_ms > 500) dbStatus = 'degraded';
        newComponents.database = { ...newComponents.database, status: dbStatus, latency: c.database.latency_ms };

        // Storage
        newComponents.storage = { ...newComponents.storage, status: getStatus(c.storage.status) };

        // AES
        let aesStatus: any = getStatus(c.aes_key.status);
        if (c.aes_key.source === 'fallback' || c.aes_key.source === 'stale_cache') aesStatus = 'degraded';
        newComponents.aes = { ...newComponents.aes, status: aesStatus, details: { version: c.aes_key.version, source: c.aes_key.source } };

        // CDN & Vertex
        newComponents.cdn = { ...newComponents.cdn, status: getStatus(c.epic_cdn.status) };
        newComponents.vertex = { ...newComponents.vertex, status: getStatus(c.vertex_ai.status) };
      } else {
        ['parser', 'database', 'storage', 'aes', 'cdn', 'vertex'].forEach(k => {
           newComponents[k] = { ...newComponents[k], status: 'down' };
        });
      }

      // Parser Specific (Error rate / Total Parses)
      if (parserHealth.status === 'fulfilled' && parserHealth.value.ok) {
        const pData = await parserHealth.value.json();
        newComponents.parser.details = { ...newComponents.parser.details, error_rate: pData.error_rate_24h, total_today: pData.total_parses_today };
      }

      setComponents(newComponents);
      setLastUpdated(new Date());

      // Incidents
      if (incidentsRes.status === 'fulfilled' && incidentsRes.value.ok) {
        const iData = await incidentsRes.value.json();
        setIncidents(iData.incidents || []);
      }

      // Overall Status Logic
      const values = Object.values(newComponents);
      if (values.some(v => v.status === 'down')) {
        setOverallStatus({ label: 'Major Outage', color: '#EF4444', icon: XCircle });
      } else if (values.some(v => v.status === 'degraded')) {
        setOverallStatus({ label: 'Degraded Performance', color: '#F59E0B', icon: AlertTriangle });
      } else if (values.every(v => v.status === 'operational')) {
        setOverallStatus({ label: 'All Systems Operational', color: '#10B981', icon: CheckCircle });
      }

    } catch (e) {
      console.error("Status polling failed:", e);
    }
  }, [components]);

  useEffect(() => {
    fetchAndSetStatus();
    const interval = setInterval(fetchAndSetStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds?: number) => {
    if (!seconds) return '—';
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'operational': return '#10B981';
      case 'degraded': return '#F59E0B';
      case 'down': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const toggleExpand = (key: string) => {
    setExpandedComponent(expandedComponent === key ? null : key);
  };

  const getComponentIcon = (key: string) => {
    switch(key) {
      case 'platform': return <Globe size={18} />;
      case 'api': return <Zap size={18} />;
      case 'parser': return <Cpu size={18} />;
      case 'database': return <Database size={18} />;
      case 'storage': return <HardDrive size={18} />;
      case 'aes': return <Zap size={18} />;
      case 'cdn': return <Cloud size={18} />;
      case 'vertex': return <Activity size={18} />;
      default: return <Activity size={18} />;
    }
  };

  return (
    <div className="fade-in" style={{paddingBottom: '160px'}}>
      
      <div className="page-header" style={{textAlign: 'center', marginBottom: '80px'}}>
        <h1 style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '24px'}}>System Health.</h1>
        <p style={{fontSize: '1.25rem', color: '#6B7280', maxWidth: '600px', marginInline: 'auto'}}>
          Real-time diagnostics and performance monitoring for all Pathgen services. 
        </p>
      </div>

      <div style={{maxWidth: '800px', marginInline: 'auto'}}>
         {/* Live Status Card */}
         <div className="card" style={{
           padding: '32px 48px', 
           border: `1px solid ${overallStatus.color}`, 
           background: overallStatus.color === '#10B981' ? '#F0FDF4' : (overallStatus.color === '#F59E0B' ? '#FFFBEB' : '#FEF2F2'), 
           color: overallStatus.color === '#10B981' ? '#065F46' : (overallStatus.color === '#F59E0B' ? '#92400E' : '#991B1B'), 
           display: 'flex', 
           alignItems: 'center', 
           gap: '20px', 
           marginBottom: '64px'
         }}>
            <overallStatus.icon size={32} />
            <div>
               <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px'}}>{overallStatus.label}</h3>
               <p style={{fontSize: '0.95rem', opacity: 0.8}}>Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>
         </div>

         <div className="card" style={{padding: '0', overflow: 'hidden', borderBottom: 'none'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
               {Object.entries(components).map(([key, s]) => (
                <div key={key} style={{borderTop: '1px solid #F3F4F6'}}>
                   <div 
                    onClick={() => toggleExpand(key)}
                    style={{
                      padding: '24px 32px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                   >
                     <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                        <div style={{color: '#9CA3AF'}}>{getComponentIcon(key)}</div>
                        <span style={{fontWeight: 600, fontSize: '1.05rem'}}>{s.name}</span>
                     </div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
                        {s.latency && (
                          <span style={{fontSize: '0.85rem', color: '#6B7280', fontWeight: 500}}>
                            {s.latency}ms
                          </span>
                        )}
                        <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: getStatusColor(s.status), fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize'}}>
                           <div style={{width: '8px', height: '8px', background: getStatusColor(s.status), borderRadius: '50%', boxShadow: s.status === 'operational' ? '0 0 10px rgba(16, 185, 129, 0.4)' : ''}}></div>
                           {s.status}
                        </div>
                        {expandedComponent === key ? <ChevronUp size={18} color="#9CA3AF" /> : <ChevronDown size={18} color="#9CA3AF" />}
                     </div>
                   </div>
                   
                   {expandedComponent === key && (
                     <div style={{padding: '0 32px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                        {s.details && Object.entries(s.details).map(([dk, dv]) => (
                          <div key={dk} style={{background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px'}}>
                            <p style={{fontSize: '0.7rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px'}}>{dk.replace(/_/g, ' ')}</p>
                            <p style={{fontSize: '0.95rem', fontWeight: 600, color: '#374151'}}>
                              {dk === 'uptime' ? formatUptime(dv as number) : (dk === 'memory' ? `${dv} MB` : String(dv))}
                            </p>
                          </div>
                        ))}
                        {!s.details && <p style={{gridColumn: 'span 2', fontSize: '0.9rem', color: '#9CA3AF', textAlign: 'center', padding: '20px 0'}}>No additional metrics available for this component.</p>}
                     </div>
                   )}
                </div>
               ))}
            </div>
         </div>

         {/* Incidents Section */}
         <div style={{marginTop: '80px', marginBottom: '40px'}}>
            <h2 style={{fontSize: '1.75rem', fontWeight: 900, marginBottom: '32px'}}>Incident History</h2>
            {incidents.length === 0 ? (
               <div style={{textAlign: 'center', padding: '64px', background: '#F9FAFB', borderRadius: '16px', border: '2px dashed #E5E7EB'}}>
                  <p style={{fontSize: '1.1rem', color: '#9CA3AF', fontWeight: 500}}>No incidents reported in the last 90 days.</p>
               </div>
            ) : (
               <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  {incidents.map(incident => (
                    <div key={incident.id} className="card" style={{padding: '32px'}}>
                       <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
                          <div>
                             <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px'}}>{incident.title}</h3>
                             <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                <span style={{
                                  padding: '4px 10px', 
                                  borderRadius: '6px', 
                                  fontSize: '0.7rem', 
                                  fontWeight: 800, 
                                  textTransform: 'uppercase',
                                  background: incident.severity === 'critical' ? '#FEE2E2' : (incident.severity === 'major' ? '#FFEDD5' : '#F3F4F6'),
                                  color: incident.severity === 'critical' ? '#991B1B' : (incident.severity === 'major' ? '#92400E' : '#4B5563')
                                }}>{incident.severity}</span>
                                <span style={{fontSize: '0.85rem', color: '#9CA3AF'}}>{new Date(incident.started_at).toLocaleDateString()}</span>
                                <span style={{
                                  fontSize: '0.85rem', 
                                  fontWeight: 700, 
                                  color: incident.status === 'resolved' ? '#10B981' : '#F59E0B'
                                }}>• {incident.status}</span>
                             </div>
                          </div>
                          {incident.duration_minutes && (
                            <div style={{textAlign: 'right'}}>
                               <p style={{fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600}}>DURATION</p>
                               <p style={{fontSize: '1rem', fontWeight: 700}}>{incident.duration_minutes}m</p>
                            </div>
                          )}
                       </div>
                       
                       <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px'}}>
                          {incident.components_affected.map(comp => (
                            <span key={comp} style={{fontSize: '0.8rem', color: '#6B7280', background: '#F3F4F6', padding: '4px 12px', borderRadius: '999px'}}>{comp}</span>
                          ))}
                       </div>

                       <div style={{display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid #F3F4F6', paddingLeft: '24px'}}>
                          {incident.updates.map((update, idx) => (
                            <div key={idx}>
                               <p style={{fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700, marginBottom: '4px'}}>{new Date(update.timestamp).toLocaleString()}</p>
                               <p style={{fontSize: '0.95rem', lineHeight: 1.6, color: '#4B5563'}}>{update.message}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
               </div>
            )}
         </div>

      </div>

      <footer style={{ 
        textAlign: 'center', 
        padding: '60px 0', 
        color: '#6B7280', 
        fontSize: '13px',
        maxWidth: '800px',
        margin: '0 auto',
        borderTop: '1px solid #F3F4F6',
        marginTop: '60px',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <p>© 2026 PathGen Platform Infrastructure</p>
          <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 600 }}>
            <a href="https://platform.pathgen.dev/home" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Console</a>
            <a href="https://platform.pathgen.dev/docs" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Documentation</a>
            <a href="https://x.com/WrenchDevelops" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>Twitter</a>
          </div>

          <a 
            href="https://x.com/WrenchDevelops" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              background: '#374151',
              color: '#F9FAFB',
              padding: '12px 24px',
              borderRadius: '999px',
              fontSize: '15px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '40px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <span style={{ opacity: 0.8, fontSize: '14px', fontWeight: 500 }}>Developed By</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: 'currentColor' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
              <span>WrenchDevelops</span>
            </div>
          </a>
        </div>
      </footer>
    </div>
  );
}
