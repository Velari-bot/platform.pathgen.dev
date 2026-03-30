import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, BookOpen, Clock, Code, FileText, Globe, Key, Rocket, Terminal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Reverse Engineering the Fortnite .replay Binary Format — A Complete Guide',
  description: 'The definitive guide to the Fortnite replay format. Learn how to parse binary chunk types, decrypt AES-protected match data, and extract high-fidelity telemetry. Essential for Fortnite match analytics developers.',
  keywords: [
    'fortnite replay parser API',
    'fortnite replay analysis API',
    'fortnite match data API',
    'fortnite replay file parser',
    'fortnite replay format description',
    'fortnite binary replay parser',
    'fortnite replay aes encryption',
    'fortnite replay javascript parser',
    'fortnite replay python'
  ],
  alternates: {
    canonical: 'https://platform.pathgen.dev/blog/reverse-engineering-fortnite-replay-format'
  }
}

export default function ReplayGuidePost() {
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
          <Link href="/blog" style={{display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none'}}>
             <Image 
               src="/Pathgen Base Platform logo.png" 
               alt="Pathgen Logo" 
               width={44} 
               height={44} 
               style={{objectFit: 'contain'}}
             />
             <span style={{fontSize: '1.1rem', fontWeight: 600, color: '#111111'}}>Pathgen Blog</span>
          </Link>
          <div style={{display: 'flex', gap: '24px'}}>
             <Link href="/docs" style={{fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500}}>Docs</Link>
             <Link href="/pricing" style={{fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500}}>Pricing</Link>
             <Link href="/signup" style={{fontSize: '0.9rem', color: '#111111', textDecoration: 'none', fontWeight: 600}}>Get Started</Link>
          </div>
       </header>

       <article style={{flex: 1, padding: '120px 0', maxWidth: '800px', margin: '0 auto', width: '100%'}}>
           <div style={{marginBottom: '64px'}}>
              <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                <span style={{
                   fontSize: '0.75rem', fontWeight: 700, color: '#D97757', 
                   textTransform: 'uppercase', letterSpacing: '0.05em',
                   background: 'rgba(217, 119, 87, 0.05)', padding: '4px 12px', borderRadius: '100px'
                }}>
                   Deep Dive
                </span>
                <span style={{fontSize: '0.85rem', color: '#6B6A68', display: 'flex', alignItems: 'center', gap: '6px'}}>
                   <Clock size={14} /> 15 min read
                </span>
              </div>
              <h1 style={{fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '32px', lineHeight: 1.1}}>
                 Reverse Engineering the Fortnite .replay Binary Format
              </h1>
              <p style={{fontSize: '1.25rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '48px'}}>
                 Building a high-performance Fortnite replay parser is not just about reading files—it&apos;s about understanding the high-level binary organization, decryption protocols, and the custom Unreal Engine NetBitstream implementations that drive 100-player telemetry.
              </p>
           </div>

           <div style={{display: 'flex', flexDirection: 'column', gap: '32px', fontSize: '1.1rem', color: '#333', lineHeight: 1.7}}>
              <p>
                 When you click &quot;Save Replay&quot; in Fortnite, the game serializes every network packet received during the match into a proprietary Unreal Engine <code>.replay</code> file. This file isn&apos;t just a list of events; it&apos;s a time-serialized delta stream of the entire game world state.
              </p>

              <h2 style={{fontSize: '1.75rem', fontWeight: 700, marginTop: '24px', color: '#111111'}}>The Magic Header</h2>
              <p>
                 Every Fortnite replay begins with a 4-byte magic identifier: <code>0x29, 0x1B, 0x12, 0x1D</code>. This identifies the file as a valid stream. Immediately following this is the versioning info, which is critical because Epic Games frequently changes the internal data schema (the &quot;Network Version&quot;).
              </p>

              <div style={{background: '#111111', padding: '32px', borderRadius: '16px', color: '#4ade80', fontFamily: 'JetBrains Mono', fontSize: '0.95rem', margin: '24px 0'}}>
                <div style={{color: '#6B6A68', marginBottom: '12px'}}>// Replay Header Structure (Incomplete Draft)</div>
                <div>[0..4]   Magic Identifier (0x291B121D)</div>
                <div>[4..8]   File Version</div>
                <div>[8..12]  Length (In Bytes)</div>
                <div>[12..16] Network Version</div>
                <div>[16..20] Changelist</div>
              </div>

              <h2 style={{fontSize: '1.75rem', fontWeight: 700, marginTop: '24px', color: '#111111'}}>Chunk-Based Organization</h2>
              <p>
                 The format is structured into &quot;chunks.&quot; Each chunk starts with a type ID and a length, allowing parsers to skip sections they don&apos;t understand.
              </p>
              <ul style={{display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '24px'}}>
                 <li><strong>Header Chunk (Type 0):</strong> Metadata about the match (Map name, server info).</li>
                 <li><strong>Replay Data Chunk (Type 1):</strong> The actual network stream (often compressed/encrypted).</li>
                 <li><strong>Event Chunk (Type 3):</strong> Kill feeds, player deletions, and special game events.</li>
                 <li><strong>Checkpoint (Type 4):</strong> Full world state snapshots used for fast-seeking.</li>
              </ul>

              <h2 style={{fontSize: '1.75rem', fontWeight: 700, marginTop: '48px', color: '#111111'}}>The Decryption Wall</h2>
              <p>
                 Fortnite replays are NOT plain text. Modern replays use AES encryption for the data chunks. To decrypt them, you must calculate the SHA256 hash of the match-specific key provided by the Epic Games API and use it to initialize an AES-256-CFB decryption sequence.
              </p>

              <div style={{background: '#F5F5F3', padding: '40px', borderRadius: '24px', border: '1px solid #E5E5E5', textAlign: 'center', marginTop: '64px'}}>
                 <h3 style={{fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px'}}>Tired of Binary Math?</h3>
                 <p style={{color: '#6B6A68', marginBottom: '32px'}}>
                    Don&apos;t spend 6 months reverse engineering bitstreams. Use the Pathgen API to parse ANY Fortnite replay to structured JSON in under 1 second.
                 </p>
                 <Link href="/signup">
                    <button style={{padding: '16px 32px', background: '#111111', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer'}}>
                       Get 100 Free Credits
                    </button>
                 </Link>
              </div>

           </div>
           
           <div style={{marginTop: '120px', padding: '64px', background: '#111111', borderRadius: '32px', color: '#fff', textAlign: 'center'}}>
              <h2 style={{fontSize: '2rem', fontWeight: 700, marginBottom: '16px'}}>Build on the Pathgen Platform</h2>
              <p style={{opacity: 0.7, marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px'}}>The infrastructure Osirion and Tracker Network wish they had. High-fidelity match telemetry for developers.</p>
              <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
                 <Link href="/docs" style={{color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '10px'}}>Documentation</Link>
                 <Link href="/pricing" style={{color: '#fff', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '10px'}}>Pricing</Link>
              </div>
           </div>
       </article>

       <footer style={{padding: '80px 0', borderTop: '1px solid #E5E5E5', textAlign: 'center'}}>
          <div style={{fontSize: '0.8rem', color: '#6B6A68'}}>
             © 2026 Pathgen. Binary parsing since 2024.
          </div>
       </footer>
    </div>
  )
}
