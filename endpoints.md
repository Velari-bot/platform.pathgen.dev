# Pathgen API Documentation

---

## Base URL

```
https://api.pathgen.gg/v1
```

All requests require an `Authorization` header with your API key except free endpoints.

```
Authorization: Bearer rs_your_api_key_here
```

Responses are always JSON. Errors follow a consistent shape:

```json
{
  "error": true,
  "code": "INSUFFICIENT_CREDITS",
  "message": "You need 20 credits but have 4 remaining."
}
```

---

## Authentication and Credits

**Get your balance**
```
GET /account/balance
```
Response:
```json
{
  "credits": 9430,
  "api_key": "rs_35402b9d...",
  "plan": "pay_as_you_go"
}
```

**List your API keys**
```
GET /account/keys
```
Response:
```json
{
  "keys": [
    {
      "id": "rs_35402b9d",
      "label": "My App",
      "created_at": "2026-03-01T00:00:00Z",
      "last_used": "2026-03-24T10:00:00Z"
    }
  ]
}
```

**Create an API key**
```
POST /account/keys
```
Body:
```json
{ "label": "My App" }
```
Response:
```json
{
  "key": "rs_newly_generated_key",
  "label": "My App",
  "created_at": "2026-03-24T00:00:00Z"
}
```

**Delete an API key**
```
DELETE /account/keys/{keyId}
```
Response:
```json
{ "deleted": true }
```

---

---

# FREE ENDPOINTS

No credits required. No API key required. Rate limit: 60 requests per minute per IP.

---

## Section: Account

### `GET /account/lookup`

Look up an Epic Games account by display name. Returns account ID and platform stats.

**Query parameters:**
- `name` (required) — Epic display name

**Example request:**
```
GET /v1/account/lookup?name=blackgirlslikeme
```

**Response:**
```json
{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "display_name": "blackgirlslikeme",
  "platform": "PC",
  "level": 316,
  "wins": 13,
  "kills": 538,
  "kd": 0.55,
  "matches": 862,
  "win_rate": 1.5,
  "minutes_played": 9087,
  "top10": 245,
  "solo_wins": 10,
  "solo_kd": 0.60,
  "solo_matches": 312
}
```

---

### `GET /account/ranked`

Get a player's current ranked division and promotion progress.

**Query parameters:**
- `accountId` (required) — Epic account ID from `/account/lookup`

**Example request:**
```
GET /v1/account/ranked?accountId=3f88ac4d331b43e5a85b30b696e9fc54
```

**Response:**
```json
{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "display_name": "blackgirlslikeme",
  "modes": [
    {
      "mode": "ranked-br",
      "mode_name": "Ranked Battle Royale",
      "division": 14,
      "division_name": "Elite",
      "division_group": "Elite",
      "promotion_progress": 67.4,
      "is_unreal": false,
      "unreal_rank": null
    },
    {
      "mode": "ranked-zb",
      "mode_name": "Ranked Zero Build",
      "division": 12,
      "division_name": "Champion",
      "promotion_progress": 23.1,
      "is_unreal": false,
      "unreal_rank": null
    }
  ]
}
```

---

### `GET /account/stats`

Get full lifetime and season stats for a player broken down by mode and input type.

**Query parameters:**
- `accountId` (required) — Epic account ID
- `timeframe` (optional) — `lifetime` or `season` (default: `lifetime`)

**Example request:**
```
GET /v1/account/stats?accountId=3f88ac4d331b43e5a85b30b696e9fc54&timeframe=season
```

**Response:**
```json
{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "timeframe": "season",
  "overall": {
    "wins": 13,
    "kills": 538,
    "deaths": 970,
    "kd": 0.55,
    "matches": 862,
    "win_rate": 1.5,
    "avg_placement": 23.25,
    "top3": 18,
    "top5": 32,
    "top10": 245,
    "top25": 410,
    "damage_to_players": 190812,
    "damage_from_players": 270047,
    "minutes_played": 9087,
    "headshot_pct": 18.36
  },
  "by_mode": {
    "solo": { "wins": 10, "kills": 312, "kd": 0.60, "matches": 312 },
    "duo":  { "wins": 2,  "kills": 148, "kd": 0.48, "matches": 280 },
    "squad":{ "wins": 1,  "kills": 78,  "kd": 0.52, "matches": 270 }
  },
  "by_input": {
    "keyboard_mouse": { "wins": 13, "kills": 538, "kd": 0.55, "matches": 862 },
    "gamepad":        { "wins": 0,  "kills": 12,  "kd": 0.30, "matches": 40  }
  }
}
```

---

## Section: Game Data

### `GET /game/cosmetics`

Search the full Fortnite cosmetics database including leaked and unreleased items.

**Query parameters:**
- `search` (optional) — search by name
- `type` (optional) — `outfit`, `backbling`, `pickaxe`, `glider`, `wrap`, `emote`, `music`, `spray`, `banner`, `charm`
- `rarity` (optional) — `common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic`, `exotic`
- `set` (optional) — cosmetic set name
- `page` (optional) — page number (default: 1)
- `limit` (optional) — results per page, max 100 (default: 20)

**Example request:**
```
GET /v1/game/cosmetics?type=outfit&rarity=legendary&limit=5
```

**Response:**
```json
{
  "total": 342,
  "page": 1,
  "limit": 5,
  "items": [
    {
      "id": "CID_001_Athena_Commando_F",
      "name": "Ramirez",
      "type": "outfit",
      "rarity": "common",
      "set": null,
      "series": null,
      "intro_season": "Chapter 1 Season 1",
      "description": "Ready to fight.",
      "image_url": "https://cdn.pathgen.gg/cosmetics/CID_001.png",
      "icon_url": "https://cdn.pathgen.gg/cosmetics/icons/CID_001.png",
      "is_exclusive": false,
      "added_at": "2017-10-25T00:00:00Z"
    }
  ]
}
```

---

### `GET /game/cosmetics/{id}`

Get a single cosmetic by its ID with full variant and style data.

**Example request:**
```
GET /v1/game/cosmetics/CID_001_Athena_Commando_F
```

**Response:**
```json
{
  "id": "CID_001_Athena_Commando_F",
  "name": "Ramirez",
  "type": "outfit",
  "rarity": "common",
  "set": null,
  "variants": [
    {
      "channel": "Material",
      "type": "Mat1",
      "name": "Default",
      "image_url": "https://cdn.pathgen.gg/..."
    }
  ],
  "styles": [],
  "shop_history": [
    { "date": "2021-03-01", "price": 800 }
  ]
}
```

---

### `GET /game/shop`

Get today's item shop — daily and featured sections.

**Example request:**
```
GET /v1/game/shop
```

**Response:**
```json
{
  "updated_at": "2026-03-24T00:00:00Z",
  "sections": [
    {
      "id": "featured",
      "name": "Featured Items",
      "items": [
        {
          "id": "CID_XYZ",
          "name": "Galaxy Scout",
          "type": "outfit",
          "rarity": "epic",
          "price": 1500,
          "bundle": null,
          "image_url": "https://cdn.pathgen.gg/...",
          "expires_at": "2026-03-25T00:00:00Z"
        }
      ]
    },
    {
      "id": "daily",
      "name": "Daily Items",
      "items": []
    }
  ]
}
```

---

### `GET /game/weapons`

Get all weapons for a given season with full stats.

**Query parameters:**
- `season` (optional) — e.g. `ch7s2` (default: current season)
- `type` (optional) — `shotgun`, `ar`, `smg`, `sniper`, `pistol`, `launcher`, `melee`
- `rarity` (optional) — filter by rarity

**Example request:**
```
GET /v1/game/weapons?season=ch7s2&type=shotgun
```

**Response:**
```json
{
  "season": "ch7s2",
  "weapons": [
    {
      "id": "WID_Shotgun_ChaosReloader_Athena_L",
      "name": "Chaos Reloader Shotgun",
      "type": "shotgun",
      "rarity": "legendary",
      "damage": 76,
      "dps": 152,
      "fire_rate": 2.0,
      "magazine_size": 6,
      "reload_time": 2.4,
      "structure_damage": 57,
      "image_url": "https://cdn.pathgen.gg/weapons/chaos_reloader.png"
    }
  ]
}
```

---

### `GET /game/map`

Get the current season map image and all named POI locations with world coordinates.

**Example request:**
```
GET /v1/game/map
```

**Response:**
```json
{
  "season": "ch7s2",
  "map_url": "https://cdn.pathgen.gg/maps/ch7s2.png",
  "tile_url": "https://cdn.pathgen.gg/tiles/ch7s2/{z}/{x}/{y}.png",
  "max_zoom": 5,
  "world_bounds": {
    "min_x": -131072,
    "max_x": 131072,
    "min_y": -131072,
    "max_y": 131072
  },
  "pois": [
    { "name": "Tiptop Terrace",        "x": -80000, "y": -90000 },
    { "name": "Dark Dominion",          "x":  10000, "y": -10000 },
    { "name": "Humble Hills",           "x": -10000, "y":  20000 },
    { "name": "Ripped Tides",           "x": -60000, "y":  40000 },
    { "name": "Battlewood Boulevard",   "x": -20000, "y":  55000 },
    { "name": "Sandy Strip",            "x":  80000, "y": -20000 },
    { "name": "Sus Studios",            "x":  40000, "y":  20000 },
    { "name": "New Sanctuary",          "x":  70000, "y":  30000 }
  ]
}
```

---

### `GET /game/news`

Get the current in-game news for Battle Royale, STW, and Creative.

**Example request:**
```
GET /v1/game/news
```

**Response:**
```json
{
  "br": [
    {
      "title": "New Season Begins",
      "body": "A new chapter starts now.",
      "image_url": "https://cdn.pathgen.gg/news/...",
      "adspace": "NDS"
    }
  ],
  "stw": [],
  "creative": []
}
```

---

### `GET /game/playlists`

Get all currently available game modes and playlists.

**Example request:**
```
GET /v1/game/playlists
```

**Response:**
```json
{
  "playlists": [
    {
      "id": "Playlist_DefaultSolo",
      "name": "Solo",
      "min_players": 1,
      "max_players": 1,
      "team_size": 1,
      "is_ranked": false,
      "is_zero_build": false,
      "image_url": "https://cdn.pathgen.gg/playlists/solo.png"
    },
    {
      "id": "Playlist_ShowdownAlt_Solo",
      "name": "Ranked Solo",
      "min_players": 1,
      "max_players": 1,
      "team_size": 1,
      "is_ranked": true,
      "is_zero_build": false,
      "image_url": "https://cdn.pathgen.gg/playlists/ranked_solo.png"
    }
  ]
}
```

---

---

# PAID ENDPOINTS

All paid endpoints require an API key. Credits are deducted on successful response only — failed parses or invalid files are not charged.

---

## Section: Replay Parsing

All replay endpoints accept a `.replay` file uploaded as `multipart/form-data` with the field name `replay`.

---

### `POST /replay/parse`

**Cost: 20 credits per request**

Upload a `.replay` file and receive the complete match analysis. This is the full pipeline — everything the parser extracts in one call.

**Request:**
```
POST /v1/replay/parse
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 20,
  "credits_remaining": 9410,
  "parse_time_ms": 842,
  "data": {
    "match_overview": {
      "session_id": "2026-03-21-13-32-00",
      "result": "Victory Royale",
      "placement": 1,
      "mode": "Solo",
      "timestamp": "2026-03-21T13:32:00",
      "lobby": {
        "players": 98,
        "humans": 28,
        "ais": 70,
        "teams": 98
      },
      "performance_metrics": {
        "time_alive": "18m 40s",
        "time_alive_ms": 1120000,
        "drop_score": "100.0%",
        "ideal_drop_time": "35.0s",
        "actual_drop_time": "63.8s"
      }
    },
    "combat_summary": {
      "eliminations": {
        "total": 6,
        "players": 4,
        "ai": 2
      },
      "damage": {
        "to_players": 1108,
        "from_players": 398,
        "to_ai": 250,
        "player_damage_ratio": 2.78,
        "self_damage": 0,
        "storm_damage": 0,
        "fall_damage": 0
      },
      "accuracy": {
        "overall_percentage": "21.3%",
        "total_shots": 432,
        "hits_to_players": 32,
        "hits_to_ai": 7,
        "headshots": 4,
        "headshot_rate": "12.5%"
      },
      "survival": {
        "health_healed": 46,
        "shield_healed": 387,
        "overshield_healed": 0,
        "health_taken": 109,
        "shield_taken": 337,
        "overshield_taken": 0,
        "revives_given": 0,
        "revives_received": null,
        "time_in_storm_ms": 66000,
        "distance_foot_cm": 460000,
        "distance_skydiving_cm": 20000
      }
    },
    "building_and_utility": {
      "materials_gathered": {
        "wood": 2996,
        "stone": 1103,
        "metal": 1066
      },
      "mechanics": {
        "builds_placed": 327,
        "builds_edited": 74,
        "avg_edit_time_ms": null,
        "edit_accuracy": null,
        "weakpoint_accuracy": null
      }
    },
    "weapon_deep_dive": [
      {
        "weapon": "Chaos Reloader Shotgun",
        "rarity": "legendary",
        "is_best_weapon": true,
        "elims": 5,
        "damage_to_players": 328,
        "damage_to_ai": 125,
        "total_damage": 453,
        "shots_fired": 18,
        "hits_to_players": 8,
        "hits_to_ai": 1,
        "accuracy": "44.4%",
        "headshots": 4,
        "headshot_rate": "50.0%",
        "equips": 182,
        "reloads": 16
      },
      {
        "weapon": "Combat Assault Rifle",
        "rarity": "epic",
        "is_best_weapon": false,
        "elims": 0,
        "damage_to_players": 380,
        "damage_to_ai": 0,
        "total_damage": 380,
        "shots_fired": 209,
        "hits_to_players": 17,
        "hits_to_ai": 0,
        "accuracy": "8.1%",
        "headshots": 0,
        "headshot_rate": "0.0%",
        "equips": 27,
        "reloads": 9
      }
    ],
    "movement": {
      "drop_location": { "x": 7104,  "y": 1216,  "z": 19456 },
      "death_location": { "x": 12416, "y": -9600, "z": 1408  },
      "bus_route": {
        "start": { "x": -131000, "y": -20000 },
        "end":   { "x":  131000, "y":  80000 },
        "direction_degrees": 22.4
      },
      "player_track": [
        { "x": 7104, "y": 1216, "timestamp_ms": 62000 }
      ]
    },
    "storm": [
      {
        "phase": 1,
        "timestamp_ms": 60000,
        "radius_cm": 105723,
        "center_x": 0,
        "center_y": 0,
        "dps": 1
      }
    ],
    "scoreboard": [
      {
        "rank": 1,
        "name": "dallasfanangel67",
        "is_local_player": false,
        "kills": 26,
        "damage_dealt": 3545,
        "damage_taken": null,
        "headshots": null,
        "builds_placed": null
      },
      {
        "rank": 3,
        "name": "blackgirlslikeme",
        "is_local_player": true,
        "kills": 4,
        "damage_dealt": 1108,
        "damage_taken": 398,
        "headshots": 4,
        "builds_placed": 327
      }
    ],
    "elim_feed": [
      { "timestamp_ms": 180000, "x": 8192, "y": -4096 },
      { "timestamp_ms": 420000, "x": 12288, "y": 2048 }
    ],
    "ai_coach": {
      "summary": "Dominant solo match — Victory Royale with 6 eliminations and strong damage output.",
      "strengths": [
        "Victory Royale secured",
        "Top 5% eliminations (6 total)",
        "Elite damage output (1108 to players)",
        "Strong building (327 placed)"
      ],
      "weaknesses": [
        "Accuracy below average for rank (21.3%)"
      ]
    },
    "epic_data": {
      "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
      "display_name": "blackgirlslikeme",
      "platform": "PC",
      "level": 316,
      "wins": 13,
      "kills": 538,
      "kd": 0.55,
      "matches": 862,
      "win_rate": 1.5,
      "crown_wins": null,
      "ranked": null
    },
    "parser_meta": {
      "parsed_at": "2026-03-24T10:00:00Z",
      "parse_time_ms": 842,
      "file_version": 7,
      "chunks_decrypted": 65,
      "positions_extracted": 174487,
      "names_found": 92,
      "confidence": {
        "stats": "confirmed",
        "positions": "confirmed",
        "weapons": "confirmed"
      }
    }
  }
}
```

---

### `POST /replay/stats`

**Cost: 5 credits per request**

Returns only the core match statistics. No positions, no scoreboard, no weapons. Fastest and cheapest endpoint for stat tracking apps that just need the numbers.

**Request:**
```
POST /v1/replay/stats
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 5,
  "credits_remaining": 9405,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "result": "Victory Royale",
    "placement": 1,
    "total_players": 98,
    "timestamp": "2026-03-21T13:32:00",
    "kills": 4,
    "ai_kills": 2,
    "total_elims": 6,
    "assists": 0,
    "accuracy": "21.3%",
    "shots_fired": 432,
    "hits_to_players": 32,
    "headshots": 4,
    "headshot_rate": "12.5%",
    "damage_to_players": 1108,
    "damage_from_players": 398,
    "damage_ratio": 2.78,
    "storm_damage": 0,
    "fall_damage": 0,
    "health_healed": 46,
    "shield_healed": 387,
    "health_taken": 109,
    "shield_taken": 337,
    "time_alive": "18m 40s",
    "time_alive_ms": 1120000,
    "time_in_storm_ms": 66000,
    "distance_foot_cm": 460000,
    "distance_skydiving_cm": 20000,
    "wood": 2996,
    "stone": 1103,
    "metal": 1066,
    "builds_placed": 327,
    "builds_edited": 74,
    "drop_score": "100.0%"
  }
}
```

---

### `POST /replay/scoreboard`

**Cost: 8 credits per request**

Returns the full player list with stats for every player in the match. Useful for opponent research and leaderboard tools.

**Request:**
```
POST /v1/replay/scoreboard
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 8,
  "credits_remaining": 9397,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "total_players": 92,
    "scoreboard": [
      {
        "rank": 1,
        "name": "dallasfanangel67",
        "is_local_player": false,
        "kills": 26,
        "damage_dealt": 3545,
        "headshots": null,
        "builds_placed": null,
        "shield_healed": null
      },
      {
        "rank": 2,
        "name": "pixie lost son",
        "is_local_player": false,
        "kills": 9,
        "damage_dealt": 1209,
        "headshots": null,
        "builds_placed": null,
        "shield_healed": null
      },
      {
        "rank": 3,
        "name": "blackgirlslikeme",
        "is_local_player": true,
        "kills": 4,
        "damage_dealt": 1108,
        "headshots": 4,
        "builds_placed": 327,
        "shield_healed": 387
      }
    ]
  }
}
```

---

### `POST /replay/movement`

**Cost: 8 credits per request**

Returns all positional data — player track, drop and death location, bus route, all other player tracks, and kill locations mapped to coordinates.

**Request:**
```
POST /v1/replay/movement
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 8,
  "credits_remaining": 9389,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "drop_location": {
      "x": 7104, "y": 1216, "z": 19456,
      "timestamp_ms": 62000
    },
    "death_location": {
      "x": 12416, "y": -9600, "z": 1408,
      "timestamp_ms": 1120000
    },
    "bus_route": {
      "start": { "x": -131000, "y": -20000 },
      "end":   { "x":  131000, "y":  80000 },
      "direction_degrees": 22.4,
      "positions": [
        { "x": -131000, "y": -20000, "timestamp_ms": 0 },
        { "x":  131000, "y":  80000, "timestamp_ms": 30000 }
      ]
    },
    "player_track": [
      { "x": 7104,  "y": 1216,  "timestamp_ms": 62000  },
      { "x": 8192,  "y": 2048,  "timestamp_ms": 120000 },
      { "x": 12416, "y": -9600, "timestamp_ms": 1120000 }
    ],
    "all_tracks": [
      {
        "positions": [
          { "x": -20000, "y": 30000 },
          { "x": -18000, "y": 28000 }
        ]
      }
    ],
    "elim_locations": [
      { "timestamp_ms": 180000, "x": 8192,  "y": -4096 },
      { "timestamp_ms": 420000, "x": 12288, "y": 2048  }
    ]
  }
}
```

---

### `POST /replay/weapons`

**Cost: 8 credits per request**

Returns the per-weapon breakdown only. Every weapon the player picked up with full stats.

**Request:**
```
POST /v1/replay/weapons
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 8,
  "credits_remaining": 9381,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "best_weapon": "Chaos Reloader Shotgun",
    "weapons": [
      {
        "weapon": "Chaos Reloader Shotgun",
        "rarity": "legendary",
        "is_best_weapon": true,
        "elims": 5,
        "damage_to_players": 328,
        "damage_to_ai": 125,
        "total_damage": 453,
        "shots_fired": 18,
        "hits_to_players": 8,
        "hits_to_ai": 1,
        "accuracy": "44.4%",
        "headshots": 4,
        "headshot_rate": "50.0%",
        "equips": 182,
        "reloads": 16
      },
      {
        "weapon": "Combat Assault Rifle",
        "rarity": "epic",
        "is_best_weapon": false,
        "elims": 0,
        "damage_to_players": 380,
        "damage_to_ai": 0,
        "total_damage": 380,
        "shots_fired": 209,
        "hits_to_players": 17,
        "hits_to_ai": 0,
        "accuracy": "8.1%",
        "headshots": 0,
        "headshot_rate": "0.0%",
        "equips": 27,
        "reloads": 9
      }
    ]
  }
}
```

---

### `POST /replay/events`

**Cost: 10 credits base + 3 credits per event type**

Request specific event streams from a replay. Request multiple types in one call. Charged per event type.

**Query parameters:**
- `types` (required) — comma separated list of: `elim`, `storm`, `revive`, `reboot`, `player_down`

**Example: 3 types = 10 + (3×3) = 19 credits**

**Request:**
```
POST /v1/replay/events?types=elim,storm,revive
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 19,
  "credits_remaining": 9362,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "events": {
      "elim": [
        {
          "type": "elim",
          "timestamp_ms": 180000,
          "time_formatted": "3:00",
          "x": 8192,
          "y": -4096
        },
        {
          "type": "elim",
          "timestamp_ms": 420000,
          "time_formatted": "7:00",
          "x": 12288,
          "y": 2048
        }
      ],
      "storm": [
        {
          "type": "storm",
          "phase": 1,
          "timestamp_ms": 60000,
          "radius_cm": 105723,
          "center_x": 0,
          "center_y": 0,
          "dps": 1
        },
        {
          "type": "storm",
          "phase": 2,
          "timestamp_ms": 270000,
          "radius_cm": 82000,
          "center_x": 5000,
          "center_y": -3000,
          "dps": 1
        }
      ],
      "revive": []
    }
  }
}
```

---

### `POST /replay/drop-analysis`

**Cost: 15 credits per request**

Analyzes the drop path using physics simulation. Auto-detects the bus route from the replay, calculates the ideal jump point for your landing location, and scores your actual drop vs the mathematical optimum.

**Request:**
```
POST /v1/replay/drop-analysis
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 15,
  "credits_remaining": 9347,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "drop_score": "100.0%",
    "land_location": { "x": 7104, "y": 1216 },
    "bus_route": {
      "start": { "x": -131000, "y": -20000 },
      "end":   { "x":  131000, "y":  80000 },
      "direction_degrees": 22.4
    },
    "ideal_jump": {
      "timestamp_ms": 35000,
      "time_formatted": "0:35",
      "bus_position": { "x": -40000, "y": 10000 }
    },
    "actual_jump": {
      "timestamp_ms": 63800,
      "time_formatted": "1:03",
      "bus_position": { "x": 5000, "y": 35000 }
    },
    "delay_ms": 28800,
    "delay_seconds": 28.8,
    "skydive_path": [
      { "x": 5000,  "y": 35000, "z": 40000, "timestamp_ms": 63800 },
      { "x": 6000,  "y": 1800,  "z": 10000, "timestamp_ms": 77000 },
      { "x": 7104,  "y": 1216,  "z": 0,     "timestamp_ms": 83000 }
    ],
    "physics": {
      "freefall_time_s": 15.0,
      "glide_time_s": 4.2,
      "total_air_time_s": 19.2,
      "skydive_angle_degrees": 75.3
    }
  }
}
```

---

---

## Section: Exclusive Endpoints

These endpoints have no equivalent anywhere else. Built on data only our parser produces.

---

### `POST /replay/rotation-score`

**Cost: 25 credits per request**

Scores how well the player rotated relative to the storm throughout the match. Tracks time outside zone, storm entries, and position relative to the final circle center at each phase.

**Request:**
```
POST /v1/replay/rotation-score
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 25,
  "credits_remaining": 9322,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "rotation_score": 87,
    "grade": "A",
    "time_outside_zone_ms": 66000,
    "time_outside_zone_formatted": "1m 6s",
    "zone_entries": 2,
    "per_phase": [
      {
        "phase": 1,
        "position_at_close": { "x": 8192, "y": -4096 },
        "distance_to_center_cm": 12400,
        "was_inside_zone": true,
        "rotation_timing": "early"
      },
      {
        "phase": 2,
        "position_at_close": { "x": 10000, "y": -2000 },
        "distance_to_center_cm": 8200,
        "was_inside_zone": true,
        "rotation_timing": "on_time"
      }
    ],
    "summary": "Strong rotation — consistently inside zone with minimal storm damage."
  }
}
```

---

### `POST /replay/opponents`

**Cost: 30 credits per request**

Returns full stats for every opponent cross-referenced with their history across all replays previously uploaded to Pathgen. Shows recurring opponents and their patterns.

**Request:**
```
POST /v1/replay/opponents
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 30,
  "credits_remaining": 9292,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "opponents": [
      {
        "name": "dallasfanangel67",
        "this_match": {
          "kills": 26,
          "damage_dealt": 3545,
          "placement": 1
        },
        "history": {
          "times_seen": 3,
          "avg_kills": 18.3,
          "avg_damage": 2890,
          "avg_placement": 2.1,
          "first_seen": "2026-03-18T21:06:00Z"
        }
      },
      {
        "name": "pixie lost son",
        "this_match": {
          "kills": 9,
          "damage_dealt": 1209,
          "placement": 1
        },
        "history": {
          "times_seen": 1,
          "avg_kills": null,
          "avg_damage": null,
          "avg_placement": null,
          "first_seen": "2026-03-21T13:32:00Z"
        }
      }
    ]
  }
}
```

---

### `POST /session/analyze`

**Cost: 50 credits per session**

Upload up to 6 replay files from a single tournament session. Returns aggregate stats, placement points, consistency rating, and full per-match breakdown. Built for FNCS and competitive tournament analysis.

**Request:**
```
POST /v1/session/analyze
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replays: <file1>
replays: <file2>
replays: <file3>
replays: <file4>
replays: <file5>
replays: <file6>
```

**Response:**
```json
{
  "credits_used": 50,
  "credits_remaining": 9242,
  "data": {
    "session_id": "rs_session_abc123",
    "matches_analyzed": 6,
    "session_score": 82,
    "total_placement_points": 47,
    "total_elims": 18,
    "avg_placement": 4.8,
    "avg_kills": 3.0,
    "avg_accuracy": "19.7%",
    "avg_damage_dealt": 890,
    "consistency_rating": "B+",
    "best_match": {
      "session_number": 3,
      "placement": 1,
      "kills": 6,
      "placement_points": 25
    },
    "worst_match": {
      "session_number": 5,
      "placement": 18,
      "kills": 0,
      "placement_points": 0
    },
    "matches": [
      {
        "session_number": 1,
        "session_id": "2026-03-21-13-32-00",
        "placement": 1,
        "kills": 6,
        "accuracy": "21.3%",
        "damage_dealt": 1108,
        "placement_points": 25,
        "time_alive_ms": 1120000
      }
    ],
    "trends": {
      "kills_per_match":     [4, 2, 6, 1, 0, 5],
      "placement_per_match": [3, 8, 1, 5, 18, 2],
      "damage_per_match":    [890, 620, 1108, 440, 180, 920]
    }
  }
}
```

---

---

## Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `INVALID_KEY` | 401 | API key is invalid or deleted |
| `INSUFFICIENT_CREDITS` | 402 | Not enough credits for this request |
| `INVALID_FILE` | 400 | File is not a valid .replay file |
| `UNSUPPORTED_VERSION` | 400 | Replay file version not supported |
| `FILE_TOO_LARGE` | 413 | Replay file exceeds 50MB limit |
| `PARSE_FAILED` | 500 | Parser encountered an error — not charged |
| `RATE_LIMITED` | 429 | Too many requests — slow down |
| `NOT_FOUND` | 404 | Resource not found |

---

## Rate Limits

| Tier | Requests per minute |
|------|-------------------|
| Free endpoints | 60 per IP |
| Paid endpoints | 30 per API key |
| Session analyze | 5 per API key per hour |

---

## SDKs and Libraries

Official packages coming soon:

```
npm install pathgen        # Node.js / TypeScript
pip install pathgen        # Python
```

Until then all endpoints work with any HTTP client. The npm package `pathgen` will mirror the endpoint structure exactly.

---

## Changelog

**v1.0.0 — March 2026**
- Initial release
- Full parse, stats, scoreboard, movement, weapons, events endpoints
- Drop analysis, rotation score, opponents, session analysis
- Free account, cosmetics, shop, weapons, map, news, playlists endpoints
- Chapter 7 Season 2 confirmed support# Pathgen API Documentation

---

## Base URL

```
https://api.pathgen.gg/v1
```

All requests require an `Authorization` header with your API key except free endpoints.

```
Authorization: Bearer rs_your_api_key_here
```

Responses are always JSON. Errors follow a consistent shape:

```json
{
  "error": true,
  "code": "INSUFFICIENT_CREDITS",
  "message": "You need 20 credits but have 4 remaining."
}
```

---

## Authentication and Credits

**Get your balance**
```
GET /account/balance
```
Response:
```json
{
  "credits": 9430,
  "api_key": "rs_35402b9d...",
  "plan": "pay_as_you_go"
}
```

**List your API keys**
```
GET /account/keys
```
Response:
```json
{
  "keys": [
    {
      "id": "rs_35402b9d",
      "label": "My App",
      "created_at": "2026-03-01T00:00:00Z",
      "last_used": "2026-03-24T10:00:00Z"
    }
  ]
}
```

**Create an API key**
```
POST /account/keys
```
Body:
```json
{ "label": "My App" }
```
Response:
```json
{
  "key": "rs_newly_generated_key",
  "label": "My App",
  "created_at": "2026-03-24T00:00:00Z"
}
```

**Delete an API key**
```
DELETE /account/keys/{keyId}
```
Response:
```json
{ "deleted": true }
```

---

---

# FREE ENDPOINTS

No credits required. No API key required. Rate limit: 60 requests per minute per IP.

---

## Section: Account

### `GET /account/lookup`

Look up an Epic Games account by display name. Returns account ID and platform stats.

**Query parameters:**
- `name` (required) — Epic display name

**Example request:**
```
GET /v1/account/lookup?name=blackgirlslikeme
```

**Response:**
```json
{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "display_name": "blackgirlslikeme",
  "platform": "PC",
  "level": 316,
  "wins": 13,
  "kills": 538,
  "kd": 0.55,
  "matches": 862,
  "win_rate": 1.5,
  "minutes_played": 9087,
  "top10": 245,
  "solo_wins": 10,
  "solo_kd": 0.60,
  "solo_matches": 312
}
```

---

### `GET /account/ranked`

Get a player's current ranked division and promotion progress.

**Query parameters:**
- `accountId` (required) — Epic account ID from `/account/lookup`

**Example request:**
```
GET /v1/account/ranked?accountId=3f88ac4d331b43e5a85b30b696e9fc54
```

**Response:**
```json
{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "display_name": "blackgirlslikeme",
  "modes": [
    {
      "mode": "ranked-br",
      "mode_name": "Ranked Battle Royale",
      "division": 14,
      "division_name": "Elite",
      "division_group": "Elite",
      "promotion_progress": 67.4,
      "is_unreal": false,
      "unreal_rank": null
    },
    {
      "mode": "ranked-zb",
      "mode_name": "Ranked Zero Build",
      "division": 12,
      "division_name": "Champion",
      "promotion_progress": 23.1,
      "is_unreal": false,
      "unreal_rank": null
    }
  ]
}
```

---

### `GET /account/stats`

Get full lifetime and season stats for a player broken down by mode and input type.

**Query parameters:**
- `accountId` (required) — Epic account ID
- `timeframe` (optional) — `lifetime` or `season` (default: `lifetime`)

**Example request:**
```
GET /v1/account/stats?accountId=3f88ac4d331b43e5a85b30b696e9fc54&timeframe=season
```

**Response:**
```json
{
  "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
  "timeframe": "season",
  "overall": {
    "wins": 13,
    "kills": 538,
    "deaths": 970,
    "kd": 0.55,
    "matches": 862,
    "win_rate": 1.5,
    "avg_placement": 23.25,
    "top3": 18,
    "top5": 32,
    "top10": 245,
    "top25": 410,
    "damage_to_players": 190812,
    "damage_from_players": 270047,
    "minutes_played": 9087,
    "headshot_pct": 18.36
  },
  "by_mode": {
    "solo": { "wins": 10, "kills": 312, "kd": 0.60, "matches": 312 },
    "duo":  { "wins": 2,  "kills": 148, "kd": 0.48, "matches": 280 },
    "squad":{ "wins": 1,  "kills": 78,  "kd": 0.52, "matches": 270 }
  },
  "by_input": {
    "keyboard_mouse": { "wins": 13, "kills": 538, "kd": 0.55, "matches": 862 },
    "gamepad":        { "wins": 0,  "kills": 12,  "kd": 0.30, "matches": 40  }
  }
}
```

---

## Section: Game Data

### `GET /game/cosmetics`

Search the full Fortnite cosmetics database including leaked and unreleased items.

**Query parameters:**
- `search` (optional) — search by name
- `type` (optional) — `outfit`, `backbling`, `pickaxe`, `glider`, `wrap`, `emote`, `music`, `spray`, `banner`, `charm`
- `rarity` (optional) — `common`, `uncommon`, `rare`, `epic`, `legendary`, `mythic`, `exotic`
- `set` (optional) — cosmetic set name
- `page` (optional) — page number (default: 1)
- `limit` (optional) — results per page, max 100 (default: 20)

**Example request:**
```
GET /v1/game/cosmetics?type=outfit&rarity=legendary&limit=5
```

**Response:**
```json
{
  "total": 342,
  "page": 1,
  "limit": 5,
  "items": [
    {
      "id": "CID_001_Athena_Commando_F",
      "name": "Ramirez",
      "type": "outfit",
      "rarity": "common",
      "set": null,
      "series": null,
      "intro_season": "Chapter 1 Season 1",
      "description": "Ready to fight.",
      "image_url": "https://cdn.pathgen.gg/cosmetics/CID_001.png",
      "icon_url": "https://cdn.pathgen.gg/cosmetics/icons/CID_001.png",
      "is_exclusive": false,
      "added_at": "2017-10-25T00:00:00Z"
    }
  ]
}
```

---

### `GET /game/cosmetics/{id}`

Get a single cosmetic by its ID with full variant and style data.

**Example request:**
```
GET /v1/game/cosmetics/CID_001_Athena_Commando_F
```

**Response:**
```json
{
  "id": "CID_001_Athena_Commando_F",
  "name": "Ramirez",
  "type": "outfit",
  "rarity": "common",
  "set": null,
  "variants": [
    {
      "channel": "Material",
      "type": "Mat1",
      "name": "Default",
      "image_url": "https://cdn.pathgen.gg/..."
    }
  ],
  "styles": [],
  "shop_history": [
    { "date": "2021-03-01", "price": 800 }
  ]
}
```

---

### `GET /game/shop`

Get today's item shop — daily and featured sections.

**Example request:**
```
GET /v1/game/shop
```

**Response:**
```json
{
  "updated_at": "2026-03-24T00:00:00Z",
  "sections": [
    {
      "id": "featured",
      "name": "Featured Items",
      "items": [
        {
          "id": "CID_XYZ",
          "name": "Galaxy Scout",
          "type": "outfit",
          "rarity": "epic",
          "price": 1500,
          "bundle": null,
          "image_url": "https://cdn.pathgen.gg/...",
          "expires_at": "2026-03-25T00:00:00Z"
        }
      ]
    },
    {
      "id": "daily",
      "name": "Daily Items",
      "items": []
    }
  ]
}
```

---

### `GET /game/weapons`

Get all weapons for a given season with full stats.

**Query parameters:**
- `season` (optional) — e.g. `ch7s2` (default: current season)
- `type` (optional) — `shotgun`, `ar`, `smg`, `sniper`, `pistol`, `launcher`, `melee`
- `rarity` (optional) — filter by rarity

**Example request:**
```
GET /v1/game/weapons?season=ch7s2&type=shotgun
```

**Response:**
```json
{
  "season": "ch7s2",
  "weapons": [
    {
      "id": "WID_Shotgun_ChaosReloader_Athena_L",
      "name": "Chaos Reloader Shotgun",
      "type": "shotgun",
      "rarity": "legendary",
      "damage": 76,
      "dps": 152,
      "fire_rate": 2.0,
      "magazine_size": 6,
      "reload_time": 2.4,
      "structure_damage": 57,
      "image_url": "https://cdn.pathgen.gg/weapons/chaos_reloader.png"
    }
  ]
}
```

---

### `GET /game/map`

Get the current season map image and all named POI locations with world coordinates.

**Example request:**
```
GET /v1/game/map
```

**Response:**
```json
{
  "season": "ch7s2",
  "map_url": "https://cdn.pathgen.gg/maps/ch7s2.png",
  "tile_url": "https://cdn.pathgen.gg/tiles/ch7s2/{z}/{x}/{y}.png",
  "max_zoom": 5,
  "world_bounds": {
    "min_x": -131072,
    "max_x": 131072,
    "min_y": -131072,
    "max_y": 131072
  },
  "pois": [
    { "name": "Tiptop Terrace",        "x": -80000, "y": -90000 },
    { "name": "Dark Dominion",          "x":  10000, "y": -10000 },
    { "name": "Humble Hills",           "x": -10000, "y":  20000 },
    { "name": "Ripped Tides",           "x": -60000, "y":  40000 },
    { "name": "Battlewood Boulevard",   "x": -20000, "y":  55000 },
    { "name": "Sandy Strip",            "x":  80000, "y": -20000 },
    { "name": "Sus Studios",            "x":  40000, "y":  20000 },
    { "name": "New Sanctuary",          "x":  70000, "y":  30000 }
  ]
}
```

---

### `GET /game/news`

Get the current in-game news for Battle Royale, STW, and Creative.

**Example request:**
```
GET /v1/game/news
```

**Response:**
```json
{
  "br": [
    {
      "title": "New Season Begins",
      "body": "A new chapter starts now.",
      "image_url": "https://cdn.pathgen.gg/news/...",
      "adspace": "NDS"
    }
  ],
  "stw": [],
  "creative": []
}
```

---

### `GET /game/playlists`

Get all currently available game modes and playlists.

**Example request:**
```
GET /v1/game/playlists
```

**Response:**
```json
{
  "playlists": [
    {
      "id": "Playlist_DefaultSolo",
      "name": "Solo",
      "min_players": 1,
      "max_players": 1,
      "team_size": 1,
      "is_ranked": false,
      "is_zero_build": false,
      "image_url": "https://cdn.pathgen.gg/playlists/solo.png"
    },
    {
      "id": "Playlist_ShowdownAlt_Solo",
      "name": "Ranked Solo",
      "min_players": 1,
      "max_players": 1,
      "team_size": 1,
      "is_ranked": true,
      "is_zero_build": false,
      "image_url": "https://cdn.pathgen.gg/playlists/ranked_solo.png"
    }
  ]
}
```

---

---

# PAID ENDPOINTS

All paid endpoints require an API key. Credits are deducted on successful response only — failed parses or invalid files are not charged.

---

## Section: Replay Parsing

All replay endpoints accept a `.replay` file uploaded as `multipart/form-data` with the field name `replay`.

---

### `POST /replay/parse`

**Cost: 20 credits per request**

Upload a `.replay` file and receive the complete match analysis. This is the full pipeline — everything the parser extracts in one call.

**Request:**
```
POST /v1/replay/parse
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 20,
  "credits_remaining": 9410,
  "parse_time_ms": 842,
  "data": {
    "match_overview": {
      "session_id": "2026-03-21-13-32-00",
      "result": "Victory Royale",
      "placement": 1,
      "mode": "Solo",
      "timestamp": "2026-03-21T13:32:00",
      "lobby": {
        "players": 98,
        "humans": 28,
        "ais": 70,
        "teams": 98
      },
      "performance_metrics": {
        "time_alive": "18m 40s",
        "time_alive_ms": 1120000,
        "drop_score": "100.0%",
        "ideal_drop_time": "35.0s",
        "actual_drop_time": "63.8s"
      }
    },
    "combat_summary": {
      "eliminations": {
        "total": 6,
        "players": 4,
        "ai": 2
      },
      "damage": {
        "to_players": 1108,
        "from_players": 398,
        "to_ai": 250,
        "player_damage_ratio": 2.78,
        "self_damage": 0,
        "storm_damage": 0,
        "fall_damage": 0
      },
      "accuracy": {
        "overall_percentage": "21.3%",
        "total_shots": 432,
        "hits_to_players": 32,
        "hits_to_ai": 7,
        "headshots": 4,
        "headshot_rate": "12.5%"
      },
      "survival": {
        "health_healed": 46,
        "shield_healed": 387,
        "overshield_healed": 0,
        "health_taken": 109,
        "shield_taken": 337,
        "overshield_taken": 0,
        "revives_given": 0,
        "revives_received": null,
        "time_in_storm_ms": 66000,
        "distance_foot_cm": 460000,
        "distance_skydiving_cm": 20000
      }
    },
    "building_and_utility": {
      "materials_gathered": {
        "wood": 2996,
        "stone": 1103,
        "metal": 1066
      },
      "mechanics": {
        "builds_placed": 327,
        "builds_edited": 74,
        "avg_edit_time_ms": null,
        "edit_accuracy": null,
        "weakpoint_accuracy": null
      }
    },
    "weapon_deep_dive": [
      {
        "weapon": "Chaos Reloader Shotgun",
        "rarity": "legendary",
        "is_best_weapon": true,
        "elims": 5,
        "damage_to_players": 328,
        "damage_to_ai": 125,
        "total_damage": 453,
        "shots_fired": 18,
        "hits_to_players": 8,
        "hits_to_ai": 1,
        "accuracy": "44.4%",
        "headshots": 4,
        "headshot_rate": "50.0%",
        "equips": 182,
        "reloads": 16
      },
      {
        "weapon": "Combat Assault Rifle",
        "rarity": "epic",
        "is_best_weapon": false,
        "elims": 0,
        "damage_to_players": 380,
        "damage_to_ai": 0,
        "total_damage": 380,
        "shots_fired": 209,
        "hits_to_players": 17,
        "hits_to_ai": 0,
        "accuracy": "8.1%",
        "headshots": 0,
        "headshot_rate": "0.0%",
        "equips": 27,
        "reloads": 9
      }
    ],
    "movement": {
      "drop_location": { "x": 7104,  "y": 1216,  "z": 19456 },
      "death_location": { "x": 12416, "y": -9600, "z": 1408  },
      "bus_route": {
        "start": { "x": -131000, "y": -20000 },
        "end":   { "x":  131000, "y":  80000 },
        "direction_degrees": 22.4
      },
      "player_track": [
        { "x": 7104, "y": 1216, "timestamp_ms": 62000 }
      ]
    },
    "storm": [
      {
        "phase": 1,
        "timestamp_ms": 60000,
        "radius_cm": 105723,
        "center_x": 0,
        "center_y": 0,
        "dps": 1
      }
    ],
    "scoreboard": [
      {
        "rank": 1,
        "name": "dallasfanangel67",
        "is_local_player": false,
        "kills": 26,
        "damage_dealt": 3545,
        "damage_taken": null,
        "headshots": null,
        "builds_placed": null
      },
      {
        "rank": 3,
        "name": "blackgirlslikeme",
        "is_local_player": true,
        "kills": 4,
        "damage_dealt": 1108,
        "damage_taken": 398,
        "headshots": 4,
        "builds_placed": 327
      }
    ],
    "elim_feed": [
      { "timestamp_ms": 180000, "x": 8192, "y": -4096 },
      { "timestamp_ms": 420000, "x": 12288, "y": 2048 }
    ],
    "ai_coach": {
      "summary": "Dominant solo match — Victory Royale with 6 eliminations and strong damage output.",
      "strengths": [
        "Victory Royale secured",
        "Top 5% eliminations (6 total)",
        "Elite damage output (1108 to players)",
        "Strong building (327 placed)"
      ],
      "weaknesses": [
        "Accuracy below average for rank (21.3%)"
      ]
    },
    "epic_data": {
      "account_id": "3f88ac4d331b43e5a85b30b696e9fc54",
      "display_name": "blackgirlslikeme",
      "platform": "PC",
      "level": 316,
      "wins": 13,
      "kills": 538,
      "kd": 0.55,
      "matches": 862,
      "win_rate": 1.5,
      "crown_wins": null,
      "ranked": null
    },
    "parser_meta": {
      "parsed_at": "2026-03-24T10:00:00Z",
      "parse_time_ms": 842,
      "file_version": 7,
      "chunks_decrypted": 65,
      "positions_extracted": 174487,
      "names_found": 92,
      "confidence": {
        "stats": "confirmed",
        "positions": "confirmed",
        "weapons": "confirmed"
      }
    }
  }
}
```

---

### `POST /replay/stats`

**Cost: 5 credits per request**

Returns only the core match statistics. No positions, no scoreboard, no weapons. Fastest and cheapest endpoint for stat tracking apps that just need the numbers.

**Request:**
```
POST /v1/replay/stats
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 5,
  "credits_remaining": 9405,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "result": "Victory Royale",
    "placement": 1,
    "total_players": 98,
    "timestamp": "2026-03-21T13:32:00",
    "kills": 4,
    "ai_kills": 2,
    "total_elims": 6,
    "assists": 0,
    "accuracy": "21.3%",
    "shots_fired": 432,
    "hits_to_players": 32,
    "headshots": 4,
    "headshot_rate": "12.5%",
    "damage_to_players": 1108,
    "damage_from_players": 398,
    "damage_ratio": 2.78,
    "storm_damage": 0,
    "fall_damage": 0,
    "health_healed": 46,
    "shield_healed": 387,
    "health_taken": 109,
    "shield_taken": 337,
    "time_alive": "18m 40s",
    "time_alive_ms": 1120000,
    "time_in_storm_ms": 66000,
    "distance_foot_cm": 460000,
    "distance_skydiving_cm": 20000,
    "wood": 2996,
    "stone": 1103,
    "metal": 1066,
    "builds_placed": 327,
    "builds_edited": 74,
    "drop_score": "100.0%"
  }
}
```

---

### `POST /replay/scoreboard`

**Cost: 8 credits per request**

Returns the full player list with stats for every player in the match. Useful for opponent research and leaderboard tools.

**Request:**
```
POST /v1/replay/scoreboard
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 8,
  "credits_remaining": 9397,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "total_players": 92,
    "scoreboard": [
      {
        "rank": 1,
        "name": "dallasfanangel67",
        "is_local_player": false,
        "kills": 26,
        "damage_dealt": 3545,
        "headshots": null,
        "builds_placed": null,
        "shield_healed": null
      },
      {
        "rank": 2,
        "name": "pixie lost son",
        "is_local_player": false,
        "kills": 9,
        "damage_dealt": 1209,
        "headshots": null,
        "builds_placed": null,
        "shield_healed": null
      },
      {
        "rank": 3,
        "name": "blackgirlslikeme",
        "is_local_player": true,
        "kills": 4,
        "damage_dealt": 1108,
        "headshots": 4,
        "builds_placed": 327,
        "shield_healed": 387
      }
    ]
  }
}
```

---

### `POST /replay/movement`

**Cost: 8 credits per request**

Returns all positional data — player track, drop and death location, bus route, all other player tracks, and kill locations mapped to coordinates.

**Request:**
```
POST /v1/replay/movement
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 8,
  "credits_remaining": 9389,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "drop_location": {
      "x": 7104, "y": 1216, "z": 19456,
      "timestamp_ms": 62000
    },
    "death_location": {
      "x": 12416, "y": -9600, "z": 1408,
      "timestamp_ms": 1120000
    },
    "bus_route": {
      "start": { "x": -131000, "y": -20000 },
      "end":   { "x":  131000, "y":  80000 },
      "direction_degrees": 22.4,
      "positions": [
        { "x": -131000, "y": -20000, "timestamp_ms": 0 },
        { "x":  131000, "y":  80000, "timestamp_ms": 30000 }
      ]
    },
    "player_track": [
      { "x": 7104,  "y": 1216,  "timestamp_ms": 62000  },
      { "x": 8192,  "y": 2048,  "timestamp_ms": 120000 },
      { "x": 12416, "y": -9600, "timestamp_ms": 1120000 }
    ],
    "all_tracks": [
      {
        "positions": [
          { "x": -20000, "y": 30000 },
          { "x": -18000, "y": 28000 }
        ]
      }
    ],
    "elim_locations": [
      { "timestamp_ms": 180000, "x": 8192,  "y": -4096 },
      { "timestamp_ms": 420000, "x": 12288, "y": 2048  }
    ]
  }
}
```

---

### `POST /replay/weapons`

**Cost: 8 credits per request**

Returns the per-weapon breakdown only. Every weapon the player picked up with full stats.

**Request:**
```
POST /v1/replay/weapons
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 8,
  "credits_remaining": 9381,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "best_weapon": "Chaos Reloader Shotgun",
    "weapons": [
      {
        "weapon": "Chaos Reloader Shotgun",
        "rarity": "legendary",
        "is_best_weapon": true,
        "elims": 5,
        "damage_to_players": 328,
        "damage_to_ai": 125,
        "total_damage": 453,
        "shots_fired": 18,
        "hits_to_players": 8,
        "hits_to_ai": 1,
        "accuracy": "44.4%",
        "headshots": 4,
        "headshot_rate": "50.0%",
        "equips": 182,
        "reloads": 16
      },
      {
        "weapon": "Combat Assault Rifle",
        "rarity": "epic",
        "is_best_weapon": false,
        "elims": 0,
        "damage_to_players": 380,
        "damage_to_ai": 0,
        "total_damage": 380,
        "shots_fired": 209,
        "hits_to_players": 17,
        "hits_to_ai": 0,
        "accuracy": "8.1%",
        "headshots": 0,
        "headshot_rate": "0.0%",
        "equips": 27,
        "reloads": 9
      }
    ]
  }
}
```

---

### `POST /replay/events`

**Cost: 10 credits base + 3 credits per event type**

Request specific event streams from a replay. Request multiple types in one call. Charged per event type.

**Query parameters:**
- `types` (required) — comma separated list of: `elim`, `storm`, `revive`, `reboot`, `player_down`

**Example: 3 types = 10 + (3×3) = 19 credits**

**Request:**
```
POST /v1/replay/events?types=elim,storm,revive
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 19,
  "credits_remaining": 9362,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "events": {
      "elim": [
        {
          "type": "elim",
          "timestamp_ms": 180000,
          "time_formatted": "3:00",
          "x": 8192,
          "y": -4096
        },
        {
          "type": "elim",
          "timestamp_ms": 420000,
          "time_formatted": "7:00",
          "x": 12288,
          "y": 2048
        }
      ],
      "storm": [
        {
          "type": "storm",
          "phase": 1,
          "timestamp_ms": 60000,
          "radius_cm": 105723,
          "center_x": 0,
          "center_y": 0,
          "dps": 1
        },
        {
          "type": "storm",
          "phase": 2,
          "timestamp_ms": 270000,
          "radius_cm": 82000,
          "center_x": 5000,
          "center_y": -3000,
          "dps": 1
        }
      ],
      "revive": []
    }
  }
}
```

---

### `POST /replay/drop-analysis`

**Cost: 15 credits per request**

Analyzes the drop path using physics simulation. Auto-detects the bus route from the replay, calculates the ideal jump point for your landing location, and scores your actual drop vs the mathematical optimum.

**Request:**
```
POST /v1/replay/drop-analysis
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 15,
  "credits_remaining": 9347,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "drop_score": "100.0%",
    "land_location": { "x": 7104, "y": 1216 },
    "bus_route": {
      "start": { "x": -131000, "y": -20000 },
      "end":   { "x":  131000, "y":  80000 },
      "direction_degrees": 22.4
    },
    "ideal_jump": {
      "timestamp_ms": 35000,
      "time_formatted": "0:35",
      "bus_position": { "x": -40000, "y": 10000 }
    },
    "actual_jump": {
      "timestamp_ms": 63800,
      "time_formatted": "1:03",
      "bus_position": { "x": 5000, "y": 35000 }
    },
    "delay_ms": 28800,
    "delay_seconds": 28.8,
    "skydive_path": [
      { "x": 5000,  "y": 35000, "z": 40000, "timestamp_ms": 63800 },
      { "x": 6000,  "y": 1800,  "z": 10000, "timestamp_ms": 77000 },
      { "x": 7104,  "y": 1216,  "z": 0,     "timestamp_ms": 83000 }
    ],
    "physics": {
      "freefall_time_s": 15.0,
      "glide_time_s": 4.2,
      "total_air_time_s": 19.2,
      "skydive_angle_degrees": 75.3
    }
  }
}
```

---

---

## Section: Exclusive Endpoints

These endpoints have no equivalent anywhere else. Built on data only our parser produces.

---

### `POST /replay/rotation-score`

**Cost: 25 credits per request**

Scores how well the player rotated relative to the storm throughout the match. Tracks time outside zone, storm entries, and position relative to the final circle center at each phase.

**Request:**
```
POST /v1/replay/rotation-score
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 25,
  "credits_remaining": 9322,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "rotation_score": 87,
    "grade": "A",
    "time_outside_zone_ms": 66000,
    "time_outside_zone_formatted": "1m 6s",
    "zone_entries": 2,
    "per_phase": [
      {
        "phase": 1,
        "position_at_close": { "x": 8192, "y": -4096 },
        "distance_to_center_cm": 12400,
        "was_inside_zone": true,
        "rotation_timing": "early"
      },
      {
        "phase": 2,
        "position_at_close": { "x": 10000, "y": -2000 },
        "distance_to_center_cm": 8200,
        "was_inside_zone": true,
        "rotation_timing": "on_time"
      }
    ],
    "summary": "Strong rotation — consistently inside zone with minimal storm damage."
  }
}
```

---

### `POST /replay/opponents`

**Cost: 30 credits per request**

Returns full stats for every opponent cross-referenced with their history across all replays previously uploaded to Pathgen. Shows recurring opponents and their patterns.

**Request:**
```
POST /v1/replay/opponents
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replay: <file>
```

**Response:**
```json
{
  "credits_used": 30,
  "credits_remaining": 9292,
  "data": {
    "session_id": "2026-03-21-13-32-00",
    "opponents": [
      {
        "name": "dallasfanangel67",
        "this_match": {
          "kills": 26,
          "damage_dealt": 3545,
          "placement": 1
        },
        "history": {
          "times_seen": 3,
          "avg_kills": 18.3,
          "avg_damage": 2890,
          "avg_placement": 2.1,
          "first_seen": "2026-03-18T21:06:00Z"
        }
      },
      {
        "name": "pixie lost son",
        "this_match": {
          "kills": 9,
          "damage_dealt": 1209,
          "placement": 1
        },
        "history": {
          "times_seen": 1,
          "avg_kills": null,
          "avg_damage": null,
          "avg_placement": null,
          "first_seen": "2026-03-21T13:32:00Z"
        }
      }
    ]
  }
}
```

---

### `POST /session/analyze`

**Cost: 50 credits per session**

Upload up to 6 replay files from a single tournament session. Returns aggregate stats, placement points, consistency rating, and full per-match breakdown. Built for FNCS and competitive tournament analysis.

**Request:**
```
POST /v1/session/analyze
Content-Type: multipart/form-data
Authorization: Bearer rs_your_key

replays: <file1>
replays: <file2>
replays: <file3>
replays: <file4>
replays: <file5>
replays: <file6>
```

**Response:**
```json
{
  "credits_used": 50,
  "credits_remaining": 9242,
  "data": {
    "session_id": "rs_session_abc123",
    "matches_analyzed": 6,
    "session_score": 82,
    "total_placement_points": 47,
    "total_elims": 18,
    "avg_placement": 4.8,
    "avg_kills": 3.0,
    "avg_accuracy": "19.7%",
    "avg_damage_dealt": 890,
    "consistency_rating": "B+",
    "best_match": {
      "session_number": 3,
      "placement": 1,
      "kills": 6,
      "placement_points": 25
    },
    "worst_match": {
      "session_number": 5,
      "placement": 18,
      "kills": 0,
      "placement_points": 0
    },
    "matches": [
      {
        "session_number": 1,
        "session_id": "2026-03-21-13-32-00",
        "placement": 1,
        "kills": 6,
        "accuracy": "21.3%",
        "damage_dealt": 1108,
        "placement_points": 25,
        "time_alive_ms": 1120000
      }
    ],
    "trends": {
      "kills_per_match":     [4, 2, 6, 1, 0, 5],
      "placement_per_match": [3, 8, 1, 5, 18, 2],
      "damage_per_match":    [890, 620, 1108, 440, 180, 920]
    }
  }
}
```

---

---

## Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `INVALID_KEY` | 401 | API key is invalid or deleted |
| `INSUFFICIENT_CREDITS` | 402 | Not enough credits for this request |
| `INVALID_FILE` | 400 | File is not a valid .replay file |
| `UNSUPPORTED_VERSION` | 400 | Replay file version not supported |
| `FILE_TOO_LARGE` | 413 | Replay file exceeds 50MB limit |
| `PARSE_FAILED` | 500 | Parser encountered an error — not charged |
| `RATE_LIMITED` | 429 | Too many requests — slow down |
| `NOT_FOUND` | 404 | Resource not found |

---

## Rate Limits

| Tier | Requests per minute |
|------|-------------------|
| Free endpoints | 60 per IP |
| Paid endpoints | 30 per API key |
| Session analyze | 5 per API key per hour |

---

## SDKs and Libraries

Official packages coming soon:

```
npm install pathgen        # Node.js / TypeScript
pip install pathgen        # Python
```

Until then all endpoints work with any HTTP client. The npm package `pathgen` will mirror the endpoint structure exactly.

---

## Changelog

**v1.0.0 — March 2026**
- Initial release
- Full parse, stats, scoreboard, movement, weapons, events endpoints
- Drop analysis, rotation score, opponents, session analysis
- Free account, cosmetics, shop, weapons, map, news, playlists endpoints
- Chapter 7 Season 2 confirmed support