'use client'

import { useState } from 'react'
import SuggestCorrection from '@/components/SuggestCorrection'
import { getVerificationItems, type VerificationItem } from '@/lib/needs-verification'

const mono = "'IBM Plex Mono', monospace"

interface Props {
  riverId: string
  riverName: string
  stateKey: string
  isVerified: boolean
  needsVerification?: string[]
}

export default function DataConfidenceBanner({ riverId, riverName, stateKey, isVerified, needsVerification }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [verifyListOpen, setVerifyListOpen] = useState(false)
  const [activeField, setActiveField] = useState<string>('other')
  const verifyItems = getVerificationItems(needsVerification)
  const verifyCount = verifyItems.length

  function openSuggestForItem(item: VerificationItem) {
    setActiveField(item.suggestField)
    setVerifyListOpen(false)
    setModalOpen(true)
  }

  function openSuggestGeneric() {
    setActiveField(isVerified ? 'other' : 'cls')
    setModalOpen(true)
  }

  // Render the chip + popover for needsVerification items
  const verifyChip = verifyCount > 0 ? (
    <>
      <span style={{ color: 'var(--rvmd)' }}>&middot;</span>
      <button
        onClick={() => setVerifyListOpen(o => !o)}
        style={{
          fontFamily: mono, fontSize: '10px',
          color: '#8A5A00', background: '#FFF4D6',
          border: '.5px solid #E8C54A', borderRadius: '10px',
          padding: '1px 8px', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
        }}
        title="Items flagged for community verification"
      >
        <span style={{ fontSize: '11px' }}>&#9888;</span>
        {verifyCount} {verifyCount === 1 ? 'item needs' : 'items need'} verification
      </button>
    </>
  ) : null

  // Popover/modal listing the items
  const verifyListModal = verifyListOpen ? (
    <div
      onClick={() => setVerifyListOpen(false)}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(4, 30, 51, 0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          border: '.5px solid var(--bd)',
          borderRadius: '6px',
          padding: '20px',
          maxWidth: '460px', width: '90%', maxHeight: '80vh', overflowY: 'auto',
        }}
      >
        <div style={{
          fontFamily: "'Playfair Display', serif", fontSize: '16px',
          fontWeight: 700, color: 'var(--rvdk)', marginBottom: '4px',
        }}>
          Help verify {riverName}
        </div>
        <div style={{ fontFamily: mono, fontSize: '10px', color: 'var(--tx2)', marginBottom: '14px' }}>
          {verifyCount} {verifyCount === 1 ? 'item' : 'items'} flagged for review by the community
        </div>
        {verifyItems.map(item => (
          <div key={item.tag} style={{
            border: '.5px solid var(--bd)', borderRadius: '4px',
            padding: '10px 12px', marginBottom: '8px',
            background: 'var(--bg2)',
          }}>
            <div style={{
              fontFamily: mono, fontSize: '11px', fontWeight: 600,
              color: '#8A5A00', marginBottom: '4px',
            }}>
              &#9888; {item.label}
            </div>
            <div style={{
              fontFamily: mono, fontSize: '10px', color: 'var(--tx2)',
              lineHeight: 1.5, marginBottom: '8px',
            }}>
              {item.description}
            </div>
            <button
              onClick={() => openSuggestForItem(item)}
              style={{
                fontFamily: mono, fontSize: '10px',
                background: 'var(--rv)', color: 'white',
                border: 'none', borderRadius: '3px',
                padding: '5px 10px', cursor: 'pointer',
              }}
            >
              Help fix this &rarr;
            </button>
          </div>
        ))}
        <button
          onClick={() => setVerifyListOpen(false)}
          style={{
            fontFamily: mono, fontSize: '10px',
            background: 'none', border: '.5px solid var(--bd)',
            color: 'var(--tx2)', borderRadius: '3px',
            padding: '6px 12px', cursor: 'pointer', marginTop: '4px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  ) : null

  if (isVerified) {
    return (
      <div className="confidence-banner" style={{
        background: 'var(--rvlt)',
        borderBottom: '.5px solid var(--rvmd)',
        padding: '7px 16px', flexShrink: 0,
        minHeight: '32px', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '6px', flexWrap: 'wrap',
        fontFamily: mono, fontSize: '10px', color: 'var(--rvdk)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ color: 'var(--rv)', fontSize: '12px' }}>&#10003;</span>
          Rapids verified by local paddlers
        </span>
        {verifyChip}
        <span style={{ color: 'var(--rvmd)' }}>&middot;</span>
        <button
          onClick={openSuggestGeneric}
          style={{
            fontFamily: mono, fontSize: '10px', color: 'var(--rv)',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', textUnderlineOffset: '2px',
            padding: 0,
          }}
        >
          Improve This River
        </button>
        {verifyListModal}
        {modalOpen && (
          <SuggestCorrection
            riverId={riverId}
            riverName={riverName}
            stateKey={stateKey}
            initialField={activeField}
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
      minHeight: '32px', boxSizing: 'border-box',
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
      {verifyChip}
      <span style={{ color: '#D4A94A' }}>&middot;</span>
      <span>Know this river?</span>
      <button
        onClick={openSuggestGeneric}
        style={{
          fontFamily: mono, fontSize: '10px', color: '#6B4F0A',
          background: 'none', border: 'none', cursor: 'pointer',
          fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: '2px',
          padding: 0,
        }}
      >
        Improve This River
      </button>
      {verifyListModal}
      {modalOpen && (
        <SuggestCorrection
          riverId={riverId}
          riverName={riverName}
          stateKey={stateKey}
          initialField={activeField}
          externalOpen={true}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
