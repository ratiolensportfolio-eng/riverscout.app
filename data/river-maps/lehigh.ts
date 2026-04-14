import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Lehigh River (PENNSYLVANIA) — geometry from USGS NHDPlus HR
// 14 points

export const accessPoints: AccessPoint[] = [
  { name: 'Glen Onoko Boat Ramp', lat: 40.88275, lng: -75.75982, type: 'access', description: 'Bureau of State Parks — parking: yes' },
  { name: 'Rockport', lat: 40.96653, lng: -75.75501, type: 'access', description: 'Bureau of State Parks — parking: yes' },
  { name: 'White Haven', lat: 41.05562, lng: -75.77153, type: 'access', description: 'Bureau of State Parks — parking: yes' },
  { name: 'Canal Park', lat: 40.59844, lng: -75.44737, type: 'access', description: 'City of Allentown — parking: yes' },
  { name: 'Kimmett\'s Lock', lat: 40.62451, lng: -75.45847, type: 'access', description: 'City of Allentown — parking: yes' },
  { name: 'Route 33 Access', lat: 40.64495, lng: -75.27205, type: 'access', description: 'PFBC — parking: yes' },
  { name: 'Wilson Avenue', lat: 40.63122, lng: -75.30966, type: 'access', description: 'Bethlehem Township — parking: yes' },
  { name: 'Hugh Moore Park', lat: 40.67058, lng: -75.23580, type: 'access', description: 'City of Easton' },
  { name: 'Bowmanstown', lat: 40.79941, lng: -75.67046, type: 'access', description: 'East Penn Township — parking: yes' },
  { name: 'Jim Thorpe', lat: 40.86500, lng: -75.73556, type: 'access', description: 'Carbon County Dept of Parks & Recreation — parking: yes' },
  { name: 'Dunbar\'s Beach', lat: 40.83423, lng: -75.70230, type: 'access', description: 'Lehigh Canal Recreation Commission — parking: yes' },
  { name: 'Parryville - Pohopoco Mouth', lat: 40.81572, lng: -75.67267, type: 'access', description: 'Lehigh Canal Recreation Commission — parking: yes' },
  { name: 'Walnutport', lat: 40.74976, lng: -75.60106, type: 'access', description: 'Walnutport Boro — parking: yes' },
  { name: 'Treichlers Bridge', lat: 40.73373, lng: -75.54030, type: 'access', description: 'Lehigh County — parking: yes' },
  { name: 'Laurys Station', lat: 40.70992, lng: -75.52112, type: 'access', description: 'Lehigh County — parking: yes' },
  { name: 'Canal Street Park', lat: 40.67814, lng: -75.49401, type: 'access', description: 'Northampton Boro — parking: yes' },
  { name: 'North Catasauqua', lat: 40.66533, lng: -75.48264, type: 'access', description: 'North Catasauqua Boro' },
  { name: 'Catasauqua', lat: 40.64763, lng: -75.47197, type: 'access', description: 'Catasauqua Boro — parking: yes' },
  { name: 'Sand Island Access', lat: 40.61509, lng: -75.38631, type: 'access', description: 'City of Bethlehem — parking: yes' },
  { name: 'Cementon', lat: 40.69016, lng: -75.50488, type: 'access', description: ' ' },
  { name: 'Lehigh Gap Access', lat: 40.78212, lng: -75.60713, type: 'access', description: 'Lehigh County — parking: yes' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-75.7496, 40.9739],
  [-75.7531, 40.9709],
  [-75.7531, 40.9709],
  [-75.7546, 40.9668],
  [-75.7546, 40.9668],
  [-75.7538, 40.9658],
  [-75.7496, 40.9664],
  [-75.7496, 40.9664],
  [-75.7441, 40.9707],
  [-75.7341, 40.9685],
  [-75.7235, 40.9696],
  [-75.7183, 40.972],
  [-75.7133, 40.9714],
  [-75.7133, 40.9714],
]
