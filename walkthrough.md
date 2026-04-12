# Table QR Ordering — Implementation Walkthrough

## Summary

Implemented a complete Table QR Ordering system across 4 phases. Customers can scan a table QR code, browse the menu, and place orders. Orders go to the cashier for approval before reaching the kitchen. Session management tracks multiple orders per table visit.

## Changes Made

### Phase 1: Database Schema

| File | Change |
|---|---|
| [schema.prisma](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/prisma/schema.prisma) | Added `Table` model, `APPROVED` to `OrderStatus`, `source`/`tableId` to `Order` |
| [seed.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/prisma/seed.ts) | Added 5 sample tables with QR tokens |

### Phase 2: Backend API Routes

| File | Change |
|---|---|
| [tables.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/src/routes/tables.ts) | **[NEW]** Full table CRUD + session info + settle endpoint |
| [orders.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/src/routes/orders.ts) | Added `POST /customer`, `PATCH /:id/approve`, `GET /pending-approval` |
| [index.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/src/index.ts) | Registered tables router |

### Phase 3: Frontend — Cashier & Kitchen

| File | Change |
|---|---|
| [types.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/services/types.ts) | Added `Table`, `TableWithSession`, `TableSession`, `CustomerOrderRequest`, `OrderSource` types |
| [api.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/services/api.ts) | Added 10 new API methods for tables and QR orders |
| [utils.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/services/utils.ts) | Added `APPROVED` status color (orange) |
| [CashierPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/CashierPage.tsx) | Added "Customer Orders" tab with pending approval + active sessions + settle |
| [KitchenPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/KitchenPage.tsx) | Filters to APPROVED/PREPARING/READY (no PENDING) |
| [OrderCard.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/components/OrderCard.tsx) | Shows table#, source badge, approve button |

### Phase 4: Customer Menu & Table Management

| File | Change |
|---|---|
| [CustomerMenuPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/CustomerMenuPage.tsx) | **[NEW]** Mobile-first menu with cart, session tracking, bill display |
| [TableManagementPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/TableManagementPage.tsx) | **[NEW]** Table CRUD with QR code generation |
| [App.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/App.tsx) | Added `/menu/:token` and `/tables` routes |
| [HomePage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/HomePage.tsx) | Added Tables card (3-column layout) |

## New Order Flow

```
Customer scans QR → /menu/:token → Browses menu → Places order
                                                        ↓
                                              Order (PENDING, source=QR)
                                                        ↓
                                              Cashier sees in "Customer Orders" tab
                                                        ↓
                                              Cashier clicks "Approve"
                                                        ↓
                                              Order (APPROVED) → Kitchen Display
                                                        ↓
                                              Kitchen: APPROVED → PREPARING → READY → COMPLETED
```

## Session Management

- Table has `lastSettledAt` timestamp
- All orders after `lastSettledAt` = current session
- Customer sees their session orders + combined total on the menu page
- Cashier can settle a table → resets `lastSettledAt` → clears session

## Verification Results

- ✅ `prisma db push` — Database synced successfully
- ✅ `prisma generate` — Client generated
- ✅ TypeScript check — Zero errors
- ✅ `qrcode.react` installed

## How to Test

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Go to `/tables` → Create a table → Copy the QR menu URL
4. Open the menu URL in a mobile browser → Browse & place orders
5. Go to `/cashier` → "Customer Orders" tab → Approve the order
6. Go to `/kitchen` → See the approved order → Process it
7. Go back to cashier → Settle the table when payment received
