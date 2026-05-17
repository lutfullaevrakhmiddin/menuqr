import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const updateMenuItemSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
  imageUrl: z.string().nullable().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

type RouteContext = { params: Promise<{ id: string }> }

async function getPayload() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const payload = verifyToken(token)
    if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: { select: { name: true } } }
    })
    if (!item || item.restaurantId !== payload.restaurantId) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json({ success: true, item })
  } catch (error) {
    console.error('[GET menu-item]', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const payload = await getPayload()
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const existing = await prisma.menuItem.findFirst({
      where: { id, restaurantId: payload.restaurantId },
    })

    if (!existing) {
      return Response.json({ success: false, error: 'Taom topilmadi' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = updateMenuItemSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues }, { status: 400 })
    }

    const data = parsed.data

    if (data.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: data.categoryId, restaurantId: payload.restaurantId },
      })
      if (!category) {
        return Response.json({ success: false, error: 'Kategoriya topilmadi' }, { status: 404 })
      }
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl?.trim() || null }),
        ...(data.isAvailable !== undefined && { isAvailable: data.isAvailable }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    })

    return Response.json({ success: true, menuItem })
  } catch (error) {
    console.error('[menu-items PUT]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const payload = await getPayload()
  if (!payload) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const existing = await prisma.menuItem.findFirst({
      where: { id, restaurantId: payload.restaurantId },
    })

    if (!existing) {
      return Response.json({ success: false, error: 'Taom topilmadi' }, { status: 404 })
    }

    await prisma.menuItem.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[menu-items DELETE]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
