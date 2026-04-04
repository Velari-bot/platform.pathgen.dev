import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection('status_incidents')
      .orderBy('started_at', 'desc')
      .limit(50)
      .get();

    const incidents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
    return NextResponse.json({ incidents: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== process.env.ADMIN_INTERNAL_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, severity, components_affected, message } = await req.json();
    const now = new Date().toISOString();

    const incidentData = {
      title,
      status: 'investigating',
      severity: severity || 'minor',
      components_affected: components_affected || [],
      started_at: now,
      resolved_at: null,
      duration_minutes: null,
      updates: [
        {
          timestamp: now,
          message: message || 'Investigating reported issues.'
        }
      ]
    };

    const docRef = await adminDb.collection('status_incidents').add(incidentData);
    
    return NextResponse.json({
      id: docRef.id,
      ...incidentData
    });
  } catch (error) {
    console.error('Failed to create incident:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
