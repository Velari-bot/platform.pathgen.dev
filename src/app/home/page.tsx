"use client"
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Shield, Key as KeyIcon, Zap, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { firestore } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';
import { useOrg } from '@/lib/context/OrgContext';

interface ActivityLog {
  id: string;
  action: string;
  target: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

export default function Overview() {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const userEmail = user?.email || "";
  const [isLoading, setIsLoading] = useState(true);
  const [profileName, setProfileName] = useState('Developer');
  const [stats, setStats] = useState({
    activeKeys: 0,
    apiRequests: "0",
    uptime: "99.9%",
    latency: "0ms"
  });
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [chartData, setChartData] = useState<{name: string, requests: number}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userEmail) return;
      
      // Pathgen Mock Mode
      if (!firestore) {
         setProfileName('Developer');
         setStats({
          activeKeys: 2,
          apiRequests: "1.2k",
          uptime: "99.99%",
          latency: "84ms"
        });
        setActivities([
          { id: '1', action: 'Account Active', target: 'Pathgen Console', time: 'Now', status: 'success' },
          { id: '2', action: 'API Key Created', target: 'Default App', time: '2m ago', status: 'success' }
        ]);
        setChartData([
          { name: 'Mon', requests: 120 },
          { name: 'Tue', requests: 450 },
          { name: 'Wed', requests: 300 },
          { name: 'Thu', requests: 800 },
          { name: 'Fri', requests: 1200 }
        ]);
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch Profile Name
        const userDoc = await getDoc(doc(firestore!, "users", userEmail));
        if (userDoc.exists()) {
          setProfileName(userDoc.data().profile?.name?.split(' ')[0] || 'Developer');
        }

        // 2. Fetch active keys count (Filtered by Org)
        if (!currentOrg) return;
        const keysQ = query(collection(firestore!, "api_keys"), where("orgId", "==", currentOrg.id));
        const keysSnapshot = await getDocs(keysQ);
        const activeKeysCount = keysSnapshot.size;

        // 3. Fetch Activities for metrics and chart (Filtered by Org)
        const sevenDaysAgo = new Timestamp(Timestamp.now().seconds - 7 * 24 * 60 * 60, 0);
        const activityQAll = query(
          collection(firestore!, "activities"), 
          where("orgId", "==", currentOrg.id),
          where("timestamp", ">=", sevenDaysAgo),
          orderBy("timestamp", "desc")
        );
        const activitySnapshotAll = await getDocs(activityQAll);
        
        let totalLatency = 0;
        let latencyCount = 0;
        let successCount = 0;
        const dailyData: { [key: string]: number } = {};

        // Process all activities for stats
        activitySnapshotAll.forEach((doc) => {
          const d = doc.data();
          if (d.status === 'success') successCount++;
          // Summary Stats
          if (d.latency) {
            totalLatency += d.latency;
            latencyCount++;
          }
          // Chart aggregation
          const date = d.timestamp?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (date) dailyData[date] = (dailyData[date] || 0) + 1;
        });

        // Format chart data (ensure last 7 days exist)
        const formattedChart = Object.keys(dailyData).reverse().map(date => ({
          name: date,
          requests: dailyData[date]
        }));

        // Recent 5 for the list
        const fetchedActivities: ActivityLog[] = [];
        activitySnapshotAll.docs.slice(0, 5).forEach((doc) => {
          const data = doc.data();
          fetchedActivities.push({
            id: doc.id,
            action: data.action,
            target: data.target,
            time: data.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "Now",
            status: (data.status as 'success' | 'warning' | 'error') || 'success'
          });
        });

        const avgLat = latencyCount > 0 ? Math.round(totalLatency / latencyCount) : 0;
        const totalReqs = activitySnapshotAll.size;
        const uptimeRate = totalReqs > 0 ? ((successCount / totalReqs) * 100).toFixed(2) : "100";

        setStats({
          activeKeys: activeKeysCount,
          apiRequests: totalReqs > 1000 ? `${(totalReqs / 1000).toFixed(1)}k` : totalReqs.toString(),
          uptime: `${uptimeRate}%`,
          latency: `${avgLat}ms`
        });
        setActivities(fetchedActivities.length > 0 ? fetchedActivities : [
          { id: '1', action: 'Account Active', target: 'Pathgen Console', time: 'Online', status: 'success' }
        ]);
        setChartData(formattedChart.length > 0 ? formattedChart : [
          { name: 'Today', requests: totalReqs }
        ]);

      } catch (error: unknown) {
        console.error("Error fetching overview data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail, currentOrg]);

  if (isLoading) {
    return (
        <div style={{height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
            <div style={{width: '24px', height: '24px', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
            <span style={{fontWeight: 700, color: 'var(--text-secondary)'}}>Loading dashboard...</span>
        </div>
    );
  }

  return (
    <div className="fade-in" style={{paddingBottom: '120px'}}>
      {/* Title Section */}
      <div style={{marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <div>
          <h1 style={{fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '8px', color: 'var(--text-primary)'}}>
            Welcome back, {profileName}
          </h1>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 400}}>Here&apos;s what&apos;s happening with your API integrations today.</p>
        </div>
        <div style={{display: 'flex', gap: '12px', background: 'var(--bg-sidebar)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-color)'}}>
           <button style={{padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#fff', fontSize: '0.85rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer'}}>Last 7 days</button>
           <button style={{padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer'}}>Last 30 days</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px'}}>
        {[
          { label: 'Active Keys', value: stats.activeKeys, icon: <KeyIcon size={20} />, trend: 'Stable' },
          { label: 'API Requests', value: stats.apiRequests, icon: <Zap size={20} />, trend: 'Live' },
          { label: 'Avg Latency', value: stats.latency, icon: <Activity size={20} />, trend: '~realtime' },
          { label: 'System Uptime', value: stats.uptime, icon: <Shield size={20} />, trend: 'Healthy' },
        ].map((stat, i) => (
          <div key={i} style={{padding: '32px', background: '#fff', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'}} className="active-scale">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px'}}>
               <div style={{width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-sidebar)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)'}}>
                  {stat.icon}
               </div>
               <span style={{fontSize: '0.75rem', fontWeight: 800, color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px'}}>{stat.trend}</span>
            </div>
            <div style={{fontSize: '2.25rem', fontWeight: 600, marginBottom: '2px', letterSpacing: '-0.02em', color: 'var(--text-primary)'}}>{stat.value}</div>
            <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500}}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px'}}>
         {/* Main Chart */}
         <div style={{background: '#fff', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
               <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)'}}>Traffic Overview</h3>
               <Link href="/usage" style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px'}}>
                   View Details <ChevronRight size={14} />
               </Link>
            </div>
            <div style={{height: '350px', width: '100%'}}>
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: 'var(--text-secondary)'}} dy={15} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 700, fill: 'var(--text-secondary)'}} dx={-10} />
                     <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontWeight: 700}}
                        cursor={{stroke: 'var(--accent-primary)', strokeWidth: 2}}
                     />
                     <Area type="monotone" dataKey="requests" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRequests)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Right Column */}
         <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
            {/* Recent Activity */}
            <div style={{background: '#fff', borderRadius: '24px', border: '1px solid var(--border-color)', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'}}>
               <h3 style={{fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)'}}>Recent Activity</h3>
               <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                  {activities.map((item) => (
                     <div key={item.id} style={{display: 'flex', gap: '16px'}}>
                        <div style={{marginTop: '4px'}}>
                           {item.status === 'success' ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#F59E0B" />}
                        </div>
                        <div style={{flex: 1}}>
                           <div style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px'}}>{item.action}</div>
                           <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{item.target}</div>
                        </div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'}}>
                           {item.time}
                        </div>
                     </div>
                  ))}
               </div>
               <Link href="/usage">
                  <button style={{width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 700, marginTop: '24px', cursor: 'pointer'}}>View All History</button>
               </Link>
            </div>

            {/* Support CTA */}
            <div style={{background: 'var(--accent-primary)', borderRadius: '24px', padding: '32px', color: '#fff', position: 'relative', overflow: 'hidden'}} className="active-scale">
               <div style={{position: 'relative', zIndex: 1}}>
                  <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em'}}>Need assistance?</h3>
                  <p style={{fontSize: '0.9rem', opacity: 0.9, marginBottom: '24px', lineHeight: 1.5}}>Our engineering team is ready to help you integrate Pathgen into your stack.</p>
                  <Link href="/support">
                    <button style={{background: '#fff', border: 'none', color: 'var(--accent-primary)', padding: '10px 20px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer'}}>Talk to Support</button>
                  </Link>
               </div>
               <div style={{position: 'absolute', top: '-10%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%'}}></div>
               <div style={{position: 'absolute', bottom: '-10%', left: '-10%', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%'}}></div>
            </div>
         </div>
      </div>
    </div>
  );
}
