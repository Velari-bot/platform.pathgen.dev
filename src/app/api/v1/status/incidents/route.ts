import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = process.env.ADMIN_INTERNAL_SECRET || 'pathgen_admin_secret_2026';

export async function GET() {
  try {
    const snap = await adminDb
      .collection('incidents')
      .orderBy('started_at', 'desc')
      .get();

    const incidents = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  
  if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, status, severity, components_affected, started_at } = body;

    if (!title || !status || !severity || !components_affected || !started_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newIncident = {
      title,
      status,
      severity,
      components_affected,
      started_at,
      updates: body.updates || [],
      created_at: new Date().toISOString()
    };

    const docRef = await adminDb.collection('incidents').add(newIncident);
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...newIncident 
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create incident:', error);
    return NextResponse.json({ error: 'Failed to create incident' }, { status: 500 });
  }
}
