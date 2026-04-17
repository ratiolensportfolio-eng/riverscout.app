import { fetchGaugeData, formatCfs, celsiusToFahrenheit, coldWaterMessage, coldWaterSeverity } from '@/lib/usgs'
import HeroSparkline from '@/components/rivers/HeroSparkline'

// Hidden mockup — not linked from nav/sitemap. Uses Pine River's
// live USGS data but reimagines the page layout. Delete when done.

export const revalidate = 900

const serif = "'Playfair Display', serif"
const mono = "'IBM Plex Mono', monospace"

const COND_STYLES: Record<string, { bg: string; fg: string; border: string }> = {
  optimal: { bg: '#E1F5EE', fg: '#085041', border: '#9FE1CB' },
  low:     { bg: '#EDE9FB', fg: '#533AB7', border: '#C4B5E8' },
  high:    { bg: '#FFF3E0', fg: '#BA7517', border: '#E8C985' },
  flood:   { bg: '#FBE8E8', fg: '#A32D2D', border: '#E8B5B5' },
  loading: { bg: '#F5F5F0', fg: '#999', border: '#ddd' },
}

const COND_LABEL: Record<string, string> = {
  optimal: 'Optimal', low: 'Below Optimal', high: 'Above Optimal', flood: 'Flood Stage', loading: '—',
}

export default async function PuneMockup() {
  const flow = await fetchGaugeData('04125460', '150–350')

  const cond = COND_STYLES[flow.condition] ?? COND_STYLES.loading
  const tempF = flow.tempC != null ? celsiusToFahrenheit(flow.tempC) : null
  const coldMsg = flow.tempC != null ? coldWaterMessage(flow.tempC) : null
  const coldSev = flow.tempC != null ? coldWaterSeverity(flow.tempC) : null

  return (
    <main style={{ minHeight: '100vh', background: '#FAFAF7', color: '#1a1a18' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(165deg, #042C53 0%, #085041 100%)',
        color: '#fff', padding: '32px 28px 24px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontFamily: mono, fontSize: '10px', opacity: 0.5, marginBottom: '12px', letterSpacing: '.5px' }}>
            MICHIGAN › LAKE / OSCEOLA CO.
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            {/* Left: name + meta */}
            <div style={{ flex: '1 1 400px' }}>
              <h1 style={{ fontFamily: serif, fontSize: '36px', fontWeight: 700, margin: '0 0 8px', lineHeight: 1.15 }}>
                Pune River
              </h1>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <Pill>National Wild & Scenic</Pill>
                <Pill>60 mi</Pill>
                <Pill>Class I-II</Pill>
              </div>
              <div style={{ fontFamily: mono, fontSize: '11px', opacity: 0.7 }}>
                Optimal: 150–350 CFS · USGS #04125460
              </div>
            </div>

            {/* Right: CFS hero number */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cond.border, boxShadow: `0 0 8px ${cond.border}` }} />
                <span style={{ fontFamily: serif, fontSize: '56px', fontWeight: 700, lineHeight: 1, color: '#fff' }}>
                  {formatCfs(flow.cfs)}
                </span>
                <span style={{ fontFamily: mono, fontSize: '16px', opacity: 0.6 }}>CFS</span>
              </div>
              {flow.gaugeHeightFt !== null && (
                <div style={{ fontFamily: mono, fontSize: '11px', opacity: 0.5, marginTop: '4px' }}>
                  {flow.gaugeHeightFt.toFixed(2)} ft gauge height
                </div>
              )}
              <div style={{
                display: 'inline-block', marginTop: '8px',
                fontFamily: mono, fontSize: '11px', fontWeight: 600,
                padding: '5px 16px', borderRadius: '20px',
                background: cond.bg, color: cond.fg, border: `1px solid ${cond.border}`,
              }}>
                {COND_LABEL[flow.condition]}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick stats row ──────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '-20px auto 0', padding: '0 28px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}>
          <StatCard label="Rate of change" value={flow.rateLabel || '—'} sub={
            flow.changeIn3Hours != null && Math.abs(flow.changeIn3Hours) >= 25
              ? `${flow.changeIn3Hours > 0 ? '+' : ''}${flow.changeIn3Hours.toLocaleString()} in 3h`
              : undefined
          } />
          <StatCard label="Water temperature" value={tempF != null ? `${tempF}°F` : '—'} sub={coldMsg || undefined}
            alert={coldSev === 'critical' || coldSev === 'warning'} />
          <StatCard label="7-day sparkline" chart>
            <HeroSparkline
              readings={flow.readings}
              optRange="150–350"
              condition={flow.condition}
              gaugeId="04125460"
              currentCfs={flow.cfs}
              avgFlow={226}
            />
          </StatCard>
        </div>
      </section>

      {/* ── Action bar ───────────────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 28px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <ActionButton primary>Save river</ActionButton>
          <ActionButton>Set flow alert</ActionButton>
          <ActionButton>Log a trip</ActionButton>
          <ActionButton>Improve this river</ActionButton>
          <ActionButton danger>Report hazard</ActionButton>
        </div>
      </section>

      {/* ── Tabs (visual only) ───────────────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', gap: '0', borderBottom: '2px solid #e2e1d8' }}>
          <Tab active>Overview</Tab>
          <Tab>History</Tab>
          <Tab>Trip Reports</Tab>
          <Tab>Q&A</Tab>
          <Tab>Maps & Guides</Tab>
          <Tab>Documents</Tab>
        </div>
      </section>

      {/* ── Content area (Overview mock) ─────────────────────────── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px' }}>
          {/* Left: description + stocking */}
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '15px', color: '#333', lineHeight: 1.8, marginBottom: '24px' }}>
              The Pune River is one of Michigan&apos;s most popular paddling rivers, flowing 60 miles through
              the Pere Marquette State Forest. Known for its consistent year-round flow, outstanding
              brown trout fishing, and scenic Class I-II rapids, it draws paddlers, anglers, and families
              from across the Midwest. The upper section from M-37 to Low Bridge is the most popular
              day-trip float — approximately 5 hours at normal water levels.
            </div>

            <ContentCard title="Recent stocking" icon="🐟">
              <div style={{ fontFamily: mono, fontSize: '12px', color: '#333', lineHeight: 1.8 }}>
                <div><strong>Apr 9, 2026</strong> — Brown Trout · 11,295 fingerlings · Kalkaska Co.</div>
                <div><strong>Apr 9, 2026</strong> — Rainbow Trout · 5,195 · Kalkaska Co.</div>
                <div><strong>Mar 22, 2026</strong> — Steelhead · 31,722 · Mason Co.</div>
              </div>
            </ContentCard>

            <ContentCard title="Current weather" icon="🌤">
              <div style={{ fontFamily: mono, fontSize: '12px', color: '#333' }}>
                34°F · Scattered Snow Showers · Wind 12 mph WNW
              </div>
            </ContentCard>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SidebarCard title="Species">
              {['Brown Trout', 'Rainbow Trout', 'Brook Trout', 'Steelhead', 'Chinook Salmon'].map(s => (
                <div key={s} style={{ fontFamily: mono, fontSize: '11px', color: '#555', padding: '4px 0', borderBottom: '.5px solid #eee' }}>{s}</div>
              ))}
            </SidebarCard>

            <SidebarCard title="Hatch calendar">
              <div style={{ fontFamily: mono, fontSize: '11px', color: '#555', lineHeight: 1.8 }}>
                <div>Apr–May: Hendrickson, BWO</div>
                <div>Jun: Hex, Sulphur, Caddis</div>
                <div>Jul–Aug: Tricos, Terrestrials</div>
                <div>Sep–Oct: BWO, Isonychia</div>
              </div>
            </SidebarCard>

            <SidebarCard title="Access points">
              {['M-37 Bridge (put-in)', 'Dobson Bridge', 'Peterson Bridge', 'Low Bridge', 'High Bridge (take-out)'].map(a => (
                <div key={a} style={{ fontFamily: mono, fontSize: '11px', color: '#555', padding: '4px 0', borderBottom: '.5px solid #eee' }}>{a}</div>
              ))}
            </SidebarCard>

            <SidebarCard title="Outfitters">
              <div style={{ fontFamily: mono, fontSize: '11px', color: '#555', lineHeight: 1.8 }}>
                <div style={{ fontWeight: 600 }}>Pine River Paddlesports Center</div>
                <div style={{ color: '#999' }}>Canoe/kayak rental, shuttle service</div>
              </div>
            </SidebarCard>
          </div>
        </div>
      </section>

      {/* ── Footer note ──────────────────────────────────────────── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 28px 40px' }}>
        <div style={{ fontFamily: mono, fontSize: '10px', color: '#aaa', borderTop: '1px solid #e2e1d8', paddingTop: '16px' }}>
          This is a hidden UI mockup — not a real river page. Features shown are illustrative.
          The &quot;Pune River&quot; uses live Pine River USGS data (gauge #04125460).
        </div>
      </div>
    </main>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: mono, fontSize: '9px', padding: '3px 10px', borderRadius: '12px',
      background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)',
      border: '1px solid rgba(255,255,255,0.15)', letterSpacing: '.3px',
    }}>{children}</span>
  )
}

function StatCard({ label, value, sub, alert, chart, children }: {
  label: string; value?: string; sub?: string; alert?: boolean; chart?: boolean; children?: React.ReactNode
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: '12px', padding: chart ? '14px 16px 0' : '16px 20px',
      border: '1px solid #e8e7df', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>{label}</div>
      {chart ? children : (
        <>
          <div style={{ fontFamily: serif, fontSize: '22px', fontWeight: 700, color: alert ? '#A32D2D' : '#042C53' }}>{value}</div>
          {sub && <div style={{ fontFamily: mono, fontSize: '10px', color: alert ? '#A32D2D' : '#999', marginTop: '2px' }}>{sub}</div>}
        </>
      )}
    </div>
  )
}

function ActionButton({ children, primary, danger }: { children: React.ReactNode; primary?: boolean; danger?: boolean }) {
  return (
    <button style={{
      fontFamily: mono, fontSize: '11px', fontWeight: 500,
      padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
      border: primary ? 'none' : danger ? '1px solid #E8B5B5' : '1px solid #d4d3cb',
      background: primary ? '#085041' : danger ? '#FBE8E8' : '#fff',
      color: primary ? '#fff' : danger ? '#A32D2D' : '#555',
      transition: 'opacity .15s',
    }}>{children}</button>
  )
}

function Tab({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div style={{
      fontFamily: mono, fontSize: '12px', fontWeight: active ? 600 : 400,
      padding: '12px 20px', cursor: 'pointer',
      color: active ? '#085041' : '#999',
      borderBottom: active ? '2px solid #085041' : '2px solid transparent',
      marginBottom: '-2px',
    }}>{children}</div>
  )
}

function ContentCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e7df', borderRadius: '12px', padding: '18px 20px', marginBottom: '16px' }}>
      <div style={{ fontFamily: serif, fontSize: '15px', fontWeight: 700, color: '#042C53', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{icon}</span> {title}
      </div>
      {children}
    </div>
  )
}

function SidebarCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e7df', borderRadius: '12px', padding: '16px 18px' }}>
      <div style={{ fontFamily: mono, fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '10px' }}>{title}</div>
      {children}
    </div>
  )
}
