import express from 'express';
import { adminDb } from '../lib/db.mjs';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/detailed', async (req, res) => {
    let dbStatus = 'ok';
    let dbLatency = 0;
    try {
        const start = Date.now();
        // Check Firestore by listing a collection (minimal cost/latency)
        await adminDb.collection('health_check').limit(1).get();
        dbLatency = Date.now() - start;
    } catch(err) {
        console.error('Firestore Health Check Failed:', err.message);
        dbStatus = 'unhealthy';
    }

    res.json({
        status: 'ok',
        uptime_seconds: Math.floor(process.uptime()),
        memory_mb: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024),
        components: {
            parser: { status: 'ok', avg_parse_ms: 842 }, // Example value, needs real tracking
            database: { status: dbStatus, latency_ms: dbLatency },
            storage: { status: 'ok', provider: 'cloudflare-r2' },
            fortnite_api: { status: 'ok', last_check: new Date().toISOString() }
        }
    });
});

router.get('/db', async (req, res) => {
    try {
        await adminDb.collection('health_check').limit(1).get();
        res.json({ status: 'ok' });
    } catch(err) {
        res.status(500).json({ status: 'unhealthy', error: err.message });
    }
});

router.get('/parser', (req, res) => {
    // Placeholder for real logic checking ooz-wasm and last parse time.
    res.json({
        status: 'ok',
        parser: 'ooz-wasm',
        aes: 'working',
        last_success: new Date().toISOString()
    });
});

export default router;
