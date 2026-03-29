# PathGen API Documentation

---

### **1. Authentication & Global Routes**
All `/v1` routes require your API Key in the `X-API-Key` or `Authorization: Bearer` header.
- **`GET /health`**: Primary health check. **Cost: Free**.
- **`GET /health/detailed`**: Full system status (DB, Storage, External APIs). **Cost: Free**.
- **`GET /metrics`**: Prometheus-compatible system metrics. **Cost: Free**.
- **`GET /v1/game/ping`**: Network latency and timestamp test. **Cost: Free**.

---

### **2. Game World Data** (`/v1/game/*`)
| Endpoint | Method | Cost | Description |
| :--- | :--- | :--- | :--- |
| `/v1/game/map` | GET | **Free** | URLs for raw high-res Fortnite maps. |
| `/v1/game/map/config` | GET | **Free** | Leaflet.js configuration (bounds, POIs). |
| `/v1/game/map/tiles` | GET | **Free** | Full list of 1,365 tile URLs with coordinates. |
| `/v1/game/tiles/:z/:x/:y`| GET | **30 Credits** | Redirect to map tile (24h unlimited pass). |
| `/v1/game/news` | GET | **Free** | Latest game news and patch notes. |
| `/v1/game/playlists` | GET | **Free** | Current active game modes and LTMs. |
| `/v1/game/weapons` | GET | **Free** | List of current weapon pool. |

**Example Search Response (`GET /v1/game/cosmetics/search?name=Aura`):**
```json
{
  "status": 200,
  "data": { "id": "CID_386_Athena_Commando_F_StreetFighter", "name": "Aura", "rarity": "Uncommon" }
}
```

---

### **3. Player Statistics** (`/v1/game/*`)
| Endpoint | Method | Cost | Description |
| :--- | :--- | :--- | :--- |
| `/v1/game/lookup` | GET | **Free** | Map names to Account IDs. |
| `/v1/game/ranked` | GET | **Free** | Current rank, progress, and leaderboard. |
| `/v1/game/stats` | GET | **Free** | Lifetime and seasonal K/D, Wins, Matches. |

**Example Stats Response (`GET /v1/game/stats?name=Ninja`):**
```json
{
  "status": 200,
  "data": { "account": { "name": "Ninja" }, "stats": { "br": { "kd": 8.42, "wins": 7500 } } }
}
```

---

### **4. Replay Parsing** (`/v1/replay/*`)
All parser routes require a `.replay` file upload in the `replay` field (Multipart).
| Endpoint | Method | Cost | Return Data |
| :--- | :--- | :--- | :--- |
| `/v1/replay/parse` | POST | **20 Credits** | Full recursive parse of all data. |
| `/v1/replay/stats` | POST | **5 Credits** | Quick combat & building summary. |
| `/v1/replay/scoreboard`| POST | **8 Credits** | Full lobby listing (Name, Kills, Rank). |
| `/v1/replay/movement` | POST | **8 Credits** | Drop location and movement heatmap. |
| `/v1/replay/events` | POST | **10 Credits** | Full chronological kill-feed. |
| `/v1/replay/drop-analysis`| POST | **15 Credits**| Drop efficiency score and competition. |

---

### **5. Account & Keys** (`/v1/account/*`)
| Endpoint | Method | Cost | Description |
| :--- | :--- | :--- | :--- |
| `/v1/account/balance` | GET | **Free** | Your current credit balance. |
| `/v1/account/keys` | GET | **Free** | List all your active API keys. |
| `/v1/account/keys` | POST | **Free** | Generate a new `rs_` API key. |
| `/v1/account/keys/:id` | DELETE | **Free** | Revoke an existing API key. |
| `/v1/account/usage` | GET | **Free** | Total request count lifetime. |

---

### **6. Billing** (`/v1/billing/*`)
- **`GET /v1/billing/history`**: Records of all credit purchases. **Cost: Free**.
- **`POST /v1/billing/checkout`**: Generates a Stripe checkout URL for credit packs. **Cost: Free**.
- **`POST /v1/billing/webhook`**: System endpoint for processing Stripe payments.

---

### **7. Admin Logs** (`/logs/*`)
*Requires Admin privileges (Secret required in config).*
- **`GET /logs/requests`**: Paginated history of all API requests.
- **`GET /logs/errors`**: Trace logs for failed parses or 500 errors.
- **`GET /logs/live`**: Server-Sent Events (SSE) stream for live traffic monitoring.

#### **Request Log Structure:**
```json
{
  "id": "req_5502",
  "endpoint": "POST /v1/replay/parse",
  "status": 200,
  "credits_used": 20,
  "duration_ms": 1102,
  "timestamp": "2026-03-27T13:42:00Z"
}
```

---

### **8. AI Analysis & Coaching** (`/v1/ai/*`)
Leverage Gemini 2.0 Flash reasoning for deep tactical match analysis.

| Endpoint | Method | Cost | Description |
| :--- | :--- | :--- | :--- |
| `/v1/ai/coach` | POST | **30 Credits** | Comprehensive single-match tactical breakdown. |
| `/v1/ai/session-coach`| POST | **50 Credits** | Multi-match analysis for tournament pattern recognition. |
| `/v1/ai/weapon-coach` | POST | **20 Credits** | Mastery report comparing equip counts to actual damage. |
| `/v1/ai/drop-recommend`| POST | **20 Credits** | Survival-based landing advice for specific bus routes. |
| `/v1/ai/opponent-scout`| POST | **25 Credits**| Playstyle identification (Aggro / Passive) based on stats. |