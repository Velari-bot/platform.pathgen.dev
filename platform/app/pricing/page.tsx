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
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6 text-center max-w-5xl mx-auto space-y-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1 h-auto text-xs font-bold uppercase tracking-widest">SaaS Tier Selection</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight glow-text">Choose your intelligence.</h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto italic">&quot;Pathgen scales with your ambition. Unlock the AI engine with Pro, or scale core parsing on Free.&quot;</p>
        </motion.div>
      </section>

      {/* Main Tiers */}
      <section className="px-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto py-12">
        {tiers.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
             <Card className={`glass-card relative h-full flex flex-col group ${t.popular ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.03]' : 'border-white/5 bg-card/10'}`}>
                {t.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">RECOMMENDED</div>
                )}
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-bold tracking-tight mb-2">{t.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed min-h-[40px]">{t.desc}</CardDescription>
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight">{t.price}</span>
                    <span className="text-muted-foreground font-medium">{t.priceFreq}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-1">
                   <ul className="space-y-4">
                      {t.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3 text-xs text-foreground/80">
                           <CheckCircle2 className="h-4 w-4 text-primary opacity-60 shrink-0" />
                           {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-8 pt-0">
                    <Button className={`w-full h-12 rounded-xl font-bold shadow-lg transition-all ${t.popular ? 'bg-primary shadow-primary/20' : 'bg-white/5 variant-outline hover:bg-white/10'}`}>
                       {t.cta}
                    </Button>
                </CardFooter>
             </Card>
          </motion.div>
        ))}
      </section>

      {/* Top up */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
         <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl font-bold text-center mb-2">Need more credits?</h2>
            <p className="text-muted-foreground text-sm">Refill your balance instantly. Credits never expire.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((p, i) => (
               <Card key={i} className="glass-card bg-card/5 border-white/5 p-6 hover:border-primary/20 transition-all group flex flex-row items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">{p.credits} Credits</div>
                    <div className="text-xs text-muted-foreground">{p.price} One-time</div>
                  </div>
                  <Button variant="ghost" className="h-10 w-10 p-0 rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                     <Zap className="h-4 w-4" />
                  </Button>
               </Card>
            ))}
         </div>
      </section>

      {/* Endpoint Table */}
      <section className="px-6 py-24 max-w-4xl mx-auto space-y-12">
         <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">Technical Breakdown</h2>
            <p className="text-muted-foreground mt-2">Deduction logic per fused API call.</p>
         </div>

         <Card className="glass-card bg-card/10 border-white/5 overflow-hidden">
            <Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/5 bg-white/[0.02]">
                    <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4">API Endpoint</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tier</TableHead>
                    <TableHead className="pr-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Cost</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {costs.map((c, i) => (
                    <TableRow key={i} className="hover:bg-white/[0.02] border-white/5 transition-colors group">
                       <TableCell className="pl-6 py-4">
                         <div className="font-mono text-[11px] opacity-80">{c.endpoint}</div>
                         <div className="text-[10px] text-muted-foreground italic">{c.desc}</div>
                       </TableCell>
                       <TableCell>
                          <Badge variant="outline" className={`text-[9px] font-bold uppercase tracking-widest ${c.tier === 'Pro Only' ? 'border-primary/20 text-primary' : 'border-white/10 text-muted-foreground'}`}>
                             {c.tier}
                          </Badge>
                       </TableCell>
                       <TableCell className="pr-6 text-right font-bold text-sm text-primary tabular-nums">
                         {c.cost} <span className="text-[10px] font-normal text-muted-foreground opacity-50 uppercase ml-1 tracking-tighter">Credits</span>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Card>
      </section>
    </div>
  );
}
