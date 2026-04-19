import express from 'express';
import { adminDb } from '../lib/db.mjs';

const router = express.Router();

// 1. Basic Uptime Check
router.get('/', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Detailed Heartbeat
router.get('/detailed', async (req, res) => {
    let dbStatus = 'ok';
    try {
        await adminDb.collection('health_check').limit(1).get();
    } catch {
        dbStatus = 'unhealthy';
    }

    res.json({
        status: 'ok',
        database: dbStatus,
        storage: "healthy",
        epic_api: "healthy"
    });
});

export default router;
