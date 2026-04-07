import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Pine River, Michigan — Access Points (upstream to downstream)
export const accessPoints: AccessPoint[] = [
  {
    name: 'Edgetts Bridge',
    lat: 44.0621,
    lng: -85.5830,
    type: 'put-in',
    description: 'Upper put-in. Parking at Edgetts Lodge. Quieter start, shallow water at low flows.',
  },
  {
    name: 'Lincoln Bridge',
    lat: 44.1328,
    lng: -85.6959,
    type: 'access',
    description: 'USFS access with dirt parking loop. Wide grassy area, easy drop-in. Most popular starting point.',
  },
  {
    name: 'Elm Flats',
    lat: 44.1520,
    lng: -85.7280,
    type: 'access',
    description: 'USFS access point. Sandy landing area. Good for short trips from Lincoln Bridge.',
  },
  {
    name: 'Dobson Bridge',
    lat: 44.1780,
    lng: -85.7650,
    type: 'access',
    description: 'USFS access with small parking area. Mid-river access, popular with fishermen.',
  },
  {
    name: 'Peterson Bridge',
    lat: 44.2070,
    lng: -85.8120,
    type: 'access',
    description: 'USFS campground and access on M-37. North side launch. The section downstream to Low Bridge is the most popular.',
  },
  {
    name: 'Low Bridge',
    lat: 44.2340,
    lng: -85.8520,
    type: 'access',
    description: 'USFS access off Low Bridge Road (FR 5993). The Peterson to Low Bridge run is the classic Pine River trip.',
  },
  {
    name: 'High Bridge',
    lat: 44.2620,
    lng: -85.8850,
    type: 'access',
    description: 'Access point below Low Bridge. River widens and slows through this stretch.',
  },
  {
    name: 'Stronach Dam (Portage)',
    lat: 44.2950,
    lng: -85.9180,
    type: 'portage',
    description: 'Mandatory portage around Stronach Dam. Take out on river right, carry 200 yards.',
  },
  {
    name: 'Tippy Dam Pond / Take-out',
    lat: 44.3100,
    lng: -85.9400,
    type: 'take-out',
    description: 'Final take-out at Tippy Dam backwater. End of the Pine River paddling corridor.',
  },
]

// Pine River Sections with distances and paddle times
export const sections: RiverSection[] = [
  {
    from: 'Edgetts Bridge',
    to: 'Lincoln Bridge',
    miles: 8.5,
    paddleTime: '3–4 hours',
    class: 'I',
    notes: 'Upper Pine River. Narrow, winding, with some log jams that may require maneuvering. Quieter and less crowded than sections downstream. Shallow at flows below 150 CFS.',
  },
  {
    from: 'Lincoln Bridge',
    to: 'Elm Flats',
    miles: 3.5,
    paddleTime: '45 min – 1 hour',
    class: 'I',
    notes: 'Short, easy run. Good warm-up or family float. Sandy banks, a few riffles. Popular starting point for day trips.',
  },
  {
    from: 'Elm Flats',
    to: 'Dobson Bridge',
    miles: 5.0,
    paddleTime: '1.5–2 hours',
    class: 'I',
    notes: 'Swift current through pine and cedar forest. Some tight turns with sweepers — stay alert. Excellent brook trout water.',
  },
  {
    from: 'Dobson Bridge',
    to: 'Peterson Bridge',
    miles: 5.5,
    paddleTime: '2–2.5 hours',
    class: 'I',
    notes: 'Faster water, a few fun riffles. The river picks up pace through this section. Good intermediate section.',
  },
  {
    from: 'Peterson Bridge',
    to: 'Low Bridge',
    miles: 6.0,
    paddleTime: '2–3 hours',
    class: 'I',
    notes: 'The classic Pine River trip. Fastest water on the river, continuous swift current. Most popular section — expect company on summer weekends. This is the run that Pine River Paddlesports Center operates on.',
  },
  {
    from: 'Low Bridge',
    to: 'High Bridge',
    miles: 4.5,
    paddleTime: '1.5–2 hours',
    class: 'I',
    notes: 'River begins to widen and slow. More relaxed paddling, good for families. Fewer paddlers than the Peterson–Low Bridge run.',
  },
  {
    from: 'High Bridge',
    to: 'Stronach Dam',
    miles: 5.0,
    paddleTime: '2–2.5 hours',
    class: 'I',
    notes: 'Wider, slower water approaching Stronach Dam impoundment. Mandatory portage at the dam — take out river right, carry approximately 200 yards.',
  },
]

// Approximate river path polyline [lng, lat] — follows the general course of the Pine River
// These coordinates trace the river from Edgetts Bridge to Tippy Dam
export const riverPath: [number, number][] = [
  [-85.5830, 44.0621],   // Edgetts Bridge
  [-85.5950, 44.0720],
  [-85.6100, 44.0830],
  [-85.6250, 44.0920],
  [-85.6400, 44.1010],
  [-85.6550, 44.1100],
  [-85.6700, 44.1180],
  [-85.6850, 44.1250],
  [-85.6959, 44.1328],   // Lincoln Bridge
  [-85.7050, 44.1380],
  [-85.7150, 44.1440],
  [-85.7280, 44.1520],   // Elm Flats
  [-85.7350, 44.1570],
  [-85.7450, 44.1630],
  [-85.7550, 44.1700],
  [-85.7650, 44.1780],   // Dobson Bridge
  [-85.7750, 44.1850],
  [-85.7850, 44.1920],
  [-85.7950, 44.1980],
  [-85.8050, 44.2030],
  [-85.8120, 44.2070],   // Peterson Bridge
  [-85.8200, 44.2120],
  [-85.8300, 44.2190],
  [-85.8400, 44.2260],
  [-85.8520, 44.2340],   // Low Bridge
  [-85.8600, 44.2400],
  [-85.8700, 44.2480],
  [-85.8780, 44.2550],
  [-85.8850, 44.2620],   // High Bridge
  [-85.8920, 44.2700],
  [-85.9000, 44.2780],
  [-85.9080, 44.2860],
  [-85.9180, 44.2950],   // Stronach Dam
  [-85.9250, 44.3010],
  [-85.9330, 44.3060],
  [-85.9400, 44.3100],   // Tippy Dam
]
