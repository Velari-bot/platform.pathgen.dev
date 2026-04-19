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
  Activity,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sections = [
  { id: "intro", label: "Introduction", icon: BookOpen },
  { id: "auth", label: "Authentication", icon: ShieldCheck },
  { id: "replays", label: "Core & Replay", icon: Activity },
  { id: "ai", label: "AI & Coaching", icon: Zap },
  { id: "account", label: "Account & Billing", icon: CreditCard },
  { id: "system", label: "System & Infra", icon: Terminal },
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
                     <Badge className="bg-primary/20 text-primary border-primary/20 uppercase text-[10px] font-bold">PathGen API v1.2.6</Badge>
                     <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Enterprise API Documentation</span>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight glow-text">Introduction</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                    Welcome to the Pathgen v1.2.6 Service Map. Our infrastructure provides professional-grade Fortnite
                    replay parsing, AI-powered tactical coaching, and scalable account management.
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
               <h2 className="text-2xl font-bold tracking-tight border-b border-white/5 pb-4">1. Authentication</h2>
               <p className="text-sm text-muted-foreground">All `/v1` routes require your secret API Key passed in the `Authorization: Bearer` header.</p>
               
               <div className="bg-black/20 font-mono text-xs p-4 rounded-lg border border-white/5">
                 Authorization: Bearer pg_live_xxxxxxxxxxx
               </div>
            </section>

            {/* Core & Replay */}
            <section id="replays" className="space-y-6 scroll-mt-24">
               <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h2 className="text-2xl font-bold tracking-tight">2. Core Parsing & Replay</h2>
               </div>
               <p className="text-sm text-muted-foreground">High-precision extraction from .replay files. Credits deducted automatically on success.</p>
               
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
                           { route: "/v1/replay/parse", cost: "20cr", desc: "Main Entry. Full statistical extraction." },
                           { route: "/v1/replay/stats", cost: "5cr", desc: "Summary stats only (no events/scoreboard)." },
                           { route: "/v1/replay/scoreboard", cost: "8cr", desc: "Full 100-player lobby scoreboard only." },
                           { route: "/v1/replay/movement", cost: "8cr", desc: "Locational data and distances." },
                           { route: "/v1/replay/weapons", cost: "8cr", desc: "Deep dive weapon handle performance." },
                           { route: "/v1/replay/events", cost: "10cr", desc: "Elimination feed and key match events." },
                           { route: "/v1/replay/drop-analysis", cost: "15cr", desc: "Land-site scoring and optimization." },
                           { route: "/v1/replay/rotation-score", cost: "25cr", desc: "High Precision storm rotation grading." },
                           { route: "/v1/replay/match-info", cost: "5cr", desc: "Metadata lookup for server match IDs." },
                           { route: "/v1/replay/download-and-parse", cost: "25cr", desc: "Auto-fetch from Epic & parse." },
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
                  <h2 className="text-2xl font-bold tracking-tight">3. AI Coaching & Analytics</h2>
                  <Badge className="bg-primary/20 text-primary border-primary/20">Gemini 2.5 Flash</Badge>
               </div>
               <p className="text-sm text-muted-foreground">Premium tactical reviews powered by deep reasoning models.</p>
               
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
                           { route: "/v1/ai/analyze", cost: "15cr", desc: "Match summary, strengths/weaknesses." },
                           { route: "/v1/ai/coach", cost: "30cr", desc: "Deep tactical review (Early/Mid/Late game)." },
                           { route: "/v1/ai/session-coach", cost: "50cr", desc: "Multi-match trend analysis." },
                           { route: "/v1/ai/weapon-coach", cost: "20cr", desc: "Aim & Loadout critique." },
                           { route: "/v1/ai/drop-recommend", cost: "20cr", desc: "Dynamic landing recommendation." },
                           { route: "/v1/ai/opponent-scout", cost: "25cr", desc: "Threat analysis on specific players." },
                           { route: "/v1/ai/rotation-review", cost: "15cr", desc: "Narrative explanation of rotations." },
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

            {/* Account */}
            <section id="account" className="space-y-6 scroll-mt-24">
               <h2 className="text-2xl font-bold tracking-tight border-b border-white/5 pb-4">4. Account, Auth & Billing</h2>
               <p className="text-sm text-muted-foreground">Manage your identity, credits, and linked game accounts.</p>
               
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
                           { route: "/v1/auth/login", cost: "FREE", desc: "Secure token exchange." },
                           { route: "/v1/auth/register", cost: "FREE", desc: "New user onboarding." },
                           { route: "/v1/account/me", cost: "FREE", desc: "Profile and credit balance." },
                           { route: "/v1/billing/topup", cost: "FREE", desc: "Credit purchase via Stripe." },
                           { route: "/v1/epic/auth-url", cost: "FREE", desc: "Get Epic OAuth login link." },
                           { route: "/v1/epic/connect", cost: "FREE", desc: "Finalize Epic account linking." },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
                              <TableCell className={`text-xs font-bold ${e.cost === 'FREE' ? 'text-emerald-500' : 'text-primary'}`}>{e.cost}</TableCell>
                              <TableCell className="text-xs text-muted-foreground text-right pr-6">{e.desc}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </Card>
            </section>

             {/* System */}
             <section id="system" className="space-y-6 scroll-mt-24">
               <h2 className="text-2xl font-bold tracking-tight border-b border-white/5 pb-4">5. System & Infrastructure</h2>
               
               <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
                  <Table>
                     <TableHeader className="bg-white/[0.02]">
                        <TableRow className="border-white/5 hover:bg-transparent">
                           <TableHead className="w-[200px] text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Endpoint</TableHead>
                           <TableHead className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right pr-6">Description</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { route: "/health", desc: "Basic system uptime check." },
                           { route: "/health/detailed", desc: "Full heartbeat check (DB, R2)." },
                           { route: "/metrics", desc: "Prometheus metrics for monitoring." },
                           { route: "/v1/spec", desc: "Full OpenAPI / Swagger docs." },
                        ].map((e, i) => (
                           <TableRow key={i} className="border-white/5 hover:bg-white/[0.02]">
                              <TableCell className="font-mono text-xs font-bold">{e.route}</TableCell>
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
                  <Link href="/dashboard">
                     <Button className="bg-primary hover:bg-primary/90 rounded-xl font-bold h-12 px-8">
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                     </Button>
                  </Link>
               </div>
            </footer>
         </div>
      </main>
    </div>
  );
}
