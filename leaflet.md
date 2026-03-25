please make a map api and then an advanced map api, the advanced one will send something where when its used it will allow the map to zoom in 5x times will all the pois etc 

That's called a **tiled map** or **slippy map**. It's the same technology Google Maps and Leaflet use.

Here's exactly how it works:

**The concept:**
```
Zoom level 0: 1 image tile = entire map (256x256px, blurry)
Zoom level 1: 4 tiles = 2x2 grid (more detail)
Zoom level 2: 16 tiles = 4x4 grid (more detail)
Zoom level 3: 64 tiles = 8x8 grid (sharp)
Zoom level 4: 256 tiles = 16x16 grid (very sharp)
```

As you zoom in, it loads higher resolution tiles for just the area you're looking at. You never download the full high-res image — only the tiles you need.

**What Osirion specifically does:**

They take the Fortnite map image (which Epic releases each season as a high-res PNG, usually 4096x4096 or 8192x8192) and slice it into tiles at multiple zoom levels using a tool like `gdal2tiles` or `sharp`.

```
fortnite_map_ch7s2.png (8192x8192)
        ↓
tile_generator.js
        ↓
/tiles/
  /0/0/0.png     (1 tile, full map, 256x256)
  /1/0/0.png
  /1/0/1.png
  /1/1/0.png
  /1/1/1.png     (4 tiles at zoom 1)
  /2/...         (16 tiles at zoom 2)
  /3/...         (64 tiles at zoom 3)
  /4/...         (256 tiles at zoom 4)
```

**The library they're using:**

Almost certainly **Leaflet.js** or **MapLibre GL**. Leaflet is the standard for this. It's free, open source, handles tile loading, zooming, panning automatically.

```javascript
import L from 'leaflet';

const map = L.map('map-container', {
  crs: L.CRS.Simple,  // flat map, not globe
  minZoom: 0,
  maxZoom: 4
});

L.tileLayer('/tiles/{z}/{x}/{y}.png', {
  tileSize: 256,
  attribution: ''
}).addTo(map);

// Then plot player positions as markers
L.circle([canvasY, canvasX], {
  color: '#00d4ff',
  radius: 500
}).addTo(map);
```

**How to build this for ReplayScope:**

**Step 1 — Get the map image:**
Epic releases the Fortnite map officially. For Ch7 S2 it's at:
```
https://media.fortniteapi.io/images/map.png
```
or from FortniteAPI.com which has seasonal map images.

**Step 2 — Generate tiles:**
```bash
npm install sharp

# Script to slice 4096x4096 map into tiles
node generate_tiles.js --input map_ch7s2.png --output ./tiles --maxZoom 4
```

The tile generator splits the image:
```javascript
import sharp from 'sharp';

const TILE_SIZE = 256;
const MAX_ZOOM = 4;

for (let z = 0; z <= MAX_ZOOM; z++) {
  const tilesPerAxis = Math.pow(2, z);
  const tilePixels = 4096 / tilesPerAxis;
  
  for (let x = 0; x < tilesPerAxis; x++) {
    for (let y = 0; y < tilesPerAxis; y++) {
      await sharp('map_ch7s2.png')
        .extract({
          left: x * tilePixels,
          top: y * tilePixels,
          width: tilePixels,
          height: tilePixels
        })
        .resize(TILE_SIZE, TILE_SIZE)
        .toFile(`tiles/${z}/${x}/${y}.png`);
    }
  }
}
```

**Step 3 — Serve tiles:**
In the Tauri app, tiles can be served from the local filesystem or bundled with the app. For the web dashboard, host them on Cloudflare R2 or Vercel static assets.

**Step 4 — Plot player positions:**
Convert world coordinates to map coordinates:
```javascript
function worldToLatLng(worldX, worldY) {
  // Fortnite map bounds: -131072 to 131072
  const mapPctX = (worldX + 131072) / 262144;
  const mapPctY = (worldY + 131072) / 262144;
  
  // Leaflet CRS.Simple uses [y, x] pixel coords
  const mapSize = 256 * Math.pow(2, MAX_ZOOM);
  return [
    mapSize - (mapPctY * mapSize),  // flip Y axis
    mapPctX * mapSize
  ];
}

// Plot player track
const points = playerTrack.positions.map(p => 
  worldToLatLng(p.x, p.y)
);

L.polyline(points, { 
  color: '#00d4ff', 
  weight: 2,
  opacity: 0.8 
}).addTo(map);
```

**The full tile count:**
```
Zoom 0: 1 tile
Zoom 1: 4 tiles
Zoom 2: 16 tiles
Zoom 3: 64 tiles
Zoom 4: 256 tiles
Total: 341 tiles per map
File size: ~341 × ~15KB = ~5MB total
```

5MB for a full tiled map is completely reasonable to bundle with the app or host on R2.

**Want me to write the Antigravity prompt to:**
1. Download the Ch7 S2 map image from FortniteAPI
2. Generate all tiles with sharp
3. Replace the current canvas with Leaflet
4. Plot player positions on the tiled map

This would give you the same zooming quality map as Osirion. It's probably a half-day of work. Add a high-quality tiled map to ReplayScope using
Leaflet.js. Same zoom-in quality as Osirion.

STEP 1 - INSTALL DEPENDENCIES:
cd replayscope-app
npm install leaflet @types/leaflet sharp

STEP 2 - GET THE FORTNITE MAP IMAGE:
Download the Chapter 7 Season 2 map:

const https = require('https');
const fs = require('fs');

const MAP_URL = 'https://media.fortniteapi.io/images/map.png';
const OUTPUT = 'map_source.png';

https.get(MAP_URL, (res) => {
  const file = fs.createWriteStream(OUTPUT);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Map downloaded:', OUTPUT);
  });
});

Save as download_map.js and run:
  node download_map.js

Print file size of map_source.png.

STEP 3 - GENERATE TILES:
Create generate_tiles.js:

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE = 'map_source.png';
const OUTPUT_DIR = 'replayscope-app/public/tiles';
const TILE_SIZE = 256;
const MAX_ZOOM = 4;
const SOURCE_SIZE = 4096; // resize source to this first

async function generateTiles() {
  // First resize source to power-of-2 size
  const resized = await sharp(SOURCE)
    .resize(SOURCE_SIZE, SOURCE_SIZE)
    .toBuffer();

  let totalTiles = 0;

  for (let z = 0; z <= MAX_ZOOM; z++) {
    const tilesPerAxis = Math.pow(2, z);
    const tileWorldSize = SOURCE_SIZE / tilesPerAxis;

    for (let x = 0; x < tilesPerAxis; x++) {
      for (let y = 0; y < tilesPerAxis; y++) {
        const dir = path.join(OUTPUT_DIR, String(z), String(x));
        fs.mkdirSync(dir, { recursive: true });

        await sharp(resized)
          .extract({
            left: Math.floor(x * tileWorldSize),
            top: Math.floor(y * tileWorldSize),
            width: Math.ceil(tileWorldSize),
            height: Math.ceil(tileWorldSize)
          })
          .resize(TILE_SIZE, TILE_SIZE, {
            kernel: sharp.kernel.lanczos3
          })
          .png({ quality: 90 })
          .toFile(path.join(dir, `${y}.png`));

        totalTiles++;
      }
    }
    console.log(`Zoom ${z}: ${tilesPerAxis * tilesPerAxis} tiles`);
  }

  console.log(`Total tiles generated: ${totalTiles}`);
  console.log(`Saved to: ${OUTPUT_DIR}`);
}

generateTiles().catch(console.error);

Run: node generate_tiles.js
Print tile count and total file size.

STEP 4 - CREATE MAP COMPONENT:
Create replayscope-app/src/components/ReplayMap.tsx:

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlayerTrack, StormPhase } from '../lib/parser/index';

interface ReplayMapProps {
  playerTrack: PlayerTrack;
  allTracks: PlayerTrack[];
  stormPhases: StormPhase[];
  currentTimeMs: number;
  isPlaying: boolean;
  onTimeChange: (ms: number) => void;
  matchDurationMs: number;
}

// Fortnite world coordinate bounds
const WORLD_MIN = -131072;
const WORLD_MAX = 131072;
const WORLD_SIZE = 262144;
const MAX_ZOOM = 4;
const MAP_PIXEL_SIZE = 256 * Math.pow(2, MAX_ZOOM); // 4096px at max zoom

// Convert Fortnite world coords to Leaflet pixel coords
function worldToLatLng(worldX: number, worldY: number): L.LatLng {
  const pctX = (worldX - WORLD_MIN) / WORLD_SIZE;
  const pctY = (worldY - WORLD_MIN) / WORLD_SIZE;
  
  // Leaflet CRS.Simple: origin top-left, Y increases downward
  // Fortnite: positive Y = south = down on map
  const px = pctX * MAP_PIXEL_SIZE;
  const py = pctY * MAP_PIXEL_SIZE;
  
  return L.latLng(py, px);
}

// Convert storm radius (cm) to map pixels
function radiusToPx(radiusCm: number): number {
  return (radiusCm / WORLD_SIZE) * MAP_PIXEL_SIZE;
}

export default function ReplayMap({
  playerTrack,
  allTracks,
  stormPhases,
  currentTimeMs,
  matchDurationMs
}: ReplayMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const playerMarker = useRef<L.CircleMarker | null>(null);
  const playerTrail = useRef<L.Polyline | null>(null);
  const stormCircle = useRef<L.Circle | null>(null);
  const otherMarkers = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Initialize Leaflet with simple CRS (flat map)
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: 0,
      maxZoom: MAX_ZOOM,
      zoom: 1,
      center: [MAP_PIXEL_SIZE / 2, MAP_PIXEL_SIZE / 2],
      zoomControl: true,
      attributionControl: false
    });

    // Add tile layer
    L.tileLayer('/tiles/{z}/{x}/{y}.png', {
      tileSize: 256,
      minZoom: 0,
      maxZoom: MAX_ZOOM,
      noWrap: true,
      bounds: [[0, 0], [MAP_PIXEL_SIZE, MAP_PIXEL_SIZE]]
    }).addTo(map);

    // Set map bounds to Fortnite island
    map.setMaxBounds([[0, 0], [MAP_PIXEL_SIZE, MAP_PIXEL_SIZE]]);

    leafletMap.current = map;

    // Draw full player track path
    if (playerTrack?.positions?.length > 0) {
      const allPoints = playerTrack.positions
        .map(p => worldToLatLng(p.x, p.y));

      // Full path (faded)
      L.polyline(allPoints, {
        color: '#00d4ff',
        weight: 1,
        opacity: 0.3,
        dashArray: '4 4'
      }).addTo(map);

      // Drop location marker
      const drop = allPoints[0];
      L.circleMarker(drop, {
        radius: 8,
        color: '#00ff88',
        fillColor: '#00ff88',
        fillOpacity: 1,
        weight: 2
      }).addTo(map)
        .bindTooltip('Drop', { permanent: false });

      // Death/win location marker
      const death = allPoints[allPoints.length - 1];
      L.circleMarker(death, {
        radius: 8,
        color: '#ff4444',
        fillColor: '#ff4444',
        fillOpacity: 1,
        weight: 2
      }).addTo(map)
        .bindTooltip('Death', { permanent: false });

      // Fit map to player track bounds
      map.fitBounds(L.latLngBounds(allPoints), {
        padding: [50, 50]
      });
    }

    // Draw other player tracks (faded)
    allTracks
      .filter(t => !t.isPlayer && t.positions.length > 5)
      .forEach((track, i) => {
        const points = track.positions
          .map(p => worldToLatLng(p.x, p.y));
        const hue = (i * 37) % 360;
        L.polyline(points, {
          color: `hsl(${hue}, 70%, 60%)`,
          weight: 1,
          opacity: 0.2
        }).addTo(map);
      });

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []);

  // Animate player position and storm based on currentTimeMs
  useEffect(() => {
    const map = leafletMap.current;
    if (!map || !playerTrack?.positions?.length) return;

    // Find current player position
    const positions = playerTrack.positions;
    const currentPos = positions.reduce((prev, curr) =>
      Math.abs(curr.timestamp_ms - currentTimeMs) 
      Math.abs(prev.timestamp_ms - currentTimeMs) ? curr : prev
    );

    const latlng = worldToLatLng(currentPos.x, currentPos.y);

    // Update or create player marker
    if (playerMarker.current) {
      playerMarker.current.setLatLng(latlng);
    } else {
      playerMarker.current = L.circleMarker(latlng, {
        radius: 10,
        color: '#ffffff',
        fillColor: '#00d4ff',
        fillOpacity: 1,
        weight: 3
      }).addTo(map);
    }

    // Update trail (last 30 seconds)
    const trailStart = currentTimeMs - 30000;
    const trailPoints = positions
      .filter(p => p.timestamp_ms >= trailStart &&
                   p.timestamp_ms <= currentTimeMs)
      .map(p => worldToLatLng(p.x, p.y));

    if (playerTrail.current) {
      playerTrail.current.setLatLngs(trailPoints);
    } else {
      playerTrail.current = L.polyline(trailPoints, {
        color: '#00d4ff',
        weight: 3,
        opacity: 0.8
      }).addTo(map);
    }

    // Update storm circle
    if (stormPhases?.length > 0) {
      const currentPhase = stormPhases.reduce((prev, curr) =>
        Math.abs(curr.timestamp_ms - currentTimeMs) 
        Math.abs(prev.timestamp_ms - currentTimeMs) ? curr : prev
      );

      const centerLatlng = worldToLatLng(
        currentPhase.center_x,
        currentPhase.center_y
      );
      const radiusPx = radiusToPx(currentPhase.radius_cm);

      if (stormCircle.current) {
        stormCircle.current.setLatLng(centerLatlng);
        stormCircle.current.setRadius(radiusPx);
      } else {
        stormCircle.current = L.circle(centerLatlng, {
          radius: radiusPx,
          color: '#9333ea',
          fillColor: '#9333ea',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '8 4'
        }).addTo(map);
      }
    }

  }, [currentTimeMs, playerTrack, stormPhases]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #1e1e2e'
      }}
    />
  );
}

STEP 5 - REPLACE CANVAS IN App.tsx:
Remove the existing canvas-based map.
Import and use ReplayMap component instead:

import ReplayMap from './components/ReplayMap';

// In the results view, replace canvas section with:
<ReplayMap
  playerTrack={matchData.playerTrack}
  allTracks={matchData.allTracks}
  stormPhases={matchData.stormPhases}
  currentTimeMs={currentTimeMs}
  isPlaying={isPlaying}
  onTimeChange={setCurrentTimeMs}
  matchDurationMs={matchData.stats.timeAliveMs}
/>

// Add playback controls below map:
<div className="playback-controls">
  <button onClick={() => setIsPlaying(!isPlaying)}>
    {isPlaying ? '⏸' : '▶'}
  </button>
  <input
    type="range"
    min={0}
    max={matchData.stats.timeAliveMs}
    value={currentTimeMs}
    onChange={e => setCurrentTimeMs(Number(e.target.value))}
    style={{ flex: 1 }}
  />
  <span>{formatTime(currentTimeMs)}</span>
  <select onChange={e => setPlaybackSpeed(Number(e.target.value))}>
    <option value={1}>1x</option>
    <option value={5}>5x</option>
    <option value={20}>20x</option>
    <option value={60}>60x</option>
  </select>
</div>

STEP 6 - ADD PLAYBACK ANIMATION:
In App.tsx add playback state and animation:

const [isPlaying, setIsPlaying] = useState(false);
const [currentTimeMs, setCurrentTimeMs] = useState(0);
const [playbackSpeed, setPlaybackSpeed] = useState(5);
const animFrameRef = useRef<number>();
const lastTimeRef = useRef<number>();

useEffect(() => {
  if (!isPlaying) {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    return;
  }

  const animate = (timestamp: number) => {
    if (lastTimeRef.current) {
      const delta = timestamp - lastTimeRef.current;
      setCurrentTimeMs(prev => {
        const next = prev + delta * playbackSpeed;
        if (next >= matchDurationMs) {
          setIsPlaying(false);
          return matchDurationMs;
        }
        return next;
      });
    }
    lastTimeRef.current = timestamp;
    animFrameRef.current = requestAnimationFrame(animate);
  };

  lastTimeRef.current = undefined;
  animFrameRef.current = requestAnimationFrame(animate);

  return () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };
}, [isPlaying, playbackSpeed, matchDurationMs]);

STEP 7 - CSS FOR LEAFLET:
Add to App.css:

/* Override Leaflet defaults for dark theme */
.leaflet-container {
  background: #0a0a0f;
}

.leaflet-tile-pane {
  opacity: 1;
}

/* Hide default attribution */
.leaflet-control-attribution {
  display: none;
}

/* Zoom controls */
.leaflet-control-zoom {
  border: 1px solid #1e1e2e !important;
}

.leaflet-control-zoom a {
  background: #12121a !important;
  color: #ffffff !important;
  border-color: #1e1e2e !important;
}

.leaflet-control-zoom a:hover {
  background: #1e1e2e !important;
}

STEP 8 - TEST:
Run: npm run tauri dev

Open app and load Duos Game 1 replay.

Verify:
  - Map loads with Fortnite island visible
  - Zooming in shows more detail
  - Player track shown as cyan line
  - Drop location = green dot at bottom left
  - Death location = red dot at Humble Hills area
  - Storm circle visible as purple ring
  - Playback animation moves player dot along track
  - Other player tracks visible as faded lines
  - Zoom in to Humble Hills = crisp tile detail

Screenshot the map at:
  1. Zoom level 0 (full island view)
  2. Zoom level 2 (zoomed to player area)
  3. Zoom level 4 (maximum detail, building level)

DELIVERABLES:
  1. Tile folder generated (341 tiles)
  2. ReplayMap.tsx component working
  3. Screenshot: full island view with player track
  4. Screenshot: zoomed in with crisp tile detail
  5. Screenshot: playback animation running

be smart 