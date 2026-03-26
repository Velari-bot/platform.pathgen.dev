import express from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../lib/r2.mjs';
import { FORTNITE_POIS } from '../data/pois.mjs';

const router = express.Router();

router.get('/game/cosmetics', async (req, res) => {
    res.json({ message: 'Cosmetics list available in v1' });
});

/**
 * High-Fidelity Tile Engine
 * Returns Lanczos3-resampled map tiles directly from R2.
 * Supports authentication via Bearer Token OR ?key= query parameter.
 */
router.get(['/map/tiles/:z/:x/:y', '/map/tiles/:z/:x/:y.png'], async (req, res) => {
    const { z, x, y } = req.params;
    
    // Check if the user has a valid key (either Bearer or ?key=)
    // The middleware validateFirestoreKey usually handles Bearer, 
    // but for tiles (Leaflet) we often need ?key=
    const key = req.query.key || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    
    if (!key) {
        return res.status(401).json({ error: true, code: 'UNAUTHORIZED', message: 'API key required. Use Bearer token or ?key= query parameter.' });
    }
    
    // Validate coordinates
    if (![z, x].every(n => /^\d+$/.test(n))) {
        return res.status(400).json({ error: true, code: 'INVALID_TILE', message: 'Tile coordinates must be integers.' });
    }
    
    // Handle y and optional .png
    const cleanY = y.replace('.png', '');
    if (!/^\d+$/.test(cleanY)) {
         return res.status(400).json({ error: true, code: 'INVALID_TILE', message: 'Tile coordinates must be integers.' });
    }

    const tilePath = `tiles/ch7s2/${z}/${x}/${cleanY}.png`;
    
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: tilePath
        });
        
        const response = await r2.send(command);
        
        res.set({
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=2592000, immutable',
            'Access-Control-Allow-Origin': '*',
            'CDN-Cache-Control': 'max-age=2592000'
        });
        
        response.Body.pipe(res);
        
    } catch (err) {
        if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
            return res.status(404).json({
                error: true,
                code: 'TILE_NOT_FOUND',
                message: `Tile ${z}/${x}/${y} does not exist.`
            });
        }
        res.status(500).json({ error: true, code: 'TILE_ERROR' });
    }
});

/**
 * Map Configuration & POIs
 */
router.get('/map', async (req, res) => {
    res.json({ 
        season: 'ch7s2',
        tile_url: 'https://api.pathgen.dev/v1/map/tiles/{z}/{x}/{y}.png?key={your_api_key}',
        max_zoom: 5,
        min_zoom: 0,
        tile_size: 256,
        world_bounds: {
            min_x: -131072,
            max_x:  131072,
            min_y: -131072,
            max_y:  131072
        },
        map_center: { x: 0, y: 0 },
        coordinate_system: 'fortnite_world_cm',
        pois: FORTNITE_POIS.map(p => ({
            name: p.name,
            x: Math.round(p.location.x),
            y: Math.round(p.location.y)
        }))
    });
});

router.get('/game/news', async (req, res) => {
    res.json({ br: [], creative: [], stw: [] });
});

router.get('/game/playlists', async (req, res) => {
    res.json({ current_playlists: [] });
});

export default router;
