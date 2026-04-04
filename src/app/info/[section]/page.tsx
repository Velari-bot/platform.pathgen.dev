import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Info, Trophy, Map as MapIcon, Zap, Droplet, Users, Navigation, Activity } from 'lucide-react';
import WeaponsList from '@/app/info/[section]/weapons-list';

const SECTION_DATA = {
  'zone': {
    title: 'Zone',
    description: 'Phase timing and radii for Chapter 7 Season 2.',
    data: [
      { phase: 1,  radius: '105723cm', wait: '170s', shrink: '105s' },
      { phase: 2,  radius: '82000cm',  wait: '80s', shrink: '75s' },
      { phase: 3,  radius: '63000cm',  wait: '80s', shrink: '65s' },
      { phase: 4,  radius: '47000cm',  wait: '80s', shrink: '55s' },
      { phase: 5,  radius: '34000cm',  wait: '70s', shrink: '50s' },
      { phase: 6,  radius: '23000cm',  wait: '60s', shrink: '45s' },
      { phase: 7,  radius: '14000cm',  wait: '50s', shrink: '40s' },
      { phase: 8,  radius: '8000cm',   wait: '45s', shrink: '35s' },
      { phase: 9,  radius: '4500cm',   wait: '40s', shrink: '30s' },
      { phase: 10, radius: '2000cm',   wait: '35s', shrink: '25s' },
      { phase: 11, radius: '800cm',    wait: '30s', shrink: '20s' },
      { phase: 12, radius: '0cm',      wait: '0s', shrink: '15s' },
    ],
    updated: '2026-04-03',
  },
  'zone-damage': {
    title: 'Zone Damage',
    description: 'DPS per phase and survival strategies.',
    data: [
      { phase: '1-3', damage: '1 DPS' },
      { phase: '4-5', damage: '2 DPS' },
      { phase: '6',   damage: '3 DPS' },
      { phase: '7',   damage: '4 DPS' },
      { phase: '8',   damage: '5 DPS' },
      { phase: '9-10', damage: '7 DPS' },
      { phase: '11-12', damage: '8 DPS' },
    ],
    updated: '2026-04-03',
  },
  'siphon': {
    title: 'Siphon',
    description: 'Health and shield rewards on elimination.',
    data: [
      { key: 'Health on elimination', value: '50 HP' },
      { key: 'Shield on elimination', value: '50 Shield' },
      { key: 'Applies to AI kills',   value: 'Yes' },
      { key: 'Max health cap',        value: '100 HP' },
      { key: 'Max shield cap',        value: '100 Shield' },
    ],
    updated: '2026-04-03',
  },
  'matchmaking': {
    title: 'Matchmaking',
    description: 'AI fill rates and lobby composition rules.',
    data: [
      { key: 'Default lobby size',    value: '100 players' },
      { key: 'AI fill threshold',     value: 'Fills remaining spots' },
      { key: 'Ranked lobbies',        value: 'Higher rank = more humans' },
      { key: 'Unreal lobbies',        value: '100% human' },
    ],
    updated: '2026-04-03',
  },
  'surge': {
    title: 'Storm Surge',
    description: 'Lobby size thresholds and damage rules.',
    data: [
      { key: 'Phase 1 threshold',     value: '50 players alive' },
      { key: 'Phase 2 threshold',     value: '40 players alive' },
      { key: 'Phase 3+ scaling',      value: 'Scales down with lobby size' },
      { key: 'Damage per tick',        value: 'Passive damage until elimination' },
    ],
    updated: '2026-04-03',
  },
  'ranked-scoring': {
    title: 'Ranked Scoring',
    description: 'Placement vs. elimination point scaling.',
    updated: '2026-04-03',
  },
  'tournament-rules': {
    title: 'Tournament Rules',
    description: 'Official competitive rulesets and guidelines.',
    updated: '2026-04-03',
  },
  'bus-route': {
    title: 'Bus Route',
    description: 'Optimal drop timing and route physics.',
    updated: '2026-04-03',
  },
  'drop-meta': {
    title: 'Drop Meta',
    description: 'Optimal landing spots and contested areas for Chapter 7 Season 2.',
    updated: '2026-04-03',
  },
  'weapons': {
    title: 'Weapons',
    description: 'Real-time weapon statistics from live data.',
    updated: 'Live',
  },
} as const;

const PENDING_SECTIONS = ['loot-containers', 'map-objects'];

interface Params {
  section: string;
}

export default async function InfoDetailPage({ params }: { params: Promise<Params> }) {
  const { section } = await params;
  const info = SECTION_DATA[section as keyof typeof SECTION_DATA];
  const isPending = PENDING_SECTIONS.includes(section);

  if (!info && !isPending) notFound();

  return (
    <div className="content-area fade-in">
      <div className="page-header" style={{ marginBottom: '48px' }}>
        <Link href="/info" style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)',
          textDecoration: 'none', fontSize: '0.9rem', marginBottom: '24px'
        }}>
          <ChevronLeft size={16} /> Back to Information
        </Link>
        <h1 className="page-title">{info?.title || section.split('-').join(' ')}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {info?.description}
        </p>
      </div>

      <div className="card" style={{ padding: '40px' }}>
        {renderSection(section)}
      </div>

      {info?.updated && (
        <div style={{ marginTop: '32px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={14} /> Last updated: {info.updated} — Data confirmed for Chapter 7 Season 2.
          </p>
        </div>
      )}
    </div>
  );
}

function renderSection(section: string) {
  switch (section) {
    case 'weapons':
      return <WeaponsList />;

    case 'ranked-scoring':
      return <RankedScoring />;
      
    case 'tournament-rules':
      return <TournamentRules />;

    case 'bus-route':
      return <BusRoute />;

    case 'drop-meta':
      return <DropMeta />;

    case 'loot-containers':
    case 'map-objects':
      return <PendingSection />;

    default:
      const info = SECTION_DATA[section as keyof typeof SECTION_DATA];
      if (!info || !('data' in info)) return <PendingSection />;
      
      return (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              {Object.keys(info.data[0]).map((key) => (
                <th key={key} style={{ padding: '16px 24px', textTransform: 'capitalize', fontSize: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {info.data.map((row, i) => (
              <tr key={i} className="table-row-hover" style={{ borderBottom: '1px solid #f8f8f8' }}>
                {Object.values(row).map((val, j) => (
                  <td key={j} style={{ padding: '20px 24px', fontSize: '0.95rem' }}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}

function RankedScoring() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div>
        <h2 style={{ marginBottom: '24px' }}>Placement Points</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { p: "1st", v: 25 }, { p: "2nd", v: 20 }, { p: "3rd", v: 16 }, { p: "4th", v: 13 },
                { p: "5th", v: 11 }, { p: "6th", v: 9 }, { p: "7th", v: 7 }, { p: "8th", v: 5 }
              ].map(r => (
                <tr key={r.p} style={{ borderBottom: '1px solid #f8f8f8' }}>
                  <td style={{ padding: '12px 0', fontSize: '1rem', fontWeight: 600 }}>{r.p}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 700 }}>{r.v} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { p: "9th", v: 4 }, { p: "10th", v: 3 }, { p: "11th", v: 3 }, { p: "12th", v: 2 },
                { p: "13th", v: 2 }, { p: "14th", v: 1 }, { p: "15th", v: 1 }, { p: "16-25th", v: 0 }
              ].map(r => (
                <tr key={r.p} style={{ borderBottom: '1px solid #f8f8f8' }}>
                  <td style={{ padding: '12px 0', fontSize: '1rem', fontWeight: 600 }}>{r.p}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 700 }}>{r.v} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '8px' }}>Elimination Points</h3>
        <p style={{ color: 'var(--text-secondary)' }}>1 point per elimination. No elimination point cap.</p>
      </div>

      <div>
        <h2 style={{ marginBottom: '24px' }}>Division Ladder</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map(tier => (
            <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, padding: '4px 12px', background: '#f8fafc', borderRadius: '4px' }}>{tier} I-III</span>
              <span style={{ color: '#cbd5e1' }}>→</span>
            </div>
          ))}
          <span style={{ fontWeight: 800, color: '#D97757' }}>Elite</span>
          <span style={{ color: '#cbd5e1' }}>→</span>
          <span style={{ fontWeight: 800, color: '#C2410C' }}>Champion</span>
          <span style={{ color: '#cbd5e1' }}>→</span>
          <span style={{ fontWeight: 900, background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UNREAL</span>
        </div>
      </div>

      <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '0.9rem', marginBottom: '8px' }}>Demotion Rules</h3>
        <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '20px' }}>
          <li>Cannot drop between tiers (e.g. Gold stays Gold)</li>
          <li>Can drop between divisions within a tier</li>
          <li>Unreal rank is assigned based on top performance among Champions</li>
        </ul>
      </div>
    </div>
  );
}

function TournamentRules() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '12px', color: 'var(--accent-primary)' }}>Cash Cup</h3>
          <p style={{ fontSize: '0.9rem' }}>3 Hour Session</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Unlimited games in window. standard placement + 1pt per elimination.</p>
        </div>
        <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '12px', color: 'var(--accent-primary)' }}>FNCS Qualifiers</h3>
          <p style={{ fontSize: '0.9rem' }}>6 Games per Session</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tiebreakers: 1. Total Elims, 2. Highest Game Placement.</p>
        </div>
        <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '12px', color: 'var(--accent-primary)' }}>FNCS Finals</h3>
          <p style={{ fontSize: '0.9rem' }}>12 Games (6 per Day)</p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Multi-day cumulative format. Best total score wins.</p>
        </div>
      </div>
      <div>
        <h2 style={{ marginBottom: '24px' }}>Tournament Placement Points</h2>
        <RankedScoring />
      </div>
    </div>
  );
}

function BusRoute() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <h3 style={{ marginBottom: '16px' }}>Physics & Speeds</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <tbody>
               {[
                 { k: "Bus Speed", v: "4,800 cm/s (48 m/s)" },
                 { k: "Freefall Speed", v: "2,000 cm/s (Vertical)" },
                 { k: "Glide Speed", v: "1,100 cm/s" },
                 { k: "Map Bounds", v: "±131,072 cm" }
               ].map(r => (
                 <tr key={r.k} style={{ borderBottom: '1px solid #f8f8f8' }}>
                   <td style={{ padding: '12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.k}</td>
                   <td style={{ padding: '12px 0', fontWeight: 600 }}>{r.v}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
        <div>
          <h3 style={{ marginBottom: '16px' }}>Drop Meta Stats</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <tbody>
               {[
                 { k: "Optimal Jump", v: "35s after departure" },
                 { k: "Late penalty", v: "80m per second" },
                 { k: "Max Distance", v: "3,000m from jump" },
                 { k: "Total Air Time", v: "19s average" }
               ].map(r => (
                 <tr key={r.k} style={{ borderBottom: '1px solid #f8f8f8' }}>
                   <td style={{ padding: '12px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{r.k}</td>
                   <td style={{ padding: '12px 0', fontWeight: 600 }}>{r.v}</td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>
      <div style={{ padding: '24px', background: '#D9775710', borderRadius: '12px', border: '1px solid #D9775720' }}>
         <h4 style={{ color: '#D97757', marginBottom: '8px' }}>Pro Tip</h4>
         <p style={{ fontSize: '0.95rem' }}>
           Use <code>POST /v1/replay/drop-analysis</code> to get your exact drop score and optimal jump point for any match parsed by Pathgen.
         </p>
      </div>
    </div>
  );
}

function DropMeta() {
  const pois = [
    "Tiptop Terrace", "Wonkeeland", "Frigid Fortress", "Dark Dominion", "Humble Hills", 
    "Ripped Tides", "Battlewood Boulevard", "Sandy Strip", "Sus Studios", "New Sanctuary", 
    "Latte Landing", "Painted Palms", "Fore Fields"
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {pois.map(poi => (
          <div key={poi} style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <h3 style={{ marginBottom: '16px' }}>{poi}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>Drop Frequency</span>
                 <span style={{ fontStyle: 'italic', color: '#cbd5e1' }}>calculating...</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>Avg Survival</span>
                 <span style={{ fontStyle: 'italic', color: '#cbd5e1' }}>waiting for data...</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>Hot Drop Rating</span>
                 <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>C7S2-LIVE</span>
               </div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: '32px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Note: Drop frequency data populates automatically as matches are parsed through the Pathgen API. Connect your Epic account to contribute your match data.
      </p>
    </div>
  );
}

function PendingSection() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', textAlign: 'center' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', marginBottom: '24px' }}>
        <Info size={32} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>Coming in the next update</h2>
      <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '400px' }}>
        We are compiling confirmed spawn data for Chapter 7 Season 2.
      </p>
    </div>
  );
}
