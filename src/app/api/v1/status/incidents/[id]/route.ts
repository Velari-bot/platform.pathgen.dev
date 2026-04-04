import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== process.env.ADMIN_INTERNAL_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, status } = await req.json();
    const docId = params.id;
    const now = new Date().toISOString();

    const docRef = adminDb.collection('status_incidents').doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const currentData = doc.data();
    const updatePayload: any = {
      updates: [
        ...(currentData?.updates || []),
        { timestamp: now, message }
      ]
    };

    if (status) {
      updatePayload.status = status;
      if (status === 'resolved') {
        updatePayload.resolved_at = now;
        const start = new Date(currentData?.started_at);
        const diffMs = new Date(now).getTime() - start.getTime();
        updatePayload.duration_minutes = Math.round(diffMs / 60000);
      }
    }

    await docRef.update(updatePayload);

    return NextResponse.json({
      id: docId,
      ...currentData,
      ...updatePayload
    });
  } catch (error) {
    console.error('Failed to update incident:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
