// Named rapids data for whitewater rivers
// Only included for rivers with documented, named rapids

export interface NamedRapid {
  name: string
  class: string           // e.g. "III", "IV+", "V"
  lat: number
  lng: number
  description: string
  mile?: number           // river mile if known
}

export const RAPIDS: Record<string, NamedRapid[]> = {

  gauley: [
    { name: 'Insignificant', class: 'V', lat: 38.226, lng: -80.879, description: 'First major rapid on the Upper Gauley. A complex, technical Class V with multiple channels, huge holes, and an intimidating horizon line. Do not be fooled by the name.' },
    { name: 'Pillow Rock', class: 'V', lat: 38.218, lng: -80.886, description: 'Massive undercut pillow rock on river left creates a violent hydraulic. The line is right of the pillow — miss it and the consequences are severe.' },
    { name: "Lost Paddle", class: 'V', lat: 38.212, lng: -80.891, description: 'The longest rapid on the Upper Gauley — a quarter-mile of continuous Class V chaos. Multiple drops, no eddies, relentless.' },
    { name: "Sweet's Falls", class: 'V', lat: 38.195, lng: -80.908, description: "Last major rapid on the Upper Gauley. A clean 12-foot waterfall drop — the most photogenic rapid on the river." },
    { name: 'Upper and Lower Mash', class: 'IV', lat: 38.178, lng: -80.919, description: 'Opening rapids of the Lower Gauley. Big wave trains and strong hydraulics. Good warm-up for what follows.' },
    { name: 'Pure Screaming Hell', class: 'V', lat: 38.170, lng: -80.930, description: 'The marquee rapid of the Lower Gauley. A long, violent, technical Class V with huge holes, powerful hydraulics, and no easy line.' },
  ],

  yough: [
    { name: 'Entrance Rapid', class: 'III', lat: 39.869, lng: -79.495, description: 'First rapid below Ohiopyle Falls launch. Sets the tone for the Lower Yough — continuous, fast, rocky.' },
    { name: 'Cucumber', class: 'III+', lat: 39.862, lng: -79.498, description: 'Long Class III+ with a tricky entrance move. Big waves and a pourover at the bottom.' },
    { name: 'Railroad', class: 'IV', lat: 39.855, lng: -79.500, description: 'One of the most famous rapids in the East. A long, complex Class IV with multiple channels and a powerful hydraulic at the bottom.' },
    { name: 'Dimple Rock', class: 'IV', lat: 39.848, lng: -79.503, description: 'Technical Class IV. A large boulder mid-river creates a powerful eddy line. Named for the dimple in the rock face.' },
    { name: 'Rivers End', class: 'III', lat: 39.840, lng: -79.508, description: 'Final rapid before Bruner Run take-out. Fun wave train, good finish.' },
  ],

  nantahala: [
    { name: 'Pattons Run', class: 'II+', lat: 35.345, lng: -83.572, description: 'Early rapid with fun waves. Good warm-up, introduces the Nantahala current.' },
    { name: 'Whirlpool', class: 'II', lat: 35.330, lng: -83.565, description: 'Strong eddy line creates a whirlpool effect on river right. Fun but not dangerous.' },
    { name: "Nantahala Falls", class: 'III', lat: 35.315, lng: -83.558, description: 'The grand finale — a powerful Class III ledge drop right at the NOC take-out. Crowds gather on the rocks to watch. The defining rapid of the Nantahala.' },
  ],

  ocoee: [
    { name: 'Grumpy', class: 'III+', lat: 35.075, lng: -84.508, description: 'First named rapid on the Middle Ocoee. Big waves, strong current.' },
    { name: 'Double Suck', class: 'IV', lat: 35.072, lng: -84.498, description: 'Two powerful holes in succession. Flip potential for rafts — brace hard through both.' },
    { name: 'Table Saw', class: 'IV', lat: 35.068, lng: -84.488, description: 'Sharp ledge creates a river-wide hydraulic. One of the most powerful features on the Ocoee.' },
    { name: 'Diamond Splitter', class: 'III+', lat: 35.062, lng: -84.478, description: 'A large boulder splits the current into two channels. Pick your line.' },
    { name: 'Broken Nose', class: 'III+', lat: 35.058, lng: -84.468, description: 'Named for what happens if you miss the line. A powerful pour-over at the bottom.' },
  ],

  chattooga: [
    { name: 'Bull Sluice', class: 'IV', lat: 34.920, lng: -83.280, description: 'The most famous rapid on the Chattooga. A powerful Class IV drop visible from the road — scout from river left. Mandatory scout for first-timers.' },
    { name: 'Corkscrew', class: 'IV', lat: 34.880, lng: -83.305, description: 'First of the Five Falls sequence. A twisting drop through a narrow slot. Momentum is key.' },
    { name: 'Crack-in-the-Rock', class: 'IV', lat: 34.875, lng: -83.308, description: 'A narrow slot between boulders. Commit to the line — no room for error.' },
    { name: 'Jawbone', class: 'IV+', lat: 34.870, lng: -83.310, description: 'The crux of the Five Falls. A powerful, complex rapid with undercut rocks and a violent hydraulic. Scout carefully.' },
    { name: 'Sock-em-Dog', class: 'IV', lat: 38.865, lng: -83.312, description: 'Last of the Five Falls. A big, fast, powerful rapid. After surviving Jawbone, this feels like a victory lap.' },
  ],

  arkansas: [
    { name: 'The Numbers', class: 'IV-V', lat: 38.85, lng: -106.22, description: 'A series of named drops — Number 1 through Number 7 — each a distinct Class IV-V rapid. Expert only section above Browns Canyon.' },
    { name: 'Zoom Flume', class: 'III', lat: 38.73, lng: -105.98, description: 'The biggest rapid in Browns Canyon. A fun, fast Class III with big waves.' },
    { name: 'Seidels Suckhole', class: 'III+', lat: 38.70, lng: -105.95, description: 'A powerful hole in the center of the river. Run right to avoid.' },
    { name: 'Sunshine Falls', class: 'IV+', lat: 38.58, lng: -105.88, description: 'Royal Gorge highlight. A massive Class IV+ drop between 1,000-foot canyon walls.' },
  ],

  snake_wy: [
    { name: 'Kahuna', class: 'III+', lat: 43.30, lng: -110.88, description: 'Big wave train — the biggest feature in the canyon at most flows. Huge standing waves, great surfing.' },
    { name: 'Lunch Counter', class: 'III', lat: 43.28, lng: -110.86, description: 'The most famous wave on the Snake. A massive standing wave that kayakers surf and rafters punch. Iconic.' },
    { name: 'Rope', class: 'III', lat: 43.32, lng: -110.90, description: 'First significant rapid in the canyon. Fun wave train, sets the pace.' },
    { name: 'Champagne', class: 'III', lat: 43.27, lng: -110.85, description: 'Bubbly, aerated whitewater — hence the name. Fun, fast Class III.' },
  ],

  american: [
    { name: 'Meatgrinder', class: 'III+', lat: 38.78, lng: -120.92, description: 'Early rapid on the Chili Bar section. A rocky entrance leads to a powerful wave train.' },
    { name: 'Troublemaker', class: 'III', lat: 38.77, lng: -120.90, description: 'A large boulder creates two channels. Most rafters go right, kayakers play left.' },
    { name: 'Satans Cesspool', class: 'III+', lat: 38.75, lng: -120.85, description: 'A recirculating hole below a ledge drop. The name is earned at higher flows.' },
    { name: 'Tunnel Chute', class: 'IV', lat: 38.73, lng: -120.82, description: 'The marquee rapid of the Gorge section. The river funnels through a narrow slot in the bedrock — a fire hose of whitewater.' },
  ],

  grandcanyon: [
    { name: 'Badger Creek Rapid', class: 'III', lat: 36.82, lng: -111.65, description: 'First real rapid below Lees Ferry. Mile 8. Welcome to the Grand Canyon.' },
    { name: 'Hance Rapid', class: 'IV', lat: 36.12, lng: -111.97, description: 'Mile 77. The gateway to the Inner Gorge. A rocky, technical rapid that has flipped many a raft.' },
    { name: 'Horn Creek Rapid', class: 'IV', lat: 36.09, lng: -112.02, description: 'Mile 90. Two massive holes guard the center. A classic Grand Canyon big-water drop.' },
    { name: 'Hermit Rapid', class: 'IV', lat: 36.08, lng: -112.08, description: 'Mile 95. Five enormous standing waves in a row — the best wave train in the Grand Canyon.' },
    { name: 'Crystal Rapid', class: 'V', lat: 36.05, lng: -112.13, description: 'Mile 98. Created by a 1966 flash flood. A violent hole on the left, a rock garden on the right. Scout from the right.' },
    { name: 'Lava Falls', class: 'V', lat: 36.20, lng: -112.95, description: 'Mile 179. The most famous single rapid in North America. A 37-foot drop in 300 yards. The scout takes longer than the run. Commit to a line and hold on.' },
  ],

  salmon: [
    { name: 'Killum', class: 'IV', lat: 45.25, lng: -114.20, description: 'Early big rapid on the Main Salmon. A rocky, powerful Class IV that demands respect at any flow.' },
    { name: 'Salmon Falls', class: 'IV', lat: 45.30, lng: -114.50, description: 'A significant ledge drop — one of the defining rapids of the Main Salmon.' },
    { name: 'Chittam', class: 'III+', lat: 45.35, lng: -114.70, description: 'Fun, big wave train through a scenic stretch of the River of No Return.' },
  ],

  kennebec: [
    { name: 'Magic Falls', class: 'IV', lat: 45.25, lng: -69.88, description: "The centerpiece of Maine's Kennebec. A thundering Class IV drop on dam-release water — the biggest commercially rafted rapid in New England." },
    { name: 'Whitewasher', class: 'III+', lat: 45.23, lng: -69.87, description: 'Powerful hydraulic below Magic Falls. The river compresses through a narrow channel.' },
    { name: 'Three Sisters', class: 'III', lat: 45.20, lng: -69.86, description: 'Three consecutive wave trains. Fun, fast, and a good finisher.' },
  ],

  hudson_gorge: [
    { name: 'Harris Rift', class: 'III+', lat: 43.78, lng: -74.12, description: 'First major rapid in the gorge. A long Class III+ that sets the tone for 17 miles of roadless wilderness.' },
    { name: 'Blue Ledge', class: 'IV', lat: 43.72, lng: -74.05, description: 'The crux of the Hudson Gorge. A powerful, complex Class IV in the deepest part of the Adirondack gorge. No road access for miles in either direction.' },
    { name: 'Ord Falls', class: 'IV', lat: 43.70, lng: -74.02, description: 'A steep, technical drop near the end of the gorge run. Scout from the right.' },
  ],

  russell_fork: [
    { name: 'El Horendo', class: 'V', lat: 37.28, lng: -82.28, description: 'The opening move of the Breaks Canyon. A violent Class V that puts you into the wall. The name says it all.' },
    { name: 'Triple Drop', class: 'V', lat: 37.27, lng: -82.27, description: 'Three consecutive ledge drops with no recovery between them. The most committing sequence in the East.' },
    { name: 'Tower Falls', class: 'V', lat: 37.26, lng: -82.26, description: 'A 12-foot waterfall drop with the canyon walls towering above. Spectacular and terrifying.' },
    { name: 'Climax', class: 'IV+', lat: 37.25, lng: -82.25, description: 'The final major rapid in the Breaks. After Triple Drop and Tower Falls, this feels like a relief — but do not let your guard down.' },
  ],

  newriver: [
    { name: 'Upper Railroad', class: 'III+', lat: 38.08, lng: -81.10, description: 'First big rapid on the Lower New. Strong current, big waves.' },
    { name: 'Upper Keeney', class: 'IV', lat: 38.05, lng: -81.08, description: 'The first of three Keeney brothers rapids. Technical, powerful, respected.' },
    { name: 'Middle Keeney', class: 'IV', lat: 38.04, lng: -81.07, description: 'The hardest Keeney. A complex, powerful Class IV with multiple hazards.' },
    { name: 'Lower Keeney', class: 'III+', lat: 38.03, lng: -81.06, description: 'The mellowst Keeney but still demanding. Big wave train finish.' },
    { name: 'Fayette Station', class: 'III', lat: 38.02, lng: -81.05, description: 'Final rapid below the iconic New River Gorge Bridge. Look up.' },
  ],

  green_nc: [
    { name: 'Sunshine', class: 'V', lat: 35.22, lng: -82.33, description: 'Technical Class V with multiple moves required. One of the benchmark rapids in southeastern creek boating.' },
    { name: 'Chief', class: 'IV+', lat: 35.21, lng: -82.32, description: 'A powerful drop with a nasty hole on the left. Run right of center.' },
    { name: 'Gorilla', class: 'V+', lat: 35.20, lng: -82.31, description: 'The most famous single rapid in the eastern United States. A massive, violent, complex Class V+ drop. The annual Green Race finishes here. Portage is no shame.' },
  ],

  lochsa: [
    { name: 'Lochsa Falls', class: 'IV+', lat: 46.38, lng: -115.48, description: 'The biggest single drop on the Lochsa. A powerful ledge drop that pushes Class V at high water.' },
    { name: 'Grim Reaper', class: 'IV', lat: 46.40, lng: -115.52, description: 'Named for the large hole that recirculates at certain flows. Run center-left.' },
    { name: 'Bloody Mary', class: 'IV', lat: 46.42, lng: -115.55, description: 'A rocky, technical rapid in the heart of the continuous whitewater section.' },
  ],

  nolichucky: [
    { name: 'Quarter Mile', class: 'IV', lat: 36.10, lng: -82.52, description: 'The signature rapid of the Nolichucky Gorge — a quarter mile of continuous Class IV through the deepest gorge in the East.' },
    { name: 'Roostertail', class: 'III+', lat: 36.08, lng: -82.50, description: 'A boulder creates a rooster-tail spray visible from upstream. Fun, fast run.' },
    { name: 'On the Rocks', class: 'III', lat: 36.06, lng: -82.48, description: 'Rocky Class III in the heart of the gorge. Technical at lower flows.' },
  ],
}
