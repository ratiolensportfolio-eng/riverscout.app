// River designation badge system
// Parses the desig field and returns applicable badge types

export interface DesignationBadge {
  type: string
  label: string
  color: string      // text color
  bg: string          // background
  border: string      // border color
  icon: string        // emoji or symbol
}

const BADGE_DEFS: DesignationBadge[] = [
  { type: 'wild_scenic', label: 'Wild & Scenic', color: '#085041', bg: '#E1F5EE', border: '#9FE1CB', icon: '★' },
  { type: 'gold_medal', label: 'Gold Medal', color: '#8B6914', bg: '#FFF8E1', border: '#E8C54A', icon: '🥇' },
  { type: 'blue_ribbon', label: 'Blue-Ribbon Trout', color: '#185FA5', bg: '#E6F1FB', border: '#B5D4F4', icon: '🎣' },
  { type: 'national_park', label: 'National Park', color: '#2E5E3F', bg: '#E8F5E9', border: '#A5D6A7', icon: '🏞' },
  { type: 'nra', label: 'Nat. Recreation Area', color: '#4A148C', bg: '#F3E5F5', border: '#CE93D8', icon: '🌲' },
  { type: 'wilderness', label: 'Wilderness', color: '#1B5E20', bg: '#E8F5E9', border: '#81C784', icon: '🌿' },
  { type: 'natural_river', label: 'Natural River', color: '#00695C', bg: '#E0F2F1', border: '#80CBC4', icon: '🍃' },
  { type: 'scenic_river', label: 'Scenic River', color: '#3E2723', bg: '#EFEBE9', border: '#BCAAA4', icon: '🏔' },
  { type: 'tu_conservation', label: 'TU Conservation', color: '#8B0000', bg: '#FFF0F0', border: '#E8A0A0', icon: '🐟' },
  { type: 'aw_conservation', label: 'AW Stewardship', color: '#1A237E', bg: '#E8EAF6', border: '#9FA8DA', icon: '🛶' },
]

export function getDesignationBadges(desig: string): DesignationBadge[] {
  if (!desig) return []
  const lower = desig.toLowerCase()
  const badges: DesignationBadge[] = []

  if (lower.includes('wild & scenic') || lower.includes('wild and scenic')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'wild_scenic')!)
  }
  if (lower.includes('gold medal')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'gold_medal')!)
  }
  if (lower.includes('blue-ribbon') || lower.includes('blue ribbon')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'blue_ribbon')!)
  }
  if (lower.includes('national park') || lower.includes('national monument')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'national_park')!)
  }
  if (lower.includes('national recreation area') || lower.includes('nra')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'nra')!)
  }
  if (lower.includes('wilderness') && !lower.includes('waterway')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'wilderness')!)
  }
  if (lower.includes('natural river')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'natural_river')!)
  }
  if ((lower.includes('scenic river') || lower.includes('scenic waterway')) && !lower.includes('wild')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'scenic_river')!)
  }
  if (lower.includes('trout unlimited') || lower.includes('tu conservation')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'tu_conservation')!)
  }
  if (lower.includes('american whitewater') || lower.includes('aw stewardship')) {
    badges.push(BADGE_DEFS.find(b => b.type === 'aw_conservation')!)
  }

  return badges
}
