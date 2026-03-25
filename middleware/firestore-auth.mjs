import { adminDb } from '../lib/db.mjs';

/**
 * Validates request using Firebase/Firestore and handles real-time billing.
 */
export const validateFirestoreKey = (creditCost = 1) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization || req.headers['x-api-key'];
        const startTime = Date.now();

        if (!authHeader) {
            return res.status(401).json({
                error: true,
                code: 'INVALID_KEY',
                message: 'Invalid or missing API key'
            });
        }

        const apiKey = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        // Skip credit check for admin token
        if (apiKey === process.env.ADMIN_TOKEN) {
            req.user = { id: 'admin', role: 'admin', credits: 999999, email: 'admin@pathgen.dev' };
            return next();
        }

        try {
            if (!adminDb) throw new Error("Database Unavailable");

            const result = await adminDb.runTransaction(async (transaction) => {
                // 1. Identity Lookup
                const keyRef = adminDb.collection('api_keys').doc(apiKey);
                const keyDoc = await transaction.get(keyRef);
                
                if (!keyDoc.exists) {
                    throw new Error("Invalid Key");
                }

                const keyData = keyDoc.data();
                const { email } = keyData;

                // 2. Credit Check & Atomic Deduction
                const userRef = adminDb.collection('users').doc(email);
                const userDoc = await transaction.get(userRef);
                
                if (!userDoc.exists) {
                    throw new Error("User Not Found");
                }

                const credits = userDoc.data().credits || 0;

                if (credits < creditCost) {
                    throw new Error("Insufficient Balance");
                }

                const newCredits = Math.max(0, credits - creditCost);
                transaction.update(userRef, { credits: newCredits });

                // 3. Log Activity
                const latency = Date.now() - startTime;
                const actRef = adminDb.collection('request_logs').doc();
                
                transaction.set(actRef, {
                    email,
                    key_id: apiKey,
                    credits: creditCost,
                    endpoint: req.originalUrl || req.path,
                    method: req.method,
                    status: 'success',
                    latency: latency,
                    timestamp: new Date()
                });

                // Update lastUsed
                transaction.update(keyRef, { lastUsed: new Date().toISOString() });

                return { id: email, email, credits: newCredits, role: userDoc.data().role || 'user' };
            });

            req.user = result;
            next();
        } catch (err) {
            console.error('Firestore Auth Failed:', err.message);
            
            if (err.message === "Invalid Key") {
                return res.status(401).json({ error: true, code: 'INVALID_KEY', message: 'Invalid API key' });
            }

            if (err.message === "Insufficient Balance") {
                return res.status(402).json({ error: true, code: 'INSUFFICIENT_CREDITS', message: 'Please recharge your credits.' });
            }

            return res.status(500).json({ error: true, message: err.message || 'Authentication service unavailable' });
        }
    };
};
