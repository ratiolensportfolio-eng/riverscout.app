import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Green River (UT) — geometry from USGS NHDPlus HR
// 17 points, 5/200 segments stitched

// Access points snapped to riverPath geometry
export const accessPoints: AccessPoint[] = [
  {
    name: "Sand Wash",
    lat: 39.3303,
    lng: -110.0554,
    type: "put-in",
    description: "Put-in for Desolation Canyon. Remote launch accessed via long dirt road. BLM permit required.",
  },
  {
    name: "Three Fords",
    lat: 39.3165,
    lng: -110.058,
    type: "access",
    description: "Mid-canyon access point near Three Fords rapid. River-only access in the wilderness section.",
  },
  {
    name: "Swasey Rapid",
    lat: 39.3029,
    lng: -110.0494,
    type: "take-out",
    description: "Take-out at Swasey Beach/Nefertiti boat ramp in Gray Canyon. End of the Desolation Canyon float.",
  },
]

// River sections
export const sections: RiverSection[] = [
  {
    from: "Sand Wash",
    to: "Swasey Rapid",
    miles: 84,
    paddleTime: "5\u20137 days",
    class: "I-III",
    notes: "Desolation and Gray Canyons of the Green River. Remote multi-day wilderness float with Class I-III rapids, ancient rock art, and desert canyon scenery. BLM permit required.",
  },
]

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
