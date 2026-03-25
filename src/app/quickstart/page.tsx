"use client"
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Terminal, Key, Rocket, ExternalLink, ChevronRight } from 'lucide-react';
import CopyButton from '@/components/CopyButton';

export default function Quickstart() {

  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '800px', margin: '0 auto'}}>
      
      <Link href="/docs" style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginBottom: '32px'}} className="table-row-hover">
         <ArrowLeft size={16} />
         Back to Documentation
      </Link>

      <div style={{marginBottom: '64px'}}>
         <div style={{width: '56px', height: '56px', borderRadius: '16px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
            <Rocket size={24} color="#fff" />
         </div>
         <h1 style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '16px'}}>Developer Quickstart</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280', lineHeight: 1.6}}>
            Go from zero to your first Pathgen API call in under 5 minutes. No SDKs or libraries required—just raw HTTP.
         </p>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '80px'}}>
         
         {/* Step 1 */}
         <div style={{display: 'flex', gap: '32px'}}>
            <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#F3F4F6', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0}}>1</div>
            <div style={{flex: 1}}>
               <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px'}}>Create an API Key</h3>
               <p style={{fontSize: '1rem', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6}}>
                  Head to your keys dashboard to generate a new authentication token. Keys are unique to your individual developer account.
               </p>
               <Link href="/keys" style={{textDecoration: 'none'}}>
                  <button style={{padding: '12px 24px', background: '#000', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                     <Key size={16} />
                     Manage API Keys
                  </button>
               </Link>
            </div>
         </div>

         {/* Step 2 */}
         <div style={{display: 'flex', gap: '32px'}}>
            <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#F3F4F6', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0}}>2</div>
            <div style={{flex: 1}}>
               <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px'}}>Choose an Endpoint</h3>
               <p style={{fontSize: '1rem', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6}}>
                  For your first call, we recommend testing a <strong>Free Endpoint</strong> like Account Lookup. This doesn&apos;t consume any credits.
               </p>
               <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
                  <span style={{padding: '8px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'JetBrains Mono'}}>GET /v1/players/lookup</span>
                  <span style={{padding: '8px 16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'JetBrains Mono'}}>GET /v1/cosmetics/search</span>
               </div>
            </div>
         </div>

         {/* Step 3 */}
         <div style={{display: 'flex', gap: '32px'}}>
            <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#F3F4F6', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, flexShrink: 0}}>3</div>
            <div style={{flex: 1}}>
               <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px'}}>Make the Request</h3>
               <p style={{fontSize: '1rem', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6}}>
                  Copy and paste this curl command into your terminal. Replace your-api-key-here with the key you generated in Step 1.
               </p>
               
               <div style={{background: '#111827', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                     <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#4B5563', textTransform: 'uppercase'}}>
                        <Terminal size={14} />
                        cURL Request
                     </div>
                      <CopyButton 
                         text='curl -X GET "https://api.pathgen.dev/v1/players/lookup?name=blackgirlslikeme" \\\n     -H "Authorization: Bearer YOUR_API_KEY_HERE"'
                         size={14}
                         color="#fff"
                      />
                  </div>
                  <pre style={{margin: 0, fontSize: '0.95rem', color: '#A5F3FC', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono', lineHeight: 1.6}}>
                     {`curl -X GET "https://api.pathgen.dev/v1/players/lookup?name=blackgirlslikeme" \\
     -H "Authorization: Bearer YOUR_API_KEY_HERE"`}
                  </pre>
               </div>

               <div style={{marginTop: '40px', padding: '32px', background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '24px', display: 'flex', gap: '20px'}}>
                  <div style={{marginTop: '4px'}}><CheckCircle size={24} color="#10B981" /></div>
                  <div>
                     <h4 style={{fontSize: '1.1rem', fontWeight: 800, color: '#064E3B', marginBottom: '8px'}}>You&apos;re officially a Pathgen developer!</h4>
                     <p style={{fontSize: '0.95rem', color: '#065F46', lineHeight: 1.5}}>
                        Check out our <Link href="/docs#schema" style={{color: '#064E3B', fontWeight: 700}}>Response Schema</Link> to understand how to parse the data coming back, or dive into our <Link href="/tutorials" style={{color: '#064E3B', fontWeight: 700}}>Tutorials</Link> for complex implementations.
                     </p>
                  </div>
               </div>
            </div>
         </div>

      </div>

      <div style={{marginTop: '120px', paddingTop: '80px', borderTop: '1px solid #F3F4F6', textAlign: 'center'}}>
         <h2 style={{fontSize: '1.75rem', fontWeight: 800, marginBottom: '24px'}}>Ready for more advanced tools?</h2>
         <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
            <Link href="/docs" style={{textDecoration: 'none'}}>
               <button style={{padding: '14px 28px', border: '1px solid #E5E7EB', background: '#fff', borderRadius: '12px', color: '#111827', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  Full API Docs
                  <ExternalLink size={16} />
               </button>
            </Link>
            <Link href="/tutorials" style={{textDecoration: 'none'}}>
               <button style={{padding: '14px 28px', background: '#000', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  View Tutorials
                  <ChevronRight size={16} />
               </button>
            </Link>
         </div>
      </div>
    </div>
  );
}
