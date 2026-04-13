import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Buffalo River (AR) — geometry from USGS NHDPlus HR
// 39 points, 14/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  { name: 'Ponca Access', lat: 35.971, lng: -93.364, type: 'put-in', description: 'NPS access at the start of the upper Buffalo.' },
  { name: 'Steel Creek', lat: 35.955, lng: -93.327, type: 'campsite', description: 'NPS campground and access.' },
  { name: 'Kyles Landing', lat: 35.94, lng: -93.292, type: 'take-out', description: 'NPS access in the heart of the upper canyon.' },
]

// River sections
export const sections: RiverSection[] = [
  {
    from: "Boxley",
    to: "Pruitt (Hwy 7)",
    miles: 25,
    paddleTime: "1\u20132 days",
    class: "I-III",
    notes: "Upper Buffalo \u2014 the most scenic stretch with towering bluffs. Steel Creek and Kyles Landing make good lunch stops. Class III water requires adequate flow.",
  },
  {
    from: "Pruitt (Hwy 7)",
    to: "Gilbert",
    miles: 30,
    paddleTime: "2\u20133 days",
    class: "I-II",
    notes: "Middle Buffalo through the Ozark backcountry. Easier water, great multi-day camping. Gravel bars for camping throughout.",
  },
  {
    from: "Gilbert",
    to: "Rush",
    miles: 20,
    paddleTime: "1\u20132 days",
    class: "I",
    notes: "Lower Buffalo \u2014 flatwater float through wide valley. Easy paddling suitable for beginners. Rush historic district worth exploring.",
  },
]

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-92.7522, 35.9819],
  [-92.752, 35.9818],
  [-92.752, 35.9818],
  [-92.7502, 35.982],
  [-92.7463, 35.9839],
  [-92.7426, 35.9864],
  [-92.7374, 35.9847],
  [-92.7374, 35.9847],
  [-92.7341, 35.9853],
  [-92.7332, 35.9884],
  [-92.7406, 35.9887],
  [-92.742, 35.991],
  [-92.7379, 35.997],
  [-92.7356, 35.9979],
  [-92.729, 35.9958],
  [-92.729, 35.9868],
  [-92.7252, 35.9848],
  [-92.7252, 35.9848],
  [-92.7182, 35.9849],
  [-92.7182, 35.9849],
  [-92.717, 35.9849],
  [-92.717, 35.9849],
  [-92.7106, 35.9922],
  [-92.7062, 35.9946],
  [-92.704, 35.9957],
  [-92.7027, 35.9965],
  [-92.7027, 35.9965],
  [-92.6999, 35.9972],
  [-92.6999, 35.9972],
  [-92.6983, 35.9976],
  [-92.6955, 35.9973],
  [-92.6952, 35.9972],
  [-92.6952, 35.9972],
  [-92.6932, 35.9976],
  [-92.6895, 35.9997],
  [-92.6893, 36.0001],
  [-92.6893, 36.0001],
  [-92.6892, 36.0007],
  [-92.6892, 36.0007],
]
