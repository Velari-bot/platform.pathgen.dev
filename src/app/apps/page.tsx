"use client"
import { useState, useEffect } from 'react';
import { Plus, LayoutDashboard, MoreHorizontal, ExternalLink, Calendar, Database, X, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { firestore } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';
import { useOrg } from '@/lib/context/OrgContext';

interface AppType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  keyCount: number;
  orgId: string;
}

export default function Apps() {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const userEmail = user?.email || "";
  
  const [apps, setApps] = useState<AppType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Creation Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Edit State
  const [editingApp, setEditingApp] = useState<AppType | null>(null);

  useEffect(() => {
    if (!userEmail) return;
    const fetchApps = async () => {
      setApps([]); // Clear existing state before re-fetch
      if (!currentOrg) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const q = query(
          collection(firestore, "apps"), 
          where("orgId", "==", currentOrg.id),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedArr: AppType[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetchedArr.push({
            id: doc.id,
            name: data.name,
            description: data.description || "",
            createdAt: data.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || "Unknown",
            keyCount: 0,
            orgId: data.orgId
          });
        });
        setApps(fetchedArr);
      } catch (e) {
        console.error("Fetch Apps Error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, [userEmail, currentOrg]);

  const handleCreateApp = async () => {
    if (!newAppName.trim() || isCreating) return;
    if (!currentOrg) {
      console.error("Cannot create app: No organization selected.");
      return;
    }
    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(firestore, "apps"), {
        name: newAppName,
        description: newAppDesc,
        ownerEmail: userEmail,
        createdAt: Timestamp.now(),
        orgId: currentOrg.id
      });
      const newObj: AppType = {
        id: docRef.id,
        name: newAppName,
        description: newAppDesc,
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        keyCount: 0,
        orgId: currentOrg.id
      };
      setApps([newObj, ...apps]);
      setNewAppName('');
      setNewAppDesc('');
      setIsModalOpen(false);
    } catch (e) { console.error(e); } finally { setIsCreating(false); }
  };

  const handleUpdateApp = async () => {
    if (!editingApp) return;
    try {
      const ref = doc(firestore, "apps", editingApp.id);
      await updateDoc(ref, { name: editingApp.name, description: editingApp.description });
      setApps(apps.map(a => a.id === editingApp.id ? editingApp : a));
      setEditingApp(null);
    } catch (e) { console.error(e); }
  };

  const handleDeleteApp = async (id: string) => {
    if (!confirm("Are you sure? This will hide the app from your view.")) return;
    try {
      await deleteDoc(doc(firestore, "apps", id));
      setApps(apps.filter(a => a.id !== id));
      setActiveMenu(null);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="fade-in" style={{paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto'}}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px'}}>
         <div>
            <h1 style={{fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '12px'}}>Applications</h1>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', fontWeight: 400, lineHeight: 1.6}}>
               Organize your projects into apps. Each app serves as a workspace for your API keys and environment configurations.
            </p>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           style={{
            background: 'var(--accent-primary)', color: '#fff', 
            padding: '12px 24px', borderRadius: '10px', fontSize: '0.9rem', 
            fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
           }} className="pop-out-hover active-scale">
            <Plus size={18} /> Create Application
         </button>
      </div>

      {/* Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px'}}>
         {apps.length === 0 && !isLoading && (
            <div style={{gridColumn: '1 / -1', padding: '80px', textAlign: 'center', background: 'var(--bg-sidebar)', borderRadius: '24px', border: '1px dashed var(--border-color)'}}>
               <LayoutDashboard size={48} style={{margin: '0 auto 24px', opacity: 0.2}} />
               <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px'}}>No applications yet</h3>
               <p style={{color: 'var(--text-secondary)', marginBottom: '32px'}}>Create your first app to start managing API keys.</p>
               <button onClick={() => setIsModalOpen(true)} style={{padding: '12px 24px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer'}}>
                  Get Started
               </button>
            </div>
         )}

         {apps.map((app) => (
            <div 
               key={app.id} 
               className="pop-out-hover"
               style={{
                  background: '#fff', border: '1px solid var(--border-color)', 
                  borderRadius: '20px', padding: '32px', display: 'flex', 
                  flexDirection: 'column', transition: 'all 0.2s', position: 'relative'
               }}
            >
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px'}}>
                  <div style={{width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)'}}>
                     <LayoutDashboard size={24} />
                  </div>
                  <div style={{position: 'relative'}}>
                     <button 
                        onClick={() => setActiveMenu(activeMenu === app.id ? null : app.id)}
                        style={{background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}
                     >
                        <MoreHorizontal size={20} />
                     </button>
                     {activeMenu === app.id && (
                        <div style={{
                           position: 'absolute', right: 0, top: '100%', zIndex: 10,
                           width: '180px', background: '#fff', borderRadius: '12px',
                           border: '1px solid var(--border-color)', boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                           padding: '8px'
                        }}>
                           <button onClick={() => { setEditingApp(app); setActiveMenu(null); }} style={{width: '100%', padding: '10px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'}} className="table-row-hover">
                              <Edit3 size={14} /> Edit App
                           </button>
                           <button onClick={() => handleDeleteApp(app.id)} style={{width: '100%', padding: '10px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px'}} className="table-row-hover">
                              <Trash2 size={14} /> Delete App
                           </button>
                        </div>
                     )}
                  </div>
               </div>
               
               <h3 style={{fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)'}}>{app.name}</h3>
               <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.5, minHeight: '4.5em'}}>
                  {app.description}
               </p>

               <div style={{marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                     <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                        <Database size={14} /> {app.keyCount} Keys
                     </div>
                     <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                        <Calendar size={14} /> {app.createdAt}
                     </div>
                  </div>
                  <Link href={`/keys?appId=${app.id}`} style={{color: 'var(--accent-primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'}}>
                     Manage Keys <ExternalLink size={14} />
                  </Link>
               </div>
            </div>
         ))}
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999}}>
          <div className="fade-in" style={{width: '100%', maxWidth: '480px', margin: '20px', background: '#fff', borderRadius: '24px', padding: '48px', position: 'relative', boxShadow: '0 20px 80px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)'}}>
            <button onClick={() => setIsModalOpen(false)} style={{position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}><X size={24} /></button>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, textAlign: 'center', marginBottom: '32px'}}>New Application</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px'}}>
               <input type="text" value={newAppName} onChange={(e) => setNewAppName(e.target.value)} autoFocus placeholder="App Name" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem'}} />
               <textarea value={newAppDesc} onChange={(e) => setNewAppDesc(e.target.value)} placeholder="Description" style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem', height: '100px', resize: 'none'}} />
            </div>
            <button onClick={handleCreateApp} disabled={isCreating} style={{width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--accent-primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', opacity: isCreating ? 0.7 : 1}}>{isCreating ? 'Creating...' : 'Create App'}</button>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingApp && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999}}>
          <div className="fade-in" style={{width: '100%', maxWidth: '480px', margin: '20px', background: '#fff', borderRadius: '24px', padding: '48px', position: 'relative', boxShadow: '0 20px 80px rgba(0,0,0,0.1)', border: '1px solid var(--border-color)'}}>
            <button onClick={() => setEditingApp(null)} style={{position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}><X size={24} /></button>
            <h2 style={{fontSize: '1.5rem', fontWeight: 600, textAlign: 'center', marginBottom: '32px'}}>Edit Application</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px'}}>
               <input type="text" value={editingApp.name} onChange={(e) => setEditingApp({...editingApp, name: e.target.value})} autoFocus style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem'}} />
               <textarea value={editingApp.description} onChange={(e) => setEditingApp({...editingApp, description: e.target.value})} style={{width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.95rem', height: '100px', resize: 'none'}} />
            </div>
            <button onClick={handleUpdateApp} style={{width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--accent-primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>Save Changes</button>
          </div>
        </div>
      )}

    </div>
  );
}
