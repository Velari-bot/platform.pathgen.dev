'use client';
import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface Weapon {
  id: string;
  name: string;
  type: string;
  rarity: string;
  damage: number;
  dps: number;
  fireRate: number;
  magSize: number;
  reloadTime: number;
  structDamage: number;
}

export default function WeaponsList() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('https://fortnite-api.com/v2/weapons');
        if (!res.ok) throw new Error('API down');
        const d = await res.json();
        setWeapons(d.data || []);
      } catch (err) {
        console.warn("Failing back to Chapter 7 Season 2 Sample Weapon Data — API endpoint currently unavailable.");
        setWeapons([
          { id: '1', name: 'Scavenger AR', type: 'AR', rarity: 'Rare', damage: 32, dps: 192, fireRate: 6, magSize: 30, reloadTime: 2.2, structDamage: 32 },
          { id: '2', name: 'Tiptop Shotgun', type: 'Shotgun', rarity: 'Epic', damage: 95, dps: 76, fireRate: 0.8, magSize: 6, reloadTime: 4.1, structDamage: 45 },
          { id: '3', name: 'Rapid SMG', type: 'SMG', rarity: 'Common', damage: 18, dps: 216, fireRate: 12, magSize: 35, reloadTime: 1.8, structDamage: 18 },
          { id: '4', name: 'Silent Sniper', type: 'Sniper', rarity: 'Legendary', damage: 110, dps: 33, fireRate: 0.3, magSize: 1, reloadTime: 3.5, structDamage: 110 },
          { id: '5', name: 'Heavy AR', type: 'AR', rarity: 'Uncommon', damage: 38, dps: 152, fireRate: 4, magSize: 25, reloadTime: 2.6, structDamage: 38 },
          { id: '6', name: 'Burst SMG', type: 'SMG', rarity: 'Rare', damage: 22, dps: 176, fireRate: 8, magSize: 30, reloadTime: 2.1, structDamage: 22 },
        ]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const types = ['All', 'AR', 'Shotgun', 'SMG', 'Sniper', 'Pistol', 'Launcher', 'Melee'];

  const filtered = weapons
    .filter(w => filter === 'All' || w.type === filter)
    .filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.dps - a.dps);

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
         <div style={{ width: '40px', height: '40px', border: '4px solid #f1f5f9', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }}></div>
         <p>Fetching Arsenal from Fortnite-API...</p>
         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)} style={{
              padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontWeight: 600,
              background: filter === t ? 'var(--text-primary)' : 'white',
              color: filter === t ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s'
            }}>{t}</button>
          ))}
        </div>
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" placeholder="Search weapons..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
               {['Name', 'Type', 'Rarity', 'Damage', 'DPS', 'Fire Rate', 'Mag Size', 'Reload', 'Struct'].map(h => (
                 <th key={h} style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }}>{h}</th>
               ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <tr key={w.id} className="table-row-hover" style={{ borderBottom: '1px solid #f8f8f8' }}>
                <td style={{ padding: '16px', fontWeight: 700 }}>{w.name}</td>
                <td style={{ padding: '16px', fontSize: '0.85rem' }}>{w.type}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                    ...getRarityStyles(w.rarity)
                  }}>{w.rarity}</span>
                </td>
                <td style={{ padding: '16px', fontWeight: 600 }}>{w.damage}</td>
                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--accent-primary)' }}>{w.dps}</td>
                <td style={{ padding: '16px' }}>{w.fireRate}/s</td>
                <td style={{ padding: '16px' }}>{w.magSize}</td>
                <td style={{ padding: '16px' }}>{w.reloadTime}s</td>
                <td style={{ padding: '16px' }}>{w.structDamage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getRarityStyles(r: string) {
  const rs = r.toLowerCase();
  if (rs.includes('legendary')) return { background: '#fef3c7', color: '#b45309' };
  if (rs.includes('epic')) return { background: '#f5f3ff', color: '#7c3aed' };
  if (rs.includes('rare')) return { background: '#e0f2fe', color: '#0369a1' };
  if (rs.includes('uncommon')) return { background: '#f0fdf4', color: '#15803d' };
  return { background: '#f1f5f9', color: '#64748b' };
}
