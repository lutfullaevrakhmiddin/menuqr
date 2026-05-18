import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()
    if (!email || !code) {
      return Response.json({ error: "Email yoki kod kiritilmagan" }, { status: 400 })
    }

    const record = await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    })

    if (!record) {
      return Response.json({ error: "Kod topilmadi. Qayta yuboring." }, { status: 400 })
    }
    if (new Date() > record.expiresAt) {
      return Response.json({ error: "Kod muddati tugagan. Qayta yuboring." }, { status: 400 })
    }
    if (record.code !== code) {
      return Response.json({ error: "Kod noto'g'ri" }, { status: 400 })
    }

    await prisma.emailVerification.update({
      where: { id: record.id },
      data: { verified: true },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[verify-code]', error)
    return Response.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
