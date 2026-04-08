'use client'

import { useState } from 'react'
import SuggestCorrection from '@/components/SuggestCorrection'

const mono = "'IBM Plex Mono', monospace"

interface Props {
  riverId: string
  riverName: string
  stateKey: string
  isVerified: boolean
}

export default function DataConfidenceBanner({ riverId, riverName, stateKey, isVerified }: Props) {
  const [modalOpen, setModalOpen] = useState(false)

  if (isVerified) {
    return (
      <div className="confidence-banner" style={{
        background: 'var(--rvlt)', borderBottom: '.5px solid var(--rvmd)',
        padding: '7px 16px', flexShrink: 0,
        height: '32px', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '6px', flexWrap: 'wrap',
        fontFamily: mono, fontSize: '10px', color: 'var(--rvdk)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: 'var(--rv)', fontSize: '12px' }}>&#10003;</span>
          Rapids verified by local paddlers
        </span>
        <span style={{ color: 'var(--rvmd)' }}>&middot;</span>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            fontFamily: mono, fontSize: '10px', color: 'var(--rv)',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', textUnderlineOffset: '2px',
            padding: 0,
          }}
        >
          Improve This River
        </button>
        {modalOpen && (
          <SuggestCorrection
            riverId={riverId}
            riverName={riverName}
            stateKey={stateKey}
            initialField="other"
            externalOpen={true}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div className="confidence-banner" style={{
      background: 'var(--amlt)', borderBottom: '.5px solid #E8C54A',
      padding: '7px 16px', flexShrink: 0,
      height: '32px', boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '6px', flexWrap: 'wrap', overflow: 'hidden',
      fontFamily: mono, fontSize: '10px', color: '#6B4F0A',
    }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ fontSize: '11px' }}>&#9889;</span>
        Flow data is live from USGS
      </span>
      <span style={{ color: '#D4A94A' }}>&middot;</span>
      <span>Rapid classifications and CFS ranges need community verification</span>
      <span style={{ color: '#D4A94A' }}>&middot;</span>
      <span>Know this river?</span>
      <button
        onClick={() => setModalOpen(true)}
        style={{
          fontFamily: mono, fontSize: '10px', color: '#6B4F0A',
          background: 'none', border: 'none', cursor: 'pointer',
          fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px',
          padding: 0,
        }}
      >
        Improve This River
      </button>
      {modalOpen && (
        <SuggestCorrection
          riverId={riverId}
          riverName={riverName}
          stateKey={stateKey}
          initialField="cls"
          externalOpen={true}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
