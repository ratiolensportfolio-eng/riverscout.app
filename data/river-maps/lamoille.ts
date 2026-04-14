import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Lamoille River (VERMONT) — geometry from USGS NHDPlus HR
// 18 points

export const accessPoints: AccessPoint[] = [
  { name: 'Watermen Brook Access', lat: 44.61303, lng: -72.66877, type: 'access' },
  { name: 'Dogshead Falls Fishing Access', lat: 44.62200, lng: -72.67765, type: 'access' },
  { name: 'Fairfax Falls Portage Put-in', lat: 44.65144, lng: -72.99144, type: 'access' },
  { name: 'Burts Boats Landing', lat: 44.65222, lng: -72.82734, type: 'access' },
  { name: 'Sloping Falls Access', lat: 44.62794, lng: -72.68126, type: 'access' },
  { name: 'Morrisville Water and Light Dam', lat: 44.56057, lng: -72.60319, type: 'access' },
  { name: 'Morrisville Rotary Access', lat: 44.56696, lng: -72.54994, type: 'access' },
  { name: 'Sandbar State Park', lat: 44.62676, lng: -73.23914, type: 'access' },
  { name: 'Fisher Bridge', lat: 44.53227, lng: -72.42775, type: 'access' },
  { name: 'Elmore Pond Road Bridge Access', lat: 44.55161, lng: -72.47860, type: 'access' },
  { name: 'Route 15A Bridge Access', lat: 44.56419, lng: -72.56604, type: 'access' },
  { name: 'Morriville Oxbow Access', lat: 44.56716, lng: -72.59790, type: 'access' },
  { name: 'Cady\'s Falls Bridge Access', lat: 44.57695, lng: -72.61349, type: 'access' },
  { name: 'Hogback Road Access', lat: 44.64278, lng: -72.71031, type: 'access' },
  { name: 'Dorothy Smith Access', lat: 44.64981, lng: -72.82997, type: 'access' },
  { name: 'Wrong Way Bridge', lat: 44.64807, lng: -72.87217, type: 'access' },
  { name: 'Fairfax Falls Access', lat: 44.65246, lng: -72.99027, type: 'access' },
  { name: 'Willow Crossing', lat: 44.64982, lng: -72.74654, type: 'access' },
  { name: 'Portage Takeout', lat: 44.65015, lng: -72.98922, type: 'access' },
  { name: 'Boyden Valley Farms Access', lat: 44.65288, lng: -72.89123, type: 'access' },
  { name: 'Arrowhead Mountain Lake', lat: 44.68218, lng: -73.08688, type: 'access' },
  { name: 'Clark Falls Portage Takeout', lat: 44.64191, lng: -73.11058, type: 'access' },
  { name: 'Railroad Bridge Access', lat: 44.67970, lng: -73.08342, type: 'access' },
  { name: 'Paddler Takeout', lat: 44.67900, lng: -73.07999, type: 'access' },
  { name: 'Five Chutes Access', lat: 44.68033, lng: -73.07047, type: 'access' },
  { name: 'Informal Access Below Dam', lat: 44.51631, lng: -72.37899, type: 'access' },
  { name: 'Beach Access', lat: 44.66900, lng: -73.02706, type: 'access' },
  { name: 'Lamoille River FW Access', lat: 44.60613, lng: -73.21830, type: 'access' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-72.5874, 44.5656],
  [-72.596, 44.5643],
  [-72.5989, 44.568],
  [-72.6015, 44.5618],
  [-72.6031, 44.561],
  [-72.6047, 44.561],
  [-72.6047, 44.561],
  [-72.6064, 44.5611],
  [-72.6064, 44.5611],
  [-72.6074, 44.5652],
  [-72.6074, 44.5652],
  [-72.6061, 44.5704],
  [-72.6061, 44.5704],
  [-72.611, 44.5732],
  [-72.6109, 44.5742],
  [-72.6098, 44.5766],
  [-72.6116, 44.5777],
  [-72.6116, 44.5777],
]
