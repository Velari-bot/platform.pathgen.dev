import admin from 'firebase-admin';

let app = null;

if (!admin.apps.length) {
    let serviceAccount;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
            // Handle individual components from .env
            serviceAccount = {
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID
            };
        } else {
            console.warn('Firebase Admin credentials not found in env.');
        }
    } catch (e) {
        console.error('Failed to parse Firebase credentials:', e.message);
    }

    if (serviceAccount) {
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // Fallback for local testing (only if file exists)
        // If not, this will fail.
        try {
            app = admin.initializeApp();
        } catch (e) {
             console.error('Firebase initialization failed:', e.message);
        }
    }
} else {
    app = admin.app();
}

export const adminDb = app ? admin.firestore() : null;
export default admin;
