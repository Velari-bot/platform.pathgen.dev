"use client"
import { useState, useEffect } from 'react';
import { ENDPOINTS_DATA, Endpoint } from '@/data/endpoints';
import { Play, Search } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export default function ApiExplorer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS_DATA[0].endpoints[0]);
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('rs_vgyqz2jwi203htfpug');
  const [params, setParams] = useState<{name: string, value: string}[]>([]);

  // Update params when endpoint changes
  useEffect(() => {
    if (selectedEndpoint.parameters) {
      setParams(selectedEndpoint.parameters.map(p => ({ name: p.name, value: '' })));
    } else {
      setParams([]);
    }
  }, [selectedEndpoint]);

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    try {
      // Construct query string
      const queryParams = new URLSearchParams();
      params.forEach((p) => {
          if (p.value && p.name) queryParams.append(p.name, p.value);
      });
      
      const queryString = queryParams.toString();
      const url = `https://api.pathgen.dev${selectedEndpoint.path}${queryString ? `?${queryString}` : ''}`;
      
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      };
      
      if (selectedEndpoint.method !== 'GET') {
          options.body = JSON.stringify({ raw: "json" });
      }

      const res = await fetch(url, options);
      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(JSON.stringify({ error: true, message: (err as Error).message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="api-explorer-container" style={{display: 'flex', height: 'calc(100vh - 160px)', background: 'white', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)'}}>
      
      {/* Explorer Sidebar */}
      <div className="explorer-sidebar" style={{width: '300px', borderRight: '1px solid var(--border-color)', background: '#F9FAFB', display: 'flex', flexDirection: 'column'}}>
         <div style={{padding: '24px', borderBottom: '1px solid var(--border-color)'}}>
            <div style={{position: 'relative'}}>
               <Search size={14} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
               <input 
                 type="text" 
                 placeholder="Search endpoints..." 
                 style={{width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.85rem'}}
               />
            </div>
         </div>
         <div style={{flex: 1, overflowY: 'auto', padding: '12px'}}>
            {ENDPOINTS_DATA.map((section, sIdx) => (
              <div key={sIdx} style={{marginBottom: '20px'}}>
                 <div style={{fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 12px 8px 12px'}}>
                    {section.title}
                 </div>
                 {section.endpoints.map((ep, eIdx) => (
                   <div 
                     key={eIdx} 
                     onClick={() => {
                        setSelectedEndpoint(ep);
                        setResponse(null);
                      }}
                     style={{
                       padding: '8px 12px', 
                       borderRadius: '8px', 
                       fontSize: '0.85rem', 
                       cursor: 'pointer',
                       background: selectedEndpoint.path === ep.path ? 'white' : 'transparent',
                       boxShadow: selectedEndpoint.path === ep.path ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                       border: selectedEndpoint.path === ep.path ? '1px solid #E5E7EB' : '1px solid transparent',
                       color: selectedEndpoint.path === ep.path ? '#000' : '#6B7280',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '8px',
                       marginBottom: '2px'
                     }}
                   >
                     <span className={`method-badge method-${ep.method.toLowerCase()}`} style={{fontSize: '0.65rem', padding: '2px 4px', minWidth: '32px', textAlign: 'center', flexShrink: 0}}>{ep.method}</span>
                     <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1}}>{ep.path}</span>
                     
                     {/* Cost Tag */}
                     <span style={{
                        fontSize: '0.65rem', 
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '20px',
                        background: ep.credits ? 'rgba(0,0,0,0.05)' : 'rgba(16, 185, 129, 0.1)',
                        color: ep.credits ? 'var(--text-secondary)' : '#10B981',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                     }}>
                        {ep.credits ? `${ep.credits} Credits` : 'Free'}
                     </span>
                   </div>
                 ))}
              </div>
            ))}
         </div>
      </div>

      {/* Request Content */}
      <div className="explorer-main" style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
         {/* URL Bar */}
         <div style={{padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '12px'}}>
            <div style={{display: 'flex', flex: 1, borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB'}}>
               <div style={{padding: '12px 20px', background: '#F9FAFB', borderRight: '1px solid #E5E7EB', fontWeight: 700, fontSize: '0.9rem', color: '#111827'}}>
                  {selectedEndpoint.method}
               </div>
               <div style={{padding: '12px 20px', flex: 1, color: '#6B7280', fontSize: '0.9rem', fontFamily: 'JetBrains Mono'}}>
                  https://api.pathgen.dev{selectedEndpoint.path}
               </div>
            </div>
            <button 
              onClick={handleSend}
              disabled={isLoading}
              style={{
                padding: '0 32px', 
                background: '#2563EB', 
                color: 'white', 
                borderRadius: '12px', 
                fontWeight: 700, 
                border: 'none', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? 'Sending...' : 'Send'}
              <Play size={14} fill="currentColor" />
            </button>
         </div>

         {/* Request Tabs */}
         <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
            <div style={{padding: '0 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '32px'}}>
               {['params', 'headers', 'body'].map((tab) => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab as 'params' | 'headers' | 'body')}
                   style={{
                     padding: '16px 0',
                     background: 'none',
                     border: 'none',
                     fontSize: '0.85rem',
                     fontWeight: 600,
                     color: activeTab === tab ? '#2563EB' : '#6B7280',
                     borderBottom: activeTab === tab ? '2px solid #2563EB' : '2px solid transparent',
                     cursor: 'pointer',
                     textTransform: 'capitalize'
                   }}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div style={{flex: 1, padding: '32px', overflowY: 'auto'}}>
               {activeTab === 'params' && (
                 <div>
                    <h4 style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '16px'}}>Query Parameters</h4>
                    {params.length > 0 ? (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                         {params.map((p, idx) => (
                           <div key={idx} style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                              <input type="checkbox" checked={true} readOnly style={{accentColor: '#2563EB'}} />
                              <input 
                                type="text"
                                value={p.name}
                                onChange={(e) => {
                                    const newParams = [...params];
                                    newParams[idx].name = e.target.value;
                                    setParams(newParams);
                                }}
                                style={{flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontFamily: 'JetBrains Mono', fontSize: '0.85rem', outline: 'none'}} 
                              />
                              <input 
                                type="text"
                                placeholder={"Enter value..."}
                                value={p.value}
                                onChange={(e) => {
                                    const newParams = [...params];
                                    newParams[idx].value = e.target.value;
                                    setParams(newParams);
                                }}
                                style={{flex: 2, padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.85rem', color: '#111827', outline: 'none'}} 
                              />
                           </div>
                         ))}
                      </div>
                    ) : (
                      <div style={{color: '#9CA3AF', fontSize: '0.9rem', textAlign: 'center', padding: '40px'}}>
                        No parameters for this endpoint
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'headers' && (
                 <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                       <input type="checkbox" checked readOnly style={{accentColor: '#2563EB'}} />
                       <div style={{flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontFamily: 'JetBrains Mono', fontSize: '0.85rem'}}>
                         Authorization
                       </div>
                       <div style={{flex: 2, display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#fff'}}>
                         <span style={{fontSize: '0.85rem', color: '#6B7280'}}>Bearer</span>
                         <input 
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            style={{border: 'none', outline: 'none', flex: 1, fontSize: '0.85rem', color: '#111827'}}
                         />
                       </div>
                    </div>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                       <input type="checkbox" checked readOnly style={{accentColor: '#2563EB'}} />
                       <div style={{flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#F9FAFB', fontFamily: 'JetBrains Mono', fontSize: '0.85rem'}}>
                         Content-Type
                       </div>
                       <div style={{flex: 2, padding: '10px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.85rem', color: '#6B7280'}}>
                         application/json
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'body' && (
                 <div style={{height: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB'}}>
                    <textarea 
                      placeholder='{ "raw": "json" }'
                      style={{width: '100%', height: '200px', padding: '20px', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', border: 'none', background: '#F9FAFB', resize: 'none'}}
                    />
                 </div>
               )}
            </div>
         </div>

         {/* Response Section */}
         <div style={{height: '40%', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: '#FAFAFA'}}>
            <div style={{padding: '12px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <div style={{fontSize: '0.8rem', fontWeight: 700, color: '#9CA3AF'}}>
                    {response ? 'LIVE RESPONSE' : 'EXAMPLE RESPONSE'}
                  </div>
                  <CopyButton text={response || selectedEndpoint.response || ''} size={14} />
               </div>
               {response && <div style={{fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{width: '6px', height: '6px', background: '#059669', borderRadius: '50%'}}></div>200 OK</div>}
            </div>
            <div style={{flex: 1, overflowY: 'auto', padding: '24px 32px'}}>
               <pre style={{margin: 0, padding: 0, background: 'transparent', color: response ? '#111827' : '#6B7280', fontSize: '0.85rem', opacity: response ? 1 : 0.8}}>
                  {response || selectedEndpoint.response || '// No response example available'}
               </pre>
            </div>
         </div>
      </div>
    </div>
  );
}
