import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminDb } from '../lib/db.mjs';
import { verifyTurnstile } from '../middleware/turnstile.mjs';

const router = express.Router();

router.post('/register', verifyTurnstile, async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const userRef = adminDb.collection('users').doc(email);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userRef.set({
            email,
            password: hashedPassword,
            credits: 0,
            role: 'user',
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Registration failed:', err.message);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', verifyTurnstile, async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const userRef = adminDb.collection('users').doc(email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = userDoc.data();
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: userDoc.id, email: user.email, role: user.role }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: userDoc.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error('Login failed:', err.message);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Logged out' });
});

export default router;
