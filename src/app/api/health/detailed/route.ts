import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { redis } from '@/lib/redis';
import { r2Client, R2_BUCKET } from '@/lib/r2.server';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function GET() {
    const checks: Record<string, string> = {};

    // 1. Database Check
    try {
        await pool.query('SELECT 1');
        checks.database = 'green';
    } catch {
        checks.database = 'red';
    }

    // 2. Redis Check
    if (redis) {
        try {
            await redis.ping();
            checks.redis = 'green';
        } catch {
            checks.redis = 'red';
        }
    } else {
        checks.redis = 'unavailable';
    }

    // 3. R2 Check
    try {
        await r2Client.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, MaxKeys: 1 }));
        checks.storage = 'green';
    } catch {
        checks.storage = 'red';
    }

    const allGreen = Object.values(checks).every(v => v === 'green' || v === 'unavailable');

    return NextResponse.json({
        status: allGreen ? 'operational' : 'degraded',
        components: checks,
        timestamp: new Date().toISOString()
    }, { status: allGreen ? 200 : 503 });
}
