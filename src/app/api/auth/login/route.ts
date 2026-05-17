import { cookies } from 'next/headers'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { comparePassword, signToken } from '@/lib/auth'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        restaurantUsers: {
          select: {
            restaurantId: true,
            restaurant: { select: { id: true, name: true, slug: true } },
          },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
    })

    if (!user) {
      return Response.json(
        { success: false, error: 'Email yoki parol noto\'g\'ri' },
        { status: 401 }
      )
    }

    const isValid = await comparePassword(password, user.passwordHash)
    if (!isValid) {
      return Response.json(
        { success: false, error: 'Email yoki parol noto\'g\'ri' },
        { status: 401 }
      )
    }

    const restaurantUser = user.restaurantUsers[0]
    if (!restaurantUser) {
      return Response.json(
        { success: false, error: 'Restoran topilmadi' },
        { status: 404 }
      )
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      restaurantId: restaurantUser.restaurantId,
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
        id: restaurantUser.restaurant.id,
        name: restaurantUser.restaurant.name,
        slug: restaurantUser.restaurant.slug,
      },
    })
  } catch (error) {
    console.error('[login]', error)
    return Response.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    )
  }
}
