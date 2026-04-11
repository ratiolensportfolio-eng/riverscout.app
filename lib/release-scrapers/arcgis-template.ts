// ArcGIS REST FeatureServer adapter template.
//
// This is the proven pattern from lib/dnr-stocking.ts, generalized
// for release scrapers. State agencies that publish recreation
// data on ArcGIS Online (Michigan DNR for stocking, Wisconsin DNR
// for some datasets, several USFS regional offices) can be
// adapted by instantiating createArcgisAdapter() with their
// FeatureServer URL and field map.
//
// To enable: instantiate this for a real source, set enabled:
// true, register the adapter in lib/release-scrapers/index.ts.
//
// Example call site (commented out — fill in real values when
// a source becomes available):
//
//   export const wiDnrReleases = createArcgisAdapter({
//     id: 'wi-dnr-releases',
//     name: 'Wisconsin DNR Whitewater Releases',
//     agency: 'Wisconsin DNR',
//     enabled: false,  // flip to true once endpoint is verified
//     queryUrl: 'https://services.arcgis.com/.../FeatureServer/0/query',
//     fields: {
//       recordId: 'GUID',
//       waterBodyName: 'WATER_BODY',
//       date: 'RELEASE_DATE',  // epoch ms
//       startTime: 'START_TIME',
//       endTime: 'END_TIME',
//       cfs: 'FLOW_CFS',
//       releaseName: 'EVENT_NAME',
//       notes: 'DESCRIPTION',
//     },
//     dateRangeDays: 90,  // pull next 90 days of releases
//   })

import type { ReleaseScraper, RawReleaseEvent } from './types'

interface ArcgisAdapterConfig {
  id: string
  name: string
  agency: string
  enabled: boolean
  queryUrl: string
  fields: {
    recordId: string
    waterBodyName: string
    date: string
    startTime?: string
    endTime?: string
    cfs?: string
    releaseName?: string
    notes?: string
  }
  // How many days forward to pull. Most release schedules
  // publish 60-180 days ahead.
  dateRangeDays: number
}

interface ArcgisFeature {
  attributes: Record<string, string | number | null>
}

interface ArcgisResponse {
  features?: ArcgisFeature[]
  exceededTransferLimit?: boolean
  error?: { code: number; message: string }
}

const PAGE_SIZE = 2000

export function createArcgisAdapter(config: ArcgisAdapterConfig): ReleaseScraper {
  return {
    id: config.id,
    name: config.name,
    agency: config.agency,
    enabled: config.enabled,
    async fetch(): Promise<RawReleaseEvent[]> {
      const features = await fetchArcgisFeatures(config)
      return features.map(f => normalize(f, config)).filter((e): e is RawReleaseEvent => e !== null)
    },
  }
}

async function fetchArcgisFeatures(config: ArcgisAdapterConfig): Promise<ArcgisFeature[]> {
  // Date window — start at today, look forward dateRangeDays
  const today = new Date()
  const yyyy = today.getUTCFullYear()
  const mm = String(today.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(today.getUTCDate()).padStart(2, '0')
  const where = `${config.fields.date} >= DATE '${yyyy}-${mm}-${dd}'`

  const outFields = Object.values(config.fields).filter(Boolean).join(',')
  const out: ArcgisFeature[] = []
  let offset = 0

  for (let pageGuard = 0; pageGuard < 25; pageGuard++) {
    const params = new URLSearchParams({
      where,
      outFields,
      orderByFields: `${config.fields.date} ASC`,
      resultRecordCount: String(PAGE_SIZE),
      resultOffset: String(offset),
      f: 'json',
    })

    const res = await fetch(`${config.queryUrl}?${params.toString()}`, {
      signal: AbortSignal.timeout(30000),
      headers: { 'User-Agent': 'RiverScout/1.0 release-scraper' },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${config.id}`)

    const data = (await res.json()) as ArcgisResponse
    if (data.error) throw new Error(`${config.id} error ${data.error.code}: ${data.error.message}`)

    const page = data.features ?? []
    out.push(...page)
    if (!data.exceededTransferLimit || page.length < PAGE_SIZE) break
    offset += page.length
  }

  return out
}

function normalize(f: ArcgisFeature, config: ArcgisAdapterConfig): RawReleaseEvent | null {
  const a = f.attributes
  const guidRaw = a[config.fields.recordId]
  if (!guidRaw) return null

  const dateRaw = a[config.fields.date]
  if (!dateRaw) return null
  const dateStr = typeof dateRaw === 'number'
    ? new Date(dateRaw).toISOString().slice(0, 10)
    : String(dateRaw).slice(0, 10)

  const waterBody = String(a[config.fields.waterBodyName] ?? '').trim()
  if (!waterBody) return null

  const sourceRecordId = String(guidRaw).replace(/[{}]/g, '').toLowerCase()

  const cfsRaw = config.fields.cfs ? a[config.fields.cfs] : null
  const expectedCfs = typeof cfsRaw === 'number' ? cfsRaw : undefined

  return {
    sourceRecordId,
    waterBodyName: waterBody,
    date: dateStr,
    startTime: config.fields.startTime ? String(a[config.fields.startTime] ?? '') || undefined : undefined,
    endTime: config.fields.endTime ? String(a[config.fields.endTime] ?? '') || undefined : undefined,
    expectedCfs,
    releaseName: config.fields.releaseName ? String(a[config.fields.releaseName] ?? '') || undefined : undefined,
    notes: config.fields.notes ? String(a[config.fields.notes] ?? '') || undefined : undefined,
  }
}
