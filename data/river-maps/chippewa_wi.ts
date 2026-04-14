import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Chippewa River (WI) — polyline from National Rivers Project (NRP).
// 26 points, stitched from 1 NRP segments.
// Access points render from Supabase at runtime.

export const accessPoints: AccessPoint[] = []

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-91.2660, 45.0606],
  [-91.2666, 45.0601],
  [-91.2672, 45.0595],
  [-91.2678, 45.0590],
  [-91.2684, 45.0584],
  [-91.2691, 45.0579],
  [-91.2703, 45.0572],
  [-91.2714, 45.0566],
  [-91.2724, 45.0558],
  [-91.2730, 45.0548],
  [-91.2735, 45.0544],
  [-91.2742, 45.0534],
  [-91.2746, 45.0527],
  [-91.2753, 45.0520],
  [-91.2756, 45.0515],
  [-91.2756, 45.0512],
  [-91.2757, 45.0507],
  [-91.2758, 45.0503],
  [-91.2762, 45.0502],
  [-91.2768, 45.0497],
  [-91.2771, 45.0494],
  [-91.2778, 45.0491],
  [-91.2785, 45.0486],
  [-91.2789, 45.0482],
  [-91.2793, 45.0475],
  [-91.2796, 45.0471],
]
