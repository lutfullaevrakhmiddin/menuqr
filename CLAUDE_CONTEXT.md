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
- IntersectionObserver olib tashlangan (scroll tracking yo'q) — deploydan keyin qaytaramiz
- Rasm: faqat URL input, Supabase Storage bor lekin UI yo'q
- Analytics: QR_SCAN DB ga yoziladi lekin dashboard da `0` ko'rsatadi
- Sozlamalar sahifasi: hali qurilmagan

---

## Keyingi bosqichlar
1. **Vercel deploy** — asosiy qadam
2. **GitHub repo** — kod saqlash
3. **Real domen** ulash
4. Sozlamalar sahifasi
5. Rasm yuklash (Supabase Storage)
6. Analytics dashboard

---

## Yangi chatda boshlash uchun prompt
```
Bu MenuQR loyihasi — restoran uchun QR menyu SaaS.
CLAUDE_CONTEXT.md faylini o'qidingiz.
PROJECT_STATE.md ham loyiha papkasida bor.

Keyingi qadam: Vercel ga deploy qilamiz.
GitHub repo yaratamiz va Vercel ga ulaymiz.
```

---

## Eslatmalar
- Siz bilan har sessiya oxirida bu faylni yangilayman
- Claude Code uchun: `PROJECT_STATE.md` + `CHANGELOG_[date].md`
- Telefonda test: har doim `allowedDevOrigins` ni tekshiring
