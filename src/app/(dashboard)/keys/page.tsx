"use client"
import { useState, useEffect } from 'react';
import { Plus, Search, Shield, X, LayoutDashboard, Trash2, ChevronsUpDown, Check } from 'lucide-react';
import { firestore } from '@/lib/firebase/config';
import { collection, query, where, getDocs, deleteDoc, doc, setDoc, Timestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';
import { useOrg } from '@/lib/context/OrgContext';
import CopyButton from '@/components/CopyButton';

interface KeyType {
  id: string;
  label: string;
  workspace: string;
  email: string;
  createdAt: string;
  lastUsed: string;
  scopes: string[];
  orgId: string;
  appId: string;
}

export default function Keys() {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const userEmail = user?.email || "";
  
  const [keys, setKeys] = useState<KeyType[]>([]);
  const [apps, setApps] = useState<{id: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState('personal');
  const [selectedAppId, setSelectedAppId] = useState('');
  const [isAppSelectorOpen, setIsAppSelectorOpen] = useState(false);

  // Fetch Apps
  useEffect(() => {
    if (!userEmail || !currentOrg) return;
    const fetchApps = async () => {
      if (!firestore) {
        setApps([{ id: 'mock-app', name: 'Default App' }]);
        setSelectedAppId('mock-app');
        return;
      }
      try {
        const appsQ = query(collection(firestore!, "apps"), where("orgId", "==", currentOrg.id));
        const appsSnapshot = await getDocs(appsQ);
        const fetchedApps = appsSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
        setApps(fetchedApps);
        
        // Pick app from query or default to first
        if (fetchedApps.length > 0 && !selectedAppId) {
            setSelectedAppId(fetchedApps[0].id);
        }
      } catch (e) {
        console.error("Apps fetch error:", e);
      }
    };
    fetchApps();
  }, [userEmail, currentOrg, selectedAppId]);

  // Fetch Keys (Filtered by AppId)
  useEffect(() => {
    if (!userEmail || !currentOrg || !selectedAppId) {
      setKeys([]);
      if (!selectedAppId) setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      if (!firestore) {
        setKeys([
            { id: 'rs_mock_123', label: 'Staging API', workspace: 'Default App', email: userEmail, createdAt: 'Mar 29, 2026', lastUsed: '2 hrs ago', scopes: ['Read'], orgId: 'personal', appId: 'mock-app' }
        ]);
        setIsLoading(false);
        return;
      }
      setKeys([]);
      setIsLoading(true);
      try {
        const keysQ = query(
          collection(firestore!, "api_keys"), 
          where("orgId", "==", currentOrg.id),
          where("appId", "==", selectedAppId),
          orderBy("createdAt", "desc")
        );
        const keysSnapshot = await getDocs(keysQ);
        const fetchedKeys: KeyType[] = [];
        keysSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedKeys.push({
            id: doc.id,
            label: data.label,
            workspace: data.appName || data.workspace || "Default",
            email: data.email,
            createdAt: data.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || "Unknown",
            lastUsed: data.lastUsed || "Never",
            scopes: data.scopes || ["Read"],
            orgId: data.orgId,
            appId: data.appId || ""
          });
        });
        setKeys(fetchedKeys);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail, currentOrg, selectedAppId]);


  const handleCreateKey = async () => {
    if (!firestore) return;
    if (!newKeyLabel.trim() || !selectedAppId) {
       if (!selectedAppId) alert("Please select an application first.");
       return;
    }
    
    try {
      const targetApp = apps.find(a => a.id === selectedAppId);
      const appName = targetApp ? targetApp.name : "Unknown App";
      const keyId = `rs_${Math.random().toString(36).substring(2, 11)}${Math.random().toString(36).substring(2, 11)}`;
      
      await setDoc(doc(firestore!, "api_keys", keyId), {
        label: newKeyLabel,
        appId: selectedAppId,
        appName: appName,
        orgId: currentOrg!.id,
        workspace: appName,
        email: userEmail,
        createdAt: Timestamp.now(),
        lastUsed: "Never",
        scopes: ["Read"]
      });

      const newKey: KeyType = {
        id: keyId,
        label: newKeyLabel,
        workspace: appName,
        email: userEmail,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        lastUsed: "Never",
        scopes: ["Read"],
        orgId: currentOrg!.id,
        appId: selectedAppId
      };

      setKeys([newKey, ...keys]);
      setNewKeyLabel('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating key:", error);
    }
  };

  const handleDeleteKey = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!firestore) return;
    if (!confirm("Are you sure you want to delete this API key?")) return;
    try {
      await deleteDoc(doc(firestore!, "api_keys", id));
      setKeys(keys.filter(k => k.id !== id));
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  const maskKey = (key: string) => `${key.substring(0, 10)}...${key.substring(key.length - 4)}`;

  return (
    <div className="fade-in" style={{paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto'}}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px'}}>
         <div>
            <h1 style={{fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '12px'}}>API keys</h1>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', fontWeight: 400, lineHeight: 1.6}}>
               Manage your authentication tokens. Each key grants access to the Pathgen high-fidelity replay engine.
            </p>
         </div>
         <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '220px'}}>
               <label style={{fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '2px'}}>ACTIVE APPLICATION</label>
               <div style={{position: 'relative'}}>
                  <div 
                    onClick={() => setIsAppSelectorOpen(!isAppSelectorOpen)}
                    style={{
                      padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', 
                      background: '#fff', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
                    }} className="border-button-hover active-scale"
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden'}}>
                      <LayoutDashboard size={14} color="var(--accent-primary)" />
                      <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        {apps.find(a => a.id === selectedAppId)?.name || 'Select App'}
                      </span>
                    </div>
                    <ChevronsUpDown size={14} color="var(--text-secondary)" />
                  </div>

                  {isAppSelectorOpen && (
                    <>
                      <div style={{position: 'fixed', inset: 0, zIndex: 1000}} onClick={() => setIsAppSelectorOpen(false)} />
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                        background: '#fff', borderRadius: '14px', border: '1px solid var(--border-color)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)', padding: '8px', zIndex: 1001,
                        display: 'flex', flexDirection: 'column', gap: '2px'
                      }} className="fade-in">
                        {apps.length === 0 ? (
                          <div style={{padding: '12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No apps found</div>
                        ) : (
                          apps.map(app => (
                            <button 
                              key={app.id} 
                              onClick={() => { setSelectedAppId(app.id); setIsAppSelectorOpen(false); }}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px',
                                width: '100%', border: 'none', background: 'transparent', borderRadius: '10px',
                                cursor: 'pointer', textAlign: 'left'
                              }} className="table-row-hover"
                            >
                              <div style={{flex: 1, fontSize: '0.85rem', fontWeight: selectedAppId === app.id ? 700 : 500, color: selectedAppId === app.id ? 'var(--accent-primary)' : 'var(--text-primary)'}}>
                                {app.name}
                              </div>
                              {selectedAppId === app.id && <Check size={14} color="var(--accent-primary)" />}
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
               </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'var(--accent-primary)', color: '#fff', 
                padding: '12px 24px', borderRadius: '12px', 
                fontSize: '0.9rem', fontWeight: 600, border: 'none',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                marginTop: '18px'
              }}
              className="pop-out-hover active-scale"
            >
               <Plus size={18} />
               Create Key
            </button>
         </div>
      </div>

      {/* Keys Table Container */}
      <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden'}}>
         <div style={{padding: '24px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-sidebar)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
               <Shield size={18} color="var(--accent-primary)" />
               <h3 style={{fontSize: '1rem', fontWeight: 600}}>Active Authentication Tokens</h3>
            </div>
            <div style={{position: 'relative'}}>
               <Search size={14} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
               <input 
                 type="text" placeholder="Search by label or app..." 
                 style={{padding: '10px 12px 10px 36px', borderRadius: '10px', border: '1px solid var(--border-color)', fontSize: '0.85rem', width: '280px', outline: 'none', background: '#fff'}}
               />
            </div>
         </div>

         <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
               <tr style={{background: '#fff'}}>
                  <th style={{padding: '16px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-color)'}}>LABEL / APP</th>
                  <th style={{padding: '16px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-color)'}}>API KEY</th>
                  <th style={{padding: '16px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-color)'}}>CREATED</th>
                  <th style={{padding: '16px 32px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-color)'}}>LAST USED</th>
                  <th style={{padding: '16px 32px', textAlign: 'right', borderBottom: '1px solid var(--border-color)'}}></th>
               </tr>
            </thead>
            <tbody>
               {!isLoading && keys.map((key) => (
                  <tr key={key.id} style={{borderBottom: '1px solid var(--border-color)'}} className="table-row-hover">
                     <td style={{padding: '24px 32px'}}>
                        <div style={{fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px'}}>{key.label}</div>
                        <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                           <LayoutDashboard size={12} /> {key.workspace}
                        </div>
                     </td>
                     <td style={{padding: '24px 32px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: 'var(--bg-sidebar)', borderRadius: '8px', border: '1px solid var(--border-color)', width: 'fit-content'}}>
                           <span style={{fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)'}}>{maskKey(key.id)}</span>
                           <CopyButton text={key.id} size={13} />
                        </div>
                     </td>
                     <td style={{padding: '24px 32px'}}>
                        <div style={{fontSize: '0.9rem', color: 'var(--text-secondary)'}}>{key.createdAt}</div>
                     </td>
                     <td style={{padding: '24px 32px'}}>
                        <div style={{fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500}}>{key.lastUsed}</div>
                     </td>
                     <td style={{padding: '24px 32px', textAlign: 'right'}}>
                        <button onClick={(e) => handleDeleteKey(key.id, e)} style={{color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer'}}>
                           <Trash2 size={16} />
                        </button>
                     </td>
                  </tr>
               ))}
               {isLoading && (
                  <tr>
                     <td colSpan={5} style={{padding: '64px', textAlign: 'center', color: 'var(--text-secondary)'}}>Loading keys...</td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>

      {/* CREATE KEY MODAL - GLOBAL CENTERED */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, 
          background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 99999
        }}>
          <div className="fade-in" style={{
            width: '100%', maxWidth: '480px', margin: '20px',
            background: '#fff', borderRadius: '24px',
            padding: '48px', position: 'relative',
            boxShadow: '0 20px 80px rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}>
               <X size={24} />
            </button>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, textAlign: 'center', marginBottom: '32px'}}>New API Key</h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px'}}>
               <div>
                  <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>KEY LABEL</label>
                  <input 
                    type="text" value={newKeyLabel} onChange={(e) => setNewKeyLabel(e.target.value)}
                    autoFocus placeholder="e.g. Production Traffic" 
                    style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem'}}
                  />
               </div>

               <div>
                  <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>ORGANIZATION</label>
                  <select 
                    value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}
                    style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem', background: '#fff', cursor: 'pointer'}}
                  >
                     <option value="personal">Personal Org</option>
                  </select>
               </div>

               <div>
                  <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>APPLICATION</label>
                  <select 
                    value={selectedAppId} onChange={(e) => setSelectedAppId(e.target.value)}
                    style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem', background: '#fff', cursor: 'pointer'}}
                  >
                     {apps.length === 0 && <option value="">No apps found - create one in Apps</option>}
                     {apps.map(app => (
                        <option key={app.id} value={app.id}>{app.name}</option>
                     ))}
                  </select>
               </div>
            </div>

            <button 
              onClick={handleCreateKey}
              style={{width: '100%', background: 'var(--accent-primary)', color: '#fff', padding: '16px', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer'}}
            >
               Generate Secret Key
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
