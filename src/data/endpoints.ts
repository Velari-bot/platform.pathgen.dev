export interface Endpoint {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'WEBHOOK';
  path: string;
  description: string;
  credits?: number | string;
  parameters?: { name: string; required: boolean; description: string }[];
  exampleRequest?: string;
  response?: string;
  useCase?: string;
  status?: 'alpha' | 'beta' | 'coming-soon' | 'free' | 'paid';
  tier: 'free' | 'pro';
}

export interface Section {
  title: string;
  endpoints: Endpoint[];
}

export const ENDPOINTS_DATA: Section[] = [
  {
    title: "1. Core & Infrastructure (Free Tier)",
    endpoints: [
      {
        method: 'POST',
        path: '/v1/replay/parse',
        credits: 20,
        description: 'Binary extraction of Fortnite .replay files. Returns core match telemetry.',
        status: 'paid',
        tier: 'free',
        response: `{ "match_id": "match_abc", "credits_used": 20, "data": { "result": "Victory Royale" } }`
      },
      {
        method: 'GET',
        path: '/v1/game/aes',
        credits: 0,
        description: 'Retrieves current dynamic AES encryption keys.',
        status: 'free',
        tier: 'free',
        response: `{ "main_key": "0x4b3h...", "dynamic_keys": [] }`
      },
      {
        method: 'GET',
        path: '/health',
        credits: 0,
        description: 'API infrastructure health check.',
        status: 'free',
        tier: 'free',
        response: `{ "status": "operational" }`
      }
    ]
  },
  {
    title: "2. AI Intelligence Layer (Pro Tier)",
    endpoints: [
      {
        method: 'POST',
        path: '/v1/ai/analyze',
        credits: "15-20",
        description: 'Gemini-powered tactical coaching and scoring.',
        status: 'beta',
        tier: 'pro',
        response: `{ "analysis": "Rotate earlier.", "score": 85 }`
      },
      {
        method: 'POST',
        path: '/v1/ai/session-coach',
        credits: 50,
        description: 'Cross-match pattern recognition for 6 concurrent parses.',
        status: 'beta',
        tier: 'pro',
        response: `{ "coach": { "tip": "Control mid-game rotations more selectively." } }`
      }
    ]
  },
  {
    title: "3. Enhanced Analytics (Pro Tier)",
    endpoints: [
      {
        method: 'POST',
        path: '/v1/replay/enhanced/heatmap',
        credits: 25,
        description: 'X,Y coordinate density grids for map overlays.',
        status: 'beta',
        tier: 'pro',
        response: `{ "heatmap_url": "https://assets.pathgen.dev/render/..." }`
      },
      {
        method: 'POST',
        path: '/v1/replay/enhanced/timeline',
        credits: 15,
        description: 'Chronological event feed with clutch-moment identification.',
        status: 'beta',
        tier: 'pro',
        response: `{ "events": [{ "time": 420, "event": "Clutch Win" }] }`
      }
    ]
  },
  {
    title: "4. Identity & Private Data (Mixed)",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/game/stats',
        credits: 5,
        description: 'Fused career statistics. Available to all tiers.',
        status: 'paid',
        tier: 'free',
        response: `{ "wins": 420, "kills": 1502 }`
      },
      {
        method: 'GET',
        path: '/v1/game/player/locker',
        credits: 10,
        description: 'Equipped cosmetics for linked profiles. Requires OAuth.',
        status: 'beta',
        tier: 'pro',
        response: `{ "locker": { "skins": ["Midas"] } }`
      }
    ]
  },
  {
    title: "5. Metadata & World (Free Tier)",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/game/shop',
        credits: 2,
        description: 'Daily Item Shop rotation with R2 mirrored assets.',
        status: 'paid',
        tier: 'free',
        response: `{ "offers": [{ "id": "Midas", "vbucks": 1200 }] }`
      },
      {
        method: 'GET',
        path: '/v1/game/news',
        credits: 1,
        description: 'Real-time patch notes and seasonal headlines.',
        status: 'paid',
        tier: 'free',
        response: `{ "br": [{ "title": "New Season" }] }`
      }
    ]
  },
  {
    title: "6. Automation & Events (Pro Tier Webhooks)",
    endpoints: [
      {
        method: 'WEBHOOK',
        path: 'shop.rotate',
        description: 'Fires instantly when the Fortnite daily shop resets.',
        tier: 'pro',
        response: `{ "event": "shop.rotate", "timestamp": "...", "data": { ... } }`
      },
      {
        method: 'WEBHOOK',
        path: 'aes.rotate',
        description: 'Pushed when a new dynamically encrypted key is detected after a game update.',
        tier: 'pro',
        response: `{ "event": "aes.rotate", "new_key": "0x..." }`
      },
      {
        method: 'WEBHOOK',
        path: 'replay.complete',
        description: 'Asynchronous notification when a large replay parse task finishes processing.',
        tier: 'pro',
        response: `{ "event": "replay.complete", "match_id": "...", "status": "success" }`
      }
    ]
  }
];
