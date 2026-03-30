import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { isSupported, getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

const hasValidConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

if (hasValidConfig) {
    try {
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        firestore = getFirestore(app);
        auth = getAuth(app);
    } catch (e) {
        console.error("Firebase init failed:", e);
    }
} else {
    // Pathgen Mock Mode
    // We export null instead of mock objects because the Firebase SDK throws type errors 
    // when mock objects are passed to collection() or doc() functions.
    console.warn("PathGen: Using Offline/Mock mode. Firebase data features are disabled.");
}

if (typeof window !== "undefined" && hasValidConfig && app) {
  isSupported().then((supported) => {
    if (supported && app) analytics = getAnalytics(app);
  });
}

// db is an alias for firestore to match platform naming conventions
const db = firestore;

export { app, firestore, auth, analytics, db };
