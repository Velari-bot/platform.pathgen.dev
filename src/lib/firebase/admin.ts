import admin from "firebase-admin";

const firebaseAdminConfig = {
  projectId: "pathgen-api",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
  });
}

const adminDb = admin.firestore();

export { adminDb };
export default admin;
