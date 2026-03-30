"use client"
import { useState, useEffect, useRef } from 'react';
import { Shield, CreditCard, Box, Terminal, AlertTriangle, Clock, History, Package, Zap } from 'lucide-react';
import { ENDPOINTS_DATA } from '@/data/endpoints';
import CopyButton from '@/components/CopyButton';

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // The scrollable container is the .content-area div
    const scrollContainer = document.querySelector('.content-area');
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleIntersect, {
      root: scrollContainer,
      rootMargin: '-10% 0px -80% 0px',
      threshold: [0, 0.1]
    });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.current?.observe(section));

    return () => observer.current?.disconnect();
  }, []);

  const groups = [
    { 
      section: "PLATFORM", 
      items: [
        { id: 'overview', title: 'Overview', icon: <Box size={18} /> },
        { id: 'auth', title: 'Authentication', icon: <Shield size={18} /> },
        { id: 'credits', title: 'Credits & Billing', icon: <CreditCard size={18} /> }
      ]
    },
    {
      section: "GUIDES",
      items: [
        { id: 'map-integration', title: 'Map Integration', icon: <Box size={18} /> },
        { id: 'ai-analysis', title: 'AI Analysis', icon: <Zap size={18} /> }
      ]
    },
    { 
      section: "API REFERENCE", 
      items: [
        { id: 'reference', title: 'Full API Reference', icon: <Terminal size={18} /> },
        { id: 'limits', title: 'Rate Limits', icon: <Clock size={18} /> },
        { id: 'errors', title: 'Error Codes', icon: <AlertTriangle size={18} /> }
      ]
    }
  ];

  const scrollToSection = (id: string) => {
     setActiveSection(id);
     const element = document.getElementById(id);
     if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
     }
  };

  return (
    <div className="fade-in" style={{display: 'flex', gap: '64px', minHeight: '100vh', paddingBottom: '120px'}}>
      
      {/* Anchor Navigation */}
      <div style={{width: '240px', position: 'sticky', top: '48px', height: 'fit-content'}}>
         <h4 style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px'}}>DOCUMENTATION</h4>
         <nav style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
            {groups.map((group) => (
              <div key={group.section}>
                <div style={{fontSize: '0.65rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.05em', marginBottom: '12px'}}>{group.section}</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                  {group.items.map((item) => (
                    <a 
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        textDecoration: 'none',
                        color: activeSection === item.id ? '#000' : '#6B7280',
                        background: activeSection === item.id ? '#F3F4F6' : 'transparent',
                        fontWeight: activeSection === item.id ? 600 : 500,
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      {item.icon}
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
         </nav>
      </div>

      {/* Main Content Area */}
      <div style={{flex: 1, maxWidth: '900px'}}>
         
         <section id="overview" style={{paddingTop: '0', marginBottom: '80px', scrollMarginTop: '48px'}}>
            <h1 style={{fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '24px'}}>Omni-Source Blueprint</h1>
            <p style={{fontSize: '1.25rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Pathgen is now a <strong>Fused API</strong>. We reconcile data across FN-API, Osirion, and our own Parser to return a "True North" dataset with 99.9% accuracy. 
            </p>
            <div className="card" style={{background: '#F3F4F6', border: 'none', padding: '32px'}}>
               <h3 style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px'}}>R2 Edge Mirroring</h3>
               <p style={{fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.6}}>
                  All Discovery and Cosmetic assets are mirrored to our <strong>Cloudflare R2</strong> storage. This ensures zero-latency image delivery and zero egress fees for your application.
               </p>
            </div>
         </section>

         <section id="auth" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Authentication & Governance</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px'}}>
               API keys are used to authenticate requests. We implement a <strong>Beta Access Guard</strong> to restrict high-compute and experimental features.
            </p>
            <div style={{position: 'relative', marginBottom: '32px'}}>
              <pre style={{width: '100%', background: '#000', color: '#fff', padding: '24px', borderRadius: '16px', fontSize: '0.95rem', fontFamily: 'JetBrains Mono', border: '1px solid #1f1f1f'}}>
                 Authorization: Bearer rs_your_api_key_here
              </pre>
              <div style={{position: 'absolute', top: '16px', right: '16px'}}>
                 <CopyButton text="Authorization: Bearer rs_your_api_key_here" color="#6B7280" />
              </div>
            </div>
            
            <div className="card" style={{background: '#FFFBEB', border: '1px solid #FDE68A', padding: '32px', borderRadius: '24px'}}>
               <h3 style={{fontSize: '1.1rem', fontWeight: 700, color: '#92400E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Shield size={20} /> Beta Access Required
               </h3>
               <p style={{fontSize: '0.95rem', color: '#92400E', lineHeight: 1.6}}>
                  Endpoints marked as <strong>Beta</strong> return a <code>403 Forbidden (BETA_ACCESS_REQUIRED)</code> unless your keys have been explicitly authorized in our governance records.
                  Contact support or your account manager to request access to AI Coaching and Advanced Visualization layers.
               </p>
            </div>
         </section>

         <section id="credits" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Tiers & Credits</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Pathgen is a dual-structure SaaS. The <strong>Free Tier</strong> provides core data access, while <strong>Pro</strong> unlocks the AI engine and full automation.
            </p>
            
            <div className="card" style={{padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', marginBottom: '48px'}}>
               <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                     <tr style={{background: '#F9FAFB'}}>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>CAPABILITY</th>
                        <th style={{padding: '16px 24px', textAlign: 'center', fontSize: '0.75rem', color: '#6B7280'}}>FREE</th>
                        <th style={{padding: '16px 24px', textAlign: 'center', fontSize: '0.75rem', color: '#6B7280'}}>PRO</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px'}}>Core Replay Parsing</td>
                        <td style={{padding: '16px 24px', textAlign: 'center'}}>✅ YES</td>
                        <td style={{padding: '16px 24px', textAlign: 'center'}}>✅ YES</td>
                     </tr>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px'}}>Gemini AI Intelligence Layer</td>
                        <td style={{padding: '16px 24px', textAlign: 'center', opacity: 0.3}}>❌ LOCKED</td>
                        <td style={{padding: '16px 24px', textAlign: 'center'}}>💎 UNLOCKED</td>
                     </tr>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px', fontWeight: 600}}>Real-time Webhooks (Push)</td>
                        <td style={{padding: '16px 24px', textAlign: 'center', opacity: 0.3}}>❌ DISABLED</td>
                        <td style={{padding: '16px 24px', textAlign: 'center'}}>💎 UNLOCKED</td>
                     </tr>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px'}}>Rate limits</td>
                        <td style={{padding: '16px 24px', textAlign: 'center'}}>10 req/m</td>
                        <td style={{padding: '16px 24px', textAlign: 'center'}}>100+ req/m</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>

         <section id="webhooks" style={{paddingTop: '80px', marginBottom: '120px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Webhooks (Pro Only)</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Webhooks allow your application to receive real-time notifications when events happen in the Fortnite ecosystem or your parsing tasks complete.
            </p>
            <div className="card" style={{background: '#F8FAFC', border: 'none', padding: '32px', borderRadius: '24px'}}>
               <h3 style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px'}}>Signature Verification</h3>
               <p style={{fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6}}>
                  Each webhook request includes a <code>Pathgen-Signature</code> header. Use your webhook secret to compute the HMAC-SHA256 hash and verify that the request originated from our edge cluster.
               </p>
            </div>
         </section>
          <section id="map-integration" style={{paddingTop: '80px', marginBottom: '120px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Map Integration (Leaflet)</h2>
            <p style={{fontSize: '1.25rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Our high-fidelity tile engine is built for seamless integration with Leaflet. A full interactive replay map can be implemented in just a few lines of code.
            </p>

            {/* Step Summary */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '48px'}}>
               {[
                 { step: "1", title: "GET /v1/map", desc: "Get tile URL and world bounds" },
                 { step: "2", title: "POST /v1/movement", desc: "Get player positions" },
                 { step: "3", title: "Init Leaflet", desc: "Map renders automatically" },
                 { step: "4", title: "Plot Tracks", desc: "Convert coords and render" }
               ].map((s, i) => (
                 <div key={i} style={{padding: '24px', background: '#F9FAFB', borderRadius: '20px', border: '1px solid #E5E7EB'}}>
                    <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '12px'}}>STEP {s.step}</div>
                    <div style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px'}}>{s.title}</div>
                    <div style={{fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.4}}>{s.desc}</div>
                 </div>
               ))}
            </div>

            <div style={{marginBottom: '48px'}}>
              <h3 style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px'}}>Production Implementation</h3>
              <p style={{fontSize: '1rem', color: '#6B7280', marginBottom: '24px', lineHeight: 1.6}}>
                The following is a complete, standalone implementation that fetches map metadata, initializes the high-res engine, and plots replay telemetry.
              </p>
              
              <div style={{position: 'relative'}}>
                <div style={{background: '#000', borderRadius: '24px', border: '1px solid #1f1f1f', overflow: 'hidden'}}>
                  <div style={{background: '#111', padding: '12px 24px', borderBottom: '1px solid #1f1f1f', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{fontSize: '0.7rem', fontWeight: 800, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.1em'}}>index.html</div>
                    <CopyButton text={`<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <style>
    #map { width: 100%; height: 600px; background: #0a0a1a; border-radius: 20px; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  // Step 1: get map config from Pathgen API
  const config = await fetch('https://api.pathgen.dev/v1/map').then(r => r.json());

  // Step 2: init Leaflet
  const MAX_ZOOM = config.max_zoom;
  const MAP_PX   = 256 * Math.pow(2, MAX_ZOOM);

  const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: config.min_zoom,
    maxZoom: MAX_ZOOM,
    zoom: 1
  });

  // Step 3: add tile layer using Pathgen tiles
  L.tileLayer(config.tile_url, {
    tileSize: config.tile_size,
    maxZoom: MAX_ZOOM,
    noWrap: true,
    keepBuffer: 4
  }).addTo(map);

  // Step 4: center map
  map.setView(
    L.CRS.Simple.pointToLatLng(L.point(MAP_PX/2, MAP_PX/2), MAX_ZOOM), 
    1
  );

  // Helper to plot world coordinates
  function worldToLatLng(x, y) {
    const WORLD_MIN  = config.world_bounds.min_x;
    const WORLD_SIZE = config.world_bounds.max_x - WORLD_MIN;
    const px = ((x - WORLD_MIN) / WORLD_SIZE) * MAP_PX;
    const py = ((y - WORLD_MIN) / WORLD_SIZE) * MAP_PX;
    return L.CRS.Simple.pointToLatLng(L.point(px, py), MAX_ZOOM);
  }

  // Plot POI labels
  config.pois.forEach(poi => {
    L.marker(worldToLatLng(poi.x, poi.y))
      .bindTooltip(poi.name, { permanent: true, direction: 'top' })
      .addTo(map);
  });

  // Example Replay Data (from POST /v1/replay/movement)
  const replayData = {
    drop_location:  { x: 7104,  y: 1216  },
    death_location: { x: 12416, y: -9600 },
    player_track: [
      { x: 7104,  y: 1216  },
      { x: 8192,  y: 2048  },
      { x: 12416, y: -9600 }
    ]
  };

  // Drop / Death markers
  L.circleMarker(worldToLatLng(replayData.drop_location.x, replayData.drop_location.y), { radius: 8, color: '#00ff88', fillColor: '#00ff88', fillOpacity: 1 }).addTo(map);
  L.circleMarker(worldToLatLng(replayData.death_location.x, replayData.death_location.y), { radius: 8, color: '#ff4444', fillColor: '#ff4444', fillOpacity: 1 }).addTo(map);

  // Player Track Line
  const trackPoints = replayData.player_track.map(p => worldToLatLng(p.x, p.y));
  L.polyline(trackPoints, { color: '#00d4ff', weight: 2, opacity: 0.8 }).addTo(map);
</script>
</body>
</html>`} color="#6B7280" />
                  </div>
                  <div style={{maxHeight: '400px', overflowY: 'auto', padding: '24px'}}>
                    <pre style={{margin: 0, fontSize: '0.85rem', color: '#fff', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono', background: 'transparent', padding: 0, opacity: 0.9}}>
                      {`<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <style>
    #map { width: 100%; height: 600px; background: #0a0a1a; border-radius: 20px; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  // Step 1: get map config from Pathgen API
  const config = await fetch('https://api.pathgen.dev/v1/map').then(r => r.json());

  // Step 2: init Leaflet
  const MAX_ZOOM = config.max_zoom;
  const MAP_PX   = 256 * Math.pow(2, MAX_ZOOM);

  const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: config.min_zoom,
    maxZoom: MAX_ZOOM,
    zoom: 1
  });

  // Step 3: add tile layer using Pathgen tiles
  L.tileLayer(config.tile_url, {
    tileSize: config.tile_size,
    maxZoom: MAX_ZOOM,
    noWrap: true,
    keepBuffer: 4
  }).addTo(map);

  // Step 4: center map
  map.setView(
    L.CRS.Simple.pointToLatLng(L.point(MAP_PX/2, MAP_PX/2), MAX_ZOOM), 
    1
  );

  // Helper to plot world coordinates
  function worldToLatLng(x, y) {
    const WORLD_MIN  = config.world_bounds.min_x;
    const WORLD_SIZE = config.world_bounds.max_x - WORLD_MIN;
    const px = ((x - WORLD_MIN) / WORLD_SIZE) * MAP_PX;
    const py = ((y - WORLD_MIN) / WORLD_SIZE) * MAP_PX;
    return L.CRS.Simple.pointToLatLng(L.point(px, py), MAX_ZOOM);
  }

  // Plot POI labels
  config.pois.forEach(poi => {
    L.marker(worldToLatLng(poi.x, poi.y))
      .bindTooltip(poi.name, { permanent: true, direction: 'top' })
      .addTo(map);
  });

  // Example Replay Data (from POST /v1/replay/movement)
  const replayData = {
    drop_location:  { x: 7104,  y: 1216  },
    death_location: { x: 12416, y: -9600 },
    player_track: [
      { x: 7104,  y: 1216  },
      { x: 8192,  y: 2048  },
      { x: 12416, y: -9600 }
    ]
  };

  // Drop / Death markers
  L.circleMarker(worldToLatLng(replayData.drop_location.x, replayData.drop_location.y), { radius: 8, color: '#00ff88', fillColor: '#00ff88', fillOpacity: 1 }).addTo(map);
  L.circleMarker(worldToLatLng(replayData.death_location.x, replayData.death_location.y), { radius: 8, color: '#ff4444', fillColor: '#ff4444', fillOpacity: 1 }).addTo(map);

  // Player Track Line
  const trackPoints = replayData.player_track.map(p => worldToLatLng(p.x, p.y));
  L.polyline(trackPoints, { color: '#00d4ff', weight: 2, opacity: 0.8 }).addTo(map);
</script>
</body>
</html>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{background: '#F3F4F6', border: 'none', padding: '32px'}}>
              <h3 style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px'}}>Hyper-Map Fidelity</h3>
              <p style={{fontSize: '0.95rem', color: '#6B7280', lineHeight: 1.6}}>
                Our tiling system uses Lanczos3 kernels for resampling, resulting in significantly crisper text and edges than standard bilinear scaling. 
                This ensures a premium "pro" feel for your map tools.
              </p>
            </div>
          </section>

          <section id="ai-analysis" style={{paddingTop: '80px', marginBottom: '120px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
             <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>AI Analysis & Coaching</h2>
             <p style={{fontSize: '1.25rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
                Our exclusive AI suite uses Gemini 2.0 Flash to provide deep tactical insights from your replay data. This is the first time high-level coaching has been available via API.
             </p>

             <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px'}}>
                {[
                  { title: "Tactical Coach", desc: "Get a breakdown of positions, mechanics, and resource management for any single match.", cost: 30 },
                  { title: "Session Patterning", desc: "Analyze multiple matches to find consistency ratings and recurring death patterns.", cost: 50 },
                  { title: "Weapon Mastery", desc: "Compare equip counts and damage efficiency to optimize your loadouts.", cost: 20 },
                  { title: "Landing Strategy", desc: "Get probability-based drop recommendations for any given bus route.", cost: 20 }
                ].map((feature, i) => (
                  <div key={i} style={{padding: '32px', background: '#F9FAFB', borderRadius: '24px', border: '1px solid #E5E7EB'}}>
                     <div style={{width: '40px', height: '40px', borderRadius: '12px', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                        <Zap size={20} />
                     </div>
                     <h3 style={{fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px'}}>{feature.title}</h3>
                     <p style={{fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '20px'}}>{feature.desc}</p>
                     <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#000'}}>{feature.cost} CREDITS</div>
                  </div>
                ))}
             </div>

             <div className="card" style={{background: '#000', border: 'none', padding: '40px', color: '#fff'}}>
               <h3 style={{fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px'}}>How it works</h3>
               <p style={{fontSize: '1rem', color: '#9CA3AF', lineHeight: 1.6, marginBottom: '24px'}}>
                 The engine feeds parsed telemetry (movement, events, building) into a custom Gemini prompt optimized for Fortnite battle royale tactical theory. 
                 The result is structured JSON that can be displayed directly in your application's UI.
               </p>
               <div style={{display: 'flex', gap: '8px', alignItems: 'center', color: '#10B981', fontSize: '0.9rem', fontWeight: 600}}>
                  <div style={{width: '8px', height: '8px', background: '#10B981', borderRadius: '50%'}}></div>
                  Available now via /v1/ai/* endpoints
               </div>
             </div>
          </section>

         <section id="reference" style={{paddingTop: '80px', marginBottom: '120px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Full API Reference</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '48px'}}>
               Exhaustive reference for every available endpoint. Includes methods, costs, and response shapes.
            </p>

            {ENDPOINTS_DATA.map((section, sIdx) => (
              <div key={sIdx} style={{marginBottom: '64px'}}>
                 <h3 style={{fontSize: '1.25rem', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px'}}>{section.title}</h3>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                   {section.endpoints.map((ep, eIdx) => (
                      <div key={eIdx} className="card" style={{padding: '32px', border: '1px solid #E5E7EB', borderRadius: '24px'}}>
                         <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                            <span style={{
                               padding: '4px 10px', 
                               borderRadius: '6px', 
                               background: ep.status === 'beta' ? '#FEF3C7' : '#F3F4F6', 
                               color: ep.status === 'beta' ? '#92400E' : '#000', 
                               fontSize: '0.75rem', 
                               fontWeight: 800
                            }}>{ep.status === 'beta' ? 'BETA' : ep.method}</span>
                            <span style={{fontFamily: 'JetBrains Mono', fontSize: '1rem', fontWeight: 600, color: '#111827'}}>{ep.path}</span>
                            {(ep.credits !== undefined && ep.credits !== null && String(ep.credits) !== '0') && (
                              <span style={{marginLeft: 'auto', background: '#000', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700}}>
                                 {ep.credits} Credits
                              </span>
                            )}
                         </div>
                         <p style={{fontSize: '0.95rem', color: '#4B5563', marginBottom: '20px', lineHeight: 1.5}}>{ep.description}</p>
                         
                         <div style={{background: '#000', borderRadius: '16px', padding: '24px', border: '1px solid #1f1f1f', overflowX: 'auto', position: 'relative'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                               <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase'}}>Response Example</div>
                               <CopyButton text={ep.response || ''} size={14} color="#6B7280" />
                            </div>
                            <pre style={{margin: 0, fontSize: '0.85rem', color: '#fff', whiteSpace: 'pre-wrap', fontFamily: 'JetBrains Mono', background: 'transparent', padding: 0, opacity: 0.9}}>
                               {ep.response}
                            </pre>
                         </div>
                      </div>
                   ))}
                 </div>
              </div>
            ))}
         </section>

         <section id="schema" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Response Schema</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               A full replay parse returns the following core structure.
            </p>
            <div style={{background: '#000', color: '#fff', padding: '32px', borderRadius: '24px', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', overflowX: 'auto', border: '1px solid #1f1f1f', opacity: 0.9, position: 'relative'}}>
               <div style={{position: 'absolute', top: '24px', right: '24px'}}>
                  <CopyButton text={`{
  "match_id": "string",
  "version": "string",
  "data": {
    "overview": { ... },
    "combat_log": [ ... ],
    "player_path": [ { x, y, z, t }, ... ]
  }
}`} color="#6B7280" />
               </div>
               <pre style={{margin: 0}}>{`{
  "match_id": "string",
  "version": "string",
  "data": {
    "overview": { ... },
    "combat_log": [ ... ],
    "player_path": [ { x, y, z, t }, ... ]
  }
}`}</pre>
            </div>
         </section>

         <section id="errors" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Error Codes</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '32px'}}>
               Common error codes returned by the API.
            </p>
            <div className="card" style={{padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB'}}>
               <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                     <tr style={{background: '#F9FAFB'}}>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>CODE</th>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>STATUS</th>
                        <th style={{padding: '16px 24px', textAlign: 'left', fontSize: '0.75rem', color: '#6B7280'}}>REASON</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px', fontWeight: 700}}>INVALID_KEY</td>
                        <td style={{padding: '16px 24px'}}>401</td>
                        <td style={{padding: '16px 24px', color: '#6B7280'}}>API key is missing or invalid.</td>
                     </tr>
                     <tr style={{borderTop: '1px solid #F3F4F6', background: '#fff'}}>
                        <td style={{padding: '16px 24px', fontWeight: 700}}>INSUFFICIENT_CREDITS</td>
                        <td style={{padding: '16px 24px'}}>402</td>
                        <td style={{padding: '16px 24px', color: '#6B7280'}}>Account balance is below the required amount.</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </section>

         <section id="limits" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Rate Limits</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px'}}>
               <div style={{flex: 1, padding: '24px', background: '#F9FAFB', borderRadius: '16px', border: '1px solid #E5E7EB'}}>
                  <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px'}}>FREE TIER</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 800}}>60 / min</div>
               </div>
               <div style={{flex: 1, padding: '24px', background: '#F4F4F5', borderRadius: '16px', border: '1px solid #E5E7EB'}}>
                  <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#9CA3AF', marginBottom: '8px'}}>PAID TIER</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 800}}>2,000 / min</div>
               </div>
            </div>
         </section>

         <section id="versions" style={{paddingTop: '80px', marginBottom: '80px', borderTop: '1px solid #F3F4F6', scrollMarginTop: '48px'}}>
            <h2 style={{fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '24px'}}>Game Versions</h2>
            <p style={{fontSize: '1.1rem', color: '#4B5563', lineHeight: 1.6, marginBottom: '24px'}}>
               We currently support all replays generated in <strong>Fortnite Chapter 7 Season 2</strong>.
            </p>
            <div style={{display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px'}}>
               <History size={20} color="#000" />
               <span style={{fontSize: '0.9rem', color: '#000', fontWeight: 500}}>Backwards compatibility for Chapter 4-6 is currently in beta.</span>
            </div>
         </section>

      </div>
    </div>
  );
}
