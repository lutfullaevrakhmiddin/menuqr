"use client"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  user: { name: string; email: string }
  restaurant: { name: string; slug: string }
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1.2"/>
      <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2"/>
      <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2"/>
      <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2"/>
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="2" y1="4" x2="13" y2="4"/>
      <line x1="2" y1="7.5" x2="13" y2="7.5"/>
      <line x1="2" y1="11" x2="9" y2="11"/>
    </svg>
  )
}

function QRIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <rect x="1" y="1" width="5" height="5" rx="0.5"/>
      <rect x="2.5" y="2.5" width="2" height="2" fill="currentColor" stroke="none"/>
      <rect x="9" y="1" width="5" height="5" rx="0.5"/>
      <rect x="10.5" y="2.5" width="2" height="2" fill="currentColor" stroke="none"/>
      <rect x="1" y="9" width="5" height="5" rx="0.5"/>
      <rect x="2.5" y="10.5" width="2" height="2" fill="currentColor" stroke="none"/>
      <path d="M9 9h1.5v1.5M12 9h2v1.5M9 12h1.5v2M12 12h2v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor">
      <rect x="1" y="9" width="3" height="5" rx="0.5"/>
      <rect x="6" y="5.5" width="3" height="8.5" rx="0.5"/>
      <rect x="11" y="2" width="3" height="12" rx="0.5"/>
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h11l-1 9H3L2 4z"/>
      <path d="M5 4c0-1.1.9-2 2-2s2 .9 2 2"/>
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <circle cx="7.5" cy="7.5" r="2.2"/>
      <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.1 3.1l1.1 1.1m6.6 6.6 1.1 1.1M3.1 11.9l1.1-1.1m6.6-6.6 1.1-1.1"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h5.5"/>
      <path d="M10.5 9.5 13 7l-2.5-2.5"/>
      <line x1="6" y1="7" x2="13" y2="7"/>
    </svg>
  )
}

const NAV_MAIN = [
  { label: 'Bosh sahifa',       href: '/dashboard',        Icon: GridIcon },
  { label: 'Menyu boshqaruvi',  href: '/dashboard/menu',   Icon: ListIcon },
  { label: 'Stollar & QR',      href: '/dashboard/tables', Icon: QRIcon   },
]

const NAV_FUTURE = [
  { label: 'Analitika',   Icon: ChartIcon },
  { label: 'Buyurtmalar', Icon: BagIcon   },
]

const NAV_SETTINGS = [
  { label: 'Sozlamalar', href: '/dashboard/settings', Icon: GearIcon },
]

export default function SidebarClient({ user, restaurant }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => { if (data.success && data.logoUrl) setLogoUrl(data.logoUrl) })
      .catch(() => {})
  }, [])

  function active(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <aside className="dash-sidebar" style={{
      width: 260, height: '100vh', position: 'fixed', top: 0, left: 0,
      background: '#0d0d1a', borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', zIndex: 50, overflow: 'hidden',
    }}>
      <style>{`
        @keyframes breathe {
          0%,100% { opacity:.45; text-shadow:none; }
          50%      { opacity:1;   text-shadow:0 0 28px rgba(201,168,76,.55),0 0 56px rgba(201,168,76,.2); }
        }
        @keyframes shimmer {
          0%   { background-position:-200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orb-pulse {
          0%,100% { transform:scale(1);   opacity:.5; }
          50%     { transform:scale(1.12);opacity:.75; }
        }

        .sb-logo {
          font-family:var(--font-display),sans-serif;
          font-size:22px; font-weight:700; letter-spacing:-.5px;
          background:linear-gradient(90deg,#9A7B1A,#C9A84C,#E8C97A,#C9A84C,#9A7B1A);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          animation:breathe 4s ease-in-out infinite, shimmer 8s linear infinite;
        }

        .sb-orb {
          position:absolute; width:220px; height:220px;
          background:rgba(124,107,255,.06); border-radius:50%;
          filter:blur(70px); top:-70px; left:-60px; pointer-events:none;
          animation:orb-pulse 6s ease-in-out infinite;
        }

        .nav-section {
          font-size:9px; letter-spacing:1.8px; text-transform:uppercase;
          color:rgba(240,238,255,.22); padding:0 16px;
          margin:16px 0 5px; font-weight:500;
        }

        .nav-link {
          display:flex; align-items:center; gap:10px;
          padding:9px 14px; border-radius:8px;
          font-size:13.5px; font-weight:400;
          color:rgba(240,238,255,.45); text-decoration:none;
          transition:all .18s; border-left:3px solid transparent;
          margin-bottom:2px; font-family:var(--font-body),sans-serif;
        }
        .nav-link:hover { color:#f0eeff; background:rgba(124,107,255,.07); }
        .nav-link.active { color:#f0eeff; background:rgba(124,107,255,.13); border-left-color:#7c6bff; }

        .nav-disabled {
          display:flex; align-items:center; gap:10px;
          padding:9px 14px; border-radius:8px; font-size:13.5px;
          color:rgba(240,238,255,.25); border-left:3px solid transparent;
          margin-bottom:2px; font-family:var(--font-body),sans-serif;
          opacity:.4; cursor:default; user-select:none;
        }

        .soon-badge {
          margin-left:auto; font-size:9px; padding:2px 7px;
          background:rgba(240,238,255,.05); border:1px solid rgba(240,238,255,.1);
          border-radius:20px; color:rgba(240,238,255,.3); letter-spacing:.4px;
        }

        .logout-btn {
          display:flex; align-items:center; gap:8px;
          width:100%; padding:8px 12px; border-radius:7px;
          font-size:13px; color:rgba(240,238,255,.35);
          cursor:pointer; border:none; background:none;
          transition:all .18s; font-family:var(--font-body),sans-serif;
          text-align:left;
        }
        .logout-btn:hover { color:rgba(255,100,100,.85); background:rgba(255,100,100,.07); }
      `}</style>

      <div className="sb-orb"/>

      {/* Logo */}
      <div style={{ padding:'24px 20px 18px', position:'relative', zIndex:1 }}>
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="logo"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              objectFit: 'cover',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'block',
            }}
          />
        ) : (
          <span className="sb-logo">WR</span>
        )}
      </div>

      {/* Restaurant card */}
      <div style={{
        margin:'0 12px 4px', padding:'11px 14px',
        background:'rgba(255,255,255,.03)',
        border:'1px solid rgba(255,255,255,.06)',
        borderRadius:10, position:'relative', zIndex:1,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <div style={{
            width:8, height:8, borderRadius:'50%',
            background:'#22c55e', boxShadow:'0 0 6px rgba(34,197,94,.6)',
            flexShrink:0,
          }}/>
          <span style={{
            fontSize:13.5, fontWeight:500, color:'#f0eeff',
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>
            {restaurant.name}
          </span>
        </div>
        <div style={{ fontSize:11, color:'rgba(240,238,255,.28)', paddingLeft:16 }}>
          menuqr.uz/r/{restaurant.slug}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'6px 12px', overflowY:'auto', position:'relative', zIndex:1 }}>
        <div className="nav-section">Asosiy</div>
        {NAV_MAIN.map(({ label, href, Icon }) => (
          <Link key={href} href={href} className={`nav-link${active(href) ? ' active' : ''}`}>
            <Icon/>{label}
          </Link>
        ))}

        <div className="nav-section">Nofaol</div>
        {NAV_FUTURE.map(({ label, Icon }) => (
          <div key={label} className="nav-disabled">
            <Icon/>{label}
            <span className="soon-badge">Tez kunda</span>
          </div>
        ))}

        <div className="nav-section">Sozlamalar</div>
        {NAV_SETTINGS.map(({ label, href, Icon }) => (
          <Link key={href} href={href} className={`nav-link${active(href) ? ' active' : ''}`}>
            <Icon/>{label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div style={{
        borderTop:'1px solid rgba(255,255,255,.06)',
        padding:'14px 12px', position:'relative', zIndex:1,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div style={{
            width:34, height:34, borderRadius:'50%',
            background:'linear-gradient(135deg,#7c6bff,#5b4ccc)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:600, color:'#fff',
            flexShrink:0, letterSpacing:.5,
          }}>
            {initials(user.name)}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{
              fontSize:13, fontWeight:500, color:'#f0eeff',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>
              {user.name}
            </div>
            <div style={{
              fontSize:11, color:'rgba(240,238,255,.3)',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            }}>
              {user.email}
            </div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogoutIcon/>Chiqish
        </button>
      </div>
    </aside>
  )
}
