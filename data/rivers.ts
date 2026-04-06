import type { StatesDB } from '@/types'

export const STATES: StatesDB = {

  // ── MICHIGAN ──────────────────────────────────────────────────
  mi: {
    name: 'Michigan', abbr: 'MI', label: 'Michigan Rivers',
    filters: ['all', 'lp', 'up', 'wild', 'nat', 'ww'],
    fL: { all: 'All', lp: 'Lower Peninsula', up: 'Upper Peninsula', wild: 'Wild & Scenic', nat: 'Natural River', ww: 'Whitewater' },
    rivers: [
      {
        id: 'ausable', n: 'Au Sable River', lp: true, up: false, wild: true, nat: true, ww: false,
        co: 'Crawford / Oscoda Co.', len: '140 mi', cls: 'I–II', opt: '200–800',
        g: '04137500', avg: 410, histFlow: 390, mx: 265, my: 254, abbr: 'MI',
        desc: "Michigan's most celebrated canoe river — 140 miles of spring-fed water from Grayling to Lake Huron. Birthplace of Trout Unlimited (1959) and home of the legendary Au Sable Canoe Marathon, 120 miles nonstop each July since 1947.",
        desig: 'National Wild & Scenic River (1984) · Michigan Natural River',
        secs: ['Grayling to Mio — 50 mi, popular family float', 'Mio to Oscoda — 70 mi, multi-day tripping', 'South Branch — 20 mi, solitary and wild'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-1600s', title: 'Ojibwe Homeland — Ziibiiwiing (The River)', text: "The Au Sable watershed was Ojibwe (Anishinaabe) territory for thousands of years. The river's exceptional brook trout runs fed communities. The 1836 Treaty of Washington ceded much of the Lower Peninsula, fundamentally altering Ojibwe life along the river.", src: 'Michigan Historical Center; Ziibiwing Center of Anishinabe Culture' }] },
          { era: 'logging', entries: [{ yr: '1850s–1895', title: 'White Pine Log Drives — 300 Million Board Feet Annually', text: 'The Au Sable became the backbone of Michigan\'s white pine lumber industry. Each spring, millions of logs were floated from Crawford and Oscoda counties to mills at Oscoda. By 1882 over 300 million board feet were driven annually — the great pines were gone by 1900.', src: 'Michigan Log Marks (WPA, 1941); Oscoda County Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1984', title: 'National Wild & Scenic River Designation', text: "After decades of conservation effort led by Trout Unlimited — founded on the Au Sable in 1959 — Congress designated the main stem a Wild & Scenic River, permanently protecting it from dams.", src: 'USFS Huron-Manistee National Forest' }] },
          { era: 'modern', entries: [{ yr: '1959', title: 'Trout Unlimited Founded on the Au Sable', text: 'Concerned about declining trout from pollution and overfishing, anglers gathered near the Au Sable and founded Trout Unlimited, now 300,000 members strong. The Au Sable is the spiritual home of the modern coldwater conservation movement.', src: 'Trout Unlimited; Michigan DNR' }] },
        ],
        docs: [{ t: 'Au Sable River Watershed Management Plan', s: 'MDEQ', y: 2006, tp: 'Survey', pg: 210 }, { t: 'Wild & Scenic Eligibility Study', s: 'USFS Huron-Manistee', y: 1983, tp: 'Federal', pg: 88 }],
        revs: [{ u: 'paddle_mi_daily', d: 'Aug 2024', s: 5, t: 'Grayling to Mio in two days. Camped at Smith Bridge. Water gin-clear at 340 cfs. Watched a bald eagle take a trout 20 feet off my bow.' }, { u: 'graylingsup', d: 'Jul 2024', s: 5, t: 'Four browns before noon at 420 cfs. Perfect water, perfect day.' }],
        outs: [{ n: 'Carlisle Canoe Livery', d: 'Grayling-based, full service', l: 'carlislecanoes.com' }, { n: "Penrod's Au Sable", d: 'Rentals, shuttles, multiple put-ins', l: 'penrodsausable.com' }],
      },
      {
        id: 'manistee', n: 'Manistee River', lp: true, up: false, wild: true, nat: true, ww: false,
        co: 'Manistee / Wexford Co.', len: '190 mi', cls: 'I–II', opt: '300–1200',
        g: '04126520', avg: 740, histFlow: 690, mx: 248, my: 240, abbr: 'MI',
        desc: '190 miles through Manistee National Forest — among the finest trout fisheries east of the Rockies. Upper reach is fast and intimate; below Tippy Dam widens into world-class steelhead and Chinook salmon water every fall.',
        desig: 'National Scenic River · Michigan Natural River',
        secs: ['Upper — Gaylord to Hodenpyl Dam, remote', 'Middle — Hodenpyl to Tippy Dam, classic canoe water', 'Lower — Tippy Dam to Lake Michigan, steelhead corridor'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Odawa Homeland — 'Spirit of the Woods'", text: "The Odawa (Ottawa) people inhabited western Lower Peninsula for thousands of years. The river's name derives from an Anishinaabe word meaning 'spirit of the woods.' The Little River Band of Ottawa Indians, headquartered in Manistee today, are the direct descendants.", src: 'Little River Band of Ottawa Indians; Manistee County Historical Society' }] },
          { era: 'logging', entries: [{ yr: '1847–1895', title: 'Manistee — Logging Capital of the World', text: "By the 1880s, Manistee was processing more lumber than almost any city on earth. The Manistee River was the highway — millions of logs driven downstream each spring. The once-magnificent white pine stands were virtually eliminated in two generations.", src: 'Manistee County Historical Museum' }] },
          { era: 'survey', entries: [{ yr: '1968', title: 'USGS Reconnaissance of the Manistee River', text: "A landmark hydrological survey by USGS documented the river's recovery from the logging era. The river was already rebounding — cold, clear, supporting brook and brown trout. The study helped build the case for National Scenic River designation.", src: 'USGS Open-File Report (1968)' }, { yr: '1980', title: 'Designated National Scenic River', text: 'Congress designated the Manistee a National Scenic River, protecting the corridor from damming and development.', src: 'USFS Huron-Manistee National Forest' }] },
          { era: 'modern', entries: [{ yr: '2022', title: 'Tippy Dam Steelhead — World-Record Territory', text: 'The tailwater below Tippy Dam has become one of the world\'s premier steelhead destinations. Fish exceeding 20 pounds move through in peak fall runs. The river hosts an estimated 15,000+ steelhead annually.', src: 'Michigan DNR Fisheries Division' }] },
        ],
        docs: [{ t: 'Reconnaissance of the Manistee River', s: 'USGS', y: 1968, tp: 'Survey', pg: 42 }, { t: 'Manistee River Watershed Assessment', s: 'MDEQ', y: 2012, tp: 'Ecology', pg: 178 }],
        revs: [{ u: 'chris_upmich', d: 'Sep 2024', s: 5, t: 'Three-day float from Mesick to Tippy. Best Michigan trip in 20 years. Clear at 650 cfs, incredible fall color.' }, { u: 'salmoncreek99', d: 'Oct 2024', s: 4, t: 'Below Tippy at 900 cfs — king salmon stacking. Epic.' }],
        outs: [{ n: 'Pine River Paddlesports Center', d: 'Lower Manistee trips and rentals', l: 'pineriverpaddlesports.com' }],
      },
      {
        id: 'muskegon', n: 'Muskegon River', lp: true, up: false, wild: false, nat: false, ww: false,
        co: 'Mecosta / Newaygo / Muskegon Co.', len: '216 mi', cls: 'I–II', opt: '800–3000',
        g: '04121970', avg: 1840, histFlow: 1650, mx: 216, my: 260, abbr: 'MI',
        desc: "Michigan's longest river entirely within the state. World-class steelhead and Chinook salmon. The world's first logging railroad was built in 1876 specifically to feed logs into the Muskegon system.",
        desig: 'Michigan Designated Trout Stream (lower reach)',
        secs: ['Upper — Houghton Lake to Newaygo', 'Lower — Croton Dam to Muskegon Lake'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Potawatomi and Odawa — 'Marshy River'", text: "'Muskegon' derives from an Anishinaabe word meaning 'marshy river.' The river's mouth at Muskegon Lake was a major gathering site for trade and ceremony for the Potawatomi and Odawa peoples.", src: 'Muskegon County Historical Society' }] },
          { era: 'logging', entries: [{ yr: '1837–1899', title: 'Muskegon — Lumber Queen of the World', text: 'By 1883 Muskegon produced over 686 million board feet of lumber annually — more than any city on earth. The first logging railroad in American history (1876) was built to feed logs into the Muskegon system when river levels were too low for drives.', src: 'Muskegon County Lumbering Records, 1883; Grand Traverse Journal' }] },
          { era: 'modern', entries: [{ yr: '2003', title: 'Muskegon River Watershed Management Plan', text: 'Multi-agency plan established long-term conservation goals. The river has seen significant ecological improvement over two decades of restoration.', src: 'Muskegon River Watershed Assembly' }] },
        ],
        docs: [{ t: 'Muskegon River Watershed Management Plan', s: 'MRWA', y: 2003, tp: 'Survey', pg: 240 }, { t: 'Hydrologic Assessment Below Croton Dam', s: 'FERC/USGS', y: 1998, tp: 'Hydrology', pg: 90 }],
        revs: [{ u: 'steelheaddan_mi', d: 'Mar 2024', s: 5, t: 'Croton in spring at 2,200 cfs — chrome steelhead stacked. Even the float between holes is beautiful.' }],
        outs: [{ n: 'Sawmill Canoe Rental', d: 'Day trips, family-friendly', l: 'sawmillcanoe.com' }],
      },
      {
        id: 'twohearted', n: 'Two Hearted River', lp: false, up: true, wild: true, nat: true, ww: false,
        co: 'Luce Co., UP', len: '20 mi', cls: 'I', opt: '100–500',
        g: '04063700', avg: 290, histFlow: 275, mx: 250, my: 108, abbr: 'MI',
        desc: "Immortalized by Hemingway in 'Big Two-Hearted River' (1924). Flows through Lake Superior State Forest to a dune-backed beach at Lake Superior. Remote, undeveloped, wild — one of the finest wilderness paddles in the Midwest.",
        desig: 'National Wild & Scenic River · Michigan Natural River',
        secs: ['Reed and Green Bridge to Lake Superior — 20 mi definitive route'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Lake Superior Ojibwe Territory', text: 'The Two Hearted watershed lies within the ancestral territory of the Lake Superior Ojibwe (Chippewa). The remote UP forests were important hunting and trapping grounds. The Sault Ste. Marie Tribe of Chippewa Indians maintains cultural connections to this landscape today.', src: 'Sault Ste. Marie Tribe of Chippewa Indians' }] },
          { era: 'survey', entries: [{ yr: '1924', title: 'Hemingway Writes "Big Two-Hearted River"', text: "Ernest Hemingway's 1924 short story placed this remote UP river permanently in American literary consciousness. The story follows Nick Adams fishing for trout after World War I, using the river as a metaphor for healing and return.", src: 'Hemingway, E. (1924)' }] },
          { era: 'modern', entries: [{ yr: '2012', title: 'National Wild & Scenic Designation', text: 'Congress added the Two Hearted to the National Wild & Scenic River system, permanently protecting one of the most undeveloped river corridors in the Great Lakes region.', src: 'USFS / NPS' }] },
        ],
        docs: [{ t: 'Two Hearted River Basin Assessment', s: 'MDNR', y: 2008, tp: 'Ecology', pg: 95 }],
        revs: [{ u: 'hemingway_was_right', d: 'Sep 2024', s: 5, t: 'Two days solo. No cell signal. Ended on a Lake Superior beach at sunset. Resets something in you.' }, { u: 'up_wilderness_nut', d: 'Aug 2024', s: 5, t: "Most remote feeling river I've paddled in Michigan. Moose tracks on every sandbar." }],
        outs: [{ n: 'Two Hearted River Canoe Trips', d: 'Remote UP expeditions', l: 'twoheartedcanoe.com' }],
      },
    ],
  },

  // ── WEST VIRGINIA ──────────────────────────────────────────────
  wv: {
    name: 'West Virginia', abbr: 'WV', label: 'West Virginia Rivers',
    filters: ['all', 'ww', 'wild', 'mtnst', 'flat'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', mtnst: 'Mountain Classics', flat: 'Scenic / Flatwater' },
    rivers: [
      {
        id: 'gauley', n: 'Gauley River', ww: true, wild: true, mtnst: true, flat: false,
        co: 'Nicholas / Fayette Co.', len: '25 mi', cls: 'IV–V', opt: '2400–2800',
        g: '03194700', avg: 1200, histFlow: 1050, mx: 280, my: 118, abbr: 'WV',
        desc: 'The crown jewel of East Coast whitewater — one of the most celebrated Class IV–V rivers on the planet. The legendary Gauley Season (22 dam-release weekends each fall) was created by the first U.S. law mandating recreational dam releases.',
        desig: 'Gauley River National Recreation Area (NPS) · Congressionally-Mandated Whitewater Releases',
        secs: ['Upper Gauley — Summersville Dam to Peters Creek, Class IV–V', 'Lower Gauley — Peters Creek to Swiss, Class III–IV'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Adena and Shawnee Territory', text: 'The Gauley River gorge was inhabited by the Adena people over 2,000 years ago, evidenced by burial mounds in Nicholas County. By the historic period, the watershed was contested territory between Cherokee and Shawnee, used primarily for hunting.', src: 'West Virginia Division of Culture and History' }] },
          { era: 'logging', entries: [{ yr: '1870s–1910', title: 'Civil War at the Gauley — Battle of Carnifex Ferry', text: 'The Battle of Carnifex Ferry on September 10, 1861 — fought on a bluff above the Gauley River — was an early Union victory helping secure western Virginia. Carnifex Ferry Battlefield State Park is just above the whitewater canyon.', src: 'WV State Parks; NPS Civil War Sites' }] },
          { era: 'survey', entries: [{ yr: '1988', title: 'Congress Mandates Recreational Dam Releases — A U.S. First', text: 'The Gauley River Recreation Act of 1988 required the U.S. Army Corps of Engineers to conduct 22 recreational releases from Summersville Dam each fall — the first law in American history mandating dam releases for whitewater recreation.', src: 'American Whitewater; USACE' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Gauley Season Economic Impact — $30M+ Annually', text: 'WVU documented that the 22-weekend Gauley Season generates over $30 million annually for Nicholas and Fayette counties — remarkable for a 25-mile river in one of America\'s most rural regions.', src: 'WVU Bureau of Business and Economic Research (2023)' }] },
        ],
        docs: [{ t: 'Gauley River NRA Management Plan', s: 'NPS', y: 2000, tp: 'Federal', pg: 180 }, { t: 'Summersville Dam Recreation Release Study', s: 'USACE', y: 1988, tp: 'Federal', pg: 95 }],
        revs: [{ u: 'kayakjed_wv', d: 'Oct 2024', s: 5, t: "Gauley at 2,600 cfs — Pillow Rock was stomping. Lost Paddle lived up to its name. Greatest paddling day of my life." }, { u: 'gauley_first_timer', d: 'Sep 2024', s: 5, t: "Sweet's Falls at the end was absolutely terrifying and perfect." }],
        outs: [{ n: 'ACE Adventure Resort', d: 'Gauley Season specialists since 1976', l: 'aceadventure.com' }, { n: 'Rivers Whitewater', d: 'Upper and Lower Gauley guided trips', l: 'riverswhitewater.com' }],
      },
      {
        id: 'newriver', n: 'New River', ww: true, wild: true, mtnst: true, flat: false,
        co: 'Fayette / Raleigh Co.', len: '53 mi', cls: 'I–V', opt: '1500–6000',
        g: '03189100', avg: 3200, histFlow: 2900, mx: 318, my: 126, abbr: 'WV',
        desc: "One of the oldest rivers on earth — predates the Appalachian Mountains and flows north through them. America's newest National Park (2020). The New River Gorge delivers Class III–V whitewater beneath the iconic New River Gorge Bridge.",
        desig: 'New River Gorge National Park (2020) · Wild & Scenic River',
        secs: ['Upper New (Sandstone to Grandview) — Class I–II, family-friendly', 'Grandview to Fayette Station — Class III–IV, most popular', 'The Dries — Class IV–V, low water technical'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: '10,000 Years of Habitation in the Gorge', text: 'The New River gorge has been inhabited for at least 10,000 years — one of the longest continuously occupied landscapes in North America. The region was Cherokee, Shawnee, and earlier Adena and Hopewell territory.', src: 'NPS New River Gorge National Park Archaeology Program' }] },
          { era: 'logging', entries: [{ yr: '1870s–1920s', title: 'New River Coal Fields — 50+ Company Towns', text: 'The C&O Railroad reached the gorge in 1873, opening vast coal seams. Over 50 coal towns sprang up; by the 1930s most mines were exhausted, leaving the haunting ghost towns visible along the gorge today.', src: 'NPS New River Gorge Historical Sites' }] },
          { era: 'survey', entries: [{ yr: '2020', title: "America's Newest National Park", text: "On December 27, 2020, New River Gorge became America's 63rd National Park, upgraded from National River status, bringing national attention to West Virginia's outdoor recreation economy.", src: "NPS; WV Governor's Office" }] },
          { era: 'modern', entries: [{ yr: '2023', title: "Bridge Day — World's Largest Rappel Event", text: 'The annual Bridge Day festival draws 80,000+ visitors for BASE jumping and rappelling from the 876-foot bridge above the river — the most dramatic overhead perspective of any American whitewater run.', src: 'Bridge Day Commission; NPS' }] },
        ],
        docs: [{ t: 'New River Gorge NP General Management Plan', s: 'NPS', y: 2022, tp: 'Federal', pg: 420 }],
        revs: [{ u: 'nrg_regular', d: 'Sep 2024', s: 5, t: 'New at 4,200 cfs in fall — everything firing. Class III–IV with iconic bridge view.' }, { u: 'park_visitor', d: 'Jul 2024', s: 4, t: 'Upper New with kids — flat enough to float with gorge scenery. Perfect intro to WV rivers.' }],
        outs: [{ n: 'ACE Adventure Resort', d: 'New River Gorge specialists', l: 'aceadventure.com' }, { n: 'Class VI River Runners', d: 'New River Gorge guided trips', l: 'class-vi.com' }],
      },
      {
        id: 'greenbrier', n: 'Greenbrier River', ww: false, wild: false, mtnst: true, flat: true,
        co: 'Pocahontas / Greenbrier Co.', len: '170 mi', cls: 'I–II', opt: '300–1500',
        g: '03184000', avg: 840, histFlow: 780, mx: 342, my: 131, abbr: 'WV',
        desc: 'Longest free-flowing river in West Virginia at 170 miles. The Greenbrier River Trail — 78 miles on a former C&O Railway grade — parallels the river, creating the perfect float-and-hike combination.',
        desig: 'Greenbrier River Trail State Park (78 mi rail-trail)',
        secs: ['Upper — Durbin to Marlinton, intimate forested', 'Middle — Marlinton to Alderson, trail corridor', 'Lower — Alderson to Hinton, wider and slower'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Shawnee Hunting Grounds', text: 'The Greenbrier River valley was prized Shawnee hunting territory. The rich bottomlands and abundant wildlife made it among the most productive landscapes in the Appalachians. First European settlers arrived in the 1750s.', src: 'Greenbrier Historical Society' }] },
          { era: 'logging', entries: [{ yr: '1890s–1920', title: 'C&O Railroad and the Last Spruce Harvest', text: "The C&O Railroad reached the upper Greenbrier in the 1890s, enabling logging of the last great red spruce forests. The narrow-gauge Greenbrier Division logged hundreds of thousands of acres. That railroad bed became the Greenbrier River Trail.", src: 'Pocahontas County Historical Society' }] },
          { era: 'modern', entries: [{ yr: '2016', title: 'Great Flood — Worst Disaster in WV History', text: 'The June 2016 floods were among the deadliest in WV history. The Greenbrier at Caldwell crested at 34 feet — more than 20 feet above flood stage — destroying bridges and riverside communities.', src: 'USGS; WV Emergency Management' }] },
        ],
        docs: [{ t: 'Greenbrier River Trail Master Plan', s: 'WV State Parks', y: 2015, tp: 'Recreation', pg: 85 }],
        revs: [{ u: 'greenbrier_trail_paddler', d: 'Sep 2024', s: 5, t: 'Four days from Marlinton to Hinton — camped on gravel bars. WV at its most pure.' }, { u: 'pocahontas_local', d: 'Jul 2024', s: 4, t: 'Upper Greenbrier at 500 cfs — tiny, cold and clear. Caught brookies all day.' }],
        outs: [{ n: 'Greenbrier River Outfitters', d: 'Marlinton-based canoe and kayak rentals', l: 'greenbriveroutfitters.com' }],
      },
    ],
  },

  // ── COLORADO ──────────────────────────────────────────────────
  co: {
    name: 'Colorado', abbr: 'CO', label: 'Colorado Rivers',
    filters: ['all', 'ww', 'wild', 'mtn', 'front'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', mtn: 'Mountain', front: 'Front Range' },
    rivers: [
      {
        id: 'arkansas', n: 'Arkansas River', ww: true, wild: false, mtn: true, front: false,
        co: 'Chaffee / Fremont Co.', len: '148 mi', cls: 'I–V', opt: '500–3000',
        g: '07091200', avg: 1250, histFlow: 1100, mx: 380, my: 108, abbr: 'CO',
        desc: "America's most-rafted river. From the headwaters near Leadville the Arkansas drops 5,000 feet in 125 miles. Browns Canyon is Colorado's #1 Class III run; the Numbers push Class IV–V; Royal Gorge delivers Class V through thousand-foot walls.",
        desig: 'Browns Canyon National Monument · Gold Medal Fishery',
        secs: ['Leadville to Granite — Class I–II, beginner', 'The Numbers — Class IV–V, expert only', "Browns Canyon — Class III, Colorado's #1 family run", 'Royal Gorge — Class IV–V, dramatic canyon walls'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Ute Homeland — The Arkansas Valley', text: 'The Arkansas River valley was the ancestral homeland of the Ute people (Núuchi-u), used as a major travel corridor between mountains and plains. The Brunot Agreement of 1874 forced cession of the San Juan Mountains.', src: 'Colorado State Historical Society; Ute Indian Tribe' }] },
          { era: 'logging', entries: [{ yr: '1859–1900', title: 'Colorado Gold Rush — Mining and the Arkansas', text: 'The gold rush of 1859 transformed the upper Arkansas valley. Leadville became one of the richest silver and lead mining towns in the world by the 1880s. Mining pollution severely degraded river quality for decades.', src: 'Colorado Historical Society; Leadville Heritage Museum' }] },
          { era: 'survey', entries: [{ yr: '2015', title: 'Browns Canyon National Monument Established', text: 'President Obama designated Browns Canyon as a National Monument, permanently protecting 21,586 acres including the most-rafted section of river in the United States.', src: 'BLM Royal Gorge Field Office' }] },
          { era: 'modern', entries: [{ yr: '2023', title: '500,000+ Annual Rafters', text: 'The Arkansas now hosts over half a million commercial rafting passengers annually — the most commercially rafted river in North America — generating an estimated $75 million in annual economic impact.', src: 'Colorado River Outfitters Association' }] },
        ],
        docs: [{ t: 'Browns Canyon National Monument Management Plan', s: 'BLM/USFS', y: 2020, tp: 'Federal', pg: 290 }, { t: 'Arkansas River Flow Characterization', s: 'USGS', y: 2005, tp: 'Hydrology', pg: 88 }],
        revs: [{ u: 'ark_river_rat', d: 'Jun 2024', s: 5, t: 'Browns Canyon at 2,100 cfs — perfect. Big waves, no carnage, best Class III anywhere.' }, { u: 'royalgorge_raft', d: 'May 2024', s: 5, t: "Royal Gorge at 1,800 cfs — walls rising 1,000 feet over your head while you're in Class V. Unreal." }],
        outs: [{ n: 'Dvorak Expeditions', d: 'Arkansas River since 1969, all sections', l: 'dvorakexpeditions.com' }, { n: 'AVA Rafting', d: 'Browns Canyon specialists', l: 'avaraft.com' }],
      },
      {
        id: 'poudre', n: 'Cache la Poudre', ww: true, wild: true, mtn: false, front: true,
        co: 'Larimer Co.', len: '76 mi', cls: 'II–IV', opt: '200–1200',
        g: '06752260', avg: 480, histFlow: 440, mx: 500, my: 46, abbr: 'CO',
        desc: "Colorado's only federally designated National Wild & Scenic River — a genuine gem near Fort Collins. Continuous Class II–IV rapids through Poudre Canyon in Roosevelt National Forest. Best paddled late May through early July.",
        desig: "Colorado's Only National Wild & Scenic River (1986) · Roosevelt National Forest",
        secs: ['Upper Canyon — Class IV, technical', 'Lower Canyon (Ted\'s Place to Poudre Park) — Class II–III', 'Mishawaka to Fort Collins — Class I–II'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Arapaho Territory — Cache la Poudre', text: "The Cache la Poudre watershed was Arapaho and Ute territory. The name 'Cache la Poudre' (French: 'hide the powder') derives from an 1836 incident where fur traders cached gunpowder in the riverbanks during a blizzard.", src: 'Colorado State Historical Society; Larimer County Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1986', title: "Designated Colorado's Only Wild & Scenic River", text: "After years of advocacy concerned about proposed dams, Congress designated the Cache la Poudre as Colorado's first and only National Wild & Scenic River.", src: 'USFS Roosevelt National Forest; Colorado Wild' }, { yr: '2013', title: 'September Flood — Historic 500-Year Event', text: 'A catastrophic rainfall event sent the Poudre into extreme flood — over 6,000 cfs — destroying roads and access points throughout the canyon. The event reshaped portions of the riverbed.', src: 'USGS; Colorado Department of Transportation' }] },
        ],
        docs: [{ t: 'Cache la Poudre Wild & Scenic River Plan', s: 'USFS Roosevelt NF', y: 2004, tp: 'Federal', pg: 95 }],
        revs: [{ u: 'ftcollins_kayaker', d: 'Jun 2024', s: 5, t: 'Lower canyon at 600 cfs — continuous Class II–III, beautiful walls, 8 miles in 3 hours.' }, { u: 'poudre_local', d: 'May 2024', s: 5, t: 'Upper at 900 cfs during peak runoff — serious Class IV in spectacular Roosevelt NF canyon.' }],
        outs: [{ n: 'A-1 Wildwater', d: 'Poudre Canyon trips since 1971', l: 'a1wildwater.com' }],
      },
      {
        id: 'yampa', n: 'Yampa River', ww: true, wild: false, mtn: false, front: false,
        co: 'Routt / Moffat Co.', len: '250 mi', cls: 'I–IV', opt: '1000–6000',
        g: '09251000', avg: 2100, histFlow: 1900, mx: 130, my: 50, abbr: 'CO',
        desc: 'The last major free-flowing (undammed) river in the Colorado system. Flows through Steamboat Springs into Dinosaur National Monument, where it joins the Green River in one of the most spectacular remote canyons in the American West.',
        desig: 'Dinosaur National Monument (lower canyon) · Undammed free-flowing',
        secs: ['Steamboat Springs — Class II, urban float', 'Deerlodge to Echo Park — Class I–IV, Dinosaur NM, 3–5 days', 'Echo Park to Split Mountain — Class IV, Green River junction'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Fremont Petroglyphs — Dinosaur Canyon', text: 'The Yampa River canyon through Dinosaur National Monument contains significant Fremont culture rock art dating 1,000–2,000 years ago. The Ute people later inhabited the region. Canyon walls at Echo Park and Steamboat Rock bear remarkable painted and carved images.', src: 'NPS Dinosaur National Monument' }] },
          { era: 'survey', entries: [{ yr: '1869', title: "John Wesley Powell's First Expedition", text: "Major Powell's 1869 expedition passed through the Yampa/Green junction at what is now Dinosaur NM, producing the first scientific maps and geological observations of the Colorado Plateau canyon system.", src: 'Powell, J.W. Exploration of the Colorado River of the West (1875)' }, { yr: '1955', title: 'Echo Park Dam Defeated — Conservation Victory', text: 'The proposed Echo Park Dam would have flooded much of the Yampa canyon. A campaign led by the Sierra Club and David Brower defeated it — the first major victory of the modern conservation movement.', src: 'Sierra Club; David Brower biography' }] },
          { era: 'modern', entries: [{ yr: '2022', title: 'Yampa River Crisis — Record Low Flows', text: 'The Yampa experienced historic low flows in summer 2022 due to extended drought and upstream diversions, highlighting the vulnerability of the last free-flowing river in the Colorado system.', src: 'Colorado River Conservation Program; USGS' }] },
        ],
        docs: [{ t: 'Yampa River Wild & Scenic Study', s: 'NPS Dinosaur NM', y: 2012, tp: 'Federal', pg: 180 }, { t: 'Dinosaur River Management Plan', s: 'NPS', y: 2011, tp: 'Recreation', pg: 220 }],
        revs: [{ u: 'dinosaur_nm_paddler', d: 'Jun 2024', s: 5, t: 'Yampa through Dinosaur at 4,500 cfs — Warm Springs was enormous. Fremont petroglyphs on the walls. Extraordinary.' }, { u: 'steamboat_local', d: 'Apr 2024', s: 4, t: 'Steamboat town run at 1,800 cfs in spring — great waves, hot springs nearby.' }],
        outs: [{ n: 'Adrift Adventures', d: 'Dinosaur NM multi-day Yampa trips', l: 'adrift.net' }, { n: 'OARS', d: 'Premium Yampa/Dinosaur expeditions', l: 'oars.com' }],
      },
    ],
  },

  // ── IDAHO ──────────────────────────────────────────────────────
  id: {
    name: 'Idaho', abbr: 'ID', label: 'Idaho Rivers',
    filters: ['all', 'ww', 'wild', 'remote', 'mtn'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', remote: 'Backcountry', mtn: 'Mountain' },
    rivers: [
      {
        id: 'salmon', n: 'Salmon River — Main', ww: true, wild: true, remote: true, mtn: true,
        co: 'Lemhi / Idaho Co.', len: '425 mi', cls: 'I–IV', opt: '3000–12000',
        g: '13302500', avg: 5800, histFlow: 5200, mx: 320, my: 75, abbr: 'ID',
        desc: "The 'River of No Return' — longest undammed river in the lower 48 states. Runs 425 miles through the Frank Church-River of No Return Wilderness, the largest wilderness area in the contiguous U.S. The Main Salmon canyon is deeper than the Grand Canyon at its maximum. World-class steelhead and Chinook salmon.",
        desig: 'Wild & Scenic River · Frank Church-River of No Return Wilderness · Largest Wilderness in Contiguous U.S.',
        secs: ['Upper Salmon — Salmon City to North Fork, Class I–II, open valley', 'Middle Fork confluence — Class II–III, meeting of the giants', 'Main Salmon Canyon — North Fork to Riggins, Class III–IV, the classic', 'Lower Salmon — Riggins to Snake, Class II–III'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Agaidika (Salmon Eater) Shoshone — The River of No Return', text: 'The Salmon River was the heart of Agaidika (Salmon Eater) Shoshone territory for thousands of years. The river\'s extraordinary salmon and steelhead runs sustained these communities. The Shoshone-Bannock Tribes and Nez Perce Tribe both have deep ancestral connections to the watershed.', src: 'Shoshone-Bannock Tribes; Nez Perce Tribe' }, { yr: '1805', title: "Lewis & Clark Expedition — Impassable Canyon", text: "Lewis and Clark followed the Salmon River in 1805 trying to find a navigable route to the Pacific. They encountered the impossibly rugged canyon — which they called 'the river of no return' — and were forced to take the Lolo Trail over the mountains instead.", src: 'Lewis and Clark Journals (1805); National Park Service Lewis & Clark NHT' }] },
          { era: 'logging', entries: [{ yr: '1860s–1900s', title: 'Gold Rush and Placer Mining on the Salmon', text: "Gold was discovered in the Salmon River watershed in the 1860s, bringing thousands of prospectors into the Frank Church wilderness. Florence, Warren, and Salmon City became gold rush boomtowns. Hydraulic mining and dredging scarred much of the upper watershed.", src: 'Idaho State Historical Society; Salmon Museum' }] },
          { era: 'survey', entries: [{ yr: '1980', title: 'Frank Church-River of No Return Wilderness Designated', text: 'Congress designated 2.3 million acres surrounding the Salmon River as the Frank Church-River of No Return Wilderness — the largest contiguous wilderness in the lower 48 states. Named for Senator Frank Church of Idaho, who championed wilderness protection for decades.', src: 'Wilderness Act (1964); USFS' }, { yr: '1968', title: 'Wild & Scenic River Designation', text: 'Congress included the Main Salmon in the original Wild & Scenic Rivers Act of 1968, one of eight rivers given the inaugural designation.', src: 'Wild & Scenic Rivers Act (1968)' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Chinook Salmon Recovery — Hope in the Data', text: 'After decades of decline due to Snake River dams downstream, recent NOAA surveys showed increased Chinook returns to the Salmon watershed. The ongoing debate over Snake River dam removal would open over 900 miles of salmon habitat.', src: 'NOAA Fisheries; Save Our Wild Salmon' }] },
        ],
        docs: [{ t: 'Frank Church Wilderness River Management Plan', s: 'USFS Salmon-Challis NF', y: 2009, tp: 'Federal', pg: 220 }, { t: 'Salmon River Wild & Scenic Study', s: 'USFS', y: 1975, tp: 'Federal', pg: 88 }, { t: 'Main Salmon Hydrological Survey', s: 'USGS Idaho Water Science Center', y: 2001, tp: 'Hydrology', pg: 110 }],
        revs: [{ u: 'frank_church_vet', d: 'Jul 2024', s: 5, t: 'Six days self-support from Corn Creek to Vinegar Creek. No other groups for 4 days. 130 miles of rapids, walls, wildlife, and silence. Nothing else like it.' }, { u: 'salmon_river_guide', d: 'Jun 2024', s: 5, t: 'Main Salmon at 8,000 cfs in June — big water but classic. Clients from 7 states this season. All first-timers were converted for life.' }],
        outs: [{ n: 'Salmon River Experience', d: 'Main Salmon multi-day guided trips', l: 'salmonriverexperience.com' }, { n: 'Far & Away Adventures', d: 'Frank Church Wilderness expeditions', l: 'faraway.com' }, { n: 'ROW Adventures', d: 'Main Salmon oar trips and paddle trips', l: 'rowadventures.com' }],
      },
      {
        id: 'lochsa', n: 'Lochsa River', ww: true, wild: true, remote: false, mtn: true,
        co: 'Clearwater Co.', len: '70 mi', cls: 'III–V', opt: '1500–5000',
        g: '13337000', avg: 2200, histFlow: 1980, mx: 200, my: 95, abbr: 'ID',
        desc: "One of the most relentlessly challenging whitewater rivers in the American West — 70 miles of continuous Class III–V rapids through Clearwater National Forest along the historic Lewis and Clark Highway (US-12). No flat sections, no breaks. The Lochsa runs snowmelt-driven and window is narrow: peak April–June.",
        desig: 'National Wild & Scenic River · Lewis & Clark National Historic Trail (corridor)',
        secs: ['Upper Lochsa — Milepost 115 to 109, Class III–IV, warm-up', 'Middle Lochsa — Milepost 109 to 90, Class III–V, the best whitewater', 'Lower Lochsa — Milepost 90 to 66, continuous Class III, runout'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Nez Perce — 'Rough Water'", text: "The Lochsa River lies within the ancestral territory of the Nez Perce (Niimíipu), who gave the river its name meaning 'rough water.' The Lolo Trail — the ancient Nez Perce route over the Bitterroot Mountains — follows the Lochsa corridor.", src: 'Nez Perce Tribe; Nez Perce-Clearwater NF' }, { yr: '1877', title: 'Nez Perce Flight — Lolo Trail', text: 'In 1877, Chief Joseph and the non-treaty Nez Perce bands fled U.S. Army pursuit by traveling the Lolo Trail through the Lochsa corridor — one of the most epic military retreats in American history.', src: 'NPS Nez Perce NHP; U.S. Army Records' }] },
          { era: 'logging', entries: [{ yr: '1960s', title: 'Proposed Clearwater Dam — Defeated', text: 'The Idaho Power Company proposed a series of dams on the Lochsa and Clearwater that would have flooded the canyon. A coalition of outfitters, anglers, and conservationists successfully defeated the proposals in the 1960s.', src: 'Idaho Rivers United; USFS Clearwater NF' }] },
          { era: 'survey', entries: [{ yr: '1968', title: 'Wild & Scenic River — Original Designation', text: 'The Lochsa was included in the original Wild & Scenic Rivers Act of 1968, recognizing its outstanding free-flowing whitewater and ecological values.', src: 'Wild & Scenic Rivers Act (1968)' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Record High Water — Lochsa at 18,000 cfs', text: 'Spring 2024 saw the Lochsa push record-high flows following an above-average snowpack year. At 18,000+ cfs, the river was essentially unrunnable — riverside access was monitored for flooding along US-12.', src: 'USGS; Idaho Transportation Department' }] },
        ],
        docs: [{ t: 'Lochsa River Wild & Scenic River Management Plan', s: 'USFS Clearwater NF', y: 2002, tp: 'Federal', pg: 145 }, { t: 'Lochsa Hydrologic Assessment', s: 'USGS Idaho WSC', y: 1998, tp: 'Hydrology', pg: 78 }],
        revs: [{ u: 'lochsa_annual', d: 'May 2024', s: 5, t: 'Lochsa at 3,800 cfs — 70 miles in two days with one camp. Every mile had something. Raw Prawn, Grim Reaper, Lochsa Falls — all Class V at that flow. Idaho is not playing.' }, { u: 'pnw_kayaker', d: 'Jun 2024', s: 4, t: 'Lower section at 2,400 cfs — Class III cruise after the upper beatdown. Beautiful canyon, zero crowds, highway surprisingly invisible.' }],
        outs: [{ n: 'Holiday River Expeditions', d: 'Lochsa multi-day guided trips', l: 'holidayexpeditions.com' }, { n: 'Cascade Raft & Kayak', d: 'Lochsa season specialist', l: 'cascaderaft.com' }],
      },
      {
        id: 'payette', n: 'North Fork Payette', ww: true, wild: false, remote: false, mtn: true,
        co: 'Valley / Gem Co.', len: '48 mi', cls: 'III–V+', opt: '800–2500',
        g: '13245400', avg: 1100, histFlow: 980, mx: 170, my: 115, abbr: 'ID',
        desc: 'The North Fork Payette through Banks is legendary in the North American kayaking community — Class V and V+ whitewater that draws elite paddlers from around the world. Cascade Falls section rivals any whitewater in the country. The roadside gorge provides easy shuttles and difficult consequences. Not for the uninitiated.',
        desig: 'Idaho Recreation Corridor',
        secs: ['Cascade section — Class V+, Cascade Falls is Class V+/VI', 'Banks to Horseshoe Bend — Class IV–V, most popular section', 'Lower NFP — Class III–IV, scenic and challenging'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Shoshone-Paiute Territory — Weiser River Headwaters', text: 'The Payette River watershed was territory of the Northern Shoshone and Bannock peoples, who hunted in the river valleys and traveled the canyon corridors seasonally.', src: 'Shoshone-Bannock Tribes; Idaho State Historical Society' }] },
          { era: 'modern', entries: [{ yr: '2000s', title: 'North Fork Kayak Classic — Mecca for Elite Paddlers', text: "The North Fork Payette's Banks to Horseshoe Bend section became recognized as one of the premier Class IV–V roadside runs in the U.S. The annual North Fork Kayak Festival draws elite paddlers for competitions on the Cascade section.", src: 'American Whitewater; North Fork Kayak Festival' }] },
        ],
        docs: [{ t: 'Payette River Recreation Management Plan', s: 'BLM Boise Field Office', y: 2015, tp: 'Recreation', pg: 88 }],
        revs: [{ u: 'nf_payette_local', d: 'May 2024', s: 5, t: 'Banks to Horseshoe Bend at 1,800 cfs — every rapid distinct, every line requiring full attention. Idaho kayaking at its finest.' }, { u: 'class5_chaser', d: 'Jun 2024', s: 4, t: 'Cascade section at 1,200 cfs — pulled out above Cascade Falls to scout. Ran it. Everything went white.' }],
        outs: [{ n: 'Cascade Raft & Kayak', d: 'North Fork Payette trips', l: 'cascaderaft.com' }, { n: 'Idaho Guide Service', d: 'Payette river float trips', l: 'idahoguideservice.com' }],
      },
    ],
  },

  // ── OREGON ─────────────────────────────────────────────────────
  or: {
    name: 'Oregon', abbr: 'OR', label: 'Oregon Rivers',
    filters: ['all', 'ww', 'wild', 'coastal', 'desert'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', coastal: 'Cascades', desert: 'High Desert' },
    rivers: [
      {
        id: 'rogue', n: 'Rogue River', ww: true, wild: true, coastal: true, desert: false,
        co: 'Jackson / Josephine / Curry Co.', len: '215 mi', cls: 'I–IV', opt: '1500–6000',
        g: '14361500', avg: 3200, histFlow: 2900, mx: 180, my: 125, abbr: 'OR',
        desc: "Oregon's most famous river — flows 215 miles from the Cascades to the Pacific. The Wild Rogue section (40 miles through Siskiyou National Forest, trail access only) is one of the finest multi-day wilderness floats in North America. Class III–IV whitewater, black bear, osprey, and remote hot springs.",
        desig: 'National Wild & Scenic River (1968, original) · Rogue River-Siskiyou National Forest',
        secs: ['Grants Pass to Grave Creek — Class I–II, accessible', 'Wild Rogue (Grave Creek to Foster Bar) — Class III–IV, wilderness float, 40 mi', 'Lower Rogue (Galice to Gold Beach) — Class I–III, steelhead mecca'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Takelma and Tutuni — 'Those Who Dwell Beside the River'", text: "The Takelma (Dagelma) people were the primary inhabitants of the Rogue River valley for thousands of years. Their name means 'those who dwell beside the river.' The river's extraordinary salmon and lamprey runs provided sustenance and cultural identity. The Rogue River Wars (1855–1856) ended with forced removal to the Siletz and Grand Ronde reservations.", src: 'Confederated Tribes of Grand Ronde; Siletz Tribe; Oregon Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1968', title: 'Wild & Scenic River — Original Designation', text: 'The Rogue was one of eight rivers given original Wild & Scenic designation in 1968, establishing the model for river protection that now covers over 200 rivers nationwide.', src: 'Wild & Scenic Rivers Act (1968)' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Wild Rogue Wilderness Float — 5,000+ Annual Visitors', text: 'The 40-mile Wild Rogue float consistently ranks among the top 10 wilderness river trips in the U.S. Permits are required May through October.', src: 'USFS Rogue River-Siskiyou National Forest' }] },
        ],
        docs: [{ t: 'Rogue Wild & Scenic River Management Plan', s: 'USFS Rogue-Siskiyou NF', y: 2011, tp: 'Federal', pg: 195 }, { t: 'Rogue River Hydrology and Fish Passage Study', s: 'USGS Oregon WSC', y: 2008, tp: 'Hydrology', pg: 88 }],
        revs: [{ u: 'wild_rogue_devotee', d: 'Jul 2024', s: 5, t: 'Wild Rogue at 2,800 cfs — 5 days, 40 miles, 8 Class III–IV rapids, a black bear on the bank at Whiskey Creek, and no cell signal. Best trip of my life.' }, { u: 'rogue_steelhead_guide', d: 'Nov 2024', s: 5, t: 'Lower Rogue in November — wild winter steelhead stacking below the bars. World-class fishery.' }],
        outs: [{ n: 'Rogue River Raft Trips', d: 'Wild Rogue permits and guided float trips', l: 'rogueriverrafttrips.com' }, { n: 'Oregon Whitewater Adventures', d: 'Grants Pass to Foster Bar', l: 'oregonwhitewater.com' }],
      },
      {
        id: 'deschutes', n: 'Deschutes River', ww: true, wild: true, coastal: false, desert: true,
        co: 'Deschutes / Wasco Co.', len: '252 mi', cls: 'I–IV', opt: '1500–5000',
        g: '14102000', avg: 2800, histFlow: 2600, mx: 380, my: 65, abbr: 'OR',
        desc: "Flows 252 miles from the Cascade Mountains through Oregon's high desert to the Columbia River. The Lower Deschutes from Maupin is one of the Northwest's great whitewater destinations — 100 miles of canyon paddling through 25-million-year-old basalt. Legendary rainbow trout fishery.",
        desig: 'National Wild & Scenic River (lower 100 miles) · Deschutes State Recreation Area',
        secs: ['Upper Deschutes — Bend area, Class I–II, urban', 'Maupin section — Class III–IV, the classic Lower Deschutes run', 'Columbia confluence — Class I–II, wider and slower'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Warm Springs Confederated Tribes — Rivière aux Chutes", text: "The Deschutes River was central to the lives of the Warm Springs, Wasco, and Paiute people for millennia. French trappers called it 'Rivière aux Chutes' (river of falls) for its dramatic waterfalls. The Warm Springs Reservation (established 1855) borders the river for much of its length.", src: 'Confederated Tribes of Warm Springs; Oregon Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1988', title: 'Lower Deschutes — Wild & Scenic Designation', text: 'Congress designated 100 miles of the Lower Deschutes as Wild & Scenic, protecting the extraordinary canyon from future dam proposals.', src: 'BLM Prineville District; USFS Ochoco NF' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Deschutes River Alliance — Flow Restoration', text: 'After decades of effort, the Deschutes River Alliance and Confederated Tribes of Warm Springs reached a landmark agreement with Portland General Electric to increase minimum flows below Pelton-Round Butte dams, improving salmon passage.', src: 'Deschutes River Alliance; Confederated Tribes of Warm Springs (2023)' }] },
        ],
        docs: [{ t: 'Lower Deschutes River Management Plan', s: 'BLM Prineville District', y: 2011, tp: 'Federal', pg: 180 }, { t: 'Deschutes River Fishery Assessment', s: 'ODFW', y: 2019, tp: 'Ecology', pg: 95 }],
        revs: [{ u: 'maupin_local', d: 'Jul 2024', s: 5, t: 'Maupin section at 3,200 cfs — Whitehorse, Buckskin Mary, Colorado — classic Lower Deschutes at perfect water. Camped at Macks Canyon under a million stars.' }, { u: 'deschutes_trout_nerd', d: 'Jun 2024', s: 5, t: 'Sight-fished 20-inch rainbows from the raft for two days. The Lower Deschutes trout fishery is unreal.' }],
        outs: [{ n: 'All Star Rafting', d: 'Maupin-based Deschutes trips', l: 'allstarrafting.com' }, { n: 'Deschutes River Adventures', d: 'Full-day and multi-day floats', l: 'deschutesriveradventures.com' }],
      },
      {
        id: 'mckenzie', n: 'McKenzie River', ww: false, wild: true, coastal: true, desert: false,
        co: 'Lane Co.', len: '90 mi', cls: 'I–III', opt: '600–3500',
        g: '14162500', avg: 1800, histFlow: 1650, mx: 200, my: 120, abbr: 'OR',
        desc: 'Spring-fed, emerald-green, and remarkably constant in flow — the McKenzie is one of Oregon\'s most beloved and photogenic rivers. Flows from the Cascade foothills through old-growth forest to the Willamette Valley. Exceptional drift boat trout fishing, gorgeous family floats, and wild Class III whitewater.',
        desig: 'National Wild & Scenic River (upper reach) · Willamette National Forest',
        secs: ['Clear Lake to Belknap Springs — Class I–II, crystal spring source', 'Paradise to Finn Rock — Class II–III, most popular float', 'Finn Rock to Walterville — Class I–II, mellow and scenic'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Kalapuya — Willamette Valley River People', text: "The McKenzie River watershed was Kalapuya territory, part of the broader Willamette Valley Kalapuya confederation. The river's exceptional trout runs supported communities throughout the valley.", src: 'Confederated Tribes of Grand Ronde; University of Oregon' }] },
          { era: 'survey', entries: [{ yr: '1988', title: 'Upper McKenzie Wild & Scenic Designation', text: 'Congress designated the upper McKenzie — from its source at Clear Lake to Paradise Campground — as a National Wild & Scenic River, protecting the spring source and old-growth forest corridor.', src: 'USFS Willamette NF' }] },
          { era: 'modern', entries: [{ yr: '2020', title: 'Holiday Farm Fire — Devastating and Recovering', text: 'The Holiday Farm Fire of September 2020 burned over 170,000 acres along the McKenzie corridor, destroying dozens of communities and dramatically altering the landscape. The river itself survived; the surrounding forest is in active recovery.', src: 'USFS; Oregon Department of Forestry (2020)' }] },
        ],
        docs: [{ t: 'McKenzie River Wild & Scenic River Plan', s: 'USFS Willamette NF', y: 2002, tp: 'Federal', pg: 125 }, { t: 'McKenzie River Water Quality Report', s: 'Lane County Water District', y: 2022, tp: 'Ecology', pg: 55 }],
        revs: [{ u: 'eugene_river_crew', d: 'Aug 2024', s: 5, t: 'Paradise to Finn Rock at 1,400 cfs — emerald green water, old-growth cedar, Class II–III waves. Perfect Oregon summer day.' }, { u: 'mckenzie_drift_guide', d: 'Sep 2024', s: 4, t: "Sight-fishing rainbows in the McKenzie's gin-clear water — they show like neon signs. Best trout visibility I've seen anywhere." }],
        outs: [{ n: 'Oregon Drift Boat Guide Service', d: 'McKenzie drift boat trips', l: 'oregondriftboat.com' }, { n: 'Lane County River Adventures', d: 'McKenzie canoe and kayak trips', l: 'laneriveradventures.com' }],
      },
    ],
  },

  // ── WASHINGTON ─────────────────────────────────────────────────
  wa: {
    name: 'Washington', abbr: 'WA', label: 'Washington Rivers',
    filters: ['all', 'ww', 'wild', 'pnw', 'eastside'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', pnw: 'West Cascades', eastside: 'East Cascades' },
    rivers: [
      {
        id: 'wenatchee', n: 'Wenatchee River', ww: true, wild: false, pnw: false, eastside: true,
        co: 'Chelan / Kittitas Co.', len: '53 mi', cls: 'II–IV', opt: '1500–5000',
        g: '12462500', avg: 3100, histFlow: 2800, mx: 380, my: 82, abbr: 'WA',
        desc: 'The Wenatchee River through Tumwater Canyon and the Leavenworth-to-Monitor corridor is the most paddled whitewater river in Washington state. Drains from Stevens Pass and Lake Wenatchee through Bavarian-themed Leavenworth to the Columbia at Wenatchee. Class III–IV Tumwater Canyon is spectacular.',
        desig: 'Wenatchee River Corridor Recreation Area · Wenatchee National Forest (upper)',
        secs: ['Tumwater Canyon — Class III–IV, technical and steep', 'Leavenworth to Monitor — Class II–III, most popular corridor', 'Monitor to Columbia confluence — Class I–II, family float'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Wenatchi (Pisquow) — People of the River", text: "The Wenatchee River was the heart of the Wenatchi (Pisquow) people's territory. 'Wenatchee' derives from their name and means roughly 'river flowing from a canyon.' The river's salmon runs were central to Wenatchi food sovereignty and ceremony.", src: 'Colville Confederated Tribes; Chelan County Historical Society' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Tumwater Canyon — Iconic Washington Whitewater', text: "Tumwater Canyon's Class III–IV rapids — Drunkard's Drop, Rock 'n Roll, and Granny's — attract thousands of whitewater paddlers annually. The canyon road (US-2) provides one of the most scenic shuttles in the Northwest.", src: 'Washington Kayak Club; American Whitewater' }] },
        ],
        docs: [{ t: 'Wenatchee River Corridor Management Plan', s: 'Chelan County; USFS Wenatchee NF', y: 2014, tp: 'Recreation', pg: 88 }],
        revs: [{ u: 'tumwater_regular', d: 'May 2024', s: 5, t: "Tumwater at 3,800 cfs — Drunkard's Drop was a carnage-free session, everyone surfed Rock 'n Roll, Granny's put one swimmer in the river. Perfect WA spring day." }, { u: 'leavenworth_float', d: 'Jul 2024', s: 4, t: 'Leavenworth to Monitor section at 2,200 cfs — Class II family float through the orchard valley. Finished with schnitzel and beer. Could not be more Washington.' }],
        outs: [{ n: 'Leavenworth Outdoor Center', d: 'Wenatchee trips, rentals, instruction', l: 'leavenworthoutdoor.com' }, { n: 'Osprey Rafting', d: 'Tumwater Canyon guided trips', l: 'ospreyrafting.com' }],
      },
      {
        id: 'methow', n: 'Methow River', ww: false, wild: false, pnw: false, eastside: true,
        co: 'Okanogan Co.', len: '90 mi', cls: 'I–III', opt: '800–3500',
        g: '12449950', avg: 1400, histFlow: 1250, mx: 300, my: 42, abbr: 'WA',
        desc: "Flows through the Methow Valley — one of Washington's most stunning landscapes — from the North Cascades to the Columbia River. Surrounded by the Okanogan-Wenatchee National Forest and the Pasayten Wilderness. A river that delivers solitude, wildlife, and Class I–III paddling through an increasingly prized outdoor recreation valley.",
        desig: 'Wild and Scenic River Study Reach · North Cascades ecosystem',
        secs: ['Upper Methow — Mazama to Winthrop, Class I–II, mountain valley', 'Winthrop to Twisp — Class II, orchard corridor', 'Twisp to Carlton — Class II–III, most technical', 'Lower Methow — Carlton to Columbia, Class I–II'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Methow (Smimilkameen) People — North Cascades Trade Network', text: 'The Methow Valley was homeland of the Methow (Smimilkameen or S\'Methow) people, who maintained extensive trade networks throughout the North Cascades. The river provided critical salmon, and the valley served as a gathering place for tribes from the Columbia Plateau, coast, and interior.', src: 'Colville Confederated Tribes; Okanogan County Historical Society' }] },
          { era: 'modern', entries: [{ yr: '2015', title: 'Methow Valley — Destination Recreation', text: "The Methow Valley has emerged as one of Washington's premier outdoor recreation destinations, with world-class cross-country skiing in winter and kayaking, hiking, and mountain biking in summer.", src: 'Methow Valley Sport Trails Association; Methow Salmon Recovery Foundation' }] },
        ],
        docs: [{ t: 'Methow River Corridor Assessment', s: 'WA Ecology/Okanogan County', y: 2018, tp: 'Survey', pg: 75 }],
        revs: [{ u: 'methow_valley_local', d: 'Jun 2024', s: 4, t: 'Mazama to Winthrop at 1,600 cfs — Class II through the most beautiful valley in Washington. Saw a black bear on the bank near Early Winters Creek.' }, { u: 'north_cascades_paddle', d: 'Jul 2024', s: 5, t: 'Twisp to Carlton at 1,100 cfs — actual Class II–III through a canyon section nobody knows about. Found our new home water.' }],
        outs: [{ n: 'Methow Valley Outdoor Adventures', d: 'River trips and instruction', l: 'methowvalleyoutdoor.com' }],
      },
      {
        id: 'skagit', n: 'Skagit River', ww: false, wild: true, pnw: true, eastside: false,
        co: 'Skagit / Whatcom Co.', len: '150 mi', cls: 'I–III', opt: '4000–15000',
        g: '12178000', avg: 8500, histFlow: 7800, mx: 170, my: 55, abbr: 'WA',
        desc: "Washington's second-largest river by volume, draining the North Cascades and flowing to Puget Sound. The Skagit is one of the last rivers in the lower 48 to support all five Pacific salmon species. The upper Skagit is the only place in the lower 48 where bald eagles winter in the thousands.",
        desig: 'National Wild & Scenic River (upper 158 miles) · North Cascades National Park (upper watershed)',
        secs: ['Upper Skagit — Newhalem to Marblemount, Wild & Scenic, Class II', 'Marblemount to Rockport — Class I–II, eagle watching corridor', 'Rockport to Sedro-Woolley — Class I–II, agricultural valley', 'Lower Skagit — Sedro-Woolley to Puget Sound, flatwater and tidal'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Upper Skagit and Sauk-Suiattle — River People of the North Cascades', text: 'The Upper Skagit Indian Tribe and Sauk-Suiattle Indian Tribe have inhabited the Skagit River watershed since time immemorial. The five salmon species that return to the Skagit are central to tribal culture, food sovereignty, and ceremony. Both tribes retain treaty-reserved fishing rights that predate Washington statehood.', src: 'Upper Skagit Indian Tribe; Sauk-Suiattle Indian Tribe' }] },
          { era: 'logging', entries: [{ yr: '1890s–1940s', title: 'Skagit Hydroelectric Dams — Power for Seattle', text: "Seattle City Light built three major dams on the upper Skagit between 1924 and 1954 (Gorge, Diablo, Ross dams), creating Seattle's primary power supply. The Wild & Scenic designation protects the river below Ross Dam from further impoundment.", src: 'Seattle City Light; Skagit County Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1978', title: 'Upper Skagit Wild & Scenic — Protection Below Ross Dam', text: 'Congress designated 158 miles of the upper Skagit as Wild & Scenic, preventing further dam construction below Ross Dam and protecting the extraordinary salmon habitat and North Cascades corridor.', src: 'Wild & Scenic Rivers Act Amendments (1978)' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Bald Eagle Winter Gathering — Up to 500+ Eagles', text: 'The upper Skagit between Rockport and Marblemount hosts one of the largest winter bald eagle concentrations in the lower 48 — up to 500+ eagles gathering to feed on spawned-out chum salmon. The Skagit Eagles Fest draws birders and paddlers from across the Northwest.', src: 'Skagit Land Trust; Audubon Society of Western Washington' }] },
        ],
        docs: [{ t: 'Upper Skagit Wild & Scenic River Management Plan', s: 'Mount Baker-Snoqualmie NF', y: 2005, tp: 'Federal', pg: 175 }, { t: 'Skagit River Salmon Recovery Plan', s: 'Skagit Watershed Council', y: 2018, tp: 'Ecology', pg: 215 }],
        revs: [{ u: 'skagit_eagle_paddle', d: 'Feb 2024', s: 5, t: 'Floated the Rockport stretch in February — counted 47 bald eagles from the water in 6 miles. Pink salmon carcasses on every gravel bar. One of the most wildlife-rich floats I\'ve ever done.' }, { u: 'north_cascades_paddler', d: 'Jul 2024', s: 4, t: 'Upper Skagit below Newhalem at 6,000 cfs — fast Class II with 8,000-foot peaks dropping straight to the river. North Cascades are on another level.' }],
        outs: [{ n: 'Osprey River Adventures', d: 'Skagit eagle float trips', l: 'ospreyriveradventures.com' }, { n: 'Skagit River Kayak', d: 'Upper Skagit guided day trips', l: 'skagitkayak.com' }],
      },
    ],
  },

  // ── PENNSYLVANIA ───────────────────────────────────────────────
  pa: {
    name: 'Pennsylvania', abbr: 'PA', label: 'Pennsylvania Rivers',
    filters: ['all', 'ww', 'wild', 'nat', 'scenic'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', nat: 'Natural Area', scenic: 'Scenic' },
    rivers: [
      {
        id: 'yough', n: 'Youghiogheny River', ww: true, wild: true, nat: true, scenic: false,
        co: 'Fayette / Somerset Co.', len: '132 mi', cls: 'III–V', opt: '1500–4000',
        g: '03076500', avg: 2100, histFlow: 1900, mx: 510, my: 118, abbr: 'PA',
        desc: "The 'Yough' (pronounced 'yock') is the crown jewel of eastern Pennsylvania whitewater — a Class III–V river that flows through the Laurel Highlands of the Allegheny Mountains. The Youghiogheny Gorge at Ohiopyle State Park is one of the most popular whitewater destinations in the eastern U.S. Three distinct sections serve every skill level.",
        desig: 'Ohiopyle State Park · Pennsylvania Scenic Rivers Program',
        secs: ['Lower Yough (Ohiopyle to Bruner Run) — Class III–IV, 7.5 mi, most popular in the East', 'Middle Yough (Confluence to Ohiopyle) — Class I–II, beginner friendly', 'Upper Yough (Sang Run to Friendsville MD) — Class IV–V, technical and demanding'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Lenape and Shawnee — Confluence Country", text: "The Youghiogheny River valley was part of the Lenape (Delaware) and Shawnee homeland in western Pennsylvania. The word 'Youghiogheny' derives from an Algonquian term meaning 'stream flowing in a contrary direction' — a reference to its northward flow before joining the Monongahela.", src: 'Pennsylvania Historical and Museum Commission; Lenape Nation of Pennsylvania' }] },
          { era: 'logging', entries: [{ yr: '1800s–1920s', title: 'Connellsville Coke and the Industrial Yough', text: "The lower Youghiogheny valley became the center of the American coke industry in the late 1800s. Connellsville coke — produced from the region's thick coal seams — fueled the steel furnaces of Pittsburgh. The river was badly polluted by coal and coke operations by 1900; a century of recovery has restored its water quality remarkably.", src: 'Fayette County Historical Society; PADEP' }, { yr: '1754', title: 'Fort Necessity — French and Indian War', text: "George Washington's 1754 Battle of Fort Necessity — the opening engagement of the French and Indian War — was fought near the headwaters of the Youghiogheny. The region was contested ground between the British and French empires.", src: 'NPS Fort Necessity National Battlefield' }] },
          { era: 'survey', entries: [{ yr: '1978', title: 'Ohiopyle State Park Whitewater Management Plan', text: "Pennsylvania's landmark management plan for the Lower Yough established permit systems, safety requirements, and carrying capacities for the most-paddled whitewater in the eastern U.S.", src: 'Pennsylvania DCNR; Ohiopyle State Park' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Lower Yough — 250,000+ Annual Paddlers', text: 'The Lower Yough through Ohiopyle State Park hosts over 250,000 paddlers annually, making it the most commercially rafted river in the eastern United States.', src: 'Pennsylvania DCNR; Ohiopyle State Park Annual Report 2024' }] },
        ],
        docs: [{ t: 'Youghiogheny River Wild & Scenic Study', s: 'PADEP', y: 2018, tp: 'Survey', pg: 140 }, { t: 'Ohiopyle Whitewater Recreation Study', s: 'PA DCNR', y: 2020, tp: 'Recreation', pg: 95 }],
        revs: [{ u: 'ohiopyle_regular', d: 'Jun 2024', s: 5, t: 'Lower Yough at 2,400 cfs — Cucumber, Railroad, and Dimple Rock all throwing big waves. Most reliable Class IV in the East.' }, { u: 'upper_yough_veteran', d: 'May 2024', s: 5, t: 'Upper Yough at 1,800 cfs with a crew of 6 kayakers. Gap Falls to National Run is as good as anything in the Northeast.' }],
        outs: [{ n: 'Ohiopyle State Park Outfitters', d: 'Lower Yough raft and kayak trips', l: 'ohiopyle.com' }, { n: 'Wilderness Voyageurs', d: 'Yough trips since 1964', l: 'wilderness-voyageurs.com' }, { n: 'White Water Adventurers', d: 'Lower, Middle and Upper Yough', l: 'wwaraft.com' }],
      },
      {
        id: 'loyalsock', n: 'Loyalsock Creek', ww: true, wild: false, nat: true, scenic: true,
        co: 'Lycoming / Sullivan Co.', len: '64 mi', cls: 'II–IV', opt: '400–2000',
        g: '01554000', avg: 890, histFlow: 820, mx: 580, my: 65, abbr: 'PA',
        desc: "Hidden gem of north-central Pennsylvania. The Loyalsock flows 64 miles through the Loyalsock State Forest in the ridge-and-valley Appalachians, with dramatic rapids and gorge scenery rarely seen in the East. Exceptional paddling late March through May.",
        desig: "Pennsylvania Natural Area (World's End State Park corridor)",
        secs: ["Alpine Run to World's End — Class II–III, gorge scenery", "World's End to Hillsgrove — Class III–IV, steepest whitewater", 'Lower Loyalsock to Montoursville — Class II, accessible'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Lenape — 'Middle Creek' of the Susquehanna Watershed", text: "The Loyalsock watershed was Lenape (Delaware) territory, part of the broader Susquehanna corridor they called home. 'Loyalsock' derives from the Lenape word 'Lawi-saquick' meaning 'middle creek.'", src: 'Pennsylvania Historical and Museum Commission; Lenape Nation' }] },
          { era: 'logging', entries: [{ yr: '1840s–1900', title: "Loyalsock Log Drives — Pennsylvania's Last Pine", text: "The Loyalsock watershed contained some of the last virgin white pine and hemlock in Pennsylvania. Log drives ran the creek annually to mills at Williamsport — then the largest lumber-producing city in the world.", src: 'Lycoming County Historical Society; Pennsylvania Lumber Museum' }] },
          { era: 'modern', entries: [{ yr: '2024', title: "World's End State Park — Year-Round Recreation Hub", text: "World's End State Park on the upper Loyalsock hosts swimming, hiking, and paddling through some of the most dramatic scenery in Pennsylvania. The canyon walls rise over 500 feet from the creek.", src: 'Pennsylvania DCNR' }] },
        ],
        docs: [{ t: 'Loyalsock Creek Watershed Assessment', s: 'PADEP', y: 2015, tp: 'Ecology', pg: 112 }],
        revs: [{ u: 'lycoming_paddler', d: 'Apr 2024', s: 5, t: "Loyalsock at 1,100 cfs — Loyalsock Falls and the gorge above World's End are extraordinary. Best kept secret in PA paddling." }, { u: 'pa_creek_chaser', d: 'May 2024', s: 4, t: 'Hit it at 700 cfs in May — still great. The hemlock gorge walls and crystal clear water are unlike anything else in the Mid-Atlantic.' }],
        outs: [{ n: 'Loyalsock Adventures', d: 'Guided creek trips and shuttles', l: 'loyalsockadventures.com' }],
      },
      {
        id: 'pinecreek', n: 'Pine Creek', ww: false, wild: false, nat: false, scenic: true,
        co: 'Tioga / Lycoming Co.', len: '73 mi', cls: 'I–II', opt: '300–1500',
        g: '01553500', avg: 780, histFlow: 720, mx: 460, my: 50, abbr: 'PA',
        desc: "The Pennsylvania Grand Canyon. Pine Creek flows 73 miles through the deepest gorge in the eastern United States — walls rising 1,000 feet above the creek, maintained as a Pennsylvania State Forest. A 62-mile rail-trail runs the entire length of the gorge.",
        desig: 'Pennsylvania Grand Canyon · Tioga State Forest',
        secs: ['Ansonia to Tiadaghton — 28 mi, upper gorge, most scenic', 'Tiadaghton to Blackwell — 25 mi, mid-gorge classic', 'Blackwell to Waterville — 18 mi, lower gorge and rail-trail'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Seneca Iroquois — 'The Long Path' Through the Canyon", text: "The Pine Creek Gorge was within the territory of the Seneca Nation, the westernmost of the Haudenosaunee (Iroquois) Confederacy. The gorge served as a travel corridor and hunting ground. The Seneca called the region 'Tiadaghton.'", src: 'Seneca Nation of Indians; Pennsylvania Historical and Museum Commission' }] },
          { era: 'logging', entries: [{ yr: '1850s–1920', title: 'The Great Pine Harvest — Williamsport Mills', text: "Pine Creek was one of the most heavily used log drive routes in Pennsylvania history. Millions of board feet of white pine were driven annually to the mills at Williamsport, which by 1880 was the richest city per capita in the United States.", src: 'Lycoming County Historical Society; Pennsylvania Lumber Museum' }] },
          { era: 'modern', entries: [{ yr: '2012', title: 'Pine Creek Rail-Trail — 62 Miles of Gorge Access', text: "The completion of the Pine Creek Rail-Trail on the former Jersey Shore, Pine Creek & Buffalo Railroad bed created a 62-mile pathway through the gorge, making Pine Creek uniquely accessible for paddle-and-bike combinations.", src: 'Pennsylvania Wilds; Rails-to-Trails Conservancy' }] },
        ],
        docs: [{ t: 'Pine Creek Corridor Management Plan', s: 'Tioga State Forest / PA DCNR', y: 2016, tp: 'Recreation', pg: 145 }],
        revs: [{ u: 'pa_grand_canyon_fan', d: 'Oct 2024', s: 5, t: 'Pine Creek at 900 cfs in fall color — gorge walls in red and orange, trail cyclists waving from the bank. Magical.' }, { u: 'spring_runoff_chaser', d: 'Apr 2024', s: 5, t: "April flood at 1,800 cfs — fast Class II through the canyon with walls towering overhead. Eastern paddling doesn't get grander than this." }],
        outs: [{ n: 'Pine Creek Outfitters', d: 'Gorge canoe trips and rail-trail shuttles', l: 'pinecreekoutfitters.com' }, { n: "Wolfe's General Store", d: 'Blackwell rentals and camping', l: 'wolfesgeneral.com' }],
      },
    ],
  },

  // ── MONTANA ────────────────────────────────────────────────────
  mt: {
    name: 'Montana', abbr: 'MT', label: 'Montana Rivers',
    filters: ['all', 'ww', 'wild', 'remote', 'fishing'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', remote: 'Backcountry', fishing: 'Blue-Ribbon Fishing' },
    rivers: [
      {
        id: 'flathead', n: 'Flathead River — Middle Fork', ww: true, wild: true, remote: true, fishing: true,
        co: 'Flathead / Glacier Co.', len: '94 mi', cls: 'I–IV', opt: '2000–8000',
        g: '12358500', avg: 3400, histFlow: 3100, mx: 165, my: 55, abbr: 'MT',
        desc: 'One of the most spectacular wilderness river corridors in the American West — flows along the southern boundary of Glacier National Park and through the Great Bear Wilderness. Bears (both black and grizzly), mountain goats, moose, and wolves inhabit the corridor.',
        desig: 'National Wild & Scenic River · Great Bear Wilderness · Glacier National Park boundary',
        secs: ['Upper Middle Fork — Schafer Meadows to Moccasin, remote wilderness float', 'Middle section — Spruce Park to Bear Creek, Class II–III', 'Lower Middle Fork — Bear Creek to Columbia Falls, Class III–IV'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Blackfeet (Niitsitapi) and Salish-Kootenai — Glacier Country', text: "The Flathead River watershed was shared territory of the Blackfeet Nation and the Confederated Salish and Kootenai Tribes. The Blackfeet, who called themselves Niitsitapi ('real people'), held the Rocky Mountain Front east of the Continental Divide. The 1855 Hellgate Treaty established the Flathead Reservation and ceded vast territories.", src: 'Blackfeet Nation; Confederated Salish and Kootenai Tribes' }] },
          { era: 'survey', entries: [{ yr: '1976', title: 'Wild & Scenic River Designation — Middle Fork', text: 'Congress designated the Middle Fork Flathead as a Wild & Scenic River in 1976, protecting the 94-mile corridor from development and dam proposals.', src: 'Wild & Scenic Rivers Act Amendments (1976)' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Grizzly Bear Density — Highest in Lower 48', text: 'The Flathead valley and surrounding wildlands host the highest density of grizzly bears in the contiguous United States. Bear canisters and proper food storage are required on permitted river trips.', src: 'USFWS Grizzly Bear Recovery Program; Flathead NF' }] },
        ],
        docs: [{ t: 'Middle Fork Flathead Wild & Scenic River Management Plan', s: 'Flathead NF', y: 2004, tp: 'Federal', pg: 145 }, { t: 'Flathead River System Hydrology', s: 'USGS Montana WSC', y: 2002, tp: 'Hydrology', pg: 110 }],
        revs: [{ u: 'glacier_boundary_paddler', d: 'Jul 2024', s: 5, t: 'Middle Fork at 4,800 cfs — flew into Schafer Meadows, 5-day float to West Glacier. Grizzly on the bank twice, mountain goats on cliffs above Spruce Park. Nothing else in the lower 48 compares.' }, { u: 'great_bear_vet', d: 'Aug 2024', s: 5, t: 'Upper section was biblical. No trail, no roads, no other groups. Just the river, the forest, and the mountains. And a griz eating berries 30 yards off the bank on Day 3.' }],
        outs: [{ n: 'Glacier Raft Company', d: 'Middle Fork Flathead trips, all levels', l: 'glacierraftco.com' }, { n: 'Wild River Adventures', d: 'Multi-day Middle Fork expeditions', l: 'wildrivermt.com' }],
      },
      {
        id: 'gallatin', n: 'Gallatin River', ww: true, wild: false, remote: false, fishing: true,
        co: 'Gallatin Co.', len: '120 mi', cls: 'I–IV', opt: '600–3000',
        g: '06043500', avg: 1100, histFlow: 980, mx: 320, my: 130, abbr: 'MT',
        desc: "Flows from Yellowstone National Park through Big Sky and Bozeman to the Missouri River. Immortalized in 'A River Runs Through It' (filmed partly on the Gallatin and nearby Blackfoot). World-class whitewater above Big Sky, blue-ribbon trout fishing below.",
        desig: 'Blue-Ribbon Trout Stream (Montana FWP) · Yellowstone National Park headwaters',
        secs: ['Yellowstone Park headwaters — Class I–II, wildlife-rich', 'Big Sky Canyon — Class III–IV, the best whitewater', 'Gallatin Gateway to Bozeman — Class II–III, popular family run', 'Lower Gallatin — Class I–II, fly-fishing country'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Crow (Apsáalooke) and Blackfeet — Yellowstone Country', text: 'The Gallatin River flows from Yellowstone, the ancestral homeland of the Crow (Apsáalooke) Nation and a shared hunting territory with the Blackfeet and Shoshone. Lewis and Clark\'s 1806 return journey passed through the Gallatin Valley.', src: 'Crow Nation; Yellowstone National Park; Montana Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1982', title: 'Designated Montana Blue-Ribbon Trout Stream', text: 'Montana Fish, Wildlife and Parks designated the Gallatin as a Blue-Ribbon Trout Stream, recognizing its exceptional wild trout populations and regulating angling to protect the fishery.', src: 'Montana FWP' }] },
          { era: 'modern', entries: [{ yr: '1992', title: "'A River Runs Through It' — Montana's River in American Culture", text: "Robert Redford's 1992 film — based on Norman Maclean's novella and filmed partly on the Gallatin, Blackfoot, and Yellowstone rivers — placed Montana fly-fishing in the American imagination.", src: 'Norman Maclean Foundation; Redford Productions' }] },
        ],
        docs: [{ t: 'Gallatin River Recreation Management Plan', s: 'Gallatin NF', y: 2010, tp: 'Recreation', pg: 88 }, { t: 'Gallatin River Water Quality Assessment', s: 'Montana DEQ', y: 2021, tp: 'Ecology', pg: 72 }],
        revs: [{ u: 'big_sky_kayaker', d: 'Jun 2024', s: 5, t: 'Big Sky Canyon at 1,800 cfs — House Rock and Mad Mile both pumping. Snowcapped peaks above and crystal water below. Montana delivered.' }, { u: 'gallatin_fly_guide', d: 'Sep 2024', s: 5, t: 'Blue-ribbon brown trout float below Bozeman — 20-inch fish visible in every pool. Maclean would have wept.' }],
        outs: [{ n: 'Montana Whitewater', d: 'Gallatin Canyon rafting since 1976', l: 'montanawhitewater.com' }, { n: 'Geyser Whitewater', d: 'All Gallatin sections', l: 'geyserwhitewater.com' }],
      },
      {
        id: 'blackfoot', n: 'Blackfoot River', ww: false, wild: false, remote: false, fishing: true,
        co: 'Powell / Missoula Co.', len: '132 mi', cls: 'I–III', opt: '1500–5000',
        g: '12340000', avg: 2200, histFlow: 2000, mx: 240, my: 115, abbr: 'MT',
        desc: "'A River Runs Through It' country. Norman Maclean's Blackfoot River flows 132 miles from the Continental Divide to the Clark Fork near Missoula. A beloved recreation river restored through a landmark conservation partnership. Exceptional fly-fishing, continuous Class II–III whitewater in spring, and access to some of the last wild bull trout habitat in the lower 48.",
        desig: 'Blackfoot Challenge Conservation Area · Montana Blue-Ribbon Trout Stream',
        secs: ['Upper Blackfoot — Landers Fork to Lincoln, Class I–II', 'Middle Blackfoot — Lincoln to Clearwater junction, Class II–III', 'Lower Blackfoot — Clearwater to Clark Fork, the Maclean water'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Blackfeet and Salish — 'The River of the Road to the Buffalo'", text: "The Blackfoot River was named by early settlers for the Blackfoot (Blackfeet) Nation, who used the river corridor as a route to the buffalo plains east of the Rockies. The Salish people (Séliš) also inhabited the valley.", src: 'Confederated Salish and Kootenai Tribes; Blackfeet Nation' }] },
          { era: 'logging', entries: [{ yr: '1880s–1970s', title: 'Mining and Timber — Near Destruction of the Fishery', text: "Copper mining at Anaconda and chrome mining throughout the upper watershed severely degraded the Blackfoot's water quality in the 20th century. By the 1980s, the famed wild bull trout and westslope cutthroat populations had collapsed. The recovery story is one of the most remarkable in American conservation.", src: 'Blackfoot Challenge; Montana Trout Unlimited' }] },
          { era: 'survey', entries: [{ yr: '1993', title: 'Blackfoot Challenge Founded — Landmark Collaborative Conservation', text: 'The Blackfoot Challenge was established as a voluntary collaborative among landowners, agencies, and conservation organizations — one of the first watershed-scale conservation partnerships in the West. It has protected over 300,000 acres and restored much of the river\'s historic fishery.', src: 'Blackfoot Challenge; The Nature Conservancy' }] },
          { era: 'modern', entries: [{ yr: '1992', title: "Norman Maclean and 'A River Runs Through It'", text: "The Blackfoot River is the setting of Norman Maclean's 'A River Runs Through It' — the most celebrated piece of American river writing. Published posthumously and turned into a film, it placed the Blackfoot permanently in American literary and cultural consciousness.", src: 'Norman Maclean Foundation; University of Chicago Press' }] },
        ],
        docs: [{ t: 'Blackfoot River Fisheries Assessment', s: 'Montana FWP', y: 2020, tp: 'Ecology', pg: 85 }, { t: 'Blackfoot Watershed Conservation Plan', s: 'Blackfoot Challenge', y: 2018, tp: 'Survey', pg: 180 }],
        revs: [{ u: 'maclean_water_pilgrim', d: 'Jul 2024', s: 5, t: 'Floated the Maclean water above Missoula. Every bend felt like a sentence from the book. Wild cutthroat rising to PMDs. Spiritual experience.' }, { u: 'blackfoot_local_mt', d: 'Jun 2024', s: 4, t: 'Middle Blackfoot at 2,800 cfs in June — continuous Class II with constant wildlife. Osprey, eagles, deer, and a black bear swimming across above Johnsrud.' }],
        outs: [{ n: 'Ten Spoon Winery & Vineyard', d: 'Blackfoot float-and-wine packages', l: 'tenspoon.com' }, { n: 'Missoula Paddleheads', d: 'Blackfoot canoe and kayak rentals', l: 'missoulapaddleheads.com' }],
      },
    ],
  },

  // ── TENNESSEE ──────────────────────────────────────────────────
  tn: {
    name: 'Tennessee', abbr: 'TN', label: 'Tennessee Rivers',
    filters: ['all', 'ww', 'wild', 'nat', 'appalachian'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', nat: 'Natural Area', appalachian: 'Appalachians' },
    rivers: [
      {
        id: 'nolichucky', n: 'Nolichucky River', ww: true, wild: true, nat: true, appalachian: true,
        co: 'Unicoi / Greene Co.', len: '115 mi', cls: 'III–IV', opt: '600–3000',
        g: '03469500', avg: 1400, histFlow: 1280, mx: 530, my: 95, abbr: 'TN',
        desc: "The Nolichucky gorge is the deepest river gorge in the eastern United States — deeper even than the New River Gorge. Plunges through the Unaka Mountains in a 3,000-foot-deep canyon in the Pisgah National Forest. Class III–IV rapids in a remote corridor with no road access for 26 miles. One of Appalachia's great wilderness paddling experiences.",
        desig: 'Nolichucky Gorge Special Management Area · Pisgah National Forest',
        secs: ['Poplar NC to Erwin TN — Class III–IV, the 26-mile gorge run', 'Erwin to Embreeville — Class I–II, post-gorge recovery', 'Lower Nolichucky — Class I, farm country'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Cherokee (Tsalagi) — 'River of Many Cliffs'", text: "The Nolichucky River was Cherokee (Tsalagi) territory for thousands of years. 'Nolichucky' derives from the Cherokee word for 'spruce tree place' or 'rapid river with banks of shoal.' The gorge was a spiritual landmark. The 1791 Treaty of Holston and subsequent land cessions dispossessed Cherokee from the watershed.", src: 'Eastern Band of Cherokee Indians; Tennessee Historical Society' }] },
          { era: 'logging', entries: [{ yr: '1880s–1930s', title: 'Champion Paper Company and the Pisgah Forest Logging', text: 'The Nolichucky headwaters in North Carolina were extensively logged by Champion Paper Company in the early 20th century, with a narrow-gauge railroad penetrating the gorge for timber removal.', src: 'Pisgah National Forest Historical Records; Unicoi County Historical Society' }] },
          { era: 'survey', entries: [{ yr: '2010', title: 'Nolichucky Gorge Special Management Area', text: 'The USFS designated the 26-mile gorge as a Special Management Area to protect the extraordinary ecological and recreational values of the roadless corridor.', src: 'USFS Pisgah National Forest (2010)' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Nolichucky Gorge — Premier Appalachian Wilderness Float', text: 'The Nolichucky Gorge consistently ranks among the top 10 wilderness river experiences in the eastern U.S. Shuttles require driving over Unaka Mountain on a switchback road. The remoteness is the point.', src: 'American Whitewater; Appalachian Trail Conservancy' }] },
        ],
        docs: [{ t: 'Nolichucky Gorge Recreation Area Assessment', s: 'USFS Pisgah NF', y: 2014, tp: 'Recreation', pg: 95 }],
        revs: [{ u: 'appalachian_paddler', d: 'May 2024', s: 5, t: 'Nolichucky at 1,800 cfs — 26 miles through the deepest gorge in the East, no roads, no people. Quarter Mile, Roostertail, Island Creek Falls. The real deal.' }, { u: 'tn_river_devotee', d: 'Apr 2024', s: 5, t: 'First trip at 1,200 cfs. The shuttle drive over the mountain is an adventure in itself. The gorge walls above Quarter Mile were absolutely silent between the drops.' }],
        outs: [{ n: 'USA Raft', d: 'Nolichucky guided trips from Erwin TN', l: 'usaraft.com' }, { n: 'Nantahala Outdoor Center', d: 'Nolichucky and regional Appalachian rivers', l: 'noc.com' }],
      },
      {
        id: 'obeds', n: 'Obed Wild & Scenic River', ww: true, wild: true, nat: false, appalachian: true,
        co: 'Cumberland / Morgan Co.', len: '45 mi', cls: 'III–V', opt: '400–2000',
        g: '03537500', avg: 890, histFlow: 820, mx: 400, my: 105, abbr: 'TN',
        desc: "Tennessee's only National Wild & Scenic River — and among the best-kept secrets in eastern whitewater. The Obed and its tributaries (Clear Creek and Daddy's Creek) cut through the Cumberland Plateau in dramatic sandstone gorges. Technical, unforgiving, and extraordinary.",
        desig: "Tennessee's Only National Wild & Scenic River (1976) · NPS Obed Wild & Scenic River",
        secs: ['Obed Junction to Nemo — Class IV–V, technical', "Clear Creek Gorge — Class IV+, the hardest tributary", "Daddy's Creek — Class III–IV, most accessible section"],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Cherokee Hunting Grounds — The Cumberland Plateau', text: 'The Cumberland Plateau including the Obed watershed was a vast hunting ground contested between the Cherokee, Creek (Muscogee), and later Shawnee.', src: 'Tennessee Historical Commission; Eastern Band of Cherokee Indians' }] },
          { era: 'survey', entries: [{ yr: '1976', title: "Wild & Scenic Designation — Tennessee's Only", text: "Congress designated the Obed and portions of Clear Creek and Daddy's Creek as Wild & Scenic in 1976, making it Tennessee's only river with federal Wild & Scenic protection.", src: 'NPS Obed Wild & Scenic River; Wild & Scenic Rivers Act (1976)' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Rock Climbing and Paddling — A Two-Sport Mecca', text: "The Obed's sandstone cliffs have become one of the premier rock climbing destinations in the Southeast alongside its whitewater reputation.", src: 'NPS Obed Wild & Scenic River; American Alpine Club' }] },
        ],
        docs: [{ t: 'Obed Wild & Scenic River Comprehensive Management Plan', s: 'NPS', y: 2004, tp: 'Federal', pg: 160 }],
        revs: [{ u: 'obed_when_it_rains', d: 'Mar 2024', s: 5, t: "Hit the Obed at 1,400 cfs after 3 days of rain. Obed Junction to Nemo — Class IV–V ledges in a gorgeous sandstone gorge. Tennessee's wild secret." }, { u: 'plateau_paddler_tn', d: 'Apr 2024', s: 4, t: "Clear Creek at 600 cfs — technical Class IV all day in the tightest gorge I've seen east of the Mississippi." }],
        outs: [{ n: 'Obed River Outfitters', d: 'Crossville-based guided Obed trips', l: 'obedriveroutfitters.com' }],
      },
      {
        id: 'hiwassee', n: 'Hiwassee River', ww: false, wild: false, nat: false, appalachian: true,
        co: 'Polk / Bradley Co.', len: '72 mi', cls: 'I–III', opt: '900–3500',
        g: '03566000', avg: 1700, histFlow: 1560, mx: 560, my: 120, abbr: 'TN',
        desc: "One of the Southeast's most beloved paddling rivers — flows through the Cherokee National Forest in the Blue Ridge Mountains and is regulated by releases from Apalachia Dam, creating consistent flows all summer. Outstanding for beginners and families. World-class blue-ribbon trout fishery below the dam.",
        desig: 'Cherokee National Forest · John Muir Scenic Trail · Blue-Ribbon Trout Stream',
        secs: ['Apalachia Dam release section — Class II–III, 5 mi, most popular', 'Reliance to Towee Creek — Class I–II, family float', 'Lower Hiwassee — Class I, wide and calm'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Cherokee (Tsalagi) — Heart of Cherokee Country", text: "The Hiwassee River was at the very heart of the Cherokee Nation's territory in the southern Appalachians. 'Hiwassee' derives from the Cherokee 'Ayuhwasi' meaning 'savanna' or 'meadow.' The great Cherokee town of Hiwassee Town stood near the river's confluence with the Valley River. The forced removal known as the Trail of Tears (1838) displaced thousands of Cherokee from this valley.", src: 'Eastern Band of Cherokee Indians; Trail of Tears National Historic Trail (NPS)' }] },
          { era: 'logging', entries: [{ yr: '1890s–1930s', title: 'Copper Basin Environmental Disaster — And Recovery', text: "The Copper Basin, just south of the Hiwassee watershed near Ducktown, TN, was the site of one of the worst industrial environmental disasters in American history. Copper smelting operations deforested over 50,000 acres through sulfur dioxide emissions. Reclamation efforts beginning in the 1970s have dramatically reversed the damage.", src: 'USDA Forest Service; Ducktown Basin Museum' }] },
          { era: 'survey', entries: [{ yr: '1968', title: 'John Muir Trail — Established Along the Hiwassee', text: "The John Muir National Recreation Trail follows the Hiwassee River corridor for 20 miles through Cherokee National Forest, honoring Muir's 1867 thousand-mile walk to the Gulf of Mexico.", src: 'USFS Cherokee National Forest' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'TVA Dam Releases — Most Consistent Paddling in the Southeast', text: 'TVA Apalachia Dam releases create the most predictable Class II–III paddling in the Southeast. The Hiwassee is one of the few rivers in the region where you can call the TVA hotline, confirm a release schedule, and plan a trip days in advance.', src: 'TVA River Neighbors Program; American Whitewater' }] },
        ],
        docs: [{ t: 'Hiwassee River Recreation Management Plan', s: 'USFS Cherokee NF', y: 2018, tp: 'Recreation', pg: 88 }],
        revs: [{ u: 'hiwassee_weekly', d: 'Aug 2024', s: 5, t: 'Hiwassee at a TVA release of 1,800 cfs — clearest water in Tennessee, continuous Class II, cold tailwater. Best beginner to intermediate river in the Southeast.' }, { u: 'se_paddler', d: 'Jul 2024', s: 4, t: 'Families, rafters, kayakers, tubers — everyone coexists on the Hiwassee. The Cherokee NF setting makes it feel like a true wilderness float.' }],
        outs: [{ n: 'Hiwassee Outfitters', d: 'Reliance TN rentals and shuttles', l: 'hiwasseeoutfitters.com' }, { n: 'Nantahala Outdoor Center', d: 'Hiwassee guided trips', l: 'noc.com' }],
      },
    ],
  },

  // ── CALIFORNIA ─────────────────────────────────────────────────
  ca: {
    name: 'California', abbr: 'CA', label: 'California Rivers',
    filters: ['all', 'ww', 'wild', 'sierra', 'coastal'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', sierra: 'Sierra Nevada', coastal: 'Coast Ranges' },
    rivers: [
      {
        id: 'american', n: 'American River — South Fork', ww: true, wild: false, sierra: true, coastal: false,
        co: 'El Dorado / Placer Co.', len: '21 mi', cls: 'III–IV', opt: '800–4000',
        g: '11446500', avg: 1900, histFlow: 1650, mx: 180, my: 95, abbr: 'CA',
        desc: "The most commercially rafted river in California and one of the most popular in the nation. The South Fork drops through the Sierra Nevada foothills into the American River Canyon east of Sacramento. Gorge, Tunnel Chute, and Satan's Cesspool are classic Class III–IV rapids. The river flows through the heart of Gold Rush country.",
        desig: 'Auburn State Recreation Area · Class III–IV Heritage River',
        secs: ['Chili Bar to Salmon Falls — 11 mi, Class III, most popular', 'Gorge section (Salmon Falls to Greenwood) — Class III–IV', 'Coloma to Lotus — beginner-friendly Class II–III'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Nisenan (Southern Maidu) — 'The People of the Foothills'", text: "The South Fork American River canyon was the homeland of the Nisenan (Southern Maidu) people, who inhabited the Sierra Nevada foothills for thousands of years. The river's abundant salmon and acorn harvests sustained their communities.", src: 'Nisenan Tribal Network; California State Parks' }] },
          { era: 'logging', entries: [{ yr: '1848', title: "Sutter's Mill — Gold Discovery that Changed the World", text: "On January 24, 1848, James Marshall discovered gold at Sutter's Mill on the South Fork American River at Coloma — triggering the California Gold Rush. Within two years, 300,000 people had arrived in California. The hydraulic mining that followed devastated the river system.", src: "California State Parks Sutter's Mill State Historic Park" }] },
          { era: 'survey', entries: [{ yr: '1978', title: 'Auburn Dam Defeated — Conservation Victory', text: 'The proposed Auburn Dam on the North Fork American would have flooded the entire canyon system. After decades of advocacy by river conservation groups, the project was abandoned, preserving the American River canyon as a recreation corridor.', src: 'Friends of the River; USACE' }] },
          { era: 'modern', entries: [{ yr: '2024', title: '500,000+ Annual Rafters — California\'s River Economy', text: "The South Fork American supports one of the largest commercial rafting industries in the U.S., with over 70 licensed outfitters and 500,000+ annual commercial passengers. The river generates over $100 million annually in economic impact for El Dorado County.", src: 'California Outdoor Recreation Alliance; American River Recreation Association' }] },
        ],
        docs: [{ t: 'South Fork American River Management Plan', s: 'Auburn State Recreation Area', y: 2019, tp: 'Recreation', pg: 165 }, { t: 'American River Watershed Hydrology', s: 'USGS California WSC', y: 2008, tp: 'Hydrology', pg: 95 }],
        revs: [{ u: 'sf_american_regular', d: 'May 2024', s: 5, t: 'Gorge section at 2,800 cfs — Tunnel Chute was a fire hose. Best Gold Rush history float in the Sierra. Hydraulic mining scars visible on the cliffs all day.' }, { u: 'coloma_gold_rush', d: 'Jun 2024', s: 4, t: 'Chili Bar to Salmon Falls at 1,400 cfs — perfect summer intro run. Stopped at Marshall Gold Discovery site at lunch. Living history.' }],
        outs: [{ n: 'OARS American River', d: 'South Fork American trips', l: 'oars.com' }, { n: 'Whitewater Excitement', d: 'All South Fork sections', l: 'whitewaterexcitement.com' }, { n: 'American River Raft Rentals', d: 'Self-guided trips from Coloma', l: 'arrafts.com' }],
      },
      {
        id: 'tuolumne', n: 'Tuolumne River', ww: true, wild: true, sierra: true, coastal: false,
        co: 'Tuolumne Co.', len: '18 mi', cls: 'III–V', opt: '300–2500',
        g: '11275500', avg: 980, histFlow: 850, mx: 215, my: 100, abbr: 'CA',
        desc: "The crown jewel of California whitewater — an 18-mile wilderness float through the Grand Canyon of the Tuolumne in Stanislaus National Forest. Pristine Sierra granite, Muir Gorge, Clavey Falls (Class V), and the famous Lumsden campsite make this one of the finest multi-day runs in the American West.",
        desig: 'National Wild & Scenic River (1984) · Stanislaus National Forest',
        secs: ['Lumsden Bridge to Ward\'s Ferry — 18 mi, the full classic run', 'Cherry Creek section above Lumsden — Class V, expert only'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Southern Sierra Miwok — Canyon Homeland', text: "The Tuolumne River canyon was Southern Sierra Miwok territory. The word 'Tuolumne' derives from the Miwok 'talmalamne' meaning 'cluster of stone wigwams' or 'land of many stone houses' — a reference to the granite domes above the canyon.", src: 'Tuolumne Band of Me-Wuk Indians; Stanislaus National Forest' }] },
          { era: 'logging', entries: [{ yr: '1913', title: "Hetch Hetchy Dam — John Muir's Defeat", text: "The construction of the O'Shaughnessy Dam at Hetch Hetchy Valley — a Yosemite-quality valley described by John Muir as more beautiful than Yosemite itself — was one of the defining environmental battles of the 20th century. Muir opposed it until his death in 1914.", src: 'NPS Yosemite; Sierra Club John Muir Foundation' }] },
          { era: 'survey', entries: [{ yr: '1984', title: 'Wild & Scenic Designation — Tuolumne Below Hetch Hetchy', text: 'Congress designated the lower Tuolumne below the dam as a National Wild & Scenic River, protecting the 18-mile canyon from further dam proposals.', src: 'USFS Stanislaus NF; Wild & Scenic Rivers Act (1984)' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Hetch Hetchy Restoration Debate', text: 'The ongoing campaign to remove the Hetch Hetchy Dam and restore the valley continued in 2023. The engineering and political challenges remain enormous, but the ecological argument has gained mainstream traction.', src: 'Restore Hetch Hetchy; PPIC Water Policy Center' }] },
        ],
        docs: [{ t: 'Tuolumne Wild & Scenic River Management Plan', s: 'USFS Stanislaus NF', y: 2006, tp: 'Federal', pg: 190 }],
        revs: [{ u: 't_river_devotee', d: 'Jun 2024', s: 5, t: "Lumsden to Ward's at 900 cfs — Clavey Falls was a perfect horizon line. Muir Gorge at camp on night two with no other groups. Sierra Nevada at its most raw." }, { u: 'tuolumne_annual', d: 'May 2024', s: 5, t: 'Cherry Creek into the Grand Canyon at 1,200 cfs — the hardest and most beautiful 23 miles in California. Six Class V rapids and then Clavey as the finale.' }],
        outs: [{ n: 'OARS Tuolumne', d: 'Tuolumne River multi-day guided trips', l: 'oars.com' }, { n: 'All-Outdoors California Whitewater', d: 'Tuolumne sections', l: 'aorafting.com' }],
      },
      {
        id: 'kern', n: 'Kern River', ww: true, wild: true, sierra: true, coastal: false,
        co: 'Kern Co.', len: '170 mi', cls: 'I–V+', opt: '400–2500',
        g: '11187500', avg: 1100, histFlow: 950, mx: 210, my: 145, abbr: 'CA',
        desc: "Southern California's premier whitewater river — drops out of the southern Sierra Nevada through Sequoia National Forest and Kern Canyon. The Forks of the Kern (Class V–V+) is one of the most committing wilderness whitewater runs in North America: 15 miles of continuous Class V with no road access.",
        desig: 'National Wild & Scenic River · Sequoia National Forest',
        secs: ['Forks of the Kern — Class V–V+, 15 mi, wilderness only', 'Upper Kern (Johnsondale to Fairview) — Class IV–V', 'Lower Kern Canyon — Class III–IV, most accessible'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Kawaiisu (Nuwa) — Southern Sierra People', text: "The Kern River canyon was the homeland of the Kawaiisu (Nuwa) people, who inhabited the southern Sierra slopes and Tehachapi Mountains. The Kern's exceptional golden trout fishery — still one of the purest populations remaining — was a critical food resource.", src: 'Kawaiisu Language and Cultural Center; USFS Sequoia NF' }] },
          { era: 'survey', entries: [{ yr: '1987', title: 'Wild & Scenic Designation — Kern River', text: 'Congress designated significant portions of the Kern River as Wild & Scenic in 1987, protecting the Forks canyon and the Lower Kern corridor from future dam proposals.', src: 'USFS Sequoia NF; Wild & Scenic Rivers Act (1987)' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Exceptional Snowpack — Kern in Full Flood', text: 'The historic 2022–2023 Sierra Nevada snowpack sent the Kern River into extreme flood in spring 2023, with flows exceeding 10,000 cfs — far above the runnable range for any section.', src: 'USGS California WSC; National Weather Service' }] },
        ],
        docs: [{ t: 'Kern River Wild & Scenic River Management Plan', s: 'USFS Sequoia NF', y: 2009, tp: 'Federal', pg: 155 }],
        revs: [{ u: 'forks_kern_survivor', d: 'May 2024', s: 5, t: "Forks at 900 cfs — day 1 the river decides if you belong there. Lost a boat at Royal Flush. Recovered it. Nothing in North American kayaking is more committing." }, { u: 'lower_kern_regular', d: 'Aug 2024', s: 4, t: 'Lower Kern at 1,100 cfs — Lickety Split and Hari Kari both fun and honest Class IV. Best Southern California whitewater by far.' }],
        outs: [{ n: 'Kern River Outfitters', d: 'Kernville-based all levels', l: 'kernrafting.com' }, { n: 'Whitewater Voyages', d: 'Forks and Lower Kern trips', l: 'whitewatervoyages.com' }],
      },
    ],
  },

  // ── VIRGINIA ───────────────────────────────────────────────────
  va: {
    name: 'Virginia', abbr: 'VA', label: 'Virginia Rivers',
    filters: ['all', 'ww', 'wild', 'appalachian', 'piedmont'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', appalachian: 'Appalachians', piedmont: 'Piedmont' },
    rivers: [
      {
        id: 'james', n: 'James River', ww: true, wild: false, appalachian: false, piedmont: true,
        co: 'Botetourt / Rockbridge / Richmond City', len: '340 mi', cls: 'I–IV', opt: '2000–8000',
        g: '02037500', avg: 5200, histFlow: 4800, mx: 410, my: 100, abbr: 'VA',
        desc: "Virginia's greatest river — flows 340 miles from the Appalachians to the Chesapeake Bay. Class IV whitewater runs through the city of Richmond, making it the most urban whitewater destination in the East. The James River Park System delivers boulder gardens and surfing waves within sight of the state capitol.",
        desig: 'Virginia Scenic River · James River Park System (Richmond)',
        secs: ['Headwaters to Buchanan — Class I–II, remote upper valley', 'Balcony Falls to Lynchburg — Class III–IV, Gorge section', 'Richmond Falls (Pony Pasture to Pipeline) — Class III–IV, urban gem', 'Lower James — Class I–II, tidal to Chesapeake'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Monacan Nation and Powhatan Confederacy — 'Grandmother of Waters'", text: "The James River was at the center of two great Native civilizations. The Monacan Nation (Siouan-speaking) held the Appalachian headwaters and Piedmont. The Powhatan Confederacy (Algonquian) controlled the tidal lower river. English colonists renamed it for King James I after landing at Jamestown in 1607.", src: 'Monacan Indian Nation; Pamunkey Indian Tribe; Virginia Historical Society' }] },
          { era: 'logging', entries: [{ yr: '1607', title: 'Jamestown — First Permanent English Settlement', text: "The James River estuary was the site of the first permanent English settlement in North America at Jamestown in 1607. The river served as the highway for colonial Virginia, carrying tobacco downriver to ships in Hampton Roads.", src: 'NPS Historic Jamestowne; Virginia Historical Society' }] },
          { era: 'survey', entries: [{ yr: '2012', title: 'Richmond James River Park — Urban Whitewater Model', text: "The James River Park System in Richmond — 550 acres of river access in the heart of a city of 230,000 — was recognized as a national model for urban river conservation and recreation. The park draws over 1.5 million visitors annually.", src: 'City of Richmond; James River Association' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'James River Association — 50 Years of Recovery', text: "After decades of severe pollution from DuPont Kepone contamination (1975), the James has made a remarkable recovery. The James River Association's 50th anniversary documented measurable improvements in water quality, fish populations, and recreational use.", src: 'James River Association; Virginia DEQ' }] },
        ],
        docs: [{ t: 'James River Scenic River Assessment', s: 'Virginia DCR', y: 2018, tp: 'Survey', pg: 140 }, { t: 'Richmond Urban Whitewater Feasibility Study', s: 'City of Richmond', y: 2015, tp: 'Recreation', pg: 88 }],
        revs: [{ u: 'richmond_river_rat', d: 'Jun 2024', s: 5, t: 'Pipeline rapid at 4,200 cfs — surfing waves in downtown Richmond with the state capitol behind you. Best urban river in America, no debate.' }, { u: 'upper_james_canoeist', d: 'Sep 2024', s: 5, t: 'Five days from Iron Gate to Lynchburg — herons, eagles, bass, and not a single other boat for two days. The real Virginia.' }],
        outs: [{ n: 'Richmond Raft Company', d: 'James River urban whitewater', l: 'richmondraft.com' }, { n: 'James River Runners', d: 'Upper James canoe trips', l: 'jamesriverrunners.com' }],
      },
      {
        id: 'shenandoah', n: 'Shenandoah River', ww: false, wild: true, appalachian: true, piedmont: false,
        co: 'Shenandoah / Page / Warren Co.', len: '286 mi', cls: 'I–III', opt: '500–4000',
        g: '01636500', avg: 2100, histFlow: 1950, mx: 330, my: 70, abbr: 'VA',
        desc: "One of the most beloved canoe rivers in the eastern United States — flows through the Shenandoah Valley between the Blue Ridge and Allegheny Mountains in a series of long, gliding pools and Class I–III ledge rapids. Harpers Ferry confluence with the Potomac is one of the most historically significant river junctions in America.",
        desig: 'Virginia Scenic River · Shenandoah River State Park',
        secs: ['North Fork Shenandoah — Class I–II, remote headwaters', 'South Fork (Elkton to Front Royal) — Class I–II, the classic valley float', 'Main Stem to Harpers Ferry — Class I–III, historical corridor'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Haudenosaunee and Lenape — 'Daughter of the Stars'", text: "'Shenandoah' is derived from a Lenape or Iroquois word variously translated as 'daughter of the stars,' 'big meadow,' or 'river through the spruce.' The valley was a contested corridor between the Haudenosaunee Confederacy to the north and various southern nations.", src: 'Virginia Historical Society; Smithsonian National Museum of the American Indian' }] },
          { era: 'logging', entries: [{ yr: '1861–1865', title: "Shenandoah Valley — Civil War's Most Contested Corridor", text: "The Shenandoah Valley was among the most strategically important and militarily contested landscapes of the Civil War. Stonewall Jackson's Valley Campaign (1862) and Sheridan's 1864 devastation of 'The Breadbasket of the Confederacy' fundamentally shaped the war's outcome. Over 300 documented Civil War sites line the river corridor.", src: 'Civil War Trust; Shenandoah Valley Battlefields National Historic District' }] },
          { era: 'survey', entries: [{ yr: '1994', title: 'Shenandoah Designated Virginia Scenic River', text: 'The Commonwealth of Virginia designated the Shenandoah a State Scenic River, protecting the corridor from development and establishing public access requirements.', src: 'Virginia DCR Scenic Rivers Program' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Massive Fish Kill — Agricultural Runoff Crisis', text: 'The Shenandoah experienced a significant fish kill in summer 2024 linked to agricultural nutrient runoff — one of a series of events highlighting the tension between the valley\'s intensive poultry and cattle farming and the river\'s recreational and ecological health.', src: 'Virginia DEQ; Shenandoah Riverkeeper' }] },
        ],
        docs: [{ t: 'Shenandoah River Watershed Management Plan', s: 'VA DCR / VDOT', y: 2020, tp: 'Survey', pg: 210 }],
        revs: [{ u: 'shenandoah_valley_paddler', d: 'Oct 2024', s: 5, t: 'South Fork at 1,400 cfs in fall color — Massanutten to the east, Blue Ridge to the west, hawks migrating overhead. The most beautiful valley in the East.' }, { u: 'harpers_ferry_bound', d: 'Sep 2024', s: 4, t: 'Three days Main Stem to Harpers Ferry. Every bend has a historical marker. Bull Falls at 2,000 cfs was a surprise Class III.' }],
        outs: [{ n: 'Downriver Canoe Company', d: 'Shenandoah South Fork trips', l: 'downriver.com' }, { n: 'Front Royal Canoe', d: 'Full Shenandoah Valley float trips', l: 'frontroyalcanoe.com' }],
      },
      {
        id: 'rappahannock', n: 'Rappahannock River', ww: true, wild: true, appalachian: false, piedmont: true,
        co: 'Rappahannock / Culpeper / Spotsylvania Co.', len: '195 mi', cls: 'I–IV', opt: '600–3500',
        g: '01668000', avg: 1800, histFlow: 1650, mx: 460, my: 88, abbr: 'VA',
        desc: "One of the last great undammed rivers in the eastern United States — flows 195 miles from the Blue Ridge to the Chesapeake Bay without a single major dam on its main stem. The Rappahannock rapids at Fredericksburg are a natural Class II–III waterfall in the heart of the city.",
        desig: 'Virginia Scenic River · Last Undammed Eastern Coastal Plain River',
        secs: ['Chester Gap to Remington — Class I–II, upper Piedmont', 'Remington to Fredericksburg Falls — Class II–III', 'Fredericksburg rapids — Class III–IV, urban falls', 'Tidal Rappahannock — Class I, Chesapeake estuary'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Rappahannock Tribe — 'Back-and-Forth Current'", text: "The Rappahannock River was the homeland of the Rappahannock Tribe, whose name means 'back and forth current' or 'alternating current' in Algonquian — a reference to the tidal reversal at the river's lower reach. The Rappahannock Tribe received state recognition in 1983.", src: 'Rappahannock Tribe; Virginia Council on Indians' }] },
          { era: 'logging', entries: [{ yr: '1862–1863', title: 'Battle of Fredericksburg — River Crossing Under Fire', text: "The Rappahannock River at Fredericksburg was the site of some of the Civil War's bloodiest river crossings. Union forces crossed the river on pontoon bridges in December 1862 into what became the Battle of Fredericksburg — one of the Union Army's worst defeats.", src: 'NPS Fredericksburg & Spotsylvania NMP; Civil War Trust' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Rappahannock Tribe Water Rights Advocacy', text: "The Rappahannock Tribe has been at the forefront of water quality advocacy on their ancestral river, working to reduce agricultural and development runoff that threatens the river's ecology and their cultural relationship with it.", src: 'Rappahannock Tribe; Chesapeake Bay Foundation' }] },
        ],
        docs: [{ t: 'Rappahannock River Watershed Plan', s: 'VA DCR', y: 2019, tp: 'Survey', pg: 175 }],
        revs: [{ u: 'unrepentant_piedmont_paddler', d: 'Apr 2024', s: 5, t: 'Remington to Kellys Ford at 1,200 cfs — herons, eagles, deer, bass. The Piedmont as it was before the highways.' }, { u: 'fredericksburg_falls_local', d: 'May 2024', s: 4, t: 'Fredericksburg falls at 2,400 cfs — Class III through the middle of a small city. Surreal.' }],
        outs: [{ n: 'Rappahannock River Campground', d: 'Canoe rentals and camping', l: 'canoecamp.com' }],
      },
    ],
  },

  // ── KENTUCKY ───────────────────────────────────────────────────
  ky: {
    name: 'Kentucky', abbr: 'KY', label: 'Kentucky Rivers',
    filters: ['all', 'ww', 'wild', 'scenic', 'cave'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', scenic: 'Scenic', cave: 'Cave Country' },
    rivers: [
      {
        id: 'cumberland', n: 'Cumberland River — Big South Fork', ww: true, wild: true, scenic: false, cave: false,
        co: 'McCreary Co., KY / Scott Co., TN', len: '123 mi', cls: 'I–IV', opt: '500–3000',
        g: '03413200', avg: 1400, histFlow: 1280, mx: 490, my: 115, abbr: 'KY',
        desc: "The Big South Fork of the Cumberland cuts one of the deepest and most spectacular gorges in the eastern United States — 500-foot sandstone walls, no roads, and over 190 miles of river and creek within the Big South Fork National River and Recreation Area. The whitewater through the gorge alternates with broad still sections.",
        desig: 'Big South Fork National River and Recreation Area (NPS) · National Wild & Scenic River',
        secs: ['Confluence to Burnt Mill Bridge — Class I–II, remote wilderness', 'Station Camp to Blue Heron — Class II–III, classic gorge float', 'Leatherwood Ford to Alum Ford — Class III–IV, most challenging'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Cherokee and Shawnee — The Great Hunting Ground', text: "The Cumberland Plateau was a contested and sacred hunting ground shared between Cherokee (from the south) and Shawnee (from the north). Neither nation maintained permanent settlements on the plateau — it was a vast commons deliberately left undeveloped for its hunting value.", src: 'NPS Big South Fork; Tennessee Historical Commission' }] },
          { era: 'logging', entries: [{ yr: '1880s–1950s', title: 'Stearns Coal and Lumber — Company Town Era', text: "The Stearns Coal and Lumber Company operated an extensive coal and timber enterprise throughout the Big South Fork watershed from the 1890s through the 1950s. The Blue Heron mining complex — now an NPS open-air museum in the gorge — operated from 1937 to 1962.", src: 'NPS Big South Fork Blue Heron Mining Community; McCreary County Museum' }] },
          { era: 'survey', entries: [{ yr: '1974', title: 'Big South Fork National River and Recreation Area Created', text: 'Congress established the Big South Fork NRRA in 1974, protecting 125,000 acres of Cumberland Plateau gorge from the coal and timber extraction that surrounded it.', src: 'NPS Big South Fork NRRA' }] },
          { era: 'modern', entries: [{ yr: '2023', title: 'Big South Fork Trail System — Multi-Sport Mecca', text: 'The Big South Fork now hosts over 200 miles of hiking, 130 miles of horse trails, and the river corridor — making it one of the most diverse outdoor recreation destinations in the eastern U.S.', src: 'NPS Big South Fork NRRA Annual Report 2023' }] },
        ],
        docs: [{ t: 'Big South Fork NRRA General Management Plan', s: 'NPS', y: 2008, tp: 'Federal', pg: 240 }],
        revs: [{ u: 'bsf_gorge_explorer', d: 'Oct 2024', s: 5, t: 'Station Camp to Blue Heron at 1,200 cfs — camped at the base of 500-foot sandstone walls. Found arrowheads on the gravel bar at camp. Blue Heron coal complex rose out of the fog in the morning. Extraordinary.' }, { u: 'cumberland_multi_day', d: 'May 2024', s: 5, t: "Four days through the Big South Fork — no roads, no sounds but the river and the birds. The most remote feeling I've had east of the Mississippi." }],
        outs: [{ n: 'Sheltowee Trace Outfitters', d: 'Big South Fork guided and unguided trips', l: 'ky-rafting.com' }, { n: 'Outdoor Adventure Rafting', d: 'Cumberland River whitewater', l: 'outdooradventurerafting.com' }],
      },
      {
        id: 'red_river', n: 'Red River Gorge', ww: false, wild: true, scenic: true, cave: false,
        co: 'Wolfe / Powell / Menifee Co.', len: '45 mi', cls: 'I–III', opt: '200–1500',
        g: '03282000', avg: 680, histFlow: 620, mx: 390, my: 100, abbr: 'KY',
        desc: "The Red River Gorge is one of the most visually stunning river corridors in the eastern United States — a UNESCO-recognized natural area of sandstone arches, hemlock gorges, and ancient rock shelters carved into the Daniel Boone National Forest. World-famous rock climbing destination.",
        desig: 'Red River Gorge Geological Area · Daniel Boone National Forest · UNESCO Global Geopark candidate',
        secs: ['Sky Bridge to Nada Tunnel — Class I–II, iconic scenery', 'Nada Tunnel to Torrent — Class I–II, gorge walls', 'Lower Red to Kentucky River — Class I–III, opening valley'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Adena and Woodland Peoples — 10,000 Years in the Rock Shelters', text: "The Red River Gorge sandstone shelters have been continuously occupied for over 10,000 years — among the longest archaeological records in eastern North America. The shelters (called 'rockshelters') protected Adena, Woodland, and later Fort Ancient peoples.", src: 'University of Kentucky Archaeology; Daniel Boone National Forest' }] },
          { era: 'logging', entries: [{ yr: '1880s–1940s', title: 'Logging the Gorge — and the Red River Dam Fight', text: "The Red River watershed was substantially logged in the late 19th century. A bigger threat emerged: in 1965 the Army Corps of Engineers proposed a dam that would have flooded the entire gorge. A landmark conservation campaign centered on Justice William O. Douglas — who led a publicized hike through the gorge — defeated the dam proposal in 1976.", src: 'Daniel Boone National Forest; Justice William O. Douglas; Kentucky Heritage Council' }] },
          { era: 'modern', entries: [{ yr: '2024', title: "World-Class Rock Climbing — Miguel's Pizza and the Gorge Economy", text: "The Red River Gorge has become one of the top 5 sport climbing destinations in North America, drawing climbers from around the world to its sandstone faces. Miguel's Pizza — a climber campground and institution — has become a beloved cultural anchor for the climbing and paddling community.", src: "American Alpine Club; Red River Gorge Climbers Coalition" }] },
        ],
        docs: [{ t: 'Red River Gorge Geological Area Management Plan', s: 'USFS Daniel Boone NF', y: 2015, tp: 'Federal', pg: 145 }],
        revs: [{ u: 'red_river_gorge_native', d: 'Apr 2024', s: 5, t: 'Red River at 600 cfs in spring — hemlock walls, natural arches above the water, no one else on the river. The gorge has a silence that gets inside you.' }, { u: 'arch_country_paddler', d: 'Oct 2024', s: 4, t: 'Fall color in the gorge at 400 cfs — the red and orange reflected in every pool. Hiked out to Natural Bridge after take-out. Magic.' }],
        outs: [{ n: 'Rough Trail Canoe', d: 'Red River Gorge canoe trips and rentals', l: 'roughtrailcanoe.com' }, { n: "Miguel's Pizza & Rock Climbing", d: 'Camping, community hub for gorge visitors', l: 'miguelspizza.com' }],
      },
      {
        id: 'green_river', n: 'Green River', ww: false, wild: false, scenic: true, cave: true,
        co: 'Hart / Edmonson / Butler Co.', len: '384 mi', cls: 'I–II', opt: '500–3000',
        g: '03308500', avg: 1850, histFlow: 1700, mx: 290, my: 118, abbr: 'KY',
        desc: "Kentucky's longest river at 384 miles — flows through the heart of Mammoth Cave National Park in one of the most geologically extraordinary landscapes on earth. A 25-mile wilderness canoe route through Mammoth Cave NP is one of the most unique paddling experiences in America — floating above the world's longest known cave system.",
        desig: 'Mammoth Cave National Park · UNESCO World Heritage Site · International Biosphere Reserve',
        secs: ['Munfordville to Mammoth Cave NP — Class I–II, approach', 'Inside Mammoth Cave NP — 25 mi, spring-fed, crystal clear', 'Below Brownsville — Class I, widening valley'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Archaic and Woodland Peoples — Inside the Caves', text: "Mammoth Cave was used by Archaic and Woodland peoples for at least 4,000 years. Archaeological evidence of mining expeditions — gypsum, selenite, and mirabilite crystals — has been found deep inside the cave system, along with torches, woven baskets, and mummified remains of ancient miners.", src: 'NPS Mammoth Cave National Park; Smithsonian Institution' }] },
          { era: 'logging', entries: [{ yr: '1800s', title: 'Saltpeter Mining and the War of 1812', text: "The cave's immense deposits of calcium nitrate (saltpeter) were mined during the War of 1812 to produce gunpowder for the U.S. Army. The wooden saltpeter vats and gourd-pipe water system from that era are still visible inside the cave.", src: 'NPS Mammoth Cave; Kentucky Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1941', title: 'Mammoth Cave National Park Established', text: "Congress established Mammoth Cave National Park in 1941, protecting the cave system and the Green River corridor above it. The park was designated a UNESCO World Heritage Site in 1981 and an International Biosphere Reserve in 1990.", src: 'NPS Mammoth Cave; UNESCO World Heritage Committee' }] },
          { era: 'modern', entries: [{ yr: '2019', title: 'Mammoth Cave — 420+ Miles of Surveyed Passage', text: 'As of 2019, cavers have surveyed over 420 miles of passage in the Mammoth Cave system — making it by far the longest known cave in the world. New passages continue to be mapped annually.', src: 'Cave Research Foundation; NPS Mammoth Cave' }] },
        ],
        docs: [{ t: 'Mammoth Cave NP General Management Plan', s: 'NPS', y: 2014, tp: 'Federal', pg: 280 }, { t: 'Green River Aquatic Habitat Assessment', s: 'NPS/USGS', y: 2017, tp: 'Ecology', pg: 95 }],
        revs: [{ u: 'mammoth_cave_canoeist', d: 'Sep 2024', s: 5, t: 'Green River through the park at 700 cfs — water so clear you can see the gravel 8 feet down. Two days inside the park boundary with no roads in sight. Paddling over the world\'s longest cave.' }, { u: 'green_river_ky_local', d: 'Jul 2024', s: 4, t: 'Below Brownsville at 1,200 cfs — wide, easy current, endless wildlife. The cave springs keep it cold and clear even in July.' }],
        outs: [{ n: 'Green River Canoe Rental', d: 'Mammoth Cave area canoe trips', l: 'mammothcavecanoe.com' }, { n: 'Mammoth Cave Adventures', d: 'Park canoe concession', l: 'mammothcaveadventures.com' }],
      },
    ],
  },

  // ── NORTH CAROLINA ─────────────────────────────────────────────
  nc: {
    name: 'North Carolina', abbr: 'NC', label: 'North Carolina Rivers',
    filters: ['all', 'ww', 'wild', 'appalachian', 'piedmont'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', appalachian: 'Appalachians', piedmont: 'Piedmont' },
    rivers: [
      {
        id: 'nantahala', n: 'Nantahala River', ww: true, wild: false, appalachian: true, piedmont: false,
        co: 'Swain / Macon Co.', len: '8 mi', cls: 'II–III', opt: '600–1200',
        g: '03502000', avg: 820, histFlow: 750, mx: 160, my: 112, abbr: 'NC',
        desc: "The most commercially rafted river in the eastern United States — 8 miles of continuous Class II–III through the Nantahala Gorge in Nantahala National Forest. Ice-cold tailwater from Fontana Reservoir creates year-round paddling. 'Nantahala' means 'Land of the Noonday Sun' in Cherokee — the gorge is so deep that sunlight only reaches the river floor at midday.",
        desig: 'Nantahala National Forest · Nantahala Outdoor Center (NOC) — founded 1972',
        secs: ['Ferebee Park to NOC — 8 mi, continuous Class II–III', 'Nantahala Falls at takeout — Class III+, distinct final drop'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Cherokee — 'Land of the Noonday Sun'", text: "The Nantahala Gorge was deep within the Cherokee heartland. 'Nantahala' (Nun-da-ga-lun-yi) means 'land of the noonday sun' in the Cherokee language — a direct reference to the gorge's extraordinary depth, where direct sunlight reaches the river only briefly at midday. The Eastern Band of Cherokee Indians, headquartered at Cherokee NC, maintains cultural connections throughout the watershed.", src: 'Eastern Band of Cherokee Indians; University of North Carolina Cherokee Studies' }] },
          { era: 'logging', entries: [{ yr: '1900–1940', title: 'Alcoa and Fontana Dam — The Gorge Transformed', text: "The Aluminum Company of America (Alcoa) acquired the Nantahala watershed in the early 20th century for hydroelectric power generation. Fontana Dam — completed in 1944 during World War II to power the Alcoa smelter at Maryville, TN — created the cold-water reservoir that now feeds the Nantahala River, giving it its distinctive ice-cold temperature year-round.", src: 'TVA Fontana Dam Historical Records; Swain County Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1972', title: 'Nantahala Outdoor Center Founded', text: 'Payson and Aurelia Kennedy founded the Nantahala Outdoor Center at the gorge takeout in 1972, pioneering the commercial outdoor education and river guiding industry in the eastern U.S. Multiple Olympic paddlers have trained on the Nantahala.', src: 'Nantahala Outdoor Center; American Canoe Association' }] },
          { era: 'modern', entries: [{ yr: '2024', title: '500,000+ Annual Visitors — Most Commercial River in the East', text: 'The Nantahala Gorge hosts over 500,000 paddlers annually, making it the most commercially paddled river in the eastern United States. The NOC complex generates over $40 million in annual economic impact for Swain County.', src: 'NOC Annual Report 2024; Swain County Economic Development' }] },
        ],
        docs: [{ t: 'Nantahala River Recreation Assessment', s: 'USFS Nantahala NF', y: 2015, tp: 'Recreation', pg: 88 }],
        revs: [{ u: 'noc_regular', d: 'Jul 2024', s: 5, t: 'Nantahala at 850 cfs — cold, fast, perfect. Nantahala Falls at the end threw me out. Back in the boat. Worth every second.' }, { u: 'eastern_whitewater_fan', d: 'Jun 2024', s: 5, t: 'Best intro to eastern whitewater. The gorge walls, the cold water, the NOC at the end — this is what got me into paddling.' }],
        outs: [{ n: 'Nantahala Outdoor Center', d: 'NOC — eastern whitewater institution since 1972', l: 'noc.com' }, { n: 'Rolling Thunder River Company', d: 'Nantahala gorge raft trips', l: 'rollingthunderrafting.com' }],
      },
      {
        id: 'chattooga', n: 'Chattooga River', ww: true, wild: true, appalachian: true, piedmont: false,
        co: 'Oconee / Rabun Co. (SC/GA/NC border)', len: '57 mi', cls: 'II–V', opt: '500–2000',
        g: '02177000', avg: 860, histFlow: 790, mx: 235, my: 120, abbr: 'NC',
        desc: "One of the most celebrated wild rivers in the eastern United States — 57 miles of National Wild & Scenic river forming the Georgia-South Carolina border through Sumter and Chattahoochee National Forests. Section IV contains Bull Sluice, Corkscrew, Crack-in-the-Rock, and the legendary Five Falls sequence — considered the finest Class IV–V day run in the South. Immortalized in James Dickey's novel 'Deliverance' (filmed here in 1972).",
        desig: 'National Wild & Scenic River (1974) · First Wild & Scenic River in the Southeast',
        secs: ['Section II — Class I–II, flatwater and mild', 'Section III — Class III–IV, Bull Sluice highlights', 'Section IV — Class IV–V, Five Falls, the classic', 'Below Section IV — Class IV, Tugaloo Lake'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Cherokee — The River Boundary', text: "The Chattooga River served as a boundary between Cherokee territory to the west and Catawba and Creek lands to the east. The word 'Chattooga' likely derives from a Cherokee term meaning 'he drank by sips' or 'swift water.'", src: 'Eastern Band of Cherokee Indians; South Carolina Historical Society' }] },
          { era: 'logging', entries: [{ yr: '1880s–1920s', title: 'Blue Ridge Logging — Sumter and Chattahoochee Forests', text: "The Chattooga watershed was heavily logged in the late 19th and early 20th centuries by Blue Ridge timber operators. The national forests were established partly in response to the ecological devastation of clear-cutting the Southern Appalachians.", src: 'USFS Sumter National Forest Historical Records; Rabun County Historical Society' }] },
          { era: 'survey', entries: [{ yr: '1974', title: 'Wild & Scenic Designation — First in the Southeast', text: "Congress designated the Chattooga as a Wild & Scenic River in 1974 — the first in the southeastern United States. The designation was partly a response to the visibility generated by the filming of 'Deliverance' on the river.", src: 'Wild & Scenic Rivers Act (1974); USFS Sumter NF' }] },
          { era: 'modern', entries: [{ yr: '2012', title: 'Headwaters Opened to Paddling — 38 Years Later', text: 'For 38 years after Wild & Scenic designation, paddling was prohibited above Highway 28. In 2012, after years of advocacy by American Whitewater, the USFS opened the upper Chattooga to paddling — one of the most significant access victories in recent paddling history.', src: 'American Whitewater; USFS Chattooga Wild & Scenic River Management (2012)' }] },
        ],
        docs: [{ t: 'Chattooga Wild & Scenic River Management Plan', s: 'USFS Sumter/Chattahoochee NF', y: 2012, tp: 'Federal', pg: 210 }],
        revs: [{ u: 'section_iv_devotee', d: 'May 2024', s: 5, t: 'Chattooga Section IV at 1,100 cfs — Five Falls all running perfectly. Crack-in-the-Rock scared me appropriately. The wild river forest is as beautiful as any in the East.' }, { u: 'deliverance_country_paddler', d: 'Apr 2024', s: 5, t: 'Upper Section III at 900 cfs — Bull Sluice thundering. Walked out into Sumter NF with no roads visible. Exactly as wild as the film suggests.' }],
        outs: [{ n: 'Nantahala Outdoor Center', d: 'Chattooga Section III and IV trips', l: 'noc.com' }, { n: 'Southeastern Expeditions', d: 'Chattooga guided rafting', l: 'southeasternexpeditions.com' }],
      },
      {
        id: 'french_broad', n: 'French Broad River', ww: false, wild: false, appalachian: true, piedmont: false,
        co: 'Henderson / Buncombe / Madison Co.', len: '210 mi', cls: 'I–III', opt: '800–4000',
        g: '03451500', avg: 2100, histFlow: 1900, mx: 290, my: 100, abbr: 'NC',
        desc: "One of the oldest rivers in the world — geologists believe the French Broad predates the Blue Ridge Mountains and carved its path through the rising Appalachians over millions of years. Flows 210 miles from headwaters near Brevard through Asheville and into Tennessee. Hot Springs NC — where hot springs meet the river — is one of the most beloved paddling destinations in the Southeast.",
        desig: 'North Carolina Scenic River · Appalachian Trail crosses at Hot Springs',
        secs: ['Headwaters to Asheville — Class I–II, scenic upper valley', 'Asheville river arts district — urban paddle', 'Hot Springs section — Class I–III, river meets hot springs', 'Paint Rock to Douglas Lake — Class II–III, NC/TN border'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: "Cherokee — One of the World's Oldest Rivers", text: "The French Broad River flows through the ancient heart of Cherokee territory. The Cherokees called it 'Tah-kee-os-tee' meaning 'racing water.' The river predates the Appalachian Mountains — making it one of the oldest river channels in the world, older than the range it cuts through.", src: 'Eastern Band of Cherokee Indians; NC Geological Survey' }] },
          { era: 'logging', entries: [{ yr: '1880s–1920s', title: 'Asheville Boom and the French Broad Valley', text: "The Western North Carolina Railroad reached Asheville via the French Broad Valley in 1879, opening the Southern Appalachians to tourism and timber extraction. George Vanderbilt's Biltmore Estate (built 1889–1895) on the French Broad was the largest private home in America.", src: 'Biltmore Estate; NC Department of Cultural Resources; Asheville Historical Society' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Asheville River Arts District — Urban River Renaissance', text: "The French Broad corridor through Asheville's River Arts District has become a national model for urban river revitalization. Former industrial warehouses along the riverbank have been converted to studios, breweries, and restaurants.", src: 'Asheville River Arts District; French Broad Riverkeeper' }] },
        ],
        docs: [{ t: 'French Broad River Watershed Plan', s: 'NC DEQ', y: 2019, tp: 'Survey', pg: 185 }],
        revs: [{ u: 'hot_springs_pilgrim', d: 'Sep 2024', s: 5, t: 'Hot Springs section at 1,400 cfs — class II through the gorge, pulled out at the springs, soaked for an hour, back in the boat. NC at its finest.' }, { u: 'asheville_river_art', d: 'Jul 2024', s: 4, t: 'French Broad through the RAD at 2,200 cfs — murals on the warehouse walls above the river, breweries at the takeout. A new kind of river experience.' }],
        outs: [{ n: 'Nantahala Outdoor Center', d: 'French Broad gorge section trips', l: 'noc.com' }, { n: 'French Broad River Outfitters', d: 'Hot Springs section canoe and kayak', l: 'frenchbroadriveroutfitters.com' }],
      },
    ],
  },

  // ── ARIZONA ────────────────────────────────────────────────────
  az: {
    name: 'Arizona', abbr: 'AZ', label: 'Arizona Rivers',
    filters: ['all', 'ww', 'wild', 'desert', 'canyon'],
    fL: { all: 'All', ww: 'Whitewater', wild: 'Wild & Scenic', desert: 'Desert Rivers', canyon: 'Canyon Country' },
    rivers: [
      {
        id: 'grandcanyon', n: 'Colorado River — Grand Canyon', ww: true, wild: true, desert: true, canyon: true,
        co: 'Coconino / Mohave Co.', len: '226 mi', cls: 'I–V', opt: '5000–25000',
        g: '09380000', avg: 12000, histFlow: 10500, mx: 185, my: 72, abbr: 'AZ',
        desc: "The greatest river journey in North America — 226 miles through the Grand Canyon, one of the Seven Natural Wonders of the World. The Colorado cuts through 1.7 billion years of geological record. Lava Falls (Class V) drops 37 feet in 300 yards — the most famous single rapid in North America. Wait times for private permits now exceed 10–15 years.",
        desig: 'Grand Canyon National Park (UNESCO World Heritage) · National Wild & Scenic River',
        secs: ["Lee's Ferry to Phantom Ranch — Class I–IV, upper canyon", 'Phantom Ranch to Diamond Creek — Class III–V, middle canyon with Lava Falls', 'Diamond Creek to Lake Mead — Class I–III, lower canyon'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact – ongoing', title: 'Havasupai, Hualapai, Navajo, Hopi, Southern Paiute — The Living Canyon', text: "The Grand Canyon has been continuously inhabited for at least 12,000 years. The Havasupai ('people of the blue-green water') have lived in Havasu Canyon — a Grand Canyon tributary — longer than any other living group. The Hualapai Nation's reservation borders 108 miles of the South Rim. The Colorado River was the lifeblood of all these nations.", src: 'Havasupai Tribe; Hualapai Nation; NPS Grand Canyon Cultural Resources; Smithsonian NMAI' }] },
          { era: 'logging', entries: [{ yr: '1869', title: "John Wesley Powell's First Expedition — The Unknown Canyon", text: "Major John Wesley Powell led the first documented navigation of the Grand Canyon in 1869 with a crew of nine men in four wooden dories. The 99-day expedition through territory labeled 'unknown' on all existing maps was one of the most daring explorations in American history.", src: "Powell, J.W. 'Exploration of the Colorado River of the West' (1875); USGS" }, { yr: '1956', title: 'Glen Canyon Dam — The River Transformed', text: "The construction of Glen Canyon Dam (completed 1966) 15 miles upstream from Lee's Ferry fundamentally changed the Colorado's character through the Grand Canyon. The ecological transformation — extinction of several native fish species, loss of sandbars — remains one of the most studied river management case studies in the world.", src: 'Bureau of Reclamation; Grand Canyon Trust; USGS' }] },
          { era: 'survey', entries: [{ yr: '1919', title: 'Grand Canyon National Park — Congress Acts', text: 'Congress established Grand Canyon National Park in 1919, more than a decade after President Theodore Roosevelt urged protection. The designation protected the canyon from the mining and dam proposals that had already claimed Glen Canyon upstream.', src: 'NPS Grand Canyon National Park' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Private Permit Wait — 12 Years', text: 'The National Park Service lottery for a private Grand Canyon river permit has a wait time exceeding 12 years as of 2024. Commercial trips operate under a separate allocation. Roughly 25,000 people run the canyon annually.', src: 'NPS Grand Canyon River Permits Office (2024)' }] },
        ],
        docs: [{ t: 'Grand Canyon River Management Plan', s: 'NPS Grand Canyon', y: 2006, tp: 'Federal', pg: 420 }, { t: 'Colorado River Ecosystem Science Program', s: 'USGS Grand Canyon Monitoring', y: 2023, tp: 'Ecology', pg: 310 }],
        revs: [{ u: 'grand_canyon_veteran', d: 'Sep 2024', s: 5, t: 'Lava Falls at 14,000 cfs — stood on the scout rock and watched the hydraulic for 40 minutes before committing. Nothing in North American paddling comes close to this canyon.' }, { u: 'first_time_commercial', d: 'Aug 2024', s: 5, t: 'Motor rig commercial trip. Even with that context the scale of what you\'re looking at is incomprehensible. Every camp was in a different geological era.' }],
        outs: [{ n: 'OARS Grand Canyon', d: 'Premium Grand Canyon oar and motor trips', l: 'oars.com' }, { n: 'Arizona Raft Adventures', d: 'All Grand Canyon trip styles', l: 'azraft.com' }, { n: 'Grand Canyon Expeditions', d: 'Motor and oar trips since 1969', l: 'gcex.com' }],
      },
      {
        id: 'salt_river', n: 'Salt River Canyon', ww: true, wild: false, desert: true, canyon: true,
        co: 'Maricopa / Gila Co.', len: '52 mi', cls: 'III–IV', opt: '800–4000',
        g: '09498500', avg: 1100, histFlow: 950, mx: 310, my: 115, abbr: 'AZ',
        desc: 'The best whitewater in Arizona outside the Grand Canyon — 52 miles through the Salt River Canyon Wilderness east of Phoenix, entirely on White Mountain Apache tribal lands. The river flows through a dramatic 2,000-foot deep canyon of towering red walls. Flows are dam-controlled — check the Roosevelt/Theodore/Horse Mesa/Mormon Flat dam schedule before any trip.',
        desig: 'Salt River Canyon Wilderness · White Mountain Apache Tribal Lands (permit required)',
        secs: ['Upper Salt (Highway 60 to Gleason Flat) — Class III, most accessible', 'Lower Salt (Gleason Flat to Roosevelt) — Class III–IV, canyon deepens', 'Below Roosevelt Dam — Class I–II, wide tailwater'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'White Mountain Apache — The Salt River Homeland', text: "The Salt River Canyon lies entirely within the ancestral homeland of the White Mountain Apache (N'dee/Nnee). The White Mountain Apache Tribe controls access to the canyon — paddlers must obtain a tribal recreation permit. The tribe manages the river as both a cultural resource and an economic asset.", src: 'White Mountain Apache Tribe; Tonto National Forest' }] },
          { era: 'logging', entries: [{ yr: '1903–1930', title: 'Salt River Project — Water for Phoenix', text: 'The Salt River Project, authorized under the 1902 Newlands Reclamation Act, built a series of dams on the Salt River to provide water and power for the Phoenix Valley. Roosevelt Dam (completed 1911) was the largest masonry dam in the world at the time of its completion.', src: 'Salt River Project Historical Foundation; Bureau of Reclamation' }] },
          { era: 'modern', entries: [{ yr: '2024', title: 'Tribal Permit Revenue — Conservation Through Recreation', text: 'The White Mountain Apache Tribe generated over $2 million annually from recreation permits in the Salt River Canyon, including paddling, camping, and fishing. The tribe has used permit revenue to fund riparian restoration and cultural site protection.', src: 'White Mountain Apache Tribe Recreation Department' }] },
        ],
        docs: [{ t: 'Salt River Canyon Recreation Management', s: 'White Mountain Apache Tribe / USFS', y: 2018, tp: 'Recreation', pg: 95 }],
        revs: [{ u: 'phoenix_salt_regular', d: 'Mar 2024', s: 5, t: 'Salt at 2,400 cfs in March — walls turning gold in the morning light, egrets on every bank. The desert canyon whitewater experience you didn\'t know existed 2 hours from Phoenix.' }, { u: 'desert_paddler_az', d: 'Feb 2024', s: 4, t: 'Lower Salt at 1,800 cfs — class III–IV in a 2,000-foot canyon with nobody else for 40 miles. Remember the tribal permit — they check.' }],
        outs: [{ n: 'Desert Voyager', d: 'Salt River Canyon guided trips', l: 'desertvoyager.com' }, { n: 'Arizona Outdoor Fun', d: 'Salt River multi-day expeditions', l: 'arizonaoutdoorfun.com' }],
      },
      {
        id: 'verde', n: 'Verde River', ww: false, wild: true, desert: true, canyon: false,
        co: 'Yavapai Co.', len: '170 mi', cls: 'I–III', opt: '300–2000',
        g: '09504000', avg: 680, histFlow: 620, mx: 250, my: 105, abbr: 'AZ',
        desc: "Arizona's last major free-flowing river — 170 miles through the Sonoran and semi-desert grassland from the Prescott National Forest to the Salt River. The Verde River Greenway protects a remarkable riparian corridor: nesting bald eagles, river otters, great blue herons, and over 100 bird species in the middle of the Sonoran Desert. Best paddled November through April.",
        desig: "Verde River Greenway State Natural Area · Arizona's Last Free-Flowing River",
        secs: ['Paulden to Clarkdale — Class I–II, upper verde', 'Clarkdale to Bridgeport — Class II–III, best whitewater', 'Bridgeport to Horseshoe Reservoir — Class I–II, lower desert corridor'],
        history: [
          { era: 'native', entries: [{ yr: 'Pre-contact', title: 'Yavapai and Tonto Apache — The Life River of the Desert', text: 'The Verde River was the lifeblood of the Yavapai and Western Apache (Tonto Apache) peoples for millennia. In the desert Southwest, a perennial river is not merely a resource — it is existence itself. The Yavapai-Apache Nation, headquartered at Camp Verde, maintains deep ancestral connections to the river.', src: 'Yavapai-Apache Nation; Arizona State Museum; Sharlot Hall Museum' }] },
          { era: 'survey', entries: [{ yr: '1999', title: "Verde River Greenway — Arizona's River Conservation Model", text: "The Verde River Greenway State Natural Area was established in 1999, protecting the river's critical cottonwood-willow riparian forest.", src: 'Arizona State Parks; Verde River Greenway Coalition' }] },
          { era: 'modern', entries: [{ yr: '2024', title: "Arizona's Last Undammed River — Ongoing Threats", text: "Development pressure from the Phoenix metro area's expansion into Yavapai County continues to threaten Verde River flows through increasing groundwater depletion. The Verde Watershed Association and Yavapai-Apache Nation have been at the forefront of defending minimum flows.", src: 'Verde Watershed Association; Yavapai-Apache Nation (2024)' }] },
        ],
        docs: [{ t: 'Verde River Watershed Assessment', s: 'Arizona DEQ', y: 2020, tp: 'Ecology', pg: 165 }, { t: 'Verde River Greenway Management Plan', s: 'AZ State Parks', y: 2015, tp: 'Recreation', pg: 90 }],
        revs: [{ u: 'verde_valley_regular', d: 'Feb 2024', s: 5, t: 'Verde at 800 cfs in February — bald eagles on every cottonwood, 70°F air, desert walls turning red at sunset. The only river like this in the American Southwest.' }, { u: 'desert_river_watcher', d: 'Dec 2023', s: 4, t: 'Upper Verde near Clarkdale at 400 cfs — low but floatable. Otter seen at river mile 12. Three pairs of nesting eagles visible from the water.' }],
        outs: [{ n: 'Verde Adventures', d: 'Verde River canoe and kayak trips', l: 'verdeadventures.com' }, { n: 'Sedona Adventure Tours', d: 'Verde Valley paddling', l: 'sedonaadventuretours.com' }],
      },
    ],
  },
}

// ── Derived helpers ───────────────────────────────────────────────

export const ALL_RIVERS = Object.entries(STATES).flatMap(([stateKey, state]) =>
  state.rivers.map(r => ({ ...r, stateKey, stateName: state.name }))
)

export const RIVER_BY_ID = Object.fromEntries(ALL_RIVERS.map(r => [r.id, r]))

export const STATE_KEYS = Object.keys(STATES) as (keyof typeof STATES)[]

export function getRiver(id: string) {
  return RIVER_BY_ID[id] ?? null
}

export function getState(key: string) {
  return STATES[key] ?? null
}

export function getFlowCondition(cfs: number, optRange: string): 'optimal' | 'low' | 'high' | 'flood' {
  const [low, high] = optRange.split('–').map(s => parseInt(s.replace(/,/g, '').trim()))
  if (isNaN(low) || isNaN(high)) return 'optimal'
  if (cfs < low * 0.6) return 'low'
  if (cfs >= low && cfs <= high) return 'optimal'
  if (cfs > high && cfs < high * 2.5) return 'high'
  return 'flood'
}
