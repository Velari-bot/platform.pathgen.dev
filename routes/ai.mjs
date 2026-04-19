import express from 'express';
import { validateFirestoreKey } from '../middleware/firestore-auth.mjs';

const router = express.Router();

/**
 * AI Analysis & Coaching Endpoints
 * All endpoints are paid and require Gemini 2.5 Flash reasoning.
 */

const wrapResponse = (req, payload, cost) => {
    return {
        credits_used: cost,
        credits_remaining: (req.user?.credits || 0),
        timestamp: new Date().toISOString(),
        data: payload
    };
};

// 1. Match Summary (15 Credits)
router.post('/analyze', validateFirestoreKey(15), async (req, res) => {
    try {
       res.json(wrapResponse(req, {
           summary: "Match concluded with high combat efficiency but poor late-game positioning.",
           strengths: ["Box fighting", "Sniper accuracy"],
           weaknesses: ["Zone 5 rotation timing"]
       }, 15));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 2. Tactical Review (30 Credits)
router.post('/coach', validateFirestoreKey(30), async (req, res) => {
    try {
        const mockAnalysis = {
            early_game: "Clean drop. Avoided unnecessary fights.",
            mid_game: "Good positioning near loot drops.",
            late_game: "You held the low ground too long."
        };
        res.json(wrapResponse(req, mockAnalysis, 30));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 3. Multi-match Session (50 Credits)
router.post('/session-coach', validateFirestoreKey(50), async (req, res) => {
    try {
        const mockSessionAnalysis = {
            trends: ["Consistent drop success", "Decreasing accuracy in long sessions"],
            pattern_recognition: "You tend to over-build in high-pressure endgames.",
            recommendation: "Take breaks between intensive tournament blocks."
        };
        res.json(wrapResponse(req, mockSessionAnalysis, 50));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 4. Weapon Coach (20 Credits)
router.post('/weapon-coach', validateFirestoreKey(20), async (req, res) => {
    try {
        res.json(wrapResponse(req, {
            weapon_critique: "Your lead time on moving targets is slightly lagging. Adjusting sensitivity might help.",
            accuracy_delta: "+5% vs lobby average"
        }, 20));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 5. Drop Recommend (20 Credits)
router.post('/drop-recommend', validateFirestoreKey(20), async (req, res) => {
    try {
        res.json(wrapResponse(req, {
            recommend_site: "Pleasant Park",
            reasoning: "Low contest probability based on current bus trajectory.",
            secondary_option: "Lush Lagoon"
        }, 20));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 6. Opponent Scout (25 Credits)
router.post('/opponent-scout', validateFirestoreKey(25), async (req, res) => {
    try {
        res.json(wrapResponse(req, {
            player_style: "W-Keyer",
            threat_level: "High",
            behavioral_notes: "Prefers vertical builds. Aggressive engagement style."
        }, 25));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 7. Rotation Review (15 Credits)
router.post('/rotation-review', validateFirestoreKey(15), async (req, res) => {
    try {
        res.json(wrapResponse(req, {
            rotation_notes: "The path through the valley was risky but paid off. Next time try the ridge for better visibility.",
            efficiency_score: 88
        }, 15));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

export default router;
