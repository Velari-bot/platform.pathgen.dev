"use client"
import { useState, useEffect, useRef } from 'react';
import { User, Shield, Bell, Trash2, Camera, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { auth, firestore } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { useAuth } from '@/lib/firebase/auth-context';
import { useOrg } from '@/lib/context/OrgContext';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const userEmail = user?.email || "";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.displayName || userEmail.split('@')[0] || 'User',
    email: userEmail,
    organization: 'Personal',
    image: ''
  });

  const [notifications, setNotifications] = useState({
    low_credits: true,
    weekly_usage: true,
    security_alerts: true,
    api_updates: false
  });

  // Fetch settings from Firestore
  useEffect(() => {
    const fetchSettings = async () => {
      if (!userEmail) return;
      try {
        const userDoc = await getDoc(doc(firestore, "users", userEmail));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.profile) setProfile(prev => ({...prev, ...data.profile}));
          if (data.notifications) setNotifications(data.notifications);
        } else {
          await setDoc(doc(firestore, "users", userEmail), {
            profile: {
                name: user?.displayName || userEmail.split('@')[0] || 'User',
                email: userEmail,
                organization: 'Personal',
                image: ''
            },
            notifications: {
                low_credits: true,
                weekly_usage: true,
                security_alerts: true,
                api_updates: false
            }
          });
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [userEmail]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get Presigned URL
      const res = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      const { uploadUrl, finalUrl } = await res.json();

      // 2. Upload to R2 via Presigned URL
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      // 3. Update Profile locally and in Firestore
      const newProfile = { ...profile, image: finalUrl };
      setProfile(newProfile);
      
      if (userEmail) {
        await updateDoc(doc(firestore, "users", userEmail), {
          "profile.image": finalUrl
        });
      }

    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image. Check console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleNotification = async (key: keyof typeof notifications) => {
    const newVal = !notifications[key];
    setNotifications({...notifications, [key]: newVal});
    if (!userEmail) return;
    try {
        await updateDoc(doc(firestore, "users", userEmail), {
            [`notifications.${key}`]: newVal
        });
    } catch (error) {
        console.error("Error updating notification:", error);
    }
  };

  const saveProfile = async () => {
    if (!userEmail) return;
    try {
        await updateDoc(doc(firestore, "users", userEmail), {
            profile: profile
        });
        alert("Profile saved successfully!");
    } catch (error) {
        console.error("Error saving profile:", error);
    }
  };

  const handlePasswordReset = async () => {
    if (!userEmail) return;
    try {
      await sendPasswordResetEmail(auth, userEmail);
      alert("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      alert("Failed to send reset email: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !userEmail) return;
    const confirm = window.confirm("Are you ABSOLUTELY sure? This will delete all your credits, keys, and organizational data. This cannot be undone.");
    if (!confirm) return;

    try {
      // 1. Delete Firestore Data
      await deleteDoc(doc(firestore, "users", userEmail));
      
      // 2. Delete Auth User
      await deleteUser(user);
      
      alert("Account deleted. Redirecting...");
      router.push("/");
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        alert("For security, you must log in again before deleting your account.");
      } else {
        alert("Error deleting account: " + err.message);
      }
    }
  };

  if (isLoading) {
    return (
        <div style={{height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
            <div style={{width: '24px', height: '24px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
            <span style={{fontWeight: 700, color: 'var(--text-secondary)'}}>Loading settings...</span>
            <style jsx>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
  }

  return (
    <div className="fade-in" style={{paddingBottom: '120px', maxWidth: '1000px', margin: '0 auto'}}>
      
      <div style={{marginBottom: '64px'}}>
         <h1 style={{fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '16px'}}>Account Settings</h1>
         <p style={{color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', fontWeight: 400, lineHeight: 1.6}}>
            Manage your personal information, security credentials, and platform notification preferences.
         </p>
      </div>

      <div style={{display: 'flex', gap: '64px'}}>
         {/* Sidebar Nav */}
         <div style={{width: '240px', flexShrink: 0}}>
            <nav style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
               {[
                  { id: 'profile', title: 'Profile Info', icon: <User size={18} /> },
                  { id: 'security', title: 'Security', icon: <Shield size={18} /> },
                  { id: 'notifications', title: 'Notifications', icon: <Bell size={18} /> },
                  { id: 'danger', title: 'Danger Zone', icon: <Trash2 size={18} /> }
               ].map((item) => (
                  <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                    fontSize: '0.95rem', border: 'none', background: activeTab === item.id ? '#EEECE7' : 'transparent',
                    color: activeTab === item.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: activeTab === item.id ? 800 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                  }}>
                     {item.icon}
                     {item.title}
                  </button>
               ))}
            </nav>
         </div>

         {/* Content Area */}
         <div style={{flex: 1}}>
            {activeTab === 'profile' && (
               <div className="fade-in">
                <div style={{display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '48px'}}>
                   <div style={{position: 'relative'}}>
                      {/* PROFILE IMAGE CIRCLE */}
                      <div style={{
                        width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden', 
                        background: 'rgba(217, 119, 87, 0.1)', color: 'var(--accent-primary)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        fontSize: '2.25rem', fontWeight: 600, border: '4px solid #fff', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }}>
                        {isUploading ? (
                          <div style={{animation: 'spin 1s linear infinite'}}><Loader2 size={32} /></div>
                        ) : profile.image ? (
                          <Image src={profile.image} alt="Profile" width={90} height={90} unoptimized style={{objectFit: 'cover'}} />
                        ) : (
                          profile.name.charAt(0)
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{display: 'none'}} 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          background: 'var(--text-primary)', color: '#fff', 
                          borderRadius: '50%', border: '4px solid #fff', cursor: 'pointer'
                        }}>
                         <Camera size={14} />
                      </button>
                   </div>
                   <div>
                      <h3 style={{fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)'}}>{profile.name}</h3>
                      <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400}}>Developer • {profile.email}</p>
                   </div>
                </div>

                  <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
                     <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                        <div>
                           <label style={{display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>FULL NAME</label>
                           <input 
                                type="text" 
                                value={profile.name} 
                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                style={{width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#fff', outline: 'none', fontSize: '1rem', color: 'var(--text-primary)'}} 
                            />
                        </div>
                        <div>
                           <label style={{display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', letterSpacing: '0.05em'}}>EMAIL ADDRESS</label>
                           <input 
                                type="text" 
                                value={profile.email} 
                                disabled
                                style={{width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-sidebar)', outline: 'none', fontSize: '1rem', color: 'var(--text-secondary)', cursor: 'not-allowed'}} 
                            />
                        </div>
                     </div>
                      <div style={{marginTop: '32px', padding: '32px', background: 'var(--bg-sidebar)', borderRadius: '24px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                         <div>
                            <label style={{display: 'block', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px', letterSpacing: '0.05em'}}>ACTIVE WORKSPACE</label>
                            <div style={{fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)'}}>{currentOrg?.name || 'Personal Org'}</div>
                            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px'}}>Manage members, billing, and settings for this workspace.</p>
                         </div>
                         <button 
                            onClick={() => window.location.href = '/organization'}
                            style={{padding: '12px 24px', background: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer'}} 
                            className="table-row-hover active-scale"
                         >
                            Manage Org
                         </button>
                      </div>
                      <button onClick={saveProfile} style={{width: 'fit-content', background: 'var(--accent-primary)', color: '#fff', padding: '14px 40px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '32px'}}>Save Changes</button>
                  </div>
               </div>
            )}

            {activeTab === 'security' && (
               <div className="fade-in">
                  <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)'}}>Security & Auth</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                     {[
                        { title: 'Password', desc: 'Secure your account with a strong password.', action: 'Change Password' },
                        { title: 'Two-Factor Auth', desc: 'Add an extra layer of protection (Coming Soon).', action: 'Setup 2FA' },
                        { title: 'Linked Accounts', desc: 'Manage your Discord and GitHub connections.', action: 'Manage' }
                     ].map((row, i) => (
                        <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', borderRadius: '16px'}}>
                           <div>
                              <div style={{fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)'}}>{row.title}</div>
                              <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>{row.desc}</div>
                           </div>
                           <button 
                             onClick={row.title === 'Password' ? handlePasswordReset : undefined}
                             disabled={row.title === 'Two-Factor Auth'}
                             style={{
                                padding: '10px 20px', 
                                background: '#fff', 
                                border: '1px solid var(--border-color)', 
                                color: row.title === 'Two-Factor Auth' ? '#9CA3AF' : 'var(--accent-primary)', 
                                borderRadius: '10px', 
                                fontSize: '0.85rem', 
                                fontWeight: 700, 
                                cursor: row.title === 'Two-Factor Auth' ? 'not-allowed' : 'pointer'
                             }} className="table-row-hover">{row.action}</button>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'notifications' && (
               <div className="fade-in">
                  <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '32px', color: 'var(--text-primary)'}}>Notification Preferences</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
                     {[
                        { id: 'low_credits', title: 'Low Credit Warnings', desc: 'Receive an email when your balance reaches $5.00 or lower.' },
                        { id: 'weekly_usage', title: 'Weekly Usage Reports', desc: 'A summary of your API calls, parse costs, and performance.' },
                        { id: 'security_alerts', title: 'Security & Integrity Alerts', desc: 'Immediate notification of unusual login patterns or key usage.' },
                        { id: 'api_updates', title: 'API Beta & Feature Updates', desc: 'Stay informed about new endpoint releases and engine upgrades.' }
                     ].map((pref) => (
                        <div key={pref.id} style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between'}}>
                           <div style={{flex: 1, paddingRight: '48px'}}>
                              <div style={{fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)'}}>{pref.title}</div>
                              <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5}}>{pref.desc}</div>
                           </div>
                           <div 
                              onClick={() => toggleNotification(pref.id as keyof typeof notifications)}
                              style={{
                                 width: '48px', height: '26px', 
                                 background: notifications[pref.id as keyof typeof notifications] ? 'var(--accent-primary)' : 'var(--border-color)', 
                                 borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s'
                              }}
                           >
                              <div style={{
                                 width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '4px', 
                                 left: notifications[pref.id as keyof typeof notifications] ? '26px' : '4px',
                                 transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                              }}></div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {activeTab === 'danger' && (
               <div className="fade-in" style={{background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '24px', padding: '40px'}}>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: '#991B1B', marginBottom: '16px'}}>Delete Account</h3>
                  <p style={{fontSize: '0.95rem', color: '#B91C1C', marginBottom: '32px', lineHeight: 1.6}}>
                     Once you delete your account, all your API keys, credits, and historical data will be permanently removed. This action cannot be undone.
                  </p>
                  <button 
                    onClick={handleDeleteAccount}
                    style={{background: '#EF4444', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px'}}>
                     <Trash2 size={18} />
                     Permanently Delete My Account
                  </button>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
