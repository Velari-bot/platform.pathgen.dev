"use client"
import ApiExplorer from '@/components/ApiExplorer';
import CopyButton from '@/components/CopyButton';

export default function ExplorerPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.pathgen.dev";
  return (
    <div className="fade-in" style={{paddingBottom: '80px'}}>
      <div className="page-header" style={{marginBottom: '48px'}}>
        <h1 className="page-title" style={{fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em'}}>API Explorer</h1>
        <p style={{color: 'var(--text-secondary)', fontSize: '1rem'}}>
          Test endpoints in real-time. No API key required for free endpoints.
        </p>
      </div>

      <div className="card" style={{padding: '32px', border: 'none', background: '#F9FAFB', borderRadius: '24px', marginBottom: '40px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 24px', background: 'white', borderRadius: '16px', border: '1px solid #E5E7EB', fontFamily: 'JetBrains Mono', fontSize: '0.95rem'}}>
          <span style={{color: '#6B7280'}}>BASE URL</span>
          <span style={{color: '#111827', fontWeight: 600}}>{baseUrl}</span>
          <div style={{marginLeft: 'auto'}}>
            <CopyButton text={baseUrl} />
          </div>
        </div>
      </div>

      <ApiExplorer />
    </div>
  );
}
