Here are all the pages the API documentation site needs:

---

## Public Pages (no login required)

**Landing / Home**
Hero section, what the API does, key stats (33 confirmed fields, 397KB response, 842ms parse time), quick code example, pricing overview, call to action to sign up. This is the first thing a developer sees.

**Documentation — Overview**
Introduction to the API, base URL, authentication explanation, how credits work, request format, response format, error shape, versioning policy. The "read this first" page.

**Documentation — Authentication**
How to get an API key, how to include it in requests, key rotation, security best practices, what happens when a key is compromised.

**Documentation — Credits and Billing**
Credit pack pricing, what each endpoint costs, how deductions work, failed parse policy (not charged), rate limits table, how to buy more credits, credit expiry policy.

**Documentation — Free Endpoints**
Full reference for all 7 free endpoints: account lookup, ranked data, account stats, cosmetics, item shop, weapons database, map and POIs, news, playlists. Each with request, parameters, and full response example.

**Documentation — Replay Parsing**
Full reference for all paid parsing endpoints: full parse, stats only, scoreboard, movement, weapons, events stream, drop analysis. Each with cost, request, parameters, and full response example.

**Documentation — Exclusive Endpoints**
Full reference for rotation score, opponents intel, and session analysis. Emphasize these exist nowhere else. Full request and response examples.

**Documentation — Response Schema**
Complete field-by-field reference for the full parse response object. Every key, its type, whether it can be null, what null means, and example values. This is the most referenced page by developers integrating the API.

**Documentation — Error Codes**
Every error code, its HTTP status, what causes it, and how to handle it. Code examples showing proper error handling.

**Documentation — Rate Limits**
Rate limit table per endpoint tier, how limits are enforced, what 429 looks like, retry-after header, best practices for respecting limits.

**Documentation — Supported Versions**
Which Fortnite chapter and season versions are currently supported, how version support works when Epic updates the game, deprecation policy, how to check what version a replay file is.

**Documentation — Changelog**
Version history, what changed in each release, breaking changes clearly flagged, upcoming features.

**Documentation — SDKs**
Node.js and Python package docs once released. Until then a note that they are coming with links to GitHub. Raw HTTP examples in the meantime.

**Pricing Page**
Three credit packs side by side (Starter $4.99, Pro $19.99, Studio $49.99), per-endpoint cost table, comparison vs Osirion, FAQ section answering common billing questions.

**Status Page**
Live API status, uptime percentage, response time graph, incident history. Simple green/yellow/red for each service component.

---

## Auth Pages

**Sign Up**
Email and password, or sign up with Discord or GitHub. New accounts start with 100 free credits to try the API.

**Log In**
Email/password or OAuth. Redirect to dashboard after login.

**Forgot Password**
Email reset flow.

---

## Dashboard Pages (logged in)

**Dashboard — Home**
Credit balance prominently displayed, quick stats (total requests this month, total replays parsed, credits used this month), recent API calls log, quick links to docs and API keys.

**Dashboard — API Keys**
List of all keys with label, creation date, last used date. Create new key button. Delete key button. Copy key button. Max 5 keys. Warning that key is only shown once on creation.

**Dashboard — Buy Credits**
Credit pack selector (5000 / 25000 / 75000), quantity input, Stripe checkout integration. Order history below.

**Dashboard — Usage**
Requests per day chart (last 30 days), credits used per endpoint breakdown, most called endpoints, errors encountered. Helps developers understand their usage patterns and optimize costs.

**Dashboard — Billing History**
Invoice list with date, amount, credits purchased, payment method. Download invoice button per row.

**Dashboard — Account Settings**
Display name, email, password change, delete account. Notification preferences for low credit balance alerts.

---

## Developer Experience Pages

**Quickstart Guide**
Get from zero to first API call in under 5 minutes. Three steps: sign up, get API key, make first request. Code examples in JavaScript, Python, and curl. Links to deeper docs after.

**Tutorials**
Individual how-to guides:
- How to parse your first replay
- How to build a stat tracker
- How to display a movement map
- How to implement session analysis for FNCS
- How to use the free endpoints for a cosmetics browser

**Playground**
Interactive API explorer in the browser. Select an endpoint, fill in parameters, upload a test replay, see the real response. No code required. Developers can test before they integrate. This is the single most important developer experience feature — Osirion doesn't have this.

**API Explorer / Reference**
Interactive version of the docs where every endpoint has a "Try it" button that makes a real request using the logged-in user's API key. Parameters are editable inline.

---

## Support Pages

**FAQ**
Common questions: Does it support all seasons? What happens if my replay fails to parse? Are credits refunded on failure? What is null vs 0? How do I know which endpoint to use? How fast is parsing?

**Contact / Support**
Simple form for billing issues, bug reports, and feature requests. Discord server link for community support.

**Terms of Service**
Usage terms, acceptable use policy, rate limit enforcement, account termination conditions.

**Privacy Policy**
What data is stored, how long replay files are kept, what is shared, GDPR compliance.

---

## Marketing Pages

**Use Cases**
Four cards: Stat Trackers, Tournament Tools, Content Creators, Game Analytics. Each with a short description of what developers build with the API and which endpoints they use.

**Compare**
Side-by-side comparison with Osirion's API. Honest, factual. More free endpoints, cheaper partial parses, exclusive endpoints they don't have, same price on full parse, better data depth.

**Showcase**
Apps built on the ReplayScope API. Community gallery. Empty at launch, filled in as developers ship things.

---

## Total Page Count

- Public docs: 13 pages
- Auth: 3 pages
- Dashboard: 6 pages
- Developer experience: 4 pages
- Support: 4 pages
- Marketing: 4 pages

**34 pages total**

The three most important ones to build first are the Documentation Overview, the Pricing page, and the Dashboard with API key management. Everything else can be added after launch. A developer needs to understand what the API does, know what it costs, and be able to get a key — those three pages are the minimum viable documentation site.