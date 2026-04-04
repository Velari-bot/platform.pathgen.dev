import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseAdminConfig = {
  projectId: "pathgen-api",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!firebaseAdminConfig.privateKey || !firebaseAdminConfig.clientEmail) {
  console.error("❌ Missing Firebase Admin credentials in .env.local");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseAdminConfig),
});

const db = admin.firestore();

async function seed() {
  const incident = {
    title: "Elevated parse latency",
    status: "resolved",
    severity: "minor",
    components_affected: ["parser"],
    started_at: "2026-03-28T14:00:00Z",
    resolved_at: "2026-03-28T14:47:00Z",
    duration_minutes: 47,
    updates: [
      {
        timestamp: "2026-03-28T14:05:00Z",
        message: "Investigating elevated response times on the replay parser endpoint."
      },
      {
        timestamp: "2026-03-28T14:32:00Z",
        message: "Root cause identified. AES key cache expired during high traffic period."
      },
      {
        timestamp: "2026-03-28T14:47:00Z",
        message: "Resolved. Added automatic retry logic to AES key refresh. All systems normal."
      }
    ]
  };

  try {
    const docRef = await db.collection("status_incidents").add(incident);
    console.log("✅ Seeded test incident with ID:", docRef.id);
  } catch (error) {
    console.error("❌ Failed to seed incident:", error);
  } finally {
    process.exit(0);
  }
}

seed();
