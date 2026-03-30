import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog & Engineering — Pathgen',
  description: 'Deep dives into Fortnite replay binary formats, match telemetry, and AI-powered match analysis. Technical guides for Fortnite developers.',
  alternates: { canonical: 'https://platform.pathgen.dev/blog' }
}

const posts = [
  {
    title: 'Reverse Engineering the Fortnite .replay Binary Format — A Complete Guide',
    description: 'The definitive guide to the Fortnite replay format. Binary structure, AES encryption, chunk types, and how to extract telemetry at scale.',
    date: 'March 30, 2026',
    readTime: '15 min read',
    slug: 'reverse-engineering-fortnite-replay-format',
    category: 'Engineering'
  },
  {
    title: 'How to build a Fortnite Stat Tracker in 2025',
    description: 'A complete tutorial on building a high-performance stat tracker using the Pathgen API. From first call to visualization.',
    date: 'March 25, 2026',
    readTime: '10 min read',
    slug: '#',
    category: 'Tutorial'
  },
  {
    title: 'AI Coaching: The next frontier of Competitive Fortnite',
    description: 'How we leverage large language models to provide real-time coaching and rotational analysis for competitive players.',
    date: 'March 18, 2026',
    readTime: '8 min read',
    slug: '#',
    category: 'Intelligence'
  }
];

export default function BlogIndex() {
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
               src="/Pathgen Base Platform logo.png" 
               alt="Pathgen Logo" 
               width={44} 
               height={44} 
               style={{objectFit: 'contain'}}
             />
             <span style={{fontSize: '1.25rem', fontWeight: 600, color: '#111111'}}>Pathgen Blog</span>
          </Link>
          <div style={{display: 'flex', gap: '24px'}}>
             <Link href="/docs" style={{fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500}}>Docs</Link>
             <Link href="/pricing" style={{fontSize: '0.9rem', color: '#6B6A68', textDecoration: 'none', fontWeight: 500}}>Pricing</Link>
             <Link href="/signup" style={{fontSize: '0.9rem', color: '#111111', textDecoration: 'none', fontWeight: 600}}>Get Started</Link>
          </div>
       </header>

       <main style={{flex: 1, padding: '80px 0', maxWidth: '1000px', margin: '0 auto', width: '100%'}}>
           <div style={{marginBottom: '80px'}}>
              <h1 style={{fontSize: '3.5rem', fontWeight: 500, letterSpacing: '-0.04em', marginBottom: '16px'}}>Engineering & Insights</h1>
              <p style={{fontSize: '1.25rem', color: '#6B6A68', maxWidth: '600px', lineHeight: 1.5}}>
                 Thoughts on reverse engineering, match analytics, and building the future of Fortnite infrastructure.
              </p>
           </div>

           <div style={{display: 'flex', flexDirection: 'column', gap: '48px'}}>
              {posts.map((post) => (
                 <Link key={post.title} href={`/blog/${post.slug}`} style={{textDecoration: 'none', color: 'inherit'}}>
                    <article style={{
                       background: '#fff',
                       padding: '40px',
                       borderRadius: '24px',
                       border: '1px solid #E5E5E5',
                       display: 'flex',
                       flexDirection: 'column',
                       transition: 'all 0.2s ease-in-out',
                       cursor: 'pointer'
                    }} className="pop-out-hover">
                       <div style={{display: 'flex', gap: '12px', marginBottom: '20px'}}>
                          <span style={{
                             fontSize: '0.75rem', fontWeight: 700, color: '#D97757', 
                             textTransform: 'uppercase', letterSpacing: '0.05em',
                             background: 'rgba(217, 119, 87, 0.05)', padding: '4px 12px', borderRadius: '100px'
                          }}>
                             {post.category}
                          </span>
                          <span style={{fontSize: '0.85rem', color: '#6B6A68', display: 'flex', alignItems: 'center', gap: '6px'}}>
                             <Clock size={14} /> {post.readTime}
                          </span>
                       </div>
                       
                       <h2 style={{fontSize: '1.75rem', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.02em'}}>{post.title}</h2>
                       <p style={{fontSize: '1rem', color: '#6B6A68', lineHeight: 1.6, marginBottom: '32px'}}>
                          {post.description}
                       </p>

                       <div style={{marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#111111', fontWeight: 600}}>
                          Read Full Post <ChevronRight size={18} />
                       </div>
                    </article>
                 </Link>
              ))}
           </div>
       </main>

       <footer style={{padding: '120px 0 80px', borderTop: '1px solid #E5E5E5', textAlign: 'center'}}>
          <div style={{fontSize: '0.85rem', color: '#6B6A68'}}>
             © 2026 Pathgen Engineering. Built for the Fortnite developer community.
          </div>
       </footer>
    </div>
  );
}
