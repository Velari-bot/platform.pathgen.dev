"use client"
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '800px', margin: '0 auto'}}>
      <Link href="/support" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '48px'}} className="table-row-hover">
         <ArrowLeft size={16} />
         Back to Help Hub
      </Link>
      
      <div style={{marginBottom: '64px'}}>
         <h1 style={{fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.04em'}}>Terms of Service</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280'}}>Last Updated: March 24, 2026</p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '48px', lineHeight: 1.8, fontSize: '1.1rem', color: '#4B5563'}}>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>1. Acceptance of Terms</h2>
            <p>By accessing and using the Pathgen APIs (&quot;API&quot;), you agree to be bound by these Terms of Service. If you are using the API on behalf of an organization, you are agreeing to these Terms for that organization.</p>
         </section>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>2. API Usage</h2>
            <p>You may only use the API to build applications that facilitate legally permissible activities. You must not use the API for any form of cheating, competitive disadvantage manipulation, or unsolicited spamming of game servers.</p>
         </section>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>3. Credits and Billing</h2>
            <p>All credit purchases are final. Credits are deducted only upon successful return of a 200 OK status from a processing endpoint. Rates are subject to change with 30-day notice into the API CHANGELOG.</p>
         </section>
         <section>
            <h2 style={{fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '16px'}}>4. Intellectual Property</h2>
            <p>The Pathgen engine is proprietary technology. You are granted a non-exclusive, non-transferable right to use the data returned by the API in your own applications, provided you attribute Pathgen where applicable.</p>
         </section>
      </div>
    </div>
  );
}
