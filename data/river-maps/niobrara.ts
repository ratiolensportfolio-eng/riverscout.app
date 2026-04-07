import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Niobrara River (NE) — geometry from USGS NHDPlus HR
// 36 points, 14/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  {
    name: "Berry Bridge",
    lat: 42.9081,
    lng: -100.4547,
    type: "put-in",
    description: "Put-in at Berry Bridge. Starting point for the most popular Niobrara float.",
  },
  {
    name: "Smith Falls SP",
    lat: 42.9025,
    lng: -100.3750,
    type: "access",
    description: "Smith Falls State Park \u2014 tallest waterfall in Nebraska (63 ft). Worth a stop to hike to the falls.",
  },
  {
    name: "Rocky Ford",
    lat: 42.9025,
    lng: -100.3750,
    type: "take-out",
    description: "Rocky Ford take-out. End of the most popular Niobrara tubing and canoeing section.",
  },
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
