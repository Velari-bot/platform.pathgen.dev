import admin from 'firebase-admin';

let app = null;

if (!admin.apps.length) {
    let serviceAccount;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            console.warn('FIREBASE_SERVICE_ACCOUNT env not found. Using local fallback.');
            // For local development, look for a .json file
            // You can also add more logic here to find it.
        }
    } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
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
