import { prisma } from '@/lib/prisma'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import MenuClient from './MenuClient'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export default async function MenuPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const table = await prisma.table.findUnique({
    where: { qrToken: token },
    include: { restaurant: true },
  })

  if (!table || table.status !== 'active') {
    return (
      <div
        className={`${playfair.variable} ${dmSans.variable}`}
        style={{
          minHeight: '100dvh',
          background: '#0F0A00',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          color: '#FFF8F0',
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          padding: 24,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48 }}>🍽️</div>
        <h1
          style={{
            fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            fontSize: 24,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Menyu topilmadi
        </h1>
        <p style={{ color: 'rgba(255,248,240,0.5)', margin: 0, fontSize: 14, maxWidth: 280 }}>
          Bu QR-kod hozirda faol emas yoki mavjud emas.
        </p>
      </div>
    )
  }

  const [categories] = await Promise.all([
    prisma.category.findMany({
      where: { restaurantId: table.restaurantId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        menuItems: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    }),
    prisma.analyticsEvent.create({
      data: {
        eventType: 'QR_SCAN',
        restaurantId: table.restaurantId,
        tableId: table.id,
      },
    }),
  ])

  const restaurant = {
    id: table.restaurant.id,
    name: table.restaurant.name,
    logoUrl: table.restaurant.logoUrl,
    description: table.restaurant.description,
    themeColor: table.restaurant.themeColor,
  }

  const tableData = {
    id: table.id,
    name: table.name,
  }

  const categoriesData = categories
    .filter((cat) => cat.menuItems.length > 0)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sortOrder,
      menuItems: cat.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
        sortOrder: item.sortOrder,
      })),
    }))

  return (
    <div className={`${playfair.variable} ${dmSans.variable}`}>
      <MenuClient
        restaurant={restaurant}
        table={tableData}
        categories={categoriesData}
      />
    </div>
  )
}
