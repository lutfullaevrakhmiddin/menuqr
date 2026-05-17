"use client"
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: string
  name: string
  sortOrder: number
  isActive: boolean
}

type MenuItem = {
  id: string
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  isAvailable: boolean
  sortOrder: number
  category: { id: string; name: string }
}

const FOOD_EMOJI = ['🍕', '🍔', '🌮', '🍜', '🍣', '🥗', '🍖', '🥘', '🍲', '🥩', '🍗', '🥪']

function emojiFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return FOOD_EMOJI[Math.abs(hash) % FOOD_EMOJI.length]
}

export default function MenuPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [showAddCat, setShowAddCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [addingCat, setAddingCat] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [catRes, itemRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/menu-items'),
        ])
        const catData = await catRes.json()
        const itemData = await itemRes.json()
        if (catData.success) setCategories(catData.categories)
        if (itemData.success) setMenuItems(itemData.menuItems)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory ? item.category.id === selectedCategory : true
      const matchSearch = search
        ? item.name.toLowerCase().includes(search.toLowerCase())
        : true
      return matchCat && matchSearch
    })
  }, [menuItems, selectedCategory, search])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/menu-items/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMenuItems(prev => prev.filter(i => i.id !== id))
        setConfirmDeleteId(null)
      }
    } finally {
      setDeletingId(null)
    }
  }

  async function handleAddCategory() {
    if (!newCatName.trim()) return
    setAddingCat(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() }),
      })
      const data = await res.json()
      if (data.success) {
        setCategories(prev => [...prev, data.category])
        setNewCatName('')
        setShowAddCat(false)
      }
    } finally {
      setAddingCat(false)
    }
  }

  const catCount = (id: string) => menuItems.filter(i => i.category.id === id).length

  return (
    <div style={{ fontFamily: "'Cabinet Grotesk',sans-serif", color: '#f0eeff' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .menu-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }

        .menu-cats-panel {
          width: 220px;
          flex-shrink: 0;
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 12px;
          overflow: hidden;
          animation: fadeUp .35s ease both;
          position: sticky;
          top: 20px;
        }

        .menu-cats-mobile {
          display: none;
        }

        .cat-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          cursor: pointer;
          font-size: 13.5px;
          color: rgba(240,238,255,.5);
          border-left: 3px solid transparent;
          transition: all .15s;
        }
        .cat-item:hover { background: rgba(124,107,255,.06); color: #f0eeff; }
        .cat-item.active {
          color: #f0eeff;
          background: rgba(124,107,255,.1);
          border-left-color: #7c6bff;
        }
        .cat-count {
          font-size: 11px;
          padding: 2px 7px;
          border-radius: 10px;
          background: rgba(255,255,255,.06);
          color: rgba(240,238,255,.35);
        }
        .cat-item.active .cat-count {
          background: rgba(124,107,255,.2);
          color: #7c6bff;
        }

        .menu-main { flex: 1; min-width: 0; }

        .menu-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-input {
          flex: 1;
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 9px;
          padding: 10px 14px 10px 38px;
          color: #f0eeff;
          font-size: 14px;
          font-family: 'Cabinet Grotesk', sans-serif;
          outline: none;
          transition: border-color .15s;
          min-height: 44px;
        }
        .search-input::placeholder { color: rgba(240,238,255,.25); }
        .search-input:focus { border-color: rgba(124,107,255,.4); }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          background: #7c6bff;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: background .15s;
          white-space: nowrap;
          min-height: 44px;
        }
        .btn-primary:hover { background: #6a5ae0; }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          animation: fadeUp .4s ease both;
        }

        .item-card {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 12px;
          overflow: hidden;
          transition: all .2s;
          display: flex;
          flex-direction: column;
        }
        .item-card:hover {
          border-color: rgba(255,255,255,.1);
          transform: translateY(-2px);
        }

        .item-img {
          width: 100%;
          aspect-ratio: 16/10;
          background: rgba(255,255,255,.03);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          border-bottom: 1px solid rgba(255,255,255,.04);
          overflow: hidden;
          position: relative;
        }
        .item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
        }

        .item-body {
          padding: 14px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-name {
          font-size: 14px;
          font-weight: 600;
          color: #f0eeff;
          line-height: 1.3;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .item-cat-badge {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 6px;
          background: rgba(124,107,255,.1);
          color: rgba(124,107,255,.9);
          width: fit-content;
        }

        .item-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,.04);
        }

        .item-price {
          font-size: 15px;
          font-weight: 700;
          color: #f0eeff;
          font-family: 'Clash Display', sans-serif;
        }

        .badge-active {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 20px;
          background: rgba(34,197,94,.12);
          color: #22c55e;
          border: 1px solid rgba(34,197,94,.2);
        }
        .badge-inactive {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 20px;
          background: rgba(255,255,255,.05);
          color: rgba(240,238,255,.3);
          border: 1px solid rgba(255,255,255,.08);
        }

        .item-actions {
          display: flex;
          gap: 6px;
          padding: 10px 14px 14px;
        }

        .btn-edit {
          flex: 1;
          padding: 7px 0;
          background: rgba(124,107,255,.1);
          color: #7c6bff;
          border: 1px solid rgba(124,107,255,.2);
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 36px;
        }
        .btn-edit:hover { background: rgba(124,107,255,.18); }

        .btn-delete {
          flex: 1;
          padding: 7px 0;
          background: rgba(255,80,80,.08);
          color: rgba(255,100,100,.8);
          border: 1px solid rgba(255,80,80,.15);
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 36px;
        }
        .btn-delete:hover { background: rgba(255,80,80,.14); }
        .btn-delete:disabled { opacity: .5; cursor: default; }

        .btn-delete-confirm {
          flex: 1;
          padding: 7px 0;
          background: rgba(255,80,80,.18);
          color: #ff6464;
          border: 1px solid rgba(255,80,80,.3);
          border-radius: 7px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 36px;
        }

        .btn-cancel {
          padding: 7px 10px;
          background: rgba(255,255,255,.05);
          color: rgba(240,238,255,.4);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 7px;
          font-size: 12.5px;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          transition: all .15s;
          min-height: 36px;
        }
        .btn-cancel:hover { background: rgba(255,255,255,.08); }

        .empty-state {
          grid-column: 1 / -1;
          padding: 60px 20px;
          text-align: center;
          color: rgba(240,238,255,.25);
        }

        .add-cat-form {
  padding: 8px;
  border-top: 1px solid rgba(255,255,255,.06);
  display: flex;
  gap: 4px;
  align-items: center;
  overflow: visible;
  width: 100%;
}
        .add-cat-input {
          flex: 1;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 7px;
          padding: 7px 10px;
          color: #f0eeff;
          font-size: 13px;
          font-family: 'Cabinet Grotesk', sans-serif;
          outline: none;
        }
        .add-cat-input:focus { border-color: rgba(124,107,255,.4); }
        .add-cat-input::placeholder { color: rgba(240,238,255,.25); }

.btn-add-cat {
  padding: 7px 6px;
  background: #7c6bff;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 11px;
  cursor: pointer;
  font-family: 'Cabinet Grotesk', sans-serif;
  flex-shrink: 0;
  width: 26px;
}

        .btn-add-cat:disabled { opacity: .6; cursor: default; }

        .btn-show-add-cat {
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          border-top: 1px solid rgba(255,255,255,.06);
          color: rgba(124,107,255,.7);
          font-size: 13px;
          cursor: pointer;
          font-family: 'Cabinet Grotesk', sans-serif;
          text-align: left;
          transition: color .15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .btn-show-add-cat:hover { color: #7c6bff; }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .skeleton {
          background: #0d0d1a;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 12px;
          height: 220px;
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: .4; }
          50% { opacity: .7; }
        }

        /* Mobile: horizontal tabs */
        @media (max-width: 768px) {
          .menu-layout { flex-direction: column; gap: 0; }
          .menu-cats-panel { display: none; }
          .menu-cats-mobile {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 0 0 12px;
            margin-bottom: 16px;
            scrollbar-width: none;
          }
          .menu-cats-mobile::-webkit-scrollbar { display: none; }
          .cat-tab {
            flex-shrink: 0;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 13px;
            cursor: pointer;
            border: 1px solid rgba(255,255,255,.08);
            background: #0d0d1a;
            color: rgba(240,238,255,.5);
            white-space: nowrap;
            font-family: 'Cabinet Grotesk', sans-serif;
            transition: all .15s;
            min-height: 38px;
          }
          .cat-tab.active {
            background: rgba(124,107,255,.15);
            border-color: rgba(124,107,255,.3);
            color: #7c6bff;
          }
          .items-grid { grid-template-columns: repeat(2, 1fr); }
          .loading-grid { grid-template-columns: repeat(2, 1fr); }
          .menu-top { flex-wrap: wrap; }
        }

        @media (max-width: 480px) {
          .items-grid { grid-template-columns: 1fr; }
          .loading-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Page header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, animation: 'fadeUp .3s ease both',
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            fontFamily: "'Clash Display',sans-serif", letterSpacing: -.3,
          }}>
            Menyu boshqaruvi
          </h1>
          <div style={{ fontSize: 13, color: 'rgba(240,238,255,.35)', marginTop: 4 }}>
            {menuItems.length} ta taom · {categories.length} ta kategoriya
          </div>
        </div>
        <button className="btn-primary" onClick={() => router.push('/dashboard/menu/new')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/>
          </svg>
          Taom qo&apos;shish
        </button>
      </div>

      {/* Mobile category tabs */}
      <div className="menu-cats-mobile">
        <button
          className={`cat-tab${selectedCategory === null ? ' active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          Barchasi ({menuItems.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`cat-tab${selectedCategory === cat.id ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name} ({catCount(cat.id)})
          </button>
        ))}
      </div>

      <div className="menu-layout">
        {/* Desktop categories sidebar */}
        <aside className="menu-cats-panel">
          <div style={{
            padding: '14px 14px 10px',
            fontSize: 11, fontWeight: 500, letterSpacing: 1.4,
            textTransform: 'uppercase' as const,
            color: 'rgba(240,238,255,.25)',
          }}>
            Kategoriyalar
          </div>

          <div
            className={`cat-item${selectedCategory === null ? ' active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            <span>Barchasi</span>
            <span className="cat-count">{menuItems.length}</span>
          </div>

          {categories.map(cat => (
            <div
              key={cat.id}
              className={`cat-item${selectedCategory === cat.id ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                {cat.name}
              </span>
              <span className="cat-count" style={{ marginLeft: 6, flexShrink: 0 }}>{catCount(cat.id)}</span>
            </div>
          ))}

          {showAddCat ? (
              <div style={{padding:'10px 12px',borderTop:'1px solid rgba(255,255,255,.06)'}}>
                <input
                    className="add-cat-input"
                    placeholder="Kategoriya nomi..."
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddCategory()
                      if (e.key === 'Escape') { setShowAddCat(false); setNewCatName('') }
                    }}
                    autoFocus
                    style={{width:'100%',marginBottom:8}}
                />
                <div style={{display:'flex',gap:6}}>
                  <button
                      onClick={() => { setShowAddCat(false); setNewCatName('') }}
                      style={{flex:1,background:'rgba(255,255,255,.06)',color:'rgba(240,238,255,.6)',border:'none',borderRadius:7,padding:'8px',fontSize:13,cursor:'pointer'}}
                  >
                    Bekor
                  </button>
                  <button
                      onClick={handleAddCategory}
                      disabled={addingCat}
                      style={{flex:1,background:'#7c6bff',color:'#fff',border:'none',borderRadius:7,padding:'8px',fontSize:13,cursor:'pointer',fontFamily:"'Cabinet Grotesk',sans-serif"}}
                  >
                    {addingCat ? 'Saqlanmoqda...' : 'Saqlash'}
                  </button>
                </div>
              </div>
          ) : (
            <button className="btn-show-add-cat" onClick={() => setShowAddCat(true)}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="6" y1="1" x2="6" y2="11"/><line x1="1" y1="6" x2="11" y2="6"/>
              </svg>
              Kategoriya qo&apos;shish
            </button>
          )}
        </aside>

        {/* Items area */}
        <div className="menu-main">
          {/* Search */}
          <div className="menu-top">
            <div style={{ position: 'relative', flex: 1 }}>
              <svg
                width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,.3)', pointerEvents: 'none' }}
              >
                <circle cx="6.5" cy="6.5" r="5"/>
                <line x1="10" y1="10" x2="14" y2="14"/>
              </svg>
              <input
                className="search-input"
                placeholder="Taom qidirish..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {search && (
              <div style={{ fontSize: 13, color: 'rgba(240,238,255,.35)', whiteSpace: 'nowrap' }}>
                {filtered.length} natija
              </div>
            )}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="loading-grid">
              {[0,1,2,3,4,5].map(i => (
                <div key={i} className="skeleton" style={{ animationDelay: `${i * .1}s` }}/>
              ))}
            </div>
          ) : (
            <div className="items-grid">
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <div style={{ fontSize: 44, marginBottom: 12 }}>🍽️</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(240,238,255,.4)', marginBottom: 6 }}>
                    {search || selectedCategory ? 'Hech narsa topilmadi' : 'Hali taom qo\'shilmagan'}
                  </div>
                  {!search && !selectedCategory && (
                    <button
                      className="btn-primary"
                      style={{ margin: '12px auto 0', display: 'flex' }}
                      onClick={() => router.push('/dashboard/menu/new')}
                    >
                      Birinchi taomni qo&apos;shing
                    </button>
                  )}
                </div>
              ) : (
                filtered.map((item, i) => (
                  <div key={item.id} className="item-card" style={{ animationDelay: `${i * .05}s` }}>
                    <div className="item-img">
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name}/>
                        : <span>{emojiFor(item.name)}</span>
                      }
                    </div>

                    <div className="item-body">
                      <div className="item-name">{item.name}</div>
                      <div className="item-cat-badge">{item.category.name}</div>
                      <div className="item-footer">
                        <div className="item-price">
                          {parseFloat(item.price).toLocaleString()} so&apos;m
                        </div>
                        <span className={item.isAvailable ? 'badge-active' : 'badge-inactive'}>
                          {item.isAvailable ? 'Mavjud' : 'Tugagan'}
                        </span>
                      </div>
                    </div>

                    <div className="item-actions">
                      {confirmDeleteId === item.id ? (
                        <>
                          <button
                            className="btn-delete-confirm"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? '...' : "O'chirish"}
                          </button>
                          <button className="btn-cancel" onClick={() => setConfirmDeleteId(null)}>
                            Bekor
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn-edit" onClick={() => router.push(`/dashboard/menu/${item.id}/edit`)}>
                            Tahrirlash
                          </button>
                          <button className="btn-delete" onClick={() => setConfirmDeleteId(item.id)}>
                            O&apos;chirish
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
