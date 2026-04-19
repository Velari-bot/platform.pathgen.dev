"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tiers = [
  { 
    name: "Free", 
    price: "$0", 
    priceFreq: "/mo",
    desc: "For hobbyists and casual creators.",
    features: [
      "60 req/min Rate Limit",
      "Core Replay Parsing",
      "Public Discovery & Metadata",
      "Community Support"
    ],
    cta: "Get Started",
    id: "tier_free"
  },
  { 
    name: "Pro", 
    price: "$15", 
    priceFreq: "/mo",
    desc: "For competitive teams and professional tools.",
    features: [
      "2,000 req/min Rate Limit",
      "Gemini AI Intelligence Layer",
      "Real-time Webhook Pushes",
      "Enhanced Heatmaps & Timelines",
      "25% Credit Purchase Discount"
    ],
    cta: "Upgrade to Pro",
    id: "tier_pro",
    popular: true
  }
];

const packs = [
  { credits: "10,000", price: "$10", id: "pack_10k" },
  { credits: "60,000", price: "$50", id: "pack_60k", bonus: "10k Bonus" },
  { credits: "150,000", price: "$100", id: "pack_150k", bonus: "50k Bonus" },
];

const costs = [
  { endpoint: "/v1/replay/parse", desc: "Core binary extraction", cost: 20, tier: "Free" },
  { endpoint: "/v1/ai/coach", desc: "Deep AI Tactical Coaching", cost: 30, tier: "Pro Only" },
  { endpoint: "/v1/game/stats", desc: "Unified Career Statistics", cost: 5, tier: "Pro" },
  { endpoint: "/v1/replay/enhanced/heatmap", desc: "Density Grid Generation", cost: 15, tier: "Pro Only" },
  { endpoint: "/v1/game/shop", desc: "Fused Item Shop Data", cost: 1, tier: "Free" },
];

export default function PricingPage() {
  const comparisons = [
    { feature: "Daily Parse Limit", free: "50", pro: "Unlimited", info: "Total .replay files processed" },
    { feature: "API Rate Limit", free: "60 req/min", pro: "2,000 req/min", info: "Burst protection thresholds" },
    { feature: "Credit Pricing", free: "Standard", pro: "25% Discount", info: "Refill cost across all packs" },
    { feature: "AI Match Analyst", free: "Not Included", pro: "Full Access", info: "Automated tactical coaching" },
    { feature: "Real-time Webhooks", free: "Disabled", pro: "Full Access", info: "Push notifications for events" },
    { feature: "Developer Support", free: "Community", pro: "Priority Support", info: "Access to engineering team" },
  ];

  return (
    <div className="min-h-screen bg-white text-black pb-32">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6 text-center max-w-5xl mx-auto space-y-6">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="bg-[#D97757]/5 text-[#D97757] border-[#D97757]/10 mb-4 px-4 py-1 h-auto text-[10px] font-extrabold uppercase tracking-widest">Platform Tiers</Badge>
          <h1 className="text-5xl md:text-6xl font-medium tracking-tight mb-4">Plans that scale with you.</h1>
          <p className="text-xl text-gray-500 mt-4 max-w-2xl mx-auto font-normal leading-relaxed">PathGen provides the infrastructure for high-performance apps. Choose the tier that matches your ambition.</p>
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
             <Card className={`relative h-full flex flex-col transition-all duration-300 border ${t.popular ? 'border-black bg-white shadow-2xl scale-[1.02]' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                {t.popular && (
                  <div className="absolute top-4 right-4 text-[10px] font-black bg-[#D97757] text-white px-3 py-1 rounded-full tracking-widest">MOST POPULAR</div>
                )}
                <CardHeader className="p-10">
                   <div style={{width: '40px', height: '40px', borderRadius: '10px', background: t.popular ? 'rgba(217, 119, 87, 0.05)' : '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
                      {t.popular ? <Zap size={20} color="#D97757" fill="#D97757" /> : <ShieldCheck size={20} color="#6B7280" />}
                   </div>
                  <CardTitle className="text-2xl font-bold tracking-tight mb-1">{t.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-gray-500">{t.desc}</CardDescription>
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tighter">{t.price}</span>
                    <span className="text-gray-400 font-medium text-lg">{t.priceFreq}</span>
                  </div>
                </CardHeader>
                <CardContent className="px-10 pb-10 flex-1">
                   <div className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Capabilities</div>
                   <ul className="space-y-4">
                      {t.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                           <CheckCircle2 className={`h-4 w-4 shrink-0 ${t.popular ? 'text-[#D97757]' : 'text-gray-300'}`} />
                           {f}
                        </li>
                      ))}
                   </ul>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                    <Button className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-200 ${t.popular ? 'bg-black hover:bg-gray-900 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
                       {t.cta}
                       <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
             </Card>
          </motion.div>
        ))}
      </section>

      {/* Comparison Table */}
      <section className="px-6 py-24 max-w-5xl mx-auto space-y-16">
         <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight text-black">Technical Comparison</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Detailed breakdown of platform capabilities and limitations across tiers.</p>
         </div>

         <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            <Table>
               <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-100 bg-gray-50">
                    <TableHead className="w-[40%] pl-10 text-[11px] font-black uppercase tracking-widest text-gray-400 py-6">Capability</TableHead>
                    <TableHead className="text-[11px] font-black uppercase tracking-widest text-gray-400 text-center">Free Tier</TableHead>
                    <TableHead className="text-[11px] font-black uppercase tracking-widest text-[#D97757] text-center">Pro Tier</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {comparisons.map((c, i) => (
                    <TableRow key={i} className="hover:bg-gray-50/50 border-gray-50 transition-colors">
                       <TableCell className="pl-10 py-5">
                         <div className="font-bold text-sm text-black">{c.feature}</div>
                         <div className="text-[11px] text-gray-400 mt-1 font-medium italic">{c.info}</div>
                       </TableCell>
                       <TableCell className="text-center font-medium text-xs text-gray-400">{c.free}</TableCell>
                       <TableCell className="text-center">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold ${c.pro === 'Not Included' || c.pro === 'Disabled' ? 'text-gray-300' : 'text-[#D97757] bg-[#D97757]/5'}`}>
                             {c.pro}
                          </div>
                       </TableCell>
                    </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </section>

      {/* Top up */}
      <section className="px-6 py-24 max-w-5xl mx-auto border-t border-gray-100">
         <div className="flex flex-col items-center mb-16 text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Purchase Credits</h2>
            <p className="text-gray-500 font-medium">Refill your balance instantly via Stripe. Shared across all tiers.</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((p, i) => (
               <Card key={i} className="bg-white border-gray-100 p-8 group hover:border-[#D97757]/20 transition-all cursor-pointer flex flex-row items-center justify-between shadow-sm hover:shadow-md">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold tracking-tight">{p.credits} <span className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Credits</span></div>
                    <div className="text-sm font-semibold text-[#D97757]">{p.price} <span className="text-[10px] font-normal text-gray-400 opacity-60 ml-1">One-time refill</span></div>
                    {p.bonus && <Badge className="bg-green-50 text-green-600 border-green-100 text-[9px] font-black py-0.5 mt-2">{p.bonus}</Badge>}
                  </div>
                  <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl bg-gray-50 group-hover:bg-[#D97757] group-hover:text-white transition-all duration-300">
                     <ArrowRight className="h-4 w-4" />
                  </Button>
               </Card>
            ))}
         </div>
      </section>

      {/* Technical Ledger */}
      <section className="px-6 py-24 max-w-4xl mx-auto space-y-12 mb-20 opacity-60">
         <div className="text-center">
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-gray-400">Consumption Transparency Ledger</h2>
         </div>
         <div className="rounded-2xl border border-gray-100 overflow-hidden">
            <Table>
                <TableBody>
                   {costs.map((c, i) => (
                     <TableRow key={i} className="border-gray-50">
                        <TableCell className="font-mono text-[10px] py-4 pl-8 text-gray-500">{c.endpoint}</TableCell>
                        <TableCell className="text-right pr-8 text-[10px] font-bold text-black tabular-nums">-{c.cost} Credits</TableCell>
                     </TableRow>
                   ))}
                </TableBody>
            </Table>
         </div>
      </section>
    </div>
  );
}
