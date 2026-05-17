import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

type RouteContext = { params: Promise<{ id: string }> }

async function getPayload() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

const patchSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  sortOrder: z.number().int().optional(),
})

export async function PATCH(request: Request, { params }: RouteContext) {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const existing = await prisma.category.findFirst({
      where: { id, restaurantId: payload.restaurantId },
    })
    if (!existing) return Response.json({ success: false, error: 'Kategoriya topilmadi' }, { status: 404 })

    const body = await request.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) return Response.json({ success: false, error: parsed.error.issues }, { status: 400 })

    const category = await prisma.category.update({
      where: { id },
      data: parsed.data,
      select: { id: true, name: true, sortOrder: true, isActive: true },
    })

    return Response.json({ success: true, category })
  } catch (error) {
    console.error('[categories/[id] PATCH]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const existing = await prisma.category.findFirst({
      where: { id, restaurantId: payload.restaurantId },
    })
    if (!existing) return Response.json({ success: false, error: 'Kategoriya topilmadi' }, { status: 404 })

    // "Boshqa" kategoriyasini o'chirib bo'lmaydi
    if (existing.name === 'Boshqa') {
      return Response.json({ success: false, error: "'Boshqa' kategoriyasini o'chirib bo'lmaydi" }, { status: 400 })
    }

    // "Boshqa" kategoriyasini topamiz yoki yaratamiz
    let fallback = await prisma.category.findFirst({
      where: { restaurantId: payload.restaurantId, name: 'Boshqa' },
    })
    if (!fallback) {
      fallback = await prisma.category.create({
        data: { restaurantId: payload.restaurantId, name: 'Boshqa', sortOrder: 0 },
      })
    }

    // Ushbu kategoriya taomlarini "Boshqa" ga ko'chiramiz, so'ng o'chiramiz
    await prisma.$transaction([
      prisma.menuItem.updateMany({
        where: { categoryId: id, category: { restaurantId: payload.restaurantId } },
        data: { categoryId: fallback.id },
      }),
      prisma.category.delete({ where: { id } }),
    ])

    return Response.json({ success: true })
  } catch (error) {
    console.error('[categories/[id] DELETE]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
