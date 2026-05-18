import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

async function getPayload() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET() {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { restaurantId } = payload

  const now = new Date()
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  const [todayScans, totalTables, totalMenuItems, totalCategories, monthlyScans] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { restaurantId, eventType: 'QR_SCAN', createdAt: { gte: todayStart } },
    }),
    prisma.table.count({ where: { restaurantId } }),
    prisma.menuItem.count({ where: { restaurantId } }),
    prisma.category.count({ where: { restaurantId } }),
    prisma.analyticsEvent.count({
      where: { restaurantId, eventType: 'QR_SCAN', createdAt: { gte: monthStart } },
    }),
  ])

  return Response.json({ todayScans, totalTables, totalMenuItems, totalCategories, monthlyScans })
}
