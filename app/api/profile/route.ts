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

  // Get trip reports by this user's email
  const { data: reports } = await supabase
    .from('trip_reports')
    .select('id, river_id, river_name, rating, trip_date, created_at')
    .eq('author_name', profile.display_name)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get approved improvements
  const { data: improvements } = await supabase
    .from('suggestions')
    .select('id, river_id, river_name, field, reviewed_at')
    .eq('user_email', username + '@%') // partial match won't work, need to match by user_id
    .eq('status', 'approved')
    .order('reviewed_at', { ascending: false })
    .limit(20)

  // Try matching improvements by user_id instead
  const { data: improvementsByUid } = await supabase
    .from('suggestions')
    .select('id, river_id, river_name, field, reviewed_at')
    .eq('user_id', profile.id)
    .eq('status', 'approved')
    .order('reviewed_at', { ascending: false })
    .limit(20)

  const allImprovements = (improvementsByUid && improvementsByUid.length > 0) ? improvementsByUid : (improvements || [])

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

  // Count total improvements for badge
  const { count: approvedCount } = await supabase
    .from('suggestions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', profile.id)
    .eq('status', 'approved')

  return NextResponse.json({
    profile,
    reports: reports || [],
    improvements: allImprovements,
    savedRivers,
    stats: {
      approvedImprovements: approvedCount || 0,
      tripReports: reports?.length || 0,
      isContributor: (approvedCount || 0) > 0,
    },
  })
}

// POST /api/profile — save/unsave a river
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, riverId, action } = body

    if (!userId || !riverId || !['save', 'unsave'].includes(action)) {
      return NextResponse.json({ error: 'userId, riverId, and action (save|unsave) required' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    if (action === 'save') {
      const { error } = await supabase
        .from('saved_rivers')
        .upsert({ user_id: userId, river_id: riverId }, { onConflict: 'user_id,river_id' })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      const { error } = await supabase
        .from('saved_rivers')
        .delete()
        .eq('user_id', userId)
        .eq('river_id', riverId)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
