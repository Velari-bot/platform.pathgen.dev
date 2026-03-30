"use client"
import Link from 'next/link';
import { ArrowLeft, Zap, Info, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react';

export default function UsagePolicy() {
  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '800px', margin: '0 auto', padding: '80px 20px', color: '#111827'}}>
      <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '48px'}}>
         <ArrowLeft size={16} />
         Back to Pathgen Console
      </Link>
      
      <div style={{marginBottom: '64px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#10B981'}}>
            <Zap size={32} />
            <span style={{fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Legal</span>
         </div>
         <h1 style={{fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.04em'}}>Usage Policy</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280'}}>Guidelines for using Pathgen Developers Platform</p>
         <p style={{fontSize: '1.05rem', color: '#6B7280', marginTop: '8px'}}>Last Updated: March 30, 2026</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '48px', lineHeight: 1.8, fontSize: '1.05rem', color: '#374151'}}>
         <p>
            The Pathgen Platform is designed to enable innovation in game movement analysis, developer toolings, and competitive analytics. This Usage Policy ensures that our platform remains safe, stable, and fair for all developers.
         </p>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <ShieldCheck size={24} color="#10B981" /> 1. Permitted Usage
            </h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               <p><strong>Competitive Analytics:</strong> Building tools to visualize and analyze player movement patterns for training purposes.</p>
               <p><strong>Media & Content:</strong> Using Pathgen data to power overlays, broadcast graphics, or interactive maps for esports events.</p>
               <p><strong>Game Development:</strong> Utilizing our parsing engine to integrate telemetry from your own game titles or mods.</p>
            </div>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <XCircle size={24} color="#EF4444" /> 2. Prohibited Activities
            </h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '16px'}}>
               <p>❌ <strong>Reverse Engineering:</strong> You may not attempt to decompile or extract the source logic of the Pathgen Engine OR utilize returned data to build a competing parsing platform.</p>
               <p>❌ <strong>Unauthorized Distribution:</strong> You may not sell raw API keys or provide direct third-party access to the Pathgen endpoints.</p>
               <p>❌ <strong>Abuse & Scraping:</strong> Automated scraping of our documentation or high-volume DDoS-like request patterns intended to disrupt our infrastructure is strictly prohibited.</p>
               <p>❌ <strong>Cheat Injection:</strong> You may not use the API for any tool that facilitates cheating, direct player disadvantage, or real-time game manipulation in sanctioned competitive matches.</p>
            </div>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <AlertTriangle size={24} color="#F59E0B" /> 3. Rate Limits & Fair Use
            </h2>
            <p>
               API access is subject to predefined rate limits (e.g., 60 req/min for Free tiers, 2,000 req/min for Pro tiers). Repeated attempts to circumvent these limits through multiple account creations or automated IP rotation will result in a permanent ban.
            </p>
         </section>

         <div style={{marginTop: '64px', padding: '32px', background: '#F0FDF4', borderRadius: '24px', border: '1px solid #DCFCE7', display: 'flex', gap: '16px', alignItems: 'flex-start'}}>
            <Info size={24} color="#10B981" style={{marginTop: '4px', flexShrink: 0}} />
            <div>
               <h4 style={{fontWeight: 700, marginBottom: '8px', color: '#166534'}}>Compliance Monitoring</h4>
               <p style={{fontSize: '0.9rem', color: '#166534', opacity: 0.9}}>Pathgen monitors API request patterns through our intelligent anomaly detection engine. While we respect developer privacy, we take active steps to identify and mitigate malicious usage patterns that violate these guidelines.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
