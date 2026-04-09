const fs = require('fs')
const path = require('path')

const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'rivers.ts'), 'utf-8')

// ── Parse river entries ──────────────────────────────────────────
// Each river is `{ id: 'xxx', n: '...', ... cls: 'I-II', opt: '...' ... desc: '...' ... secs: [...] ... }`
// Find each entry by id and capture surrounding object body until balancing close.
const rivers = []
const idRegex = /(\s+)\{(?:\s|\n)*id:\s*['"]([a-z][a-z0-9_]*)['"]/g
let m
const idPositions = []
while ((m = idRegex.exec(content)) !== null) {
  // Find the opening `{` position
  const openIdx = content.lastIndexOf('{', m.index + m[0].length)
  idPositions.push({ id: m[2], openIdx })
}

for (const { id, openIdx } of idPositions) {
  // Walk forward to find matching close
  let depth = 0
  let i = openIdx
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
  const body = content.substring(openIdx, i)
  rivers.push({ id, openIdx, closeIdx: i, body })
}

console.log(`Parsed ${rivers.length} river entries`)

// ── Helpers to extract fields ────────────────────────────────────
function extractScalar(body, name) {
  const re = new RegExp(`(?:^|[,{\\s])${name}:\\s*(['"\`])((?:\\\\.|(?!\\1).)*?)\\1`, 'm')
  const mm = body.match(re)
  return mm ? mm[2] : null
}

function extractBool(body, name) {
  const re = new RegExp(`(?:^|[,{\\s])${name}:\\s*(true|false)\\b`)
  const mm = body.match(re)
  return mm ? mm[1] === 'true' : null
}

function extractStringArray(body, name) {
  const re = new RegExp(`${name}:\\s*\\[([^\\]]*?)\\]`, 's')
  const mm = body.match(re)
  if (!mm) return []
  const inner = mm[1]
  // Pull out string literals
  const items = []
  const itemRe = /(['"`])((?:\\.|(?!\1).)*?)\1/g
  let im
  while ((im = itemRe.exec(inner)) !== null) {
    items.push(im[2].replace(/\\'/g, "'").replace(/\\"/g, '"'))
  }
  return items
}

// ── Class detection helpers ──────────────────────────────────────
const ROMAN_TO_NUM = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 }

function classToNumber(clsStr) {
  if (!clsStr) return 0
  // "Riffles" / "Flatwater" => 0
  if (/riffle|flat|quiet|gentle|mellow/i.test(clsStr) && !/[IV]/.test(clsStr)) return 0
  // Find highest Roman numeral
  const matches = clsStr.match(/\b(VI|V|IV|III|II|I)\b/g) || []
  let max = 0
  for (const r of matches) {
    if (ROMAN_TO_NUM[r] > max) max = ROMAN_TO_NUM[r]
  }
  return max
}

function highestClassMentioned(text) {
  if (!text) return 0
  let max = 0
  const re = /\bClass\s+(VI|V\+?|IV\+?|III\+?|II|I)\b/gi
  let mm
  while ((mm = re.exec(text)) !== null) {
    const norm = mm[1].replace('+', '')
    const v = ROMAN_TO_NUM[norm.toUpperCase()] || 0
    if (v > max) max = v
  }
  return max
}

// ── Audit ────────────────────────────────────────────────────────
const flags = { red: [], yellow: [] }

// Patterns we care about
// "first time" removed — too often appears in dam removal / restoration context.
// "intro" / "introduction" is checked only when followed by "to paddling/kayaking".
const BEGINNER_PHRASES = /\b(beginners?|family[- ]friendly|kid[- ]friendly|novice paddlers?|introduction to (?:paddling|kayaking|whitewater)|all skill levels|paddlers? of all skill)\b/i

// A section string is "properly scoped" if it contains its own Class I or II
// rating — in that case beginner language inside the same string is correct.
function sectionIsLowClass(s) {
  return /\bClass\s+I{1,2}\b/i.test(s) && !/\bClass\s+(III|IV|V)\b/i.test(s)
}
const MUST_PORTAGE_TRIGGERS = /\b(unrunnable|mandatory portage|portage(?:\s+required)?|do not run|must portage)\b/i
const HAZARD_LOWHEAD = /\b(low[- ]head dam)\b/i
const HAZARD_LOWHEAD_GENERIC = /\b(weir|low[- ]head|drowning machine)\b/i
const STRAINER_TERM = /\bstrainer/i
const NAMED_CLASS_V_RAPID = /\b(Pillow Rock|Iron Ring|Sweet's Falls|Gauley Falls|Lost Paddle|Five Falls|Corkscrew|Crack[- ]in[- ]the[- ]Rock|Jawbone|Sock'?em Dog|Big Drops?|Lava Falls|Crystal Rapid|Granite Rapid|Bridal Veil|Shipwreck|Pinball|Cherry Creek)\b/i

for (const r of rivers) {
  const desc = extractScalar(r.body, 'desc') || ''
  const cls = extractScalar(r.body, 'cls') || ''
  const opt = extractScalar(r.body, 'opt') || ''
  const name = extractScalar(r.body, 'n') || r.id
  const ww = extractBool(r.body, 'ww')
  const secs = extractStringArray(r.body, 'secs')
  const secsText = secs.join(' \n ')

  const allText = `${desc}\n${secsText}`
  const clsNum = classToNumber(cls)
  const mentionedClass = Math.max(highestClassMentioned(desc), highestClassMentioned(secsText))

  const issues = { red: [], yellow: [] }

  // ── 1. Class consistency ─────────────────────────────────────
  if (clsNum > 0 && mentionedClass > clsNum + 1) {
    issues.red.push(`CLASS_MISMATCH: cls='${cls}' (${clsNum}) but secs/desc mention Class ${mentionedClass}`)
  } else if (clsNum > 0 && mentionedClass > clsNum) {
    issues.yellow.push(`CLASS_DRIFT: cls='${cls}' (${clsNum}) but secs/desc mention Class ${mentionedClass}`)
  }

  // Class V mentioned but no portage warning anywhere
  if (mentionedClass >= 5 && !MUST_PORTAGE_TRIGGERS.test(allText)) {
    issues.yellow.push(`CLASS_V_NO_PORTAGE_NOTE: Class V+ rapids mentioned but no portage/unrunnable language`)
  }

  // ── 2. CFS range sanity ──────────────────────────────────────
  if (opt) {
    // Parse "200–800" or "200-800"
    const rng = opt.replace(/[–—]/g, '-').match(/(\d+)\s*-\s*(\d+)/)
    if (rng) {
      const lo = parseInt(rng[1], 10)
      const hi = parseInt(rng[2], 10)
      if (lo > 0 && hi > lo) {
        const ratio = hi / lo
        if (ratio > 15) {
          issues.red.push(`OPT_RANGE_INSANE: ${opt} (${ratio.toFixed(1)}x ratio)`)
        } else if (ratio > 8) {
          issues.yellow.push(`OPT_RANGE_WIDE: ${opt} (${ratio.toFixed(1)}x ratio)`)
        }
        // No-low-end check on steep rivers — if max class >= IV and lo < 100
        if (mentionedClass >= 4 && lo < 50) {
          issues.yellow.push(`OPT_LOW_BOUND_LOW: cls IV+ run with low-end ${lo} cfs`)
        }
      }
    } else {
      // Open-ended like "300+" or "above 500" — no upper bound on whitewater is risky
      if (mentionedClass >= 3 && /\+|above|over/i.test(opt)) {
        issues.yellow.push(`OPT_NO_UPPER_BOUND: '${opt}' on Class III+ run`)
      }
    }
  }

  // ── 3. Inconsistent beginner claims ──────────────────────────
  // Check desc and each sec independently.
  // A beginner claim inside `desc` is bad if desc itself mentions Class III+
  // without explicit section scoping ("upper", "lower", etc.). A beginner claim
  // inside a `sec` string is fine if that same string is Class I or II.
  const descClass = highestClassMentioned(desc)
  if (BEGINNER_PHRASES.test(desc)) {
    if (descClass >= 4) {
      const phrase = desc.match(BEGINNER_PHRASES)[0]
      issues.red.push(`UNSAFE_BEGINNER_CLAIM: "${phrase}" alongside Class ${descClass} in desc`)
    } else if (descClass >= 3) {
      const phrase = desc.match(BEGINNER_PHRASES)[0]
      issues.yellow.push(`BEGINNER_CLAIM_CHECK: "${phrase}" alongside Class ${descClass} in desc`)
    }
  }
  for (const sec of secs) {
    if (BEGINNER_PHRASES.test(sec) && !sectionIsLowClass(sec)) {
      const secClass = highestClassMentioned(sec)
      if (secClass >= 4) {
        const phrase = sec.match(BEGINNER_PHRASES)[0]
        issues.red.push(`UNSAFE_BEGINNER_CLAIM: "${phrase}" in section "${sec.substring(0, 60)}..."`)
      } else if (secClass >= 3) {
        const phrase = sec.match(BEGINNER_PHRASES)[0]
        issues.yellow.push(`BEGINNER_CLAIM_CHECK: "${phrase}" in section`)
      }
    }
  }

  // ── 4. Cross-field: ww:true with cls=I/Riffles ───────────────
  if (ww === true && clsNum <= 1 && mentionedClass < 2) {
    issues.yellow.push(`WW_TAG_NO_RAPIDS: ww:true but cls='${cls}' and no Class II+ mentioned`)
  }

  // ── 5. Low-head dam hazard mention without warning ───────────
  if (HAZARD_LOWHEAD.test(allText) && !/dangerous|hazard|portage|drowning|never run|do not/i.test(allText)) {
    issues.yellow.push(`LOWHEAD_NO_WARNING: low-head dam mentioned without explicit hazard warning`)
  }

  // ── 6. Named Class V rapid mentioned but no portage note ─────
  if (NAMED_CLASS_V_RAPID.test(allText) && !MUST_PORTAGE_TRIGGERS.test(allText)) {
    const named = allText.match(NAMED_CLASS_V_RAPID)[0]
    issues.yellow.push(`NAMED_RAPID_NO_NOTE: '${named}' mentioned but no portage/scout note`)
  }

  // ── 7. Strainer mention without warning ──────────────────────
  if (STRAINER_TERM.test(allText) && !/scout|caution|hazard|warning/i.test(allText)) {
    issues.yellow.push(`STRAINER_NO_WARNING: strainer mentioned without scout/warning language`)
  }

  if (issues.red.length) flags.red.push({ id: r.id, name, cls, opt, ww, mentionedClass, issues: issues.red })
  if (issues.yellow.length) flags.yellow.push({ id: r.id, name, cls, opt, ww, mentionedClass, issues: issues.yellow })
}

console.log()
console.log('========================================')
console.log(`RED FLAGS: ${flags.red.length}`)
console.log('========================================')
for (const f of flags.red) {
  console.log()
  console.log(`[${f.id}] ${f.name}  (cls='${f.cls}' opt='${f.opt}' ww=${f.ww})`)
  for (const i of f.issues) console.log(`  • ${i}`)
}

console.log()
console.log('========================================')
console.log(`YELLOW FLAGS: ${flags.yellow.length}`)
console.log('========================================')
for (const f of flags.yellow) {
  console.log()
  console.log(`[${f.id}] ${f.name}  (cls='${f.cls}' opt='${f.opt}' ww=${f.ww})`)
  for (const i of f.issues) console.log(`  • ${i}`)
}

// Summary
console.log()
console.log('========================================')
console.log('SUMMARY')
console.log('========================================')
const byType = {}
for (const f of [...flags.red, ...flags.yellow]) {
  for (const i of f.issues) {
    const key = i.split(':')[0]
    byType[key] = (byType[key] || 0) + 1
  }
}
for (const [k, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${k}: ${v}`)
}

// Write JSON for programmatic fix script
fs.writeFileSync(
  path.join(__dirname, '..', 'tmp-safety-audit.json'),
  JSON.stringify(flags, null, 2),
)
console.log()
console.log('Wrote tmp-safety-audit.json')
