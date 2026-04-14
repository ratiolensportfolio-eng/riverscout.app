#!/usr/bin/env node
// Split supabase/seeds/access_points_nrp.sql into chunks small enough
// for the Supabase SQL Editor (~200 KB each). Each chunk gets its own
// begin/commit. River blocks are never split across chunks.

const fs = require('fs')
const path = require('path')

const SRC = path.resolve(__dirname, '..', 'supabase', 'seeds', 'access_points_nrp.sql')
const OUT_DIR = path.resolve(__dirname, '..', 'supabase', 'seeds', 'nrp_chunks')
const MAX_BYTES = 200 * 1024

const src = fs.readFileSync(SRC, 'utf8')

// Body = everything between `begin;` and `commit;`
const begin = src.indexOf('begin;')
const commit = src.lastIndexOf('commit;')
const body = src.slice(src.indexOf('\n', begin) + 1, commit).trim()

// Split on blank lines that precede `-- <river_id>:` headers.
const blocks = body.split(/\n(?=-- [a-z0-9_]+:)/)

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })

let chunkIdx = 1
let buf = ''
function flush() {
  if (!buf.trim()) return
  const out = `begin;\n\n${buf.trimEnd()}\n\ncommit;\n`
  const name = `nrp_${String(chunkIdx).padStart(3, '0')}.sql`
  fs.writeFileSync(path.join(OUT_DIR, name), out)
  console.log(`  ${name}  ${(out.length / 1024).toFixed(1)} KB`)
  chunkIdx++
  buf = ''
}

for (const block of blocks) {
  const b = block.trim() + '\n\n'
  if (buf.length + b.length > MAX_BYTES && buf.length > 0) flush()
  buf += b
}
flush()

console.log(`\nWrote ${chunkIdx - 1} chunks to ${OUT_DIR}`)
