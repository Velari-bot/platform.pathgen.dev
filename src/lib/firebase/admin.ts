import admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: "pathgen-api",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

let adminDb: admin.firestore.Firestore;

if (!admin.apps.length) {
    if (firebaseAdminConfig.privateKey && firebaseAdminConfig.clientEmail) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(firebaseAdminConfig as any),
            });
        } catch (e) {
            console.warn("Firebase Admin Init Failed (using mock):", (e as Error).message);
        }
    } else {
        console.warn("Firebase Admin credentials missing. Using mock for build/offline mode.");
    }
}

if (admin.apps.length) {
    adminDb = admin.firestore();
} else {
    // Mock for build time / offline
    adminDb = {
        collection: () => ({
            doc: () => ({
                get: () => Promise.resolve({ exists: false }),
                set: () => Promise.resolve(),
                update: () => Promise.resolve(),
            })
        })
    } as any;
}

export { adminDb };
export default admin;
