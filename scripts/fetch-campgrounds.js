#!/usr/bin/env node
// Bulk-fetch all federal campgrounds from RIDB and insert into
// the campgrounds table. Run once to seed, then weekly via cron
// to pick up new/updated facilities.
//
// Usage: RIDB_API_KEY=xxx node scripts/fetch-campgrounds.js
//
// Requires: RIDB_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const RIDB_BASE = 'https://ridb.recreation.gov/api/v1'
const RIDB_API_KEY = process.env.RIDB_API_KEY

if (!RIDB_API_KEY) {
  console.error('Set RIDB_API_KEY env var. Register free at https://ridb.recreation.gov')
  process.exit(1)
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN',
  'IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV',
  'NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN',
  'TX','UT','VT','VA','WA','WV','WI','WY',
]

async function fetchState(state) {
  const all = []
  let offset = 0
  const limit = 50

  while (true) {
    const url = `${RIDB_BASE}/facilities?state=${state}&activity=CAMPING&limit=${limit}&offset=${offset}&apikey=${RIDB_API_KEY}`
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`  ${state} API error: ${res.status}`)
      break
    }
    const data = await res.json()
    const facilities = data.RECDATA || []
    all.push(...facilities)
    if (facilities.length < limit) break
    offset += limit
    await new Promise(r => setTimeout(r, 250))
  }
  return all
}

function cleanHtml(str) {
  if (!str) return null
  return str.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim().slice(0, 500)
}

async function main() {
  // Dynamic import for supabase
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

  let totalInserted = 0
  let totalErrors = 0
  let totalFetched = 0

  for (const state of STATES) {
    process.stdout.write(`${state}... `)
    const facilities = await fetchState(state)
    totalFetched += facilities.length

    if (facilities.length === 0) {
      console.log('0')
      continue
    }

    const rows = facilities
      .filter(f => f.FacilityLatitude && f.FacilityLongitude)
      .map(f => ({
        id: String(f.FacilityID),
        name: (f.FacilityName || 'Unnamed').trim(),
        description: cleanHtml(f.FacilityDescription),
        lat: f.FacilityLatitude,
        lng: f.FacilityLongitude,
        agency: null,
        parent_name: f.ParentRecAreaName || null,
        reservable: !!f.Reservable,
        reservation_url: f.FacilityReservationURL || null,
        fee_description: cleanHtml(f.FacilityUseFeeDescription),
        phone: f.FacilityPhone || null,
        email: f.FacilityEmail || null,
        state_key: state.toLowerCase(),
        updated_at: new Date().toISOString(),
      }))

    // Batch upsert 100 at a time
    for (let i = 0; i < rows.length; i += 100) {
      const batch = rows.slice(i, i + 100)
      const { error } = await supabase
        .from('campgrounds')
        .upsert(batch, { onConflict: 'id' })
      if (error) {
        totalErrors++
        if (totalErrors <= 5) console.error(`  ${state} insert error:`, error.message)
      } else {
        totalInserted += batch.length
      }
    }

    console.log(rows.length)
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n=== RESULTS ===`)
  console.log(`Fetched: ${totalFetched}`)
  console.log(`Inserted: ${totalInserted}`)
  console.log(`Errors: ${totalErrors}`)
}

main().catch(console.error)
