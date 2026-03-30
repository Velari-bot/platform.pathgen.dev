import type { Metadata } from 'next'
import QuickstartClient from './quickstart-client'

export const metadata: Metadata = {
  title: 'Quickstart Guide — First API Call in 5 Minutes',
  description: 'Get from zero to your first Fortnite replay parse in under 5 minutes. Sign up, get your API key, make your first request. JavaScript and curl examples.',
  alternates: { canonical: 'https://platform.pathgen.dev/docs/quickstart' }
}

export default function QuickstartPage() {
  return <QuickstartClient />
}
