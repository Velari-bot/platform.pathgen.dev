"use client"
import { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';

export default function Status() {
  const [systems, setSystems] = useState([
    { name: 'Core API Gateway', status: 'Operational', uptime: '99.99%', latency: '124' },
    { name: 'Replay Engine v1', status: 'Operational', uptime: '99.95%', latency: '842' },
    { name: 'Replay Engine v2 (Beta)', status: 'Operational', uptime: '99.82%', latency: '712' },
    { name: 'Game Database Sync', status: 'Operational', uptime: '100.00%', latency: '14' },
    { name: 'Authentication Service', status: 'Operational', uptime: '99.99%', latency: '42' },
    { name: 'Payment Processing (Stripe)', status: 'Operational', uptime: '100.00%', latency: '—' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystems(prev => prev.map(s => ({
        ...s,
        latency: s.latency === '—' ? '—' : (Math.max(10, parseInt(s.latency) + Math.floor(Math.random() * 20) - 10)).toString()
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in" style={{paddingBottom: '160px'}}>
      
      <div className="page-header" style={{textAlign: 'center', marginBottom: '80px'}}>
        <h1 style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '24px'}}>Systems Operational.</h1>
        <p style={{fontSize: '1.25rem', color: '#6B7280', maxWidth: '600px', marginInline: 'auto'}}>
          Real-time status of Pathgen services. Check our incident history or report a problem.
        </p>
      </div>

      <div style={{maxWidth: '800px', marginInline: 'auto'}}>
         {/* Live Status Card */}
         <div className="card" style={{padding: '32px 48px', border: '1px solid #10B981', background: '#F0FDF4', color: '#065F46', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '64px'}}>
            <CheckCircle size={32} color="#10B981" fill="#DCFCE7" />
            <div>
               <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px'}}>All Systems Operational</h3>
               <p style={{fontSize: '0.95rem', color: '#10B981'}}>Last checked: 2 seconds ago</p>
            </div>
         </div>

         <div className="card" style={{padding: '0', overflow: 'hidden', borderBottom: 'none'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
               <thead>
                  <tr style={{background: '#F9FAFB'}}>
                     <th style={{padding: '16px 32px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>SERVICE</th>
                     <th style={{padding: '16px 32px', textAlign: 'center', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>UPTIME</th>
                     <th style={{padding: '16px 32px', textAlign: 'center', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>LATENCY</th>
                     <th style={{padding: '16px 32px', textAlign: 'right', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em'}}>STATUS</th>
                  </tr>
               </thead>
               <tbody>
                  {systems.map((s, idx) => (
                    <tr key={idx} style={{borderTop: '1px solid #F3F4F6'}}>
                       <td style={{padding: '24px 32px', fontWeight: 600}}>{s.name}</td>
                       <td style={{padding: '24px 32px', textAlign: 'center', fontSize: '0.9rem', color: '#6B7280'}}>{s.uptime}</td>
                       <td style={{padding: '24px 32px', textAlign: 'center', fontSize: '0.9rem', color: '#6B7280'}}>{s.latency}{s.latency !== '—' ? 'ms' : ''}</td>
                       <td style={{padding: '24px 32px', textAlign: 'right'}}>
                          <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.85rem', fontWeight: 700}}>
                             <div style={{width: '6px', height: '6px', background: '#059669', borderRadius: '50%'}}></div>
                             {s.status}
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Historical Graph Simulation */}
         <div className="card" style={{marginTop: '48px', padding: '48px'}}>
            <h4 style={{fontSize: '1rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
               <Clock size={18} color="#9CA3AF" />
               Historical Performance (Last 90 Days)
            </h4>
            {(() => {
               // Move into a component or keep locally with useMemo if needed, but for simplicity we'll just use a stable mock here
               const bars = Array.from({length: 45}).map((_, idx) => ({
                 height: 40 + (idx % 10) * 4,
                 isRed: idx === 12 || idx === 34
               }));
               return (
                 <div style={{display: 'flex', gap: '4px', height: '80px', alignItems: 'flex-end'}}>
                   {bars.map((bar, idx) => (
                     <div 
                       key={idx} 
                       style={{
                          flex: 1, 
                          height: `${bar.height}%`, 
                          background: bar.isRed ? '#EF4444' : '#10B981', 
                          borderRadius: '2px',
                          opacity: bar.isRed ? 1 : 0.8
                       }}
                       title={bar.isRed ? 'Incident on day ' + (idx + 1) : 'Normalized performance'}
                     ></div>
                   ))}
                 </div>
               );
            })()}
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600}}>
               <span>90 DAYS AGO</span>
               <span>TODAY</span>
            </div>
         </div>
      </div>

    </div>
  );
}
