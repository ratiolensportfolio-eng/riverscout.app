import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Rappahannock River (VIRGINIA) — geometry from USGS NHDPlus HR
// 14 points

export const accessPoints: AccessPoint[] = [
  { name: 'Wilmont Boat Landing', lat: 38.15518, lng: -77.07112, type: 'access', description: 'Virginia Department of Game & Inland Fisheries — parking: yes' },
  { name: 'Port Royal Canoe/Kayak Landing', lat: 38.16692, lng: -77.18092, type: 'access', description: 'Rappahannock River Valley National Wildlife Refuge — parking: yes' },
  { name: 'Kelly\'s Ford', lat: 38.47699, lng: -77.78080, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Motts Run', lat: 38.31367, lng: -77.54058, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'City Docks', lat: 38.29650, lng: -77.45313, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Carter\'s Wharf', lat: 38.07135, lng: -76.92384, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Simonson Landing', lat: 37.80707, lng: -76.63356, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Saluda', lat: 37.62259, lng: -76.58161, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Mill Creek', lat: 37.58425, lng: -76.42445, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
  { name: 'Hopyard Landing', lat: 38.24428, lng: -77.22581, type: 'access', description: 'Virginia Department of Game and Inland Fisheries' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-77.2951, 38.2269],
  [-77.2932, 38.2239],
  [-77.2906, 38.2236],
  [-77.2906, 38.2236],
  [-77.2793, 38.2248],
  [-77.2762, 38.2292],
  [-77.2757, 38.2349],
  [-77.2757, 38.2349],
  [-77.2759, 38.236],
  [-77.2759, 38.236],
  [-77.2764, 38.2377],
  [-77.2764, 38.2377],
  [-77.2754, 38.2478],
  [-77.2754, 38.2478],
]
