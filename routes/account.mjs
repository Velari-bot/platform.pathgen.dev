import express from 'express';
import { adminDb } from '../lib/db.mjs';
import { validateFirestoreKey } from '../middleware/firestore-auth.mjs';
import { getPlayerStats } from '../fortnite_api.mjs';

const router = express.Router();

router.get('/balance', validateFirestoreKey(0), async (req, res) => {
    try {
        const userRef = adminDb.collection('users').doc(req.user.email);
        const userDoc = await userRef.get();
        if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
        res.json({ credits: userDoc.data().credits || 0 });
    } catch {
        res.status(500).json({ error: 'Could not fetch balance' });
    }
});

router.get('/keys', validateFirestoreKey(0), async (req, res) => {
    try {
        const keysSnap = await adminDb.collection('api_keys')
            .where('email', '==', req.user.email)
            .get();
        
        const keys = keysSnap.docs.map(doc => ({
            key_id: doc.id,
            ...doc.data()
        }));
        res.json({ keys });
    } catch {
        res.status(500).json({ error: 'Could not fetch keys' });
    }
});

router.post('/keys', validateFirestoreKey(0), async (req, res) => {
    const { name, appId } = req.body;
    const key = `rs_${Math.random().toString(36).substr(2, 10)}${Math.random().toString(36).substr(2, 10)}`;
    try {
        const keysSnap = await adminDb.collection('api_keys')
            .where('email', '==', req.user.email)
            .get();
        if (keysSnap.size >= 5) {
            return res.status(403).json({ error: 'Key limit reached. Maximum 5 keys per account.' });
        }

        const keyData = {
            email: req.user.email,
            userId: req.user.id,
            orgId: req.user.orgId || 'personal',
            appId: appId || 'default-app',
            name: name || 'New API Key',
            created_at: new Date().toISOString(),
            lastUsed: null
        };
        await adminDb.collection('api_keys').doc(key).set(keyData);
        res.status(201).json({ key_id: key, ...keyData });
    } catch (e) {
        console.error('Key creation failed:', e.message);
        res.status(500).json({ error: 'Could not create key' });
    }
});


router.delete('/keys/:keyId', validateFirestoreKey(0), async (req, res) => {
    try {
        const keyRef = adminDb.collection('api_keys').doc(req.params.keyId);
        const keyDoc = await keyRef.get();
        if (!keyDoc.exists || keyDoc.data().email !== req.user.email) {
            return res.status(403).json({ error: 'Unauthorised or key not found' });
        }
        await keyRef.delete();
        res.json({ message: 'Key deleted' });
    } catch {
        res.status(500).json({ error: 'Could not delete key' });
    }
});


// USAGE
router.get('/usage', validateFirestoreKey(0), async (req, res) => {
    try {
        const usageSnap = await adminDb.collection('activities')
            .where('email', '==', req.user.email)
            .get();
        res.json({ total_requests: usageSnap.size });
    } catch {
        res.status(500).json({ error: 'Could not fetch usage' });
    }
});


router.get('/usage/daily', async (req, res) => {
    // Placeholder for real time-series data from DB
    res.json({
        "2026-03-23": 1502,
        "2026-03-24": 1840,
        "2026-03-25": 1201
    });
});

// Version 1 Free
router.get('/lookup', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing name parameter' });

  try {
    const stats = await getPlayerStats(name);
    if (!stats) return res.status(404).json({ error: 'Player not found' });
    res.json(stats);
  } catch {
    res.status(500).json({ error: 'Lookup failed' });
  }
});

router.get('/ranked', (req, res) => {
  res.json({ status: 'ok', mode: 'Ranked BR', rank: 'Gold II' });
});

router.get('/stats', (req, res) => {
  res.json({ status: 'ok', message: 'General player stats' });
});

export default router;
