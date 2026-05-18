# MenuQR — Project State
Last updated: 2026-05-18 (session 3)

## Stack
- Next.js 16.2.6, TypeScript, Prisma 7, Supabase PostgreSQL (Tokyo region)
- Auth: JWT + bcrypt, httpOnly cookies
- Styling: inline CSS (no Tailwind)
- Fonts: Inter + Plus Jakarta Sans (admin, via next/font → `--font-display`/`--font-body`), Playfair Display + DM Sans (customer)

## Critical Rules (read before every change)
1. Route groups like (dashboard) do NOT add URL segments. (dashboard)/dashboard/menu/ → /dashboard/menu
2. Next.js 16 uses proxy.ts NOT middleware.ts for middleware
3. restaurantId ALWAYS from JWT token, NEVER from client
4. When testing from phone or external IP, add to next.config.ts: allowedDevOrigins: ['YOUR_IP']
5. Run `npx tsc --noEmit` after every change to catch TypeScript errors
6. Always read PROJECT_STATE.md before starting work

## Project Structure
src/
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx (main dashboard)
│   │   ├── menu/page.tsx (menu management)
│   │   ├── menu/new/page.tsx (add item)
│   │   ├── menu/[id]/edit/page.tsx (edit item)
│   │   ├── tables/page.tsx (tables & QR)
│   │   ├── tables/new/page.tsx (add table)
│   │   └── settings/page.tsx (restaurant info, logo, extras disabled)
│   ├── api/auth/ (login, logout, register, me)
│   ├── api/categories/ (GET, POST, PATCH?id=)
│   ├── api/categories/[id]/ (PATCH, DELETE)
│   ├── api/menu-items/ (GET, POST, [id]: GET, PUT, DELETE)
│   ├── api/tables/ (GET, POST, [id]: PATCH, DELETE)
│   ├── api/upload/ (POST — multipart, validates type+size, uploads to Supabase Storage)
│   ├── api/settings/ (GET — name/logoUrl/description; PATCH — update + auto-delete old Storage file)
│   └── menu/[token]/ (public customer page: page.tsx + MenuClient.tsx)
├── components/
│   └── ImageUpload.tsx ("use client" — URL tab + drag&drop upload tab, preview, clear)
└── lib/
    ├── auth.ts
    ├── prisma.ts
    └── supabase.ts (supabaseAdmin — createClient with SUPABASE_SECRET_KEY)

## Database Models
User, Restaurant, RestaurantUser, Category, MenuItem, Table (status: active/inactive), AnalyticsEvent
- Table: @@unique([restaurantId, name]) — no duplicate names per restaurant
- Category "Boshqa" auto-created on register

## Completed Features
✅ Landing page
✅ Auth (register, login, logout, JWT)
✅ Admin dashboard with stats
✅ Menu management (categories + items CRUD, image URL, isAvailable toggle)
   - Category inline rename (pencil icon → input) + delete (trash icon, confirmation, items → "Boshqa")
   - Menu item card: category badge left / availability badge right on same row
   - Header subtitle: Uzbek date + username (purple)
✅ Tables & QR (create, rename inline, toggle status, delete, download QR PNG)
✅ Customer menu page (/menu/[token]) — public, no auth
   - Category tabs with filter
   - Green glow animation for available items
   - Strikethrough price + "Tugagan" badge for unavailable
   - Stol name badge in header
✅ Google Fonts removed — next/font/google (self-hosted, no external requests)
✅ Supabase Storage image upload wired to UI
   - src/lib/supabase.ts — supabaseAdmin (env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY)
   - src/app/api/upload/route.ts — POST multipart; validates MIME (jpeg/png/webp/gif) + size (5MB); path: {restaurantId}/{nanoid(12)}.{ext}; bucket: "menuqr-images"
   - src/components/ImageUpload.tsx — "use client"; URL tab (direct input) + Yuklash tab (drag&drop + file picker); image preview + O'chirish button; all inline CSS
   - menu/new and menu/[id]/edit now use <ImageUpload> instead of plain URL input
✅ Settings page (/dashboard/settings)
   - 3 sections: restaurant info, logo upload, extras (disabled, "Tez kunda")
   - Saqlash: PATCH /api/settings → "Saqlandi ✓" 1.5s → redirect /dashboard
   - Bekor qilish: redirect /dashboard (no save)
✅ Logo display
   - Sidebar: 36×36px logo image replaces "WR" initials when logoUrl set
   - Customer menu header: 42×42px logo when logoUrl set

## Current Known Issues
- IntersectionObserver removed during debugging (can restore after deploy)
- Analytics: QR_SCAN saved to DB but dashboard shows hardcoded 0

## Next Steps
1. Analytics tuzatish — QR scan dashboard da 0 ko'rsatadi, real count kerak
2. Deploy to Vercel (to'liq test)
3. Connect custom domain
4. Restore IntersectionObserver for scroll tracking
