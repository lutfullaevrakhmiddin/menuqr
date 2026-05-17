# Changelog — 2026-05-18

## Fonts
- **Google Fonts olib tashlandi** — barcha `@import url('https://fonts.googleapis.com/...')` bloklari o'chirildi (SidebarClient, login, register, landing page)
- `next/font/google` orqali self-hosted: `Inter` (→ Clash Display o'rniga, `--font-display`), `Plus_Jakarta_Sans` (→ Cabinet Grotesk o'rniga, `--font-body`)
- Root layout (`layout.tsx`) da CSS variable sifatida `<html>` ga beriladi; barcha komponentlar `var(--font-display)` / `var(--font-body)` ishlatadi
- Mijoz sahifasi (`/menu/[token]`) allaqachon `next/font` ishlatgan edi — o'zgarishsiz qoldi

## Build
- `package.json` build skriptiga `prisma generate &&` qo'shilgan — Prisma Client har doim build oldidan yangilanadi

## API: Category CRUD
- **`PATCH /api/categories?id=`** (`route.ts`) — mavjud handler yoniga qo'shildi; nom/sortOrder yangilaydi, faqat o'z restoran kategoriyasi
- **`/api/categories/[id]/route.ts`** — yangi fayl:
  - `PATCH` — kategoriya nomini/sortOrder yangilash
  - `DELETE` — `"Boshqa"` kategoriyasini o'chirishni bloklaydi; boshqa kategoriyalar uchun barcha taomlarni `"Boshqa"` ga ko'chirib (`updateMany` + `delete` bitta Prisma transaction), kategoriyani o'chiradi; `"Boshqa"` mavjud bo'lmasa avval yaratadi

## Menu Page UI (`dashboard/menu/page.tsx`)

### Category sidebar — inline edit & delete
- Har bir kategoriya qatorida **qalam (pencil)** va **axlat (trash)** ikonalari
- Qalam bosilganda qator `<input>` ga aylanadi (autoFocus + select), foydalanuvchi nom tahrirlaydi
- Enter yoki ✓ → `PATCH /api/categories/[id]` → lokal state yangilanadi
- Escape yoki ✗ → tahrirlash bekor
- Axlat faqat `"Boshqa"` bo'lmagan kategoriyalarda ko'rinadi
- Axlat bosilganda inline tasdiqlash paneli: *"Bu kategoriyani o'chirsangiz, taomlar «Boshqa» ga o'tadi. Davom etasizmi?"*
- O'chirishdan keyin kategoriya va unga tegishli menuItem larning kategoriyasi lokal state da ham yangilanadi (re-fetch kerak yo'q)

### Menu item card — badge qatori
- **Avvalgi:** `[Category badge]` alohida qator, `[Mavjud/Tugagan]` narx yonida
- **Yangi:** `[Category badge — chap]` `[Mavjud/Tugagan — o'ng]` — bitta flex qator (`justify-content: space-between`), narx alohida qatorda pastda

### Header subtitle
- `getUzDate()` + `· {userName}` ko'rsatilmoqda (userName — `GET /api/auth/me` dan)
- Username binafsha rangda: `rgba(124,107,255, 0.8)`
- Statistika (`X ta taom · Y ta kategoriya`) saqlanib qoldi, kichikroq rang bilan pastda
