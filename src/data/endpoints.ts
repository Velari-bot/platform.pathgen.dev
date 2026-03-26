export interface Endpoint {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  path: string;
  description: string;
  credits?: number | string;
  parameters?: { name: string; required: boolean; description: string }[];
  exampleRequest?: string;
  response?: string;
  useCase?: string;
}

export interface Section {
  title: string;
  endpoints: Endpoint[];
}

export const ENDPOINTS_DATA: Section[] = [
  {
    title: "1. Account & Auth",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/account/balance',
        description: 'Check your current credit balance and plan details.',
        response: `{
  "credits": 9430,
  "api_key": "rs_35402b9d...",
  "plan": "pay_as_you_go"
}`
      },
      {
        method: 'GET',
        path: '/v1/account/keys',
        description: 'List all active API keys for your organization.',
        response: `{
  "keys": [
    {
      "id": "rs_35402b9d",
      "label": "My App",
      "created_at": "2026-03-01T00:00:00Z",
      "last_used": "2026-03-24T10:00:00Z"
    }
  ]
}`
      },
      {
        method: 'POST',
        path: '/v1/account/keys',
        description: 'Generate a new API key.',
        exampleRequest: '{ "label": "Production Key" }',
        response: `{
  "key": "rs_newly_generated_key",
  "label": "Production Key",
  "created_at": "2026-03-24T00:00:00Z"
}`
      },
      {
        method: 'DELETE',
        path: '/v1/account/keys/{id}',
        description: 'Revoke and delete a specific API key.',
        response: `{ "deleted": true }`
      }
    ]
  },
  {
    title: "2. Free Game Data",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/account/lookup',
        description: 'Find an Epic ID and basic stats using a display name.',
        parameters: [{ name: 'name', required: true, description: 'Epic display name' }],
        response: `{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "display_name": "blackgirlslikeme",
  "platform": "PC",
  "level": 316,
  "wins": 13,
  "kills": 538,
  "kd": 0.55
}`
      },
      {
        method: 'GET',
        path: '/v1/account/ranked',
        description: "Get current rank (Elite, Champion, etc.) and % progress.",
        parameters: [{ name: 'accountId', required: true, description: 'Epic account ID' }],
        response: `{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "modes": [
    {
      "mode": "ranked-br",
      "division_name": "Elite",
      "promotion_progress": 67.4,
      "is_unreal": false
    }
  ]
}`
      },
      {
        method: 'GET',
        path: '/v1/account/stats',
        description: "Detailed lifetime or season stats by mode and input type.",
        parameters: [{ name: 'accountId', required: true, description: 'Epic account ID' }],
        response: `{
  "overall": {
    "wins": 13,
    "kills": 538,
    "kd": 0.55,
    "matches": 862,
    "win_rate": 1.5,
    "headshot_pct": 18.36
  },
  "by_mode": {
    "solo": { "wins": 10, "kills": 312, "kd": 0.60 }
  }
}`
      },
      {
        method: 'GET',
        path: '/v1/game/cosmetics',
        description: "Search skins, emotes, etc. with rarity and type filters.",
        response: `{
  "total": 342,
  "items": [
    {
      "id": "CID_001_Athena_Commando_F",
      "name": "Ramirez",
      "type": "outfit",
      "rarity": "common",
      "image_url": "https://cdn.pathgen.dev/..."
    }
  ]
}`
      },
      {
        method: 'GET',
        path: '/v1/game/cosmetics/{id}',
        description: "Get specific details, styles, and shop history for one item.",
        response: `{
  "id": "CID_001_Athena_Commando_F",
  "name": "Ramirez",
  "variants": [...],
  "styles": [],
  "shop_history": [{ "date": "2021-03-01", "price": 800 }]
}`
      },
      {
        method: 'GET',
        path: '/v1/game/shop',
        description: "Returns the current daily and featured Item Shop.",
        response: `{
  "updated_at": "2026-03-24T00:00:00Z",
  "sections": [
    {
      "id": "featured",
      "items": [{ "id": "CID_XYZ", "name": "Galaxy Scout", "price": 1500 }]
    }
  ]
}`
      },
      {
        method: 'GET',
        path: '/v1/game/weapons',
        description: "Detailed stats (DPS, fire rate) for current/past weapons.",
        response: `{
  "season": "ch7s2",
  "weapons": [
    {
      "id": "WID_Shotgun_ChaosReloader_Athena_L",
      "name": "Chaos Reloader Shotgun",
      "damage": 76,
      "dps": 152
    }
  ]
}`
      },
      {
        method: 'GET',
        path: '/v1/game/map',
        description: "Get current map image and GPS coordinates for all POIs.",
        response: `{
  "season": "ch7s2",
  "map_url": "https://cdn.pathgen.dev/maps/ch7s2.png",
  "pois": [
    { "name": "Tiptop Terrace", "x": -80000, "y": -90000 },
    { "name": "Dark Dominion", "x": 10000, "y": -10000 }
  ]
}`
      },
      {
        method: 'GET',
        path: '/v1/game/news',
        description: "Latest in-game news for BR, StW, and Creative.",
        response: `{
  "br": [{ "title": "New Season Begins", "image_url": "..." }],
  "stw": [],
  "creative": []
}`
      },
      {
        method: 'GET',
        path: '/v1/game/playlists',
        description: "See what modes are currently live (Solo, Ranked, ZB).",
        response: `{
  "playlists": [
    { "id": "Playlist_DefaultSolo", "name": "Solo", "is_ranked": false }
  ]
}`
      }
    ]
  },
  {
    title: "3. Paid Replay Parsing",
    endpoints: [
      {
        method: 'POST',
        path: '/v1/replay/parse',
        credits: 20,
        description: "The 'Everything' Call. Stats, movement, weapons, and AI coaching.",
        useCase: "Deep analysis for pro tools.",
        response: `{
  "credits_used": 20,
  "parse_time_ms": 842,
  "data": {
    "match_overview": { "result": "Victory Royale", "placement": 1 },
    "combat_summary": { "eliminations": { "total": 6 } },
    "weapon_deep_dive": [{ "weapon": "Chaos Reloader Shotgun", "accuracy": "44.4%" }],
    "ai_coach": { "strengths": ["Victory Royale secured"], "weaknesses": ["Accuracy below average"] }
  }
}`
      },
      {
        method: 'POST',
        path: '/v1/replay/stats',
        credits: 5,
        description: "Cheapest way to get just the numbers (kills, damage, placement).",
        useCase: "Lightweight statues/trackers.",
        response: `{
  "credits_used": 5,
  "data": { "result": "Victory Royale", "placement": 1, "kills": 4, "damage_to_players": 1108 }
}`
      },
      {
        method: 'POST',
        path: '/v1/replay/scoreboard',
        credits: 8,
        description: "Get the name and rank of every single person in that match.",
        useCase: "Tournament leaderboards.",
        response: `{
  "credits_used": 8,
  "data": { "scoreboard": [{ "rank": 1, "name": "dallasfanangel67", "kills": 26 }] }
}`
      },
      {
        method: 'POST',
        path: '/v1/replay/movement',
        credits: 8,
        description: "Get (X, Y, Z) coordinates for player track and bus route.",
        useCase: "Map visualizations.",
        response: `{
  "credits_used": 8,
  "data": { "bus_route": { "direction_degrees": 22.4 }, "player_track": [{ "x": 7104, "y": 1216, "timestamp_ms": 62000 }] }
}`
      },
      {
        method: 'POST',
        path: '/v1/replay/weapons',
        credits: 8,
        description: "Deep dive into accuracy, headshot rate per specific weapon.",
        useCase: "Aim analysis.",
        response: `{
  "credits_used": 8,
  "data": { "best_weapon": "Chaos Reloader Shotgun", "weapons": [{ "weapon": "Chaos Reloader", "accuracy": "44.4%" }] }
}`
      },
      {
        method: 'POST',
        path: '/v1/replay/events',
        credits: 10,
        description: "Timeline of killers, revives, and storm shrinks.",
        useCase: "Interactive timelines/replays.",
        response: `{
  "credits_used": 19,
  "data": { "events": { "elim": [{ "type": "elim", "timestamp_ms": 180000, "x": 8192, "y": -4096 }] } }
}`
      },
      {
        method: 'POST',
        path: '/v1/replay/drop-analysis',
        credits: 15,
        description: "Compares your landing to the 'perfect' jump telemetry.",
        useCase: "Training & coaching.",
        response: `{
  "credits_used": 15,
  "data": { "drop_score": "100.0%", "delay_seconds": 28.8, "ideal_jump": { "time_formatted": "0:35" } }
}`
      }
    ]
  },
  {
    title: "4. Exclusive & Session",
    endpoints: [
      {
        method: 'POST',
        path: '/v1/replay/rotation-score',
        credits: 25,
        description: "Grades movement relative to storm (Early/On Time).",
        useCase: "High-level strategic analysis.",
        response: `{
  "credits_used": 25,
  "data": { "rotation_score": 87, "grade": "A", "per_phase": [{ "phase": 1, "rotation_timing": "early" }] }
}`
      },
      {
        method: 'POST',
        path: '/v1/replay/opponents',
        credits: 30,
        description: "Cross-reference players to see if you've fought them before.",
        useCase: "Rivalries & match history.",
        response: `{
  "credits_used": 30,
  "data": { "opponents": [{ "name": "dallasfanangel67", "history": { "times_seen": 3, "avg_placement": 2.1 } }] }
}`
      },
      {
        method: 'POST',
        path: '/v1/session/analyze',
        credits: 50,
        description: "Upload up to 6 replays at once for tournament tracking.",
        useCase: "Consistency & FNCS tracking.",
        response: `{
  "credits_used": 50,
  "data": { "session_id": "rs_session_abc", "matches_analyzed": 6, "consistency_rating": "B+", "avg_placement": 4.8 }
}`
      }
    ]
  },
  {
    title: "5. Maps & High-Fidelity Tiling",
    endpoints: [
      {
        method: 'GET',
        path: '/v1/game/tiles/{z}/{x}/{y}',
        credits: 3,
        description: 'Returns a high-resolution, Lanczos3-resampled PNG image tile for use with Leaflet.',
        parameters: [
          { name: 'z', required: true, description: 'Zoom level (0-5)' },
          { name: 'x', required: true, description: 'Horizontal tile coordinate' },
          { name: 'y', required: true, description: 'Vertical tile coordinate' }
        ],
        response: `{
  "status": 202,
  "error": "Tiles are being generated. Please wait."
}`
      }
    ]
  }
];
