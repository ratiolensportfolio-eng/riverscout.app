import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Cache River (ILLINOIS) — geometry from USGS NHDPlus HR
// 22 points

export const accessPoints: AccessPoint[] = [
  { name: 'Broadwater Boat Ramp', lat: 34.91071, lng: -91.37550, type: 'access', description: 'USFWS' },
  { name: 'Hwy 70 Access -Brassfield Boat Ramp', lat: 34.83113, lng: -91.37647, type: 'access', description: 'AGFC' },
  { name: 'Horseshoe Lake Access', lat: 34.81276, lng: -91.43904, type: 'access', description: 'USFWS' },
  { name: 'Unnamed Boat Ramp', lat: 35.15181, lng: -91.28828, type: 'access', description: 'AGFC' },
  { name: 'Boat Lane Boat Ramp To Cache River', lat: 35.13007, lng: -91.31128, type: 'access', description: 'AGFC' },
  { name: 'Redbud Trailhead', lat: 38.98738, lng: -122.53969, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Buck Island Access', lat: 38.92698, lng: -122.37196, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Cache Creek Upper Day Use Park Site', lat: 38.92305, lng: -122.32769, type: 'access', description: 'Yolo County — restrooms, parking: yes, fee' },
  { name: 'Cache Creek Lower Day Use Park Site', lat: 38.90785, lng: -122.31161, type: 'access', description: 'Yolo County — restrooms, parking: yes, fee' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-88.9844, 37.4027],
  [-88.9856, 37.4011],
  [-88.9836, 37.4007],
  [-88.9859, 37.3996],
  [-88.9818, 37.3993],
  [-88.9827, 37.3971],
  [-88.9827, 37.3971],
  [-88.9815, 37.3967],
  [-88.9799, 37.3993],
  [-88.979, 37.3969],
  [-88.9769, 37.3979],
  [-88.9747, 37.3938],
  [-88.9761, 37.393],
  [-88.9738, 37.3921],
  [-88.9733, 37.3899],
  [-88.9754, 37.3904],
  [-88.9756, 37.3889],
  [-88.9739, 37.3872],
  [-88.9724, 37.3878],
  [-88.968, 37.3817],
  [-88.9651, 37.3819],
  [-88.9651, 37.3819],
]
