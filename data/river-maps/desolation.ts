import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Green River (UT) — geometry from USGS NHDPlus HR
// 17 points, 5/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = []

// River sections
export const sections: RiverSection[] = []

// River path from USGS NHDPlus High Resolution dataset
export const riverPath: [number, number][] = [
  [-110.0554, 39.3303],
  [-110.0571, 39.3308],
  [-110.0595, 39.3281],
  [-110.0557, 39.3197],
  [-110.056, 39.3173],
  [-110.058, 39.3165],
  [-110.058, 39.3165],
  [-110.0584, 39.3163],
  [-110.0584, 39.3163],
  [-110.0587, 39.3161],
  [-110.0587, 39.3161],
  [-110.0611, 39.314],
  [-110.062, 39.3099],
  [-110.0569, 39.3078],
  [-110.0521, 39.3069],
  [-110.0494, 39.3029],
  [-110.0494, 39.3029],
]
