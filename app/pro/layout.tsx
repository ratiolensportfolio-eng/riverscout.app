import { notFound } from 'next/navigation'
import { SHOW_PRO_TIER } from '@/lib/features'

// Gate the entire /pro subtree behind the SHOW_PRO_TIER feature flag.
// Hides /pro and /pro/success without deleting the page code, so flipping
// the env var back to true restores the upgrade flow instantly.

export default function ProLayout({ children }: { children: React.ReactNode }) {
  if (!SHOW_PRO_TIER) notFound()
  return <>{children}</>
}
