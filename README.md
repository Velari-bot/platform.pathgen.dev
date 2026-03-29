# PathGen API Server

High-performance Node.js Express API server for parsing Fortnite replay files and automated AI coaching.

## Tech Stack
- **Runtime**: Node.js (Express)
- **Database**: Firebase Firestore (Auth, Credits, Logs) + Postgres (Optional/Historical)
- **Cache**: Redis (Rate limiting, Stats)
- **Storage**: Cloudflare R2 (Replay files & Map Tiles)
- **AI Performance**: Gemini 2.0 Flash (Vertex AI Integration)
- **Payment**: Stripe

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```bash
PORT=3000
NODE_ENV=development
ADMIN_TOKEN=your_token
FORTNITE_API_KEY=your_key
...
```

### 3. Run Development Server
```bash
npm run dev
```

## Documentation

For full API reference, authentication details, and credit costs, see [endpoints.md](./endpoints.md).

## Deployment
Deployed on **Railway** with automatic CD from GitHub.
Custom domain: `api.pathgen.dev`
Storage: `assets.pathgen.dev` (Cloudflare R2)
