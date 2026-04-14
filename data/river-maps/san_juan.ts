import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// San Juan River (UTAH) — geometry from USGS NHDPlus HR
// 40 points

export const accessPoints: AccessPoint[] = [
  { name: 'Montezuma Creek Access
', lat: 37.25788, lng: -109.31055, type: 'access', description: 'Navajo Nation
 — parking: no
' },
  { name: 'Sand Island Recreation Area
', lat: 37.26149, lng: -109.61254, type: 'access', description: 'BLM, Monticello Field Office
 — restrooms, parking: yes, fee' },
  { name: 'Mexican Hat Boat Ramp
', lat: 37.14706, lng: -109.85382, type: 'access', description: 'BLM, Monticello Field Office
 — restrooms, parking: yes, fee' },
  { name: 'Clay Hills Boat Ramp
', lat: 37.29337, lng: -110.39928, type: 'access', description: 'BLM, Monticello Field Office
 — restrooms, parking: yes, fee' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-109.7235, 37.1933],
  [-109.7246, 37.1919],
  [-109.7246, 37.1919],
  [-109.725, 37.1917],
  [-109.725, 37.1917],
  [-109.7288, 37.1911],
  [-109.7288, 37.1911],
  [-109.7335, 37.1936],
  [-109.7339, 37.1988],
  [-109.7397, 37.1955],
  [-109.7429, 37.1963],
  [-109.7425, 37.199],
  [-109.7386, 37.2013],
  [-109.7397, 37.2054],
  [-109.74, 37.2057],
  [-109.7405, 37.2066],
  [-109.7408, 37.2071],
  [-109.7474, 37.2153],
  [-109.7474, 37.2153],
  [-109.75, 37.2145],
  [-109.7513, 37.21],
  [-109.7513, 37.21],
  [-109.7524, 37.2042],
  [-109.7564, 37.2025],
  [-109.7634, 37.2025],
  [-109.7653, 37.1983],
  [-109.7688, 37.1955],
  [-109.7711, 37.1891],
  [-109.77, 37.1875],
  [-109.7647, 37.1862],
  [-109.7661, 37.182],
  [-109.7731, 37.1814],
  [-109.7795, 37.1853],
  [-109.7843, 37.1836],
  [-109.7854, 37.1843],
  [-109.7854, 37.1851],
  [-109.7852, 37.1858],
  [-109.7868, 37.1892],
  [-109.797, 37.1902],
  [-109.797, 37.1902],
]
