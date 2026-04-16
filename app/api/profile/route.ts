import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/profile?username=... — fetch public profile data
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')
  const userId = req.nextUrl.searchParams.get('userId') // for saved rivers (private)

  if (!username) {
    return NextResponse.json({ error: 'username required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()

  // Get profile
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, home_state, created_at')
    .eq('username', username)
    .single()

  if (profileErr || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Get verified trip reports + all verified catches + user_profile
  // counters + hazard/access-point badge signals, in parallel.
  // Everything is scoped to profile.id (the auth.users uuid).
  const [
    reportsRes, catchesRes, userProfileRes,
    improvementsRes, hazardsRes, accessPointsRes,
  ] = await Promise.all([
    supabase
      .from('trip_reports')
      .select('id, river_id, trip_date, cfs_at_time, conditions_rating, created_at')
      .eq('user_id', profile.id)
      .eq('status', 'verified')
      .order('trip_date', { ascending: false })
      .limit(100),
    supabase
      .from('fish_catches')
      .select('id, river_id, catch_date, species, weight_lbs, length_inches, photo_url')
      .eq('user_id', profile.id)
      .eq('verification_status', 'verified')
      .order('weight_lbs', { ascending: false, nullsFirst: false })
      .limit(50),
    supabase
      .from('user_profiles')
      .select('total_verified_trips, total_verified_catches, contribution_score')
      .eq('id', profile.id)
      .maybeSingle(),
    supabase
      .from('suggestions')
      .select('id, river_id, river_name, field, reviewed_at')
      .eq('user_id', profile.id)
      .eq('status', 'approved')
      .order('reviewed_at', { ascending: false })
      .limit(20),
    // Badge signals: any hazard reported OR any access point submitted
    // earns the corresponding badge. Count-only, head:true for speed.
    supabase
      .from('river_hazards')
      .select('*', { count: 'exact', head: true })
      .eq('reported_by', profile.id),
    supabase
      .from('river_access_points')
      .select('*', { count: 'exact', head: true })
      .eq('submitted_by', profile.id),
  ])

  const reports = reportsRes.data ?? []
  const catches = catchesRes.data ?? []
  const userProfile = userProfileRes.data ?? {
    total_verified_trips: 0, total_verified_catches: 0, contribution_score: 0,
  }
  const allImprovements = improvementsRes.data ?? []
  const hazardsReported = hazardsRes.count ?? 0
  const accessPointsSubmitted = accessPointsRes.count ?? 0

  // Personal bests — best (heaviest) verified catch per species.
  // Seed with the already-sorted catches list so the first seen row
  // per species wins.
  const personalBests = new Map<string, typeof catches[number]>()
  for (const c of catches) {
    if (!personalBests.has(c.species)) personalBests.set(c.species, c)
  }

  // Trip count breakdown by river — for the "Verified trips" section.
  const tripCountByRiver = new Map<string, number>()
  for (const r of reports) {
    tripCountByRiver.set(r.river_id, (tripCountByRiver.get(r.river_id) ?? 0) + 1)
  }
  const tripsByRiver = Array.from(tripCountByRiver.entries())
    .map(([river_id, count]) => ({ river_id, count }))
    .sort((a, b) => b.count - a.count)

  // Get saved rivers (only if requesting user is the owner)
  let savedRivers: Array<{ river_id: string }> = []
  if (userId === profile.id) {
    const { data: saved } = await supabase
      .from('saved_rivers')
      .select('river_id')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
    savedRivers = saved || []
  }

  // Count total contributions for the badge. The contributor tier
  // is fed by two sources:
  //   1. Approved suggestions (the original system)
  //   2. Q&A answers that have at least one helpful mark
  //
  // Counting answers as "helpful_count >= 1" means a single great
  // answer = 1 point (not 50 if 50 people thank it), AND a junk
  // answer no one finds useful = 0 points. That resists farming
  // both ways.
  const [approvedRes, helpfulAnswersRes] = await Promise.all([
    supabase
      .from('suggestions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'approved'),
    supabase
      .from('river_answers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'active')
      .gte('helpful_count', 1),
  ])
  const approvedCount = approvedRes.count ?? 0
  const helpfulAnswers = helpfulAnswersRes.count ?? 0
  const totalContributions = approvedCount + helpfulAnswers

  // Top-angler badge: user has any top-10 verified catch per species.
  // A single query ordered by species then weight gives us the top 10
  // per species; if this user appears for any species, they earn the
  // badge. Cheap because the species+weight index covers it.
  let isTopAngler = false
  if (userProfile.total_verified_catches > 0) {
    // Check against each species the user has catches in.
    const userSpecies = new Set(catches.map(c => c.species))
    for (const sp of userSpecies) {
      const { data: top10 } = await supabase
        .from('fish_catches')
        .select('user_id')
        .eq('verification_status', 'verified')
        .eq('species', sp)
        .order('weight_lbs', { ascending: false, nullsFirst: false })
        .limit(10)
      if ((top10 ?? []).some(r => r.user_id === profile.id)) {
        isTopAngler = true
        break
      }
    }
  }

  return NextResponse.json({
    profile,
    reports,
    catches: Array.from(personalBests.values()),  // personal best per species
    tripsByRiver,
    improvements: allImprovements,
    savedRivers,
    stats: {
      // approvedImprovements stays named for the contributor-tier UI
      // (it reads this field straight). Semantics = total contribution
      // points. Unchanged from before.
      approvedImprovements: totalContributions,
      tripReports: userProfile.total_verified_trips,
      verifiedCatches: userProfile.total_verified_catches,
      contributionScore: userProfile.contribution_score,
      isContributor: totalContributions > 0,
    },
    badges: {
      hazardReporter: hazardsReported > 0,
      accessPointVerifier: accessPointsSubmitted > 0,
      qaContributor: helpfulAnswers > 0,
      topAngler: isTopAngler,
    },
  })
}

// POST /api/profile — save/unsave a river
//
// Returns { ok: true, firstSave: boolean } where firstSave is true
// only when this save took the user from 0 saved rivers to 1. The
// SaveRiver UI uses that flag to show the digest opt-in prompt at
// the moment of highest intent (per the digest feature spec).
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, riverId, action } = body

    if (!userId || !riverId || !['save', 'unsave'].includes(action)) {
      return NextResponse.json({ error: 'userId, riverId, and action (save|unsave) required' }, { status: 400 })
    }

    // Service role: saved_rivers.user_id is FK-bound to auth.users
    // so the anon write hits the migration-026 error class.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, serviceKey, { auth: { persistSession: false } })

    if (action === 'save') {
      // Count saved rivers BEFORE the insert so we can detect the
      // 0→1 transition. We can't infer this from the upsert response
      // because upsert is idempotent — re-saving the same river
      // shouldn't fire the prompt.
      const { count: beforeCount } = await supabase
        .from('saved_rivers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      const { error } = await supabase
        .from('saved_rivers')
        .upsert({ user_id: userId, river_id: riverId }, { onConflict: 'user_id,river_id' })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // After the upsert, did the user have zero saved rivers and now
      // have one? Only fire firstSave when the upsert actually
      // inserted a new row (not when re-saving the same river).
      const { count: afterCount } = await supabase
        .from('saved_rivers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      const firstSave = (beforeCount ?? 0) === 0 && (afterCount ?? 0) === 1
      return NextResponse.json({ ok: true, firstSave })
    } else {
      const { error } = await supabase
        .from('saved_rivers')
        .delete()
        .eq('user_id', userId)
        .eq('river_id', riverId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, firstSave: false })
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
