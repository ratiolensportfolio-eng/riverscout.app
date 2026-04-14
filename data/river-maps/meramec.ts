import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Meramec River (MISSOURI) — geometry from USGS NHDPlus HR
// 29 points

export const accessPoints: AccessPoint[] = [
  { name: 'Redhorse Access', lat: 38.28237, lng: -90.93224, type: 'access' },
  { name: 'River \'Round Conservation Area', lat: 38.35603, lng: -90.87296, type: 'access' },
  { name: 'Sand Ford Access', lat: 38.25246, lng: -91.08067, type: 'access' },
  { name: 'Sand Ford Access', lat: 38.25274, lng: -91.07985, type: 'access' },
  { name: 'Blue Springs Creek Conservation Area', lat: 38.11708, lng: -91.15813, type: 'access' },
  { name: 'Campbell Bridge Access', lat: 38.08186, lng: -91.15013, type: 'access' },
  { name: 'Campbell Bridge Access', lat: 38.08308, lng: -91.14996, type: 'access' },
  { name: 'Riverview Access', lat: 37.99237, lng: -91.42556, type: 'access' },
  { name: 'Sappington Bridge Access', lat: 38.15799, lng: -91.10892, type: 'access' },
  { name: 'Sappington Bridge Access', lat: 38.15831, lng: -91.10906, type: 'access' },
  { name: 'Bird\'s Nest Access (Crawford County)', lat: 37.99667, lng: -91.36055, type: 'access' },
  { name: 'Scotts Ford Access', lat: 37.97802, lng: -91.45674, type: 'access' },
  { name: 'Woodson K. Woods Memorial Conservation Area', lat: 37.95107, lng: -91.50851, type: 'access' },
  { name: 'Pacific Palisades Conservation Area', lat: 38.47710, lng: -90.71528, type: 'access' },
  { name: 'Flamm City Access', lat: 38.41728, lng: -90.34747, type: 'access' },
  { name: 'Allenton Access', lat: 38.47461, lng: -90.66043, type: 'access' },
  { name: 'Meramec Landing (Valley Park)', lat: 38.54629, lng: -90.48443, type: 'access' },
  { name: 'Route 66 State Park Access (MO DNR)', lat: 38.50209, lng: -90.59164, type: 'access' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-91.1626, 38.0738],
  [-91.1562, 38.0721],
  [-91.1518, 38.0744],
  [-91.1518, 38.0744],
  [-91.1513, 38.0748],
  [-91.1513, 38.0748],
  [-91.1501, 38.0809],
  [-91.1501, 38.0809],
  [-91.1501, 38.081],
  [-91.1501, 38.081],
  [-91.1494, 38.0845],
  [-91.1528, 38.0921],
  [-91.1488, 38.094],
  [-91.1399, 38.0932],
  [-91.1399, 38.0932],
  [-91.1377, 38.0953],
  [-91.1376, 38.0989],
  [-91.1391, 38.1004],
  [-91.1453, 38.0999],
  [-91.1487, 38.0969],
  [-91.1529, 38.0967],
  [-91.1554, 38.0992],
  [-91.1554, 38.0992],
  [-91.1573, 38.1055],
  [-91.1568, 38.11],
  [-91.1568, 38.11],
  [-91.1539, 38.1139],
  [-91.1607, 38.121],
  [-91.1607, 38.121],
]
