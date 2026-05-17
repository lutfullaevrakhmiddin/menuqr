import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  sortOrder: z.number().int().optional(),
})

async function getPayload() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET() {
  const payload = await getPayload()
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const categories = await prisma.category.findMany({
    where: { restaurantId: payload.restaurantId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, name: true, sortOrder: true, isActive: true },
  })

  return Response.json({ success: true, categories })
}

export async function POST(request: Request) {
  const payload = await getPayload()
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createCategorySchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues }, { status: 400 })
    }

    const { name, sortOrder } = parsed.data

    const category = await prisma.category.create({
      data: { restaurantId: payload.restaurantId, name, sortOrder: sortOrder ?? 0 },
      select: { id: true, name: true, sortOrder: true, isActive: true },
    })

    return Response.json({ success: true, category }, { status: 201 })
  } catch (error) {
    console.error('[categories POST]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
