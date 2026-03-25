import { eq, and } from 'drizzle-orm';
import { db, apiKeys } from '@/lib/db';

export async function validateApiKey(key: string) {
    if (!key) return null;

    // Check for "rs_" prefix as a convention
    if (!key.startsWith('rs_')) return null;

    const result = await db.query.apiKeys.findFirst({
        where: and(eq(apiKeys.key, key), eq(apiKeys.isRevoked, false)),
        with: {
            user: true
        }
    });

    if (!result) return null;

    // Update last used at (non-blocking)
    db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.key, key)).execute();

    return result;
}

export function validateAdminToken(req: Request) {
    const adminToken = process.env.ADMIN_TOKEN;
    if (!adminToken) return false;
    
    const token = req.headers.get('x-admin-token') || req.headers.get('authorization')?.replace('Bearer ', '');
    return token === adminToken;
}
