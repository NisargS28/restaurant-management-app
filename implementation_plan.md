# Table QR Ordering System — Implementation Plan

Add a complete Table QR Ordering flow to the existing RestoPOS app, allowing customers to scan a table QR code, browse the menu, and place orders which go through cashier approval before reaching the kitchen. Includes **table session management** so multiple orders from the same table accumulate until the cashier settles the bill.

## Session Management Concept

> [!IMPORTANT]
> **Table Sessions** track a customer's entire visit at a table. When a customer scans the QR and places an order, a session begins. The same customer (or anyone at that table) can place additional orders — all orders accumulate under the same session. The cashier can view the full session bill and when payment is received, they **settle the table**, which resets it for the next customer.

**How it works:**
- `Table` model has a `lastSettledAt` timestamp (defaults to table creation time)
- All orders for a table with `createdAt > lastSettledAt` belong to the **current session**
- Customer menu page shows their current session's past orders + running total
- Cashier can view a table's active session (all orders, combined total) and **Settle** it
- Settling updates `lastSettledAt = now()`, effectively resetting the table for the next customer

## Proposed Changes

Implementation will proceed in **4 phases**, each building on the previous:

---

### Phase 1: Database / Prisma Schema Changes

#### [MODIFY] [schema.prisma](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/prisma/schema.prisma)

1. **Add `APPROVED` to `OrderStatus` enum** (between PENDING and PREPARING)
2. **Add new `Table` model** with fields: `id`, `tableNo`, `qrToken`, `isActive`, `lastSettledAt` (DateTime, defaults to now), `orders[]`
3. **Update `Order` model** — add `tableId` (optional FK to Table), `source` field (`"CASHIER"` | `"QR"`)
4. Map table to `"tables"` in DB

#### [MODIFY] [seed.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/prisma/seed.ts)
- Add sample tables (Table 1–5) with generated `qrToken` values

---

### Phase 2: Backend API Routes

#### [NEW] [tables.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/src/routes/tables.ts)

New route file for table management:

| Endpoint | Method | Description |
|---|---|---|
| `GET /api/tables` | GET | List all tables (with active session order count + total) |
| `POST /api/tables` | POST | Create a new table (auto-generates `qrToken`) |
| `GET /api/tables/:token` | GET | Get table info by QR token (for customer menu) |
| `GET /api/tables/:token/session` | GET | Get current session orders + total for a table (customer view) |
| `PATCH /api/tables/:id` | PATCH | Toggle table active status |
| `PATCH /api/tables/:id/settle` | PATCH | **Settle table** — sets `lastSettledAt = now()`, clears the session |
| `DELETE /api/tables/:id` | DELETE | Delete a table |

#### [MODIFY] [orders.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/src/routes/orders.ts)

1. **Add `POST /api/orders/customer`** — Public route for QR orders. Accepts `{ tableToken, items }`, looks up table by token, creates order with `status=PENDING`, `source="QR"`, linked `tableId`. No `paymentMode` required.
2. **Add `PATCH /api/orders/:id/approve`** — Cashier route: changes `PENDING → APPROVED`
3. **Add `GET /api/orders/pending-approval`** — Returns all orders with `status=PENDING` and `source="QR"`
4. **Update existing PATCH** — Add `APPROVED` to valid statuses
5. **Include table relation** in order queries

#### [MODIFY] [index.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/backend/src/index.ts)
- Register new `tablesRouter` at `/api/tables`

---

### Phase 3: Frontend — Cashier & Kitchen Updates

#### [MODIFY] [types.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/services/types.ts)

Add new types:
- `Table` interface (`id`, `tableNo`, `qrToken`, `isActive`, `lastSettledAt`)
- Add `'APPROVED'` to `OrderStatus` union
- Add `tableId?`, `source?`, `table?` to `Order` / `OrderWithItems`
- `CustomerOrderRequest` interface
- `TableSession` interface (orders array + combined total)

#### [MODIFY] [api.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/services/api.ts)

Add new API methods:
- `getTables()`, `createTable()`, `getTableByToken()`, `toggleTableStatus()`, `deleteTable()`
- `getTableSession()` — fetch current session orders for a table
- `settleTable()` — settle a table (cashier action)
- `createCustomerOrder()`, `approveOrder()`, `getPendingApproval()`

#### [MODIFY] [utils.ts](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/services/utils.ts)
- Add `APPROVED` case to `getStatusColor()` (orange theme)

#### [MODIFY] [CashierPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/CashierPage.tsx)

Add a third tab: **"Pending Customer Orders"**
- Fetches `GET /api/orders/pending-approval`
- Displays order cards with: Order#, Table#, Items, Total, Time
- Each card has an **Approve** button → calls `PATCH /api/orders/:id/approve`
- Auto-refresh every 5 seconds
- Shows **active table sessions** — cashier can see all orders from a table, combined total
- **Settle Table** button — marks payment received, resets table session
- Shows success toast on approval / settlement

#### [MODIFY] [KitchenPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/KitchenPage.tsx)

- Filter out `PENDING` orders — kitchen only sees `APPROVED`, `PREPARING`, `READY`
- Update filter buttons to show `APPROVED` instead of `PENDING`
- Update status flow: `APPROVED → PREPARING → READY → COMPLETED`

#### [MODIFY] [OrderCard.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/components/OrderCard.tsx)
- Display table number if order has a `table` relation
- Display source badge (`QR` / `CASHIER`)
- Support `APPROVED` in the status flow

---

### Phase 4: Customer Menu Page & Table Management

#### [NEW] [CustomerMenuPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/CustomerMenuPage.tsx)

New mobile-first customer-facing menu page at `/menu/:token`:
- Reads `token` from URL params
- Fetches table info via `GET /api/tables/:token`
- Fetches active products via `GET /api/products?active=true`
- Displays menu in beautiful card-based layout grouped by category
- Cart functionality with quantity controls
- **Running total bill displayed** in cart (item subtotals + grand total)
- Sticky floating cart button showing item count **and total amount**
- Slide-up cart drawer/panel
- **Current session summary** — shows previously placed orders in this session with their statuses and a combined session total
- Place order → `POST /api/orders/customer`
- After placing: shows updated session with all orders
- Success screen: "Order placed! Waiting for cashier approval."
- Error handling for invalid/inactive table tokens

#### [NEW] [TableManagementPage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/TableManagementPage.tsx)

Admin page for table CRUD + QR code display:
- List all tables with status + active session info (order count, running total)
- Create new table form (table number input)
- QR code display for each table (using `qrcode.react`)
- Toggle active/inactive
- **Settle Table** button (resets session for next customer)
- Delete table
- QR points to: `{window.location.origin}/menu/{qrToken}`

#### [MODIFY] [App.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/App.tsx)
- Add route: `/menu/:token` → `CustomerMenuPage`
- Add route: `/tables` → `TableManagementPage`

#### [MODIFY] [HomePage.tsx](file:///d:/Nisarg.Doc/Project/Restaurant-management/my-app/frontend/src/pages/HomePage.tsx)
- Add "Table Management" card to home page

## NPM Packages Required

| Package | Location | Purpose |
|---|---|---|
| `qrcode.react` | Frontend | QR code generation for table management page |
| `crypto` | Backend | Built-in Node.js — for generating secure QR tokens (no install needed) |

## Migration / Commands

```bash
# After schema changes
cd backend
npx prisma db push    # Apply schema changes
npx prisma generate   # Regenerate Prisma client

# Install frontend dependency
cd frontend
npm install qrcode.react

# Re-seed (optional)
cd backend
npx tsx prisma/seed.ts
```

## Verification Plan

### Automated Tests
- Build frontend: `cd frontend && npm run build` — verify no TypeScript errors
- Start backend and test each new endpoint with curl/browser

### Manual Verification
1. Run `prisma db push` and verify new Table model + Order schema changes
2. Create tables via Table Management page
3. Scan QR / navigate to `/menu/{token}` — verify menu loads
4. Place a customer order — verify it appears in Cashier "Pending" tab
5. Place **another** order from same table — verify it accumulates in the session
6. Customer menu shows both orders with combined total
7. Approve orders — verify they move to Kitchen display
8. Process through Kitchen flow: APPROVED → PREPARING → READY → COMPLETED
9. Cashier settles the table — verify session resets
10. New scan of same QR starts a fresh session (no old orders shown)
11. Verify existing cashier manual billing still works (no regressions)
