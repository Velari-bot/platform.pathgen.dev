"use client"
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { usePathname } from 'next/navigation';
import { AuthProvider } from '../lib/firebase/auth-context';
import { OrgProvider } from '@/lib/context/OrgContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login';
  const isOuterPage = isLandingPage || isLoginPage;

  return (
    <html lang="en">
      <head>
        <title>Pathgen | Universal Replay API</title>
        <meta name="description" content="High-fidelity parsing, analysis, and generation for Fortnite replays." />
      </head>
      <body>
        <AuthProvider>
          <OrgProvider>
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
          </OrgProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
