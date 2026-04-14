import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Verde River (ARIZONA) — geometry from USGS NHDPlus HR
// 10 points

export const accessPoints: AccessPoint[] = [
  { name: 'Beasley Flat Picnic Site', lat: 34.47651, lng: -111.80071, type: 'access', description: 'Prescott National Forest — restrooms, parking: yes' },
  { name: 'Childs Dispersed Camping Area', lat: 34.34802, lng: -111.69736, type: 'access', description: 'Coconino National Forest — restrooms, parking: overnight' },
  { name: 'Sheep Bridge', lat: 34.07759, lng: -111.70737, type: 'access', description: 'Tonto National Forest — parking: overnight' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-112.0513, 34.8353],
  [-112.0493, 34.8349],
  [-112.0474, 34.8319],
  [-112.0468, 34.8305],
  [-112.0532, 34.8259],
  [-112.0563, 34.8252],
  [-112.059, 34.8243],
  [-112.0643, 34.8255],
  [-112.0653, 34.8238],
  [-112.0653, 34.8238],
]
