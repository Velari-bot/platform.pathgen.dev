"use client"
import { useState } from 'react';
import { Map, Target, TrendingUp, User, BarChart3, Database, ChevronRight, Bookmark } from 'lucide-react';

export default function Tutorials() {
  const [activeCategory, setActiveCategory] = useState('Core Implementation');

  const categories = [
    { title: 'Core Implementation', icon: <Database size={18} /> },
    { title: 'Visualization', icon: <Map size={18} /> },
    { title: 'Advanced Analytics', icon: <TrendingUp size={18} /> },
    { title: 'Gaming Tools', icon: <Target size={18} /> }
  ];

  const guides = [
    { 
      title: "How to parse your first replay", 
      desc: "Learn how to use the POST /v1/replay/parse endpoint with local files.", 
      tag: "GETTING STARTED",
      category: "Core Implementation",
      icon: <Database size={24} color="#000" />
    },
    { 
      title: "How to build a real-time stat tracker", 
      desc: "Integrate free endpoints to create an overlay for your application or stream.", 
      tag: "STATS",
      category: "Core Implementation",
      icon: <User size={24} color="#000" />
    },
    { 
      title: "Displaying a 3D movement map", 
      desc: "Use the (x, y, t) telemetry to draw precise player paths on a map coordinate system.", 
      tag: "VISUALIZATION",
      category: "Visualization",
      icon: <Map size={24} color="#000" />
    },
    { 
      title: "Implementing session analysis for FNCS", 
      desc: "Group multiple match analyses into a single tournament session for deeper player intel.", 
      tag: "ANALYTICS",
      category: "Advanced Analytics",
      icon: <BarChart3 size={24} color="#000" />
    },
    { 
      title: "Using the Cosmetics Browser", 
      desc: "Access the Item Shop and news database without consuming credits.", 
      tag: "FREE",
      category: "Gaming Tools",
      icon: <Bookmark size={24} color="#000" />
    }
  ];

  const filteredGuides = guides.filter(guide => guide.category === activeCategory);

  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '1200px', margin: '0 auto'}}>
      
      <div style={{marginBottom: '64px'}}>
         <h1 style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '16px'}}>Developer Tutorials</h1>
         <p style={{fontSize: '1.25rem', color: '#6B7280', maxWidth: '750px', lineHeight: 1.6}}>
            Deep dives, implementation patterns, and industry-standard workflows for building on the Pathgen platform.
         </p>
      </div>

      <div style={{display: 'flex', gap: '80px'}}>
         {/* Sidebar Navigation */}
         <div style={{width: '240px', flexShrink: 0}}>
            <h4 style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px'}}>CATEGORIES</h4>
            <nav style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
               {categories.map((cat) => (
                  <button 
                    key={cat.title} 
                    onClick={() => setActiveCategory(cat.title)}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      fontSize: '0.95rem', 
                      border: 'none', 
                      background: activeCategory === cat.title ? '#F3F4F6' : 'transparent', 
                      color: activeCategory === cat.title ? '#000' : '#6B7280', 
                      fontWeight: activeCategory === cat.title ? 800 : 500, 
                      cursor: 'pointer', 
                      textAlign: 'left', 
                      transition: 'all 0.15s'
                    }}>
                     {cat.icon}
                     {cat.title}
                  </button>
               ))}
            </nav>

            <div style={{marginTop: '48px', padding: '24px', background: '#000', borderRadius: '24px', color: '#fff'}}>
               <h4 style={{fontSize: '0.9rem', fontWeight: 800, marginBottom: '12px'}}>Tutorial Support</h4>
               <p style={{fontSize: '0.8rem', color: '#9CA3AF', lineHeight: 1.5, marginBottom: '20px'}}>Blocked on an integration? Our Discord is live 24/7 with core maintainers.</p>
               <button style={{width: '100%', padding: '10px', borderRadius: '10px', background: '#fff', color: '#000', border: 'none', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer'}}>Get Support</button>
            </div>
         </div>

         {/* Grid Area */}
         <div style={{flex: 1}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
               {filteredGuides.length > 0 ? (
                  filteredGuides.map((guide, i) => (
                     <div key={i} style={{padding: '40px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'}} className="pop-out-hover">
                        <div style={{display: 'flex', gap: '32px', alignItems: 'center'}}>
                           <div style={{width: '64px', height: '64px', borderRadius: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                              {guide.icon}
                           </div>
                           <div>
                              <div style={{fontSize: '0.7rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: '8px'}}>{guide.tag}</div>
                              <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: '#111827'}}>{guide.title}</h3>
                              <p style={{fontSize: '1rem', color: '#6B7280', lineHeight: 1.5}}>{guide.desc}</p>
                           </div>
                        </div>
                        <ChevronRight size={24} color="#E5E7EB" style={{flexShrink: 0, marginLeft: '40px'}} />
                     </div>
                  ))
               ) : (
                  <div style={{padding: '80px', textAlign: 'center', background: '#F9FAFB', borderRadius: '32px', border: '1px solid #E5E7EB'}}>
                     <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#111827'}}>No tutorials yet</h3>
                     <p style={{fontSize: '1rem', color: '#6B7280'}}>We&apos;re currently authoring guides for this category. Check back soon!</p>
                  </div>
               )}
            </div>

            <div style={{marginTop: '64px', padding: '48px', background: '#F9FAFB', border: '1px dashed #E5E7EB', borderRadius: '32px', textAlign: 'center'}}>
               <h3 style={{fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px'}}>Looking for something specific?</h3>
               <p style={{fontSize: '1rem', color: '#6B7280', marginBottom: '32px'}}>Request a tutorial or contribute your own implementation guide to our open-source documentation.</p>
               <div style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
                  <button style={{padding: '12px 24px', background: '#000', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'}}>Request Tutorial</button>
                  <button style={{padding: '12px 24px', border: '1px solid #E5E7EB', background: '#fff', borderRadius: '12px', color: '#111827', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'}}>View on GitHub</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
