// Seed script: reads rivers.ts data and generates SQL INSERT statements
// Run: node scripts/seed-rivers.js > supabase/seed.sql
//
// This script uses eval to parse the TypeScript data exports.
// It generates a massive SQL file to populate all river tables.

const fs = require('fs');
const path = require('path');

// Helper to escape SQL strings
function esc(s) {
  if (s === null || s === undefined) return 'NULL';
  return "'" + String(s).replace(/'/g, "''") + "'";
}

function escOrNull(s) {
  if (!s) return 'NULL';
  return esc(s);
}

// Parse rivers.ts — extract the STATES object
// We'll use a regex-based approach since we can't import TypeScript
const riversSrc = fs.readFileSync(path.join(__dirname, '..', 'data', 'rivers.ts'), 'utf8');

// Extract the STATES object by finding its bounds
const statesStart = riversSrc.indexOf('export const STATES');
const derivedStart = riversSrc.indexOf('// ── Derived helpers');
const statesBlock = riversSrc.slice(statesStart, derivedStart);

// Use eval to parse it (strip TypeScript types first)
let cleaned = statesBlock
  .replace(/^export const STATES: StatesDB = /, 'STATES = ')
  .replace(/import type.*$/gm, '');

var STATES;
try {
  eval(cleaned);
} catch (e) {
  console.error('Failed to parse STATES:', e.message);
  console.error('Near:', cleaned.slice(0, 200));
  process.exit(1);
}

// Parse fisheries.ts
var FISHERIES = {};
try {
  const fishSrc = fs.readFileSync(path.join(__dirname, '..', 'data', 'fisheries.ts'), 'utf8');
  let fishCleaned = fishSrc
    .replace(/^import.*$/gm, '')
    .replace(/export const FISHERIES: Record<string, RiverFisheries> = /, 'FISHERIES = ');
  eval(fishCleaned);
} catch (e) {
  console.error('Warning: Could not parse fisheries.ts:', e.message);
}

// Parse rapids.ts
var RAPIDS = {};
try {
  const rapidsSrc = fs.readFileSync(path.join(__dirname, '..', 'data', 'rapids.ts'), 'utf8');
  let rapidsCleaned = rapidsSrc
    .replace(/^import.*$/gm, '')
    .replace(/export interface NamedRapid \{[^}]*\}/s, '')
    .replace(/export const RAPIDS: Record<string, NamedRapid\[\]> = /, 'RAPIDS = ');
  eval(rapidsCleaned);
} catch (e) {
  console.error('Warning: Could not parse rapids.ts:', e.message);
}

// Generate SQL
const sql = [];

sql.push('-- RiverScout Database Seed');
sql.push('-- Generated ' + new Date().toISOString());
sql.push('-- ' + Object.keys(STATES).length + ' states, counting rivers...');
sql.push('');

// Insert states
sql.push('-- ══ STATES ══');
for (const [key, state] of Object.entries(STATES)) {
  sql.push(`INSERT INTO public.states (key, name, abbr, label, filters, filter_labels) VALUES (${esc(key)}, ${esc(state.name)}, ${esc(state.abbr)}, ${esc(state.label)}, ARRAY[${state.filters.map(f => esc(f)).join(',')}], ${esc(JSON.stringify(state.fL))}) ON CONFLICT (key) DO NOTHING;`);
}

sql.push('');
sql.push('-- ══ RIVERS ══');
let riverCount = 0;

for (const [stateKey, state] of Object.entries(STATES)) {
  for (const r of state.rivers) {
    riverCount++;
    const flags = {};
    // Extract boolean filter flags
    for (const [k, v] of Object.entries(r)) {
      if (typeof v === 'boolean') flags[k] = v;
    }

    sql.push(`INSERT INTO public.rivers (id, state_key, name, county, length, class, optimal_cfs, usgs_gauge, avg_cfs, hist_flow, map_x, map_y, description, designations, sections, filter_flags) VALUES (${esc(r.id)}, ${esc(stateKey)}, ${esc(r.n)}, ${esc(r.co)}, ${esc(r.len)}, ${esc(r.cls)}, ${esc(r.opt)}, ${esc(r.g)}, ${r.avg}, ${r.histFlow}, ${r.mx}, ${r.my}, ${esc(r.desc)}, ${esc(r.desig)}, ARRAY[${(r.secs || []).map(s => esc(s)).join(',')}], ${esc(JSON.stringify(flags))}) ON CONFLICT (id) DO NOTHING;`);

    // History
    if (r.history) {
      let sortOrder = 0;
      for (const era of r.history) {
        for (const entry of era.entries) {
          sql.push(`INSERT INTO public.river_history (river_id, era, year, title, body, source, sort_order) VALUES (${esc(r.id)}, ${esc(era.era)}, ${esc(entry.yr)}, ${esc(entry.title)}, ${esc(entry.text)}, ${esc(entry.src)}, ${sortOrder++});`);
        }
      }
    }

    // Documents
    if (r.docs) {
      for (const doc of r.docs) {
        sql.push(`INSERT INTO public.river_documents (river_id, title, source, year, doc_type, pages, url) VALUES (${esc(r.id)}, ${esc(doc.t)}, ${esc(doc.s)}, ${doc.y}, ${esc(doc.tp)}, ${doc.pg}, ${escOrNull(doc.url)});`);
      }
    }

    // Reviews
    if (r.revs) {
      for (const rev of r.revs) {
        sql.push(`INSERT INTO public.river_reviews (river_id, username, review_date, stars, body, is_seed) VALUES (${esc(r.id)}, ${esc(rev.u)}, ${esc(rev.d)}, ${rev.s}, ${esc(rev.t)}, true);`);
      }
    }

    // Outfitters
    if (r.outs) {
      for (const out of r.outs) {
        sql.push(`INSERT INTO public.river_outfitters (river_id, name, description, link, is_seed) VALUES (${esc(r.id)}, ${esc(out.n)}, ${esc(out.d)}, ${esc(out.l || '')}, true);`);
      }
    }
  }
}

// Fisheries
sql.push('');
sql.push('-- ══ FISHERIES ══');
for (const [riverId, fish] of Object.entries(FISHERIES)) {
  // Species
  for (const sp of (fish.species || [])) {
    sql.push(`INSERT INTO public.river_species (river_id, name, species_type, is_primary, notes) VALUES (${esc(riverId)}, ${esc(sp.name)}, ${esc(sp.type)}, ${sp.primary}, ${escOrNull(sp.notes)});`);
  }

  // Designations
  for (const d of (fish.designations || [])) {
    sql.push(`INSERT INTO public.river_designations_fish (river_id, designation) VALUES (${esc(riverId)}, ${esc(d)});`);
  }

  // Spawning
  for (const s of (fish.spawning || [])) {
    sql.push(`INSERT INTO public.river_spawning (river_id, species, season, notes) VALUES (${esc(riverId)}, ${esc(s.species)}, ${esc(s.season)}, ${escOrNull(s.notes)});`);
  }

  // Hatches
  let hatchOrder = 0;
  for (const h of (fish.hatches || [])) {
    sql.push(`INSERT INTO public.river_hatches (river_id, name, timing, notes, sort_order) VALUES (${esc(riverId)}, ${esc(h.name)}, ${esc(h.timing)}, ${escOrNull(h.notes)}, ${hatchOrder++});`);
  }

  // Runs
  for (const r of (fish.runs || [])) {
    sql.push(`INSERT INTO public.river_runs (river_id, species, timing, peak, notes) VALUES (${esc(riverId)}, ${esc(r.species)}, ${esc(r.timing)}, ${escOrNull(r.peak)}, ${escOrNull(r.notes)});`);
  }

  // Guides
  for (const g of (fish.guides || [])) {
    sql.push(`INSERT INTO public.river_guides (river_id, name) VALUES (${esc(riverId)}, ${esc(g)});`);
  }
}

// Rapids
sql.push('');
sql.push('-- ══ RAPIDS ══');
for (const [riverId, rapids] of Object.entries(RAPIDS)) {
  let sortOrder = 0;
  for (const rapid of rapids) {
    sql.push(`INSERT INTO public.river_rapids (river_id, name, class, lat, lng, description, mile, sort_order) VALUES (${esc(riverId)}, ${esc(rapid.name)}, ${esc(rapid.class)}, ${rapid.lat}, ${rapid.lng}, ${esc(rapid.description)}, ${rapid.mile || 'NULL'}, ${sortOrder++});`);
  }
}

sql.push('');
sql.push('-- ══ DONE ══');
sql.push('-- ' + riverCount + ' rivers seeded');

// Write output
const output = sql.join('\n');
fs.writeFileSync(path.join(__dirname, '..', 'supabase', 'seed.sql'), output);
console.error('Generated seed.sql: ' + riverCount + ' rivers, ' + sql.length + ' SQL statements');
console.error('Fisheries entries: ' + Object.keys(FISHERIES).length);
console.error('Rapids entries: ' + Object.keys(RAPIDS).length);
