import type { Metadata } from 'next'
import { ALL_RIVERS, STATES, getStateSlug, getRiverSlug } from '@/data/rivers'
import RiversIndexClient, { type IndexedRiver } from './RiversIndexClient'

// Alphabetical index of every river in RiverScout. SSR'd as a static
// list (instant load) and the client component fetches live conditions
// in the background once mounted, so the user gets a scannable A→Z list
// immediately and the condition badges fill in over a few seconds.

const RIVER_COUNT = ALL_RIVERS.length
const STATE_COUNT = Object.keys(STATES).filter(k => k !== 'canada').length

export const metadata: Metadata = {
  title: 'All Rivers — Paddling & Fishing Conditions | RiverScout',
  description: `Browse live conditions for ${RIVER_COUNT} paddling and fishing rivers across ${STATE_COUNT} states. Real-time USGS flow data, optimal CFS, hatch calendars, and trip reports — every river in one searchable index.`,
  alternates: {
    canonical: 'https://riverscout.app/rivers',
  },
  openGraph: {
    title: 'All Rivers — Paddling & Fishing Conditions | RiverScout',
    description: `Browse live conditions for ${RIVER_COUNT} paddling and fishing rivers across ${STATE_COUNT} states.`,
    url: 'https://riverscout.app/rivers',
    siteName: 'RiverScout',
    type: 'website',
  },
}

export default function RiversIndexPage() {
  // Pre-build the lookup the client component needs: name, state,
  // slug-based URL, river_id (for the conditions fetch). Sorted A→Z
  // by river name. Done server-side so the client doesn't have to
  // do this work on first paint.
  const rivers: IndexedRiver[] = ALL_RIVERS
    .map(r => ({
      id: r.id,
      name: r.n,
      stateKey: r.stateKey as string,
      stateName: r.stateName as string,
      stateAbbr: (r as { abbr?: string }).abbr ?? (r.stateKey as string).toUpperCase(),
      url: `/rivers/${getStateSlug(r.stateKey as string)}/${getRiverSlug(r)}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  // Build state list for the filter dropdown — sorted by name so the
  // user can scan it. Includes the count of rivers in each state.
  const stateCounts: Record<string, { name: string; count: number }> = {}
  for (const r of rivers) {
    if (!stateCounts[r.stateKey]) stateCounts[r.stateKey] = { name: r.stateName, count: 0 }
    stateCounts[r.stateKey].count++
  }
  const stateOptions = Object.entries(stateCounts)
    .map(([key, info]) => ({ key, name: info.name, count: info.count }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <RiversIndexClient
      rivers={rivers}
      stateOptions={stateOptions}
      totalRivers={RIVER_COUNT}
      totalStates={STATE_COUNT}
    />
  )
}
