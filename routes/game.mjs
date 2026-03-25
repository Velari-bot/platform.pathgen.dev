import express from 'express';
import { FORTNITE_POIS } from '../data/pois.mjs';

const router = express.Router();

router.get('/cosmetics', async (req, res) => {
    res.json({ message: 'Cosmetics list available in v1' });
});

/**
 * Standard Map API
 * Returns basic map metadata and POIs.
 */
router.get('/map', async (req, res) => {
    res.json({ 
        url: 'https://fortnite-api.com/images/map_en.png',
        version: 'ch7s2',
        pois: FORTNITE_POIS
    });
});

/**
 * Advanced Map API (Tiled / slippy map)
 * Provides tile layer configuration for Leaflet/Slippy maps.
 */
router.get('/map/advanced', async (req, res) => {
    res.json({
        engine: 'leaflet',
        tile_url: 'https://assets.pathgen.dev/tiles/ch7s2/{z}/{x}/{y}.png',
        min_zoom: 0,
        max_zoom: 4,
        max_native_zoom: 4,
        crs: 'L.CRS.Simple',
        attribution: 'PathGen API / Epic Games',
        pois: FORTNITE_POIS.map(poi => ({
            ...poi,
            latlng: worldToLatLng(poi.location.x, poi.location.y)
        }))
    });
});

// Helper for coordinates (Fortnite world -> Leaflet pixels @ max zoom)
function worldToLatLng(worldX, worldY) {
    const WORLD_MIN = -131072;
    const WORLD_SIZE = 262144;
    const MAP_PIXEL_SIZE = 4096; // 256 * 2^4
    
    const pctX = (worldX - WORLD_MIN) / WORLD_SIZE;
    const pctY = (worldY - WORLD_MIN) / WORLD_SIZE;
    
    return [pctY * MAP_PIXEL_SIZE, pctX * MAP_PIXEL_SIZE];
}

router.get('/news', async (req, res) => {
    res.json({ br: [], creative: [], stw: [] });
});

router.get('/playlists', async (req, res) => {
    res.json({ current_playlists: [] });
});

export default router;
