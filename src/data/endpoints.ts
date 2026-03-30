export interface Endpoint {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'WEBHOOK';
  path: string;
  description: string;
  credits?: number | string;
  parameters?: { name: string; required: boolean; description: string }[];
  exampleRequest?: string;
  response?: string;
  useCase?: string;
  status?: 'alpha' | 'beta' | 'coming-soon' | 'free' | 'paid' | 'fused' | 'pro';
  tier: 'free' | 'pro' | 'internal';
}

export interface Section {
  title: string;
  endpoints: Endpoint[];
}

export const ENDPOINTS_DATA: Section[] = [
  {
    title: "1. Infrastructure",
    endpoints: [
      { method: 'GET', path: '/health', description: 'Base system status.', tier: 'free', response: '{"status": "ok"}' },
      { method: 'GET', path: '/health/detailed', description: 'CPU, Memory, and Uptime telemetry.', tier: 'free', response: '{"cpu": "12%", "memory": "4.2GB", "uptime": "14d"}' },
      { method: 'GET', path: '/metrics', description: 'Prometheus reporting for monitoring.', tier: 'internal', response: '# HELP express_requests_total...' },
      { method: 'GET', path: '/v1/game/ping', description: 'Quick connectivity check.', tier: 'free', response: '{"ping": "14ms"}' },
      { method: 'GET', path: '/v1/spec', description: 'The live, machine-readable OpenAPI documentation.', tier: 'free', response: '{"openapi": "3.0.0", ...}' },
      { method: 'GET', path: '/robots.txt', description: 'Search crawler instructions.', tier: 'free', response: 'User-agent: *\nAllow: /' },
      { method: 'GET', path: '/v1/game/aes', description: 'Current Fortnite encryption keys (Fused).', tier: 'free', response: '{"main_key": "0x4b3...", "dynamic": []}' },
      { method: 'GET', path: '/v1/game/aes/history', description: 'Previous encryption key log.', tier: 'free', response: '{"history": [{"key": "0x...", "date": "..."}]}' },
    ]
  },
  {
    title: "2. Fused Game Metadata",
    endpoints: [
      { method: 'GET', path: '/v1/game/map', description: 'Current Map POIs with localized R2 imagery.', tier: 'free', response: '{"map": {"pois": [...]}}' },
      { method: 'GET', path: '/v1/game/map/config', description: 'Fortnite-to-Real-World coordinate logic.', tier: 'free', response: '{"world_size": 262144, "offset": 131072}' },
      { method: 'GET', path: '/v1/game/news', description: 'Fused news triage (BR, Creative, STW).', tier: 'free', response: '{"br": [...], "creative": [...]}' },
      { method: 'GET', path: '/v1/game/playlists', description: 'Current active game modes & regions.', tier: 'free', response: '{"playlists": [...]}' },
      { method: 'GET', path: '/v1/game/weapons', description: 'Metadata for the active seasonal weapon pool.', tier: 'free', response: '{"weapons": [...]}' },
      { method: 'GET', path: '/v1/game/shop', description: 'Premium fused item shop with layouts.', tier: 'free', response: '{"shop": [...]}' },
      { method: 'GET', path: '/v1/game/cosmetics', description: 'Database of all 10,000+ Fortnite items.', tier: 'free', response: '{"items": [...]}' },
      { method: 'GET', path: '/v1/game/cosmetics/new', description: 'Real-time list of newly added items.', tier: 'free', response: '{"new_items": [...]}' },
    ]
  },
  {
    title: "3. Player Intelligence",
    endpoints: [
      { method: 'GET', path: '/v1/game/lookup', description: 'Account ID resolver (Display Name based).', tier: 'free', response: '{"id": "4b3...", "name": "Ninja"}' },
      { method: 'GET', path: '/v1/game/ranked', description: 'Competitive Rank, Division, and Ladder status.', tier: 'free', response: '{"rank": "Elite", "progress": 42}' },
      { method: 'GET', path: '/v1/game/stats', description: 'Fused Wins/Kills career profile.', tier: 'free', response: '{"wins": 420, "kd": 4.5}' },
      { method: 'GET', path: '/v1/game/discovery', description: 'Island discovery rows & active CCU counts.', tier: 'free', response: '{"rows": [...]}' },
      { method: 'GET', path: '/v1/game/player/locker', description: 'Real-time equipped cosmetics (OAuth).', tier: 'pro', response: '{"locker": {"skin": "Midas"}}' },
    ]
  },
  {
    title: "4. Core Replay Engine",
    endpoints: [
      { method: 'POST', path: '/v1/replay/parse', description: 'Full binary data extraction.', credits: 20, tier: 'free', response: '{"match_id": "...", "telemetry": {...}}' },
      { method: 'POST', path: '/v1/replay/stats', description: 'Lightweight match summary metrics.', credits: 10, tier: 'free', response: '{"kills": 12, "accuracy": "34%"}' },
      { method: 'POST', path: '/v1/replay/scoreboard', description: 'Match Top-100 list & placement extraction.', credits: 10, tier: 'free', response: '{"scoreboard": [...]}' },
      { method: 'POST', path: '/v1/replay/movement', description: 'X/Y pathing and movement data.', credits: 15, tier: 'free', response: '{"tracks": [...]}' },
      { method: 'POST', path: '/v1/replay/events', description: 'Chronological combat & seasonal event log.', credits: 15, tier: 'free', response: '{"events": [...]}' },
      { method: 'POST', path: '/v1/replay/drop-analysis', description: 'POI landing efficiency & loot priority.', credits: 15, tier: 'free', response: '{"drop": {"poi": "Tilted", "time": 12.5}}' },
    ]
  },
  {
    title: "5. Enhanced Visualization (PRO)",
    endpoints: [
      { method: 'POST', path: '/v1/replay/enhanced/heatmap', description: '64x64 map activity density grid.', credits: 25, tier: 'pro', response: '{"heatmap": [[...]]}' },
      { method: 'POST', path: '/v1/replay/enhanced/timeline', description: 'Interactive combat chronology feed.', credits: 20, tier: 'pro', response: '{"timeline": [...]}' },
      { method: 'POST', path: '/v1/replay/enhanced/compare', description: 'Side-by-side delta logic for TWO matches.', credits: 40, tier: 'pro', response: '{"comparison": {...}}' },
      { method: 'POST', path: '/v1/replay/enhanced/clutch', description: 'Detection of high-pressure Clutch wins.', credits: 20, tier: 'pro', response: '{"clutch_score": 92}' },
    ]
  },
  {
    title: "6. AI Coaching Hub (PRO)",
    endpoints: [
      { method: 'POST', path: '/v1/ai/analyze', description: 'Gemini-powered strategy scorecard.', credits: 15, tier: 'pro', response: '{"analysis": "...", "score": 88}' },
      { method: 'POST', path: '/v1/ai/coach', description: 'Deep tactical match critique (Game phases).', credits: 25, tier: 'pro', response: '{"coach_notes": {...}}' },
      { method: 'POST', path: '/v1/ai/session-coach', description: 'Cross-match performance pattern discovery.', credits: 50, tier: 'pro', response: '{"patterns": [...]}' },
      { method: 'POST', path: '/v1/ai/weapon-coach', description: 'Weapon-specific accuracy and loadout review.', credits: 20, tier: 'pro', response: '{"weapon_stats": {...}}' },
      { method: 'POST', path: '/v1/ai/drop-recommend', description: 'Strategic landing POI suggestions.', credits: 10, tier: 'pro', response: '{"recommendation": "Retail Row"}' },
      { method: 'POST', path: '/v1/ai/opponent-scout', description: 'Predictive scouting report on enemy tendencies.', credits: 30, tier: 'pro', response: '{"scouting": {...}}' },
      { method: 'POST', path: '/v1/ai/rotation-review', description: 'Strategic rotation scores and dead-zone reviews.', credits: 20, tier: 'pro', response: '{"rotations": [...]}' },
    ]
  },
  {
    title: "7. Developer & Billing",
    endpoints: [
      { method: 'GET', path: '/v1/account/balance', description: 'Real-time USD credit balance.', tier: 'free', response: '{"balance": 1450}' },
      { method: 'GET', path: '/v1/account/keys', description: 'List all current API keys.', tier: 'free', response: '{"keys": [...]}' },
      { method: 'POST', path: '/v1/account/keys', description: 'Securely generate new API keys.', tier: 'free', response: '{"key": "pathgen_..."}' },
      { method: 'DELETE', path: '/v1/account/keys/{id}', description: 'Immediately revoke an API key.', tier: 'free', response: '{"revoked": true}' },
      { method: 'GET', path: '/v1/account/usage', description: 'Account-wide cumulative Platform Analytics.', tier: 'free', response: '{"usage": [...]}' },
      { method: 'GET', path: '/v1/billing/history', description: 'Recharge and transaction log.', tier: 'free', response: '{"history": [...]}' },
      { method: 'POST', path: '/v1/billing/checkout', description: 'Initiate Stripe-based credit top-up.', tier: 'free', response: '{"url": "https://checkout.stripe.com/..."}' },
    ]
  },
  {
    title: "8. Automation Layer",
    endpoints: [
      { method: 'POST', path: '/v1/webhooks/subscribe', description: 'Subscribe to push notifications.', tier: 'pro', response: '{"id": "sub_...", "active": true}' },
      { method: 'GET', path: '/v1/webhooks/events', description: 'Discovery of triggerable platform events.', tier: 'free', response: '{"events": ["match.start", "shop.rotate", ...]}' },
      { method: 'DELETE', path: '/v1/webhooks/{id}', description: 'Unsubscribe from a push event.', tier: 'pro', response: '{"unsubscribed": true}' },
    ]
  }
];
