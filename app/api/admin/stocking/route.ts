import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { sendEmail, stockingAlertEmail, ADMIN_EMAIL } from '@/lib/email'
import { getRiver, getStateSlug, getRiverSlug } from '@/data/rivers'
import { fetchGaugeData } from '@/lib/usgs'

// Admin write path — never cache. The fetchGaugeData call inside still uses
// lib/usgs.ts's 15-min fetch cache.
export const dynamic = 'force-dynamic'

// Known state DNR domains for auto-verification
const GOV_DOMAINS = [
  '.gov', '.state.mi.us', '.state.pa.us', '.state.wv.us', '.state.va.us',
  '.state.nc.us', '.state.tn.us', '.state.co.us', '.state.ca.us',
  '.state.wa.us', '.state.or.us', '.state.mt.us', '.state.ky.us',
  '.state.id.us', '.state.az.us',
]

function isGovSource(url: string | null): boolean {
  if (!url) return false
  return GOV_DOMAINS.some(d => url.includes(d))
}

// GET /api/admin/stocking?userId=...&status=unverified|verified|rejected
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const status = req.nextUrl.searchParams.get('status') || 'unverified'

  if (!isAdmin(userId || undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createSupabaseClient()

  let query = supabase
    .from('river_stocking')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status === 'unverified') {
    query = query.eq('verified', false)
  } else if (status === 'verified') {
    query = query.eq('verified', true)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch stocking reports' }, { status: 500 })
  }

  return NextResponse.json({ reports: data || [] })
}

// PATCH /api/admin/stocking — verify or reject a stocking report
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { reportId, userId, action } = body

    if (!isAdmin(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (!reportId || !['verify', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = createSupabaseClient()

    if (action === 'reject') {
      // Soft delete — just remove the row (or mark as rejected via a status field)
      const { error } = await supabase
        .from('river_stocking')
        .delete()
        .eq('id', reportId)

      if (error) {
        return NextResponse.json({ error: 'Failed to reject report' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, action: 'rejected' })
    }

    // Verify — set verified=true
    const { data: report, error: fetchErr } = await supabase
      .from('river_stocking')
      .update({ verified: true })
      .eq('id', reportId)
      .select()
      .single()

    if (fetchErr || !report) {
      return NextResponse.json({ error: 'Failed to verify report' }, { status: 500 })
    }

    // Notify stocking alert subscribers
    if (!report.is_scheduled) {
      try {
        const { data: subscribers } = await supabase
          .from('stocking_alerts')
          .select('*')
          .eq('river_id', report.river_id)
          .eq('active', true)

        if (subscribers && subscribers.length > 0) {
          const river = getRiver(report.river_id)
          let cfs: number | null = null
          let condition = 'loading'
          let optRange = ''

          if (river) {
            try {
              const flow = await fetchGaugeData(river.g, river.opt)
              cfs = flow.cfs
              condition = flow.condition
              optRange = river.opt
            } catch { /* flow fetch failed */ }
          }

          const stateSlug = river ? getStateSlug(river.stateKey) : report.state_key
          const riverSlug = river ? getRiverSlug(river) : report.river_id
          const riverName = river?.n || report.river_id
          const stateName = river?.stateName || report.state_key.toUpperCase()

          for (const sub of subscribers) {
            if (sub.species_filter && sub.species_filter.length > 0) {
              const matches = sub.species_filter.some((f: string) =>
                f.toLowerCase() === 'all species' || report.species.toLowerCase().includes(f.toLowerCase())
              )
              if (!matches) continue
            }

            try {
              await sendEmail({
                to: sub.email,
                subject: `${riverName} was just stocked \u2014 ${report.quantity ? report.quantity.toLocaleString() + ' ' : ''}${report.species}`,
                html: stockingAlertEmail(
                  riverName, stateName, stateSlug, riverSlug,
                  report.species, report.quantity, report.size_category,
                  report.location_description, report.stocking_authority,
                  report.stocking_date, cfs, condition, optRange,
                ),
              })
            } catch (emailErr) {
              console.error('[STOCKING] Subscriber notify failed:', sub.email, emailErr)
            }
          }
        }
      } catch (subErr) {
        console.error('[STOCKING] Subscriber check failed:', subErr)
      }
    }

    return NextResponse.json({ ok: true, action: 'verified', report })
  } catch (err) {
    console.error('Admin stocking error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
