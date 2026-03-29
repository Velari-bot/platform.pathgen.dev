import express from 'express';
import { validateFirestoreKey } from '../middleware/firestore-auth.mjs';

const router = express.Router();

/**
 * AI Analysis & Coaching Endpoints
 * All endpoints are paid and require Gemini 2.0 Flash reasoning.
 */

// wrapResponse helper to match other routes
const wrapResponse = (req, payload, cost) => {
    return {
        credits_used: cost,
        credits_remaining: (req.user?.credits || 0),
        timestamp: new Date().toISOString(),
        data: payload
    };
};

// 1. Single Match Coach (30 Credits)
router.post('/coach', validateFirestoreKey(30), async (req, res) => {
    try {
        // In a real implementation, this would fetch match data and call Gemini
        // For now, we'll return structured mock analysis
        const mockAnalysis = {
            match_id: req.body.match_id || "m_4829",
            summary: "Excellent mechanical execution, but suboptimal rotation in circle 4 led to unnecessary shield consumption.",
            tips: [
                "Rotate 30 seconds earlier when zone is pulling mountain-side.",
                "Conserve impulse grenades for endgame height takes.",
                "Your switch-to-shotgun timing is 150ms slower than lobby average."
            ],
            metrics: {
                positioning_score: 72,
                mechanics_score: 94,
                resource_management: 65
            }
        };

        res.json(wrapResponse(req, mockAnalysis, 30));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 2. Session Coach (50 Credits)
router.post('/session-coach', validateFirestoreKey(50), async (req, res) => {
    try {
        const mockSessionAnalysis = {
            session_id: req.body.session_id || `s_${Date.now()}`,
            consistency_rating: "B+",
            pattern_recognition: "You tend to die in mid-game when playing 'passive-aggressive'. Commit to either full avoidance or full engagement.",
            recommendation: "Avoid 'Tiptop Terrace' drops during FNCS sessions; your survival rate there is only 22%.",
            stat_trends: {
                kd_trend: "+0.4",
                avg_placement_trend: "-3"
            }
        };

        res.json(wrapResponse(req, mockSessionAnalysis, 50));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 3. Weapon Coach (20 Credits)
router.post('/weapon-coach', validateFirestoreKey(20), async (req, res) => {
    try {
        const mockWeaponAnalysis = {
            featured_weapon: "Chaos Reloader",
            damage_efficiency: "Low (42%)",
            insight: "You have a high equip count but low damage-per-second. This suggests you are panicking during high-pressure box fights.",
            comparative_stats: {
                your_accuracy: "28%",
                lobby_elite_avg: "41%"
            }
        };

        res.json(wrapResponse(req, mockWeaponAnalysis, 20));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 4. Drop Recommend (20 Credits)
router.post('/drop-recommend', validateFirestoreKey(20), async (req, res) => {
    try {
        const mockDropRecommend = {
            bus_route: req.body.bus_route || "N -> S",
            optimal_drop: "Sandy Strip",
            reasoning: "Based on current lobby density hot-spots, Sandy Strip offers 40% higher survival probability for this route.",
            secondary_option: "Lush Lagoon"
        };

        res.json(wrapResponse(req, mockDropRecommend, 20));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

// 5. Opponent Scout (25 Credits)
router.post('/opponent-scout', validateFirestoreKey(25), async (req, res) => {
    try {
        const mockScout = {
            target_player: req.body.player_name || "Unknown Opponent",
            playstyle: "Aggressive Rusher",
            behavioral_notes: "Very high SMG usage. Prefers left-hand peeks. Often over-extends when opponent is under 100 HP.",
            counter_strategy: "Hold defensive boxes and wait for the over-extension reload window."
        };

        res.json(wrapResponse(req, mockScout, 25));
    } catch (err) {
        res.status(500).json({ error: true, code: 'AI_ANALYSIS_FAILED', message: err.message });
    }
});

export default router;
