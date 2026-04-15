# Broken-gauge Categorization (DEEP) — 2026-04-15

Re-checked: **865** USGS gauges over a 72-hour window.
- live data returned: **710**
- no-series (suspected broken/seasonal): **121**
- stale (-999999): **34**

## No-series buckets

### unknown / possibly truly dead — 95
- `flat_river` (MI) → `04116500`  FLAT RIVER AT SMYRNA, MI
- `crystal_mi` (MI) → `04126802`  CRYSTAL RIVER AT COUNTY HWY 675 NR GLEN ARBOR, MI
- `black_cheboygan` (MI) → `04132000`  BLACK RIVER NEAR CHEBOYGAN, MI
- `little_manistee` (MI) → `04126130`  L MANISTEE RIVER AT KINGS HWY NEAR LUTHER, MI
- `pigeon_mi` (MI) → `04129500`  PIGEON RIVER AT AFTON, MI
- `thunder_bay` (MI) → `04135000`  THUNDER BAY RIVER NEAR ALPENA, MI
- `twohearted` (MI) → `04044800`   TWO HEARTED RIVER AT CNTY RD 407 NR DEER PARK, MI
- `big_manistee_lake` (MI) → `04126200`  LITTLE MANISTEE RIVER NEAR FREESOIL, MI
- `maple_mi` (MI) → `04114603`  MAPLE RIVER AT SHEPARDSVILLE ROAD NEAR ELSIE, MI
- `coldwater_mi` (MI) → `04096460`  COLDWATER R AT GARFIELD RD NR COLDWATER, MI
- `detroit_mi` (MI) → `421337083074201`  Detroit R at SW Water Intake nr Grassy Island, MI
- `meadow` (WV) → `03190400`  MEADOW RIVER NEAR MT. LOOKOUT, WV
- `tygart_wv` (WV) → `03055000`  TYGART VALLEY RIVER AT ARDEN, WV
- `cache_la_poudre` (CO) → `06752000`  CACHE LA POUDRE RIV AT MO OF CN, NR FT COLLINS, CO
- `sf_boise` (ID) → `13173630`  SOUTH BOISE DRAIN NR PARMA ID
- `north_umpqua` (OR) → `14317500`  N UMPQUA RIVER AB ROCK CR NR GLIDE OREG
- `clackamas` (OR) → `14211000`  CLACKAMAS RIVER NEAR CLACKAMAS, OR
- `tieton` (WA) → `12492500`  TIETON RIVER AT CANAL HEADWORKS NEAR NACHES, WA
- `delaware_pa` (PA) → `01446700`  Delaware River at Easton, PA
- `raystown_branch_juniata_pa` (PA) → `01559790`  Raystown Branch Juniata River at Wolfsburg, PA
- `stillwater` (MT) → `06201800`  Stillwater River ab Woodbine Cr nr Nye MT
- `hiwassee` (TN) → `03566000`  HIWASSEE RIVER AT CHARLESTON, TN
- `ocoee` (TN) → `03564500`  OCOEE RIVER AT PARKSVILLE, TN
- `elk_tn` (TN) → `03584500`  ELK RIVER NEAR PROSPECT, TN
- `caney_fork` (TN) → `03424500`  CANEY F BL CEN HILL DAM NR LANCASTER TENN
- `holston` (TN) → `03487650`  SOUTH FORK HOLSTON RIVER NEAR KINGSPORT, TN
- `stanislaus` (CA) → `11302000`  STANISLAUS R BL GOODWIN DAM NR KNIGHTS FERRY CA
- `mokelumne` (CA) → `11319500`  MOKELUMNE R NR MOKELUMNE HILL CA
- `feather` (CA) → `11407000`  FEATHER R A OROVILLE CA
- `kings` (CA) → `11218400`  NF KINGS R BL DINKEY C NR BALCH CAMP CA
  ...and 65 more

### small-creek-likely-seasonal — 20
- `shavers_fork` (WV) → `03068600`  SHAVERS FORK ABOVE BOWDEN, WV
- `seneca_creek_wv` (WV) → `01605890`  SENECA CREEK ABOVE SENECA FALLS, WV
- `loyalsock` (PA) → `01551850`  Little Loyalsock Creek near Dushore, PA
- `french_pa` (PA) → `03021890`  French Creek at Cambridge Springs, PA
- `loyalhanna_pa` (PA) → `03045010`  Loyalhanna Creek at Latrobe, PA
- `abrams_creek_tn` (TN) → `03518100`  ABRAMS CREEK BELOW CADES COVE, TN
- `citico_creek_tn` (TN) → `03518400`  NORTH FORK CITICO CREEK NEAR TELLICO PLAINS TENN
- `clinch_norris_tn` (TN) → `03534500`  BUFFALO CREEK AT NORRIS, TN
- `pit` (CA) → `11365000`  PIT R NR MONTGOMERY CREEK CA
- `mossy_creek_va` (VA) → `01620850`  MOSSY CREEK NEAR SPRING CREEK, VA
- `rockcastle` (KY) → `03214700`  ROCKCASTLE CREEK AT INEZ, KY
- `hazel_creek_nc` (NC) → `03514000`  HAZEL CREEK AT PROCTOR, NC
- `wilson_creek_nc` (NC) → `02140510`  WILSON CREEK AT SECONDARY ROAD 1335 AT ADAKO, NC
- `lizard_ia` (IA) → `05480080`  Lizard Creek near Fort Dodge, IA
- `black_creek_ms` (MS) → `02480200`  BLACK CREEK SOUTH AT HELENA, MS
- `okatoma` (MS) → `02472800`  OKATOMA CREEK AT COLLINS, MS.
- `locust_fork` (AL) → `02455300`  LOCUST FORK NEAR LOCUST FORK, AL.
- `big_darby_oh` (OH) → `395339083130100`  Big Darby Creek above Georgesville OH
- `caesar_oh` (OH) → `03242350`  Caesar Creek near Wellman OH
- `sugar_creek` (IN) → `03361630`  SUGAR CREEK AT EDEN, IN

### reservoir-related — 5
- `ocqueoc` (MI) → `04132160`  OCQUEOC RIVER AT OCQUEOC LAKE RD NEAR OCQUEOC, MI
- `monongahela_wv` (WV) → `03062998`  Monongahela R L&D8 (Upper Pool) @ Point Marion, PA
- `ohio_pa` (PA) → `03086001`  Ohio River (lower pool) at Sewickley, PA
- `buck_oh` (OH) → `03268100`  Buck Creek bl CJ Brown Reservoir nr Springfield OH
- `naknek_ak` (AK) → `15297890`  NAKNEK R AT LAKE OUTLET NR KING SALMON AK

### dam-released — 1
- `santee_sc` (SC) → `02171001`  SANTEE R AT LK MARION TAILRACE NR PINEVILLE, SC

## Stale (-999999) gauges
- `paint_mi` (MI) → `04061500`  last reading at null
- `gauley` (WV) → `03189600`  last reading at null
- `rio_grande_co` (CO) → `08251500`  last reading at null
- `fraser_co` (CO) → `09033300`  last reading at null
- `hells_canyon` (ID) → `13290450`  last reading at null
- `bear_id` (ID) → `10086500`  last reading at null
- `molalla_or` (OR) → `14198500`  last reading at null
- `russell_fork` (VA) → `03208500`  last reading at null
- `barren_ky` (KY) → `03313000`  last reading at null
- `tygarts_ky` (KY) → `03216777`  last reading at null
- `russell_ky_2` (KY) → `03209410`  last reading at null
- `nolichucky_nc_2` (NC) → `03465500`  last reading at 2026-04-15T05:30:00.000-04:00
- `big_fork_mn` (MN) → `05132000`  last reading at 2026-04-15T04:00:00.000-05:00
- `raccoon_ia` (IA) → `05484600`  last reading at null
- `tallahala` (MS) → `02474500`  last reading at null
- `pacolet_sc` (SC) → `02156350`  last reading at null
- `republican` (NE) → `06843500`  last reading at null
- `black_fork_oh` (OH) → `03131500`  last reading at null
- `sugar_oh` (OH) → `03124000`  last reading at null
- `pymatuning_oh` (OH) → `03102950`  last reading at null
- `walhonding_oh` (OH) → `03138500`  last reading at null
- `calumet_il` (IL) → `05536368`  last reading at null
- `shepaug` (CT) → `01203000`  last reading at null
- `kenai_ak` (AK) → `15266300`  last reading at 2026-04-15T01:00:00.000-08:00
- `susitna_ak` (AK) → `15292000`  last reading at 2026-04-15T01:30:00.000-08:00
- `copper_ak` (AK) → `15214000`  last reading at 2026-04-15T01:45:00.000-08:00
- `yukon_ak` (AK) → `15565447`  last reading at null
- `kuskokwim_ak` (AK) → `15304000`  last reading at 2026-04-15T01:45:00.000-08:00
- `gulkana_ak` (AK) → `15200280`  last reading at 2026-04-15T01:15:00.000-08:00
- `chena_ak` (AK) → `15493000`  last reading at 2026-04-15T01:00:00.000-08:00