// Server route for /search. Fetches the permitted-river-ID set once
// at request time so the client component can render PERMIT badges
// without per-row queries. Revalidate matches the rest of the live
// surfaces (15 min) so a newly-added permit row appears within the
// same window as a USGS gauge update.

import { fetchPermittedRiverIds } from '@/lib/permits'
import SearchClient from './SearchClient'

export const revalidate = 900

export default async function SearchPage() {
  const permitted = await fetchPermittedRiverIds()
  return <SearchClient permittedRiverIds={Array.from(permitted)} />
}
