"use client"
import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Zap, BarChart3 } from 'lucide-react';
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
  const [chartData, setChartData] = useState<{h: number, date: string}[]>([]);

  useEffect(() => {
    if (!user?.email || !currentOrg) return;

    const fetchUsageData = async () => {
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
        const volumeMap: Record<string, number> = {};
        currentDocs.forEach(d => {
          const date = d.timestamp?.toDate();
          const label = timeRange === '24h' 
            ? date.getHours() + ":00" 
            : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          volumeMap[label] = (volumeMap[label] || 0) + 1;
        });

        const chartArr = Object.entries(volumeMap).map(([date, v]) => ({
           h: (v / Math.max(...Object.values(volumeMap), 1)) * 100,
           date
        })).reverse();
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
            
            <div style={{height: '300px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '0 8px'}}>
               {chartData.length === 0 && Array.from({length: 14}).map((_, i) => (
                   <div key={i} style={{flex: 1, height: '10%', background: 'var(--bg-sidebar)', borderRadius: '6px 6px 0 0', opacity: 0.3}}></div>
               ))}
               {chartData.map((d, i) => (
                 <div key={i} style={{
                    flex: 1, height: `${Math.max(10, d.h)}%`, background: i === chartData.length-1 ? 'var(--accent-primary)' : 'var(--bg-sidebar)', 
                    borderRadius: '6px 6px 0 0', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                 }}></div>
               ))}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600}}>
               <span>PAST ${timeRange.toUpperCase()}</span>
               <span>TODAY</span>
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
