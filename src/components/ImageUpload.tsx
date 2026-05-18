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

      <div style={{
        background: '#0d0d1a',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10,
        overflow: 'hidden',
      }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['url', 'upload'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError('') }}
              style={{
                padding: '10px 16px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: tab === t ? 'rgba(124,107,255,0.12)' : 'transparent',
                color: tab === t ? '#7c6bff' : 'rgba(240,238,255,0.45)',
                borderBottom: tab === t ? '2px solid #7c6bff' : '2px solid transparent',
                transition: 'all .15s',
                fontFamily: 'inherit',
              }}
            >
              {t === 'url' ? 'URL' : 'Yuklash'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ padding: 14 }}>
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
            <>
              <div
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{
                  border: `2px dashed ${isDragOver ? 'rgba(124,107,255,0.6)' : 'rgba(124,107,255,0.3)'}`,
                  borderRadius: 8,
                  padding: 24,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragOver ? 'rgba(124,107,255,0.05)' : 'transparent',
                  transition: 'all .15s',
                }}
              >
                {uploading ? (
                  <div style={{ color: 'rgba(240,238,255,0.6)', fontSize: 13 }}>
                    Yuklanmoqda...
                  </div>
                ) : (
                  <>
                    <div style={{ color: 'rgba(240,238,255,0.5)', fontSize: 13, marginBottom: 4 }}>
                      Faylni bu yerga tashlang yoki
                    </div>
                    <div style={{ color: '#7c6bff', fontSize: 13, fontWeight: 500 }}>
                      tanlash uchun bosing
                    </div>
                    <div style={{ color: 'rgba(240,238,255,0.3)', fontSize: 11, marginTop: 6 }}>
                      JPEG, PNG, WebP, GIF — maks 5MB
                    </div>
                  </>
                )}
              </div>
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
            </>
          )}

          {error && (
            <div style={{ color: '#f87171', fontSize: 12, marginTop: 6 }}>{error}</div>
          )}
        </div>

        {/* Preview */}
        {value && (
          <div style={{ padding: '0 14px 14px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="preview"
              style={{
                width: '100%',
                maxHeight: 200,
                objectFit: 'cover',
                borderRadius: 8,
                display: 'block',
              }}
            />
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                marginTop: 8,
                background: 'rgba(239,68,68,0.1)',
                color: '#f87171',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              O&apos;chirish
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
