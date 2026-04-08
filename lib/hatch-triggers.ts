// Hatch temperature triggers and metadata
// Maps normalized hatch names to known temperature triggers and conditions
// Sources: Orvis hatch guides, Trout Unlimited, state entomology studies

export interface HatchTrigger {
  tempMinF: number       // water temp that starts the hatch
  tempMaxF: number       // upper end of ideal hatch temp range
  conditions?: string    // additional trigger conditions
  description: string    // short description for UI
  peakMonths: number[]   // 1-12, approximate peak months
}

// Normalize hatch name for lookup (strip parentheticals, lowercase)
export function normalizeHatchName(name: string): string {
  return name
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s*\/\s*/g, '/')
    .toLowerCase()
    .trim()
}

export const HATCH_TRIGGERS: Record<string, HatchTrigger> = {
  'hex': {
    tempMinF: 60, tempMaxF: 68,
    conditions: 'Warm evenings, still air, near dark',
    description: 'Water temp reaches 60–65°F at dusk',
    peakMonths: [6, 7],
  },
  'hex (hexagenia limbata)': {
    tempMinF: 60, tempMaxF: 68,
    conditions: 'Warm evenings, still air, near dark',
    description: 'Water temp reaches 60–65°F at dusk',
    peakMonths: [6, 7],
  },
  'blue-winged olive': {
    tempMinF: 45, tempMaxF: 58,
    conditions: 'Overcast days, light rain, cool temps',
    description: 'Overcast days, water temp 45–55°F',
    peakMonths: [3, 4, 5, 9, 10],
  },
  'blue-winged olive (bwo)': {
    tempMinF: 45, tempMaxF: 58,
    conditions: 'Overcast days, light rain, cool temps',
    description: 'Overcast days, water temp 45–55°F',
    peakMonths: [3, 4, 5, 9, 10],
  },
  'hendrickson': {
    tempMinF: 50, tempMaxF: 58,
    conditions: 'Afternoon emergers, overcast preferred',
    description: 'Water temp above 50°F, afternoon emergence',
    peakMonths: [4, 5],
  },
  'hendrickson mayfly': {
    tempMinF: 50, tempMaxF: 58,
    conditions: 'Afternoon emergers, overcast preferred',
    description: 'Water temp above 50°F, afternoon emergence',
    peakMonths: [4, 5],
  },
  'caddis': {
    tempMinF: 50, tempMaxF: 65,
    conditions: 'Evening rises, especially on warm days',
    description: 'Water temp above 50°F, evening rises',
    peakMonths: [4, 5, 6],
  },
  "caddis (mother's day caddis)": {
    tempMinF: 50, tempMaxF: 60,
    conditions: 'Massive emergence in late afternoon/evening',
    description: 'Water temp 50–60°F, massive Mother\'s Day emergence',
    peakMonths: [5, 6],
  },
  "caddis (mother's day)": {
    tempMinF: 50, tempMaxF: 60,
    conditions: 'Massive emergence in late afternoon/evening',
    description: 'Water temp 50–60°F, massive Mother\'s Day emergence',
    peakMonths: [5, 6],
  },
  'october caddis': {
    tempMinF: 45, tempMaxF: 55,
    conditions: 'Fall afternoons, lower water',
    description: 'Water temp 45–55°F, fall afternoons',
    peakMonths: [9, 10, 11],
  },
  'sulfur': {
    tempMinF: 55, tempMaxF: 65,
    conditions: 'Late afternoon to evening, calm water',
    description: 'Water temp 55–65°F, evening emergers',
    peakMonths: [5, 6],
  },
  'pale morning dun': {
    tempMinF: 55, tempMaxF: 65,
    conditions: 'Morning to early afternoon',
    description: 'Water temp 55–65°F, morning emergence',
    peakMonths: [6, 7, 8],
  },
  'pale morning dun (pmd)': {
    tempMinF: 55, tempMaxF: 65,
    conditions: 'Morning to early afternoon',
    description: 'Water temp 55–65°F, morning emergence',
    peakMonths: [6, 7, 8],
  },
  'pmd / green drake': {
    tempMinF: 55, tempMaxF: 65,
    conditions: 'Morning to early afternoon',
    description: 'Water temp 55–65°F, morning emergence',
    peakMonths: [6, 7, 8],
  },
  'brown drake': {
    tempMinF: 58, tempMaxF: 68,
    conditions: 'Dusk emergence, similar to Hex',
    description: 'Water temp 58–65°F, dusk emergence',
    peakMonths: [5, 6],
  },
  'green drake': {
    tempMinF: 55, tempMaxF: 65,
    conditions: 'Overcast afternoons preferred',
    description: 'Water temp 55–65°F, overcast afternoons',
    peakMonths: [5, 6, 7],
  },
  'march brown': {
    tempMinF: 48, tempMaxF: 58,
    conditions: 'Afternoon emergence',
    description: 'Water temp 48–55°F, afternoon emergers',
    peakMonths: [3, 4, 5],
  },
  'march brown / grey drake': {
    tempMinF: 48, tempMaxF: 58,
    conditions: 'Afternoon emergence',
    description: 'Water temp 48–55°F, afternoon emergers',
    peakMonths: [5, 6],
  },
  'trico': {
    tempMinF: 65, tempMaxF: 78,
    conditions: 'Early morning spinner falls, calm water',
    description: 'Water temp above 65°F, early morning spinner falls',
    peakMonths: [7, 8, 9],
  },
  'midge': {
    tempMinF: 32, tempMaxF: 70,
    conditions: 'Year-round, especially winter tailwaters',
    description: 'Active year-round, any water temp',
    peakMonths: [1, 2, 3, 10, 11, 12],
  },
  'stonefly': {
    tempMinF: 50, tempMaxF: 60,
    conditions: 'Fast water, riffles',
    description: 'Water temp above 50°F, fast riffled water',
    peakMonths: [5, 6, 7],
  },
  'stonefly (golden stone, salmonfly)': {
    tempMinF: 50, tempMaxF: 60,
    description: 'Water temp 50–60°F, big dry fly fishing',
    peakMonths: [6, 7],
  },
  'stonefly (golden stone)': {
    tempMinF: 50, tempMaxF: 60,
    description: 'Water temp 50–60°F',
    peakMonths: [6, 7],
  },
  'salmonfly': {
    tempMinF: 50, tempMaxF: 58,
    conditions: 'Riffled water, afternoon to evening',
    description: 'Water temp 50–55°F, the premier Western hatch',
    peakMonths: [5, 6, 7],
  },
  'salmonfly / golden stone': {
    tempMinF: 50, tempMaxF: 60,
    description: 'Water temp 50–60°F, aggressive surface takes',
    peakMonths: [6, 7],
  },
  'salmonfly / golden stonefly': {
    tempMinF: 50, tempMaxF: 60,
    description: 'Water temp 50–60°F, big dries',
    peakMonths: [6, 7],
  },
  'golden stonefly': {
    tempMinF: 52, tempMaxF: 62,
    conditions: 'Afternoon to evening',
    description: 'Water temp 52–62°F, afternoon emergence',
    peakMonths: [6, 7],
  },
  'skwala stonefly': {
    tempMinF: 40, tempMaxF: 50,
    conditions: 'First big dry fly hatch of the year',
    description: 'Water temp 40–48°F, first dry fly hatch of spring',
    peakMonths: [2, 3, 4],
  },
  'hopper/dropper': {
    tempMinF: 60, tempMaxF: 80,
    conditions: 'Hot summer days, windy afternoons',
    description: 'Warm days above 60°F, windy afternoons best',
    peakMonths: [7, 8, 9],
  },
  'terrestrials': {
    tempMinF: 60, tempMaxF: 80,
    conditions: 'Hot summer days, windy conditions',
    description: 'Warm air temps, windy days blow bugs onto water',
    peakMonths: [7, 8, 9],
  },
  'terrestrials (hoppers, ants, beetles)': {
    tempMinF: 60, tempMaxF: 80,
    description: 'Warm air temps, windy days blow bugs onto water',
    peakMonths: [7, 8, 9],
  },
  'terrestrials (hoppers, ants)': {
    tempMinF: 60, tempMaxF: 80,
    description: 'Warm air temps, windy days',
    peakMonths: [7, 8, 9],
  },
  'white fly': {
    tempMinF: 62, tempMaxF: 72,
    conditions: 'Evening emergence',
    description: 'Water temp 62–72°F, evening hatches',
    peakMonths: [7, 8],
  },
  'isonychia': {
    tempMinF: 58, tempMaxF: 68,
    conditions: 'Late afternoon to evening, fast water',
    description: 'Water temp 58–68°F, fast water, evening',
    peakMonths: [6, 7, 8, 9],
  },
  'quill gordon': {
    tempMinF: 45, tempMaxF: 55,
    conditions: 'First major hatch of spring, afternoon',
    description: 'Water temp 45–50°F, first major spring hatch',
    peakMonths: [3, 4],
  },
  'quill gordon / hendrickson': {
    tempMinF: 48, tempMaxF: 58,
    description: 'Water temp 48–55°F, early spring afternoons',
    peakMonths: [4, 5],
  },
  'light cahill': {
    tempMinF: 58, tempMaxF: 68,
    conditions: 'Evening emergence',
    description: 'Water temp 58–65°F, evening hatches',
    peakMonths: [5, 6, 7],
  },
  'red quill': {
    tempMinF: 58, tempMaxF: 68,
    description: 'Water temp 58–65°F',
    peakMonths: [7, 8],
  },
  'slate drake': {
    tempMinF: 58, tempMaxF: 70,
    description: 'Water temp 58–70°F, summer evenings',
    peakMonths: [6, 7, 8, 9],
  },
  'cicada': {
    tempMinF: 65, tempMaxF: 85,
    conditions: 'Periodic emergence years only',
    description: 'Warm temps, periodic cycle years only',
    peakMonths: [7, 8],
  },
  'pink albert (pink cahill)': {
    tempMinF: 55, tempMaxF: 65,
    description: 'Water temp 55–65°F',
    peakMonths: [6, 7],
  },
  'scud/amphipod': {
    tempMinF: 32, tempMaxF: 70,
    description: 'Year-round subsurface food source',
    peakMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
}

// Look up trigger data for a hatch name
export function getHatchTrigger(name: string): HatchTrigger | null {
  const lower = name.toLowerCase().trim()
  if (HATCH_TRIGGERS[lower]) return HATCH_TRIGGERS[lower]

  // Try normalized (strip parentheticals)
  const normalized = normalizeHatchName(name).toLowerCase()
  if (HATCH_TRIGGERS[normalized]) return HATCH_TRIGGERS[normalized]

  // Fuzzy: check if any key is contained in the name
  for (const [key, val] of Object.entries(HATCH_TRIGGERS)) {
    if (lower.includes(key) || key.includes(lower)) return val
  }

  return null
}
