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
  description?: string;
  endpoints: Endpoint[];
}

export const ENDPOINTS_DATA: Section[] = [
  {
    title: "1. Account and Key Management",
    description: "Manage your API keys and check your credit balance.",
    endpoints: [
      { 
        method: 'GET', 
        path: '/v1/account/balance', 
        description: 'Get real-time USD credit balance.', 
        tier: 'free', 
        response: '{"balance": 1450, "currency": "USD"}' 
      },
      { 
        method: 'GET', 
        path: '/v1/account/keys', 
        description: 'List all current API keys.', 
        tier: 'free', 
        response: '{"keys": [{"id": "rs_123", "name": "Prod Key", "created_at": "2024-03-20T12:00:00Z"}]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/account/keys', 
        description: 'Generate a new API key.', 
        tier: 'free', 
        response: '{"key": "pathgen_live_abc123...", "id": "rs_456"}' 
      },
      { 
        method: 'DELETE', 
        path: '/v1/account/keys/{id}', 
        description: 'Immediately revoke an API key.', 
        tier: 'free', 
        parameters: [{ name: 'id', required: true, description: 'The unique key ID (rs_...)' }],
        response: '{"revoked": true}' 
      },
    ]
  },
  {
    title: "2. Free Game Data",
    description: "Real-time Fortnite game metadata. No API key required. Limit: 60 RPM.",
    endpoints: [
      { method: 'GET', path: '/v1/account/lookup', description: 'Resolve display name to Account ID.', tier: 'free', parameters: [{name: 'name', required: true, description: 'Epic display name'}], response: '{"id": "4b3...", "name": "Ninja"}' },
      { method: 'GET', path: '/v1/account/ranked', description: 'Rank, Division, and Ladder status.', tier: 'free', parameters: [{name: 'name', required: true, description: 'Epic display name'}], response: '{"rank": "Elite", "progress": 42}' },
      { method: 'GET', path: '/v1/account/stats', description: 'Total Wins and Kills career profile.', tier: 'free', parameters: [{name: 'name', required: true, description: 'Epic display name'}], response: '{"wins": 420, "kd": 4.5}' },
      { method: 'GET', path: '/v1/game/cosmetics', description: 'List all items in the game database.', tier: 'free', response: '{"items": [...]}' },
      { method: 'GET', path: '/v1/game/cosmetics/{id}', description: 'Detailed item info by ID.', tier: 'free', parameters: [{name: 'id', required: true, description: 'Item CID or Template ID'}], response: '{"item": {...}}' },
      { method: 'GET', path: '/v1/game/shop', description: 'Current Item Shop rotations.', tier: 'free', response: '{"shop": [...]}' },
      { method: 'GET', path: '/v1/game/weapons', description: 'Active seasonal weapon pool stats.', tier: 'free', response: '{"weapons": [...]}' },
      { method: 'GET', path: '/v1/game/map', description: 'Current POIs and Map assets.', tier: 'free', response: '{"pois": [...]}' },
      { method: 'GET', path: '/v1/game/news', description: 'Fused news for all modes.', tier: 'free', response: '{"news": {...}}' },
      { method: 'GET', path: '/v1/game/playlists', description: 'Active game modes and regions.', tier: 'free', response: '{"playlists": [...]}' },
      { method: 'GET', path: '/v1/game/aes', description: 'Current encryption keys.', tier: 'free', response: '{"main_key": "0x..."}' },
      { method: 'GET', path: '/v1/game/banners', description: 'All available banners.', tier: 'free', response: '{"banners": [...]}' },
      { method: 'GET', path: '/v1/game/creator/{name}', description: 'Creator code validation.', tier: 'free', parameters: [{name: 'name', required: true, description: 'Creator code'}], response: '{"valid": true, "slug": "pathgen"}' },
      { method: 'GET', path: '/v1/game/tournaments', description: 'Live and upcoming tournament schedules.', tier: 'free', response: '{"tournaments": [...]}' },
      { method: 'GET', path: '/v1/game/discovery', description: 'Island discovery rows.', tier: 'free', response: '{"rows": [...]}' },
    ]
  },
  {
    title: "3. Replay Parsing",
    description: "Deep binary extraction from .replay files. Credits deducted on success.",
    endpoints: [
      { method: 'POST', path: '/v1/replay/parse', description: 'Full binary data extraction.', credits: 20, tier: 'free', response: '{"match_id": "...", "match_overview": {...}, "combat_summary": {...}}' },
      { method: 'POST', path: '/v1/replay/stats', description: 'Lightweight summary metrics only.', credits: 5, tier: 'free', response: '{"kills": 12, "accuracy": 0.34}' },
      { method: 'POST', path: '/v1/replay/scoreboard', description: 'Top-100 list and placement extraction.', credits: 8, tier: 'free', response: '{"scoreboard": [...]}' },
      { method: 'POST', path: '/v1/replay/movement', description: 'X/Y/Z pathing and movement data.', credits: 8, tier: 'free', response: '{"tracks": [...]}' },
      { method: 'POST', path: '/v1/replay/weapons', description: 'Individual weapon performance.', credits: 8, tier: 'free', response: '{"weapon_deep_dive": {...}}' },
      { method: 'POST', path: '/v1/replay/events', description: 'Chronological combat and game events.', credits: "10 + 3 per type", tier: 'free', response: '{"events": [...]}' },
      { method: 'POST', path: '/v1/replay/drop-analysis', description: 'POI landing efficiency and physics.', credits: 15, tier: 'free', response: '{"drop": {"time": 12.5, "poi": "Tilted"}}' },
      { method: 'POST', path: '/v1/replay/match-info', description: 'Server replay metadata.', credits: 5, tier: 'free', response: '{"server_session": "...", "version": "v28.00"}' },
      { method: 'POST', path: '/v1/replay/download-and-parse', description: 'Auto-fetch and parse match by ID.', credits: 25, tier: 'pro', response: '{"status": "processing", "match_id": "..."}' },
    ]
  },
  {
    title: "4. Exclusive Endpoints",
    description: "Unique analytics produced only by the Pathgen Engine.",
    endpoints: [
      { method: 'POST', path: '/v1/replay/rotation-score', description: 'Strategic movement efficiency scoring.', credits: 25, tier: 'pro', response: '{"score": 88, "efficient": true}' },
      { method: 'POST', path: '/v1/replay/opponents', description: 'Advanced scouting on enemy skill levels.', credits: 30, tier: 'pro', response: '{"opponents": [...]}' },
      { method: 'POST', path: '/v1/replay/heatmap', description: '64x64 movement density grid.', credits: 15, tier: 'pro', response: '{"grid": [[...]]}' },
      { method: 'POST', path: '/v1/replay/timeline', description: 'Interactive combat chronology feed.', credits: 10, tier: 'pro', response: '{"timeline": [...]}' },
      { method: 'POST', path: '/v1/replay/compare', description: 'Delta logic between two matches.', credits: 25, tier: 'pro', response: '{"delta": {...}}' },
      { method: 'POST', path: '/v1/replay/clutch-moments', description: 'Detection of high-pressure engagement wins.', credits: 20, tier: 'pro', response: '{"moments": [...]}' },
    ]
  },
  {
    title: "5. Session and Tournament Analysis",
    description: "Aggregate analysis for multiple matches.",
    endpoints: [
      { method: 'POST', path: '/v1/session/analyze', description: 'Upload and analyze 6+ matches.', credits: 50, tier: 'pro', response: '{"session_id": "...", "aggregate_stats": {...}}' },
      { method: 'POST', path: '/v1/session/auto-analyze', description: 'Automatic analysis via Event ID.', credits: 75, tier: 'pro', response: '{"status": "syncing"}' },
      { method: 'POST', path: '/v1/session/fncs-score', description: 'FNCS standard point calculation.', credits: 30, tier: 'pro', response: '{"points": 142, "rank": 12}' },
    ]
  },
  {
    title: "6. Tournament Management",
    description: "Create and manage automated leaderboards.",
    endpoints: [
      { method: 'POST', path: '/v1/tournament/create', description: 'Initialize a new tournament.', tier: 'pro', response: '{"id": "tour_1", "config": {...}}' },
      { method: 'GET', path: '/v1/tournament/{id}', description: 'Get tournament config.', tier: 'free', response: '{"id": "tour_1", "name": "Weekly Cup"}' },
      { method: 'POST', path: '/v1/tournament/{id}/add-game', description: 'Inject a match into the pool.', tier: 'pro', response: '{"added": true}' },
      { method: 'GET', path: '/v1/tournament/{id}/leaderboard', description: 'Live aggregate leaderboard.', tier: 'free', response: '{"leaderboard": [...]}' },
      { method: 'GET', path: '/v1/tournament/{id}/team/{teamId}', description: 'Deep team stats.', tier: 'free', response: '{"team": {...}}' },
      { method: 'GET', path: '/v1/tournament/{id}/player/{accountId}', description: 'Deep player stats.', tier: 'free', response: '{"player": {...}}' },
      { method: 'GET', path: '/v1/tournament/{id}/compare', description: 'Side-by-side match comparison.', tier: 'pro', response: '{"delta": {...}}' },
    ]
  },
  {
    title: "7. AI Endpoints",
    description: "Advanced intelligence powered by Gemini 2.0 Flash.",
    endpoints: [
      { method: 'POST', path: '/v1/ai/analyze', description: 'General match strategy scorecard.', credits: 15, tier: 'pro', response: '{"analysis": "Great rotation, poor building."}' },
      { method: 'POST', path: '/v1/ai/coach', description: 'Deep tactical match critique.', credits: 30, tier: 'pro', response: '{"critique": "You over-built in the final circle."}' },
      { method: 'POST', path: '/v1/ai/session-coach', description: 'Performance pattern discovery.', credits: 50, tier: 'pro', response: '{"patterns": ["Early game deaths", ...]}' },
      { method: 'POST', path: '/v1/ai/weapon-coach', description: 'Loadout and accuracy review.', credits: 20, tier: 'pro', response: '{"weapon_coach": "Switch to AR."}' },
      { method: 'POST', path: '/v1/ai/drop-recommend', description: 'Strategic landing POI suggestions.', credits: 10, tier: 'pro', response: '{"recommendation": "Retail Row"}' },
      { method: 'POST', path: '/v1/ai/opponent-scout', description: 'Enemy tendency prediction.', credits: 25, tier: 'pro', response: '{"scout_report": {...}}' },
      { method: 'POST', path: '/v1/ai/rotation-review', description: 'Dead-zone and zone-logic review.', credits: 15, tier: 'pro', response: '{"rotation_notes": "Avoid the bridge."}' },
    ]
  },
  {
    title: "8. Epic Account Integration",
    description: "OAuth flow to connect player accounts.",
    endpoints: [
      { method: 'GET', path: '/v1/epic/auth-url', description: 'Get the Epic login start URL.', tier: 'free', response: '{"url": "https://epicgames.com/id/authorize?..."}' },
      { method: 'POST', path: '/v1/epic/connect', description: 'Exchange auth code for connection.', tier: 'free', parameters: [{name: 'code', required: true, description: 'Epic auth_code'}], response: '{"connected": true}' },
      { method: 'GET', path: '/v1/epic/status', description: 'Check connection health.', tier: 'free', response: '{"status": "connected", "displayName": "Ninja"}' },
      { method: 'DELETE', path: '/v1/epic/disconnect', description: 'Revoke Epic access.', tier: 'free', response: '{"disconnected": true}' },
    ]
  }
];
