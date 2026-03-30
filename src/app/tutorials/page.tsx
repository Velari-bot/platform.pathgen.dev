"use client"
import { useState } from 'react';
import { Map, Target, TrendingUp, User, BarChart3, Database, ChevronRight, Bookmark, ArrowLeft, Terminal, Copy, Check, Zap, Globe, Cpu, Clock, Code } from 'lucide-react';

interface TutorialStep {
  title: string;
  desc: string;
  code?: string;
  language?: string;
}

interface TutorialGuide {
  id: string;
  title: string;
  desc: string;
  tag: string;
  category: string;
  icon: React.ReactNode;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  time: string;
  steps: TutorialStep[];
}

export default function Tutorials() {
  const [activeCategory, setActiveCategory] = useState('Core Implementation');
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialGuide | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { title: 'Core Implementation', icon: <Database size={18} /> },
    { title: 'Visualization', icon: <Map size={18} /> },
    { title: 'Advanced Analytics', icon: <TrendingUp size={18} /> },
    { title: 'Gaming Tools', icon: <Target size={18} /> }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const guides: TutorialGuide[] = [
    { 
      id: 'parse-replay',
      title: "How to parse your first replay", 
      desc: "Learn how to use the POST /v1/replay/parse endpoint to extract high-fidelity telemetry from local and remote files.", 
      tag: "GETTING STARTED",
      category: "Core Implementation",
      difficulty: 'Beginner',
      time: '5 mins',
      icon: <Database size={24} />,
      steps: [
        {
          title: "Obtain your API Key",
          desc: "Log in to the Pathgen Console and navigate to the 'Keys' section. Copy your secret API key (rs_...). This key is required for all authorized requests.",
        },
        {
          title: "Prepare the Replay File",
          desc: "You can either host your .replay file on a public URL or provide a direct download link. For this tutorial, we will use a sample replay hosted on Pathgen R2.",
          code: "https://assets.pathgen.dev/samples/replays/FN_REPLAY_S2.replay",
          language: "url"
        },
        {
          title: "Execute the Parse Request",
          desc: "Send a POST request to our parsing engine. We recommend using cURL for testing or our official SDK for production.",
          code: `curl -X POST https://api.pathgen.dev/v1/replay/parse \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "file_url": "https://assets.pathgen.dev/samples/replays/FN_REPLAY_S2.replay" }'`,
          language: "bash"
        },
        {
          title: "Analyze the Result",
          desc: "The API will return a structured JSON object containing player movement, inventory changes, and combat logs. You can now use this data to populate your application.",
        }
      ]
    },
    { 
      id: 'stat-tracker',
      title: "Building a real-time stat tracker", 
      desc: "Integrate free endpoints to create a globally responsive overlay for your application or live stream.", 
      tag: "STATS",
      category: "Core Implementation",
      difficulty: 'Intermediate',
      time: '15 mins',
      icon: <User size={24} />,
      steps: [
        {
          title: "Configure Metadata Streams",
          desc: "Set up a webhook to receive real-time updates whenever a player's stats change. This reduces polling and ensures zero-latency updates.",
        },
        {
          title: "Connect to the Stats API",
          desc: "Use the Player Stats endpoint to fetch the initial state of the competitor's profile.",
          code: `fetch('https://api.pathgen.dev/v1/player/stats?id=aiden_b', {
  headers: { 'Authorization': 'Bearer YOUR_KEY' }
})`,
          language: "javascript"
        },
        {
          title: "Implement the Dashboard UI",
          desc: "Map the returned JSON to your UI components. Pathgen provides pre-computed delta values so you don't have to calculate percentage increases manually.",
        }
      ]
    },
    { 
      id: 'movement-map',
      title: "Displaying a 3D movement map", 
      desc: "Use the (x, y, t) telemetry to draw precise player paths and POI heatmaps on a map coordinate system.", 
      tag: "VISUALIZATION",
      category: "Visualization",
      difficulty: 'Advanced',
      time: '25 mins',
      icon: <Map size={24} />,
      steps: [
        {
          title: "Initialize Leaflet.js",
          desc: "Set up a standard Leaflet map instance. Use the Pathgen map tiles for the most accurate high-resolution Fortnite landscape.",
        },
        {
          title: "Fetch Coordinate Telemetry",
          desc: "Extract the 'locations' array from a parsed replay. Each entry contains the world space coordinates and a timestamp.",
          code: `const locations = replayData.players[0].locations; // [ {x, y, t}, ... ]`,
          language: "javascript"
        },
        {
          title: "Convert to Map Pixels",
          desc: "Use our coordinate transform utility to convert Fortnite world space units into map pixel coordinates.",
          code: `const pixelPos = pathgen.utils.worldToMap(loc.x, loc.y);`,
          language: "javascript"
        },
        {
          title: "Draw Polyline Paths",
          desc: "Render the player paths using SVG or Canvas for smooth performance even with thousands of data points.",
        }
      ]
    },
    { 
        id: 'ai-predict',
        title: "Predicting Outcomes with Fuser AI", 
        desc: "Leverage our Gemini-powered intelligence hub to predict rotation success based on zone patterns.", 
        tag: "AI",
        category: "Advanced Analytics",
        difficulty: 'Advanced',
        time: '20 mins',
        icon: <Zap size={24} />,
        steps: [
          {
            title: "Access the AI Hub",
            desc: "Ensure you have a Pro subscription to access the enhanced AI analytics suite.",
          },
          {
            title: "Submit Contextual Data",
            desc: "Send the current match state (zone index, player inventory, and nearby POIs) to the prediction engine.",
            code: `POST https://api.pathgen.dev/v1/ai/predict
{ "current_zone": 4, "player_id": "pro_gamer_1" }`,
            language: "bash"
          },
          {
            title: "Integrate Reasoning",
            desc: "The AI returns not just a probability, but the logic behind the rotation advice, which you can display to users.",
          }
        ]
      }
  ];

  const filteredGuides = guides.filter(guide => guide.category === activeCategory);

  if (selectedTutorial) {
    return (
      <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '1000px', margin: '0 auto'}}>
        <button 
          onClick={() => setSelectedTutorial(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'transparent', border: 'none', 
            color: 'var(--text-secondary)', fontWeight: 600, 
            cursor: 'pointer', marginBottom: '40px', fontSize: '0.95rem'
          }} className="pop-out-hover"
        >
          <ArrowLeft size={18} /> Back to Tutorials
        </button>

        <div style={{marginBottom: '64px'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px'}}>
              <span style={{background: 'rgba(217, 119, 87, 0.1)', color: '#D97757', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.05em'}}>
                {selectedTutorial.tag}
              </span>
              <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px'}}>
                <Clock size={14} /> {selectedTutorial.time}
              </span>
              <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px'}}>
                <Cpu size={14} /> {selectedTutorial.difficulty}
              </span>
           </div>
           <h1 style={{fontSize: '3.5rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '24px', lineHeight: 1.1}}>{selectedTutorial.title}</h1>
           <p style={{fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.6}}>{selectedTutorial.desc}</p>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '48px'}}>
          {selectedTutorial.steps.map((step, i) => (
            <div key={i} style={{display: 'flex', gap: '40px'}}>
               <div style={{flexShrink: 0}}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', 
                    background: '#000', color: '#fff', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: '1rem', fontWeight: 900
                  }}>
                    {i + 1}
                  </div>
               </div>
               <div style={{flex: 1}}>
                  <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px'}}>{step.title}</h3>
                  <p style={{fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: step.code ? '24px' : '0'}}>
                    {step.desc}
                  </p>
                  
                  {step.code && (
                    <div style={{
                        background: '#111827', borderRadius: '20px', 
                        overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)',
                        position: 'relative'
                    }}>
                        <div style={{
                            padding: '12px 24px', background: 'rgba(255,255,255,0.05)', 
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                           <span style={{fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em'}}>
                              {step.language || 'Code'}
                           </span>
                           <button 
                             onClick={() => handleCopy(step.code!, `step-${i}`)}
                             style={{background: 'transparent', border: 'none', color: '#fff', opacity: 0.4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}}
                             className="pop-out-hover"
                           >
                              {copiedId === `step-${i}` ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                              <span style={{fontSize: '0.7rem', fontWeight: 700}}>{copiedId === `step-${i}` ? 'Copied' : 'Copy'}</span>
                           </button>
                        </div>
                        <pre style={{
                          margin: 0, padding: '24px', color: '#fff', 
                          fontSize: '0.9rem', overflowX: 'auto', 
                          fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6,
                          background: 'transparent'
                        }}>
                          <code style={{background: 'transparent', padding: 0}}>{step.code}</code>
                        </pre>
                    </div>
                  )}
               </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '100px', padding: '64px', borderRadius: '40px', 
          background: '#000', color: '#fff', position: 'relative', overflow: 'hidden'
        }}>
           <div style={{position: 'relative', zIndex: 2}}>
              <h3 style={{fontSize: '2rem', fontWeight: 900, marginBottom: '16px'}}>Move faster with our SDK</h3>
              <p style={{fontSize: '1.1rem', opacity: 0.7, maxWidth: '600px', lineHeight: 1.6, marginBottom: '32px'}}>
                Skip the boilerplate and use our official libraries for Node.js, Python, and Go. Ready to go for production.
              </p>
              <div style={{display: 'flex', gap: '16px'}}>
                 <button style={{padding: '16px 32px', borderRadius: '14px', background: '#D97757', color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer'}} className="pop-out-hover active-scale">
                    Get NPM Package
                 </button>
                 <button style={{padding: '16px 32px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '1rem', cursor: 'pointer'}} className="pop-out-hover active-scale">
                    View on GitHub
                 </button>
              </div>
           </div>
           {/* Abstract BG Decor */}
           <div style={{position: 'absolute', bottom: '-50px', right: '-50px', width: '300px', height: '300px', background: 'rgba(217, 119, 87, 0.2)', filter: 'blur(80px)', borderRadius: '50%'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{paddingBottom: '160px', maxWidth: '1200px', margin: '0 auto'}}>
      
      <div style={{marginBottom: '80px'}}>
         <h1 style={{fontSize: '4rem', fontWeight: 900, letterSpacing: '-0.06em', marginBottom: '20px', lineHeight: 1.1}}>Industry-standard implementation guides.</h1>
         <p style={{fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.6}}>
            Deep dives, implementation patterns, and specialized workflows designed for high-performance applications.
         </p>
      </div>

      <div style={{display: 'flex', gap: '80px'}}>
         {/* Sidebar Navigation */}
         <div style={{width: '260px', flexShrink: 0}}>
            <h4 style={{fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px'}}>PLATFORM REGISTRIES</h4>
            <nav style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
               {categories.map((cat) => (
                  <button 
                    key={cat.title} 
                    onClick={() => setActiveCategory(cat.title)}
                    style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      padding: '14px 20px', 
                      borderRadius: '16px', 
                      fontSize: '0.95rem', 
                      border: 'none', 
                      background: activeCategory === cat.title ? 'rgba(217, 119, 87, 0.1)' : 'transparent', 
                      color: activeCategory === cat.title ? '#D97757' : 'var(--text-secondary)', 
                      fontWeight: activeCategory === cat.title ? 800 : 500, 
                      cursor: 'pointer', 
                      textAlign: 'left', 
                      transition: 'all 0.15s'
                    }} className="active-scale">
                     {cat.icon}
                     {cat.title}
                  </button>
               ))}
            </nav>

            <div style={{marginTop: '48px', padding: '32px', background: 'var(--bg-sidebar)', borderRadius: '28px', border: '1px solid var(--border-color)'}}>
               <div style={{width: '40px', height: '40px', borderRadius: '12px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'}}>
                  <Globe size={20} color="#D97757" />
               </div>
               <h4 style={{fontSize: '1rem', fontWeight: 800, marginBottom: '12px'}}>Developer Hub</h4>
               <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px'}}>Blocked on an integration? Join 2,000+ developers in our official Discord.</p>
               <button style={{width: '100%', padding: '12px', borderRadius: '12px', background: '#000', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'}} className="pop-out-hover active-scale">Join Community</button>
            </div>
         </div>

         {/* Grid Area */}
         <div style={{flex: 1}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
               {filteredGuides.length > 0 ? (
                  filteredGuides.map((guide, i) => (
                     <div 
                        key={i} 
                        onClick={() => setSelectedTutorial(guide)}
                        style={{
                          padding: '48px', background: '#fff', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '32px', display: 'flex', 
                          alignItems: 'center', justifyContent: 'space-between', 
                          cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                        }} className="pop-out-hover border-button-hover"
                     >
                        <div style={{display: 'flex', gap: '40px', alignItems: 'center'}}>
                           <div style={{
                              width: '72px', height: '72px', borderRadius: '20px', 
                              background: 'var(--bg-sidebar)', border: '1px solid var(--border-color)', 
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              color: '#D97757'
                           }}>
                              {guide.icon}
                           </div>
                           <div>
                              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                                 <span style={{fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-secondary)', letterSpacing: '0.1em'}}>{guide.tag}</span>
                                 <span style={{width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-color)'}}></span>
                                 <span style={{fontSize: '0.75rem', fontWeight: 700, color: '#10B981'}}>{guide.time}</span>
                              </div>
                              <h3 style={{fontSize: '1.75rem', fontWeight: 900, marginBottom: '12px', color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>{guide.title}</h3>
                              <p style={{fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.5, maxWidth: '600px'}}>{guide.desc}</p>
                           </div>
                        </div>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%', 
                            border: '1px solid var(--border-color)', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', 
                            color: 'var(--text-primary)', transition: 'all 0.3s'
                        }}>
                           <ChevronRight size={20} />
                        </div>
                     </div>
                  ))
               ) : (
                  <div style={{padding: '100px', textAlign: 'center', background: 'var(--bg-sidebar)', borderRadius: '40px', border: '1px dashed var(--border-color)'}}>
                     <h3 style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px', color: 'var(--text-primary)'}}>Authoring content...</h3>
                     <p style={{fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto'}}>We&apos;re currently documenting specialized patterns for this category. Check back soon.</p>
                  </div>
               )}
            </div>

            <div style={{
                marginTop: '80px', padding: '64px', 
                background: 'var(--bg-sidebar)', border: '1px dashed var(--border-color)', 
                borderRadius: '40px', textAlign: 'center'
            }}>
               <h3 style={{fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px'}}>Looking for something specific?</h3>
               <p style={{fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px'}}>
                  Request a tutorial or contribute your own implementation guide to our technical registry.
               </p>
               <div style={{display: 'flex', justifyContent: 'center', gap: '20px'}}>
                  <button style={{padding: '14px 28px', background: '#000', color: '#fff', borderRadius: '14px', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer'}} className="pop-out-hover active-scale">Request Tutorial</button>
                  <button style={{padding: '14px 28px', border: '1px solid var(--border-color)', background: '#fff', borderRadius: '14px', color: 'var(--text-primary)', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer'}} className="pop-out-hover active-scale">Submit Patterns</button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

