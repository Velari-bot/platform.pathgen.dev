"use client"
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { usePathname } from 'next/navigation';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Check if it's an outer page (landing, pricing, docs, etc.)
  // The original code only checked for '/'
  const isOuterPage = pathname === '/' || 
                      pathname === '/pricing' || 
                      pathname === '/docs' || 
                      pathname === '/status' || 
                      pathname === '/signup' || 
                      pathname === '/login' || 
                      pathname === '/privacy' || 
                      pathname === '/terms' || 
                      pathname === '/usage-policy' || 
                      pathname?.startsWith('/docs/');

  return (
    <div className="app-container" style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {!isOuterPage && <Sidebar />}
      <div className="main-wrapper" style={{ 
          paddingLeft: isOuterPage ? 0 : 'var(--sidebar-width)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
      }}>
        {!isOuterPage && <Header />}
        <main className="content-area" style={{ 
            padding: isOuterPage ? 0 : '40px 64px',
            maxWidth: isOuterPage ? 'none' : '1400px',
            width: '100%',
            margin: isOuterPage ? 0 : '0 auto',
            flex: 1
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
