import { cookies } from 'next/headers'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { hashPassword, signToken } from '@/lib/auth'

const registerSchema = z.object({
  name: z.string().min(1).max(100),
  restaurantName: z.string().min(1).max(200),
  email: z.email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues },
        { status: 400 }
      )
    }

    const { name, restaurantName, email, password } = parsed.data

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return Response.json(
        { success: false, error: 'Bu email allaqachon ro\'yxatdan o\'tgan' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const slug = nanoid(10).toLowerCase()

    const [user, restaurant] = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, passwordHash },
      })

      const newRestaurant = await tx.restaurant.create({
        data: { name: restaurantName, slug },
      })

      await tx.restaurantUser.create({
        data: {
          userId: newUser.id,
          restaurantId: newRestaurant.id,
          role: 'OWNER',
        },
      })

      await tx.category.create({
        data: { restaurantId: newRestaurant.id, name: 'Boshqa', sortOrder: 0 },
      })

      return [newUser, newRestaurant]
    })

    const token = signToken({
      userId: user.id,
      email: user.email,
      restaurantId: restaurant.id,
    })

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return Response.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
      },
    })
  } catch (error) {
    console.error('[register]', error)
    return Response.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    )
  }
}
