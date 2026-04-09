const fs = require('fs')
const path = require('path')

const content = fs.readFileSync(path.join(__dirname, '..', 'data', 'fisheries.ts'), 'utf-8')

// Find ausable
const idx = content.indexOf('  ausable: {')
const end = content.indexOf('\n  },', idx)
const body = content.substring(idx + '  ausable: {'.length + 1, end)

console.log('BODY (first 300 chars):')
console.log(body.substring(0, 300))
console.log()

function extractBlock(name, body) {
  const startRe = new RegExp(`(^|\\s)${name}:\\s*\\[`)
  let inBlock = false
  let depth = 0
  const collected = []
  for (const line of body.split('\n')) {
    if (!inBlock && startRe.test(line)) {
      inBlock = true
      for (const ch of line) {
        if (ch === '[') depth++
        if (ch === ']') depth--
      }
      collected.push(line)
      if (depth === 0) break
      continue
    }
    if (inBlock) {
      collected.push(line)
      for (const ch of line) {
        if (ch === '[') depth++
        if (ch === ']') depth--
      }
      if (depth === 0) break
    }
  }
  return collected.join('\n')
}

const speciesText = extractBlock('species', body)
console.log('=== SPECIES BLOCK ===')
console.log(speciesText)
console.log()
const matches = [...speciesText.matchAll(/name:\s*['"]([^'"]+)['"]/g)]
console.log('Species names found:', matches.length)
matches.forEach(m => console.log('  -', m[1]))
