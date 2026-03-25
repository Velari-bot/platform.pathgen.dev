import { NextRequest, NextResponse } from 'next/server';
import { db, users, requestLogs, creditTransactions } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { ENDPOINTS_DATA } from '@/data/endpoints';
import { checkRateLimit, redis } from '@/lib/redis';
import { validateApiKey } from '@/lib/auth';
import { r2Client, R2_BUCKET } from '@/lib/r2.server';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
    const { endpoint } = await params;
    return handleRequest(req, endpoint, 'GET');
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
    const { endpoint } = await params;
    return handleRequest(req, endpoint, 'POST');
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ endpoint: string[] }> }) {
    const { endpoint } = await params;
    return handleRequest(req, endpoint, 'DELETE');
}

async function handleRequest(req: NextRequest, endpointParts: string[], method: string) {
    const fullPath = `/v1/${endpointParts.join('/')}`;
    const authHeader = req.headers.get('authorization');
    const startTime = Date.now();
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const apiKey = authHeader.split(' ')[1];

    try {
        // 1. Verify API Key
        const keyData = await validateApiKey(apiKey);
        if (!keyData) {
            return NextResponse.json({ error: 'Invalid or revoked API Key' }, { status: 401 });
        }

        // 2. Rate Limiting (30 req/min)
        const rateLimitKey = `rl:${apiKey}`;
        const { success, remaining } = await checkRateLimit(rateLimitKey, 30, 60);

        if (!success) {
            return NextResponse.json({ 
                error: 'Rate limit exceeded. Max 30 requests per minute.', 
                remaining 
            }, { 
                status: 429,
                headers: { 'X-RateLimit-Limit': '30', 'X-RateLimit-Remaining': '0', 'X-RateLimit-Reset': '60' }
            });
        }

        // 3. Find Endpoint Metadata & Cost
        let endpointInfo = null;
        for (const section of ENDPOINTS_DATA) {
            const found = section.endpoints.find(e => e.path === fullPath && e.method === method);
            if (found) {
                endpointInfo = found;
                break;
            }
        }

        if (!endpointInfo) {
            return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });
        }

        const creditCost = typeof endpointInfo.credits === 'number' ? endpointInfo.credits : 0;

        // 3.5. Handle File Uploads (for /v1/replay/*)
        let fileUrl: string | null = null;
        if (method === 'POST' && fullPath.startsWith('/v1/replay/')) {
            try {
                const formData = await req.formData();
                const file = formData.get('file') as File;
                
                if (file) {
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const key = `replays/${Date.now()}-${file.name}`;
                    
                    await r2Client.send(new PutObjectCommand({
                        Bucket: R2_BUCKET,
                        Key: key,
                        Body: buffer,
                        ContentType: file.type || 'application/octet-stream',
                    }));

                    fileUrl = `https://${process.env.R2_PUBLIC_DOMAIN}/${key}`;
                }
            } catch (e) {
                console.error('File Upload Error:', e);
            }
        }

        // 4. Check & Deduct Balance
        if (creditCost > 0) {
            const result = await db.transaction(async (tx) => {
                const [user] = await tx.select().from(users).where(eq(users.id, keyData.userId));
                
                if (!user || user.credits < creditCost) {
                    return { error: 'Insufficient credits', status: 402 };
                }

                // Deduct credits
                await tx.update(users)
                    .set({ credits: user.credits - creditCost })
                    .where(eq(users.id, keyData.userId));
                
                // Record transaction
                await tx.insert(creditTransactions).values({
                    userId: keyData.userId,
                    amount: -creditCost,
                    type: 'deduction',
                    description: `API Request: ${method} ${fullPath}`
                });

                return { success: true };
            });

            if (result.error) {
                return NextResponse.json({ error: result.error }, { status: result.status });
            }
        }

        // 5. Finalize log & return mock data for now
        const latency = Date.now() - startTime;
        
        // Log request (async)
        const logData = {
            id: crypto.randomUUID(),
            apiKey,
            endpoint: fullPath,
            method,
            status: 200,
            latency,
            timestamp: new Date().toISOString()
        };

        db.insert(requestLogs).values({
            ...logData,
            timestamp: new Date(logData.timestamp),
            ip: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
        }).execute();

        if (redis) {
            redis.publish('api-logs', JSON.stringify(logData)).catch(console.error);
        }

        const responseData = JSON.parse(endpointInfo.response || '{}');
        if (fileUrl) {
            responseData.storage_url = fileUrl;
        }

        return NextResponse.json(responseData, {
            headers: {
                'X-Credits-Used': creditCost.toString(),
                'X-RateLimit-Limit': '30',
                'X-RateLimit-Remaining': remaining.toString()
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
