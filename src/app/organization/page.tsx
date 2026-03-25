"use client"
import { useState, useEffect } from 'react';
import { Building, Users, CreditCard, LayoutDashboard, Settings, Plus, Check, AlertCircle, X, Mail, Shield, UserMinus, Clock } from 'lucide-react';
import Link from 'next/link';
import { useOrg } from '@/lib/context/OrgContext';
import { firestore } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, doc, Timestamp, deleteDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';

interface OrgType {
  id: string;
  name: string;
  role: string;
  createdAt: Timestamp | null;
}

interface MemberType {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function OrganizationPage() {
  const { user } = useAuth();
  const { refreshOrgs, currentOrg: activeOrg } = useOrg();
  const userEmail = user?.email || "";
  
  const [activeTab, setActiveTab] = useState('overview');
  const [organizations, setOrganizations] = useState<OrgType[]>([]);
  const [editingOrg, setEditingOrg] = useState<OrgType | null>(null);
  const [members, setMembers] = useState<MemberType[]>([]);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Form states
  const [newOrgName, setNewOrgName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');

  // Fetch Organizations & Members
  useEffect(() => {
    if (!userEmail) return;
    const fetchOrgs = async () => {
      try {
        const q = query(collection(firestore, "organizations"), where("ownerEmail", "==", userEmail));
        const snapshot = await getDocs(q);
        const orgs: OrgType[] = [];
        snapshot.forEach(doc => {
          orgs.push({ id: doc.id, ...doc.data() } as OrgType);
        });
        
        if (orgs.length === 0) {
            const defOrgData = { 
                name: 'Personal Org', 
                ownerEmail: userEmail, 
                role: 'owner', 
                createdAt: Timestamp.now() 
            };
            const newDocRef = await addDoc(collection(firestore, "organizations"), defOrgData);
            const newOrg = { id: newDocRef.id, ...defOrgData };
            setOrganizations([newOrg]);
            setEditingOrg(newOrg);
            refreshOrgs();
        } else {
            setOrganizations(orgs);
            // Default to matching active org if possible, else first
            const match = orgs.find(o => o.id === activeOrg?.id);
            setEditingOrg(match || orgs[0]);
        }
      } catch (e) { console.error(e); }
    };
    fetchOrgs();
  }, [userEmail, activeOrg?.id, refreshOrgs]);

  // Fetch Members
  useEffect(() => {
    if (!editingOrg) return;
    const fetchMembers = async () => {
      try {
        const q = query(collection(firestore, `organizations/${editingOrg.id}/members`));
        const snapshot = await getDocs(q);
        const mems: MemberType[] = [];
        snapshot.forEach(doc => {
          mems.push({ id: doc.id, ...doc.data() } as MemberType);
        });
        
        if (mems.length === 0) {
            setMembers([{ id: 'owner', name: userEmail.split('@')[0], email: userEmail, role: 'Owner', status: 'Active' }]);
        } else {
            setMembers(mems);
        }
      } catch (e) { console.error(e); }
    };
    fetchMembers();
  }, [editingOrg, userEmail]);

  const handleCreateOrg = async () => {
    if (!newOrgName.trim() || organizations.length >= 2) return;
    try {
      const orgData = { name: newOrgName, ownerEmail: userEmail, role: 'owner', createdAt: Timestamp.now() };
      const docRef = await addDoc(collection(firestore, "organizations"), orgData);
      const newOrg = { id: docRef.id, ...orgData };
      setOrganizations([...organizations, newOrg]);
      setNewOrgName('');
      setIsModalOpen(false);
      refreshOrgs();
    } catch (e) { console.error(e); }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !editingOrg) return;
    try {
      const docRef = await addDoc(collection(firestore, `organizations/${editingOrg.id}/members`), {
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Invited'
      });
      setMembers([...members, { id: docRef.id, name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, status: 'Invited' }]);
      setInviteEmail('');
      setIsInviteModalOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleRemoveMember = async (id: string) => {
    if (!editingOrg) return;
    try {
      await deleteDoc(doc(firestore, `organizations/${editingOrg.id}/members`, id));
      setMembers(members.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
  };

  const handleDeleteOrg = async () => {
    if (!editingOrg || organizations.length <= 1) return;
    if (!confirm(`Are you sure you want to delete "${editingOrg.name}"? This will permanently remove all associated data.`)) return;
    
    try {
      await deleteDoc(doc(firestore, "organizations", editingOrg.id));
      const updatedOrgs = organizations.filter(o => o.id !== editingOrg.id);
      setOrganizations(updatedOrgs);
      setEditingOrg(updatedOrgs[0]);
      setActiveTab('overview');
      refreshOrgs();
    } catch (e) {
      console.error(e);
      alert("Error deleting organization.");
    }
  };

  return (
    <div className="fade-in" style={{paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto'}}>
      
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <div style={{width: '64px', height: '64px', background: 'var(--accent-primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 10px 20px rgba(217, 119, 87, 0.2)'}}>
               <Building size={32} />
            </div>
            <div>
               <h1 style={{fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '8px'}}>{editingOrg?.name || 'Loading Org...'}</h1>
               <p style={{color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 400}}>
                  Manage your organization settings, members, and connected applications.
               </p>
            </div>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           disabled={organizations.length >= 2}
           style={{
             background: 'var(--bg-sidebar)', color: 'var(--text-primary)', 
             padding: '12px 24px', borderRadius: '12px', 
             fontSize: '0.9rem', fontWeight: 700, border: '1px solid var(--border-color)',
             cursor: organizations.length >= 2 ? 'not-allowed' : 'pointer', opacity: organizations.length >= 2 ? 0.5 : 1
           }}
           className="pop-out-hover active-scale"
         >
            Create New Org
         </button>
      </div>

      {/* Tabs */}
      <div style={{display: 'flex', gap: '32px', marginBottom: '48px', borderBottom: '1px solid var(--border-color)'}}>
         {[
            { id: 'overview', title: 'Overview', icon: <LayoutDashboard size={18} /> },
            { id: 'members', title: 'Members', icon: <Users size={18} /> },
            { id: 'settings', title: 'Settings', icon: <Settings size={18} /> }
         ].map((tab) => (
            <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               style={{
                  padding: '16px 8px', border: 'none', background: 'transparent',
                  fontSize: '0.95rem', fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s', marginBottom: '-1px'
               }}
            >
               {tab.icon}
               {tab.title}
            </button>
         ))}
      </div>

      {/* Content Area */}
      {activeTab === 'overview' && (
         <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: '48px'}}>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
               <Link href="/apps" style={{textDecoration: 'none'}}>
                  <div style={{padding: '32px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px'}} className="pop-out-hover border-button-hover">
                     <div style={{width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                        <LayoutDashboard size={20} />
                     </div>
                     <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)'}}>Manage Applications</h3>
                     <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px'}}>
                        Configure your workspaces, staging environments, and production apps.
                     </p>
                     <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600}}>
                        View all apps →
                     </div>
                  </div>
               </Link>

               <Link href="/billing" style={{textDecoration: 'none'}}>
                  <div style={{padding: '32px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px'}} className="pop-out-hover border-button-hover">
                     <div style={{width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                        <CreditCard size={20} />
                     </div>
                     <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)'}}>Billing & Plans</h3>
                     <p style={{fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px'}}>
                        Manage subscription tiers and organization-wide payment methods.
                     </p>
                     <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600}}>
                        Manage billing →
                     </div>
                  </div>
               </Link>
            </div>
         </div>
      )}

      {activeTab === 'members' && (
         <div className="fade-in">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
               <h3 style={{fontSize: '1.1rem', fontWeight: 600}}>Organization Members</h3>
               <button 
                  onClick={() => setIsInviteModalOpen(true)}
                  style={{padding: '10px 20px', background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}} 
                  className="active-scale pop-out-hover"
               >
                  <Plus size={16} /> Invite Member
               </button>
            </div>

            <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden'}}>
               <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                     <tr style={{background: 'var(--bg-sidebar)'}}>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>MEMBER</th>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>ROLE</th>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em'}}>STATUS</th>
                        <th style={{padding: '16px 24px', textAlign: 'right'}}></th>
                     </tr>
                  </thead>
                  <tbody>
                     {members.map((member) => (
                        <tr key={member.id} style={{borderBottom: '1px solid var(--border-color)'}} className="table-row-hover">
                           <td style={{padding: '24px 24px'}}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                                 <div style={{width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600}}>{member.name.charAt(0)}</div>
                                 <div>
                                    <div style={{fontSize: '0.95rem', fontWeight: 600}}>{member.name}</div>
                                    <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{member.email}</div>
                                 </div>
                              </div>
                           </td>
                           <td style={{padding: '24px 24px'}}><span style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{member.role}</span></td>
                           <td style={{padding: '24px 24px'}}>
                              <div style={{display: 'flex', alignItems: 'center', gap: '6px', color: member.status === 'Active' ? '#10B981' : 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600}}>
                                 {member.status === 'Active' ? <Check size={14} /> : <Clock size={14} />} {member.status}
                              </div>
                           </td>
                           <td style={{padding: '24px 24px', textAlign: 'right'}}>
                              {member.role !== 'Owner' && (
                                 <button onClick={() => handleRemoveMember(member.id)} style={{background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}}>
                                    <UserMinus size={18} />
                                 </button>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {activeTab === 'settings' && (
         <div className="fade-in" style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
            <div style={{padding: '40px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px'}}>
               <h3 style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px'}}>General Settings</h3>
               <div style={{display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px'}}>
                  <div>
                     <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px'}}>ORGANIZATION NAME</label>
                     <input 
                        type="text" 
                        defaultValue={editingOrg?.name}
                        onBlur={async (e) => { 
                           if (editingOrg) {
                              try {
                                await setDoc(doc(firestore, "organizations", editingOrg.id), { name: e.target.value }, { merge: true });
                                setEditingOrg({...editingOrg, name: e.target.value});
                                refreshOrgs();
                              } catch (err) {
                                console.error("Error updating org name:", err);
                              }
                           }
                        }}
                        style={{width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: '#fff'}}
                     />
                  </div>
               </div>
            </div>

            {/* DANGER ZONE - Only if >1 org */}
            {organizations.length > 1 && (
               <div style={{padding: '40px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px'}}>
                  <h3 style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: '24px', color: '#EF4444'}}>Danger Zone</h3>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', border: '1px solid #FEE2E2', borderRadius: '16px', background: '#FEF2F2'}}>
                     <div>
                        <div style={{fontWeight: 600, color: '#991B1B'}}>Delete Organization</div>
                        <div style={{fontSize: '0.85rem', color: '#B91C1C'}}>Permanently remove this organization and all associated data.</div>
                     </div>
                     <button 
                        onClick={handleDeleteOrg}
                        style={{padding: '10px 20px', background: '#EF4444', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'}}
                     >
                        Delete Org
                     </button>
                  </div>
               </div>
            )}
            {organizations.length === 1 && (
                <div style={{padding: '40px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', borderRadius: '24px', opacity: 0.6}}>
                   <div style={{display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)'}}>
                      <AlertCircle size={20} />
                      <p style={{fontSize: '0.9rem'}}>You must have at least one organization. Deletion is disabled.</p>
                   </div>
                </div>
             )}
         </div>
      )}

      {/* CREATE ORG MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999999
        }}>
          <div className="fade-in" style={{
            width: '100%', maxWidth: '400px',
            background: '#fff', borderRadius: '24px',
            padding: '40px', position: 'relative',
            boxShadow: '0 20px 80px rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}>
               <X size={24} />
            </button>
            <h2 style={{fontSize: '1.25rem', fontWeight: 600, textAlign: 'center', marginBottom: '24px'}}>New Organization</h2>
            <div style={{marginBottom: '24px'}}>
               <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px'}}>ORG NAME</label>
               <input 
                 type="text" value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)}
                 autoFocus placeholder="e.g. Acme Corp" 
                 style={{width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none'}}
               />
               <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <AlertCircle size={12} /> Limit of 2 organizations per account.
               </p>
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
               <button onClick={() => setIsModalOpen(false)} style={{flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#fff', fontWeight: 600, cursor: 'pointer'}}>Cancel</button>
               <button onClick={handleCreateOrg} style={{flex: 1.5, padding: '12px', borderRadius: '12px', background: 'var(--accent-primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>Create</button>
            </div>
          </div>
        </div>
      )}

      {/* INVITE MEMBER MODAL */}
      {isInviteModalOpen && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999999
        }}>
          <div className="fade-in" style={{
            width: '100%', maxWidth: '400px',
            background: '#fff', borderRadius: '24px',
            padding: '40px', position: 'relative',
            boxShadow: '0 20px 80px rgba(0,0,0,0.1)',
            border: '1px solid var(--border-color)'
          }}>
            <button onClick={() => setIsInviteModalOpen(false)} style={{position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'}}>
               <X size={24} />
            </button>
            <h2 style={{fontSize: '1.25rem', fontWeight: 600, textAlign: 'center', marginBottom: '32px'}}>Invite Member</h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px'}}>
               <div>
                  <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>EMAIL ADDRESS</label>
                  <div style={{position: 'relative'}}>
                     <Mail size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
                     <input 
                        type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                        autoFocus placeholder="colleague@company.com" 
                        style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none'}}
                     />
                  </div>
               </div>
               <div>
                  <label style={{display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>ROLE</label>
                  <div style={{position: 'relative'}}>
                     <Shield size={16} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}} />
                     <select 
                        value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                        style={{width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', background: '#fff', cursor: 'pointer'}}
                     >
                        <option value="Admin">Admin</option>
                        <option value="Developer">Developer</option>
                        <option value="Viewer">Viewer</option>
                     </select>
                  </div>
               </div>
            </div>
            <div style={{display: 'flex', gap: '12px'}}>
               <button onClick={() => setIsInviteModalOpen(false)} style={{flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#fff', fontWeight: 600, cursor: 'pointer'}}>Cancel</button>
               <button onClick={handleInvite} style={{flex: 1.5, padding: '12px', borderRadius: '12px', background: 'var(--accent-primary)', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer'}}>Send Invite</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
