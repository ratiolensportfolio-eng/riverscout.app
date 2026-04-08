// Unified river data layer
// Tries Supabase first, falls back to static data/rivers.ts
// This is the single import point for all river data access

import { fetchStatesFromDB, fetchAllRiversFromDB } from '@/lib/rivers-db'
import {
  STATES as STATIC_STATES,
  ALL_RIVERS as STATIC_ALL_RIVERS,
  getRiver as staticGetRiver,
  getState as staticGetState,
  getFlowCondition,
  toSlug,
  getStateSlug,
  getRiverSlug,
  getRiverPath,
  getRiverBySlug,
} from '@/data/rivers'

// Re-export utilities that don't need DB
export { getFlowCondition, toSlug, getStateSlug, getRiverSlug, getRiverPath, getRiverBySlug }

// Use DB if available, static as fallback
const USE_DB = process.env.NEXT_PUBLIC_USE_DB === 'true'

export async function getStates() {
  if (USE_DB) {
    const dbStates = await fetchStatesFromDB()
    if (dbStates) return dbStates
  }
  return STATIC_STATES
}

export async function getAllRivers() {
  if (USE_DB) {
    const dbRivers = await fetchAllRiversFromDB()
    if (dbRivers) return dbRivers
  }
  return STATIC_ALL_RIVERS
}

export async function getRiverAsync(id: string) {
  if (USE_DB) {
    const rivers = await fetchAllRiversFromDB()
    if (rivers) return rivers.find(r => r.id === id) ?? null
  }
  return staticGetRiver(id)
}

export async function getStateAsync(key: string) {
  if (USE_DB) {
    const states = await fetchStatesFromDB()
    if (states) return states[key] ?? null
  }
  return staticGetState(key)
}

// Synchronous exports for backward compatibility (static data only)
export { STATIC_STATES as STATES, STATIC_ALL_RIVERS as ALL_RIVERS }
export const getRiver = staticGetRiver
export const getState = staticGetState
