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

let app: FirebaseApp;
let firestore: Firestore;
let auth: Auth;
let analytics: Analytics | null = null;

const hasValidConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

if (hasValidConfig) {
    try {
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        firestore = getFirestore(app);
        auth = getAuth(app);
    } catch (e) {
        console.error("Firebase init failed:", e);
        // Fallback to mock on init failure
        app = { name: "fallback" } as any;
        firestore = {} as any;
        auth = { onAuthStateChanged: (cb: any) => cb(null) } as any;
    }
} else {
    console.warn("Firebase config missing. Using mock/offline mode.");
    app = { name: "mock-app" } as any;
    firestore = { type: 'firestore-mock' } as any;
    auth = { 
        onAuthStateChanged: (cb: any) => cb(null),
        currentUser: null,
        signOut: () => Promise.resolve()
    } as any;
}

if (typeof window !== "undefined" && hasValidConfig) {
  isSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  });
}

export { app, firestore, auth, analytics };
