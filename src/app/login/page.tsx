import type { Metadata } from 'next'
import LandingClient from '../landing-client'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Pathgen account to manage API keys, view usage, and buy credits.',
  robots: { index: false, follow: false }
}

export default function LoginPage() {
  return <LandingClient />
}
