import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Niobrara River (NE) — geometry from USGS NHDPlus HR
// 36 points, 14/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  { name: 'Fort Niobrara Launch', lat: 42.90066, lng: -100.48335, type: 'access', description: 'NPS, USFWS — restrooms, parking: overnight, fee' },
  { name: 'Berry Bridge', lat: 42.90210, lng: -100.36260, type: 'access', description: 'restrooms' },
  { name: 'Smith Falls State Park - Nickols Landing', lat: 42.89302, lng: -100.30773, type: 'access', description: 'NPS, NE State Parks — restrooms, parking: overnight, fee' },
  { name: 'Brewer Bridge', lat: 42.87567, lng: -100.26589, type: 'access', description: 'parking: overnight' },
  { name: 'Norden Bridge', lat: 42.78706, lng: -100.03507, type: 'access' },
  { name: 'Meadville Bridge', lat: 42.75222, lng: -99.85139, type: 'access', description: 'restrooms, fee' },
  { name: 'Hwy 7 Bridge', lat: 42.72259, lng: -99.58931, type: 'access' },
  { name: 'Hwy 137 Bridge', lat: 42.78150, lng: -99.33493, type: 'access' },
]

// River sections
export const sections: RiverSection[] = [
  {
    from: "Berry Bridge",
    to: "Rocky Ford",
    miles: 25,
    paddleTime: "5\u20137 hours",
    class: "I-II",
    notes: "Most popular float in Nebraska. Gentle Class I-II current past spring-fed waterfalls and canyon walls. Smith Falls is the highlight \u2014 pull over river-left to hike to the base. Tubes, canoes, and kayaks all work well.",
  },
]

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-100.4547, 42.9081],
  [-100.4533, 42.9091],
  [-100.4533, 42.9091],
  [-100.4517, 42.9091],
  [-100.4519, 42.9061],
  [-100.4506, 42.9051],
  [-100.4465, 42.9077],
  [-100.4418, 42.9075],
  [-100.4418, 42.9075],
  [-100.4363, 42.907],
  [-100.4363, 42.907],
  [-100.4342, 42.9069],
  [-100.4342, 42.9069],
  [-100.4241, 42.9061],
  [-100.4241, 42.9061],
  [-100.4213, 42.9049],
  [-100.4213, 42.9049],
  [-100.4163, 42.9033],
  [-100.4125, 42.9057],
  [-100.4125, 42.9057],
  [-100.4112, 42.9076],
  [-100.4112, 42.9076],
  [-100.4086, 42.9098],
  [-100.3991, 42.9086],
  [-100.3991, 42.9086],
  [-100.3946, 42.9078],
  [-100.3946, 42.9078],
  [-100.3875, 42.9091],
  [-100.3875, 42.9091],
  [-100.3859, 42.9076],
  [-100.3859, 42.9076],
  [-100.3851, 42.9065],
  [-100.3851, 42.9065],
  [-100.3838, 42.9038],
  [-100.375, 42.9025],
  [-100.375, 42.9025],
]
