import { NextRequest, NextResponse } from 'next/server';
import { db, requestLogs } from '@/lib/db';
import { desc } from 'drizzle-orm';
import { validateAdminToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    if (!validateAdminToken(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const logs = await db.query.requestLogs.findMany({
            orderBy: [desc(requestLogs.timestamp)],
            limit: 100
        });

        return NextResponse.json({ logs });
    } catch (error) {
        console.error('Error fetching logs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
