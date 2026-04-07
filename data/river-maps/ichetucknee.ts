import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Ichetucknee River (FL) — geometry from USGS NHDPlus HR
// 22 points, 7/7 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  {
    name: "Headspring",
    lat: 29.9833,
    lng: -82.759,
    type: "put-in",
    description: "Ichetucknee Headspring put-in inside the state park. Crystal-clear 72\u00b0F spring water year-round.",
  },
  {
    name: "Midpoint",
    lat: 29.9777,
    lng: -82.7593,
    type: "access",
    description: "Mid-river access point. Alternate put-in when headspring launch is at capacity.",
  },
  {
    name: "Dampier Landing",
    lat: 29.9591,
    lng: -82.7614,
    type: "take-out",
    description: "Take-out at Dampier Landing. End of the tubing and paddling run through the state park.",
  },
]

// River sections
export const sections: RiverSection[] = [
  {
    from: "Headspring",
    to: "Dampier Landing",
    miles: 6,
    paddleTime: "2\u20133 hours",
    class: "I",
    notes: "Gentle spring-fed float through Ichetucknee Springs State Park. Crystal-clear water, manatees, turtles, and lush vegetation. Popular summer tubing destination.",
  },
]

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-82.759, 29.9833],
  [-82.7587, 29.9833],
  [-82.7587, 29.9833],
  [-82.7588, 29.9801],
  [-82.7588, 29.9801],
  [-82.7593, 29.9777],
  [-82.7593, 29.9777],
  [-82.7597, 29.9715],
  [-82.7597, 29.9715],
  [-82.7614, 29.9663],
  [-82.7614, 29.9663],
  [-82.7622, 29.9644],
  [-82.7729, 29.9591],
  [-82.7792, 29.958],
  [-82.7832, 29.9546],
  [-82.7858, 29.9549],
  [-82.7919, 29.944],
  [-82.7915, 29.9421],
  [-82.7973, 29.9372],
  [-82.7973, 29.9372],
  [-82.8003, 29.9324],
  [-82.8003, 29.9324],
]
