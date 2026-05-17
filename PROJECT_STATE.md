# MenuQR — Project State
Last updated: 2026-05-17

## Stack
- Next.js 16.2.6, TypeScript, Prisma 7, Supabase PostgreSQL (Tokyo region)
- Auth: JWT + bcrypt, httpOnly cookies
- Styling: inline CSS (no Tailwind)
- Fonts: Cabinet Grotesk + Clash Display (admin), Playfair Display + DM Sans (customer)

## Critical Rules (read before every change)
1. Route groups like (dashboard) do NOT add URL segments. (dashboard)/dashboard/menu/ → /dashboard/menu
2. Next.js 16 uses proxy.ts NOT middleware.ts for middleware
3. restaurantId ALWAYS from JWT token, NEVER from client
4. When testing from phone or external IP, add to next.config.ts: allowedDevOrigins: ['YOUR_IP']
5. Run `npx tsc --noEmit` after every change to catch TypeScript errors
6. Always read PROJECT_STATE.md before starting work

## Project Structure
src/app/
├── (auth)/login, register
├── (dashboard)/dashboard/
│   ├── page.tsx (main dashboard)
│   ├── menu/page.tsx (menu management)
│   ├── menu/new/page.tsx (add item)
│   ├── menu/[id]/edit/page.tsx (edit item)
│   ├── tables/page.tsx (tables & QR)
│   └── tables/new/page.tsx (add table)
├── api/auth/ (login, logout, register, me)
├── api/categories/ (GET, POST)
├── api/menu-items/ (GET, POST, [id]: GET, PUT, DELETE)
├── api/tables/ (GET, POST, [id]: PATCH, DELETE)
└── menu/[token]/ (public customer page: page.tsx + MenuClient.tsx)

## Database Models
User, Restaurant, RestaurantUser, Category, MenuItem, Table (status: active/inactive), AnalyticsEvent
- Table: @@unique([restaurantId, name]) — no duplicate names per restaurant
- Category "Boshqa" auto-created on register

## Completed Features
✅ Landing page
✅ Auth (register, login, logout, JWT)
✅ Admin dashboard with stats
✅ Menu management (categories + items CRUD, image URL, isAvailable toggle)
✅ Tables & QR (create, rename inline, toggle status, delete, download QR PNG)
✅ Customer menu page (/menu/[token]) — public, no auth
   - Category tabs with filter
   - Green glow animation for available items
   - Strikethrough price + "Tugagan" badge for unavailable
   - Stol name badge in header

## Current Known Issues
- IntersectionObserver removed during debugging (can restore after deploy)
- Image upload: URL only (Supabase Storage configured but not wired to UI)
- Analytics: QR_SCAN saved to DB but dashboard shows hardcoded 0
- Settings page: not built yet

## Next Steps
1. Deploy to Vercel
2. Connect custom domain
3. Restore IntersectionObserver for scroll tracking
4. Wire Supabase Storage for image upload
5. Settings page (restaurant name, logo, theme)
