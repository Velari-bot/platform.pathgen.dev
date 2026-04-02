import type { Metadata } from 'next'
import "./globals.css";
import { AuthProvider } from '../lib/firebase/auth-context';
import { OrgProvider } from '../lib/context/OrgContext';
import CloudflareAnalytics from '../components/CloudflareAnalytics';
import LayoutClient from './layout-client';

export const metadata: Metadata = {
  title: {
    default: 'Pathgen — Fortnite Replay API & Match Analytics',
    template: '%s | Pathgen'
  },
  description: 'The fastest Fortnite replay parser and developer API. Parse match data, access AI coaching, player stats, ranked data, and real-time game telemetry. Free to start.',
  keywords: [
    'Fortnite API',
    'Fortnite replay parser',
    'Fortnite match analytics API',
    'Fortnite player stats API',
    'Fortnite developer API',
    'Fortnite replay analysis',
    'Fortnite match history API',
    'Fortnite AI coaching',
    'FNCS analytics',
    'Fortnite rotation score',
    'Fortnite drop analysis',
    'Fortnite building stats',
    'Fortnite accuracy stats',
    'match performance tracker',
    'replay file parser'
  ],
  authors: [{ name: 'Pathgen' }],
  creator: 'Pathgen',
  publisher: 'Pathgen',
  metadataBase: new URL('https://platform.pathgen.dev'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://platform.pathgen.dev',
    siteName: 'Pathgen',
    title: 'Pathgen — Fortnite Replay API & Match Analytics',
    description: 'Parse Fortnite replays, get AI coaching, access player stats and ranked data. The developer API Osirion wishes it was.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pathgen — Fortnite Replay API'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pathgen — Fortnite Replay API',
    description: 'Parse Fortnite replays, get AI coaching, access player stats. Free to start.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  icons: {
    icon: '/Pathgen Platform.png',
    shortcut: '/Pathgen Platform.png',
    apple: '/Pathgen Platform.png',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <OrgProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
          </OrgProvider>
        </AuthProvider>
        <CloudflareAnalytics />
      </body>
    </html>
  );
}
