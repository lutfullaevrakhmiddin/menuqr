import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { nanoid } from 'nanoid'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const MAX_SIZE = 5 * 1024 * 1024

async function getPayload() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function POST(request: Request) {
  const payload = await getPayload()
  if (!payload) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json({ success: false, error: 'Fayl topilmadi' }, { status: 400 })
    }

    const ext = ALLOWED_TYPES[file.type]
    if (!ext) {
      return Response.json(
        { success: false, error: 'Ruxsat etilmagan fayl turi. Faqat JPEG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { success: false, error: 'Fayl hajmi 5MB dan oshmasligi kerak' },
        { status: 400 }
      )
    }

    const path = `${payload.restaurantId}/${nanoid(12)}.${ext}`
    const arrayBuffer = await file.arrayBuffer()

    const { error: uploadError } = await supabaseAdmin.storage
      .from('menuqr-images')
      .upload(path, arrayBuffer, { contentType: file.type })

    if (uploadError) {
      console.error('[upload POST]', uploadError)
      return Response.json({ success: false, error: 'Yuklashda xato' }, { status: 500 })
    }

    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/menuqr-images/${path}`

    return Response.json({ success: true, url })
  } catch (error) {
    console.error('[upload POST]', error)
    return Response.json({ success: false, error: 'Server xatosi' }, { status: 500 })
  }
}
