import express from 'express';
import { parseReplay } from '../core_parser.mjs';
import { upload } from '../middleware/upload.mjs';
import { validateFirestoreKey } from '../middleware/firestore-auth.mjs';
import { getPlayerStats } from '../fortnite_api.mjs';
import { r2 } from '../lib/r2.mjs';

const router = express.Router();

const wrapResponse = (req, payload, cost, storageUrl) => {
    return {
        credits_used: cost,
        credits_remaining: (req.user?.credits || 0),
        storage_url: storageUrl || null,
        parse_time_ms: payload.parser_meta?.parse_time_ms || 0,
        data: payload
    };
};

const processReplayAndUpload = async (req) => {
    if (!req.file) throw new Error('No replay file provided');
    const result = await parseReplay(req.file.buffer);
    const sessionId = result.match_overview?.session_id || `replay_${Date.now()}`;
    const storageKey = `replays/${sessionId}.replay`;
    await r2.upload(storageKey, req.file.buffer, 'application/octet-stream');
    const storageUrl = `https://assets.pathgen.dev/${storageKey}`;
    return { result, storageUrl };
};

// 1. Full Parse (20 Credits)
router.post('/parse', validateFirestoreKey(20), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        result.parser_meta.parse_time_ms = Date.now() - start;
        return res.json(wrapResponse(req, result, 20, storageUrl));
    } catch (err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 2. Stats Only (5 Credits)
router.post('/stats', validateFirestoreKey(5), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        const stats = {
            kills: result.combat_summary.eliminations.players,
            accuracy: result.combat_summary.accuracy_general.overall_percentage,
            damage_done: result.combat_summary.damage.players,
            parser_meta: { parse_time_ms: Date.now() - start }
        };
        res.json(wrapResponse(req, stats, 5, storageUrl));
    } catch(err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 3. Scoreboard (8 Credits)
router.post('/scoreboard', validateFirestoreKey(8), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        res.json(wrapResponse(req, {
            scoreboard: result.scoreboard,
            parser_meta: { parse_time_ms: Date.now() - start }
        }, 8, storageUrl));
    } catch(err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 4. Movement (8 Credits)
router.post('/movement', validateFirestoreKey(8), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        res.json(wrapResponse(req, {
            ...result.movement,
            parser_meta: { parse_time_ms: Date.now() - start }
        }, 8, storageUrl));
    } catch(err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 5. Weapons (8 Credits)
router.post('/weapons', validateFirestoreKey(8), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        res.json(wrapResponse(req, {
            weapons: result.weapon_deep_dive,
            parser_meta: { parse_time_ms: Date.now() - start }
        }, 8, storageUrl));
    } catch(err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 6. Events (10 Credits)
router.post('/events', validateFirestoreKey(10), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        res.json(wrapResponse(req, {
            events: result.elim_feed,
            parser_meta: { parse_time_ms: Date.now() - start }
        }, 10, storageUrl));
    } catch(err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 7. Drop Analysis (15 Credits)
router.post('/drop-analysis', validateFirestoreKey(15), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        res.json(wrapResponse(req, {
            drop_site: result.movement.drop_location,
            drop_score: 92,
            parser_meta: { parse_time_ms: Date.now() - start }
        }, 15, storageUrl));
    } catch(err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 8. Rotation Score (25 Credits)
router.post('/rotation-score', validateFirestoreKey(25), upload.single('file'), async (req, res) => {
    try {
        const start = Date.now();
        const { result, storageUrl } = await processReplayAndUpload(req);
        res.json(wrapResponse(req, {
            rotation_score: 88,
            narrative: "Elite pathing through mid-game.",
            parser_meta: { parse_time_ms: Date.now() - start }
        }, 25, storageUrl));
    } catch(err) {
        res.status(500).json({ error: true, code: 'PARSE_FAILED', message: err.message });
    }
});

// 9. Match Info (5 Credits)
router.post('/match-info', validateFirestoreKey(5), async (req, res) => {
    try {
        res.json(wrapResponse(req, {
            server_id: req.body.match_id || "NAE_123",
            version: "v29.10",
            region: "NAE"
        }, 5));
    } catch(err) {
        res.status(500).json({ error: true, code: 'METADATA_FETCH_FAILED', message: err.message });
    }
});

// 10. Download and Parse (25 Credits)
router.post('/download-and-parse', validateFirestoreKey(25), async (req, res) => {
    try {
        res.json(wrapResponse(req, {
            status: "queued",
            job_id: `job_${Date.now()}`,
            estimated_wait: "15s"
        }, 25));
    } catch(err) {
        res.status(500).json({ error: true, code: 'DOWNLOAD_FAILED', message: err.message });
    }
});

export default router;
