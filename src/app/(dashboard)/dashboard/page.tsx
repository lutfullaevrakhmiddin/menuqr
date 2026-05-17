"use client"
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'


type Stat = {
    label: string
    value: string
    sub: string
    icon: string  // ← shu qatorni o'zgartiring
    color: string
    bg: string
    border: string
}

const STATS = [
  {
    label: 'Bugungi skanlar',
    value: '0',
    sub: 'bugun',
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="3" y="14" width="7" height="7"/>
          <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
          <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none"/>
          <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none"/>
          <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/>
        </svg>
    ),
    color: '#7c6bff',
    bg: 'rgba(124,107,255,.1)',
    border: 'rgba(124,107,255,.2)',
  },
  {
    label: 'Jami stollar',
    value: '0',
    sub: 'stol',
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7h18M3 7v13M21 7v13M7 7V4h10v3"/>
          <path d="M7 20v-4h10v4"/>
        </svg>
    ),
    color: '#22c55e',
    bg: 'rgba(34,197,94,.1)',
    border: 'rgba(34,197,94,.2)',
  },
  {
    label: 'Menyu taomlar',
    value: '0',
    sub: 'taom',
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 11l19-9-9 19-2-8-8-2z"/>
        </svg>
    ),
    color: '#f472b6',
    bg: 'rgba(244,114,182,.1)',
    border: 'rgba(244,114,182,.2)',
  },
  {
    label: 'Kategoriyalar',
    value: '0',
    sub: 'kategoriya',
    icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
    ),
    color: '#f59e0b',
    bg: 'rgba(245,158,11,.1)',
    border: 'rgba(245,158,11,.2)',
  },
]

const QUICK_ACTIONS = [
  { label: "QR yuklab olish",   icon: '⬇️', href: '/dashboard/tables',     desc: "QR kodlarni yuklab ol"  },
  { label: "Taom qo'shish",     icon: '➕', href: '/dashboard/menu/new',   desc: "Yangi taom qo'sh"       },
  { label: "Stol qo'shish",     icon: '🪑', href: '/dashboard/tables/new', desc: "Yangi stol yaratish"    },
  { label: "Menyuni ko'rish",   icon: '👁️', href: '/dashboard/menu',       desc: "Umumiy menyuni ko'r"    },
]

export default function DashboardPage() {
  const router = useRouter();
    const [userName, setUserName] = useState('')

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(d => setUserName(d.name || ''))
    }, [])

    useEffect(() => {
        const svg = document.getElementById('crown-svg')
        // ... toj kodi
    }, [])
    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(d => setUserName(d.name || ''))
    }, [])

    useEffect(() => {
        const svg = document.getElementById('crown-svg')
        // ... toj kodi
    }, [])
    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.json())
            .then(d => setUserName(d.name || ''))
    }, [])

  return (
    <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:'#f0eeff' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .dash-stat {
          background:#0d0d1a;
          border:1px solid rgba(255,255,255,.06);
          border-radius:12px; padding:20px;
          transition:all .2s; animation:fadeUp .45s ease both;
        }
        .dash-stat:hover {
          border-color:rgba(255,255,255,.11);
          transform:translateY(-2px);
        }

        .dash-qa {
          background:#0d0d1a;
          border:1px solid rgba(255,255,255,.06);
          border-radius:10px; padding:16px 18px;
          cursor:pointer; text-align:left; width:100%;
          transition:all .2s; animation:fadeUp .45s ease both;
          font-family:'Cabinet Grotesk',sans-serif;
        }
        .dash-qa:hover {
          border-color:rgba(124,107,255,.3);
          background:rgba(124,107,255,.05);
          transform:translateY(-2px);
        }

        .dash-panel {
          background:#0d0d1a;
          border:1px solid rgba(255,255,255,.06);
          border-radius:12px; overflow:hidden;
          animation:fadeUp .5s ease both;
        }
        .dash-panel-hdr {
          padding:14px 20px;
          border-bottom:1px solid rgba(255,255,255,.06);
          font-size:13.5px; font-weight:500; color:#f0eeff;
        }
        .dash-empty {
          padding:48px 20px; text-align:center;
          color:rgba(240,238,255,.3); font-size:13px; line-height:1.8;
        }
        .dash-empty-btn {
          margin-top:14px; padding:7px 16px; border-radius:7px;
          border:1px solid rgba(124,107,255,.3);
          background:rgba(124,107,255,.08);
          color:#7c6bff; font-size:12px; cursor:pointer;
          font-family:'Cabinet Grotesk',sans-serif; transition:all .18s;
        }
        .dash-empty-btn:hover { background:rgba(124,107,255,.15); }

        @media (max-width:900px) {
          .stats-grid   { grid-template-columns:1fr 1fr !important; }
          .actions-grid { grid-template-columns:1fr 1fr !important; }
          .bottom-grid  { grid-template-columns:1fr !important; }
        }
        @media (max-width:500px) {
          .stats-grid   { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* Welcome banner */}
      <div style={{
        marginBottom:28, padding:'22px 26px', borderRadius:14,
        background:'linear-gradient(135deg,rgba(124,107,255,.09) 0%,rgba(201,168,76,.06) 100%)',
        border:'1px solid rgba(124,107,255,.16)',
        position:'relative', overflow:'hidden',
        animation:'fadeUp .35s ease both',
      }}>
        <div style={{
          position:'absolute', top:0, right:0, bottom:0, width:'45%',
          background:'radial-gradient(ellipse at right,rgba(201,168,76,.07) 0%,transparent 70%)',
          pointerEvents:'none',
        }}/>
        <div style={{
          fontSize:20, fontWeight:700,
          fontFamily:"'Clash Display',sans-serif",
          marginBottom:6, letterSpacing:-.3,
        }}>
            Xush kelibsiz, <span style={{color:'#7c6bff'}}>{userName}</span>
            <svg width="28" height="24" viewBox="0 0 120 100" fill="none" style={{marginLeft:8,verticalAlign:'middle',display:'inline-block'}}>
                <circle cx="10" cy="94" r="3" fill="#4A3800"/>
                <circle cx="22" cy="94" r="3" fill="#4A3800"/>
                <circle cx="34" cy="94" r="3" fill="#4A3800"/>
                <circle cx="46" cy="94" r="3" fill="#5C4800"/>
                <circle cx="58" cy="94" r="3" fill="#5C4800"/>
                <circle cx="70" cy="94" r="3" fill="#5C4800"/>
                <circle cx="82" cy="94" r="3" fill="#4A3800"/>
                <circle cx="94" cy="94" r="3" fill="#4A3800"/>
                <circle cx="106" cy="94" r="3" fill="#4A3800"/>
                <circle cx="10" cy="82" r="3.2" fill="#7A5C00"/>
                <circle cx="22" cy="82" r="3.2" fill="#7A5C00"/>
                <circle cx="34" cy="82" r="3.2" fill="#8B6914"/>
                <circle cx="46" cy="82" r="3.2" fill="#9A7B1A"/>
                <circle cx="58" cy="82" r="3.2" fill="#9A7B1A"/>
                <circle cx="70" cy="82" r="3.2" fill="#9A7B1A"/>
                <circle cx="82" cy="82" r="3.2" fill="#8B6914"/>
                <circle cx="94" cy="82" r="3.2" fill="#7A5C00"/>
                <circle cx="106" cy="82" r="3.2" fill="#7A5C00"/>
                <circle cx="10" cy="70" r="3.5" fill="#B8960C"/>
                <circle cx="22" cy="70" r="3.5" fill="#B8960C"/>
                <circle cx="34" cy="70" r="3.5" fill="#C9A84C"/>
                <circle cx="46" cy="70" r="3.5" fill="#C9A84C"/>
                <circle cx="58" cy="70" r="3.5" fill="#D4AF37"/>
                <circle cx="70" cy="70" r="3.5" fill="#C9A84C"/>
                <circle cx="82" cy="70" r="3.5" fill="#C9A84C"/>
                <circle cx="94" cy="70" r="3.5" fill="#B8960C"/>
                <circle cx="106" cy="70" r="3.5" fill="#B8960C"/>
                <circle cx="10" cy="56" r="3.5" fill="#C9A84C"/>
                <circle cx="22" cy="62" r="3.5" fill="#C9A84C"/>
                <circle cx="34" cy="66" r="3.5" fill="#D4AF37"/>
                <circle cx="46" cy="58" r="3.5" fill="#D4AF37"/>
                <circle cx="58" cy="54" r="3.8" fill="#E8C97A"/>
                <circle cx="70" cy="58" r="3.5" fill="#D4AF37"/>
                <circle cx="82" cy="66" r="3.5" fill="#D4AF37"/>
                <circle cx="94" cy="62" r="3.5" fill="#C9A84C"/>
                <circle cx="106" cy="56" r="3.5" fill="#C9A84C"/>
                <circle cx="10" cy="42" r="3.8" fill="#D4AF37"/>
                <circle cx="22" cy="50" r="3.5" fill="#C9A84C"/>
                <circle cx="46" cy="44" r="3.8" fill="#E8C97A"/>
                <circle cx="58" cy="38" r="4" fill="#F5DEB3"/>
                <circle cx="70" cy="44" r="3.8" fill="#E8C97A"/>
                <circle cx="94" cy="50" r="3.5" fill="#C9A84C"/>
                <circle cx="106" cy="42" r="3.8" fill="#D4AF37"/>
                <circle cx="10" cy="28" r="4.5" fill="#E8C97A"/>
                <circle cx="58" cy="18" r="5.5" fill="#FFF8D0"/>
                <circle cx="106" cy="28" r="4.5" fill="#E8C97A"/>
                <circle cx="58" cy="6" r="5" fill="#FFFACD"/>
            </svg>
        </div>
        <div style={{ fontSize:13, color:'rgba(240,238,255,.45)' }}>
          Bugun <strong style={{ color:'#7c6bff' }}>0 ta</strong> QR skan qilindi
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{
        display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24,
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} className="dash-stat" style={{ animationDelay:`${i * .07}s` }}>
            <div style={{
              width:38, height:38, borderRadius:9,
              background:s.bg, border:`1px solid ${s.border}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, marginBottom:14,
            }}>
              {s.icon}
            </div>
            <div style={{
              fontSize:30, fontWeight:800,
              fontFamily:"'Clash Display',sans-serif",
              color:s.color, lineHeight:1,
            }}>
              {s.value}
            </div>
            <div style={{ fontSize:12, color:'rgba(240,238,255,.4)', marginTop:5 }}>{s.label}</div>
            <div style={{ fontSize:11, color:'rgba(240,238,255,.22)', marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom:24 }}>
        <div style={{
          fontSize:11, fontWeight:500, letterSpacing:1.5,
          textTransform:'uppercase' as const,
          color:'rgba(240,238,255,.3)', marginBottom:12,
        }}>
          Tezkor amallar
        </div>
        <div className="actions-grid" style={{
          display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12,
        }}>
          {QUICK_ACTIONS.map((a, i) => (
            <button
              key={a.label}
              className="dash-qa"
              onClick={() => router.push(a.href)}
              style={{ animationDelay:`${.18 + i * .07}s` }}
            >
              <div style={{ fontSize:22, marginBottom:9 }}>{a.icon}</div>
              <div style={{ fontSize:13.5, fontWeight:500, color:'#f0eeff', marginBottom:3 }}>
                {a.label}
              </div>
              <div style={{ fontSize:11.5, color:'rgba(240,238,255,.32)' }}>{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom panels */}
      <div className="bottom-grid" style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:16,
      }}>
        <div className="dash-panel" style={{ animationDelay:'.28s' }}>
          <div className="dash-panel-hdr">Stollar holati</div>
          <div className="dash-empty">
            <div style={{ fontSize:28, marginBottom:8 }}>🪑</div>
            Hali stol qo&apos;shilmagan
            <br/>
            <button
              className="dash-empty-btn"
              onClick={() => router.push('/dashboard/tables/new')}
            >
              Stol qo&apos;shish →
            </button>
          </div>
        </div>

        <div className="dash-panel" style={{ animationDelay:'.33s' }}>
          <div className="dash-panel-hdr">So&apos;nggi taomlar</div>
          <div className="dash-empty">
            <div style={{ fontSize:28, marginBottom:8 }}>🍽️</div>
            Hali taom qo&apos;shilmagan
            <br/>
            <button
              className="dash-empty-btn"
              onClick={() => router.push('/dashboard/menu/new')}
            >
              Taom qo&apos;shish →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
