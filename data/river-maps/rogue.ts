import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Rogue River (OREGON) — geometry from USGS NHDPlus HR
// 34 points

export const accessPoints: AccessPoint[] = [
  { name: 'Whitehorse County Park', lat: 42.43270, lng: -123.45764, type: 'access', description: 'BLM/Josephine County Parks — restrooms, parking: yes, fee' },
  { name: 'Griffin County Park', lat: 42.46305, lng: -123.48560, type: 'access', description: 'BLM/Josephine County Parks — restrooms, parking: yes, fee' },
  { name: 'Robertson Bridge County Park', lat: 42.49495, lng: -123.48662, type: 'access', description: 'Josephine County Parks — restrooms, parking: yes, fee' },
  { name: 'Hog Creek Day Use Area', lat: 42.53982, lng: -123.50114, type: 'access', description: 'BLM/Josephine County Parks — restrooms, parking: yes' },
  { name: 'Indian Mary County Park', lat: 42.55435, lng: -123.54007, type: 'access', description: 'Josephine County Parks — restrooms, parking: yes, fee' },
  { name: 'Ennis Riffle County Park', lat: 42.56353, lng: -123.57764, type: 'access', description: 'BLM/Josephine County Parks — restrooms, parking: yes, fee' },
  { name: 'Galice Boat Ramp', lat: 42.56805, lng: -123.59457, type: 'access', description: 'Josephine County Parks — restrooms, parking: yes, fee' },
  { name: 'Rand Recreation Area', lat: 42.59364, lng: -123.58170, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Almeda County Park', lat: 42.60629, lng: -123.57942, type: 'access', description: 'Josephine County Parks — restrooms, parking: yes, fee' },
  { name: 'Argo Boat Launch', lat: 42.62531, lng: -123.59713, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Grave Creek Boat Launch', lat: 42.65037, lng: -123.58581, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Foster Bar Boating Facility', lat: 42.63233, lng: -124.04926, type: 'access', description: 'USFS — restrooms, parking: overnight' },
  { name: 'Agness Boat Landing', lat: 42.55080, lng: -124.06636, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Quosatana Boat Ramp', lat: 42.49981, lng: -124.23053, type: 'access', description: 'USFS — restrooms, parking: yes' },
  { name: 'Lobster Creek Boat Ramp', lat: 42.50330, lng: -124.29528, type: 'access', description: 'USFS — restrooms, parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-123.7186, 42.6529],
  [-123.7243, 42.6524],
  [-123.7252, 42.6521],
  [-123.7294, 42.6521],
  [-123.7306, 42.6538],
  [-123.7318, 42.6583],
  [-123.7321, 42.6587],
  [-123.7321, 42.6587],
  [-123.7331, 42.6607],
  [-123.7331, 42.6607],
  [-123.7336, 42.6613],
  [-123.7336, 42.6613],
  [-123.734, 42.6626],
  [-123.7337, 42.6655],
  [-123.7335, 42.6663],
  [-123.7335, 42.6663],
  [-123.7336, 42.6669],
  [-123.7336, 42.6669],
  [-123.7338, 42.6682],
  [-123.7349, 42.6716],
  [-123.7352, 42.6738],
  [-123.7352, 42.6738],
  [-123.7354, 42.6742],
  [-123.7358, 42.6757],
  [-123.7367, 42.6782],
  [-123.7374, 42.6825],
  [-123.739, 42.6838],
  [-123.739, 42.6838],
  [-123.7396, 42.6843],
  [-123.7374, 42.6825],
  [-123.7334, 42.6819],
  [-123.7324, 42.6812],
  [-123.7328, 42.6805],
  [-123.7328, 42.6805],
]
