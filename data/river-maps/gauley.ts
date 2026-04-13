import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Gauley River (WV) — geometry from USGS NHDPlus HR
// 58 points, 21/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  { name: 'Summersville Dam Tailwaters', lat: 38.231, lng: -80.868, type: 'put-in', description: 'Upper Gauley put-in below Summersville Dam.' },
  { name: 'Mason\'s Branch', lat: 38.195, lng: -80.908, type: 'access', description: 'Take-out for the Upper Gauley, put-in for the Lower.' },
  { name: 'Peters Creek', lat: 38.17, lng: -80.935, type: 'access', description: 'Mid-Lower Gauley access.' },
  { name: 'Swiss', lat: 38.151, lng: -80.962, type: 'take-out', description: 'Final take-out for the Lower Gauley at the confluence with the New River.' },
]

// River sections
export const sections: RiverSection[] = [
  {
    from: "Summersville Dam",
    to: "Peters Creek",
    miles: 12,
    paddleTime: "4\u20136 hours",
    class: "IV-V",
    notes: "Premier big-water Class V run. Pillow Rock, Lost Paddle, Iron Ring among signature rapids. Dam-release dependent (Sept\u2013Oct Gauley Season).",
  },
  {
    from: "Peters Creek",
    to: "Swiss",
    miles: 13,
    paddleTime: "4\u20135 hours",
    class: "III-IV",
    notes: "Slightly mellower than Upper but still demanding. Pure Screaming Hell and Koontz Flume are highlights.",
  },
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
