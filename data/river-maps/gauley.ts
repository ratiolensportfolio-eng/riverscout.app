import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Gauley River (WV) — geometry from USGS NHDPlus HR
// 58 points, 21/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  { name: 'Summersville Dam', lat: 38.206149, lng: -81.004208, type: 'access', description: 'CONFIRMED — NPS/Recreation.gov. Upper Gauley Class V. Releases Sept-Oct only.' },
  { name: 'Mason\'s Branch', lat: 38.22, lng: -81.04, type: 'access', description: 'NPS public access, parking, boat launch.' },
  { name: 'Wood\'s Ferry', lat: 38.222, lng: -81.07, type: 'access', description: 'NPS public access.' },
  { name: 'Upper Swiss', lat: 38.229, lng: -81.106, type: 'access', description: 'NPS public access.' },
  { name: 'Bucklick Branch', lat: 38.22682, lng: -81.03062, type: 'access', description: 'CONFIRMED — riverfacts.com GPS. Lower Gauley.' },
  { name: 'Swiss takeout', lat: 38.22905, lng: -81.12605, type: 'take-out', description: 'CONFIRMED — riverfacts.com GPS.' },
]

// River sections
export const sections: RiverSection[] = [
  { from: 'Summersville Dam', to: 'Upper Swiss', miles: 12, paddleTime: '4-5 hours', class: 'V', notes: 'Upper Gauley — expert only. Fall dam releases.' },
  { from: 'Bucklick Branch', to: 'Swiss takeout', miles: 10, paddleTime: '3-4 hours', class: 'III-IV', notes: 'Lower Gauley — intermediate-advanced.' },
]

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-80.6815, 38.2706],
  [-80.6862, 38.274],
  [-80.6934, 38.275],
  [-80.6938, 38.2782],
  [-80.6938, 38.2782],
  [-80.6937, 38.2788],
  [-80.6937, 38.2788],
  [-80.6937, 38.2802],
  [-80.6937, 38.2802],
  [-80.6945, 38.2819],
  [-80.6945, 38.2819],
  [-80.6995, 38.2832],
  [-80.6995, 38.2832],
  [-80.7001, 38.2832],
  [-80.7001, 38.2832],
  [-80.7023, 38.2828],
  [-80.7041, 38.2831],
  [-80.7048, 38.2831],
  [-80.7081, 38.286],
  [-80.7135, 38.2935],
  [-80.7148, 38.3007],
  [-80.7148, 38.3007],
  [-80.7192, 38.3028],
  [-80.7192, 38.3028],
  [-80.724, 38.3006],
  [-80.724, 38.3006],
  [-80.7231, 38.293],
  [-80.7289, 38.2878],
  [-80.7289, 38.2878],
  [-80.738, 38.289],
  [-80.738, 38.289],
  [-80.7457, 38.292],
  [-80.7457, 38.292],
  [-80.7539, 38.2932],
  [-80.7697, 38.2988],
  [-80.7697, 38.2988],
  [-80.7746, 38.2994],
  [-80.7792, 38.2931],
  [-80.7865, 38.2917],
  [-80.7865, 38.2917],
  [-80.7905, 38.2907],
  [-80.7905, 38.2907],
  [-80.7966, 38.2855],
  [-80.7974, 38.285],
  [-80.8017, 38.2843],
  [-80.8081, 38.2861],
  [-80.8112, 38.285],
  [-80.813, 38.2837],
  [-80.8149, 38.2763],
  [-80.8186, 38.2718],
  [-80.8186, 38.2718],
  [-80.8193, 38.2689],
  [-80.8153, 38.264],
  [-80.8153, 38.264],
  [-80.8133, 38.262],
  [-80.8141, 38.2589],
  [-80.8222, 38.2555],
  [-80.8222, 38.2555],
]
