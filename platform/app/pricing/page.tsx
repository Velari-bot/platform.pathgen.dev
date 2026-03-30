"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tiers = [
  { 
    name: "Free", 
    price: "€0", 
    priceFreq: "/mo",
    desc: "For hobbyists and casual creators.",
    features: [
      "10 req/min Rate Limit",
      "Core Replay Parsing",
      "Public Discovery & Metadata",
      "Community Discord Support"
    ],
    cta: "Get Started Free",
    id: "tier_free"
  },
  { 
    name: "Pro", 
    price: "€15", 
    priceFreq: "/mo",
    desc: "For competitive teams and pro tools.",
    features: [
      "100+ req/min Rate Limit",
      "Gemini AI Intelligence Layer",
      "Real-time Webhook Pushes",
      "Enhanced Heatmaps & Timelines",
      "Private OAuth Locker Access"
    ],
    cta: "Go Pro Now",
    id: "tier_pro",
    popular: true
  }
];

const packs = [
  { credits: "10,000", price: "$10", id: "pack_10k" },
  { credits: "60,000", price: "$50", id: "pack_60k", bonus: "10k Bonus" },
  { credits: "150,000", price: "$100", id: "pack_150k", bonus: "30k Bonus" },
];

const costs = [
  { endpoint: "/v1/replay/parse", desc: "Core binary extraction", cost: 20, tier: "Free" },
  { endpoint: "/v1/ai/analyze", desc: "Gemini Tactical Coaching", cost: 15, tier: "Pro Only" },
  { endpoint: "/v1/replay/enhanced/heatmap", desc: "Density Grid Generation", cost: 25, tier: "Pro Only" },
  { endpoint: "/v1/game/stats", desc: "Fused Career Statistics", cost: 5, tier: "Free" },
  { endpoint: "/v1/game/shop", desc: "Item Shop (R2 Mirror)", cost: 2, tier: "Free" },
];

export default function PricingPage() {
  const comparisons = [
    { feature: "Daily Parse Limit", free: "50", pro: "Unlimited", info: "Total .replay files processed" },
    { feature: "API Rate Limit", free: "10 req/min", pro: "100 req/min", info: "Burst protection thresholds" },
    { feature: "AI Match Analyst", free: "Unavailable", pro: "Gemini Pro 1.5", info: "Automated tactical coaching" },
    { feature: "Real-time Webhooks", free: "Unavailable", pro: "Unlimited", info: "Push notifications for events" },
    { feature: "Data Retention", free: "24 Hours", pro: "90 Days", info: "JSON matches stored in R2" },
    { feature: "Developer Support", free: "Discord", pro: "Priority Slack", info: "Access to engineering team" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6 text-center max-w-5xl mx-auto space-y-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1 h-auto text-[10px] font-extrabold uppercase tracking-[0.2em]">SaaS Tier Selection</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight glow-text mb-4">Choose your intelligence.</h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed italic">&quot;Pathgen scales with your ambition. Unlock the AI engine with Pro, or scale core parsing on Free.&quot;</p>
        </motion.div>
      </section>

      {/* Main Tiers */}
      <section className="px-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto py-12">
        {tiers.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
             <Card className={`glass-card relative h-full flex flex-col group transition-all duration-500 overflow-hidden ${t.popular ? 'border-primary/40 ring-1 ring-primary/20 bg-primary/[0.03] shadow-2xl shadow-primary/10' : 'border-white/5 bg-card/5 hover:border-white/10'}`}>
                {t.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-widest shadow-xl">MOST POPULAR</div>
                )}
                <CardHeader className="p-10">
                  <CardTitle className="text-3xl font-bold tracking-tight mb-2">{t.name}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed min-h-[40px] opacity-70 font-medium">{t.desc}</CardDescription>
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-6xl font-bold tracking-tighter">{t.price}</span>
                    <span className="text-muted-foreground font-semibold text-lg">{t.priceFreq}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-10 pb-10 flex-1">
                   <ul className="space-y-5">
                      {t.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-4 text-sm font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors">
                           <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-primary opacity-80" />
                           </div>
                           {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                    <Button className={`w-full h-14 rounded-2xl text-base font-bold shadow-2xl transition-all duration-300 transform active:scale-95 ${t.popular ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20' : 'bg-white/10 hover:bg-white/15 text-white'}`}>
                       {t.cta}
                    </Button>
                </CardFooter>
             </Card>
          </motion.div>
        ))}
      </section>

      {/* Comparison Table */}
      <section className="px-6 py-24 max-w-5xl mx-auto space-y-16">
         <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">Compare capabilities.</h2>
            <p className="text-muted-foreground font-medium max-w-xl mx-auto">See why developers are switching to the Pathgen Intelligence engine.</p>
         </div>

         <div className="rounded-3xl border border-white/5 bg-card/5 overflow-hidden glass-card shadow-2xl">
            <Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/5 bg-white/[0.03]">
                    <TableHead className="w-[40%] pl-10 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground py-6">Feature Package</TableHead>
                    <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Pathgen Free</TableHead>
                    <TableHead className="text-[11px] font-black uppercase tracking-[0.2em] text-primary text-center">Pathgen Pro</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {comparisons.map((c, i) => (
                    <TableRow key={i} className="hover:bg-white/[0.01] border-white/5 transition-colors group">
                       <TableCell className="pl-10 py-5">
                         <div className="font-bold text-sm text-foreground/90">{c.feature}</div>
                         <div className="text-[11px] text-muted-foreground mt-1 font-medium opacity-60 group-hover:opacity-100 transition-opacity">{c.info}</div>
                       </TableCell>
                       <TableCell className="text-center font-mono text-xs text-muted-foreground opacity-70">{c.free}</TableCell>
                       <TableCell className="text-center">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold ${c.pro === 'Unavailable' ? 'bg-white/5 text-muted-foreground' : 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5'}`}>
                             {c.pro === 'Unavailable' ? '—' : c.pro}
                          </div>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </section>

      {/* Top up */}
      <section className="px-6 py-24 max-w-5xl mx-auto border-t border-white/5">
         <div className="flex flex-col items-center mb-16 text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Need more credits?</h2>
            <p className="text-muted-foreground font-medium">Refill your balance instantly via Stripe. Shared across all tiers.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((p, i) => (
               <Card key={i} className="glass-card bg-card/5 border-white/5 p-8 group hover:border-primary/20 transition-all cursor-pointer flex flex-row items-center justify-between shadow-lg hover:shadow-primary/5">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold tracking-tight">{p.credits} <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Credits</span></div>
                    <div className="text-sm font-semibold text-primary">{p.price} <span className="text-[10px] font-normal text-muted-foreground opacity-60 italic">One-time refill</span></div>
                    {p.bonus && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black">{p.bonus}</Badge>}
                  </div>
                  <Button variant="ghost" className="h-12 w-12 p-0 rounded-2xl bg-white/5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                     <Zap className="h-5 w-5 fill-current" />
                  </Button>
               </Card>
            ))}
         </div>
      </section>

      {/* Technical Ticker */}
      <section className="px-6 py-24 max-w-4xl mx-auto space-y-12 mb-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="text-center">
            <h2 className="text-xs font-black tracking-[0.3em] uppercase text-muted-foreground">Technical Consumption Ledger</h2>
         </div>
         <div className="rounded-3xl border border-white/5 overflow-hidden">
            <Table>
                <TableBody>
                   {costs.map((c, i) => (
                     <TableRow key={i} className="border-white/5">
                        <TableCell className="font-mono text-[10px] py-4 pl-8">{c.endpoint}</TableCell>
                        <TableCell className="text-right pr-8 text-[10px] font-bold text-primary tabular-nums">-{c.cost} Credits</TableCell>
                     </TableRow>
                   ))}
                </TableBody>
            </Table>
         </div>
      </section>
    </div>
  );
}
