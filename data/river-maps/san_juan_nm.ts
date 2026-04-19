import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

export const accessPoints: AccessPoint[] = [
  { name: 'Navajo Dam', lat: 36.8003, lng: -107.6126, type: 'access', description: 'CONFIRMED. C&R only directly below dam. Trophy tailwater begins.' },
  { name: 'Upper Flats / Beaver Flats', lat: 36.8067, lng: -107.61685, type: 'access', description: 'CONFIRMED — 1.25 miles below dam.' },
  { name: 'Texas Hole', lat: 36.813893, lng: -107.669994, type: 'access', description: 'CONFIRMED. Most popular section. Large NM State Park lot.' },
  { name: 'Simon Canyon', lat: 36.832, lng: -107.661, type: 'access', description: 'Less crowded, wade fishing.' },
  { name: 'Cottonwood Campground', lat: 36.856, lng: -107.704, type: 'access-campsite', description: 'Via CR 4280 west of Aztec Bridge.' },
  { name: 'Aztec Bridge boat ramp', lat: 36.87, lng: -107.761, type: 'take-out', description: 'Public parking and boat ramp.' },
]

export const sections: RiverSection[] = [
  { from: 'Navajo Dam', to: 'Texas Hole', miles: 4, paddleTime: '2 hours', class: 'I', notes: 'Quality Waters — flies/artificials only, barbless, C&R' },
  { from: 'Texas Hole', to: 'Aztec Bridge', miles: 5, paddleTime: '3 hours', class: 'I', notes: 'Below Quality Waters — bait allowed' },
]

export const riverPath: [number, number][] = []
