"use client";
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Position {
    x: number;
    y: number;
    z: number;
    timestamp_ms: number;
}

interface PlayerTrack {
    id: string;
    name: string;
    positions: Position[];
    isPlayer?: boolean;
}

interface StormPhase {
    center_x: number;
    center_y: number;
    radius_cm: number;
    timestamp_ms: number;
}

interface ReplayMapProps {
    playerTrack?: PlayerTrack;
    allTracks?: PlayerTrack[];
    stormPhases?: StormPhase[];
    currentTimeMs?: number;
    height?: string;
}

const WORLD_MIN = -131072;
const WORLD_SIZE = 262144;
const MAX_ZOOM = 4;
const MAP_PIXEL_SIZE = 256 * Math.pow(2, MAX_ZOOM); // 4096px

function worldToLatLng(x: number, y: number): [number, number] {
    const pctX = (x - WORLD_MIN) / WORLD_SIZE;
    const pctY = (y - WORLD_MIN) / WORLD_SIZE;
    return [pctY * MAP_PIXEL_SIZE, pctX * MAP_PIXEL_SIZE];
}

function radiusToPx(cm: number): number {
    return (cm / WORLD_SIZE) * MAP_PIXEL_SIZE;
}

export default function ReplayMap({
    playerTrack,
    allTracks = [],
    stormPhases = [],
    currentTimeMs = 0,
    height = '500px'
}: ReplayMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<L.Map | null>(null);
    const playerMarker = useRef<L.CircleMarker | null>(null);
    const stormCircle = useRef<L.Circle | null>(null);

    useEffect(() => {
        if (!mapRef.current || leafletMap.current) return;

        // Initialize Map
        const map = L.map(mapRef.current, {
            crs: L.CRS.Simple,
            minZoom: 0,
            maxZoom: MAX_ZOOM,
            zoom: 1,
            center: [MAP_PIXEL_SIZE / 2, MAP_PIXEL_SIZE / 2],
            attributionControl: false,
        });

        // Add Tiles
        L.tileLayer('/tiles/ch7s2/{z}/{x}/{y}.png', {
            tileSize: 256,
            minZoom: 0,
            maxZoom: MAX_ZOOM,
            noWrap: true,
            bounds: [[0, 0], [MAP_PIXEL_SIZE, MAP_PIXEL_SIZE]]
        }).addTo(map);

        map.setMaxBounds([[0, 0], [MAP_PIXEL_SIZE, MAP_PIXEL_SIZE]]);
        leafletMap.current = map;

        // Draw Player Path
        if (playerTrack?.positions?.length) {
            const points = playerTrack.positions.map(p => worldToLatLng(p.x, p.y));
            L.polyline(points, { color: '#00d4ff', weight: 1, opacity: 0.3, dashArray: '4 4' }).addTo(map);
            
            // Drop & Death
            L.circleMarker(points[0], { radius: 6, color: '#00ff88', fillOpacity: 1 }).addTo(map).bindTooltip('Drop');
            L.circleMarker(points[points.length - 1], { radius: 6, color: '#ff4444', fillOpacity: 1 }).addTo(map).bindTooltip('Death');

            map.fitBounds(L.latLngBounds(points as any), { padding: [50, 50] });
        }

        return () => {
            map.remove();
            leafletMap.current = null;
        };
    }, [playerTrack]);

    // Animation Effect
    useEffect(() => {
        const map = leafletMap.current;
        if (!map) return;

        // Update Current Player Position
        if (playerTrack?.positions?.length) {
            const pos = playerTrack.positions.reduce((prev, curr) => 
                Math.abs(curr.timestamp_ms - currentTimeMs) < Math.abs(prev.timestamp_ms - currentTimeMs) ? curr : prev
            );
            const latlng = worldToLatLng(pos.x, pos.y);
            
            if (playerMarker.current) {
                playerMarker.current.setLatLng(latlng);
            } else {
                playerMarker.current = L.circleMarker(latlng, { radius: 8, color: '#fff', fillColor: '#00d4ff', fillOpacity: 1, weight: 2 }).addTo(map);
            }
        }

        // Update Storm
        if (stormPhases.length) {
            const phase = stormPhases.reduce((prev, curr) => 
                Math.abs(curr.timestamp_ms - currentTimeMs) < Math.abs(prev.timestamp_ms - currentTimeMs) ? curr : prev
            );
            const center = worldToLatLng(phase.center_x, phase.center_y);
            const radius = radiusToPx(phase.radius_cm);

            if (stormCircle.current) {
                stormCircle.current.setLatLng(center);
                stormCircle.current.setRadius(radius);
            } else {
                stormCircle.current = L.circle(center, { radius, color: '#9d33d4', fillOpacity: 0.1, weight: 2, dashArray: '8 4' }).addTo(map);
            }
        }
    }, [currentTimeMs, playerTrack, stormPhases]);

    return (
        <div style={{ height, background: '#12121a', borderRadius: '16px', overflow: 'hidden' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        </div>
    );
}
