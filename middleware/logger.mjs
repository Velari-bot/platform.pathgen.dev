import { adminDb } from '../lib/db.mjs';

export const loggerMiddleware = async (req, res, next) => {
    const start = Date.now();

    res.on('finish', async () => {
        const duration = Date.now() - start;
        
        // Log to Firestore if user is authenticated (Identity identified in auth middleware)
        if (req.user && adminDb) {
            try {
                const logData = {
                    timestamp: new Date(),
                    method: req.method,
                    endpoint: req.originalUrl || req.path,
                    status: res.statusCode,
                    duration_ms: duration,
                    user_id: req.user.id || 'anonymous',
                    credits_used: req.user.last_action_cost || 0,
                    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
                };
                
                // Writing to logs collection
                await adminDb.collection('request_logs').add(logData);
            } catch (err) {
                console.error('Request logging failed:', err.message);
            }
        }
    });

    next();
};

export const checkCredits = async (req, res, next) => {
    // Note: In the new architecture, credit checking and deduction 
    // is already handled atomically in firestore-auth.mjs
    // This middleware is kept for structural compatibility if needed.
    next();
};
