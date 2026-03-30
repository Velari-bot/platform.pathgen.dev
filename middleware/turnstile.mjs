export const verifyTurnstile = async (req, res, next) => {
    const token = req.body.turnstileToken;
    const secretKey = process.env.TURNSTILE_SECRET_KEY;

    if (!token) {
        return res.status(400).json({ 
            error: true, 
            message: 'Security token missing' 
        });
    }

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                secret: secretKey,
                response: token,
                remoteip: req.ip,
            }),
        });

        const data = await response.json();

        if (data.success) {
            next();
        } else {
            res.status(403).json({ 
                error: true, 
                message: 'Security check failed. Please try again.' 
            });
        }
    } catch (err) {
        console.error('Turnstile verification error:', err);
        res.status(500).json({ 
            error: true, 
            message: 'Internal server error during security check' 
        });
    }
};
