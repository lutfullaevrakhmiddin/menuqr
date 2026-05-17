import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('token')

    return Response.json({ success: true })
  } catch (error) {
    console.error('[logout]', error)
    return Response.json(
      { success: false, error: 'Server xatosi' },
      { status: 500 }
    )
  }
}
