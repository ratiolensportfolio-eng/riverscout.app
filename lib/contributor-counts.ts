// Server-side batched fetcher for contributor counts.
//
// A contributor's "count" is approved suggestions + Q&A answers
// that have at least one helpful mark. The same calculation lives
// in app/account/page.tsx and app/api/profile/route.ts (those
// fetch a single user's count); this file batches the lookup for
// many users at once so the river page Q&A prefetch can decorate
// every visible question/answer with a tier badge in two queries
// instead of N+1.
//
// We resist farming the same way the per-user version does:
//   - Suggestions: count rows where status='approved'
//   - Answers: count rows where status='active' AND helpful_count >= 1
//     (so a junk answer no one finds useful = 0 points, and a
//     great answer with 50 helpfuls = 1 point — quality wins
//     either direction)

import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Fetch the contribution count for each user_id in the input.
 * Returns a map of userId → total contribution points. Missing
 * users (zero contributions) are not included in the map; callers
 * should default to 0.
 *
 * Pass the same supabase client the caller is already using —
 * service-role for SSR fetches, anon for client fetches. Both work
 * because the suggestions and river_answers tables have public
 * SELECT under the right filter conditions.
 *
 * Tolerant of failure: if either query errors, that source
 * contributes 0 to the result rather than throwing. The badge
 * just won't appear, which is the right fallback for a
 * decoration feature.
 */
export async function fetchContributorCounts(
  supabase: SupabaseClient,
  userIds: string[],
): Promise<Record<string, number>> {
  const unique = Array.from(new Set(userIds.filter((id): id is string => !!id)))
  if (unique.length === 0) return {}

  const counts: Record<string, number> = {}

  // 1. Approved suggestions per user_id. We can't use count: 'exact'
  //    + group by in the PostgREST API, so we fetch the user_id
  //    column for matching rows and tally in JS. For a launch-scale
  //    river page (≤ 100 questions × ≤ 5 answers each = ≤ 600 user
  //    rows ≤ a few hundred unique authors) this is fine.
  try {
    const { data: suggestionRows } = await supabase
      .from('suggestions')
      .select('user_id')
      .eq('status', 'approved')
      .in('user_id', unique)

    for (const row of (suggestionRows ?? []) as Array<{ user_id: string | null }>) {
      if (!row.user_id) continue
      counts[row.user_id] = (counts[row.user_id] ?? 0) + 1
    }
  } catch {
    /* swallow — see comment above */
  }

  // 2. Helpful answers per user_id. Same approach.
  try {
    const { data: answerRows } = await supabase
      .from('river_answers')
      .select('user_id')
      .eq('status', 'active')
      .gte('helpful_count', 1)
      .in('user_id', unique)

    for (const row of (answerRows ?? []) as Array<{ user_id: string | null }>) {
      if (!row.user_id) continue
      counts[row.user_id] = (counts[row.user_id] ?? 0) + 1
    }
  } catch {
    /* swallow */
  }

  return counts
}
