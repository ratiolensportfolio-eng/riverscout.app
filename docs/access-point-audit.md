# Access-point coordinate audit

Generated 2026-04-13.

| Metric | Value |
|---|---|
| River-map files audited | 32 |
| Total access points | 70 |
| Rivers with at least one bad pin | 0 |
| Tolerance | 2 miles from nearest polyline vertex |

Pin distance is measured to the nearest vertex of the river polyline (`riverPath` in the .ts file). A pin more than ~2 miles off is almost certainly the wrong coordinate — either the seed SQL had bad lat/lng or the wrong location was inferred. Worst rivers first.
