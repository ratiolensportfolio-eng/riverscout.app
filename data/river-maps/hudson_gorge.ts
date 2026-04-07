import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Hudson River (NY) — geometry from USGS NHDPlus HR
// 17 points, 4/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  {
    name: "Indian River Confluence",
    lat: 43.9526,
    lng: -74.0687,
    type: "put-in",
    description: "Put-in for the Hudson River Gorge at the Indian River confluence. Remote Adirondack access.",
  },
  {
    name: "Blue Ledge",
    lat: 43.9616,
    lng: -74.0903,
    type: "access",
    description: "Iconic Class IV section of the gorge. Towering cliff walls and continuous whitewater.",
  },
  {
    name: "North River",
    lat: 43.9695,
    lng: -74.094,
    type: "take-out",
    description: "Take-out for the Hudson Gorge run at North River. Shuttle road access.",
  },
]

// River sections
export const sections: RiverSection[] = [
  {
    from: "Indian River Confluence",
    to: "North River",
    miles: 17,
    paddleTime: "5\u20137 hours",
    class: "III-IV",
    notes: "Premier Adirondack whitewater. Remote gorge with Blue Ledge, Harris Rift, and Ord Falls. Spring runoff best (April\u2013May).",
  },
]

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-74.0687, 43.9526],
  [-74.0822, 43.9523],
  [-74.0822, 43.9523],
  [-74.0816, 43.9556],
  [-74.0816, 43.9556],
  [-74.0816, 43.9567],
  [-74.0867, 43.9567],
  [-74.0867, 43.9567],
  [-74.0937, 43.9586],
  [-74.0903, 43.9616],
  [-74.0886, 43.9599],
  [-74.0861, 43.962],
  [-74.0877, 43.9642],
  [-74.0924, 43.9656],
  [-74.0917, 43.9677],
  [-74.094, 43.9695],
  [-74.094, 43.9695],
]
