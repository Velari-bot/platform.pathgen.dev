"use client";

import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  ShieldCheck, 
  Search, 
  BookOpen, 
  ArrowRight,
  ChevronRight,
  Zap,
  Globe,
  User,
  Activity,
  CreditCard,
  FileText
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sections = [
  { id: "intro", label: "Introduction", icon: BookOpen },
  { id: "auth", label: "Authentication", icon: ShieldCheck },
  { id: "game", label: "Game World", icon: Globe },
  { id: "stats", label: "Player Statistics", icon: User },
  { id: "replays", label: "Replay Parsing", icon: Activity },
  { id: "account", label: "Account & Keys", icon: ShieldCheck },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "ai", label: "AI Analysis", icon: Activity },
  { id: "admin", label: "Admin Logs", icon: FileText },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("intro");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-full bg-background border-t border-white/5 overflow-hidden">
      {/* Docs Sidebar */}
      <aside className="w-64 border-r border-white/5 p-6 flex flex-col gap-8 h-full overflow-y-auto shrink-0">
         <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Search Docs..." 
              className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-primary/40 focus:border-primary/40 focus:outline-none transition-all"
            />
         </div>

         <nav className="flex flex-col gap-1">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2">Reference</div>
            {sections.map((s, i) => (
               <button 
                  key={i} 
                  onClick={() => scrollToSection(s.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${activeSection === s.id ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}
               >
                  <s.icon className={`h-4 w-4 ${activeSection === s.id ? 'text-primary' : 'opacity-60'}`} />
                  {s.label}
                  <ChevronRight className={`ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${activeSection === s.id ? 'opacity-100' : ''}`} />
               </button>
            ))}
         </nav>

         <div className="mt-auto pt-6">
            <Card className="glass-card bg-primary/5 border-primary/20 p-4">
               <div className="flex items-center gap-2 mb-2">
                  <Terminal className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Need Help?</span>
               </div>
               <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">Join our Discord for developer support and community discussion.</p>
               <Button variant="ghost" className="w-full h-8 text-[10px] uppercase font-bold bg-white/5 hover:bg-white/10 rounded-lg">Join Discord</Button>
            </Card>
         </div>
      </aside>

      {/* Docs Content */}
      <main className="flex-1 overflow-y-auto p-12 max-w-5xl scroll-smooth">
         <div className="space-y-24 pb-24">
            {/* Introduction */}
            <section id="intro" className="space-y-6">
               <motion.header 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="space-y-4"
               >
                  <div className="flex items-center gap-2">
                     <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[10px] font-bold">PathGen v1.0</Badge>
                     <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Enterprise API Documentation</span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight glow-text">Introduction</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    Welcome to the comprehensive reference for the PathGen API. Our infrastructure is built to 
                    support professional Fortnite applications with sub-second parsing and high-fidelity 
                    telemetry.
                  </p>
               </motion.header>

               <Alert className="glass-card bg-emerald-500/5 border-emerald-500/20">
                  <Zap className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="text-emerald-500 font-bold">New to PathGen?</AlertTitle>
                  <AlertDescription className="text-xs opacity-70">
                    If this is your first time, check out our <Link href="/docs/quickstart" className="font-bold underline">Quickstart Guide</Link> for 
                    a step-by-step walkthrough of making your first request.
                  </AlertDescription>
               </Alert>
            </section>

            {/* Auth */}
            <section id="auth" className="space-y-6 scroll-mt-24">
               <h2 className="text-2xl font-bold tracking-tight border-b border-white/5 pb-4">1. Auth & Global</h2>
               <p className="text-sm text-muted-foreground">All `/v1` routes require your secret API Key passed in the `X-API-Key` or `Authorization: Bearer` header.</p>
               
               <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                           <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Endpoint</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Method</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cost</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right pr-6">Description</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { route: "/health", method: "GET", cost: "Free", desc: "System health check" },
                           { route: "/health/detailed", method: "GET", cost: "Free", desc: "Full infrastructure status" },
                           { route: "/metrics", method: "GET", cost: "Free", desc: "System performance (supports ?format=json)" },
                           { route: "/v1/game/ping", method: "GET", cost: "Free", desc: "Latency & timestamp test" },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
                              <TableCell><Badge variant="outline" className="text-[10px] border-white/10">{e.method}</Badge></TableCell>
                              <TableCell className="text-xs text-primary font-bold">{e.cost}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6">{e.desc}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

            {/* Game Data */}
            <section id="game" className="space-y-6 scroll-mt-24">
               <h2 className="text-2xl font-bold tracking-tight border-b border-white/5 pb-4">2. Game World Data</h2>
               <p className="text-sm text-muted-foreground">Access static and real-time game world configurations, including island maps and loot pool updates.</p>
               
               <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                           <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Endpoint</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cost</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right pr-6">Description</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { route: "/v1/game/map", cost: "Free", desc: "High-res raw island map URLs" },
                           { route: "/v1/game/map/config", cost: "Free", desc: "Leaflet.js coordinate & POI config" },
                           { route: "/v1/game/map/tiles", cost: "60 Credits", desc: "Full tile URL list (36h pass)" },
                           { route: "/v1/game/news", cost: "Free", desc: "Latest patch and game news" },
                           { route: "/v1/game/playlists", cost: "Free", desc: "Active modes and LTMs" },
                           { route: "/v1/game/weapons", cost: "Free", desc: "Current weapon loot pool stats" },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
                              <TableCell className="text-xs text-primary font-bold">{e.cost}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6">{e.desc}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

            {/* Player Stats */}
            <section id="stats" className="space-y-6 scroll-mt-24">
               <h2 className="text-2xl font-bold tracking-tight border-b border-white/5 pb-4">3. Player Statistics</h2>
               <p className="text-sm text-muted-foreground">Fetch lifetime and seasonal statistics for any public Fortnite profile.</p>
               
               <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                           <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Endpoint</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cost</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right pr-6">Description</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { route: "/v1/game/lookup", cost: "Free", desc: "Map display names to account IDs" },
                           { route: "/v1/game/ranked", cost: "Free", desc: "Current rank & division progress" },
                           { route: "/v1/game/stats", cost: "Free", desc: "Lifetime K/D, Wins, and Matches" },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
                              <TableCell className="text-xs text-primary font-bold">{e.cost}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6">{e.desc}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

            {/* Parsing */}
            <section id="replays" className="space-y-6 scroll-mt-24">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold tracking-tight">4. Replay Parsing</h2>
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Multipart Required</Badge>
               </div>
               <p className="text-sm text-muted-foreground">The core PathGen payload. Upload .replay files to receive specialized telemetry analysis.</p>
               
               <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                           <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Endpoint</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cost</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right pr-6">Returned Data</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { route: "/v1/replay/parse", cost: "20 Credits", data: "Full recursive match telemetry" },
                           { route: "/v1/replay/stats", cost: "5 Credits", data: "Combat & build summary" },
                           { route: "/v1/replay/scoreboard", cost: "8 Credits", data: "Complete lobby rank & kills" },
                           { route: "/v1/replay/movement", cost: "8 Credits", data: "Drop, death, and heatmap path" },
                           { route: "/v1/replay/events", cost: "10 Credits", data: "Chronological kill/storm feed" },
                           { route: "/v1/replay/drop-analysis", cost: "15 Credits", data: "Physics-based landing score" },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
                              <TableCell className="text-xs text-primary font-bold">{e.cost}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6 font-bold">{e.data}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

            {/* Account */}
            <section id="account" className="space-y-6 scroll-mt-24">
               <h2 className="text-2xl font-bold tracking-tight border-b border-white/5 pb-4">5. Account & Keys</h2>
               <p className="text-sm text-muted-foreground">Manage your developer account, check credit balances, and generate API keys.</p>
               
               <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                           <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Endpoint</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cost</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right pr-6">Description</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { route: "/v1/account/balance", cost: "Free", desc: "Check current remaining credits" },
                           { route: "/v1/account/keys", cost: "Free", desc: "List or generate secret rs_ keys" },
                           { route: "/v1/account/usage", cost: "Free", desc: "Lifetime request count history" },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
                              <TableCell className="text-xs text-primary font-bold">{e.cost}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6">{e.desc}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

             {/* AI Analysis */}
            <section id="ai" className="space-y-6 scroll-mt-24">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold tracking-tight">6. AI Analysis & Coaching</h2>
                  <Badge className="bg-primary/20 text-primary border-primary/20">Gemini 2.0 Flash</Badge>
               </div>
               <p className="text-sm text-muted-foreground">Reasoning-based tactical insights powered by the latest Gemini 2.0 models.</p>
               
               <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                           <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Endpoint</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Cost</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right pr-6">Analysis Type</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { route: "/v1/ai/coach", cost: "30 Credits", desc: "Full tactical match breakdown" },
                           { route: "/v1/ai/session-coach", cost: "50 Credits", desc: "Multi-match pattern recognition" },
                           { route: "/v1/ai/weapon-coach", cost: "20 Credits", desc: "Weapon mastery & equip analysis" },
                           { route: "/v1/ai/drop-recommend", cost: "20 Credits", desc: "Route-based landing advice" },
                           { route: "/v1/ai/opponent-scout", cost: "25 Credits", desc: "Playstyle ID & pattern mapping" },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
                              <TableCell className="text-xs text-primary font-bold">{e.cost}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6">{e.desc}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

             {/* Admin */}
             <section id="admin" className="space-y-6 scroll-mt-24 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
               <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold tracking-tight">7. Admin Logs</h2>
                  <Badge variant="outline" className="text-[10px] font-bold border-white/10">RESTRICTED</Badge>
               </div>
               <p className="text-sm text-muted-foreground italic">Requires System Admin privileges. Standard developer keys cannot access these routes.</p>
               
               <Card className="glass-card bg-black/40 border-white/5 overflow-hidden">
                  <div className="p-4 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                     <div className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Administrative Monitoring</div>
                  </div>
                  <Table>
                     <TableBody>
                        {[
                           { route: "/logs/requests", desc: "Paginated history of all globally processed requests" },
                           { route: "/logs/errors", desc: "Internal trace logs and parser stack traces" },
                           { route: "/logs/live", desc: "SSE stream for real-time traffic monitoring" },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold pl-6">{e.route}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6">{e.desc}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

            {/* CTA */}
            <footer className="pt-24 pb-12">
               <div className="glass-card bg-primary/5 border-primary/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ready to start building?</h3>
                    <p className="text-xs text-muted-foreground">Jump into the dashboard to generate your first API key.</p>
                  </div>
                  <Link href="/dashboard/keys">
                     <Button className="bg-primary hover:bg-primary/90 rounded-xl font-bold h-12 px-8">
                        Generate API Key <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </Link>
               </div>
            </footer>
         </div>
      </main>
    </div>
  );
}
