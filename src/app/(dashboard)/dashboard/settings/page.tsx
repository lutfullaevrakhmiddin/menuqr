"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

function SignalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c6bff" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#0d0d1a',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 14,
  padding: 20,
  marginBottom: 12,
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: '1px',
  textTransform: 'uppercase',
  color: 'rgba(240,238,255,0.3)',
  marginBottom: 16,
}

const fieldLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  color: 'rgba(240,238,255,0.45)',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#f0eeff',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
}

export default function SettingsPage() {
  const router = useRouter()
  const [restaurantName, setRestaurantName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [original, setOriginal] = useState({ restaurantName: '', description: '', logoUrl: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          const init = {
            restaurantName: data.restaurantName ?? '',
            description: data.description ?? '',
            logoUrl: data.logoUrl ?? '',
          }
          setRestaurantName(init.restaurantName)
          setDescription(init.description)
          setLogoUrl(init.logoUrl)
          setOriginal(init)
        }
      })
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantName, logoUrl, description }),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => {
          setSaved(false)
          router.push('/dashboard')
        }, 1500)
      }
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    router.push('/dashboard')
  }

  return (
    <div style={{ maxWidth: '80%', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <SignalIcon />
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f0eeff', letterSpacing: '-.3px' }}>
            Sozlamalar sahifasi
          </div>
          <div style={{ fontSize: 11, color: 'rgba(240,238,255,0.35)', marginTop: 2 }}>
            <span style={{ color: 'rgba(124,107,255,0.8)' }}>{original.restaurantName}</span>
            {' · Restoran sozlamalari'}
          </div>
        </div>
      </div>

      {/* Section 1 — Restoran ma'lumotlari */}
      <div style={cardStyle}>
        <div style={sectionLabelStyle}>Restoran ma&apos;lumotlari</div>
        <div style={{ marginBottom: 12 }}>
          <label style={fieldLabelStyle}>Restoran nomi</label>
          <input
            value={restaurantName}
            onChange={e => setRestaurantName(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={fieldLabelStyle}>Tavsif (ixtiyoriy)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, resize: 'none', height: 64, display: 'block', fontFamily: 'sans-serif' }}
          />
        </div>
      </div>

      {/* Section 2 — Logo */}
      <div style={cardStyle}>
        <div style={sectionLabelStyle}>Logo</div>
        <ImageUpload value={logoUrl} onChange={setLogoUrl} label="Restoran logosi" />
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
        {saved && (
          <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 500 }}>Saqlandi ✓</span>
        )}
        <button
          type="button"
          onClick={handleCancel}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(240,238,255,0.45)',
            padding: '10px 20px',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Bekor qilish
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            background: '#7c6bff',
            border: 'none',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: saving ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            opacity: saving ? 0.75 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {!saving && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </div>
  )
}