# Verified River Map Backup

**DO NOT DELETE THIS FOLDER.**

These are verified access point coordinates from government APIs
and owner-provided GPS. If the live river-maps/ files ever get
corrupted or overwritten, restore from here.

## Sources

### Owner-verified (GPS-confirmed on site)
- pine_mi.ts — Pine River, MI
- jordan.ts — Jordan River, MI
- platte_mi.ts — Platte River, MI
- pere_marquette.ts — Pere Marquette River, MI (10 sites)
- ausable.ts — Au Sable River, MI (29 sites)

### MI DNR Boat Launches FeatureServer
- manistee.ts, muskegon.ts, betsie.ts, boardman.ts, kalamazoo.ts,
  sturgeon_mi.ts, thornapple.ts, grand_mi.ts, little_manistee.ts,
  rogue_mi.ts, dowagiac.ts, huron_mi.ts, white_mi.ts,
  manistique_mi.ts, paw_paw_mi.ts, presque_isle_mi.ts

### MT FWP Fishing Access Sites FeatureServer
- blackfoot.ts, yellowstone.ts, clark_fork.ts, madison.ts,
  stillwater.ts, swan_mt.ts, gallatin.ts, missouri_mt.ts,
  big_hole.ts

### CO BLM Recreation MapServer
- colorado_co.ts, eagle.ts, dolores_co.ts, gunnison_main.ts,
  colorado_pumphouse.ts, glenwood.ts, san_miguel_co.ts

## Backup date
2026-04-19

## To restore
```bash
cp data/river-maps-verified-backup/FILENAME.ts data/river-maps/FILENAME.ts
```
