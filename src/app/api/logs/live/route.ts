import { NextRequest, NextResponse } from 'next/server';
import { validateAdminToken } from '@/lib/auth';
import { redis } from '@/lib/redis';

export async function GET(req: NextRequest) {
    if (!validateAdminToken(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!redis) {
        return NextResponse.json({ error: 'Redis unavailable' }, { status: 503 });
    }

    const stream = new ReadableStream({
        async start(controller) {
            // Need a separate connection for subscriber
            const subscriber = redis!.duplicate();
            
            subscriber.subscribe('api-logs', (err) => {
                if (err) {
                    console.error('Failed to subscribe: %s', err.message);
                    controller.close();
                }
            });

            subscriber.on('message', (channel, message) => {
                if (channel === 'api-logs') {
                    controller.enqueue(`data: ${message}\n\n`);
                }
            });

            req.signal.onabort = () => {
                subscriber.quit();
                controller.close();
            };
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
