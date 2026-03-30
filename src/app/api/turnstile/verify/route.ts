import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        const secretKey = process.env.TURNSTILE_SECRET_KEY;

        if (!token) {
            return NextResponse.json({ success: false, message: 'Token missing' }, { status: 400 });
        }

        const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: secretKey,
                response: token,
            }),
        });

        const data = await verifyRes.json();

        if (data.success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 403 });
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return NextResponse.json({ success: false, message: 'Server error occurred' }, { status: 500 });
    }
}
