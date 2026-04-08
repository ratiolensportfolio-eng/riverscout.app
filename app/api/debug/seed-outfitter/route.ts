import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

// GET /api/debug/seed-outfitter — seeds Pine River Paddlesports Center as test listing
export async function GET() {
  const supabase = createSupabaseClient()

  // Insert Pine River Paddlesports Center as Sponsored tier on pine_mi and manistee
  const { data, error } = await supabase
    .from('outfitters')
    .upsert({
      id: '00000000-0000-0000-0000-000000000001',
      user_id: 'cd958898-e1da-442d-830b-5767f2e0b5ca',
      business_name: 'Pine River Paddlesports Center',
      description: 'Full-service outfitter on the Pine River since 1996. Canoe, kayak, and tube rentals with shuttle service. Quiet riverside campground. The local experts on the Pine and Manistee rivers.',
      website: 'thepineriver.com',
      phone: '231-862-3471',
      tier: 'sponsored',
      river_ids: ['pine_mi', 'manistee'],
      state_keys: ['mi'],
      specialty_tags: ['Canoe Rental', 'Kayak Rental', 'Shuttles', 'Camping'],
      active: true,
      founding_member: true,
      clicks: 0,
    }, { onConflict: 'id' })

  if (error) {
    return NextResponse.json({ ok: false, error: error.message })
  }

  // Also insert a Guide profile for testing
  const { error: e2 } = await supabase
    .from('outfitters')
    .upsert({
      id: '00000000-0000-0000-0000-000000000002',
      user_id: 'cd958898-e1da-442d-830b-5767f2e0b5ca',
      business_name: 'Captain Mike — Pine River Fly Fishing',
      description: 'Licensed Michigan fly fishing guide specializing in brook trout and brown trout on the Pine River corridor. 20+ years on these waters.',
      website: 'thepineriver.com/guides',
      phone: '231-862-3471',
      tier: 'guide',
      river_ids: ['pine_mi'],
      state_keys: ['mi'],
      specialty_tags: ['Fly Fishing', 'Brook Trout', 'Family Floats'],
      active: true,
      founding_member: true,
      clicks: 0,
    }, { onConflict: 'id' })

  if (e2) {
    return NextResponse.json({ ok: false, error: e2.message })
  }

  // Verify
  const { data: verify } = await supabase
    .from('outfitters')
    .select('id, business_name, tier, active, river_ids')
    .eq('active', true)

  return NextResponse.json({
    ok: true,
    message: 'Seeded Pine River Paddlesports Center (Sponsored) + Captain Mike (Guide)',
    listings: verify,
  })
}
