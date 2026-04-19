import express from 'express';
import { stripeLib, PACKS } from '../lib/stripe.mjs';
import { adminDb } from '../lib/db.mjs';

const router = express.Router();

// 1. Credit Purchase (0 Credits)
router.post('/topup', async (req, res) => {
    const { pack } = req.body;
    const priceId = PACKS[pack] || PACKS['starter'];
    
    try {
        const session = await stripeLib.createCheckoutSession(req.user.id, priceId);
        res.json({ url: session.url });
    } catch {
        res.status(500).json({ error: 'Stripe session creation failed' });
    }
});

export default router;
