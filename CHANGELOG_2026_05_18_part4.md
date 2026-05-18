# Changelog — 2026-05-18 (part 4)

## Email verification added to registration flow

### Overview
Registration now requires email verification before account creation. Users go through a 3-step flow: email → 6-digit code → account details.

### New: `EmailVerification` Prisma model
```prisma
model EmailVerification {
  id        String   @id @default(cuid())
  email     String
  code      String
  expiresAt DateTime
  verified  Boolean  @default(false)
  createdAt DateTime @default(now())
  @@index([email])
}
```
Migration: `20260518121749_add_email_verification`

### New: `POST /api/auth/send-code`
- Rejects if email already in `User` table → "Bu email allaqachon ro'yxatdan o'tgan"
- Generates 6-digit random code (`Math.floor(100000 + Math.random() * 900000)`)
- Deletes any existing `EmailVerification` records for that email
- Saves new record with `expiresAt = now + 10 minutes`, `verified = false`
- Sends email via Resend: `from: "MenuQR <onboarding@resend.dev>"`, dark-themed HTML with code in large purple box
- Returns `{ success: true }`

### New: `POST /api/auth/verify-code`
- Finds latest `EmailVerification` by email
- Validates: record exists, not expired, code matches
- Sets `verified = true` (record kept so register endpoint can confirm verification)
- Returns `{ success: true }` or descriptive error

### Updated: `POST /api/auth/register`
- Added check: requires a `verified: true` `EmailVerification` record for the submitted email
- Returns 403 "Email tasdiqlanmagan" if not found
- Deletes all `EmailVerification` records for the email after successful check (prevents reuse)
- All other registration logic unchanged

### Updated: `register/page.tsx` — 3-step flow
**Step 1** — Email input + "Kod yuborish" button
- Calls `POST /api/auth/send-code`; advances to Step 2 on success

**Step 2** — Code verification
- Shows email (readonly), large centered 6-digit code input (digits-only, letter-spacing)
- Submit disabled until 6 digits entered
- "Qayta yuborish" link with 30-second cooldown to prevent spam
- "Orqaga" button to return to Step 1

**Step 3** — Account details
- Name, restaurant name, password, confirm password (with show/hide toggle on both)
- Password match validated client-side before POST
- Calls existing `POST /api/auth/register` with verified email

Animated step-indicator dots (active dot widens to pill shape via CSS transition) across all steps.

### Note
`from: onboarding@resend.dev` works on Resend free tier without domain verification.
For production email delivery from a custom domain (e.g. `noreply@menuqr.uz`), a verified Resend domain is required — pending custom domain setup.
