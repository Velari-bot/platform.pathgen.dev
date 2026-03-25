"use client"
import { ChevronDown, Download } from 'lucide-react';

export default function Cost() {
  return (
    <div className="fade-in" style={{paddingBottom: '80px'}}>
      <div className="page-header" style={{marginBottom: '48px'}}>
        <h1 className="page-title" style={{fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em'}}>Usage & Cost</h1>
        
        <div className="filter-bar" style={{marginTop: '32px', gap: '16px'}}>
          <div className="filter-dropdown">
            <span>Group by: <strong>Model</strong></span>
            <ChevronDown size={14} />
          </div>
          <div className="filter-divider" style={{width: '2px', height: '20px', background: 'var(--border-color)', margin: 'auto 8px'}}></div>
          <div className="filter-dropdown">
             <span>API key <strong>All</strong></span>
             <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
             <span>Model <strong>All</strong></span>
             <ChevronDown size={14} />
          </div>
          <div className="filter-dropdown">
             <span>Month to date</span>
             <ChevronDown size={14} />
          </div>
          
          <button className="btn btn-outline" style={{marginLeft: 'auto'}}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="card" style={{background: '#f7f3ed', border: 'none', padding: '16px'}}>
         <p style={{fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
           Showing API usage only. <span style={{color: 'var(--text-secondary)'}}>Select &apos;All workspaces&apos; to include workbench usage.</span>
         </p>
      </div>

      <div className="stats-grid" style={{gap: '24px', marginBottom: '48px'}}>
         <div className="stat-card">
            <span className="stat-title">Monthly spend</span>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto'}}>
              <span className="stat-value">$0.00</span>
              <div style={{padding: '4px 12px', background: '#F4F4F5', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#717171'}}>No spend</div>
            </div>
         </div>
         <div className="stat-card">
            <span className="stat-title">API credits</span>
            <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 'auto'}}>
               <span className="stat-value">9,410</span>
               <span style={{fontSize: '0.85rem', color: '#10B981', fontWeight: 600}}>Active</span>
            </div>
         </div>
         <div className="stat-card">
            <span className="stat-title">Projected monthly cost</span>
            <span className="stat-value" style={{marginTop: 'auto'}}>$0.00</span>
         </div>
      </div>

      <div className="card" style={{height: '400px', display: 'flex', flexDirection: 'column'}}>
         <h3 style={{fontSize: '0.9rem', marginBottom: '24px'}}>Daily token cost</h3>
         <div className="no-data-placeholder" style={{flex: 1}}>
            No data
         </div>
      </div>
    </div>
  );
}
