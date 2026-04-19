import express from 'express';
import { adminDb } from '../lib/db.mjs';
import { validateFirestoreKey } from '../middleware/firestore-auth.mjs';

const router = express.Router();

// 1. Get Profile & Balance (0 Credits)
router.get('/me', validateFirestoreKey(0), async (req, res) => {
    try {
        const userDoc = await adminDb.collection('users').doc(req.user.email).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const data = userDoc.data();
        res.json({
            id: req.user.id || "usr_unknown",
            email: req.user.email,
            credits: data.credits || 0,
            tier: data.tier || "Free"
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
