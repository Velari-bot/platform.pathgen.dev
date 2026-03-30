"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const ReplayMap = dynamic(() => import('@/components/ReplayMap'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-2xl" />
});

export default function MapDemoPage() {
    const [currentTimeMs, setCurrentTimeMs] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(5);

    // Mock match data for demo
    const matchData = {
        playerTrack: {
            id: 'player_1',
            name: 'Replay Ninja',
            positions: [
                { x: -50000, y: -20000, z: 1000, timestamp_ms: 0 },
                { x: -45000, y: -22000, z: 1050, timestamp_ms: 20000 },
                { x: -40000, y: -25000, z: 1100, timestamp_ms: 40000 },
                { x: -35000, y: -28000, z: 1120, timestamp_ms: 60000 },
                { x: -30000, y: -30000, z: 1150, timestamp_ms: 80000 },
                { x: -25000, y: -32000, z: 1200, timestamp_ms: 100000 }
            ]
        },
        stormPhases: [
            { center_x: -30000, center_y: -30000, radius_cm: 60000, timestamp_ms: 0 },
            { center_x: -28000, center_y: -31000, radius_cm: 40000, timestamp_ms: 100000 }
        ]
    };

    const matchDurationMs = 300000;

    useEffect(() => {
        let timer: any;
        if (isPlaying) {
            timer = setInterval(() => {
                setCurrentTimeMs((prev: number) => {
                    const next = prev + (1000 * playbackSpeed / 10);
                    if (next >= matchDurationMs) {
                        setIsPlaying(false);
                        return matchDurationMs;
                    }
                    return next;
                });
            }, 100);
        }
        return () => clearInterval(timer);
    }, [isPlaying, playbackSpeed]);

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="main-content">
                <Header />
                <div style={{ padding: '32px' }}>
                    <h1 style={{ marginBottom: '24px' }}>Advanced Map API Demo</h1>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
                        <ReplayMap 
                            playerTrack={matchData.playerTrack as any}
                            stormPhases={matchData.stormPhases}
                            currentTimeMs={currentTimeMs}
                            height="600px"
                        />
                        
                        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                style={{
                                    padding: '12px 24px',
                                    background: '#0a0a0f',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                {isPlaying ? 'Pause' : 'Play Simulation'}
                            </button>
                            
                            <input 
                                type="range" 
                                min={0} 
                                max={matchDurationMs} 
                                value={currentTimeMs}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentTimeMs(parseInt(e.target.value))}
                                style={{ flex: 1 }} 
                            />
                            
                            <select 
                                value={playbackSpeed} 
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlaybackSpeed(parseInt(e.target.value))}
                                style={{
                                    padding: '12px',
                                    border: '1px solid #E5E7EB',
                                    borderRadius: '12px'
                                }}
                            >
                                <option value={1}>1x Speed</option>
                                <option value={5}>5x Speed</option>
                                <option value={20}>20x Speed</option>
                            </select>
                            
                            <span style={{ fontWeight: 600, color: '#6B7280' }}>
                                {Math.floor(currentTimeMs / 1000)}s / 300s
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
