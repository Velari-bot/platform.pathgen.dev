import Link from 'next/link';
import { 
  Zap, 
  Activity, 
  Map as MapIcon, 
  Package, 
  TrendingUp, 
  Users, 
  Droplet, 
  Navigation, 
  Flag, 
  Crosshair, 
  Trophy, 
  FileText 
} from 'lucide-react';

const SECTIONS = [
  { id: 'zone', name: 'Zone', description: 'Phase timings, radii, and shrink data.', icon: Navigation, color: '#D97757' },
  { id: 'zone-damage', name: 'Zone Damage', description: 'DPS per phase and survival strategies.', icon: Activity, color: '#DC2626' },
  { id: 'surge', name: 'Storm Surge', description: 'Lobby size thresholds and damage rules.', icon: Zap, color: '#EAB308' },
  { id: 'siphon', name: 'Siphon', description: 'Health and shield rewards on elimination.', icon: Droplet, color: '#2563EB' },
  { id: 'matchmaking', name: 'Matchmaking', description: 'AI fill rates and lobby composition rules.', icon: Users, color: '#7C3AED' },
  { id: 'loot-containers', name: 'Loot Containers', description: 'Chest and ammo box drop rates.', icon: Package, color: '#059669' },
  { id: 'map-objects', name: 'Map Objects', description: 'Vending machines, mending machines, and foraged items.', icon: MapIcon, color: '#635BFF' },
  { id: 'bus-route', name: 'Bus Route', description: 'Common flight paths and spread analysis.', icon: Flag, color: '#F43F5E' },
  { id: 'drop-meta', name: 'Drop Meta', description: 'Optimal landing spots and contested areas.', icon: Crosshair, color: '#10B981' },
  { id: 'weapons', name: 'Weapons', description: 'Stat cards for all Chapter 7 Season 2 items.', icon: TrendingUp, color: '#F59E0B' },
  { id: 'ranked-scoring', name: 'Ranked Scoring', description: 'Placement vs. elimination point scaling.', icon: Trophy, color: '#EC4899' },
  { id: 'tournament-rules', name: 'Tournament Rules', description: 'Official competitive rulesets and guidelines.', icon: FileText, color: '#6B7280' },
];

export default function GameInfoPage() {
  return (
    <div className="content-area fade-in">
      <div className="page-header">
        <h1 className="page-title">Game Info</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Public reference for Chapter 7 Season 2 game mechanics.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        marginTop: '32px'
      }}>
        {SECTIONS.map((section) => (
          <Link 
            key={section.id} 
            href={`/info/${section.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="card pop-out-hover active-scale" style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '24px',
              cursor: 'pointer'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${section.color}15`,
                color: section.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <section.icon size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{section.name}</h3>
                <p style={{ 
                  marginTop: '8px', 
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5'
                }}>
                  {section.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
