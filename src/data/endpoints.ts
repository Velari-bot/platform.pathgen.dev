export interface Endpoint {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'WEBHOOK';
  path: string;
  description: string;
  credits?: number | string;
  parameters?: { name: string; required: boolean; description: string }[];
  exampleRequest?: string;
  response?: string;
  useCase?: string;
  status?: 'alpha' | 'beta' | 'coming-soon' | 'free' | 'paid' | 'fused' | 'pro' | 'premium';
  tier: 'free' | 'pro' | 'internal';
}

export interface Section {
  title: string;
  description?: string;
  endpoints: Endpoint[];
}

export const ENDPOINTS_DATA: Section[] = [
  {
    title: "1. Account & Billing",
    description: "Endpoints for managing your credits, API keys, and profile.",
    endpoints: [
      { 
        method: 'GET', 
        path: '/v1/account/me', 
        description: 'Full profile (balance, tier, stats)', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"id": "usr_123", "email": "dev@pathgen.dev", "credits": 1450, "tier": "Pro"}' 
      },
      { 
        method: 'GET', 
        path: '/v1/account/balance', 
        description: 'Current credit balance only', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"credits": 1450}' 
      },
      { 
        method: 'GET', 
        path: '/v1/account/keys', 
        description: 'List all active API keys', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"keys": [{"id": "key_1", "prefix": "pg_live_", "created_at": "..."}]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/account/keys', 
        description: 'Generate a new RS (secure) key', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"key": "pg_live_xxxxxxxxxxxx", "id": "key_2"}' 
      },
      { 
        method: 'DELETE', 
        path: '/v1/account/keys/{id}', 
        description: 'Revoke an existing key', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"success": true}' 
      },
      { 
        method: 'GET', 
        path: '/v1/billing/history', 
        description: 'Transaction & top-up history', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"history": [{"id": "tx_1", "amount": 1000, "status": "success"}]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/billing/topup', 
        description: 'Generate Stripe Checkout for credits', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"url": "https://checkout.stripe.com/..."}' 
      },
    ]
  },
  {
    title: "2. Game World Intelligence",
    description: "High-fidelity data pulled from the live Fortnite environment.",
    endpoints: [
      { 
        method: 'GET', 
        path: '/v1/game/stats', 
        description: 'Premium Unified Stats (Merged FnAPI + Osirion)', 
        credits: 5, 
        tier: 'pro',
        status: 'premium',
        response: '{"stats": {"br": {"wins": 150, "kills": 4500}}}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/stats/br/v2', 
        description: 'Standard BR stats lookup', 
        credits: 2, 
        tier: 'free',
        response: '{"wins": 150, "kills": 4500}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/lookup', 
        description: 'Simple player existence check', 
        credits: 2, 
        tier: 'free',
        response: '{"exists": true, "id": "4b3..."}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/ranked', 
        description: 'Ranked history & current progression', 
        credits: 5, 
        tier: 'pro',
        response: '{"rank": "Champion", "progression": 45}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/map', 
        description: 'Map metadata & POI coordinates', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"poi": [{"name": "Reckless Railways", "x": 100, "y": 200}]}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/tiles/{z}/{x}/{y}', 
        description: '24h Pass for high-res map tiles', 
        credits: 30, 
        tier: 'pro',
        response: '{"tile_url": "..."}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/shop', 
        description: 'Fused item shop data', 
        credits: 1, 
        tier: 'free',
        response: '{"featured": [...]}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/news', 
        description: 'Game news & updates feed', 
        credits: 1, 
        tier: 'free',
        response: '{"news": [...]}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/weapons', 
        description: 'Current loot pool & weapon stats', 
        credits: 1, 
        tier: 'free',
        response: '{"weapons": [...]}' 
      },
      { 
        method: 'GET', 
        path: '/v1/game/playlists', 
        description: 'Active game modes & LTMs', 
        credits: 1, 
        tier: 'free',
        response: '{"playlists": [...]}' 
      },
    ]
  },
  {
    title: "3. Replay & Match Analysis",
    description: "Upload a .replay file for deep-dive extraction.",
    endpoints: [
      { 
        method: 'POST', 
        path: '/v1/replay/parse', 
        description: 'Full match JSON payload', 
        credits: 20, 
        tier: 'free',
        response: '{"match_id": "8b5922fb", "overview": {...}}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/stats', 
        description: 'Lightweight scoreboard & combat stats', 
        credits: 5, 
        tier: 'free',
        response: '{"kills": 8, "accuracy": 0.34}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/movement', 
        description: 'Rotation paths & coordinate logs', 
        credits: 8, 
        tier: 'free',
        response: '{"path": [[100, 200], [150, 250]]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/weapons', 
        description: 'Weapon-by-weapon performance audit', 
        credits: 8, 
        tier: 'free',
        response: '{"weapons": [...]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/events', 
        description: 'Full elimination feed & timestamp events', 
        credits: 10, 
        tier: 'free',
        response: '{"events": [...]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/drop-analysis', 
        description: 'Bus route assessment & drop efficiency', 
        credits: 15, 
        tier: 'free',
        response: '{"drop_site": "Tilted Towers", "efficiency": 0.92}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/rotation-score', 
        description: 'Zone survival & storm-edge efficiency', 
        credits: 25, 
        tier: 'pro',
        response: '{"rotation_score": 88}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/opponents', 
        description: 'Skill assessment of every player in your lobby', 
        credits: 30, 
        tier: 'pro',
        response: '{"opponents": [...]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/match-info', 
        description: 'Manifest for server-side match IDs', 
        credits: 5, 
        tier: 'free',
        response: '{"server_id": "NAE_12345"}' 
      },
    ]
  },
  {
    title: "4. Session & AI Coaching (Beta)",
    description: "Advanced endpoints requiring the requireBeta flag.",
    endpoints: [
      { 
        method: 'POST', 
        path: '/v1/session/analyze', 
        description: 'Multi-match session summary', 
        credits: 50, 
        tier: 'pro',
        status: 'beta',
        response: '{"summary": "Consistent performance..."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/session/auto-analyze', 
        description: 'Auto-fetch tournament history from Epic', 
        credits: 75, 
        tier: 'pro',
        status: 'beta',
        response: '{"status": "queued"}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/coach', 
        description: 'Deep AI gameplay critique (Vertex AI)', 
        credits: 30, 
        tier: 'pro',
        status: 'beta',
        response: '{"early_game": "..."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/weapon-coach', 
        description: 'AI loadout optimization advice', 
        credits: 20, 
        tier: 'pro',
        status: 'beta',
        response: '{"advice": "..."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/opponent-scout', 
        description: 'AI scouting report on rival players', 
        credits: 25, 
        tier: 'pro',
        status: 'beta',
        response: '{"playstyle": "W-Keyer"}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/rotation-review', 
        description: 'AI feedback on zone strategy', 
        credits: 15, 
        tier: 'pro',
        status: 'beta',
        response: '{"notes": "..."}' 
      },
    ]
  },
  {
    title: "5. Enhanced Intelligence",
    description: "Data visualization and comparison utilities.",
    endpoints: [
      { 
        method: 'POST', 
        path: '/v1/replay/enhanced/heatmap', 
        description: 'Map density grid of movements/kills', 
        credits: 15, 
        tier: 'pro',
        response: '{"heatmap": [...]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/enhanced/timeline', 
        description: 'Unified event feed (Storm/Kills/Movement)', 
        credits: 10, 
        tier: 'free',
        response: '{"timeline": [...]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/enhanced/compare', 
        description: 'Side-by-side comparison of two replays', 
        credits: 25, 
        tier: 'pro',
        response: '{"comparison": {...}}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/enhanced/clutch', 
        description: 'Detects peak-performance clutch moments', 
        credits: 20, 
        tier: 'pro',
        response: '{"clutch_moments": [...]}' 
      },
    ]
  },
  {
    title: "6. Integrations & Authentication",
    description: "Account connectivity and auth flow.",
    endpoints: [
      { 
        method: 'POST', 
        path: '/v1/auth/register', 
        description: 'New account sign up (+100 Credits)', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"status": "active"}' 
      },
      { 
        method: 'POST', 
        path: '/v1/auth/login', 
        description: 'Exchange credentials for JWT', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"token": "..."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/epic/connect', 
        description: 'Link your Epic Games account', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"connected": true}' 
      },
      { 
        method: 'GET', 
        path: '/v1/epic/status', 
        description: 'Verify Epic OAuth connection status', 
        credits: 0, 
        tier: 'free',
        status: 'free',
        response: '{"connected": true}' 
      },
    ]
  }
];
