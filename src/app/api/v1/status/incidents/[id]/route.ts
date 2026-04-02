import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

const ADMIN_SECRET = process.env.ADMIN_INTERNAL_SECRET || 'pathgen_admin_secret_2026';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authHeader = req.headers.get('authorization');
  
  if (authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const docRef = adminDb.collection('incidents').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists()) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    const currentData = docSnap.data();
    const updates = [...(currentData?.updates || [])];

    if (body.update) {
      const { timestamp, message } = body.update;
      if (timestamp && message) {
        updates.push({ timestamp, message });
      }
    }

    const patchData: any = {
      ...body,
      updates
    };
    
    // Remove individual 'update' if it was part of the body
    delete patchData.update;

    await docRef.update(patchData);
    
    return NextResponse.json({ 
      id,
      ...currentData,
      ...patchData 
    });
  } catch (error) {
    console.error('Failed to update incident:', error);
    return NextResponse.json({ error: 'Failed to update incident' }, { status: 500 });
  }
}
