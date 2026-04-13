# Michigan access-point audit vs Nominatim (OSM)

Generated 2026-04-13. Per-pin geocoder lookup using Nominatim with the river's bounding box as viewbox constraint. Tries two queries per pin: "<name> <river>" and "<name> Michigan".

- **HIT** — Nominatim returned a match within 0.5 mi of our coord
## Summary

- Total pins audited: **17**
- HIT (within 0.5 mi): **0**
- NEAR (0.5–3 mi, recommend replace): **7**
- MISS (cannot verify): **10**

- **NEAR** — Nominatim found a likely match 0.5–3 mi away → replace coord
- **MISS** — Nominatim returned nothing or results were far off → cannot verify

## muskegon — 4 pins

- **NEAR** `Croton Dam` — closest Nominatim match "Croton Dam, Croton, Croton Township, Newaygo County, Michigan, United States" at 43.43712, -85.66410 is **1.3 mi off**. Replace coord.
- **MISS** `Pine Street Access` at 43.422, -85.788 — best match 5.5 mi away, not trustworthy
- **MISS** `Henning Park` at 43.385, -85.892 — best match 5.6 mi away, not trustworthy
- **MISS** `Bridgeton Access` at 43.342, -85.985 — Nominatim returned no matches

## boardman — 4 pins

- **MISS** `Supply Road Bridge` at 44.683, -85.412 — Nominatim returned no matches
- **NEAR** `Brown Bridge Quiet Area` — closest Nominatim match "Brown Bridge Quiet Area, 3405, Traverse City, Grand Traverse County, Michigan, 4" at 44.64963, -85.49576 is **1.9 mi off**. Replace coord.
- **MISS** `Ranch Rudolf` at 44.618, -85.492 — best match 3.8 mi away, not trustworthy
- **NEAR** `Hull Park` — closest Nominatim match "Hull Park, 660, Traverse Heights, Traverse City, Grand Traverse County, Michigan" at 44.75677, -85.60970 is **0.6 mi off**. Replace coord.

## betsie — 3 pins

- **NEAR** `Grass Lake Road` — closest Nominatim match "South Grass Lake Dam Road, Colfax Township, Benzie County, Michigan, United Stat" at 44.58271, -85.85035 is **1.0 mi off**. Replace coord.
- **MISS** `Kurick Road` at 44.542, -85.905 — best match 4.7 mi away, not trustworthy
- **MISS** `Thompsonville Bridge` at 44.513, -85.954 — Nominatim returned no matches

## platte_mi — 2 pins

- **MISS** `Veterans Memorial Park` at 44.665, -86.018 — best match 3.6 mi away, not trustworthy
- **NEAR** `Platte River Point` — closest Nominatim match "Platte Point, Lake Township, Benzie County, Michigan, United States" at 44.73193, -86.15546 is **2.9 mi off**. Replace coord.

## rifle — 1 pins

- **MISS** `Omer City Park` at 44.049, -83.854 — Nominatim returned no matches

## kalamazoo — 1 pins

- **NEAR** `Allegan City Dam` — closest Nominatim match "Allegan City Dam, Allegan, Allegan County, Michigan, 49010, United States" at 42.52488, -85.84581 is **0.5 mi off**. Replace coord.

## little_manistee — 1 pins

- **MISS** `Nine Mile Bridge` at 44.118, -86.012 — best match 4.3 mi away, not trustworthy

## white_mi — 1 pins

- **NEAR** `Diamond Point` — closest Nominatim match "Diamond Point Campground, Diamond Point Road, Otto Township, Oceana County, Mich" at 43.47437, -86.21191 is **2.1 mi off**. Replace coord.
