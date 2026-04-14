import type { AccessPoint, RiverSection } from '@/components/maps/RiverMap'

// Wilson Creek — polyline from National Rivers Project (NRP).
// 30 points, stitched from 1 NRP segments.

export const accessPoints: AccessPoint[] = [
  { name: 'Spillway Access', lat: 33.22005, lng: -91.54417, type: 'access', description: 'AGFC' },
  { name: 'Wilson Lake Access', lat: 33.21813, lng: -91.52610, type: 'access', description: 'AGFC' },
  { name: 'Wilson Reservoir Recreation Management Area', lat: 41.67572, lng: -116.34371, type: 'access', description: 'Bureau of Land Management — restrooms, parking: overnight, fee' },
  { name: 'Wilson Creek Put-In', lat: 35.93393, lng: -81.74461, type: 'access', description: 'Pisgah National Forest — parking: yes' },
  { name: 'Wilson Creek Take-Out', lat: 35.91621, lng: -81.73011, type: 'access', description: 'Pisgah National Forest — restrooms, parking: yes' },
  { name: 'Wilson Lake Landing', lat: 46.12022, lng: -90.11946, type: 'access', description: 'Forestry & Parks Dept.' },
]

export const sections: RiverSection[] = []

export const riverPath: [number, number][] = [
  [-81.7449, 35.9336],
  [-81.7446, 35.9334],
  [-81.7438, 35.9318],
  [-81.7433, 35.9312],
  [-81.7429, 35.9309],
  [-81.7427, 35.9303],
  [-81.7420, 35.9301],
  [-81.7409, 35.9302],
  [-81.7389, 35.9297],
  [-81.7385, 35.9295],
  [-81.7374, 35.9285],
  [-81.7371, 35.9284],
  [-81.7364, 35.9284],
  [-81.7358, 35.9285],
  [-81.7351, 35.9282],
  [-81.7347, 35.9280],
  [-81.7344, 35.9272],
  [-81.7341, 35.9255],
  [-81.7342, 35.9247],
  [-81.7346, 35.9231],
  [-81.7350, 35.9219],
  [-81.7350, 35.9214],
  [-81.7346, 35.9209],
  [-81.7341, 35.9203],
  [-81.7336, 35.9202],
  [-81.7329, 35.9197],
  [-81.7322, 35.9188],
  [-81.7317, 35.9178],
  [-81.7306, 35.9161],
  [-81.7305, 35.9160],
]
