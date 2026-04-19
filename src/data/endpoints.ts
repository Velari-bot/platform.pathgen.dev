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
    title: "1. Core Parsing & Replay Endpoints",
    description: "Typically used for standard match processing.",
    endpoints: [
      { 
        method: 'POST', 
        path: '/v1/replay/parse', 
        description: 'Main Entry. Full statistical extraction.', 
        credits: 20, 
        tier: 'free',
        response: '{"match_id": "8b5922fb", "overview": {"duration": 1240, "map": "Helios"}, "combat": {"kills": 8, "damage": 1450}}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/stats', 
        description: 'Summary stats only (no events/scoreboard).', 
        credits: 5, 
        tier: 'free',
        response: '{"kills": 8, "accuracy": 0.34, "damage_done": 1450}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/scoreboard', 
        description: 'Full 100-player lobby scoreboard only.', 
        credits: 8, 
        tier: 'free',
        response: '{"scoreboard": [{"rank": 1, "name": "Ninja", "kills": 12}, {"rank": 2, "name": "Aiden", "kills": 5}]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/movement', 
        description: 'Locational data and distances (foot/vehicle/sky).', 
        credits: 8, 
        tier: 'free',
        response: '{"total_dist": 8450, "foot_dist": 6200, "vehicle_dist": 2250, "heatmap_points": [[100, 200], [150, 250]]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/weapons', 
        description: 'Deep dive into weapon handle performance.', 
        credits: 8, 
        tier: 'free',
        response: '{"weapons": [{"name": "Assault Rifle", "hits": 45, "misses": 110, "accuracy": 0.29}, {"name": "Pump Shotgun", "hits": 12, "misses": 4, "accuracy": 0.75}]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/events', 
        description: 'Elimination feed and key match events.', 
        credits: 10, 
        tier: 'free',
        response: '{"events": [{"t": 120, "type": "kill", "victim": "Player_1"}, {"t": 450, "type": "zone_move", "phase": 3}]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/drop-analysis', 
        description: 'Land-site scoring and optimization metrics.', 
        credits: 15, 
        tier: 'free',
        response: '{"drop_site": "Tilted Towers", "drop_score": 92, "contest_count": 4}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/rotation-score', 
        description: 'High Precision. Storm zone rotation grading.', 
        credits: 25, 
        tier: 'pro',
        response: '{"rotation_score": 88, "efficiency": 0.94, "narrative": "Elite pathing through mid-game."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/match-info', 
        description: 'Metadata lookup for a server-side match ID.', 
        credits: 5, 
        tier: 'free',
        response: '{"server_id": "NAE_12345", "version": "v29.10", "timestamp": "2024-03-20T12:00:00Z"}' 
      },
      { 
        method: 'POST', 
        path: '/v1/replay/download-and-parse', 
        description: 'Automated fetch from Epic servers + Parse.', 
        credits: 25, 
        tier: 'pro',
        response: '{"status": "queued", "job_id": "job_9988", "estimated_wait": "15s"}' 
      },
    ]
  },
  {
    title: "2. AI Coaching & Analytics",
    description: "Premium endpoints powered by Gemini 2.5 Flash.",
    endpoints: [
      { 
        method: 'POST', 
        path: '/v1/ai/analyze', 
        description: 'Match summary, strengths/weaknesses.', 
        credits: 15, 
        tier: 'pro',
        response: '{"summary": "Aggressive early game, but failed to rotate early enough in Zone 5.", "strengths": ["Shotgun Aim"], "weaknesses": ["Late game rotations"]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/coach', 
        description: 'Deep tactical review (Early/Mid/Late game).', 
        credits: 30, 
        tier: 'pro',
        response: '{"early_game": "Clean drop. Avoided unnecessary fights.", "mid_game": "Good positioning near loot drops.", "late_game": "You held the low ground too long."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/session-coach', 
        description: 'Multi-match trend analysis (Up to 6 files).', 
        credits: 50, 
        tier: 'pro',
        response: '{"trends": ["Consistent drop success", "Decreasing accuracy in long sessions"]}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/weapon-coach', 
        description: 'Aim & Loadout critique based on weapon data.', 
        credits: 20, 
        tier: 'pro',
        response: '{"weapon_critique": "Your Sniper lead time is slightly off. Recommending a higher sensitivity."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/drop-recommend', 
        description: 'Dynamic landing recommendation via AI.', 
        credits: 20, 
        tier: 'pro',
        response: '{"recommend_site": "Pleasant Park", "reasoning": "High loot density with low contest rate based on recent match history."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/opponent-scout', 
        description: 'Playstyle & threat analysis on a specific player.', 
        credits: 25, 
        tier: 'pro',
        response: '{"player_style": "W-Keyer", "threat_level": "High", "common_loadout": "Pump + SMG"}' 
      },
      { 
        method: 'POST', 
        path: '/v1/ai/rotation-review', 
        description: 'Narrative explanation of rotation performance.', 
        credits: 15, 
        tier: 'pro',
        response: '{"rotation_notes": "The path through the valley was risky but paid off. Next time try the ridge."}' 
      },
    ]
  },
  {
    title: "3. Account, Auth & Billing",
    description: "System-level management.",
    endpoints: [
      { 
        method: 'POST', 
        path: '/v1/auth/login', 
        description: 'Secure token exchange.', 
        credits: 0, 
        tier: 'free',
        response: '{"token": "pg_jwt_...", "expires": "2024-04-20T12:00:00Z"}' 
      },
      { 
        method: 'POST', 
        path: '/v1/auth/register', 
        description: 'New user onboarding.', 
        credits: 0, 
        tier: 'free',
        response: '{"user_id": "usr_123", "status": "active"}' 
      },
      { 
        method: 'GET', 
        path: '/v1/account/me', 
        description: 'Current profile and credit balance.', 
        credits: 0, 
        tier: 'free',
        response: '{"id": "usr_123", "email": "dev@pathgen.dev", "credits": 1450, "tier": "Pro"}' 
      },
      { 
        method: 'POST', 
        path: '/v1/billing/topup', 
        description: 'Credit purchase via Stripe.', 
        credits: 0, 
        tier: 'free',
        response: '{"url": "https://checkout.stripe.com/..."}' 
      },
      { 
        method: 'GET', 
        path: '/v1/epic/auth-url', 
        description: 'Get Epic Games OAuth login link.', 
        credits: 0, 
        tier: 'free',
        response: '{"url": "https://epicgames.com/id/authorize?..."}' 
      },
      { 
        method: 'POST', 
        path: '/v1/epic/connect', 
        description: 'Finalize Epic account linking.', 
        credits: 0, 
        tier: 'free',
        response: '{"connected": true, "epic_id": "4b3...", "display_name": "Ninja"}' 
      },
    ]
  },
  {
    title: "4. System & Infrastructure",
    description: "Health and diagnostics.",
    endpoints: [
      { 
        method: 'GET', 
        path: '/health', 
        description: 'Basic system uptime check.', 
        tier: 'free',
        response: '{"status": "ok", "uptime": "45d 12h"}' 
      },
      { 
        method: 'GET', 
        path: '/health/detailed', 
        description: 'DB, R2, and Epic API heartbeat check.', 
        tier: 'free',
        response: '{"database": "healthy", "storage": "healthy", "epic_api": "healthy"}' 
      },
      { 
        method: 'GET', 
        path: '/metrics', 
        description: 'Prometheus metrics for monitoring.', 
        tier: 'free',
        response: '# HELP api_requests_total ...' 
      },
      { 
        method: 'GET', 
        path: '/v1/spec', 
        description: 'Full OpenAPI / Swagger documentation.', 
        tier: 'free',
        response: '{"openapi": "3.0.0", "info": {...}}' 
      },
    ]
  }
];
