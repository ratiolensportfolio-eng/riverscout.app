import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Swan River (MT) — polyline from National Rivers Project (NRP).
// 41 points, stitched from 1 NRP segments.
// Access points render from Supabase at runtime.

export const accessPoints: AccessPoint[] = [
  { name: 'Somers', lat: 48.07748, lng: -114.23552, type: 'access', description: 'MT FWP FAS. Ramp (Concrete), Dock' },
  { name: 'Sportsmans Bridge', lat: 48.0908, lng: -114.11760000000001, type: 'access', description: 'MT FWP FAS. Ramp (Concrete)' },
  { name: 'Bigfork', lat: 48.060500000000005, lng: -114.07837, type: 'access', description: 'MT FWP FAS. Dock, Ramp (Concrete)' },
  { name: 'Woods Bay', lat: 48.00054, lng: -114.06327, type: 'access', description: 'MT FWP FAS. Dock, Ramp (Concrete)' },
  { name: 'Echo Lake', lat: 48.13062, lng: -114.03798, type: 'access', description: 'MT FWP FAS. Ramp (Concrete), Dock' },
  { name: 'Horseshoe Lake/Ferndale', lat: 48.0217, lng: -113.99758, type: 'access', description: 'MT FWP FAS. Ramp (Gravel), Dock' },
  { name: 'Loon Lake/Ferndale', lat: 48.02623, lng: -113.99097, type: 'access', description: 'MT FWP FAS. Ramp (Gravel)' },
  { name: 'Swan River', lat: 48.04185, lng: -113.97846, type: 'access', description: 'MT FWP FAS. Hand Launch' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-114.0530, 48.0623],
  [-114.0534, 48.0623],
  [-114.0537, 48.0623],
  [-114.0541, 48.0623],
  [-114.0546, 48.0624],
  [-114.0549, 48.0624],
  [-114.0553, 48.0625],
  [-114.0557, 48.0626],
  [-114.0562, 48.0627],
  [-114.0564, 48.0628],
  [-114.0567, 48.0630],
  [-114.0569, 48.0632],
  [-114.0572, 48.0634],
  [-114.0575, 48.0634],
  [-114.0578, 48.0635],
  [-114.0583, 48.0635],
  [-114.0588, 48.0635],
  [-114.0593, 48.0635],
  [-114.0597, 48.0634],
  [-114.0600, 48.0633],
  [-114.0602, 48.0632],
  [-114.0614, 48.0631],
  [-114.0629, 48.0631],
  [-114.0630, 48.0632],
  [-114.0637, 48.0631],
  [-114.0653, 48.0632],
  [-114.0663, 48.0633],
  [-114.0664, 48.0633],
  [-114.0666, 48.0633],
  [-114.0672, 48.0634],
  [-114.0680, 48.0633],
  [-114.0681, 48.0632],
  [-114.0702, 48.0629],
  [-114.0708, 48.0624],
  [-114.0711, 48.0617],
  [-114.0711, 48.0614],
  [-114.0706, 48.0611],
  [-114.0705, 48.0606],
  [-114.0710, 48.0601],
  [-114.0719, 48.0594],
  [-114.0724, 48.0593],
]
