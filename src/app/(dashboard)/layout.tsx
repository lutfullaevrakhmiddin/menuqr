import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SidebarClient from './_components/SidebarClient'
import HeaderClient from './_components/HeaderClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const ua = headersList.get('user-agent') ?? ''
  if (/Mobile|Android|iPhone/i.test(ua)) {
    return (
      <div style={{background:'#06060f',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 24px',textAlign:'center',color:'#f0eeff',fontFamily:"'Cabinet Grotesk', sans-serif"}}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(124,107,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:28}}>
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
        <h1 style={{fontSize:22,fontWeight:700,margin:'0 0 12px',letterSpacing:'-0.5px'}}>
          Admin panel planshet yoki kompyuter uchun
        </h1>
        <p style={{fontSize:15,color:'rgba(240,238,255,0.5)',lineHeight:1.6,maxWidth:320,margin:0}}>
          Yaxshi tajriba uchun kattaroq ekranda oching
        </p>
      </div>
    )
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) redirect('/login')

  const payload = verifyToken(token)
  if (!payload) redirect('/login')

  const [user, restaurant] = await Promise.all([
    prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true },
    }),
    prisma.restaurant.findUnique({
      where: { id: payload.restaurantId },
      select: { id: true, name: true, slug: true },
    }),
  ])

  if (!user || !restaurant) redirect('/login')

  const displayName = user.name ?? user.email.split('@')[0]

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        @media (max-width: 768px) {
          .dash-sidebar { display: none !important; }
          .dash-main   { margin-left: 0 !important; }
        }
      `}</style>

      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#06060f',
        fontFamily: "'Cabinet Grotesk', sans-serif",
        color: '#f0eeff',
      }}>
        <SidebarClient
          user={{ name: displayName, email: user.email }}
          restaurant={{ name: restaurant.name, slug: restaurant.slug }}
        />

        <div className="dash-main" style={{
          flex: 1,
          marginLeft: 260,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
          <HeaderClient />
          <main style={{ flex: 1, padding: '28px 32px' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
