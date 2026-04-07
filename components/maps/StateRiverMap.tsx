'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { FlowCondition } from '@/types'
import { getRiverPath } from '@/data/rivers'

interface RiverDot {
  id: string
  name: string
  lat: number
  lng: number
  condition: FlowCondition
  cfs: number | null
  cls: string
  stateKey: string
}

interface Props {
  rivers: RiverDot[]
  stateName: string
  stateCenter: [number, number] // [lng, lat]
  stateZoom: number
}

const condColors: Record<string, string> = {
  optimal: '#1D9E75',
  low: '#533AB7',
  high: '#BA7517',
  flood: '#A32D2D',
  loading: '#aaa99a',
}

export default function StateRiverMap({ rivers, stateName, stateCenter, stateZoom }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const router = useRouter()

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    if (!mapContainer.current || !token || map.current) return

    mapboxgl.accessToken = token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: stateCenter,
      zoom: stateZoom,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      if (!map.current) return

      // Add river dots as a GeoJSON source
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: rivers.map(r => ({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [r.lng, r.lat] },
          properties: {
            id: r.id,
            name: r.name,
            condition: r.condition,
            cfs: r.cfs,
            cls: r.cls,
            stateKey: r.stateKey,
            color: condColors[r.condition] || condColors.loading,
          },
        })),
      }

      map.current.addSource('rivers', { type: 'geojson', data: geojson })

      // Outer glow ring
      map.current.addLayer({
        id: 'river-dots-glow',
        type: 'circle',
        source: 'rivers',
        paint: {
          'circle-radius': 12,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.15,
        },
      })

      // Main dot
      map.current.addLayer({
        id: 'river-dots',
        type: 'circle',
        source: 'rivers',
        paint: {
          'circle-radius': 7,
          'circle-color': ['get', 'color'],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      })

      // River name labels
      map.current.addLayer({
        id: 'river-labels',
        type: 'symbol',
        source: 'rivers',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
          'text-allow-overlap': false,
        },
        paint: {
          'text-color': '#085041',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1.5,
        },
      })

      // Hover interaction
      map.current.on('mouseenter', 'river-dots', (e) => {
        if (!map.current) return
        map.current.getCanvas().style.cursor = 'pointer'
        const feature = e.features?.[0]
        if (feature?.properties) {
          setHovered(feature.properties.id)
          // Enlarge the hovered dot
          map.current.setPaintProperty('river-dots', 'circle-radius', [
            'case', ['==', ['get', 'id'], feature.properties.id], 10, 7
          ])
        }
      })

      map.current.on('mouseleave', 'river-dots', () => {
        if (!map.current) return
        map.current.getCanvas().style.cursor = ''
        setHovered(null)
        map.current.setPaintProperty('river-dots', 'circle-radius', 7)
      })

      // Click to navigate
      map.current.on('click', 'river-dots', (e) => {
        const feature = e.features?.[0]
        if (feature?.properties) {
          const r = rivers.find(rv => rv.id === feature.properties!.id)
          if (r) {
            router.push(getRiverPath({ id: r.id, n: r.name, stateKey: r.stateKey }))
          }
        }
      })
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [token, rivers, stateCenter, stateZoom, router])

  const hoveredRiver = rivers.find(r => r.id === hovered)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!token ? (
        <div style={{
          width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg2)', flexDirection: 'column', gap: '6px',
        }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--tx3)' }}>
            Interactive map requires Mapbox API key
          </div>
        </div>
      ) : (
        <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      )}

      {/* Hover tooltip */}
      {hoveredRiver && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: 'rgba(255,255,255,.95)', borderRadius: '8px',
          padding: '10px 14px', boxShadow: '0 2px 12px rgba(0,0,0,.15)',
          fontFamily: "'IBM Plex Mono', monospace", zIndex: 5,
          maxWidth: '220px',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 600, color: '#085041', marginBottom: '3px' }}>
            {hoveredRiver.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: condColors[hoveredRiver.condition],
              display: 'inline-block',
            }} />
            {hoveredRiver.cfs !== null ? (
              <span style={{ color: condColors[hoveredRiver.condition], fontWeight: 500 }}>
                {hoveredRiver.cfs.toLocaleString()} cfs
              </span>
            ) : (
              <span style={{ color: 'var(--tx3)' }}>Loading...</span>
            )}
            <span style={{ color: 'var(--tx3)', fontSize: '9px' }}>Class {hoveredRiver.cls}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '8px', left: '8px',
        background: 'rgba(255,255,255,.9)', borderRadius: '6px',
        padding: '6px 10px', fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace",
        display: 'flex', gap: '10px', zIndex: 5,
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: condColors.optimal }} /> Optimal
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: condColors.low }} /> Low
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: condColors.high }} /> High
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: condColors.flood }} /> Flood
        </span>
      </div>
    </div>
  )
}
