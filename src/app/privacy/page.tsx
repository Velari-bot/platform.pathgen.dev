"use client"
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Globe } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '800px', margin: '0 auto', padding: '80px 20px', color: '#111827'}}>
      <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '48px'}}>
         <ArrowLeft size={16} />
         Back to Pathgen Console
      </Link>
      
      <div style={{marginBottom: '64px'}}>
         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#D97757'}}>
            <Shield size={32} />
            <span style={{fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>Legal</span>
         </div>
         <h1 style={{fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.04em'}}>Privacy Policy</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280'}}>Last Updated: March 30, 2026</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '48px', lineHeight: 1.8, fontSize: '1.05rem', color: '#374151'}}>
         <p>
            At Pathgen, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform, APIs, and associated services.
         </p>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <Eye size={20} /> 1. Information We Collect
            </h2>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
               <p><strong>Account Information:</strong> When you register, we collect your name, email address, and authentication credentials through services like Google Auth or Firebase.</p>
               <p><strong>Developer Data:</strong> We collect API keys, organization membership details, and configuration settings required to maintain your developer environment.</p>
               <p><strong>Telemetry & Usage:</strong> We collect anonymized metadata about your API requests (latency, status codes, and endpoint volume) to ensure system stability and improve our parsing algorithms.</p>
            </div>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <Lock size={20} /> 2. Data Security & Storage
            </h2>
            <p>
               We implement industry-standard security measures to protect your data. Pathgen does not store your game replay files beyond the initial processing window (typically deleted within 72 hours). 
            </p>
            <p style={{marginTop: '12px'}}>
               All payment processing is handled by <strong>Stripe</strong>. Pathgen never stores or even sees your full credit card information.
            </p>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px'}}>
               <Globe size={20} /> 3. International Transfers
            </h2>
            <p>
               Your information may be transferred to and maintained on computers located outside of your state or country where data protection laws may differ. By using Pathgen, you consent to these transfers.
            </p>
         </section>

         <section>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '20px'}}>
               4. Your Rights (GDPR/CCPA)
            </h2>
            <p>
               You have the right to access, correct, or delete your personal data. You can manage most of these settings directly in your <Link href="/settings" style={{color: '#D97757', fontWeight: 700}}>Account Settings</Link>. For full account deletion requests, please contact our support team.
            </p>
         </section>

         <div style={{marginTop: '64px', padding: '32px', background: '#F9FAFB', borderRadius: '24px', border: '1px solid #E5E7EB'}}>
            <h4 style={{fontWeight: 700, marginBottom: '8px'}}>Questions?</h4>
            <p style={{fontSize: '0.9rem', color: '#6B7280'}}>Reach out to our legal team at legal@pathgen.dev for any clarification on our privacy practices.</p>
         </div>
      </div>
    </div>
  );
}
