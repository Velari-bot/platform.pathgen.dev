# Pathgen API v1.2.6 Service Map

This is the full **Pathgen API v1.2.6 Service Map**. It includes all public, private, and experimental endpoints currently active on the server.

> [!NOTE]
> **Authentication**: All endpoints (except public health) require an `Authorization: Bearer <token>` header. Match-related endpoints deduct credits from the user's Firestore profile automatically.

---

### ╼ CORE PARSING & REPLAY ENDPOINTS ╾
*Typically used for standard match processing.*

| Endpoint | Method | Cost | Description |
| :--- | :---: | :---: | :--- |
| `/v1/replay/parse` | **POST** | 20cr | **Main Entry.** Full statistical extraction. |
| `/v1/replay/stats` | **POST** | 5cr | Summary stats only (no events/scoreboard). |
| `/v1/replay/scoreboard` | **POST** | 8cr | Full 100-player lobby scoreboard only. |
| `/v1/replay/movement` | **POST** | 8cr | Locational data and distances (foot/vehicle/sky). |
| `/v1/replay/weapons` | **POST** | 8cr | Deep dive into weapon handle performance. |
| `/v1/replay/events` | **POST** | 10cr | Elimination feed and key match events. |
| `/v1/replay/drop-analysis`| **POST** | 15cr | Land-site scoring and optimization metrics. |
| `/v1/replay/rotation-score`| **POST** | 25cr | **High Precision.** Storm zone rotation grading. |
| `/v1/replay/match-info` | **POST** | 5cr | Metadata lookup for a server-side match ID. |
| `/v1/replay/download-and-parse`| **POST** | 25cr | Automated fetch from Epic servers + Parse. |

---

### ╼ AI COACHING & ANALYTICS ╾
*Premium endpoints powered by Gemini 2.5 Flash.*

| Endpoint | Method | Cost | Description |
| :--- | :--- | :---: | :--- |
| `/v1/ai/analyze` | **POST** | 15cr | Match summary, strengths/weaknesses. |
| `/v1/ai/coach` | **POST** | 30cr | Deep tactical review (Early/Mid/Late game). |
| `/v1/ai/session-coach` | **POST** | 50cr | Multi-match trend analysis (Up to 6 files). |
| `/v1/ai/weapon-coach` | **POST** | 20cr | Aim & Loadout critique based on weapon data. |
| `/v1/ai/drop-recommend` | **POST** | 20cr | Dynamic landing recommendation via AI. |
| `/v1/ai/opponent-scout` | **POST** | 25cr | Playstyle & threat analysis on a specific player. |
| `/v1/ai/rotation-review`| **POST** | 15cr | Narrative explanation of rotation performance. |

---

### ╼ ACCOUNT, AUTH & BILLING ╾
*System-level management.*

| Endpoint | Method | Cost | Description |
| :--- | :--- | :---: | :--- |
| `/v1/auth/login` | **POST** | 0cr | Secure token exchange. |
| `/v1/auth/register` | **POST** | 0cr | New user onboarding. |
| `/v1/account/me` | **GET** | 0cr | Current profile and credit balance. |
| `/v1/billing/topup` | **POST** | 0cr | Credit purchase via Stripe. |
| `/v1/epic/auth-url` | **GET** | 0cr | Get Epic Games OAuth login link. |
| `/v1/epic/connect` | **POST** | 0cr | Finalize Epic account linking. |

---

### ╼ SYSTEM & INFRASTRUCTURE ╾
*Health and diagnostics.*

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/health` | **GET** | Basic system uptime check. |
| `/health/detailed` | **GET** | DB, R2, and Epic API heartbeat check. |
| `/metrics` | **GET** | Prometheus metrics for monitoring. |
| `/v1/spec` | **GET** | Full OpenAPI / Swagger documentation. |