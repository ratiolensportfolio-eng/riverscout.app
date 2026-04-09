const fs = require('fs')
const path = require('path')

const RIVERS_PATH = path.join(__dirname, '..', 'data', 'rivers.ts')
const AUDIT_PATH = path.join(__dirname, '..', 'tmp-safety-audit.json')

const audit = JSON.parse(fs.readFileSync(AUDIT_PATH, 'utf-8'))
let content = fs.readFileSync(RIVERS_PATH, 'utf-8')

// Map audit issue codes to short tag names
const TAG_MAP = {
  OPT_RANGE_WIDE: 'cfs-range-wide',
  CLASS_V_NO_PORTAGE_NOTE: 'class-v-portage-note',
  NAMED_RAPID_NO_NOTE: 'named-rapid-scout-note',
  CLASS_DRIFT: 'class-rating-drift',
  BEGINNER_CLAIM_CHECK: 'beginner-claim-review',
  UNSAFE_BEGINNER_CLAIM: 'unsafe-beginner-claim',
  CLASS_V_RANGE_WIDE: 'cfs-range-wide',
  OPT_RANGE_INSANE: 'cfs-range-wide',
  OPT_LOW_BOUND_LOW: 'cfs-low-bound-review',
  OPT_NO_UPPER_BOUND: 'cfs-upper-bound-missing',
  WW_TAG_NO_RAPIDS: 'whitewater-tag-review',
  LOWHEAD_NO_WARNING: 'lowhead-dam-warning',
  STRAINER_NO_WARNING: 'strainer-warning',
}

let editsApplied = 0
let editsSkipped = 0

for (const entry of audit.yellow) {
  const id = entry.id
  const tags = []
  for (const issue of entry.issues) {
    const code = issue.split(':')[0].trim()
    const tag = TAG_MAP[code]
    if (tag && !tags.includes(tag)) tags.push(tag)
  }
  if (tags.length === 0) continue

  // Find the river entry by `id: 'xxx'` and locate its `revs:` line.
  // The `revs: [...]` is always present (sometimes empty, sometimes populated).
  // We'll add `needsVerification: [...]` immediately after the revs line.
  const idMarker = new RegExp(`id:\\s*['"]${id}['"]`)
  const idMatch = content.match(idMarker)
  if (!idMatch) {
    console.warn(`SKIP: could not find id '${id}'`)
    editsSkipped++
    continue
  }

  // Walk forward from the id position to the matching close brace,
  // and find the `revs:` line (or array end) inside that range.
  const idPos = idMatch.index

  // Find the opening brace of the entry
  const braceStart = content.lastIndexOf('{', idPos)

  // Walk forward to matching close brace, tracking string state
  let depth = 0
  let i = braceStart
  let inString = false
  let stringChar = null
  let escape = false
  while (i < content.length) {
    const ch = content[i]
    if (escape) { escape = false; i++; continue }
    if (ch === '\\') { escape = true; i++; continue }
    if (inString) {
      if (ch === stringChar) { inString = false; stringChar = null }
      i++
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true
      stringChar = ch
      i++
      continue
    }
    if (ch === '{') depth++
    else if (ch === '}') {
      depth--
      if (depth === 0) { i++; break }
    }
    i++
  }
  const entryEnd = i
  const entryBody = content.substring(braceStart, entryEnd)

  // Already has needsVerification?
  if (/needsVerification:\s*\[/.test(entryBody)) {
    console.warn(`SKIP: ${id} already has needsVerification`)
    editsSkipped++
    continue
  }

  // Find the `revs:` line position within the entry
  const revsMatch = entryBody.match(/(\n\s*)(revs:\s*\[[^\]]*\],?)/)
  if (!revsMatch) {
    console.warn(`SKIP: ${id} no revs line found`)
    editsSkipped++
    continue
  }

  const revsLineStart = revsMatch.index
  const revsLineEnd = revsLineStart + revsMatch[0].length
  const indent = revsMatch[1] // includes newline and leading whitespace

  // Build the new line
  const tagsStr = tags.map(t => `'${t}'`).join(', ')
  const newLine = `${indent}needsVerification: [${tagsStr}],`

  // Splice into entryBody, then back into full content
  const newEntryBody =
    entryBody.substring(0, revsLineEnd) + newLine + entryBody.substring(revsLineEnd)
  content =
    content.substring(0, braceStart) + newEntryBody + content.substring(entryEnd)

  editsApplied++
  console.log(`✓ ${id}: added [${tagsStr}]`)
}

fs.writeFileSync(RIVERS_PATH, content, 'utf-8')
console.log()
console.log(`Applied: ${editsApplied}  Skipped: ${editsSkipped}`)
