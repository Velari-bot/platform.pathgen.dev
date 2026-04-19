import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Check, Zap, Rocket, Shield } from 'lucide-react'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Pricing — Credits and Plans',
  description: 'Simple pay-as-you-go pricing. 5000 credits for $4.99. Parse Fortnite replays for $0.02 each. No subscription required. Free endpoints included.',
  alternates: { canonical: 'https://platform.pathgen.dev/pricing' }
}

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$4.99',
      credits: '5,000',
      description: 'Ideal for indie developers and hobbyists.',
      icon: <Zap size={24} className="text-yellow-500" />,
      features: [
        '20 credits per replay parse',
        'Standard API Access',
        'Discord Support',
        '2 week retention'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$19.99',
      credits: '25,000',
      description: 'Best for growing apps and streamers.',
      icon: <Rocket size={24} className="text-blue-500" />,
      features: [
        '18 credits per replay parse',
        'Priority API Access',
        'AI Coaching Beta',
        '1 month retention'
      ],
      cta: 'Go Pro',
      highlighted: true
    },
    {
      name: 'Studio',
      price: '$49.99',
      credits: '75,000',
      description: 'For professional teams and analysis suites.',
      icon: <Shield size={24} className="text-purple-500" />,
      features: [
        '15 credits per replay parse',
        'Dedicated Support',
        'Custom Webhooks',
        'Unlimited retention'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  const costTable = [
    { endpoint: 'Replay Parsing (High-fidelity)', cost: '20 Credits', usd: '$0.02' },
    { endpoint: 'AI Match Coaching / Analysis', cost: '50 Credits', usd: '$0.05' },
    { endpoint: 'Player Statistics & Ranked Lookup', cost: '5 Credits', usd: '$0.005' },
    { endpoint: 'Rotation Score & Map Telemetry', cost: '15 Credits', usd: '$0.015' },
    { endpoint: 'Real-time Event Stream', cost: '2 Credits / min', usd: '$0.002' },
    { endpoint: 'Metadata Retrieval', cost: 'Free', usd: '$0.00' }
  ];

  return (
    <div className="fade-in" style={{
      minHeight: '100vh', 
      background: '#FAF9F6', 
      display: 'flex', 
      flexDirection: 'column', 
      padding: '0 80px',
      color: '#111111',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <header style={{
          height: '80px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%', 
          maxWidth: '1200px', 
          margin: '0 auto'
       }}>
          <Link href="/" style={{display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none'}}>
             <Image 
               src="/logo.png" 
               alt="Pathgen Logo" 
               width={44} 
               height={44} 
               style={{objectFit: 'contain'}}
             />
             <span style={{fontSize: '1.25rem', fontWeight: 600, color: '#111111'}}>Pathgen</span>
          </Link>
          <div style={{display: 'flex', gap: '24px'}}>
             <Link href="/docs" style={{fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500}}>Docs</Link>
             <Link href="/status" style={{fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500}}>Status</Link>
             <Link href="/login" style={{fontSize: '0.9rem', color: '#111111', textDecoration: 'none', fontWeight: 600}}>Sign In</Link>
          </div>
       </header>

       <main style={{flex: 1, padding: '80px 0', maxWidth: '1200px', margin: '0 auto', width: '100%'}}>
           <div style={{textAlign: 'center', marginBottom: '80px'}}>
              <h1 style={{fontSize: '3rem', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '16px'}}>Simple, pay-as-you-go pricing</h1>
              <p style={{fontSize: '1.2rem', color: '#6B6A68', maxWidth: '600px', margin: '0 auto'}}>
                 No subscriptions. Buy credits when you need them. Unused credits never expire.
              </p>
           </div>

           {/* Plan Cards */}
           <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '100px'}}>
              {plans.map((plan) => (
                 <div key={plan.name} style={{
                    background: plan.highlighted ? '#111111' : '#fff',
                    color: plan.highlighted ? '#fff' : '#111111',
                    padding: '40px',
                    borderRadius: '24px',
                    border: '1px solid #E5E5E5',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: plan.highlighted ? '0 20px 40px rgba(0,0,0,0.1)' : 'none',
                    position: 'relative',
                    transition: 'transform 0.2s ease-in-out'
                 }} className="pop-out-hover">
                    {plan.highlighted && (
                       <div style={{
                          position: 'absolute', top: '20px', right: '20px',
                          background: '#4ade80', color: '#000', padding: '4px 12px',
                          borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600
                       }}>
                          Best Value
                       </div>
                    )}
                    <div style={{marginBottom: '24px'}}>{plan.icon}</div>
                    <div style={{fontSize: '1.5rem', fontWeight: 600, marginBottom: '8px'}}>{plan.name}</div>
                    <div style={{fontSize: '2.5rem', fontWeight: 700, marginBottom: '4px'}}>{plan.price}</div>
                    <div style={{fontSize: '1rem', opacity: 0.8, marginBottom: '16px'}}>{plan.credits} Credits</div>
                    <p style={{fontSize: '0.9rem', opacity: 0.7, marginBottom: '32px', lineHeight: 1.5}}>{plan.description}</p>
                    
                    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px'}}>
                       {plan.features.map(feature => (
                          <div key={feature} style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem'}}>
                             <Check size={16} color={plan.highlighted ? '#4ade80' : '#111111'} />
                             {feature}
                          </div>
                       ))}
                    </div>

                    <Link href="/signup" style={{textDecoration: 'none'}}>
                       <button style={{
                          width: '100%',
                          padding: '16px',
                          borderRadius: '12px',
                          border: plan.highlighted ? 'none' : '1px solid #111111',
                          background: plan.highlighted ? '#fff' : 'transparent',
                          color: '#111111',
                          fontWeight: 600,
                          fontSize: '1rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                       }}>
                          {plan.cta}
                          <ArrowUpRight size={18} />
                       </button>
                    </Link>
                 </div>
              ))}
           </div>

           {/* Cost Table */}
           <div style={{maxWidth: '900px', margin: '0 auto'}}>
              <h2 style={{fontSize: '1.75rem', fontWeight: 600, marginBottom: '32px', textAlign: 'center'}}>Per-Endpoint Cost Reference</h2>
              <div style={{
                 background: '#fff',
                 border: '1px solid #E5E5E5',
                 borderRadius: '16px',
                 overflow: 'hidden'
              }}>
                 <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                       <tr style={{background: '#F5F5F3', borderBottom: '1px solid #E5E5E5'}}>
                          <th style={{padding: '20px', textAlign: 'left', fontWeight: 600, color: '#6B6A68', fontSize: '0.9rem'}}>Endpoint / Operation</th>
                          <th style={{padding: '20px', textAlign: 'right', fontWeight: 600, color: '#6B6A68', fontSize: '0.9rem'}}>Credit Cost</th>
                          <th style={{padding: '20px', textAlign: 'right', fontWeight: 600, color: '#6B6A68', fontSize: '0.9rem'}}>Estimated USD</th>
                       </tr>
                    </thead>
                    <tbody>
                       {costTable.map((row, i) => (
                          <tr key={i} style={{borderBottom: i === costTable.length - 1 ? 'none' : '1px solid #F0F0F0'}}>
                             <td style={{padding: '20px', fontWeight: 500}}>{row.endpoint}</td>
                             <td style={{padding: '20px', textAlign: 'right', color: '#6B6A68'}}>{row.cost}</td>
                             <td style={{padding: '20px', textAlign: 'right', fontWeight: 600}}>{row.usd}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* FAQ/Info */}
           <div style={{marginTop: '100px', textAlign: 'center'}}>
              <p style={{color: '#6B6A68', fontSize: '0.9rem'}}>
                 Looking for custom enterprise solutions or high-volume usage? <Link href="/support" style={{color: '#111111', textDecoration: 'underline'}}>Contact our team.</Link>
              </p>
           </div>
       </main>

       {/* Footer Footer */}
       <footer style={{padding: '80px 0', borderTop: '1px solid #E5E5E5', textAlign: 'center'}}>
          <div style={{fontSize: '0.8rem', color: '#6B6A68'}}>
             © 2026 Pathgen. All rights reserved. 100 free credits upon signup.
          </div>
       </footer>
    </div>
  );
}
