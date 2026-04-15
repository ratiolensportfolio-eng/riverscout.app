# Historical Avg Flow Population — 2026-04-15

USGS-gauged rivers: **865**.

Sampling 50 gauges to estimate coverage. Full population would proceed via /api/rivers/[id]/gauges lazy-fill on first page view, OR a dedicated nightly job. NOT writing to DB in this run.

## Sample (first 50)
- `pine_mi` (04125460)  long-term mean = **290 cfs** (57 years)
- `ausable` (04137500)  long-term mean = **1,393 cfs** (37 years)
- `manistee` (04124000)  long-term mean = **1,066 cfs** (99 years)
- `muskegon` (04121970)  long-term mean = **2,083 cfs** (29 years)
- `pere_marquette` (04122500)  long-term mean = **730 cfs** (85 years)
- `boardman` (04127200)  long-term mean = **285 cfs** (7 years)
- `jordan` (04127800)  long-term mean = **188 cfs** (58 years)
- `platte_mi` (04126740)  long-term mean = **128 cfs** (34 years)
- `rifle` (04142000)  long-term mean = **324 cfs** (87 years)
- `huron_mi` (04174500)  long-term mean = **475 cfs** (109 years)
- `flat_river` (04116500)  long-term mean = **436 cfs** (35 years)
- `thornapple` (04117500)  long-term mean = **347 cfs** (81 years)
- `crystal_mi` (04126802)  long-term mean = **50 cfs** (2 years)
- `ausable_sb` (04135700)  long-term mean = **216 cfs** (56 years)
- `black_cheboygan` (04132000)  long-term mean = **451 cfs** (31 years)
- `cass` (04151500)  long-term mean = **557 cfs** (86 years)
- `chippewa_mi` (04154000)  long-term mean = **340 cfs** (91 years)
- `dowagiac` (04101800)  long-term mean = **307 cfs** (65 years)
- `kalamazoo` (04106000)  long-term mean = **948 cfs** (88 years)
- `little_manistee` (04126130)  no stats
- `little_muskegon` (04121944)  long-term mean = **344 cfs** (29 years)
- `ocqueoc` (04132160)  no stats
- `pigeon_mi` (04129500)  long-term mean = **140 cfs** (38 years)
- `shiawassee` (04144500)  long-term mean = **373 cfs** (94 years)
- `sturgeon_lp` (04127997)  long-term mean = **219 cfs** (82 years)
- `thunder_bay` (04135000)  long-term mean = **914 cfs** (20 years)
- `white_mi` (04122200)  long-term mean = **456 cfs** (67 years)
- `twohearted` (04044800)  no stats
- `big_manistee_lake` (04126200)  long-term mean = **174 cfs** (18 years)
- `sturgeon_mi` (04057510)  long-term mean = **188 cfs** (53 years)
- `rogue_mi` (04118500)  long-term mean = **249 cfs** (67 years)
- `maple_mi` (04114603)  no stats
- `coldwater_mi` (04096460)  no stats
- `manistique_mi` (04056500)  long-term mean = **1,431 cfs** (86 years)
- `flint_mi` (04147500)  long-term mean = **356 cfs** (71 years)
- `detroit_mi` (421337083074201)  no stats
- `paw_paw_mi` (04102500)  long-term mean = **473 cfs** (73 years)
- `clinton_mi` (04161000)  long-term mean = **110 cfs** (49 years)
- `sturgeon_mi_2` (04057510)  long-term mean = **188 cfs** (53 years)
- `grand_mi` (04119400)  long-term mean = **5,253 cfs** (14 years)
- `river_raisin_mi` (04176500)  long-term mean = **779 cfs** (87 years)
- `south_branch_black_mi` (04102700)  long-term mean = **107 cfs** (59 years)
- `middle_branch_ontonagon_mi` (04033000)  long-term mean = **166 cfs** (77 years)
- `west_branch_ontonagon_mi` (04036000)  long-term mean = **169 cfs** (81 years)
- `ontonagon_mi` (04040000)  long-term mean = **1,361 cfs** (82 years)
- `paint_mi` (04061500)  long-term mean = **588 cfs** (51 years)
- `brule_mi` (04060993)  long-term mean = **346 cfs** (82 years)
- `gauley` (03189600)  long-term mean = **1,992 cfs** (31 years)
- `newriver` (03185400)  long-term mean = **9,095 cfs** (43 years)
- `greenbrier` (03184000)  long-term mean = **2,300 cfs** (88 years)

Sample success rate: 44/50.
Population strategy: rely on /api/rivers/[id]/gauges lazy fill (already wired in commit 97a7368) — every gauge populates on first dashboard or river-page view.