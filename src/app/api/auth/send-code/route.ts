import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return Response.json({ error: "Email kiritilmagan" }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 409 })
    }

    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.emailVerification.deleteMany({ where: { email } })
    await prisma.emailVerification.create({ data: { email, code, expiresAt } })

    await resend.emails.send({
      from: 'MenuQR <onboarding@resend.dev>',
      to: email,
      subject: 'MenuQR — Tasdiqlash kodi',
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#06060f;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#06060f;min-height:100vh">
    <tr><td align="center" style="padding:40px 16px">
      <table width="100%" style="max-width:480px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:40px 36px">
        <tr><td>
          <div style="font-size:22px;font-weight:700;color:#f0eeff;letter-spacing:-0.5px;margin-bottom:28px">
            W<span style="color:#7c6bff">R</span>
          </div>
          <div style="font-size:22px;font-weight:700;color:#f0eeff;margin-bottom:8px">Tasdiqlash kodi</div>
          <div style="font-size:14px;color:rgba(240,238,255,0.45);margin-bottom:32px;line-height:1.6">
            Quyidagi kodni kiriting. Kod 10 daqiqa davomida amal qiladi.
          </div>
          <div style="background:rgba(124,107,255,0.1);border:1px solid rgba(124,107,255,0.3);border-radius:14px;padding:28px;text-align:center;margin-bottom:28px">
            <div style="font-size:44px;font-weight:800;color:#7c6bff;letter-spacing:10px">${code}</div>
          </div>
          <div style="font-size:12px;color:rgba(240,238,255,0.25);line-height:1.6">
            Agar siz ro'yxatdan o'tishga urinmagan bo'lsangiz, ushbu xabarni e'tiborsiz qoldiring.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('[send-code]', error)
    return Response.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
