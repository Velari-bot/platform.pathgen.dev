"use client"
import { useState, useEffect } from 'react';
import { ENDPOINTS_DATA, Endpoint } from '@/data/endpoints';
import { Play, Search, Coins } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export default function ApiExplorer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS_DATA[0].endpoints[0]);
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');
  const [response, setResponse] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('rs_vgyqz2jwi203htfpug');
  const [params, setParams] = useState<{name: string, value: string}[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [body, setBody] = useState<string>('{\n  "raw": "json"\n}');

  // Update params when endpoint changes
  useEffect(() => {
    setResponse(null);
    setSelectedFile(null);
    if (selectedEndpoint.parameters) {
      setParams(selectedEndpoint.parameters.map(p => ({ name: p.name, value: '' })));
    } else {
      setParams([]);
    }
  }, [selectedEndpoint]);

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    setStatus(null);
    try {
      let finalPath = selectedEndpoint.path;
      
      // Handle Path Parameters {param}
      const queryParams = new URLSearchParams();
      params.forEach((p) => {
          if (p.value && p.name) {
              const placeholder = `{${p.name}}`;
              if (finalPath.includes(placeholder)) {
                  finalPath = finalPath.replace(placeholder, p.value);
              } else {
                  queryParams.append(p.name, p.value);
              }
          }
      });
      
      const queryString = queryParams.toString();
      const baseUrl = "https://api.pathgen.dev";
      const url = `${baseUrl}${finalPath}${queryString ? `?${queryString}` : ''}`;
      
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      };
      
      const isReplay = selectedEndpoint.path.startsWith('/v1/replay');
      const isPost = selectedEndpoint.method === 'POST' || selectedEndpoint.method === 'PUT';

      if (isPost) {
          if (isReplay && selectedFile) {
              const formData = new FormData();
              formData.append('replay', selectedFile);
              options.body = formData;
              // Headers: Fetch handles multipart boundary automatically when body is FormData
          } else {
              (options.headers as Record<string, string>)['Content-Type'] = 'application/json';
              try {
                options.body = JSON.stringify(JSON.parse(body));
              } catch (e) {
                options.body = body; // Fallback to raw string if not valid JSON
              }
          }
      }

      const res = await fetch(url, options);
      setStatus(res.status);
      
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
          const data = await res.json();
          setResponse(JSON.stringify(data, null, 2));
      } else {
          const text = await res.text();
          setResponse(text);
      }
    } catch (err) {
      setStatus(500);
      setResponse(JSON.stringify({ error: true, message: (err as Error).message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="api-playground-container" style={{display: 'flex', height: 'calc(100vh - 180px)', background: 'white', borderRadius: '32px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)'}}>
      
      {/* Explorer Sidebar */}
      <div className="explorer-sidebar" style={{width: '320px', borderRight: '1px solid #F3F4F6', background: '#FDFDFF', display: 'flex', flexDirection: 'column'}}>
         <div style={{padding: '24px', borderBottom: '1px solid #F3F4F6'}}>
            <div style={{position: 'relative'}}>
               <Search size={14} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF'}} />
               <input 
                 type="text" 
                 placeholder="Search fused endpoints..." 
                 style={{width: '100%', padding: '10px 12px 10px 36px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.85rem', background: 'white', transition: 'all 0.2s'}}
               />
            </div>
         </div>
         <div style={{flex: 1, overflowY: 'auto', padding: '12px', background: '#FAFAFB'}}>
            {ENDPOINTS_DATA.map((section, sIdx) => (
              <div key={sIdx} style={{marginBottom: '24px'}}>
                 <div style={{fontSize: '0.65rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 16px 12px 16px', display: 'flex', justifyContent: 'space-between'}}>
                    {section.title}
                 </div>
                 {section.endpoints.map((ep, eIdx) => (
                   <div 
                     key={eIdx} 
                     onClick={() => !isLoading && setSelectedEndpoint(ep)}
                     style={{
                       padding: '10px 16px', 
                       borderRadius: '12px', 
                       fontSize: '0.85rem', 
                       cursor: isLoading ? 'not-allowed' : 'pointer',
                       background: selectedEndpoint.path === ep.path ? 'white' : 'transparent',
                       boxShadow: selectedEndpoint.path === ep.path ? '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)' : 'none',
                       border: selectedEndpoint.path === ep.path ? '1px solid #E5E7EB' : '1px solid transparent',
                       color: selectedEndpoint.path === ep.path ? '#000' : '#4B5563',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '12px',
                       marginBottom: '4px',
                       transition: 'all 0.2s ease'
                     }}
                   >
                      <span style={{
                         fontSize: '0.6rem', 
                         padding: '4px 8px', 
                         borderRadius: '6px',
                         fontWeight: 800,
                         minWidth: '40px', 
                         textAlign: 'center', 
                         background: ep.method === 'GET' ? '#F0FDF4' : ep.method === 'POST' ? '#EFF6FF' : ep.method === 'DELETE' ? '#FEF2F2' : '#F9FAFB',
                         color: ep.method === 'GET' ? '#16A34A' : ep.method === 'POST' ? '#3B82F6' : ep.method === 'DELETE' ? '#DC2626' : '#6B7280'
                      }}>{ep.status === 'beta' ? 'BETA' : ep.method}</span>
                      
                      <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, fontWeight: selectedEndpoint.path === ep.path ? 600 : 400}}>{ep.path}</span>
                      
                      <div style={{display: 'flex', gap: '4px'}}>
                        {ep.tier === 'pro' && (
                            <span style={{fontSize: '0.6rem', fontWeight: 900, color: '#8B5CF6', background: '#F5F3FF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #DDD6FE'}}>PRO</span>
                        )}
                        {(typeof ep.credits === 'number' && ep.credits > 0) ? (
                            <span style={{fontSize: '0.6rem', fontWeight: 600, color: '#6366F1', background: '#EEF2FF', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E0E7FF', display: 'flex', alignItems: 'center', gap: '3px'}}>
                              <Coins size={10} strokeWidth={3} />
                              {ep.credits}
                            </span>
                        ) : (
                          ep.tier === 'free' && (
                            <span style={{fontSize: '0.6rem', fontWeight: 900, color: '#16A34A', background: '#F0FDF4', padding: '2px 6px', borderRadius: '4px', border: '1px solid #DCFCE7'}}>FREE</span>
                          )
                        )}
                      </div>
                   </div>
                 ))}
              </div>
            ))}
         </div>
      </div>

      {/* Main Playground Content */}
      <div className="explorer-main" style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white'}}>
         {/* Method & URL Bar */}
         <div style={{padding: '32px', borderBottom: '1px solid #F3F4F6', background: 'white'}}>
            <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
               <div style={{display: 'flex', flex: 1, borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#F9FAFB', height: '52px'}}>
                  <div style={{padding: '0 24px', background: 'white', borderRight: '1px solid #E5E7EB', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', color: '#111827'}}>
                     {selectedEndpoint.method}
                  </div>
                  <div style={{padding: '0 24px', flex: 1, color: '#4B5563', fontSize: '0.9rem', fontFamily: 'JetBrains Mono', display: 'flex', alignItems: 'center', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                     https://api.pathgen.dev{selectedEndpoint.path}
                  </div>
               </div>
               <button 
                 onClick={handleSend}
                 disabled={isLoading}
                 style={{
                   height: '52px',
                   padding: '0 36px', 
                   background: isLoading ? '#93C5FD' : '#2563EB', 
                   color: 'white', 
                   borderRadius: '16px', 
                   fontWeight: 700, 
                   fontSize: '0.95rem',
                   border: 'none', 
                   cursor: isLoading ? 'not-allowed' : 'pointer',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '12px',
                   transition: 'all 0.2s',
                   boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)'
                 }}
                 onMouseEnter={(e) => !isLoading && (e.currentTarget.style.background = '#1D4ED8')}
                 onMouseLeave={(e) => !isLoading && (e.currentTarget.style.background = '#2563EB')}
               >
                 {isLoading ? 'Processing...' : 'Run Request'}
                 {!isLoading && <Play size={16} fill="white" />}
               </button>
            </div>
            
            {selectedEndpoint.status === 'beta' && (
               <div style={{marginTop: '20px', padding: '12px 20px', borderRadius: '12px', border: '1px solid #FDE68A', background: '#FFFBEB', display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#D97706', animation: 'pulse 2s infinite'}} />
                  <span style={{fontSize: '0.8rem', color: '#92400E', fontWeight: 600}}>
                    This is a <strong>Closed Beta</strong> endpoint. Ensure your key has <code>betaAccess: true</code> or you will receive a 403.
                  </span>
               </div>
            )}
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
                     cursor: (isLoading || selectedEndpoint.status === 'coming-soon') ? 'not-allowed' : 'pointer',
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
                    {selectedEndpoint.path.startsWith('/v1/replay') ? (
                       <div style={{padding: '40px', textAlign: 'center', background: '#F9FAFB', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                          <div style={{fontSize: '0.9rem', color: '#111827', fontWeight: 700, marginBottom: '12px'}}>Upload Replay File</div>
                          <p style={{fontSize: '0.8rem', color: '#6B7280', marginBottom: '24px', maxWidth: '240px'}}>Select a .replay file to parse using the PathGen infrastructure.</p>
                          <input 
                            type="file" 
                            accept=".replay"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            style={{fontSize: '0.8rem', color: '#111827'}}
                          />
                          {selectedFile && (
                             <div style={{marginTop: '16px', fontSize: '0.75rem', color: '#10B981', fontWeight: 600}}>
                                Selected: {selectedFile.name}
                             </div>
                          )}
                       </div>
                    ) : (
                       <textarea 
                         placeholder='{ "raw": "json" }'
                         value={body}
                         onChange={(e) => setBody(e.target.value)}
                         style={{width: '100%', height: '100%', padding: '20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', border: 'none', background: '#F9FAFB', resize: 'none', outline: 'none'}}
                       />
                    )}
                 </div>
               )}
            </div>
         </div>

         {/* Response Section */}
         <div style={{height: '45%', borderTop: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', background: '#FAFAFB'}}>
            <div style={{padding: '16px 32px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{fontSize: '0.7rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em'}}>
                    {response ? 'Live Output' : 'Schema Preview'}
                  </div>
                  {response && <CopyButton text={response} size={14} />}
               </div>
               {status && (
                 <div style={{
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    color: status >= 200 && status < 300 ? '#059669' : '#DC2626', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: status >= 200 && status < 300 ? '#ECFDF5' : '#FEF2F2'
                 }}>
                   <div style={{
                      width: '8px', 
                      height: '8px', 
                      background: status >= 200 && status < 300 ? '#10B981' : '#EF4444', 
                      borderRadius: '50%',
                      boxShadow: status >= 200 && status < 300 ? '0 0 8px #10B981' : 'none'
                   }}></div>
                   HTTP {status} {status === 200 ? 'OK' : ''}
                 </div>
               )}
            </div>
            <div className="custom-scrollbar" style={{flex: 1, overflowY: 'auto', padding: '32px', background: '#0D0D12'}}>
               <pre style={{margin: 0, padding: 0, background: 'transparent', color: response ? '#A5F3FC' : '#6B7280', fontSize: '0.9rem', fontFamily: 'JetBrains Mono', lineHeight: 1.6}}>
                  {(() => {
                    const raw = response || selectedEndpoint.response || '';
                    if (!raw) return '// No output available';
                    try {
                      return JSON.stringify(JSON.parse(raw), null, 2);
                    } catch (e) {
                      return raw; // Return raw text if not valid JSON (e.g. metrics, robots.txt)
                    }
                  })()}
               </pre>
            </div>
         </div>
      </div>
    </div>
  );
}
