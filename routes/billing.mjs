import express from 'express';
import { stripeLib, PACKS } from '../lib/stripe.mjs';

import { adminDb } from '../lib/db.mjs';
import { validateFirestoreKey } from '../middleware/firestore-auth.mjs';

const router = express.Router();

router.get('/history', validateFirestoreKey(0), async (req, res) => {
    try {
        const historySnap = await adminDb.collection('transactions')
            .where('email', '==', req.user.email)
            .where('type', '==', 'PURCHASE')
            .get();
        
        const transactions = historySnap.docs.map(doc => doc.data());
        res.json({ transactions });
    } catch {
        res.status(500).json({ error: 'Could not fetch history' });
    }
});

router.post('/checkout', async (req, res) => {
    const { pack } = req.body;
    const priceId = PACKS[pack];
    if (!priceId) return res.status(400).json({ error: 'Invalid pack' });

    try {
        const session = await stripeLib.createCheckoutSession(req.user.id, priceId);
        res.json({ url: session.url });
    } catch {
        res.status(500).json({ error: 'Stripe session creation failed' });
    }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripeLib.verifyWebhook(req.body, sig);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_email || session.metadata?.email;
        const amountUsd = session.amount_total / 100;
        const creditsAdded = Math.floor(amountUsd * 100);
        
        try {
            await adminDb.runTransaction(async (transaction) => {
                const userRef = adminDb.collection('users').doc(email);
                const userDoc = await transaction.get(userRef);
                const currentCredits = userDoc.exists ? (userDoc.data().credits || 0) : 0;
                
                transaction.set(userRef, { credits: currentCredits + creditsAdded }, { merge: true });
                
                const txnRef = adminDb.collection('transactions').doc();
                transaction.set(txnRef, {
                    email,
                    type: 'PURCHASE',
                    amount: amountUsd,
                    credits: creditsAdded,
                    status: 'success',
                    timestamp: new Date()
                });
            });
            console.log(`Granted ${creditsAdded} credits to user ${email}`);
        } catch(err) {
            console.error('Error updating credits after successful purchase:', err.message);
        }
    }

    res.json({ received: true });
});

export default router;
