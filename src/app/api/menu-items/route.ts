import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const createMenuItemSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string().min(1),
  imageUrl: z.string().optional(),
  isAvailable: z.boolean().optional(),
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

  const menuItems = await prisma.menuItem.findMany({
    where: { restaurantId: payload.restaurantId },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageUrl: true,
      isAvailable: true,
      sortOrder: true,
      category: { select: { id: true, name: true } },
    },
  })

  return Response.json({ success: true, menuItems })
}

export async function POST(request: Request) {
  const payload = await getPayload()
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const parsed = createMenuItemSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues }, { status: 400 })
    }

    const { name, description, price, categoryId, imageUrl, isAvailable, sortOrder } = parsed.data

    const category = await prisma.category.findFirst({
      where: { id: categoryId, restaurantId: payload.restaurantId },
    })

    if (!category) {
      return Response.json({ success: false, error: 'Kategoriya topilmadi' }, { status: 404 })
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: payload.restaurantId,
        categoryId,
        name,
        description: description ?? null,
        price,
        imageUrl: imageUrl?.trim() || null,
        isAvailable: isAvailable ?? true,
        sortOrder: sortOrder ?? 0,
      },
    })

    return Response.json({ success: true, menuItem }, { status: 201 })
  } catch (error) {
    console.error('[menu-items POST]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
