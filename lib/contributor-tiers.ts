// Contributor tiers for the user-improvement gamification system.
//
// A user's tier is computed live from their approved-suggestion count
// (count(*) from suggestions where user_id = ? and status = 'approved').
// We deliberately don't store the tier on the user_profiles row — it
// would just be a derived value that has to be kept in sync, and the
// count query is cheap.
//
// Thresholds chosen to feel achievable in the early game and meaningful
// in the late game:
//
//   1   First Approval  — celebrates the moment, low bar to feel
//                          included
//   5   Local Knowledge  — proves the first wasn't an accident
//   20  River Contributor — the workhorse tier, most active users will
//                            land here
//   50  River Steward    — significant ongoing contribution
//   100 Verified Authority — top of the ladder, rare badge
//
// Color choices match the rest of the codebase's "river palette":
// rvdk (deep green), wt (water blue), am (amber), rv (river green),
// dg (deep red). The Authority tier gets a special gold color
// (#C19A2B) reserved for this badge alone — it should feel different.

export interface ContributorTier {
  // Sort key — lower means earlier tier
  rank: number
  // Minimum approved-improvement count to reach this tier
  threshold: number
  // Slug used internally and in any future analytics
  key: 'none' | 'first' | 'local' | 'contributor' | 'steward' | 'authority'
  // Display label
  label: string
  // Short one-line description for tooltips and contributor emails
  description: string
  // Visual identity
  color: string         // text color
  background: string    // chip background
  border: string        // chip border
  icon: string          // emoji or unicode glyph
}

export const CONTRIBUTOR_TIERS: ContributorTier[] = [
  {
    rank: 0,
    threshold: 0,
    key: 'none',
    label: '',
    description: '',
    color: 'transparent',
    background: 'transparent',
    border: 'transparent',
    icon: '',
  },
  {
    rank: 1,
    threshold: 1,
    key: 'first',
    label: 'First Approval',
    description: 'Submitted their first approved improvement to RiverScout.',
    color: '#085041',
    background: '#E1F5EE',
    border: '#9FE1CB',
    icon: '\u2713', // check
  },
  {
    rank: 2,
    threshold: 5,
    key: 'local',
    label: 'Local Knowledge',
    description: 'Has submitted 5 or more approved improvements — proven local insight.',
    color: '#0C447C',
    background: '#E6F1FB',
    border: '#9DC4EA',
    icon: '\uD83D\uDCCD', // 📍
  },
  {
    rank: 3,
    threshold: 20,
    key: 'contributor',
    label: 'River Contributor',
    description: '20+ approved improvements. A reliable steward of river data accuracy.',
    color: '#1D9E75',
    background: '#E1F5EE',
    border: '#1D9E75',
    icon: '\uD83C\uDF0A', // 🌊
  },
  {
    rank: 4,
    threshold: 50,
    key: 'steward',
    label: 'River Steward',
    description: '50+ approved improvements. A significant ongoing contributor to the atlas.',
    color: '#7A4D0E',
    background: '#FBF3E8',
    border: '#BA7517',
    icon: '\u2605', // ★
  },
  {
    rank: 5,
    threshold: 100,
    key: 'authority',
    label: 'Verified Authority',
    description: '100+ approved improvements. The rare top of the contributor ladder.',
    color: '#C19A2B',
    background: '#FFF8E1',
    border: '#C19A2B',
    icon: '\uD83C\uDFC6', // 🏆
  },
]

/**
 * Returns the tier a user has earned with the given approved-improvement
 * count. Always returns a tier — never null. The 0-count case returns
 * the empty `none` tier so callers can render nothing without a null
 * check.
 */
export function getContributorTier(approvedCount: number): ContributorTier {
  // Walk highest-to-lowest so we return the highest matching tier.
  for (let i = CONTRIBUTOR_TIERS.length - 1; i >= 0; i--) {
    if (approvedCount >= CONTRIBUTOR_TIERS[i].threshold) {
      return CONTRIBUTOR_TIERS[i]
    }
  }
  return CONTRIBUTOR_TIERS[0]
}

/**
 * Returns the next tier the user is working toward, or null if they're
 * already at the top. Used by the contributor email + account page to
 * show "X more approvals to reach Y."
 */
export function getNextTier(approvedCount: number): ContributorTier | null {
  for (const tier of CONTRIBUTOR_TIERS) {
    if (approvedCount < tier.threshold) return tier
  }
  return null
}

/**
 * Returns true when an approval just crossed a tier threshold.
 * Used by the suggestions PATCH approve handler to detect when a user
 * has just leveled up so we can include the celebration in their
 * approval email.
 */
export function didJustLevelUp(prevCount: number, newCount: number): ContributorTier | null {
  const prevTier = getContributorTier(prevCount)
  const newTier = getContributorTier(newCount)
  if (newTier.rank > prevTier.rank) return newTier
  return null
}
