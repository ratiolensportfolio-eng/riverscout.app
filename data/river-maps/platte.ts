import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Platte River (NEBRASKA) — geometry from USGS NHDPlus HR
// 35 points

export const accessPoints: AccessPoint[] = [
  { name: 'Humphrey Access', lat: 39.33721, lng: -94.81572, type: 'access' },
  { name: 'Platte Falls Conservation Area', lat: 39.38409, lng: -94.77241, type: 'access' },
  { name: 'Platte Falls Conservation Area', lat: 39.38369, lng: -94.76974, type: 'access' },
  { name: 'Sharps Station Access', lat: 39.40045, lng: -94.72300, type: 'access' },
  { name: 'Schimmel City Access', lat: 39.29140, lng: -94.81893, type: 'access' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-98.2799, 40.875],
  [-98.2639, 40.8919],
  [-98.2566, 40.8967],
  [-98.2566, 40.8967],
  [-98.2472, 40.9057],
  [-98.2343, 40.9139],
  [-98.2213, 40.9253],
  [-98.2213, 40.9253],
  [-98.2074, 40.941],
  [-98.1904, 40.9481],
  [-98.1816, 40.9566],
  [-98.1694, 40.9619],
  [-98.1604, 40.9678],
  [-98.1604, 40.9678],
  [-98.1523, 40.9746],
  [-98.1523, 40.9746],
  [-98.151, 40.98],
  [-98.1463, 40.9846],
  [-98.1463, 40.9846],
  [-98.1338, 40.9945],
  [-98.13, 40.9997],
  [-98.1207, 41.0054],
  [-98.1148, 41.0124],
  [-98.1148, 41.0124],
  [-98.109, 41.015],
  [-98.1033, 41.0202],
  [-98.096, 41.0214],
  [-98.087, 41.027],
  [-98.087, 41.027],
  [-98.0833, 41.0284],
  [-98.0833, 41.0284],
  [-98.0719, 41.0321],
  [-98.0623, 41.0379],
  [-98.0499, 41.0412],
  [-98.0499, 41.0412],
]
