"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

type Category = {
  id: string
  name: string
}

type FormErrors = {
  name?: string
  price?: string
  submit?: string
}

export default function NewMenuItemPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isAvailable, setIsAvailable] = useState(false)
  const [sortOrder, setSortOrder] = useState('')

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.categories.length > 0) {
          setCategories(d.categories)
          const boshqa = d.categories.find((c: Category) => c.name === 'Boshqa')
          setCategoryId(boshqa ? boshqa.id : d.categories[0].id)
        }
      })
  }, [])

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Taom nomi kiritilishi shart'
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      errs.price = 'To\'g\'ri narx kiritilishi shart'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          price: parseFloat(price),
          categoryId,
          imageUrl: imageUrl.trim() || undefined,
          isAvailable,
          sortOrder: sortOrder.trim() ? parseInt(sortOrder) : 0,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/dashboard/menu')
      } else {
        setErrors({ submit: Array.isArray(data.error) ? 'Ma\'lumotlar noto\'g\'ri' : (data.error ?? 'Xatolik yuz berdi') })
      }
    } catch {
      setErrors({ submit: 'Server xatosi. Qayta urinib ko\'ring.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", color: '#f0eeff' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .form-card {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 14px;
          overflow: hidden;
          animation: fadeUp .35s ease both;
          max-width: 800px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 28px;
        }

        .field { display: flex; flex-direction: column; gap: 7px; }
        .field-full { grid-column: 1 / -1; }

        .field-label {
          font-size: 12.5px;
          font-weight: 500;
          color: rgba(240,238,255,.5);
          letter-spacing: .2px;
        }
        .field-label span { color: rgba(255,100,100,.8); margin-left: 2px; }

        .field-input {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          padding: 11px 14px;
          color: #f0eeff;
          font-size: 14px;
          font-family: 'Cabinet Grotesk', sans-serif;
          outline: none;
          transition: border-color .15s;
          min-height: 44px;
        }
        .field-input::placeholder { color: rgba(240,238,255,.2); }
        .field-input:focus { border-color: rgba(124,107,255,.45); }
        .field-input.error { border-color: rgba(255,80,80,.4); }

        .field-textarea {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          padding: 11px 14px;
          color: #f0eeff;
          font-size: 14px;
          font-family: 'Cabinet Grotesk', sans-serif;
          outline: none;
          transition: border-color .15s;
          resize: vertical;
          min-height: 80px;
          width: 100%;
          box-sizing: border-box;
        }
        .field-textarea::placeholder { color: rgba(240,238,255,.2); }
        .field-textarea:focus { border-color: rgba(124,107,255,.45); }

        .field-select {
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          padding: 11px 14px;
          color: #f0eeff;
          font-size: 14px;
          font-family: 'Cabinet Grotesk', sans-serif;
          outline: none;
          cursor: pointer;
          min-height: 44px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='rgba(240,238,255,0.3)' fill='none' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
          transition: border-color .15s;
        }
        .field-select:focus { border-color: rgba(124,107,255,.45); }
        .field-select option { background: #0d0d1a; color: #f0eeff; }

        .error-msg {
          font-size: 12px;
          color: rgba(255,100,100,.85);
          margin-top: 2px;
        }

        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgba(255,255,255,.02);
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 9px;
          min-height: 44px;
        }
        .toggle-label {
          font-size: 13.5px;
          color: rgba(240,238,255,.7);
        }
        .toggle-track {
          width: 42px;
          height: 24px;
          border-radius: 12px;
          background: rgba(255,255,255,.1);
          position: relative;
          cursor: pointer;
          transition: background .2s;
          flex-shrink: 0;
        }
        .toggle-track.on { background: #7c6bff; }
        .toggle-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: transform .2s;
          box-shadow: 0 1px 4px rgba(0,0,0,.3);
        }
        .toggle-track.on .toggle-thumb { transform: translateX(18px); }

        .form-footer {
          padding: 20px 28px;
          border-top: 1px solid rgba(255,255,255,.06);
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 24px;
          background: #7c6bff;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: background .15s;
          min-height: 44px;
        }
        .btn-primary:hover:not(:disabled) { background: #6a5ae0; }
        .btn-primary:disabled { opacity: .6; cursor: default; }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 11px 18px;
          background: rgba(255,255,255,.05);
          color: rgba(240,238,255,.55);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 44px;
        }
        .btn-back:hover { background: rgba(255,255,255,.08); color: #f0eeff; }

        .submit-error {
          flex: 1;
          font-size: 13px;
          color: rgba(255,100,100,.85);
          padding: 10px 14px;
          background: rgba(255,80,80,.08);
          border: 1px solid rgba(255,80,80,.15);
          border-radius: 8px;
        }

        /* Mobile sticky footer */
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; padding: 20px; }
          .field-full { grid-column: 1; }
          .form-footer {
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: #0d0d1a;
            border-top: 1px solid rgba(255,255,255,.08);
            padding: 14px 20px;
            z-index: 50;
            flex-wrap: wrap;
          }
          .form-card { padding-bottom: 80px; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: 24, animation: 'fadeUp .3s ease both',
      }}>
        <button className="btn-back" onClick={() => router.push('/dashboard/menu')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2L4 7l5 5"/>
          </svg>
          Orqaga
        </button>
        <div>
          <h1 style={{
            margin: 0, fontSize: 20, fontWeight: 700,
            fontFamily: "'Clash Display',sans-serif", letterSpacing: -.3,
          }}>
            Yangi taom qo&apos;shish
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-card">
          <div className="form-grid">

            {/* Name */}
            <div className="field">
              <label className="field-label">
                Taom nomi <span>*</span>
              </label>
              <input
                className={`field-input${errors.name ? ' error' : ''}`}
                placeholder="Masalan: Osh, Lag'mon..."
                value={name}
                onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({...p, name: undefined})) }}
              />
              {errors.name && <div className="error-msg">{errors.name}</div>}
            </div>

            {/* Price */}
            <div className="field">
              <label className="field-label">
                Narxi (so&apos;m) <span>*</span>
              </label>
              <input
                className={`field-input${errors.price ? ' error' : ''}`}
                type="number"
                placeholder="25000"
                min="0"
                step="100"
                value={price}
                onChange={e => { setPrice(e.target.value); if (errors.price) setErrors(p => ({...p, price: undefined})) }}
              />
              {errors.price && <div className="error-msg">{errors.price}</div>}
            </div>

            {/* Description */}
            <div className="field field-full">
              <label className="field-label">Tavsif</label>
              <textarea
                className="field-textarea"
                placeholder="Taom haqida qisqacha ma'lumot..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="field">
              <label className="field-label">Kategoriya</label>
              <select
                className="field-select"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Sort order */}
            <div className="field">
              <label className="field-label">Tartib raqami</label>
              <input
                className="field-input"
                type="number"
                placeholder="0"
                min="0"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
              />
            </div>

            {/* Image */}
            <div className="field field-full">
              <ImageUpload value={imageUrl} onChange={setImageUrl} label="Rasm" />
            </div>

            {/* isAvailable toggle */}
            <div className="field field-full">
              <label className="field-label">Holati</label>
              <div className="toggle-row">
                <span className="toggle-label" style={{color: isAvailable ? '#22c55e' : '#ff6b9d'}}>
  {isAvailable ? '✓ Mavjud — mijozlar ko\'ra oladi' : '✕ Tugagan — mijozlar ko\'ra olmaydi'}
</span>
                <div
                  className={`toggle-track${isAvailable ? ' on' : ''}`}
                  onClick={() => setIsAvailable(p => !p)}
                  role="switch"
                  aria-checked={isAvailable}
                >
                  <div className="toggle-thumb"/>
                </div>
              </div>
            </div>

          </div>

          <div className="form-footer">
            {errors.submit && <div className="submit-error">{errors.submit}</div>}
            <button type="button" className="btn-back" onClick={() => router.push('/dashboard/menu')}>
              Bekor qilish
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.9 2.9l1.4 1.4M9.7 9.7l1.4 1.4M2.9 11.1l1.4-1.4M9.7 4.3l1.4-1.4"/>
                  </svg>
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 7l3.5 3.5L12 3"/>
                  </svg>
                  Saqlash
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
