"use client"
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Zap, BarChart3, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { firestore } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/firebase/auth-context';
import { useOrg } from '@/lib/context/OrgContext';

interface UsageStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface EndpointMetric {
  path: string;
  calls: number;
  avgTime: string;
  cost: string;
  percentage: number;
}

interface UsageDoc {
  id: string;
  path?: string;
  action?: string;
  latency?: number;
  status?: string;
  cost?: number;
  timestamp?: { toDate: () => Date };
}

export default function Usage() {
  const { user } = useAuth();
  const { currentOrg } = useOrg();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  const [stats, setStats] = useState<UsageStat[]>([]);
  const [endpoints, setEndpoints] = useState<EndpointMetric[]>([]);
  const [chartData, setChartData] = useState<{name: string, requests: number, cost: number, credits: number}[]>([]);

  useEffect(() => {
    if (!user?.email || !currentOrg) return;

    const fetchUsageData = async () => {
      if (!firestore) {
         setStats([
            { label: "Total Requests", value: "1,240", change: "+12%", trend: "up" },
            { label: "Avg. Latency", value: "48ms", change: "-4%", trend: "down" },
            { label: "Success Rate", value: "99.2%", change: "+0.1%", trend: "up" },
            { label: "Total Cost", value: "$42.50", change: "+8%", trend: "up" },
         ]);
         setEndpoints([
            { path: "/v1/replay/parse", calls: 840, avgTime: "120ms", cost: "$16.80", percentage: 65 },
            { path: "/v1/game/map", calls: 320, avgTime: "4ms", cost: "$3.20", percentage: 25 },
            { path: "/v1/ai/analyze", calls: 80, avgTime: "140ms", cost: "$22.50", percentage: 10 }
         ]);
         
         const is30 = timeRange === '30d';
         const is24h = timeRange === '24h';
         const mockLen = is24h ? 24 : (is30 ? 30 : 7);
         setChartData(Array.from({length: mockLen}).map((_, i) => ({ 
           name: is24h ? `${i}:00` : (is30 ? `Day ${i+1}` : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7]),
           requests: Math.floor(Math.random() * 500) + 100, 
           cost: Math.random() * 5 + 1,
           credits: Math.floor(Math.random() * 500) + 100
         })));
         return;
      }
      try {
        const q = query(
          collection(firestore, "activities"),
          where("orgId", "==", currentOrg.id),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any));

        if (allDocs.length === 0) {
          setStats([
            { label: "Total Requests", value: "0", change: "0%", trend: "up" },
            { label: "Avg. Latency", value: "0ms", change: "0%", trend: "down" },
            { label: "Success Rate", value: "0%", change: "0%", trend: "up" },
            { label: "Total Cost", value: "$0.00", change: "0%", trend: "up" },
          ]);
          setEndpoints([]);
          return;
        }

        // Define Time Boundaries
        const now = new Date();
        const getCutoff = (range: string) => {
          const d = new Date();
          if (range === '24h') d.setHours(d.getHours() - 24);
          else if (range === '7d') d.setDate(d.getDate() - 7);
          else d.setDate(d.getDate() - 30);
          return d;
        };

        const cutoff = getCutoff(timeRange);
        const prevCutoff = new Date(cutoff);
        if (timeRange === '24h') prevCutoff.setHours(prevCutoff.getHours() - 24);
        else if (timeRange === '7d') prevCutoff.setDate(prevCutoff.getDate() - 7);
        else prevCutoff.setDate(prevCutoff.getDate() - 30);

        const currentDocs = allDocs.filter((d: any) => d.timestamp?.toDate() >= cutoff);
        const previousDocs = allDocs.filter((d: any) => d.timestamp?.toDate() >= prevCutoff && d.timestamp?.toDate() < cutoff);

        // Calculate Stats
        const calcMetrics = (docs: any[]) => {
          if (docs.length === 0) return { total: 0, latency: 0, success: 0, cost: 0 };
          const sumLatency = docs.reduce((acc, d) => acc + (d.latency || 0), 0);
          const sumCost = docs.reduce((acc, d) => acc + (d.usdCost || (d.credits ? d.credits * 0.01 : 0)), 0);
          const success = docs.filter(d => d.status === 'success').length;
          return { total: docs.length, latency: sumLatency / docs.length, success: (success / docs.length) * 100, cost: sumCost };
        };

        const current = calcMetrics(currentDocs);
        const previous = calcMetrics(previousDocs);

        const getPct = (cur: number, prev: number) => {
          if (prev === 0) return cur > 0 ? "+100%" : "0%";
          const pct = ((cur - prev) / prev) * 100;
          return (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%";
        };

        setStats([
          { label: "Total Requests", value: current.total.toLocaleString(), change: getPct(current.total, previous.total), trend: current.total >= previous.total ? 'up' : 'down' },
          { label: "Avg. Latency", value: `${Math.round(current.latency)}ms`, change: getPct(current.latency, previous.latency), trend: current.latency <= previous.latency ? 'down' : 'up' },
          { label: "Success Rate", value: `${current.success.toFixed(1)}%`, change: getPct(current.success, previous.success), trend: current.success >= previous.success ? 'up' : 'down' },
          { label: "Total Cost", value: `$${current.cost.toFixed(2)}`, change: getPct(current.cost, previous.cost), trend: current.cost >= previous.cost ? 'up' : 'down' },
        ]);

        // Endpoints Breakdown (Current Period Only)
        const endpointMap: Record<string, { calls: number, time: number, cost: number }> = {};
        currentDocs.forEach((d: any) => {
          const path = (d.target || d.action || "/v1/api").split('?')[0];
          if (!endpointMap[path]) endpointMap[path] = { calls: 0, time: 0, cost: 0 };
          endpointMap[path].calls++;
          endpointMap[path].time += (d.latency || 0);
          endpointMap[path].cost += (d.usdCost || (d.credits ? d.credits * 0.01 : 0));
        });

        const endpointList = Object.entries(endpointMap).map(([path, data]) => ({
          path,
          calls: data.calls,
          avgTime: `${Math.round(data.time / data.calls)}ms`,
          cost: `$${data.cost.toFixed(2)}`,
          percentage: (data.calls / current.total) * 100
        })).sort((a, b) => b.calls - a.calls).slice(0, 5);

        setEndpoints(endpointList);

        // Chart Data (Volume per day/hour)
        const volumeMap: Record<string, { requests: number, cost: number, credits: number }> = {};
        
        // Initialize map with all dates in the range to avoid gaps
        if (timeRange === '24h') {
          for (let i = 23; i >= 0; i--) {
            const d = new Date(now);
            d.setHours(now.getHours() - i, 0, 0, 0);
            const label = d.getHours() + ":00";
            volumeMap[label] = { requests: 0, cost: 0, credits: 0 };
          }
        } else {
          const days = timeRange === '7d' ? 7 : 30;
          for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            volumeMap[label] = { requests: 0, cost: 0, credits: 0 };
          }
        }

        currentDocs.forEach(d => {
          const date = d.timestamp?.toDate();
          if (!date) return;
          const label = timeRange === '24h' 
            ? date.getHours() + ":00" 
            : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          if (volumeMap[label]) {
            volumeMap[label].requests++;
            const costVal = (d.usdCost || (d.credits ? d.credits * 0.01 : 0));
            volumeMap[label].cost += costVal;
            volumeMap[label].credits += (d.credits || 0);
          }
        });

        const chartArr = Object.entries(volumeMap).map(([name, data]) => ({
           name,
           requests: data.requests,
           cost: data.cost,
           credits: data.credits
        }));
        setChartData(chartArr);

      } catch (e) {
        console.error("Usage Analytics Error:", e);
      }
    };

    fetchUsageData();
  }, [user?.email, currentOrg, timeRange]);

  return (
    <div className="fade-in" style={{paddingBottom: '120px', maxWidth: '1200px', margin: '0 auto'}}>
      
      <div style={{marginBottom: '48px'}}>
         <h1 style={{fontSize: '2.5rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '12px'}}>Usage Analytics</h1>
         <p style={{color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', fontWeight: 400, lineHeight: 1.6}}>
            Real-time performance metrics and credit consumption for your organization.
         </p>
      </div>

      {/* Metric Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '64px'}}>
         {stats.map((stat, i) => (
           <div key={i} style={{
              background: '#fff', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
           }} className="pop-out-hover">
              <div style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '0.05em'}}>{stat.label.toUpperCase()}</div>
              <div style={{fontSize: '2.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '-0.02em'}}>{stat.value}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: stat.trend === 'up' ? '#10B981' : '#EF4444'}}>
                 {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                 {stat.change}
                 <span style={{color: 'var(--text-secondary)', fontWeight: 500, marginLeft: '4px'}}>vs last month</span>
              </div>
           </div>
         ))}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px'}}>
         {/* Main Chart Card */}
         <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '40px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <BarChart3 size={20} color="var(--accent-primary)" />
                  <h3 style={{fontSize: '1.25rem', fontWeight: 600}}>Request Volume</h3>
               </div>
               <div style={{display: 'flex', gap: '8px', background: 'var(--bg-sidebar)', padding: '4px', borderRadius: '10px'}}>
                  {(['24h', '7d', '30d'] as const).map(t => (
                    <button key={t} onClick={() => setTimeRange(t)} style={{
                       padding: '6px 14px', borderRadius: '8px', border: 'none', 
                       background: t === timeRange ? '#fff' : 'transparent',
                       color: t === timeRange ? 'var(--text-primary)' : 'var(--text-secondary)',
                       fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
                       boxShadow: t === timeRange ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                    }}>{t}</button>
                  ))}
               </div>
            </div>
            
            <div style={{height: '350px', width: '100%', marginTop: '20px'}}>
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 11, fontWeight: 700, fill: 'var(--text-secondary)'}}
                       dy={10} 
                     />
                     <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 11, fontWeight: 700, fill: 'var(--text-secondary)'}} 
                       dx={-10}
                     />
                     <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div style={{
                                background: '#fff', 
                                padding: '16px', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: '12px', 
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                              }}>
                                <p style={{margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)'}}>{label}</p>
                                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '24px'}}>
                                    <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600}}>Requests:</span>
                                    <span style={{fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700}}>{payload[0].value}</span>
                                  </div>
                                  <div style={{display: 'flex', justifyContent: 'space-between', gap: '24px'}}>
                                    <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600}}>Spent:</span>
                                    <span style={{fontSize: '0.8rem', color: '#10B981', fontWeight: 800}}>${(payload[0].payload.cost || 0).toFixed(2)}</span>
                                  </div>
                                  {payload[0].payload.credits > 0 && (
                                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '24px'}}>
                                      <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600}}>Credits:</span>
                                      <span style={{fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 800}}>{payload[0].payload.credits.toLocaleString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{fill: 'rgba(0,0,0,0.02)'}}
                     />
                     <Bar dataKey="requests" radius={[6, 6, 0, 0]} barSize={timeRange === '30d' ? 20 : 40}>
                        {chartData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'var(--accent-primary)' : 'var(--bg-sidebar)'} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '24px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Info size={14} />
                  <span>TOTAL PERIOD: {stats[3]?.value} CONSUMED</span>
               </div>
               <span>{timeRange === '24h' ? 'PAST 24 HOURS' : `LAST ${timeRange.toUpperCase()}`}</span>
            </div>
         </div>

         {/* Breakdown Table Card */}
         <div style={{background: '#fff', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '40px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
               <Zap size={20} color="var(--accent-primary)" />
               <h3 style={{fontSize: '1.25rem', fontWeight: 600}}>Top Endpoints</h3>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
               {endpoints.length === 0 && (
                  <div style={{padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem'}}>
                     No activity documented yet.
                  </div>
               )}
               {endpoints.map((e, i) => (
                 <div key={i} style={{paddingBottom: '24px', borderBottom: i === endpoints.length - 1 ? 'none' : '1px solid var(--border-color)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                       <code style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)'}}>{e.path}</code>
                       <span style={{fontSize: '0.85rem', fontWeight: 700}}>{e.calls.toLocaleString()}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                       <span>Avg: {e.avgTime}</span>
                       <span style={{fontWeight: 700, color: 'var(--text-primary)'}}>{e.cost}</span>
                    </div>
                    <div style={{width: '100%', height: '6px', background: 'var(--bg-sidebar)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden'}}>
                       <div style={{width: `${e.percentage}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '3px'}}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
