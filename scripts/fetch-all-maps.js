// Fetch NHDPlus geometry for all rivers that don't have map files yet
// Then generate map data files with river polylines
const https = require('https');
const fs = require('fs');
const path = require('path');

// Parse rivers.ts to get all river IDs, names, and approximate coordinates
const riversSrc = fs.readFileSync(path.join(__dirname, '..', 'data', 'rivers.ts'), 'utf8');
const coordsSrc = fs.readFileSync(path.join(__dirname, '..', 'data', 'river-coordinates.ts'), 'utf8');

// Get existing map files
const mapsDir = path.join(__dirname, '..', 'data', 'river-maps');
const existingMaps = new Set(
  fs.readdirSync(mapsDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
    .map(f => f.replace('.ts', ''))
);

// Parse coordinates
const coords = {};
const coordRe = /(\w+): \[([-\d.]+), ([-\d.]+)\]/g;
let m;
while ((m = coordRe.exec(coordsSrc)) !== null) {
  coords[m[1]] = { lat: parseFloat(m[2]), lng: parseFloat(m[3]) };
}

// Parse river names
const rivers = [];
const lines = riversSrc.split('\n');
let currentState = '';
for (const line of lines) {
  const stateM = line.match(/\/\/ ── ([A-Z ]+) ─/);
  if (stateM) currentState = stateM[1].trim();

  const idM = line.match(/id: ['"]([^'"]+)['"]/);
  if (idM) {
    const id = idM[1];
    const nameM = line.match(/n: ['"]([^'"]+)['"]/);
    const name = nameM ? nameM[1] : id;

    if (!existingMaps.has(id) && coords[id]) {
      rivers.push({ id, name, lat: coords[id].lat, lng: coords[id].lng, state: currentState });
    }
  }
}

console.log('Rivers needing maps: ' + rivers.length);
console.log('Rivers with coordinates: ' + Object.keys(coords).length);
console.log('Existing maps: ' + existingMaps.size);

function dist(a, b) {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2);
}

function fetchRiver(river) {
  return new Promise((resolve) => {
    // Search in a bounding box around the river's known coordinates
    const pad = 0.3; // ~20 miles
    const bbox = `${river.lng - pad},${river.lat - pad},${river.lng + pad},${river.lat + pad}`;

    // Clean the name for NHD query — remove parentheticals, state suffixes, dashes
    let queryName = river.name
      .replace(/\s*\(.*?\)\s*/g, '')       // remove (Glen Arbor) etc
      .replace(/\s*—\s*.*/g, '')            // remove — subtitle
      .replace(/ River$/, ' River')         // keep River
      .replace(/ Creek$/, ' Creek')
      .trim();

    // Some names need special handling
    if (queryName.includes('South Fork')) queryName = 'South Fork ' + queryName.split('South Fork ')[1];
    if (queryName.includes('North Fork')) queryName = 'North Fork ' + queryName.split('North Fork ')[1];
    if (queryName.includes('Middle Fork')) queryName = 'Middle Fork ' + queryName.split('Middle Fork ')[1];

    const encodedName = encodeURIComponent(queryName);
    const url = `https://hydro.nationalmap.gov/arcgis/rest/services/NHDPlus_HR/MapServer/3/query?where=gnis_name%3D%27${encodedName}%27&outFields=gnis_name,lengthkm&returnGeometry=true&f=geojson&outSR=4326&geometryType=esriGeometryEnvelope&geometry=${bbox}&inSR=4326&spatialRel=esriSpatialRelIntersects&resultRecordCount=100&maxAllowableOffset=0.001`;

    const timeout = setTimeout(() => resolve({ id: river.id, points: 0 }), 15000);

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        clearTimeout(timeout);
        try {
          const geojson = JSON.parse(data);
          if (!geojson.features || geojson.features.length === 0) {
            resolve({ id: river.id, points: 0 });
            return;
          }

          const segments = geojson.features
            .filter(f => f.geometry && f.geometry.type === 'LineString')
            .map(f => f.geometry.coordinates);

          if (segments.length === 0) {
            resolve({ id: river.id, points: 0 });
            return;
          }

          // Stitch segments
          const used = new Set();
          const chain = [];
          let startIdx = 0;
          let maxLen = 0;
          segments.forEach((s, i) => { if (s.length > maxLen) { maxLen = s.length; startIdx = i; } });
          chain.push(...segments[startIdx]);
          used.add(startIdx);

          for (let iter = 0; iter < segments.length; iter++) {
            const tail = chain[chain.length - 1];
            const head = chain[0];
            let bestIdx = -1, bestDist = 0.005, bestReverse = false, bestEnd = 'tail';
            for (let i = 0; i < segments.length; i++) {
              if (used.has(i)) continue;
              const s = segments[i];
              const dts = dist(s[0], tail);
              const dte = dist(s[s.length-1], tail);
              const dhs = dist(s[0], head);
              const dhe = dist(s[s.length-1], head);
              if (dts < bestDist) { bestDist = dts; bestIdx = i; bestReverse = false; bestEnd = 'tail'; }
              if (dte < bestDist) { bestDist = dte; bestIdx = i; bestReverse = true; bestEnd = 'tail'; }
              if (dhs < bestDist) { bestDist = dhs; bestIdx = i; bestReverse = true; bestEnd = 'head'; }
              if (dhe < bestDist) { bestDist = dhe; bestIdx = i; bestReverse = false; bestEnd = 'head'; }
            }
            if (bestIdx === -1) break;
            const seg = bestReverse ? [...segments[bestIdx]].reverse() : [...segments[bestIdx]];
            if (bestEnd === 'tail') chain.push(...seg);
            else chain.unshift(...seg);
            used.add(bestIdx);
          }

          // Simplify to ~100 points
          const target = 100;
          const step = Math.max(1, Math.floor(chain.length / target));
          const simplified = [];
          for (let i = 0; i < chain.length; i += step) {
            simplified.push([
              Math.round(chain[i][0] * 100000) / 100000,
              Math.round(chain[i][1] * 100000) / 100000
            ]);
          }
          const last = chain[chain.length-1];
          simplified.push([Math.round(last[0]*100000)/100000, Math.round(last[1]*100000)/100000]);

          resolve({ id: river.id, name: river.name, state: river.state, points: simplified.length, path: simplified });
        } catch {
          resolve({ id: river.id, points: 0 });
        }
      });
    }).on('error', () => { clearTimeout(timeout); resolve({ id: river.id, points: 0 }); });
  });
}

async function main() {
  let success = 0;
  let failed = 0;
  const batchSize = 5;
  const registryEntries = [];

  // Load existing registry entries
  const idxSrc = fs.readFileSync(path.join(mapsDir, 'index.ts'), 'utf8');
  const existingEntries = (idxSrc.match(/^\s{2}(\w+):/gm) || []).map(m => m.trim().replace(':', ''));

  for (let i = 0; i < rivers.length; i += batchSize) {
    const batch = rivers.slice(i, i + batchSize);
    process.stderr.write(`Batch ${Math.floor(i/batchSize)+1}/${Math.ceil(rivers.length/batchSize)}: ${batch.map(r=>r.id).join(', ')}\n`);

    const results = await Promise.all(batch.map(fetchRiver));

    for (const r of results) {
      if (r.points >= 5) {
        success++;
        // Write map file
        const content = `import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'\n\n// ${r.name} (${r.state}) — geometry from USGS NHDPlus HR\n// ${r.points} points\n\nexport const accessPoints: AccessPoint[] = []\n\nexport const sections: RiverSection[] = []\n\nexport const riverPath: [number, number][] = [\n${r.path.map(([lng, lat]) => `  [${lng}, ${lat}],`).join('\n')}\n]\n`;
        fs.writeFileSync(path.join(mapsDir, r.id + '.ts'), content);
        registryEntries.push(r.id);
      } else {
        failed++;
      }
    }

    // Small delay between batches
    if (i + batchSize < rivers.length) await new Promise(r => setTimeout(r, 800));
  }

  // Rebuild registry
  const allIds = [...new Set([...existingEntries, ...registryEntries])].sort();
  const registry = `import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

interface RiverMapData {
  accessPoints: AccessPoint[]
  sections: RiverSection[]
  riverPath: [number, number][]
}

const registry: Record<string, () => Promise<RiverMapData>> = {
${allIds.map(id => `  ${id}: () => import('./${id}').then(m => ({\n    accessPoints: m.accessPoints,\n    sections: m.sections,\n    riverPath: m.riverPath,\n  })),`).join('\n')}
}

export function hasRiverMap(riverId: string): boolean {
  return riverId in registry
}

export async function loadRiverMap(riverId: string): Promise<RiverMapData | null> {
  const loader = registry[riverId]
  if (!loader) return null
  return loader()
}
`;
  fs.writeFileSync(path.join(mapsDir, 'index.ts'), registry);

  process.stderr.write(`\nDone. Success: ${success}, Failed: ${failed}, Total maps: ${allIds.length}\n`);
}

main();
