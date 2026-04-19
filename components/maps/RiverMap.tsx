'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface AccessPoint {
  name: string
  lat: number
  lng: number
  type: 'put-in' | 'take-out' | 'access' | 'portage' | 'campsite'
  description?: string
}

export interface RiverSection {
  from: string
  to: string
  miles: number
  paddleTime: string  // e.g. "2–3 hours"
  class?: string
  notes?: string
}

interface Props {
  riverName: string
  accessPoints: AccessPoint[]
  sections: RiverSection[]
  riverPath?: [number, number][]  // [lng, lat] pairs for the river polyline
  center?: [number, number]       // [lng, lat]
  zoom?: number
}

export default function RiverMap({ riverName, accessPoints, sections, riverPath, center, zoom }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  useEffect(() => {
    if (!mapContainer.current || !token || map.current) return

    mapboxgl.accessToken = token

    const defaultCenter: [number, number] = center || (
      accessPoints.length > 0
        ? [accessPoints[0].lng, accessPoints[0].lat]
        : [-85.6, 44.1]
    )

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: defaultCenter,
      zoom: zoom || 11,
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left')

    map.current.on('load', () => {
      setMapLoaded(true)

      // Add river polyline if provided
      if (riverPath && riverPath.length > 1 && map.current) {
        map.current.addSource('river-line', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: riverPath,
            },
          },
        })

        map.current.addLayer({
          id: 'river-line-layer',
          type: 'line',
          source: 'river-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#1D9E75',
            'line-width': 4,
            'line-opacity': 0.8,
          },
        })
      }

      // Add access point markers
      accessPoints.forEach((pt) => {
        if (!map.current) return

        const color =
          pt.type === 'put-in' ? '#1D9E75' :
          pt.type === 'take-out' ? '#A32D2D' :
          pt.type === 'portage' ? '#BA7517' :
          pt.type === 'campsite' ? '#185FA5' :
          '#085041'

        const el = document.createElement('div')
        el.style.cssText = `
          width: 14px; height: 14px; border-radius: 50%;
          background: ${color}; border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0,0,0,.3); cursor: pointer;
        `

        const popup = new mapboxgl.Popup({ offset: 12, closeButton: false })
          .setHTML(`
            <div style="font-family: 'IBM Plex Mono', monospace; font-size: 11px; max-width: 200px;">
              <div style="font-weight: 600; margin-bottom: 2px;">${pt.name}</div>
              <div style="font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: .5px;">${pt.type.replace('-', ' ')}</div>
              ${pt.description ? `<div style="font-size: 10px; color: #444; margin-top: 4px;">${pt.description}</div>` : ''}
              <div style="font-size: 9px; color: #999; margin-top: 4px;">${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)}</div>
            </div>
          `)

        new mapboxgl.Marker({ element: el })
          .setLngLat([pt.lng, pt.lat])
          .setPopup(popup)
          .addTo(map.current)
      })

      // Fit bounds to show everything — access point markers AND
      // the river polyline. The old code required accessPoints > 1,
      // which meant rivers with a riverPath but no static access
      // points (like Manistee, whose access points live in Supabase)
      // never zoomed to the river and just showed the default center.
      if (map.current) {
        const bounds = new mapboxgl.LngLatBounds()
        let hasPoints = false
        accessPoints.forEach(pt => { bounds.extend([pt.lng, pt.lat]); hasPoints = true })
        if (riverPath) riverPath.forEach(coord => { bounds.extend(coord as [number, number]); hasPoints = true })
        if (hasPoints) {
          map.current.fitBounds(bounds, { padding: 50, maxZoom: 13 })
        }
      }
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [token, accessPoints, riverPath, center, zoom])

  const mono = "'IBM Plex Mono', monospace"
  const serif = "'Playfair Display', serif"

  return (
    <div>
      {/* Map */}
      <div style={{ position: 'relative', borderRadius: 'var(--rlg)', overflow: 'hidden', border: '.5px solid var(--bd)', marginBottom: '14px' }}>
        {!token && (
          <div style={{
            height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg2)', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx3)' }}>Map requires Mapbox API key</div>
            <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)' }}>Set NEXT_PUBLIC_MAPBOX_TOKEN in .env.local</div>
          </div>
        )}
        <div ref={mapContainer} style={{ height: '350px', width: '100%', display: token ? 'block' : 'none' }} />

        {/* Legend overlay */}
        {mapLoaded && (
          <div style={{
            position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,.92)',
            borderRadius: '6px', padding: '8px 10px', fontSize: '9px', fontFamily: mono,
            boxShadow: '0 2px 8px rgba(0,0,0,.15)', zIndex: 5,
          }}>
            <div style={{ fontWeight: 600, marginBottom: '4px', color: '#085041' }}>{riverName}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }} /> Put-in
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#A32D2D', display: 'inline-block' }} /> Take-out
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#085041', display: 'inline-block' }} /> Access
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#BA7517', display: 'inline-block' }} /> Portage
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#185FA5', display: 'inline-block' }} /> Campground
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Section breakdown */}
      <div style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
        {sections.length} sections · {sections.reduce((sum, s) => sum + s.miles, 0).toFixed(1)} total miles
      </div>

      {sections.map((sec, i) => (
        <div
          key={i}
          onClick={() => setSelectedSection(selectedSection === i ? null : i)}
          style={{
            padding: '10px 12px', marginBottom: '6px',
            background: selectedSection === i ? 'var(--rvlt)' : 'var(--bg2)',
            border: `.5px solid ${selectedSection === i ? 'var(--rvmd)' : 'var(--bd)'}`,
            borderRadius: 'var(--r)', cursor: 'pointer',
            transition: 'background .15s, border-color .15s',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: serif, fontSize: '13px', fontWeight: 600, color: 'var(--rvdk)', marginBottom: '2px' }}>
                {sec.from} → {sec.to}
              </div>
              <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)' }}>
                {sec.miles} mi · {sec.paddleTime}
                {sec.class && <span style={{ marginLeft: '6px', color: 'var(--wt)' }}>Class {sec.class}</span>}
              </div>
            </div>
            <div style={{ fontFamily: serif, fontSize: '18px', fontWeight: 700, color: 'var(--rvdk)', lineHeight: 1 }}>
              {sec.miles}
              <span style={{ fontFamily: mono, fontSize: '9px', color: 'var(--tx3)', display: 'block', textAlign: 'right' }}>mi</span>
            </div>
          </div>
          {selectedSection === i && sec.notes && (
            <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginTop: '6px', lineHeight: 1.5 }}>
              {sec.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
