import type { Metadata } from 'next'
import DocsClient from './docs-client'

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Complete Pathgen API reference. Fortnite replay parsing, player stats, ranked data, AI coaching endpoints. Full request and response examples.',
  alternates: { canonical: 'https://platform.pathgen.dev/docs' }
}

export default function DocsPage() {
  return <DocsClient />
}
