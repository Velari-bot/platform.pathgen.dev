"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  CreditCard, 
  Activity, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Play,
  Code,
  Globe,
  Monitor,
  AlertCircle,
  Loader2
} from "lucide-react";
import { UsageChart } from "@/components/usage-chart";
import { useAuth } from "@/lib/auth-context";

const recentRequests = [
  { 
    id: "req_vgyqz2jwi", 
    endpoint: "/v1/replay/parse", 
    status: 200, 
    credits: 20, 
    date: "2 mins ago",
    method: "POST",
    region: "IAD (Virginia)",
    duration: "1,248ms",
    body: { file_hash: "0x4b3h...9h4j" },
    response: { match_id: "match_9431", status: "success" }
  },
  { 
    id: "req_xj92hzlq", 
    endpoint: "/v1/ai/analyze", 
    status: 403, 
    credits: 0, 
    date: "14 mins ago",
    method: "POST",
    region: "FRA (Frankfurt)",
    duration: "42ms",
    body: { match_id: "match_9431" },
    response: { error: "BETA_ACCESS_REQUIRED", message: "Key '..." }
  },
  { 
    id: "req_88hjz2p", 
    endpoint: "/v1/game/stats", 
    status: 200, 
    credits: 5, 
    date: "1 hr ago",
    method: "GET",
    region: "CDG (Paris)",
    duration: "185ms",
    body: { name: "Ninja" },
    response: { account: { name: "Ninja" }, stats: { wins: 420 } }
  },
  { 
    id: "req_4k2lhz", 
    endpoint: "/v1/game/ranked", 
    status: 200, 
    credits: 1, 
    date: "3 hrs ago",
    method: "GET",
    region: "IAD (Virginia)",
    duration: "95ms",
    body: { accountId: "4b3h..." },
    response: { ranked: { division_name: "Elite" } }
  },
];

export default function DashboardOverview() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    { icon: CreditCard, label: "Balance", value: userData?.credits?.toLocaleString() || "0", sub: "Credits", color: "text-primary" },
    { icon: Activity, label: "Success Rate", value: "99.9%", sub: "Data Integrity", color: "text-emerald-400" },
    { icon: Zap, label: "Avg Latency", value: "124ms", sub: "Optimized via R2", color: "text-amber-400" },
    { icon: Globe, label: "Cloudflare PoP", value: "IAD", sub: "DCA1 Cluster", color: "text-blue-400" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, {userData?.displayName || user.email?.split('@')[0]}</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Monitoring activity for {user.email}</p>
        </div>
        <div className="flex gap-3">
           <Badge variant="outline" className="glass py-1 px-3 border-emerald-500/20 text-emerald-400 font-normal">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              API Online (DCA)
           </Badge>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card bg-card/10 group hover:border-primary/20 transition-all cursor-default">
               <CardHeader className="flex flex-row items-center justify-between py-4 pb-1">
                 <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase opacity-80">{stat.label}</CardTitle>
                 <stat.icon className={`h-3 w-3 ${stat.color} opacity-70`} />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{stat.value}</div>
                 <div className="text-[10px] text-muted-foreground mt-1 font-medium">{stat.sub}</div>
               </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Chart */}
        <Card className="glass-card bg-card/5 lg:col-span-8 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
               <CardTitle className="text-sm font-bold opacity-80">Network Traffic</CardTitle>
               <div className="text-xs text-muted-foreground mt-1">Global request throughput across regions</div>
            </div>
            <div className="flex gap-2">
               <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">7 DAYS</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <UsageChart />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="glass-card bg-primary/5 border-primary/20 shadow-primary/5">
              <CardHeader className="pb-3">
                 <CardTitle className="text-sm font-bold text-primary">Need more credits?</CardTitle>
                 <div className="text-xs text-muted-foreground">Top up your balance instantly via Stripe.</div>
              </CardHeader>
              <CardContent>
                 <Button className="w-full bg-primary hover:bg-primary/90 text-sm font-bold shadow-lg shadow-primary/20 rounded-xl">
                   Buy Credits Pack
                 </Button>
              </CardContent>
           </Card>

           <Card className="glass-card bg-card/5 border-white/5">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-bold opacity-80">Developer Kit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                 {[
                   { icon: Terminal, label: "Get Started", sub: "Setup your first key" },
                   { icon: Code, label: "Omni-SDK", sub: "Python & NodeJS Wrappers" },
                   { icon: Play, label: "API Playground", sub: "Test beta endpoints" },
                 ].map((r, i) => (
                   <button key={i} className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-white/5 group transition-colors text-left focus:outline-none focus:ring-1 focus:ring-primary/20">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                         <r.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                      </div>
                      <div>
                         <div className="text-xs font-bold">{r.label}</div>
                         <div className="text-[10px] text-muted-foreground">{r.sub}</div>
                      </div>
                      <ChevronRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100" />
                   </button>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Recent Activity with Drawer */}
      <Card className="glass-card bg-card/5 border-white/5 overflow-hidden">
        <CardHeader className="pb-2 border-b border-white/5 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold opacity-80">Request Log Activity</CardTitle>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-pulse">LIVE ACTIVITY</span>
            <Button variant="ghost" size="sm" className="text-[10px] text-muted-foreground uppercase h-7 hover:bg-white/5">
              See All Logs <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
             <TableHeader>
                <TableRow className="hover:bg-transparent border-white/5">
                   <TableHead className="text-[10px] uppercase font-bold text-muted-foreground w-[40%] pl-6">Endpoint</TableHead>
                   <TableHead className="text-[10px] uppercase font-bold text-muted-foreground">Status</TableHead>
                   <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right">Credits</TableHead>
                   <TableHead className="text-[10px] uppercase font-bold text-muted-foreground text-right pr-6">Activity</TableHead>
                </TableRow>
             </TableHeader>
             <TableBody>
                {recentRequests.map((req, i) => (
                  <Dialog key={i}>
                    <DialogTrigger render={<TableRow className="hover:bg-white/[0.04] border-white/5 transition-colors group cursor-pointer" />}>
                        <TableCell className="font-mono text-[11px] pl-6 text-foreground/90">
                           <span className="opacity-40 font-bold mr-2">{req.method}</span>
                           {req.endpoint}
                        </TableCell>
                        <TableCell>
                           <div className={`text-[10px] px-2 py-0.5 rounded-full inline-block font-bold ${req.status === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                              {req.status}
                           </div>
                        </TableCell>
                        <TableCell className="text-[11px] text-right font-bold tabular-nums">-{req.credits} <span className="opacity-30">C</span></TableCell>
                        <TableCell className="text-[10px] text-right text-muted-foreground pr-6 font-medium">{req.date}</TableCell>
                    </DialogTrigger>
                    <DialogContent className="glass-card bg-black/90 border-white/10 sm:max-w-[600px] text-white overflow-hidden p-0 gap-0">
                      <div className="p-6 border-b border-white/5 space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-mono border-white/20 text-muted-foreground uppercase">{req.id}</Badge>
                          <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${req.status === 200 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            HTTP {req.status}
                          </div>
                        </div>
                        <DialogTitle className="text-xl font-mono pt-2">{req.method} {req.endpoint}</DialogTitle>
                        <DialogDescription className="text-muted-foreground text-xs">
                          Resolved at the edge in <span className="text-white font-medium">{req.duration}</span>
                        </DialogDescription>
                      </div>

                      <div className="grid grid-cols-2 bg-white/5 border-b border-white/5 p-4 gap-4">
                        <div className="flex items-center gap-2">
                           <Globe size={14} className="text-muted-foreground" />
                           <div className="text-[11px] font-medium text-foreground">{req.region}</div>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                           <Monitor size={14} className="text-muted-foreground" />
                           <div className="text-[11px] font-medium text-foreground italic opacity-60">fetch-client/v2.1</div>
                        </div>
                      </div>

                      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Request Body */}
                        <div className="space-y-3">
                           <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                             <Code size={12} /> Request Payload
                           </h4>
                           <div className="bg-black/50 p-4 rounded-xl border border-white/5 font-mono text-xs text-primary">
                             <pre>{JSON.stringify(req.body, null, 2)}</pre>
                           </div>
                        </div>

                        {/* Line break */}
                        <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                        {/* Response Body */}
                        <div className="space-y-3">
                           <h4 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${req.status === 403 ? 'text-rose-400' : 'text-muted-foreground'}`}>
                             {req.status === 200 ? <Zap size={12} /> : <AlertCircle size={12} />} 
                             {req.status === 200 ? 'Response Object' : 'Error Response'}
                           </h4>
                           <div className={`p-4 rounded-xl border font-mono text-xs ${req.status === 200 ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/5 border-rose-500/20 text-rose-300'}`}>
                             <pre>{JSON.stringify(req.response, null, 2)}</pre>
                           </div>
                        </div>
                      </div>

                      <div className="p-4 bg-primary/10 border-t border-primary/20 flex items-center justify-between">
                         <div className="text-[10px] font-bold tracking-tight text-primary">CREDITS CONSUMED</div>
                         <div className="text-sm font-bold text-primary tabular-nums">-{req.credits} C</div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
             </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
