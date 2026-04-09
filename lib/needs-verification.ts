// Maps the short machine-readable tags stored in River.needsVerification to
// human-readable labels and to the SuggestCorrection field they map to.
//
// When the audit script (scripts/audit-safety.js) discovers a safety/data
// issue it can't auto-fix, it inserts the tag here. The UI surfaces these
// tags so community paddlers can verify and improve the entry.

export interface VerificationItem {
  tag: string
  label: string                // short label shown in chip
  description: string          // explanation shown in modal list
  suggestField: string         // matches FIELDS values in SuggestCorrection
}

export const VERIFICATION_TAGS: Record<string, Omit<VerificationItem, 'tag'>> = {
  'cfs-range-wide': {
    label: 'CFS range may be too wide',
    description: 'The optimal CFS range covers a 10x or wider span. A local paddler can help narrow it to the actual sweet spot.',
    suggestField: 'opt',
  },
  'class-v-portage-note': {
    label: 'Class V portage note missing',
    description: 'This river has Class V+ rapids but no portage or scout language in the description. Help us add the names of mandatory portages.',
    suggestField: 'desc',
  },
  'named-rapid-scout-note': {
    label: 'Named rapid needs scout note',
    description: 'A famous hard rapid is mentioned but without scout/portage guidance. Help us add safety details.',
    suggestField: 'desc',
  },
  'class-rating-drift': {
    label: 'Class rating may understate difficulty',
    description: 'The headline class rating is lower than the highest class mentioned in section descriptions. Verify which is right.',
    suggestField: 'cls',
  },
  'beginner-claim-review': {
    label: 'Beginner claim needs review',
    description: 'A "family-friendly" or "beginner" phrase appears alongside Class III water. Confirm whether this is correctly scoped to a specific section.',
    suggestField: 'desc',
  },
  'cfs-low-bound-review': {
    label: 'Low CFS bound looks low',
    description: 'A Class IV+ run with a very low minimum CFS — verify the bony-water cutoff.',
    suggestField: 'opt',
  },
  'cfs-upper-bound-missing': {
    label: 'CFS upper bound missing',
    description: 'Open-ended CFS range on a Class III+ river. Verify the high-water cutoff.',
    suggestField: 'safe_cfs',
  },
  'whitewater-tag-review': {
    label: 'Whitewater tag may be wrong',
    description: 'Tagged as whitewater but the class rating is Class I with no Class II+ rapids mentioned.',
    suggestField: 'cls',
  },
  'lowhead-dam-warning': {
    label: 'Low-head dam warning needed',
    description: 'A low-head dam is mentioned without an explicit hazard warning. Help us add the warning text.',
    suggestField: 'safe_cfs',
  },
  'strainer-warning': {
    label: 'Strainer hazard note needed',
    description: 'A strainer is mentioned without scout/caution language.',
    suggestField: 'desc',
  },
  'unsafe-beginner-claim': {
    label: 'Unsafe beginner claim',
    description: 'A beginner-friendly claim appears alongside Class IV+ water. Verify scoping or remove.',
    suggestField: 'desc',
  },
}

export function getVerificationItems(tags: string[] | undefined): VerificationItem[] {
  if (!tags || tags.length === 0) return []
  return tags
    .map(tag => {
      const meta = VERIFICATION_TAGS[tag]
      if (!meta) return null
      return { tag, ...meta }
    })
    .filter((x): x is VerificationItem => x !== null)
}
