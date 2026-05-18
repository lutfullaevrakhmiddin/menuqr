# Changelog — 2026-05-18 (Part 2)

## Supabase Storage
- Bucket `menuqr-images` created — public, 5MB limit, image types only (jpeg/png/webp/gif)
- `SUPABASE_SECRET_KEY` added to `.env.local` and Vercel environment variables

## New Files
- **`src/lib/supabase.ts`** — `supabaseAdmin` client using `createClient` with service role key (`SUPABASE_SECRET_KEY`)
- **`src/components/ImageUpload.tsx`** — reusable `"use client"` component:
  - URL tab: direct URL input
  - Yuklash tab: drag&drop + file picker, calls `POST /api/upload`
  - Two-column layout: input/dropzone (left) + image preview (right)
  - Preview actions: Almashtirish (replace) + O'chirish (clear) buttons
  - Validates MIME type and 5MB limit client-side before uploading

## API Routes
- **`POST /api/upload`** — multipart image upload:
  - JWT auth (restaurantId from token)
  - MIME validation: jpeg/png/webp/gif only
  - Size limit: 5MB
  - Storage path: `{restaurantId}/{nanoid(12)}.{ext}` in `menuqr-images` bucket
  - Returns `{ success: true, url: string }`
- **`GET /api/settings`** — returns `{ success, restaurantName, logoUrl, description }`
- **`PATCH /api/settings`** — updates name/logoUrl/description; auto-deletes old Supabase Storage file when logoUrl changes

## Settings Page (`/dashboard/settings`)
- 3 sections: Restoran ma'lumotlari, Logo (ImageUpload), Qo'shimcha (disabled)
- Sozlamalar sahifasi design matching `settings_page_v2.html` reference
- Section 3 grid layout (1fr 1fr), "Tez kunda" badge, placeholders: "Telefon raqam" / "Google Maps havolasi (share link)"
- **Saqlash** — PATCH `/api/settings`, shows "Saqlandi ✓" (green, 1.5s), then `router.push('/dashboard')`
- **Bekor qilish** — `router.push('/dashboard')` (no save)

## UI Updates
- **Sidebar** (`SidebarClient.tsx`) — shows restaurant logo (36×36px, rounded) instead of "WR" initials placeholder if `logoUrl` is set
- **Customer menu** (`MenuClient.tsx`) — shows restaurant logo (42×42px) in header if `logoUrl` is set
- **Menu new/edit pages** — replaced plain URL input with `<ImageUpload>` component
