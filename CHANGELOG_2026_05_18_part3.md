# Changelog — 2026-05-18 (part 3)

## Analytics dashboard — real data

**Problem:** All stat cards on `/dashboard` showed hardcoded `0`.

**Fix:**
- Created `GET /api/dashboard-stats/route.ts`
  - Reads `restaurantId` from JWT cookie via `verifyToken`
  - Returns: `todayScans`, `totalTables`, `totalMenuItems`, `totalCategories`, `monthlyScans`
  - `todayScans`: `AnalyticsEvent` where `eventType='QR_SCAN'` AND `createdAt >= today 00:00:00 UTC`
  - `monthlyScans`: same filter with `createdAt >= first day of current month`
  - All 5 counts run in parallel via `Promise.all`
- Updated `dashboard/page.tsx`
  - Removed hardcoded `value: '0'` from `STATS` array (renamed to `STAT_CONFIGS`)
  - Added `StatsData` type and `useState<StatsData | null>(null)`
  - `useEffect` fetches `/api/dashboard-stats` on mount
  - Shows `'...'` while loading, real numbers after fetch
  - Welcome banner now shows real `todayScans` count
  - Removed 4 duplicate `useEffect` calls that were left in from earlier editing

---

## Duplicate QR scan fix

**Problem:** Every page refresh at `/menu/[token]` created a new `AnalyticsEvent` row, inflating scan counts.

**Root cause:** `prisma.analyticsEvent.create` ran unconditionally on every server render.

**Fix (hybrid server + client):**

Next.js 16 docs confirm `cookies().set()` is not available in Server Components — only Server Actions and Route Handlers. Used a two-part approach:

- **Server** (`menu/[token]/page.tsx`):
  - Imports `cookies` from `next/headers`
  - Checks `scanned_{token}` cookie before the `Promise.all`
  - If cookie present → passes `Promise.resolve(null)` instead of `analyticsEvent.create`
  - Passes `scanToken: string | null` prop to `MenuClient` (null if already scanned)

- **Client** (`menu/[token]/MenuClient.tsx`):
  - Added `scanToken: string | null` to `Props`
  - `useEffect` sets `document.cookie = 'scanned_{token}=1; max-age=1800; path=/; SameSite=Lax'` when `scanToken` is non-null
  - Cookie expires after 30 minutes; next visit after expiry counts as a new scan

---

## Production status

All features tested on Vercel production. Build passes with zero TypeScript errors.

## Remaining known issue

- `IntersectionObserver` removed during earlier debugging session — restore when convenient (no functional impact on current features).
