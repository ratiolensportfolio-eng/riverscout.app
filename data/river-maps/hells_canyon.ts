import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Snake River — Hells Canyon (IDAHO) — geometry from USGS NHDPlus HR
// 6 points

export const accessPoints: AccessPoint[] = [
  { name: 'Snake Creek Canal ( C-9 ) At Highway 441', lat: 25.95999, lng: -80.20490, type: 'access', description: 'South Florida Water Management District — parking: yes' },
  { name: 'Hells Canyon Creek', lat: 45.25389, lng: -116.69632, type: 'access', description: 'Wallowa-Whitman National Forest — restrooms, parking: overnight, fee' },
  { name: 'Pittsburg Landing', lat: 45.63248, lng: -116.47600, type: 'access', description: 'Wallowa-Whitman National Forest — restrooms, parking: overnight, fee' },
  { name: 'Dug Bar', lat: 45.80444, lng: -116.68628, type: 'access', description: 'Wallowa-Whitman National Forest — restrooms, parking: overnight' },
  { name: 'Warm Slough Boat Ramp (Mainstem)', lat: 43.87059, lng: -111.86451, type: 'access', description: 'IDFG — restrooms, parking: yes' },
  { name: 'Warm Slough Boat Ramp (Warm Slough)', lat: 43.87167, lng: -111.86806, type: 'access', description: 'IDFG — restrooms, parking: yes' },
  { name: 'Red Road Bridge Boat Access', lat: 43.92738, lng: -111.77847, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Trestle Bridge', lat: 43.94977, lng: -111.71740, type: 'access', description: 'BLM — parking: yes' },
  { name: 'Hibbard Bridge Access', lat: 43.88754, lng: -111.84914, type: 'access', description: 'BLM — parking: yes' },
  { name: 'Beaver Dick Park ', lat: 43.82510, lng: -111.90526, type: 'access', description: 'Madison County — restrooms, parking: yes' },
  { name: 'Upper Coffeepot', lat: 44.49151, lng: -111.36604, type: 'access', description: 'USFS — restrooms, parking: yes, fee' },
  { name: 'McCrea Bridge', lat: 44.46142, lng: -111.40163, type: 'access', description: 'USFS — restrooms, parking: yes, fee' },
  { name: 'Buttermilk', lat: 44.42829, lng: -111.42394, type: 'access', description: 'USFS — restrooms, parking: yes, fee' },
  { name: 'Box Canyon Boating Ramp', lat: 44.41641, lng: -111.39518, type: 'access', description: 'USFS — restrooms, parking: yes' },
  { name: 'Riverside Park', lat: 44.26677, lng: -111.45618, type: 'access', description: 'USFS — restrooms, parking: yes, fee' },
  { name: 'East Hatchery Ford Boating Site', lat: 44.21688, lng: -111.43150, type: 'access', description: 'USFS — parking: yes' },
  { name: 'Grandview', lat: 44.16838, lng: -111.31747, type: 'access', description: 'USFS — fee' },
  { name: 'Ashton Reservoir Boat Access', lat: 44.11123, lng: -111.45627, type: 'access', description: 'Fremont County — restrooms, parking: yes' },
  { name: 'Ora Bridge Boat Access', lat: 44.06994, lng: -111.51048, type: 'access', description: 'Fremont County — restrooms, parking: yes' },
  { name: 'Vernon Bridge Boat Access', lat: 44.05157, lng: -111.54085, type: 'access', description: 'Fremont County — restrooms, parking: yes' },
  { name: 'Chester Dam Take-Out', lat: 44.01814, lng: -111.58244, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Chester Dam Put-In', lat: 44.01737, lng: -111.58428, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Fun Farm Bridge', lat: 43.98286, lng: -111.62395, type: 'access', description: 'restrooms, parking: yes' },
  { name: 'Pipeline Campground Boat Ramp', lat: 42.74234, lng: -112.89965, type: 'access', description: 'BLM — restrooms, parking: yes' },
  { name: 'Blackfoot Launch', lat: 43.19636, lng: -112.38038, type: 'access', description: 'parking: yes' },
  { name: 'Ferry Butte Access', lat: 43.12683, lng: -112.51567, type: 'access', description: 'Idaho Fish and Game — restrooms, parking: yes' },
  { name: 'Heller Bar', lat: 46.08600, lng: -116.98292, type: 'access', description: 'WDFW — restrooms, parking: overnight, fee' },
  { name: 'Jackson Lake Dam', lat: 43.85837, lng: -110.58645, type: 'access', description: 'parking: yes, fee' },
  { name: 'Cattleman\'s Bridge', lat: 43.85676, lng: -110.55326, type: 'access', description: 'parking: yes, fee' },
  { name: 'Pacific Creek Landing', lat: 43.84589, lng: -110.51779, type: 'access', description: 'parking: yes, fee' },
  { name: 'Deadmans Bar', lat: 43.76054, lng: -110.62710, type: 'access', description: 'parking: yes, fee' },
  { name: 'Moose Landing', lat: 43.65713, lng: -110.71383, type: 'access', description: 'restrooms, parking: yes, fee' },
  { name: 'Southgate Launch', lat: 44.13335, lng: -110.66521, type: 'access', description: 'parking: yes, fee' },
  { name: 'Flagg Ranch', lat: 44.09988, lng: -110.66769, type: 'access', description: 'parking: yes, fee' },
  { name: 'Taco Hole River Access Point', lat: 43.20406, lng: -110.85151, type: 'access', description: 'Bridger-Teton National Forest — parking: yes' },
  { name: 'Lunch Counter River Access Point', lat: 43.19640, lng: -110.91771, type: 'access', description: 'Bridger-Teton National Forest — restrooms, parking: yes' },
  { name: 'West Table Boat Ramp', lat: 43.20463, lng: -110.82142, type: 'access', description: 'Bridger-Teton National Forest — restrooms, parking: yes' },
  { name: 'Kahuna River Access Point', lat: 43.19485, lng: -110.91519, type: 'access', description: 'Bridger-Teton National Forest — restrooms, parking: yes' },
  { name: 'South Park Boat Ramp', lat: 43.38319, lng: -110.74208, type: 'access', description: 'Teton County — restrooms, parking: yes' },
  { name: 'Astoria Boat Ramp', lat: 43.30143, lng: -110.77529, type: 'access', description: 'Bridger-Teton National Forest — restrooms, parking: yes' },
  { name: 'East Table River Access', lat: 43.21087, lng: -110.81057, type: 'access', description: 'Bridger-Teton National Forest — parking: yes' },
  { name: 'Elbow Boat Ramp', lat: 43.21326, lng: -110.78945, type: 'access', description: 'Bridger-Teton National Forest — restrooms, parking: yes' },
  { name: 'Kings Wave River Access Point', lat: 43.30992, lng: -110.74500, type: 'access', description: 'Bridger-Teton National Forest — parking: yes' },
  { name: 'Pritchard Boat Ramp', lat: 43.29167, lng: -110.79089, type: 'access', description: 'Bridger-Teton National Forest — restrooms, parking: yes' },
  { name: 'Sheep Gulch Boat Ramp', lat: 43.18593, lng: -110.95483, type: 'access', description: 'Bridger-Teton National Forest — restrooms, parking: yes' },
  { name: 'Swinging Bridge River Access', lat: 43.37166, lng: -110.73773, type: 'access', description: 'Bridger-Teton National Forest — parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-116.7432, 45.129],
  [-116.7359, 45.1345],
  [-116.7338, 45.1383],
  [-116.7336, 45.1386],
  [-116.7296, 45.1419],
  [-116.7296, 45.1419],
]
