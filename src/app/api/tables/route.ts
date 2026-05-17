import { cookies } from 'next/headers'
import { z } from 'zod'
import { nanoid } from 'nanoid'
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

  const tables = await prisma.table.findMany({
    where: { restaurantId: payload.restaurantId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, status: true, qrToken: true, createdAt: true },
  })

  return Response.json({ success: true, tables })
}

export async function POST(request: Request) {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = z.object({ name: z.string().min(1).max(100) }).safeParse(body)

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues }, { status: 400 })
    }

    const duplicate = await prisma.table.findUnique({
      where: { restaurantId_name: { restaurantId: payload.restaurantId, name: parsed.data.name.trim() } },
      select: { id: true },
    })

    if (duplicate) {
      return Response.json({ success: false, error: 'Bu nomli stol allaqachon mavjud' }, { status: 400 })
    }

    const table = await prisma.table.create({
      data: {
        restaurantId: payload.restaurantId,
        name: parsed.data.name.trim(),
        qrToken: nanoid(10),
        status: 'active',
      },
    })

    return Response.json({ success: true, table }, { status: 201 })
  } catch (error) {
    console.error('[tables POST]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
