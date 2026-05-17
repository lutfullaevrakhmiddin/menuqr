import { cookies } from 'next/headers'
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
