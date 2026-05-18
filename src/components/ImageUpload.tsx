"use client"
import { useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
}

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_SIZE = 5 * 1024 * 1024

export default function ImageUpload({ value, onChange, label }: Props) {
  const [tab, setTab] = useState<'url' | 'upload'>('url')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Faqat JPEG, PNG, WebP, GIF ruxsat etilgan')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('Fayl hajmi 5MB dan oshmasligi kerak')
      return
    }
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        onChange(data.url)
      } else {
        setError(data.error ?? 'Yuklashda xato')
      }
    } catch {
      setError('Server xatosi')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <div style={{
          fontSize: 12.5,
          fontWeight: 500,
          color: 'rgba(240,238,255,.5)',
          letterSpacing: '.2px',
        }}>
          {label}
        </div>
      )}

      {/* Tabs row — pill/underline style, no outer box */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {(['url', 'upload'] as const).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError('') }}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              border: 'none',
              background: tab === t ? 'rgba(124,107,255,0.12)' : 'transparent',
              color: tab === t ? '#7c6bff' : 'rgba(240,238,255,0.45)',
              borderBottom: tab === t ? '2px solid #7c6bff' : '2px solid transparent', marginBottom: -1,
              transition: 'all .15s',
              fontFamily: 'inherit',
            }}
          >
            {t === 'url' ? 'URL' : 'Yuklash'}
          </button>
        ))}
      </div>

      {/* Always-present hidden file input — used by both upload area and Almashtirish button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />

      {/* Two-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Left column: URL input or drag&drop */}
        <div>
          {tab === 'url' ? (
            <input
              type="text"
              placeholder="https://...          Google → Copy image address → paste here"
              value={value}
              onChange={e => onChange(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '10px 14px',
                color: '#f0eeff',
                fontSize: 14,
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          ) : (
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                border: `2px dashed ${isDragOver ? 'rgba(124,107,255,0.6)' : 'rgba(124,107,255,0.3)'}`,
                borderRadius: 10,
                padding: '32px 16px',
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: isDragOver ? 'rgba(124,107,255,0.07)' : 'rgba(124,107,255,0.03)',
                cursor: 'pointer',
                transition: 'all .15s',
                boxSizing: 'border-box',
              }}
            >
              {uploading ? (
                <div style={{ color: 'rgba(240,238,255,0.6)', fontSize: 13 }}>Yuklanmoqda...</div>
              ) : (
                <>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(124,107,255,0.5)" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                  <div style={{ color: 'rgba(240,238,255,0.5)', fontSize: 13 }}>
                    Faylni bu yerga tashlang yoki
                  </div>
                  <div style={{ color: '#7c6bff', fontSize: 13, fontWeight: 500, textDecoration: 'underline' }}>
                    tanlash uchun bosing
                  </div>
                  <div style={{ color: 'rgba(240,238,255,0.25)', fontSize: 11 }}>
                    JPEG, PNG, WebP, GIF — max 5MB
                  </div>
                </>
              )}
            </div>
          )}
          {error && (
            <div style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{error}</div>
          )}
        </div>

        {/* Right column: empty placeholder or image preview */}
        {!value ? (
          <div style={{
            border: '1px dashed rgba(255,255,255,0.06)',
            borderRadius: 10,
            minHeight: 180,
            background: '#0d0d1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="rgba(240,238,255,0.2)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <div style={{ color: 'rgba(240,238,255,0.2)', fontSize: 13 }}>
              Rasm yo&apos;q
            </div>
          </div>
        ) : (
          <div style={{
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="preview"
              style={{
                width: '100%',
                objectFit: 'cover',
                height: 180,
                display: 'block',
              }}
            />
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              padding: 10,
              background: '#0d0d1a',
            }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{
                  background: 'rgba(124,107,255,0.12)',
                  border: '1px solid rgba(124,107,255,0.2)',
                  color: '#a99fff',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
                Almashtirish
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                O&apos;chirish
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
