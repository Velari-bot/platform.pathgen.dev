"use client"
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '800px', margin: '0 auto'}}>
      <Link href="/support" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '48px'}} className="table-row-hover">
         <ArrowLeft size={16} />
         Back to Help Hub
      </Link>
      
      <div style={{marginBottom: '64px'}}>
         <h1 style={{fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.04em'}}>Privacy Policy</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280'}}>Last Updated: March 24, 2026</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '48px', lineHeight: 1.8, fontSize: '1.1rem', color: '#4B5563'}}>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>1. Data Storage</h2>
            <p>Uploaded replay files are stored temporarily for processing and deleted automatically within 72 hours. We do not persist raw game binaries for longer than is required to return a valid JSON payload.</p>
         </section>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>2. What We Collect</h2>
            <p>We collect your email, hashed password, and API key activity logs for security purposes. We also store anonymized telemetry metadata to improve our engine&apos;s parsing accuracy across game updates.</p>
         </section>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>3. Third-party Services</h2>
            <p>We use Stripe for payment processing and do not store your credit card details on our own servers. We may use anonymized analytics to track documentation engagement and improve the developer portal.</p>
         </section>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>4. GDPR and Compliance</h2>
            <p>You may request deletion of your account and all associated key metadata at any time through your <Link href="/settings" style={{color: '#000', fontWeight: 700}}>Account Settings</Link>.</p>
         </section>
      </div>
    </div>
  );
}
