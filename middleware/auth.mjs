import { adminDb } from '../lib/db.mjs';

export const validateApiKey = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers['x-api-key'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

    if (!token) {
        return res.status(401).json({
            error: true,
            code: 'INVALID_KEY',
            message: 'Invalid or missing API key'
        });
    }
    
    // 1. Admin Token Check (Direct from Env)
    if (token === process.env.ADMIN_TOKEN) {
        req.user = { id: 'admin', role: 'admin', credits: 999999 };
        return next();
    }

    // 2. Lookup in Firestore
    try {
        if (!adminDb) {
            return res.status(503).json({ 
                error: true,
                code: 'DATABASE_UNAVAILABLE',
                message: 'Internal Database connection not established' 
            });
        }
        
        const keySnap = await adminDb.collection('api_keys').doc(token).get();
        
        if (!keySnap.exists) {
            return res.status(401).json({
                error: true,
                code: 'INVALID_KEY',
                message: 'The provided API key is invalid or has been revoked.'
            });
        }

        const keyData = keySnap.data();
        const userId = keyData.userId;

        // Fetch User (for credits/role)
        const userSnap = await adminDb.collection('users').doc(userId).get();
        
        if (!userSnap.exists) {
            return res.status(401).json({
                error: true,
                code: 'USER_NOT_FOUND',
                message: 'User associated with this API key not found.'
            });
        }

        req.user = { 
            id: userId,
            ...userSnap.data(),
            key_id: token,
            role: userSnap.data().role || 'user'
        };

        next();
    } catch (err) {
        console.error('Auth error:', err.message);
        return res.status(500).json({ 
            error: true,
            code: 'INTERNAL_ERROR',
            message: 'An internal error occurred during authentication.' 
        });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            error: true,
            code: 'FORBIDDEN',
            message: 'Admin access required'
        });
    }
};
