// Timeout-safe external API fetcher with retry logic
// CRITICAL: Never let an external API timeout block a page load or hang a request
// Used for: NOAA NWPS, USGS NWIS, NOAA Weather, Anthropic, any third-party API

const DEFAULT_TIMEOUT = 10000 // 10 seconds
const RETRY_DELAY = 2000 // 2 seconds between retries

interface FetchOptions {
  timeoutMs?: number
  retries?: number
  headers?: Record<string, string>
  // When set, opt into Next.js fetch caching with the given revalidation
  // window (in seconds). When omitted, defaults to `cache: 'no-store'` so
  // alert crons / write paths always see fresh data. USGS gauge fetches
  // pass 900 (15 min) here to match upstream update frequency.
  nextRevalidate?: number
}

/**
 * Fetch with hard timeout via AbortController.
 * Returns null on timeout (never throws AbortError to caller).
 */
export async function fetchWithTimeout(
  url: string,
  opts: FetchOptions = {}
): Promise<Response | null> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  // Cache strategy: opt in to Next.js fetch cache when nextRevalidate is set,
  // otherwise force no-store so cron jobs and write paths get fresh data.
  const cacheOpts: RequestInit =
    typeof opts.nextRevalidate === 'number'
      ? { next: { revalidate: opts.nextRevalidate } }
      : { cache: 'no-store' }

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'RiverScout/1.0 (riverscout.app, outfitters@riverscout.app)',
        'Accept': 'application/json',
        ...opts.headers,
      },
      ...cacheOpts,
    })
    clearTimeout(timer)
    return response
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof Error && (err.name === 'AbortError' || err.message.includes('aborted'))) {
      console.warn(`[fetch] Timeout after ${timeoutMs}ms: ${url}`)
      return null
    }
    console.warn(`[fetch] Failed: ${url}`, err instanceof Error ? err.message : err)
    return null
  }
}

/**
 * Fetch JSON with timeout + automatic retry on timeout/failure.
 * Returns null after all retries exhausted — never throws.
 * Caller is guaranteed never to hang regardless of upstream API health.
 */
export async function fetchExternalJson<T = unknown>(
  url: string,
  opts: FetchOptions = {}
): Promise<T | null> {
  const retries = opts.retries ?? 1 // 1 retry = 2 attempts total

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await new Promise(r => setTimeout(r, RETRY_DELAY))
      console.log(`[fetch] Retry attempt ${attempt} for ${url}`)
    }

    const res = await fetchWithTimeout(url, opts)
    if (!res) continue // null = timeout, retry
    if (!res.ok) {
      // Don't retry on 404 — resource doesn't exist
      if (res.status === 404) return null
      continue
    }

    try {
      const json = await res.json()
      return json as T
    } catch {
      continue
    }
  }

  return null
}

// Backward-compat alias
export const fetchNoaaJson = fetchExternalJson
