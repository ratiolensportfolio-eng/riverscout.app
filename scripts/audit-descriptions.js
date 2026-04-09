const fs = require('fs')
const path = require('path')

const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'rivers.ts'), 'utf-8')

// Generic AI phrases (case insensitive)
const FLAG_PHRASES = [
  'offers excellent paddling opportunities',
  'suitable for paddlers of all skill levels',
  'a truly unique experience',
  'nestled in the heart of',
  'crystal clear waters',
  'crystal-clear waters',
  'breathtaking scenery',
  'world-class fishing',
  'something for everyone',
]

// Approach: walk file line by line. Each river starts with `id: '...'` and we
// collect a window of ~25 lines after to capture id/n/desc/abbr.
// We also track the current state by watching for two-letter state keys at the top level.

const lines = content.split('\n')
const rivers = []

// Detect state context (lines like `  mi: {`)
let currentState = null
let currentStateName = null

// For each river, collect a forward window until we hit `},`
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]

  // State detection — top-level state object
  const stateMatch = line.match(/^  ([a-z]{2}):\s*\{/)
  if (stateMatch) {
    currentState = stateMatch[1].toUpperCase()
    // try to grab name from same or next line
    const nameMatch = (line + lines[i + 1] || '').match(/name:\s*['"]([^'"]+)['"]/)
    if (nameMatch) currentStateName = nameMatch[1]
    continue
  }

  // River entry detection — `id: 'xxx'` pattern
  const idMatch = line.match(/id:\s*['"]([a-z][a-z0-9_]*)['"]/)
  if (idMatch) {
    const id = idMatch[1]
    // Collect this and subsequent lines until depth balances back to where we started
    // Simpler: collect next 80 lines, that should always cover the river entry
    const window = lines.slice(i, Math.min(i + 100, lines.length)).join('\n')

    // Find the matching close — count braces from this `{` until depth zero
    // The river entry starts with `{` on a previous line. We want to capture the whole obj.
    // Just regex the desc field (which spans only one logical line ending at "',")
    // Many descs use double quotes with apostrophes, others use single quotes with escapes

    const nMatch = window.match(/^\s*id:\s*['"][^'"]+['"]\s*,\s*n:\s*(['"])((?:\\.|(?!\1).)*?)\1/m)
    const name = nMatch ? nMatch[2] : null

    // Extract desc — handle both quote types and multi-line possibility
    // Pattern: desc: "..." or desc: '...'
    const descMatch = window.match(/desc:\s*(['"])((?:\\.|(?!\1).)*?)\1/)
    const desc = descMatch ? descMatch[2].replace(/\\'/g, "'").replace(/\\"/g, '"') : null

    if (desc) {
      rivers.push({ id, name, state: currentState, desc })
    }
  }
}

console.log(`Total rivers with desc: ${rivers.length}`)

const flagged = []

function countSpecificity(desc) {
  let score = 0
  // Multi-word proper nouns (e.g. "Grand Canyon", "Tippy Dam")
  const properNouns = desc.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}/g) || []
  score += properNouns.length
  // Standalone landmark words (Dam, Canyon, Gorge, etc.)
  const landmarks = desc.match(/\b(Dam|Canyon|Gorge|Falls|Bridge|Wilderness|Forest|Park|Reservoir|Springs?|Basin|Confluence|Tailwater)\b/g) || []
  score += landmarks.length * 0.5
  // Distances and quantities
  const quantities = desc.match(/\b\d+(?:\.\d+)?\s*(?:miles?|mi|cfs|ft|feet|°F)\b/gi) || []
  score += quantities.length
  // Years and dates
  const years = desc.match(/\b(?:18|19|20)\d{2}\b/g) || []
  score += years.length
  // Class designations (Class III, Class V, etc.)
  const classes = desc.match(/\bClass\s+[IVX]+/g) || []
  score += classes.length
  // Highway/route designations
  const routes = desc.match(/\b(?:US|Hwy|I-|M-|SR-?|CR-?)[\s-]?\d+/g) || []
  score += routes.length
  return score
}

for (const r of rivers) {
  const reasons = []
  const lowerDesc = r.desc.toLowerCase()

  for (const phrase of FLAG_PHRASES) {
    if (lowerDesc.includes(phrase)) {
      reasons.push(`PHRASE: "${phrase}"`)
    }
  }

  // Sentence count
  const sentences = r.desc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5)
  const specificity = countSpecificity(r.desc)

  // Specific landmark check
  const hasProperNouns =
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+/.test(r.desc) ||
    /\b(Mt\.|Mount|Lake|Dam|Canyon|Gorge|Falls|Pool|Bridge|Bend|Pass|Pkwy|Rapids?|Park|Forest|River|Creek|Reservoir|Springs?|Bay|Trail|Ridge|Peak|Wilderness|Valley|Basin|Crossing|Confluence|Tributary|Mile)\b/.test(r.desc) ||
    /\b\d+(\.\d+)?\s*(miles?|mi|cfs|ft|feet|ft\.)\b/i.test(r.desc) ||
    /\b(US|Hwy|Highway|Route|Rt|I-)[\s-]?\d+/.test(r.desc)

  if (!hasProperNouns) {
    reasons.push('NO_LANDMARKS')
  }

  // Only flag SHORT if it's also low specificity
  if (sentences.length < 3 && specificity < 3) {
    reasons.push(`THIN: ${sentences.length}sent / specificity=${specificity}`)
  }

  if (reasons.length > 0) {
    flagged.push({ ...r, reasons, sentenceCount: sentences.length, specificity })
  }
}

console.log(`FLAGGED: ${flagged.length}`)
console.log()
console.log('=== FLAGGED RIVERS ===')
for (const f of flagged) {
  console.log()
  console.log(`[${f.state}] ${f.id} — ${f.name}`)
  console.log(`  Reasons: ${f.reasons.join(' | ')}`)
  console.log(`  Description: ${f.desc}`)
}

// Summary
const byReason = {}
for (const f of flagged) {
  for (const r of f.reasons) {
    const key = r.split(':')[0]
    byReason[key] = (byReason[key] || 0) + 1
  }
}
console.log()
console.log('=== SUMMARY BY REASON ===')
for (const [k, v] of Object.entries(byReason)) {
  console.log(`  ${k}: ${v}`)
}
