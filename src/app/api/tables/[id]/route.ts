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
export async function PATCH(request: Request, { params }: RouteContext) {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const existing = await prisma.table.findFirst({
      where: { id, restaurantId: payload.restaurantId },
    })

    if (!existing) {
      return Response.json({ success: false, error: 'Stol topilmadi' }, { status: 404 })
    }

    const body = await request.json()
    const parsed = z.object({
      status: z.enum(['active', 'inactive']).optional(),
      name: z.string().min(1).max(100).optional(),
    }).safeParse(body)

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues }, { status: 400 })
    }

    const table = await prisma.table.update({
      where: { id },
      data: {
        ...(parsed.data.status && { status: parsed.data.status }),
        ...(parsed.data.name && { name: parsed.data.name.trim() }),
      },
    })

    return Response.json({ success: true, table })
  } catch (error) {
    console.error('[tables PATCH]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const existing = await prisma.table.findFirst({
      where: { id, restaurantId: payload.restaurantId },
    })

    if (!existing) {
      return Response.json({ success: false, error: 'Stol topilmadi' }, { status: 404 })
    }

    await prisma.table.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[tables DELETE]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
