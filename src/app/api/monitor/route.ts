import { adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { service, status, adminToken } = body;

    // Security check
    if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!service || !status) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (status === "down") {
      console.log(`[Monitor] Auto-creating incident for ${service} (DOWN)`);
      
      // Create incident automatically
      await adminDb.collection("incidents").add({
        title: `${service} is experiencing issues`,
        status: "investigating",
        severity: "major",
        components_affected: [service],
        started_at: new Date().toISOString(),
        resolved_at: null,
        auto_created: true,
        updates: [
          {
            timestamp: new Date().toISOString(),
            message: `Automated monitoring detected ${service} is unavailable. Our team is investigating the outage.`,
          },
        ],
      });
    }

    if (status === "up") {
      console.log(`[Monitor] Auto-resolving incident for ${service} (UP)`);
      
      // Find open auto-created incidents for this service
      const snap = await adminDb
        .collection("incidents")
        .where("components_affected", "array-contains", service)
        .where("status", "!=", "resolved")
        .where("auto_created", "==", true)
        .get();

      if (snap.empty) {
          return NextResponse.json({ ok: true, message: "No active incidents found to resolve" });
      }

      for (const doc of snap.docs) {
        const started = new Date(doc.data().started_at);
        const duration = Math.round((Date.now() - started.getTime()) / 60000);

        await doc.ref.update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
          duration_minutes: duration,
          updates: [
            ...doc.data().updates,
            {
              timestamp: new Date().toISOString(),
              message: `Service restoration confirmed. All systems operational. Incident duration: ${duration} minutes.`,
            },
          ],
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Monitor] API Route Error:", (err as Error).message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
