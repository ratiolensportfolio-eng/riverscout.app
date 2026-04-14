import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Tygart Valley River (WEST VIRGINIA) — geometry from USGS NHDPlus HR
// 14 points

export const accessPoints: AccessPoint[] = [
  { name: 'CR 39 Bridge', lat: 38.73172, lng: -79.95932, type: 'access', description: 'WVDOH' },
  { name: 'Burnt Bridge', lat: 38.80892, lng: -79.88149, type: 'access', description: 'WVDOH' },
  { name: 'Scotts Ford', lat: 38.90828, lng: -79.86192, type: 'access', description: 'WVDNR — parking: yes' },
  { name: 'No Name', lat: 39.15692, lng: -80.04216, type: 'access', description: 'No Control Sign' },
  { name: 'No Name', lat: 39.14978, lng: -80.04008, type: 'access', description: 'WVDNR, WRS, City of Philippi' },
  { name: 'Phillippi Covered Bridge', lat: 39.15045, lng: -80.04443, type: 'access', description: 'NA — parking: yes' },
  { name: 'Tygart Tailwaters', lat: 39.31537, lng: -80.03265, type: 'access', description: 'WVDNR — restrooms, parking: yes' },
  { name: 'Towles 4-H Camp', lat: 39.37375, lng: -80.04824, type: 'access', description: 'NA — parking: yes' },
  { name: 'Tygart Lake State Park', lat: 39.30323, lng: -80.01610, type: 'access', description: 'No Control Sign' },
  { name: 'Tygart Lake State Park', lat: 39.30192, lng: -80.02122, type: 'access', description: 'No Control Sign — restrooms, parking: yes' },
  { name: 'Tygart Lake State Park', lat: 39.29973, lng: -80.02254, type: 'access', description: 'No Control Sign — restrooms, parking: yes' },
  { name: 'Tygart Lake State Park -Ramp 4', lat: 39.29747, lng: -80.02223, type: 'access', description: 'No Control Sign — restrooms, parking: yes' },
  { name: 'Junior #2', lat: 39.01102, lng: -79.94627, type: 'access', description: 'WVDOH — parking: yes' },
  { name: 'Junior', lat: 38.97363, lng: -79.95847, type: 'access', description: 'WVDOH' },
  { name: 'Pleasant Creek WMA', lat: 39.26682, lng: -80.01061, type: 'access', description: 'WVDNR, US Army Corps of Engineers — parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-80.0271, 39.1668],
  [-80.0303, 39.1737],
  [-80.028, 39.1782],
  [-80.0275, 39.1836],
  [-80.0275, 39.1836],
  [-80.0154, 39.192],
  [-80.021, 39.197],
  [-80.0206, 39.1995],
  [-80.0118, 39.2034],
  [-80.0099, 39.2027],
  [-80.0097, 39.2005],
  [-80.0091, 39.1978],
  [-80.0087, 39.1976],
  [-80.0087, 39.1976],
]
