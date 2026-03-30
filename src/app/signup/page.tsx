import type { Metadata } from 'next'
import LandingClient from '../landing-client'

export const metadata: Metadata = {
  title: 'Create Account — Get 100 Free Credits',
  description: 'Create a free Pathgen account and get 100 credits to try the API. No credit card required.',
  alternates: { canonical: 'https://platform.pathgen.dev/signup' }
}

export default function SignupPage() {
  return <LandingClient defaultIsRegistering={true} />
}
