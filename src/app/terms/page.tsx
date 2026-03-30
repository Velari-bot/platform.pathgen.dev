"use client"
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2, DollarSign, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '800px', margin: '0 auto', padding: '80px 20px', color: '#111827'}}>
      <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '48px'}}>
         <ArrowLeft size={16} />
         Back to Pathgen Console
      </Link>
      
      <div style={{marginBottom: '64px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#3B82F6'}}>
            <FileText size={32} />
            <span style={{fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Legal</span>
         </div>
         <h1 style={{fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.04em'}}>Commercial Terms</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280'}}>Agreement for the Pathgen AI Developer Platform</p>
         <p style={{fontSize: '1.05rem', color: '#6B7280', marginTop: '8px'}}>Last Updated: March 30, 2026</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '48px', lineHeight: 1.8, fontSize: '1.05rem', color: '#374151'}}>
         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <CheckCircle2 size={20} /> 1. Acceptance of Terms
            </h2>
            <p>
               By accessing and using the Pathgen APIs (&quot;API&quot;), tools, and platform, you agree to be bound by these Commercial Terms of Service. If you use the API on behalf of an organization, you are agreeing to these Terms for that organization and representing that you have the authority to bind that organization to these terms.
            </p>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <DollarSign size={20} /> 2. Credits, Billing, and Subscriptions
            </h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               <p><strong>Fee Structure:</strong> Pathgen utilizes a credit-based economy and subscription model. Prices are clearly displayed in the <Link href="/billing" style={{color: '#3B82F6', fontWeight: 700}}>Billing Console</Link>.</p>
               <p><strong>Credit Purchases:</strong> All credit purchases are final and non-refundable unless required by applicable law. Credits expire 12 months after the purchase date.</p>
               <p><strong>Subscriptions:</strong> Monthly Pro tiers are billed in advance on a recurring monthly basis. You can cancel your subscription at any time; however, no partial-month refunds are provided.</p>
               <p><strong>Taxes:</strong> All fees are exclusive of taxes, levies, or duties imposed by taxing authorities.</p>
            </div>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <Scale size={20} /> 3. Intellectual Property & Ownership
            </h2>
            <p>
               Pathgen retains all rights, title, and interest in and to the Pathgen Engine, parsing technologies, and platform. You are granted a limited, around-the-world, non-exclusive license to utilize the data returned by the API within your own applications.
            </p>
            <p style={{marginTop: '12px'}}>
               You may not attempt to reverse-engineer, decompile, or replicate the Pathgen Engine or any proprietary components of the platform.
            </p>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px'}}>
               4. Termination & Suspensions
            </h2>
            <p>
               Pathgen reserves the right to suspend or terminate your account access for any violation of the <Link href="/usage-policy" style={{color: '#3B82F6', fontWeight: 700}}>Usage Policy</Link> or these Commercial Terms. Upon termination, your right to use the API will cease immediately, and any unused credits will be forfeited.
            </p>
         </section>

         <div style={{marginTop: '64px', padding: '32px', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0', fontSize: '0.9rem', color: '#64748B'}}>
            <p>These terms are governed by the laws of the State of New York. Any disputes shall be resolved exclusively in the state or federal courts located within the jurisdiction of our company headquarters.</p>
         </div>
      </div>
    </div>
  );
}
