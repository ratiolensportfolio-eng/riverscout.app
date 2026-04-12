#!/usr/bin/env python3
"""
Phase 2 batch river map extraction from NHDPlus HR.

Reads scripts/river_extraction_map.csv, groups rivers by HUC4,
checks which GDBs exist in the work folder, and extracts every
river whose .ts file doesn't already exist in data/river-maps/.

Usage:
    python scripts/extract_phase2.py

    # Override defaults:
    python scripts/extract_phase2.py \
        --gdb-root D:/nhdplus \
        --simplify 5 \
        --force \
        --only manistee ausable_sb

The script prints a download list at startup showing which HUC4
archives are still needed, with full S3 URLs.

Dependencies:
    pip install geopandas fiona shapely pyproj
"""

import argparse
import csv
import sys
import time
from pathlib import Path
from collections import defaultdict

try:
    import geopandas as gpd
    from shapely.geometry import LineString, MultiLineString
    from shapely.ops import linemerge
except ImportError:
    print("ERROR: geopandas not installed. Run:")
    print("  pip install geopandas fiona shapely pyproj")
    print("Or with conda:")
    print("  conda install -c conda-forge geopandas fiona shapely pyproj")
    sys.exit(1)


# ── Defaults ──────────────────────────────────────────────────
DEFAULT_GDB_ROOT = r"C:\Users\Alaney\Desktop\nhdplus-work"
DEFAULT_CSV = "scripts/river_extraction_map.csv"
DEFAULT_OUT_DIR = "data/river-maps"
DEFAULT_SIMPLIFY = 5.0  # meters
S3_BASE = "https://prd-tnm.s3.amazonaws.com/StagedProducts/Hydrography/NHDPlusHR/Beta/GDB"


def find_gdb(gdb_root: Path, huc4: str) -> Path | None:
    """Locate the .gdb folder for a HUC4 under various unzip layouts."""
    candidates = [
        # Standard unzip: folder/folder.gdb
        gdb_root / f"NHDPLUS_H_{huc4}_HU4_GDB" / f"NHDPLUS_H_{huc4}_HU4_GDB.gdb",
        # Flat unzip: just the .gdb at root level
        gdb_root / f"NHDPLUS_H_{huc4}_HU4_GDB.gdb",
        # Double-nested (some unzip tools create an extra level)
        gdb_root / f"NHDPLUS_H_{huc4}_HU4_GDB" / "NHDPLUS_H" / f"NHDPLUS_H_{huc4}_HU4_GDB.gdb",
        # User-organized by HUC
        gdb_root / huc4 / f"NHDPLUS_H_{huc4}_HU4_GDB.gdb",
    ]
    for c in candidates:
        if c.exists():
            return c
    # Glob fallback
    matches = list(gdb_root.rglob(f"NHDPLUS_H_{huc4}*.gdb"))
    return matches[0] if matches else None


def extract_one(slug: str, gnis: str, gdf: gpd.GeoDataFrame,
                simplify_m: float, out_path: Path) -> str:
    """
    Extract a single river from an already-loaded GeoDataFrame.
    Returns: 'extracted' | 'not_found' | 'too_few_points'
    """
    # Exact match on GNIS_Name (case-insensitive)
    mask = gdf["GNIS_Name"].str.lower().fillna("") == gnis.lower()
    matches = gdf[mask]

    # Fallback: partial/contains match for names that differ
    # slightly in NHD (e.g. "Dry Fork" vs "Dry Fork of Cheat")
    if len(matches) == 0:
        stem = gnis.lower()
        for suffix in [" river", " creek", " brook", " run", " fork", " branch"]:
            if stem.endswith(suffix):
                stem = stem[: -len(suffix)].strip()
                break
        if len(stem) >= 3:
            mask2 = gdf["GNIS_Name"].str.lower().fillna("").str.contains(stem, regex=False)
            matches = gdf[mask2]
            if len(matches) > 0:
                names = matches["GNIS_Name"].dropna().unique()[:5]
                print(f"      partial match ({len(matches)} lines): {list(names)}")

    if len(matches) == 0:
        return "not_found"

    # Reproject to WGS84 if needed
    if matches.crs and matches.crs.to_epsg() != 4326:
        matches = matches.to_crs("EPSG:4326")

    # Dissolve all matching reach segments into one geometry
    dissolved = matches.unary_union

    if isinstance(dissolved, LineString):
        merged = dissolved
    elif isinstance(dissolved, MultiLineString):
        merged = linemerge(dissolved)
        # If linemerge couldn't fully connect (gaps at reservoirs),
        # take the longest piece
        if isinstance(merged, MultiLineString):
            lines = sorted(merged.geoms, key=lambda g: g.length, reverse=True)
            merged = lines[0]
    else:
        return "not_found"

    # Simplify with Douglas-Peucker
    # ~0.00001 degrees ≈ 1 meter at mid-latitudes
    tolerance_deg = simplify_m * 0.00001
    simplified = merged.simplify(tolerance_deg, preserve_topology=False)

    # ── Z-coordinate stripping ──────────────────────────────
    # NHDPlus HR coordinates are often 3D (x, y, z) or even 4D
    # (x, y, z, m). Our TypeScript riverPath expects [lng, lat]
    # tuples. The *_ unpacking discards any extra dimensions.
    coords = [(x, y) for x, y, *_ in simplified.coords]

    if len(coords) < 3:
        return "too_few_points"

    # Build the TypeScript file
    ts_lines = [f"  [{lng:.4f}, {lat:.4f}]," for lng, lat in coords]
    ts_content = (
        "import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'\n"
        "\n"
        f"// {gnis} — geometry from USGS NHDPlus HR\n"
        f"// {len(coords)} points, simplified at ~{simplify_m}m tolerance\n"
        "// Generated by scripts/extract_phase2.py — do not hand-edit;\n"
        "// re-run the script if the data needs refreshing.\n"
        "\n"
        "export const accessPoints: AccessPoint[] = []\n"
        "\n"
        "export const sections: RiverSection[] = []\n"
        "\n"
        "export const riverPath: [number, number][] = [\n"
        + "\n".join(ts_lines)
        + "\n]\n"
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(ts_content, encoding="utf-8")
    return "extracted"


def main():
    p = argparse.ArgumentParser(
        description="Phase 2: batch extract river maps from NHDPlus HR"
    )
    p.add_argument("--csv", default=DEFAULT_CSV,
                   help=f"CSV mapping file (default: {DEFAULT_CSV})")
    p.add_argument("--gdb-root", default=DEFAULT_GDB_ROOT,
                   help=f"Folder with NHDPlus GDB downloads (default: {DEFAULT_GDB_ROOT})")
    p.add_argument("--out-dir", default=DEFAULT_OUT_DIR,
                   help=f"Output directory for .ts files (default: {DEFAULT_OUT_DIR})")
    p.add_argument("--simplify", type=float, default=DEFAULT_SIMPLIFY,
                   help=f"Douglas-Peucker tolerance in meters (default: {DEFAULT_SIMPLIFY})")
    p.add_argument("--only", nargs="*",
                   help="Only extract these slugs (default: all)")
    p.add_argument("--force", action="store_true",
                   help="Re-extract even if the .ts file already exists")
    args = p.parse_args()

    gdb_root = Path(args.gdb_root)
    out_dir = Path(args.out_dir)
    csv_path = Path(args.csv)

    if not csv_path.exists():
        print(f"ERROR: CSV not found at {csv_path}")
        sys.exit(1)

    # Read CSV
    with open(csv_path, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    if args.only:
        only_set = set(args.only)
        rows = [r for r in rows if r["slug"] in only_set]

    print("=" * 60)
    print("  RiverScout NHDPlus HR — Phase 2 Batch Extraction")
    print("=" * 60)
    print(f"  CSV:       {csv_path} ({len(rows)} rivers)")
    print(f"  GDB root:  {gdb_root}")
    print(f"  Output:    {out_dir}")
    print(f"  Simplify:  {args.simplify}m")
    print(f"  Force:     {args.force}")
    print()

    # Group by HUC4
    by_huc: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        by_huc[r["huc4"]].append(r)

    # ── DOWNLOAD LIST ──────────────────────────────────────────
    missing_hucs: list[tuple[str, list[dict]]] = []
    available_hucs: dict[str, Path] = {}

    for huc4 in sorted(by_huc.keys()):
        gdb_path = find_gdb(gdb_root, huc4)
        if gdb_path:
            available_hucs[huc4] = gdb_path
        else:
            missing_hucs.append((huc4, by_huc[huc4]))

    if missing_hucs:
        print("┌──────────────────────────────────────────────────┐")
        print("│  DOWNLOADS NEEDED                                │")
        print("└──────────────────────────────────────────────────┘")
        print()
        total_missing_rivers = 0
        for huc4, rivers in sorted(missing_hucs, key=lambda x: -len(x[1])):
            total_missing_rivers += len(rivers)
            slugs = [r["slug"] for r in rivers]
            states = sorted(set(r["state"] for r in rivers))
            print(f"  HUC4 {huc4}  ({len(rivers)} rivers, {'/'.join(states)})")
            print(f"    Rivers: {', '.join(slugs[:6)}{'...' if len(slugs) > 6 else ''}")
            print(f"    {S3_BASE}/NHDPLUS_H_{huc4}_HU4_GDB.zip")
            print()

        print(f"  TOTAL: {len(missing_hucs)} HUC4s to download ({total_missing_rivers} rivers)")
        print(f"         {len(available_hucs)} HUC4s already available ({sum(len(by_huc[h]) for h in available_hucs)} rivers)")
        print()

    if not available_hucs:
        print("No GDBs available. Download the archives listed above,")
        print(f"unzip them into {gdb_root}, and re-run.")
        sys.exit(0)

    # ── EXTRACTION ─────────────────────────────────────────────
    stats = {"extracted": 0, "skipped_exists": 0, "skipped_no_gdb": 0,
             "not_found": 0, "too_few": 0}
    not_found_list: list[tuple[str, str, str]] = []  # (slug, gnis, state)
    extracted_list: list[str] = []

    for huc4 in sorted(available_hucs.keys()):
        gdb_path = available_hucs[huc4]
        huc_rivers = by_huc[huc4]

        # Filter: skip rivers that already have a .ts file
        to_extract = []
        for r in huc_rivers:
            ts_path = out_dir / f"{r['slug']}.ts"
            if ts_path.exists() and not args.force:
                stats["skipped_exists"] += 1
            else:
                to_extract.append(r)

        if not to_extract:
            continue

        print(f"── HUC4 {huc4}: {len(to_extract)} rivers ──")
        print(f"   GDB: {gdb_path.name}")
        t0 = time.time()

        try:
            gdf = gpd.read_file(str(gdb_path), layer="NHDFlowline")
            elapsed_load = time.time() - t0
            print(f"   Loaded {len(gdf):,} flowlines in {elapsed_load:.1f}s")
        except Exception as e:
            print(f"   FAIL: could not read GDB: {e}")
            for r in to_extract:
                not_found_list.append((r["slug"], r["gnis_name"], str(e)))
                stats["not_found"] += 1
            continue

        for r in to_extract:
            ts_path = out_dir / f"{r['slug']}.ts"
            result = extract_one(
                r["slug"], r["gnis_name"], gdf,
                args.simplify, ts_path,
            )

            if result == "extracted":
                # Count points for the report
                pts = sum(1 for line in ts_path.read_text().split("\n")
                          if line.strip().startswith("["))
                size_kb = ts_path.stat().st_size / 1024
                print(f"   ✓ {r['slug']}: {pts} pts ({size_kb:.0f} KB)")
                stats["extracted"] += 1
                extracted_list.append(r["slug"])
            elif result == "not_found":
                print(f"   ✗ {r['slug']}: GNIS '{r['gnis_name']}' not found")
                not_found_list.append((r["slug"], r["gnis_name"], r["state"]))
                stats["not_found"] += 1
            elif result == "too_few_points":
                print(f"   ✗ {r['slug']}: too few points after simplification")
                stats["too_few"] += 1

        elapsed_total = time.time() - t0
        print(f"   Done in {elapsed_total:.1f}s")
        print()

    # Count rivers whose HUC4 GDB isn't downloaded
    for huc4, rivers in missing_hucs:
        for r in rivers:
            ts_path = out_dir / f"{r['slug']}.ts"
            if ts_path.exists() and not args.force:
                stats["skipped_exists"] += 1
            else:
                stats["skipped_no_gdb"] += 1

    # ── REPORT ─────────────────────────────────────────────────
    print()
    print("┌──────────────────────────────────────────────────┐")
    print("│  EXTRACTION REPORT                               │")
    print("└──────────────────────────────────────────────────┘")
    print()
    print(f"  Extracted:         {stats['extracted']}")
    print(f"  Skipped (exists):  {stats['skipped_exists']}")
    print(f"  Skipped (no GDB):  {stats['skipped_no_gdb']}")
    print(f"  Not found (GNIS):  {stats['not_found']}")
    print(f"  Too few points:    {stats['too_few']}")
    print()

    if extracted_list:
        print("  EXTRACTED:")
        for s in sorted(extracted_list):
            print(f"    ✓ {s}")
        print()

    if not_found_list:
        print("  NOT FOUND — fix these GNIS names in river_extraction_map.csv:")
        for slug, gnis, state in sorted(not_found_list):
            print(f"    ✗ {slug} ({state}): tried '{gnis}'")
        print()
        print("  TIP: to see available GNIS names in a GDB, run:")
        print("    python -c \"import geopandas as gpd; gdf = gpd.read_file('path/to/GDB.gdb', layer='NHDFlowline'); print(gdf['GNIS_Name'].dropna().unique()[:50])\"")
        print()

    # Warn about registration
    if extracted_list:
        print("  ⚠  NEXT STEPS:")
        print("  1. Register new files in data/river-maps/index.ts")
        print("     (add an import entry for each new slug)")
        print("  2. git add data/river-maps/ && git commit")
        print("  3. Run: npx tsc --noEmit  (to typecheck)")
        print("  4. git push")
        print()
        print("  To auto-generate the index.ts entries, run:")
        print("    ls data/river-maps/*.ts | grep -v index | sed 's|.*/||;s|\\.ts||' | while read f; do")
        print("      grep -q \"'$f'\" data/river-maps/index.ts || echo \"  $f: () => import('./$f').then(m => ({ accessPoints: m.accessPoints, sections: m.sections, riverPath: m.riverPath })),\"")
        print("    done")


if __name__ == "__main__":
    main()
