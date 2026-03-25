import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl ? new Redis(redisUrl) : null;

export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<{ success: boolean; remaining: number }> {
    if (!redis) return { success: true, remaining: 999 };

    const current = await redis.get(key);
    const count = current ? parseInt(current) : 0;

    if (count >= limit) {
        return { success: false, remaining: 0 };
    }

    const newCount = await redis.incr(key);
    if (newCount === 1) {
        await redis.expire(key, windowSeconds);
    }

    return { success: true, remaining: limit - newCount };
}
