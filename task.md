# Table QR Ordering — Task Tracker

## Phase 1: Database / Prisma Schema
- [x] Update `schema.prisma` — add APPROVED status, Table model, Order updates
- [x] Update `seed.ts` — add sample tables

## Phase 2: Backend API Routes
- [x] Create `routes/tables.ts` — table CRUD + session endpoints
- [x] Update `routes/orders.ts` — customer order, approve, pending-approval
- [x] Update `index.ts` — register tables router

## Phase 3: Frontend — Cashier & Kitchen Updates
- [x] Update `types.ts` — new types
- [x] Update `api.ts` — new API methods
- [x] Update `utils.ts` — APPROVED status color
- [x] Update `CashierPage.tsx` — pending orders tab + settle
- [x] Update `KitchenPage.tsx` — filter PENDING, show APPROVED
- [x] Update `OrderCard.tsx` — table info, source badge, APPROVED flow

## Phase 4: Customer Menu & Table Management
- [x] Install `qrcode.react`
- [x] Create `CustomerMenuPage.tsx`
- [x] Create `TableManagementPage.tsx`
- [x] Update `App.tsx` — new routes
- [x] Update `HomePage.tsx` — table management card

## Verification
- [x] Run `prisma db push` + `prisma generate` — ✅ DB synced
- [x] TypeScript type check — ✅ Zero errors
