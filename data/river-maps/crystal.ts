import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Crystal River (COLORADO) — geometry from USGS NHDPlus HR
// 25 points

export const accessPoints: AccessPoint[] = [
  { name: 'Dam Site Access', lat: 36.34323, lng: -94.44261, type: 'access', description: 'AGFC' },
  { name: 'Malone Springs Boat Launch', lat: 42.53048, lng: -122.08585, type: 'access', description: 'Fremont-Winema National Forest — restrooms, parking: yes' },
  { name: 'Crystal Lake Public Boat Ramp (Lakeland)', lat: 28.02784, lng: -81.90855, type: 'access', description: 'Polk County — parking: yes' },
  { name: 'Pete\'S Pier Marina (Limited Parking)', lat: 28.89381, lng: -82.59704, type: 'access', description: '  — restrooms, parking: yes, fee' },
  { name: 'Crystal River Watersports', lat: 28.91869, lng: -82.61240, type: 'access', description: '  — restrooms, parking: yes, fee' },
  { name: 'Fort Island Trail Park Public Boat Ramp', lat: 28.90339, lng: -82.63462, type: 'access', description: 'Citrus County — restrooms, parking: yes' },
  { name: 'Fort Island Gulf Beach Public Boat Ramp', lat: 28.91101, lng: -82.69229, type: 'access', description: 'Citrus County — restrooms, parking: yes' },
  { name: 'Kings Bay', lat: 28.89918, lng: -82.59632, type: 'access', description: '  — parking: yes, fee' },
  { name: 'Kings Bay Park Kayak Launch', lat: 28.89696, lng: -82.59581, type: 'access', description: 'City Of Crystal River — restrooms, parking: yes' },
  { name: 'Hunter Springs Park Kayak Launch', lat: 28.89490, lng: -82.59192, type: 'access', description: 'City Of Crystal River — restrooms, parking: yes' },
  { name: 'Crystal River Kayak Company (Kayak Launch Dock)', lat: 28.88483, lng: -82.58458, type: 'access', description: '  — restrooms, parking: yes, fee' },
  { name: 'Crystal Lake Public Boat Ramp (Chipley)', lat: 30.45373, lng: -85.69798, type: 'access', description: 'Washington County — parking: yes' },
  { name: 'Crystal River Preserve Launch', lat: 28.90917, lng: -82.63808, type: 'access', description: 'Florida State Parks — restrooms, parking: yes' },
  { name: 'Twin River Marina Ramp', lat: 28.90355, lng: -82.64115, type: 'access', description: 'Private — parking: yes' },
  { name: 'Crystal Lake', lat: 39.11931, lng: -87.23384, type: 'access', description: 'Indiana Department of Natural Resources' },
  { name: 'Crystal Hills Wildlife Area', lat: 43.22639, lng: -93.75836, type: 'access', description: 'Iowa DNR' },
  { name: 'Crystal Lake', lat: 43.22773, lng: -93.78598, type: 'access', description: 'Iowa DNR' },
  { name: 'Lakeview Terrace', lat: 45.02261, lng: -93.32637, type: 'access', description: 'DNR T&W Region Office 6A — restrooms, parking: yes' },
  { name: 'Crystal Lake Access', lat: 45.38190, lng: -88.92119, type: 'access', description: 'Town of Nashville' },
  { name: 'Crystal Lake Boat Launch', lat: 43.80359, lng: -88.02095, type: 'access', description: 'Planning Dept.' },
  { name: 'Crystal Lake Access', lat: 43.53230, lng: -89.25187, type: 'access', description: ' ' },
  { name: 'Crystal Lake Access', lat: 46.18859, lng: -91.94270, type: 'access', description: 'Town of Wascott' },
  { name: 'Crystal Lake Public Access', lat: 43.28627, lng: -89.61846, type: 'access', description: 'Property Manager' },
  { name: 'Crystal Lake Carry-In', lat: 45.54456, lng: -89.70393, type: 'access', description: 'Town of Bradley' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-107.208, 39.3425],
  [-107.2086, 39.3434],
  [-107.2092, 39.3451],
  [-107.2089, 39.3486],
  [-107.2074, 39.3498],
  [-107.2074, 39.3498],
  [-107.2057, 39.3526],
  [-107.2057, 39.3526],
  [-107.2031, 39.36],
  [-107.2031, 39.36],
  [-107.2025, 39.3649],
  [-107.2025, 39.3681],
  [-107.2025, 39.3681],
  [-107.2025, 39.3673],
  [-107.2025, 39.3681],
  [-107.2025, 39.3681],
  [-107.2007, 39.3732],
  [-107.2026, 39.3756],
  [-107.2026, 39.3756],
  [-107.2046, 39.3772],
  [-107.2045, 39.3826],
  [-107.2066, 39.3846],
  [-107.2066, 39.3846],
  [-107.2103, 39.3871],
  [-107.2103, 39.3871],
]
