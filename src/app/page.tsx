import type { Metadata } from 'next'
import LandingClient from './landing-client'

export const metadata: Metadata = {
  title: 'Pathgen — Fortnite Replay API & Match Analytics',
  description: 'The fastest Fortnite replay parser and developer API. Parse match data in under 1 second. AI coaching, player stats, ranked data, and real-time telemetry. Free to start.',
  alternates: { canonical: 'https://platform.pathgen.dev' }
}

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Pathgen",
            "url": "https://platform.pathgen.dev",
            "operatingSystem": "Web",
            "applicationCategory": "DeveloperApplication",
            "description": "High-performance Fortnite replay parser and developer API. Parse match data, access AI coaching, player stats, and ranked data.",
            "featureList": [
              "Fortnite replay file parsing",
              "AI-powered match coaching",
              "Player statistics and ranked data",
              "Real-time game telemetry",
              "FNCS session analysis",
              "Rotation score analysis"
            ],
            "offers": {
              "@type": "Offer",
              "price": "4.99",
              "priceCurrency": "USD",
              "description": "5000 credits starter pack"
            },
            "provider": {
              "@type": "Organization",
              "name": "Pathgen",
              "url": "https://platform.pathgen.dev"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Pathgen",
            "url": "https://platform.pathgen.dev",
            "description": "Fortnite Replay API and Match Analytics Platform",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://platform.pathgen.dev/docs?search={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <LandingClient />
    </>
  )
}
