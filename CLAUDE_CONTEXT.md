# MenuQR — Claude Chat Context
_Yangi chatda shu faylni tashlang va "davom etamiz" deb yozing_

---

## Loyiha haqida
**MenuQR** — restoran egalariga QR menyu yaratish imkonini beruvchi SaaS platforma.
- Stack: Next.js 16.2.6, TypeScript, Prisma 7, Supabase PostgreSQL
- Foydalanuvchi: Akbar (akbar@restoran.uz) — test account
- Local: `http://localhost:3000` | Network: `http://10.40.11.216:3000`
- Loyiha joyi: `~/IdeaProjects/menuqr`

---

## Tugallangan bo'limlar
✅ Landing page  
✅ Register / Login / Logout  
✅ Admin dashboard (stats, toj animatsiyasi — nuqtalardan)  
✅ Menyu boshqaruvi (kategoriyalar + taomlar CRUD)  
   - Kategoriya inline tahrirlash (qalam → input, Enter/✓ saqlash, Escape bekor)  
   - Kategoriya o'chirish (axlat ikona, tasdiqlash, taomlar → "Boshqa" ga ko'chadi)  
   - Taom kartasi: kategoriya badge (chap) + Mavjud/Tugagan (o'ng) — bir qatorda  
   - Header subtitle: sana (o'zbekcha) + foydalanuvchi nomi (binafsha)  
✅ Stollar & QR (yaratish, tahrirlash, QR yuklab olish)  
✅ Mijoz menyu sahifasi (`/menu/[token]`) — public  
✅ Google Fonts olib tashlandi → `next/font/google` (self-hosted, tashqi so'rov yo'q)
✅ Rasm yuklash (Supabase Storage)
   - `src/lib/supabase.ts` — supabaseAdmin (service role)
   - `POST /api/upload` — MIME + 5MB validatsiya, `{restaurantId}/{nanoid}.{ext}` path
   - `src/components/ImageUpload.tsx` — URL tab + Yuklash tab (drag&drop), preview, O'chirish
   - menu/new va menu/[id]/edit da `<ImageUpload>` ishlatiladi
✅ Sozlamalar sahifasi (`/dashboard/settings`)
   - 3 bo'lim: restoran ma'lumotlari, logo, qo'shimcha (disabled)
   - Saqlash → PATCH `/api/settings` → "Saqlandi ✓" 1.5s → `/dashboard`
   - Bekor qilish → `/dashboard`
✅ Logo ko'rinishi
   - Sidebar: `logoUrl` bo'lsa 36×36px rasm (aks holda "WR" harflari)
   - Mijoz menyu header: `logoUrl` bo'lsa 42×42px rasm
✅ Analytics dashboard — real ma'lumotlar
   - `GET /api/dashboard-stats`: todayScans, totalTables, totalMenuItems, totalCategories, monthlyScans
   - Dashboard `useEffect` bilan fetch, yuklanayotganda `'...'` ko'rsatadi
✅ QR skan duplikatsiyasini tuzatish
   - Cookie `scanned_{token}` (maxAge 1800s) orqali server + client ikki tomonlama himoya
✅ Email tasdiqlash (ro'yxatdan o'tish)
   - `EmailVerification` model: email, code (6 xona), expiresAt (10 daqiqa), verified bool
   - `POST /api/auth/send-code`: email band emasligini tekshiradi, kod yuboradi (Resend)
   - `POST /api/auth/verify-code`: kodni tekshiradi, `verified=true` qiladi
   - `register/page.tsx`: 3 bosqich (email → kod → hisob ma'lumotlari), step-indicator, qayta yuborish (30s cooldown)
   - `POST /api/auth/register`: `verified=true` bo'lmasa 403 qaytaradi
   - ⚠️ `RESEND_API_KEY` Vercel da qo'shilishi kerak; custom domen ulanganda Resend sender ham yangilanadi

---

## Dizayn qarorlari
**Admin panel:**
- Fon: `#06060f`, surface: `#0d0d1a`, accent: `#7c6bff`, pink: `#ff6b9d`
- Fontlar: Inter (`--font-display`, headings), Plus Jakarta Sans (`--font-body`, body) — next/font orqali
- Toj: nuqtalardan SVG, statik, gold gradient

**Mijoz menyu:**
- Fon: `#0F0A00` (issiq qora), accent: `#FF6B35` (apelsin), gold: `#FFD166`
- Fontlar: Playfair Display (headings), DM Sans (body)
- Mavjud taom: yashil narx `#4ade80` + seaGlow animatsiya (5s)
- Tugagan taom: narx chizilgan + "Tugagan" badge

---

## Muhim texnik qarorlar
- `proxy.ts` = Next.js 16 middleware (middleware.ts emas!)
- Route group `(dashboard)` URL qo'shmaydi → fayl joyi: `(dashboard)/dashboard/menu/`
- `restaurantId` har doim JWT dan, hech qachon clientdan
- `allowedDevOrigins: ['10.40.11.216']` — telefonda test uchun next.config.ts da
- Inline CSS (Tailwind yo'q)
- Table status: String `"active"/"inactive"` (Boolean emas — kengaytiriladi)

---

## Hozirgi muammolar
- IntersectionObserver olib tashlangan (scroll tracking yo'q) — keyinroq qaytaramiz

---

## Keyingi bosqichlar
1. **Custom domen** ulash (Resend custom sender ham shu bilan hal bo'ladi)
2. `RESEND_API_KEY` ni Vercel environment variables ga qo'shish
3. IntersectionObserver tiklash
4. Buyurtmalar (kelajak — stol orqali buyurtma berish)

---

## Yangi chatda boshlash uchun prompt
```
Bu MenuQR loyihasi — restoran uchun QR menyu SaaS.
CLAUDE_CONTEXT.md faylini o'qidingiz.
PROJECT_STATE.md ham loyiha papkasida bor.

Keyingi qadam: Custom domen ulash + RESEND_API_KEY ni Vercel ga qo'shish.
```

---

## Eslatmalar
- Siz bilan har sessiya oxirida bu faylni yangilayman
- Claude Code uchun: `PROJECT_STATE.md` + `CHANGELOG_[date].md`
- Telefonda test: har doim `allowedDevOrigins` ni tekshiring
