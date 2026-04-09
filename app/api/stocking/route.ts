import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { sendEmail, stockingAlertEmail, ADMIN_EMAIL } from '@/lib/email'
import { getRiver, getStateSlug, getRiverSlug } from '@/data/rivers'
import { fetchGaugeData } from '@/lib/usgs'

// NOTE: No `revalidate` export. The GET handler reads from Supabase (no USGS),
// and the POST handler is a write path that fires alert emails — both must
// run fresh on every request. The fetchGaugeData call inside POST embeds CFS
// in alert emails and benefits from lib/usgs.ts's underlying 15-min cache.

// GET /api/stocking?riverId=... — fetch stocking events for a river
export async function GET(req: NextRequest) {
  const riverId = req.nextUrl.searchParams.get('riverId')
  if (!riverId) {
    return NextResponse.json({ error: 'riverId required' }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('river_stocking')
    .select('*')
    .eq('river_id', riverId)
    .order('stocking_date', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ events: [] })
  }

  return NextResponse.json({ events: data || [] })
}

// POST /api/stocking — submit a stocking report (authenticated)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      riverId, stateKey, stockingDate, isScheduled, species,
      quantity, sizeCategory, locationDescription,
      stockingAuthority, sourceUrl, userId, autoVerified,
    } = body

    if (!riverId || !stateKey || !stockingDate || !species) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!userId) {
      return NextResponse.json({ error: 'Must be signed in to submit' }, { status: 401 })
    }

    // Auto-verify if source is a .gov or .state.*.us domain
    const isGovSource = sourceUrl && (/\.gov(\/|$)/.test(sourceUrl) || /\.state\.\w+\.us/.test(sourceUrl))
    const verified = !!(autoVerified || isGovSource)

    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('river_stocking')
      .insert({
        river_id: riverId,
        state_key: stateKey,
        stocking_date: stockingDate,
        is_scheduled: isScheduled || false,
        species,
        quantity: quantity || null,
        size_category: sizeCategory || null,
        location_description: locationDescription || null,
        stocking_authority: stockingAuthority || null,
        source_url: sourceUrl || null,
        verified,
        submitted_by: userId,
      })
      .select()

    if (error) {
      console.error('Stocking insert error:', error)
      return NextResponse.json({ error: 'Failed to submit stocking report' }, { status: 500 })
    }

    // Notify admin
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `New stocking report submitted for ${riverId}`,
        html: `
          <h2>Stocking Report Submitted</h2>
          <p><strong>River:</strong> ${riverId} (${stateKey.toUpperCase()})</p>
          <p><strong>Species:</strong> ${species}</p>
          <p><strong>Date:</strong> ${stockingDate}${isScheduled ? ' (scheduled)' : ''}</p>
          ${quantity ? `<p><strong>Quantity:</strong> ${quantity}</p>` : ''}
          ${sizeCategory ? `<p><strong>Size:</strong> ${sizeCategory}</p>` : ''}
          ${locationDescription ? `<p><strong>Location:</strong> ${locationDescription}</p>` : ''}
          ${sourceUrl ? `<p><strong>Source:</strong> <a href="${sourceUrl}">${sourceUrl}</a></p>` : ''}
          <p><strong>Auto-verified:</strong> ${verified ? 'Yes (official source)' : 'No — needs review'}</p>
          <hr/>
          <p><a href="https://riverscout.app/admin/suggestions">Review in Admin Dashboard</a></p>
        `,
      })
    } catch (emailErr) {
      console.error('[STOCKING] Failed to send admin email:', emailErr)
    }

    // Notify stocking alert subscribers for confirmed (non-scheduled) stockings
    if (!isScheduled && verified) {
      try {
        const { data: subscribers } = await supabase
          .from('stocking_alerts')
          .select('*')
          .eq('river_id', riverId)
          .eq('active', true)

        if (subscribers && subscribers.length > 0) {
          const river = getRiver(riverId)
          let cfs: number | null = null
          let condition = 'loading'
          let optRange = ''

          if (river) {
            try {
              const flow = await fetchGaugeData(river.g, river.opt)
              cfs = flow.cfs
              condition = flow.condition
              optRange = river.opt
            } catch { /* flow fetch failed — send without CFS */ }
          }

          const stateSlug = river ? getStateSlug(river.stateKey) : stateKey
          const riverSlug = river ? getRiverSlug(river) : riverId
          const riverName = river?.n || riverId
          const stateName = river?.stateName || stateKey.toUpperCase()

          for (const sub of subscribers) {
            // Check species filter
            if (sub.species_filter && sub.species_filter.length > 0) {
              const matchesFilter = sub.species_filter.some((f: string) =>
                f.toLowerCase() === 'all species' || species.toLowerCase().includes(f.toLowerCase())
              )
              if (!matchesFilter) continue
            }

            try {
              await sendEmail({
                to: sub.email,
                subject: `${riverName} was just stocked \u2014 ${quantity ? quantity.toLocaleString() + ' ' : ''}${species}`,
                html: stockingAlertEmail(
                  riverName, stateName, stateSlug, riverSlug,
                  species, quantity || null, sizeCategory || null,
                  locationDescription || null, stockingAuthority || null,
                  stockingDate, cfs, condition, optRange,
                ),
              })
            } catch (subErr) {
              console.error('[STOCKING] Failed to notify subscriber:', sub.email, subErr)
            }
          }
        }
      } catch (subErr) {
        console.error('[STOCKING] Failed to check subscribers:', subErr)
      }
    }

    return NextResponse.json({ ok: true, event: data?.[0] })
  } catch (err) {
    console.error('Stocking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
