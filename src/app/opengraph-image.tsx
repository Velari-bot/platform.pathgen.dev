import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Pathgen — Fortnite Replay API'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-2px',
          marginBottom: 24
        }}>
          Pathgen
        </div>
        <div style={{
          fontSize: 32,
          color: '#888888',
          marginBottom: 48
        }}>
          Fortnite Replay API
        </div>
        <div style={{
          display: 'flex',
          gap: 32
        }}>
          <div style={{
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: 12,
            padding: '16px 32px',
            color: '#4ade80',
            fontSize: 20
          }}>
            842ms parse time
          </div>
          <div style={{
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: 12,
            padding: '16px 32px',
            color: '#60a5fa',
            fontSize: 20
          }}>
            33 confirmed fields
          </div>
          <div style={{
            background: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: 12,
            padding: '16px 32px',
            color: '#a78bfa',
            fontSize: 20
          }}>
            $0.02 per parse
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
