import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Big Sioux River (SOUTH DAKOTA) — geometry from USGS NHDPlus HR
// 18 points

export const accessPoints: AccessPoint[] = [
  { name: 'Big Sioux Park Access', lat: 42.85105, lng: -96.54365, type: 'access', description: 'Plymouth CCB' },
  { name: 'Big Sioux River Complex', lat: 43.30649, lng: -96.52678, type: 'access', description: 'Iowa DNR' },
  { name: 'Big Sioux Wildlife Area - Highway 18 Bridge', lat: 43.30662, lng: -96.52746, type: 'access', description: 'Iowa DNR' },
  { name: 'Canton, South Dakota', lat: 43.29632, lng: -96.58854, type: 'access', description: 'SD DNR' },
  { name: 'Carr\'S Landing', lat: 43.01069, lng: -96.49190, type: 'access', description: 'City of Hawarden' },
  { name: 'Millsite Access', lat: 42.76127, lng: -96.63162, type: 'access', description: 'Plymouth CCB' },
  { name: 'Oak Grove State Park', lat: 43.06188, lng: -96.47088, type: 'access', description: 'Iowa DNR — restrooms' },
  { name: 'Oakridge Public Water Access', lat: 43.17039, lng: -96.46919, type: 'access', description: 'SD DNR' },
  { name: 'Settlers Canoe Access', lat: 43.22363, lng: -96.49063, type: 'access', description: 'Sioux CCB' },
  { name: 'Silver Mapple Access', lat: 42.79339, lng: -96.59420, type: 'access', description: 'Plymouth CCB' },
  { name: 'Birkleys Bend', lat: 42.66189, lng: -96.54467, type: 'access', description: 'Iowa DNR' },
  { name: 'E.C. Lippke Wetland', lat: 42.70802, lng: -96.62366, type: 'access', description: 'Plymouth CCB' },
  { name: 'Gitchie Manitou', lat: 43.49157, lng: -96.58715, type: 'access', description: 'Iowa DNR' },
  { name: 'Groth Tract - Big Sioux Wildlife Area', lat: 43.18303, lng: -96.46510, type: 'access', description: 'Iowa DNR' },
  { name: 'Klondike River Access', lat: 43.38571, lng: -96.52116, type: 'access', description: 'Lyon CCB' },
  { name: 'Long\'S Bridge Access', lat: 43.44971, lng: -96.60392, type: 'access', description: 'SD DNR' },
  { name: 'Newton Hills State Park Bridge (A50)', lat: 43.28135, lng: -96.57785, type: 'access', description: 'SD DNR — restrooms' },
  { name: 'Riverside Park (Sioux City Access)', lat: 42.49368, lng: -96.47699, type: 'access', description: 'Sioux City — restrooms' },
  { name: 'Rock Sioux Access', lat: 43.08230, lng: -96.45311, type: 'access', description: 'Iowa DNR' },
  { name: 'Stone State Park', lat: 42.54973, lng: -96.47676, type: 'access', description: 'Iowa DNR' },
  { name: 'Groth Tract - Big Sioux Wildlife Area', lat: 43.18303, lng: -96.46510, type: 'access', description: 'Iowa DNR' },
  { name: 'Hoogendorn Tract - Big Sioux Wildlife Area', lat: 43.17216, lng: -96.46490, type: 'access', description: 'Iowa DNR' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-96.7491, 43.6488],
  [-96.7519, 43.6459],
  [-96.7529, 43.6417],
  [-96.7483, 43.6384],
  [-96.7473, 43.6345],
  [-96.7483, 43.6333],
  [-96.7465, 43.6296],
  [-96.751, 43.6245],
  [-96.7496, 43.6227],
  [-96.7508, 43.6213],
  [-96.7456, 43.6162],
  [-96.7469, 43.6145],
  [-96.7447, 43.6103],
  [-96.7457, 43.6056],
  [-96.7407, 43.6044],
  [-96.7401, 43.6007],
  [-96.7433, 43.5989],
  [-96.7433, 43.5989],
]
