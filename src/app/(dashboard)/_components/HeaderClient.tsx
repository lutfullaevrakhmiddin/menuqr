"use client"
import { usePathname, useRouter } from 'next/navigation'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':          'Bosh sahifa',
  '/dashboard/menu':     'Menyu boshqaruvi',
  '/dashboard/tables':   'Stollar & QR',
  '/dashboard/analytics':'Analitika',
  '/dashboard/orders':   'Buyurtmalar',
  '/dashboard/settings': 'Sozlamalar',
}

const MONTHS = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr']
const DAYS   = ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba']

function todayStr() {
  const d = new Date()
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 2A4.75 4.75 0 0 0 3.75 6.75v.5L2.5 10.5h12l-1.25-3.25v-.5A4.75 4.75 0 0 0 8.5 2z"/>
      <path d="M7 10.5v.5a1.5 1.5 0 0 0 3 0v-.5"/>
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6.5" y1="1" x2="6.5" y2="12"/>
      <line x1="1" y1="6.5" x2="12" y2="6.5"/>
    </svg>
  )
}

export default function HeaderClient() {
  const pathname = usePathname()
  const router   = useRouter()

  const title = PAGE_TITLES[pathname] ?? 'Dashboard'

  return (
    <>
      <style>{`
        .hdr-btn {
          display:flex; align-items:center; gap:6px;
          padding:0 14px; height:34px; border-radius:7px;
          font-size:13px; cursor:pointer;
          font-family:'Cabinet Grotesk',sans-serif;
          transition:all .18s;
        }
        .hdr-btn-ghost {
          border:1px solid rgba(255,255,255,.09);
          background:rgba(255,255,255,.04);
          color:rgba(240,238,255,.65);
        }
        .hdr-btn-ghost:hover {
          border-color:rgba(124,107,255,.35);
          color:#f0eeff;
          background:rgba(124,107,255,.06);
        }
        .hdr-btn-solid {
          border:none;
          background:#7c6bff;
          color:#fff;
        }
        .hdr-btn-solid:hover {
          background:#6a59ff;
          box-shadow:0 6px 20px rgba(124,107,255,.35);
        }
        .hdr-bell {
          width:36px; height:36px; border-radius:8px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.03);
          color:rgba(240,238,255,.45);
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition:all .18s;
        }
        .hdr-bell:hover { color:#f0eeff; border-color:rgba(255,255,255,.14); }
      `}</style>
      <header style={{
        height:60, position:'sticky', top:0, zIndex:40,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 32px',
        background:'rgba(6,6,15,.88)',
        backdropFilter:'blur(24px)',
        borderBottom:'1px solid rgba(255,255,255,.06)',
        fontFamily:"'Cabinet Grotesk',sans-serif",
      }}>
        <div>
          <div style={{
            fontSize:15, fontWeight:600, color:'#f0eeff',
            fontFamily:"'Clash Display',sans-serif", letterSpacing:-.3,
          }}>
            {title}
          </div>
          <div style={{ fontSize:11, color:'rgba(240,238,255,.28)', marginTop:1 }}>
            {todayStr()}
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button className="hdr-bell" title="Bildirishnomalar">
            <BellIcon/>
          </button>
          <button
            className="hdr-btn hdr-btn-ghost"
            onClick={() => router.push('/dashboard/tables/new')}
          >
            <PlusIcon/>Stol qo&apos;shish
          </button>
          {pathname === '/dashboard' && (
              <button
                  className="hdr-btn hdr-btn-solid"
                  onClick={() => router.push('/dashboard/menu/new')}
              >
                <PlusIcon/>Taom qo&apos;shish
              </button>
          )}
        </div>
      </header>
    </>
  )
}
