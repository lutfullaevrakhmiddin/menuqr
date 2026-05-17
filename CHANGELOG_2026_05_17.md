# Changelog — 2026-05-17

## What was built today
- Menu management: categories sidebar, item grid, add/edit/delete
- Tables & QR: full CRUD, inline rename, QR generate + download PNG
- Customer menu page: server + client components, category filter, animations
- Auth register: auto-creates "Boshqa" category in same transaction

## Bugs encountered and fixed

### BUG 1 — Route 404 (1 hour lost)
Problem: /dashboard/menu and /dashboard/tables returned 404
Root cause: Files were placed at (dashboard)/menu/ but Next.js route groups do not add URL segments. Correct path is (dashboard)/dashboard/menu/
Fix: Moved all page files to correct subfolder
Lesson: Always use existing pages as reference — (dashboard)/dashboard/page.tsx shows the correct pattern

### BUG 2 — Category tabs not working on external device (3 hours lost)
Problem: Clicking category tabs on phone did nothing — color did not change, filter did not work
Wrong diagnosis (wasted time):
  - Thought React useState was broken
  - Rewrote component 3 times
  - Removed IntersectionObserver, scrollToCategory, useRef
  - None of it helped
Real root cause: Next.js 16 blocks cross-origin requests by default. When accessing via IP address (10.40.11.216) instead of localhost, the React JavaScript bundle was silently blocked. useState never executed because JS never loaded.
Fix: Added to next.config.ts:
  allowedDevOrigins: ['10.40.11.216']
How to detect faster next time: Terminal log showed "Blocked cross-origin request" warning — should have read terminal logs first, not browser console
Lesson: ALWAYS add allowedDevOrigins before testing from phone. WebSocket errors in browser console = JS not loading = nothing React-related will work.

### BUG 3 — script tag in React component (30 min lost)
Problem: Used <script dangerouslySetInnerHTML> for crown dot animation
Fix: Moved logic to useEffect

### BUG 4 — useRef read during render
Problem: origin.current read during render caused cascading render warning
Fix: Replaced useRef with useState

## Decisions made
- Table status: String "active"/"inactive" (not Boolean) — easier to extend later
- Category filter: simple useState, no URL params — fast and sufficient for MVP
- Image: URL input only for now — Supabase Storage ready but upload UI deferred
- Crown animation: static SVG dots with gold gradient — no JS animation (performance)

## Files changed today
- prisma/schema.prisma (added Table.status)
- next.config.ts (added allowedDevOrigins)
- src/proxy.ts (Next.js 16 middleware)
- src/app/api/* (categories, menu-items, tables routes)
- src/app/(dashboard)/dashboard/* (menu, tables pages)
- src/app/menu/[token]/* (customer page)
- src/app/(dashboard)/_components/HeaderClient.tsx (conditional buttons)
