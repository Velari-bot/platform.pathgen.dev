# Pathgen API v1.2.6 Service Map

This is the full **Pathgen API v1.2.6 Service Map**. It includes all public, private, and experimental endpoints currently active on the server.

> [!NOTE]
> **Authentication**: All requests (except Auth/Health) require `?key=YOUR_API_KEY` or `Authorization: Bearer <JWT>`.

---

### 1. Account & Billing
Endpoints for managing your credits, API keys, and profile.

| Method | Endpoint | Cost | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/account/me` | Free | Full profile (balance, tier, stats) |
| `GET` | `/v1/account/balance` | Free | Current credit balance only |
| `GET` | `/v1/account/keys` | Free | List all active API keys |
| `POST` | `/v1/account/keys` | Free | Generate a new RS (secure) key |
| `DELETE` | `/v1/account/keys/{id}` | Free | Revoke an existing key |
| `GET` | `/v1/billing/history` | Free | Transaction & top-up history |
| `POST` | `/v1/billing/topup` | Free | Generate Stripe Checkout for credits |

---

### 2. Game World Intelligence
High-fidelity data pulled from the live Fortnite environment and historical records.

| Method | Endpoint | Cost | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/v1/game/stats` | **5 Credits** | **Premium** Unified Stats (Merged FnAPI + Osirion) |
| `GET` | `/v1/game/stats/br/v2` | 2 Credits | Standard BR stats lookup |
| `GET` | `/v1/game/lookup` | 2 Credits | Simple player existence check |
| `GET` | `/v1/game/ranked` | 5 Credits | Ranked history & current progression |
| `GET` | `/v1/game/map` | Free | Map metadata & POI coordinates |
| `GET` | `/v1/game/tiles/{z}/{x}/{y}` | 30 Credits | **24h Pass** for high-res map tiles |
| `GET` | `/v1/game/shop` | 1 Credit | Fused item shop data |
| `GET` | `/v1/game/news` | 1 Credit | Game news & updates feed |
| `GET` | `/v1/game/weapons` | 1 Credit | Current loot pool & weapon stats |
| `GET` | `/v1/game/playlists`| 1 Credit | Active game modes & LTMs |

---

### 3. Replay & Match Analysis
Upload a `.replay` file to these endpoints for deep-dive extraction.

| Method | Endpoint | Cost | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/replay/parse` | 20 Credits | Full match JSON payload |
| `POST` | `/v1/replay/stats` | 5 Credits | Lightweight scoreboard & combat stats |
| `POST` | `/v1/replay/movement` | 8 Credits | Rotation paths & coordinate logs |
| `POST` | `/v1/replay/weapons` | 8 Credits | Weapon-by-weapon performance audit |
| `POST` | `/v1/replay/events` | 10 Credits | Full elimination feed & timestamp events |
| `POST` | `/v1/replay/drop-analysis`| 15 Credits | Bus route assessment & drop efficiency |
| `POST` | `/v1/replay/rotation-score`| 25 Credits | Zone survival & storm-edge efficiency |
| `POST` | `/v1/replay/opponents` | 30 Credits | Skill assessment of every player in your lobby |
| `POST` | `/v1/replay/match-info` | 5 Credits | Manifest for server-side match IDs |

---

### 4. Session & AI Coaching (Beta)
Advanced endpoints requiring the `requireBeta` flag in your account.

| Method | Endpoint | Cost | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/session/analyze` | 50 Credits | Multi-match session summary |
| `POST` | `/v1/session/auto-analyze`| 75 Credits | **Auto-fetch** tournament history from Epic |
| `POST` | `/v1/ai/coach` | 30 Credits | Deep AI gameplay critique (Vertex AI) |
| `POST` | `/v1/ai/weapon-coach` | 20 Credits | AI loadout optimization advice |
| `POST` | `/v1/ai/opponent-scout` | 25 Credits | AI scouting report on rival player names |
| `POST` | `/v1/ai/rotation-review`| 15 Credits | AI feedback on zone strategy |

---

### 5. Enhanced Intelligence
Data visualization and comparison utilities for power users.

| Method | Endpoint | Cost | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/replay/enhanced/heatmap`| 15 Credits | Map density grid of movements/kills |
| `POST` | `/v1/replay/enhanced/timeline`| 10 Credits | Unified event feed (Storm/Kills/Movement) |
| `POST` | `/v1/replay/enhanced/compare` | 25 Credits | Side-by-side comparison of two replays |
| `POST` | `/v1/replay/enhanced/clutch` | 20 Credits | Detects peak-performance clutch moments |

---

### 6. Integrations & Authentication
| Method | Endpoint | Cost | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/v1/auth/register` | Free | New account sign up (**+100 Credits**) |
| `POST` | `/v1/auth/login` | Free | Exchange credentials for JWT |
| `POST` | `/v1/epic/connect` | Free | Link your Epic Games account |
| `GET` | `/v1/epic/status` | Free | Verify Epic OAuth connection status |