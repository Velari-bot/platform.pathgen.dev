import type { Metadata } from 'next'
import StatusClient from './status-client'

export const metadata: Metadata = {
  title: 'API Status — Live System Health',
  description: 'Real-time status of all Pathgen API components. Parser uptime, database latency, storage health, and incident history.',
  alternates: { canonical: 'https://platform.pathgen.dev/status' }
}

export default function StatusPage() {
  return <StatusClient />
}
