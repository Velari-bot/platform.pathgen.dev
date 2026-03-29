export interface Endpoint {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  path: string;
  description: string;
  credits?: number | string;
  parameters?: { name: string; required: boolean; description: string }[];
  exampleRequest?: string;
  response?: string;
  useCase?: string;
  status?: 'alpha' | 'beta' | 'coming-soon' | 'free' | 'paid';
}

export interface Section {
  title: string;
  endpoints: Endpoint[];
}

export const ENDPOINTS_DATA: Section[] = [
  {
    title: "1. Auth & Global",
    endpoints: [
      {
        method: 'GET',
        path: '/health',
        description: 'Primary health check for the API infrastructure.',
        response: `{ "status": "healthy", "version": "1.0.0" }`
      },
      {
        method: 'GET',
        path: '/health/detailed',
        description: 'Full system status including Database, Storage, and External APIs.',
        response: `{ "status": "healthy", "db": "connected", "storage": "online", "services": { "fortnite": "live" } }`
      },
      {
        method: 'GET',
        path: '/metrics',
        description: 'Prometheus-compatible system and performance metrics.',
        response: `# HELP http_requests_total Total number of HTTP requests\nhttp_requests_total{method="GET",path="/v1/game/stats",status="200"} 1254\n...`
      },
      {
        method: 'GET',
        path: '/v1/game/ping',
        description: 'Network latency and server timestamp test.',
        response: `{ "pong": true, "latency_ms": 42, "timestamp": "2026-03-27T13:42:00Z" }`
      }
    ]
  },
  {
    title: "2. Game World Data",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/game/map',
        description: 'Returns URLs for high-res raw Fortnite island maps.',
        response: `{ "season": "ch7s2", "map_url": "https://cdn.pathgen.dev/maps/ch7s2.png" }`
      },
      {
        method: 'GET',
        path: '/v1/game/map/config',
        description: 'Full Leaflet.js configuration including bounds and POI coordinates.',
        response: `{ "bounds": [[-131072, -131072], [131072, 131072]], "pois": [{ "name": "Tiptop Terrace", "x": -80000, "y": -90000 }] }`
      },
      {
        method: 'GET',
        path: '/v1/game/map/tiles',
        description: 'Full list of 1,365 tile URLs with coordinates for mapping engines.',
        response: `{ "tiles": ["https://assets.pathgen.dev/tiles/0/0/0.png", "..."] }`
      },
      {
        method: 'GET',
        path: '/v1/game/tiles/{z}/{x}/{y}',
        credits: 30,
        description: 'Direct redirect to a map tile. Includes a 24h unlimited access pass.',
        parameters: [
          { name: 'z', required: true, description: 'Zoom level' },
          { name: 'x', required: true, description: 'X coordinate' },
          { name: 'y', required: true, description: 'Y coordinate' }
        ],
        response: `// HTTP 302 Redirect to tile image`
      },
      {
        method: 'GET',
        path: '/v1/game/news',
        description: 'Latest in-game news and patch notes from Fortnite.',
        response: `{ "br": [{ "title": "New Season Begins", "body": "..." }] }`
      },
      {
        method: 'GET',
        path: '/v1/game/playlists',
        description: 'Current active game modes, LTMs, and tournament playlists.',
        response: `{ "playlists": [{ "id": "Playlist_DefaultSolo", "name": "Solo" }] }`
      },
      {
        method: 'GET',
        path: '/v1/game/weapons',
        description: 'Full list and stats for the current seasonal weapon pool.',
        response: `{ "weapons": [{ "id": "WID_Shotgun_ChaosReloader", "name": "Chaos Reloader", "damage": 76 }] }`
      }
    ]
  },
  {
    title: "3. Player Statistics",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/game/lookup',
        description: 'Map Epic display names to unique Account IDs.',
        parameters: [{ name: 'name', required: true, description: 'Epic display name' }],
        response: `{ "account_id": "3f88ac4d...", "display_name": "Ninja" }`
      },
      {
        method: 'GET',
        path: '/v1/game/ranked',
        description: 'Current rank division, promotion progress, and leaderboards.',
        parameters: [{ name: 'accountId', required: true, description: 'Epic account ID' }],
        response: `{ "modes": [{ "mode": "ranked-br", "division_name": "Elite", "promotion_progress": 67.4 }] }`
      },
      {
        method: 'GET',
        path: '/v1/game/stats',
        description: 'Comprehensive lifetime and seasonal K/D, Wins, and Match history.',
        parameters: [{ name: 'accountId', required: true, description: 'Epic account ID' }],
        response: `{ "overall": { "wins": 13, "kills": 538, "kd": 0.55 } }`
      }
    ]
  },
  {
    title: "4. Replay Parsing",
    endpoints: [
      {
        method: 'POST',
        path: '/v1/replay/parse',
        credits: 20,
        description: 'Full recursive parse of all match telemetry and data.',
        response: `{ "credits_used": 20, "data": { "match_overview": { "result": "Victory Royale" } } }`
      },
      {
        method: 'POST',
        path: '/v1/replay/stats',
        credits: 5,
        description: 'High-speed combat and building summary extraction.',
        response: `{ "credits_used": 5, "data": { "kills": 4, "placement": 1 } }`
      },
      {
        method: 'POST',
        path: '/v1/replay/scoreboard',
        credits: 8,
        description: 'Full match lobby listing including names, kills, and ranks.',
        response: `{ "credits_used": 8, "data": { "scoreboard": [{ "rank": 1, "name": "dallasfanangel67", "kills": 26 }] } }`
      },
      {
        method: 'POST',
        path: '/v1/replay/movement',
        credits: 8,
        description: 'Complete positional data for drop, death, and player tracks.',
        response: `{ "credits_used": 8, "data": { "player_track": [{ "x": 7104, "y": 1216 }] } }`
      },
      {
        method: 'POST',
        path: '/v1/replay/events',
        credits: 10,
        description: 'Chronological feed of all kills, storm phases, and revives.',
        response: `{ "credits_used": 10, "data": { "events": { "elim": [...] } } }`
      },
      {
        method: 'POST',
        path: '/v1/replay/drop-analysis',
        credits: 15,
        description: 'Physics-based score of landing efficiency vs mathematical optimum.',
        response: `{ "credits_used": 15, "data": { "drop_score": "100.0%", "delay_seconds": 28.8 } }`
      }
    ]
  },
  {
    title: "5. Account & Keys",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/account/balance',
        description: 'Retrieve your current remaining credit balance.',
        response: `{ "credits": 9430, "plan": "pay_as_you_go" }`
      },
      {
        method: 'GET',
        path: '/v1/account/keys',
        description: 'List all active API keys for your account.',
        response: `{ "keys": [{ "id": "rs_35402b9d", "label": "My App" }] }`
      },
      {
        method: 'POST',
        path: '/v1/account/keys',
        description: 'Generate a new private API key.',
        exampleRequest: `{ "name": "Production Key" }`,
        response: `{ "key": "rs_newly_generated_key", "label": "Production Key" }`
      },
      {
        method: 'DELETE',
        path: '/v1/account/keys/{id}',
        description: 'Revoke and delete an existing API key.',
        parameters: [{ name: 'id', required: true, description: 'Key ID to revoke' }],
        response: `{ "deleted": true }`
      },
      {
        method: 'GET',
        path: '/v1/account/usage',
        description: 'Retrieve lifetime API request count and usage trends.',
        response: `{ "total_requests": 1542, "trends": [...] }`
      }
    ]
  },
  {
    title: "6. Billing",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/billing/history',
        description: 'List all historical credit purchase records.',
        response: `{ "history": [{ "id": "TX_154", "amount": "$40.00", "credits": 50000 }] }`
      },
      {
        method: 'POST',
        path: '/v1/billing/checkout',
        description: 'Generate a Stripe checkout session for credit packs.',
        exampleRequest: `{ "pack_id": "pack_pro" }`,
        response: `{ "checkout_url": "https://checkout.stripe.com/..." }`
      }
    ]
  },
  {
    title: "7. Admin Logs",
    endpoints: [
      {
        method: 'GET',
        path: '/logs/requests',
        description: 'Paginated stream of all global API request logs.',
        response: `{ "logs": [{ "id": "req_5502", "endpoint": "POST /v1/replay/parse", "credits": 20 }] }`
      },
      {
        method: 'GET',
        path: '/logs/errors',
        description: 'System-wide error trace logs for failed requests.',
        response: `{ "errors": [{ "timestamp": "...", "message": "PARSE_FAILED" }] }`
      },
      {
        method: 'GET',
        path: '/logs/live',
        description: 'Server-Sent Events (SSE) stream for live global monitoring.',
        response: `data: { "event": "request", "path": "/v1/game/stats" }\n\n`
      }
    ]
  },
  {
    title: "8. AI Analysis & Coaching",
    endpoints: [
      {
        method: 'POST',
        path: '/v1/ai/coach',
        credits: 30,
        description: 'Comprehensive single-match tactical breakdown using Gemini-based reasoning.',
        response: `{ "credits_used": 30, "analysis": "You over-indexed on structures in final zone—try rotating earlier next time." }`
      },
      {
        method: 'POST',
        path: '/v1/ai/session-coach',
        credits: 50,
        description: 'Multi-match analysis for tournament pattern recognition.',
        response: `{ "credits_used": 50, "consistency_rating": "B-", "recommendation": "Stop contested drops at Tiptop Terrace." }`
      },
      {
        method: 'POST',
        path: '/v1/ai/weapon-coach',
        credits: 20,
        description: 'Mastery report comparing equip counts to actual damage.',
        response: `{ "credits_used": 20, "weapon": "Chaos Reloader", "insight": "High equip count but low damage—improve switch-and-shoot timing." }`
      },
      {
        method: 'POST',
        path: '/v1/ai/drop-recommend',
        credits: 20,
        description: 'Survival-based landing advice for specific bus routes.',
        response: `{ "credits_used": 20, "route": "N -> S", "best_drop": "Sandy Strip" }`
      },
      {
        method: 'POST',
        path: '/v1/ai/opponent-scout',
        credits: 25,
        description: 'Playstyle identification (Aggro / Passive) based on stats.',
        response: `{ "credits_used": 25, "player": "dallasfan67", "profile": "Aggressive rusher with high SMG usage." }`
      }
    ]
  }
];
