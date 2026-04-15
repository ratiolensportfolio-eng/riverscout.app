#!/usr/bin/env node
// Accurate Supabase query audit — walks each `.from(...)` call to
// its terminator (await / .then / assignment end) and flags only
// queries that are BOTH unfiltered AND unlimited AND not using
// count-only mode. Also flags queries that COULD return thousands
// of rows without a .limit() even if filtered (e.g. select * from
// saved_rivers where user_id = ... — bounded, fine — vs select *
// from river_hazards — flat scan).
//
// Output: reports/12b-db-query-audit-REFINED-<DATE>.md

const fs = require('fs')
const path = require('path')
const REPO = path.resolve(__dirname, '..')
const DATE = new Date().toISOString().slice(0, 10)

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name)
    if (f.isDirectory()) {
      if (!p.includes('node_modules') && !p.includes('.next')) walk(p, out)
    } else if (/\.(ts|tsx)$/.test(f.name)) {
      out.push(p)
    }
  }
  return out
}

function findFromBlocks(src) {
  // For each `.from('<table>')`, grab the chain up to the next
  // statement terminator (`;`, closing `}`, bare newline-newline).
  const blocks = []
  const re = /\.from\(['"]([a-z_]+)['"]\)/g
  let m
  while ((m = re.exec(src))) {
    const start = m.index
    // Find the chain end — walk forward until we hit a line with no
    // leading `.` (unindented next statement) or `await` resolves.
    let i = start
    let depth = 0
    while (i < src.length) {
      const c = src[i]
      if (c === '(') depth++
      else if (c === ')') depth--
      else if (c === ';' && depth === 0) break
      else if (c === '\n' && depth === 0) {
        // Peek next non-space — if it's not `.`, chain is over.
        let j = i + 1
        while (j < src.length && (src[j] === ' ' || src[j] === '\t')) j++
        if (src[j] !== '.' && src[j] !== ',' && src[j] !== ')' && src[j] !== '}') break
      }
      i++
    }
    blocks.push({ table: m[1], text: src.slice(start, i + 1), offset: start })
  }
  return blocks
}

// Tables that are inherently small and OK unfiltered (< ~50 rows
// expected). Queries hitting these don't need .limit().
const SMALL_TABLES = new Set([
  'states',          // ~50 rows
  'gauge_mappings',  // ~500 rows but uncommonly queried
])

function classify(block, filename) {
  const t = block.text
  const hasFilter = /\.(eq|in|gt|lt|gte|lte|match|or|ilike|like|contains|filter|overlaps|neq)\(/.test(t)
  const hasLimit = /\.limit\(/.test(t)
  const hasCountOnly = /count:\s*['"]exact['"]/.test(t) && /head:\s*true/.test(t)
  const hasMaybeSingle = /\.maybeSingle\(/.test(t)
  const hasSingle = /\.single\(/.test(t)
  const isMutation = /\.(insert|update|delete|upsert)\(/.test(t)

  // insert/update/delete are constrained by the filter clause, not
  // the result size — skip them unless DELETE without WHERE.
  if (isMutation) {
    // delete without filter = catastrophic
    if (/\.delete\(\)/.test(t) && !hasFilter) {
      return { severity: 'CRITICAL', reason: 'unfiltered DELETE' }
    }
    if (/\.update\(/.test(t) && !hasFilter) {
      return { severity: 'CRITICAL', reason: 'unfiltered UPDATE' }
    }
    return null  // mutations with filters are fine
  }

  if (hasCountOnly) return null            // count-only is OK
  if (hasMaybeSingle || hasSingle) return null  // single-row reads are bounded

  if (SMALL_TABLES.has(block.table)) return null

  if (!hasFilter && !hasLimit) {
    return { severity: 'HIGH', reason: 'unfiltered + unlimited select' }
  }
  if (hasFilter && !hasLimit) {
    // Filter-only SELECT. Could still return many rows on unbounded
    // filter columns (e.g., .eq('active', true) on a 10k-row table).
    // Flag as MEDIUM so a human can sanity-check.
    return { severity: 'MEDIUM', reason: 'filtered but no .limit() — confirm result size is bounded' }
  }
  return null
}

function main() {
  const files = walk(path.join(REPO, 'app')).concat(walk(path.join(REPO, 'lib')))
  const issues = []
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8')
    for (const b of findFromBlocks(src)) {
      const c = classify(b, f)
      if (!c) continue
      issues.push({ file: path.relative(REPO, f), table: b.table, ...c, snippet: b.text.slice(0, 200).replace(/\s+/g, ' ') })
    }
  }

  const crit = issues.filter(i => i.severity === 'CRITICAL')
  const high = issues.filter(i => i.severity === 'HIGH')
  const med  = issues.filter(i => i.severity === 'MEDIUM')

  const lines = [
    `# DB Query Audit — REFINED — ${DATE}`,
    '',
    `Accurate walk: 🔴 CRITICAL=${crit.length}, 🟠 HIGH=${high.length}, 🟡 MEDIUM=${med.length}.`,
    '',
    '## 🔴 CRITICAL — unfiltered DELETE / UPDATE',
    crit.length ? '' : '(none)',
  ]
  for (const i of crit) lines.push(`- \`${i.file}\`  table=\`${i.table}\`  ${i.reason}\n  > ${i.snippet}`)
  lines.push('', '## 🟠 HIGH — unfiltered + unlimited SELECT (potential full scan)')
  lines.push(high.length ? '' : '(none)')
  for (const i of high) lines.push(`- \`${i.file}\`  table=\`${i.table}\`\n  > ${i.snippet}`)
  lines.push('', '## 🟡 MEDIUM — filtered but unlimited (size assumption check)')
  lines.push(`${med.length} occurrences across these files:`)
  const byFile = {}
  for (const i of med) (byFile[i.file] ||= []).push(i)
  for (const [f, arr] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
    lines.push(`- \`${f}\` — ${arr.length} call sites`)
  }

  const out = path.join(REPO, 'reports', `12b-db-query-audit-REFINED-${DATE}.md`)
  fs.writeFileSync(out, lines.join('\n'))
  console.log(`CRITICAL: ${crit.length}`)
  console.log(`HIGH:     ${high.length}`)
  console.log(`MEDIUM:   ${med.length}`)
  console.log('Report:', out)
}

main()
