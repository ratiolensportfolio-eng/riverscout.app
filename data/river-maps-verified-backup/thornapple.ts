import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Thornapple River (MICHIGAN) — geometry from USGS NHDPlus HR
// 28 points

export const accessPoints: AccessPoint[] = [
  { name: 'Middleville', lat: 42.71057668977278, lng: -85.46523373050076, type: 'access', description: 'MI DNR Boat Launch. Carry-in. Parking: 5.' },
  { name: 'Irving Road', lat: 42.68935216927868, lng: -85.42513250372303, type: 'access', description: 'MI DNR Boat Launch. Carry-in. Parking: 5.' },
  { name: 'Airport Road', lat: 42.661865173851524, lng: -85.35587625244462, type: 'access', description: 'MI DNR Boat Launch. Carry-in. Parking: 10.' },
  { name: 'Thornapple Lake Road', lat: 42.624075999845836, lng: -85.14586399982686, type: 'access', description: 'MI DNR Boat Launch. Improved ramp.' },
  { name: 'M-66', lat: 42.60768799955086, lng: -85.09425500008429, type: 'access', description: 'MI DNR Boat Launch. Improved ramp.' },
  { name: 'Reed Street', lat: 42.61092000023253, lng: -85.07562199992512, type: 'access', description: 'MI DNR Boat Launch. Improved ramp.' },
  { name: 'Mason Road', lat: 42.61608200055597, lng: -85.05754399942265, type: 'access', description: 'MI DNR Boat Launch. Carry-in.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-85.1462, 42.6238],
  [-85.1485, 42.626],
  [-85.1496, 42.6254],
  [-85.15, 42.627],
  [-85.1528, 42.6271],
  [-85.1528, 42.6271],
  [-85.1525, 42.6284],
  [-85.1547, 42.6296],
  [-85.1563, 42.6285],
  [-85.1563, 42.631],
  [-85.1643, 42.6319],
  [-85.1652, 42.6302],
  [-85.1698, 42.6316],
  [-85.1713, 42.6297],
  [-85.1745, 42.6294],
  [-85.1778, 42.6297],
  [-85.1792, 42.629],
  [-85.183, 42.6271],
  [-85.191, 42.6246],
  [-85.191, 42.6246],
  [-85.1923, 42.6229],
  [-85.1907, 42.6201],
  [-85.1928, 42.6166],
  [-85.1961, 42.6156],
  [-85.1961, 42.6156],
  [-85.1993, 42.6168],
  [-85.2115, 42.6163],
  [-85.2115, 42.6163],
]
