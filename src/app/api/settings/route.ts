import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

async function getPayload() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function GET() {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: payload.restaurantId },
    select: { name: true, logoUrl: true, description: true },
  })

  if (!restaurant) return Response.json({ error: 'Not found' }, { status: 404 })

  return Response.json({
    success: true,
    restaurantName: restaurant.name,
    logoUrl: restaurant.logoUrl,
    description: restaurant.description,
  })
}

export async function PATCH(request: Request) {
  const payload = await getPayload()
  if (!payload) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { restaurantName, logoUrl, description } = body

    if (logoUrl !== undefined) {
      const current = await prisma.restaurant.findUnique({
        where: { id: payload.restaurantId },
        select: { logoUrl: true },
      })
      if (
        current?.logoUrl &&
        current.logoUrl !== logoUrl &&
        current.logoUrl.includes('menuqr-images')
      ) {
        const match = current.logoUrl.match(/menuqr-images\/(.+)/)
        if (match) {
          await supabaseAdmin.storage.from('menuqr-images').remove([match[1]])
        }
      }
    }

    const updateData: { name?: string; logoUrl?: string | null; description?: string | null } = {}
    if (restaurantName !== undefined) updateData.name = String(restaurantName).trim() || undefined
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl || null
    if (description !== undefined) updateData.description = description || null

    const restaurant = await prisma.restaurant.update({
      where: { id: payload.restaurantId },
      data: updateData,
      select: { id: true, name: true, logoUrl: true, description: true },
    })

    return Response.json({ success: true, restaurant })
  } catch (error) {
    console.error('[settings PATCH]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
