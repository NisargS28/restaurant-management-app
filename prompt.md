I have an existing Restaurant Management App built with:

Frontend: React + TypeScript + Vite
Backend: Node.js + Express + Prisma
Database: PostgreSQL/MySQL (Prisma ORM)

Current Flow:
- Cashier manually creates orders.
- Orders go directly to kitchen display.
- Kitchen updates status:
  PENDING → PREPARING → READY → COMPLETED

I want to modify the system completely to support TABLE QR ORDERING.

====================================================
NEW REQUIRED FLOW
====================================================

1. Each restaurant table has a unique QR code.
2. When customer scans QR:
   - It opens a customer menu page.
3. Customer can:
   - Browse menu/products
   - Add items to cart
   - Place order directly.
4. When customer places order:
   - Order should NOT go directly to kitchen.
   - Order first goes to Cashier Dashboard.
5. Cashier reviews incoming customer orders.
6. Cashier clicks APPROVE.
7. Only after approval:
   - Order goes to Kitchen Display Queue.
8. Kitchen can then process:
   APPROVED → PREPARING → READY → COMPLETED

====================================================
DATABASE / PRISMA CHANGES REQUIRED
====================================================

Modify Prisma schema:

1. Update OrderStatus enum to:

enum OrderStatus {
  PENDING
  APPROVED
  PREPARING
  READY
  COMPLETED
}

2. Add new Table model:

model Table {
  id        Int      @id @default(autoincrement())
  tableNo   String   @unique
  qrToken   String   @unique
  isActive  Boolean  @default(true)
  orders    Order[]
}

3. Update Order model:
- Add tableId relation
- Add source/orderType field

Example:

tableId    Int?
table      Table? @relation(fields: [tableId], references: [id])

source     String @default("CASHIER")

====================================================
BACKEND API CHANGES REQUIRED
====================================================

Modify backend Express routes.

Create/Update endpoints:

1. POST /api/orders/customer
- Public route
- Accepts:
  {
    tableToken,
    items
  }
- Finds table using qrToken
- Creates order with:
    status = PENDING
    source = "QR"
    tableId linked properly

2. PATCH /api/orders/:id/approve
- Cashier-only route
- Changes:
    PENDING → APPROVED

3. PATCH /api/orders/:id/status
- Kitchen route for:
    APPROVED → PREPARING → READY → COMPLETED

4. GET /api/orders/pending-approval
- Returns all orders where status = PENDING

5. GET /api/tables/:token
- Returns table info for QR menu page

====================================================
FRONTEND CHANGES REQUIRED
====================================================

1. Create new Customer Menu Page:

Path:
   /menu/:token

Features:
- Read QR token from URL params
- Fetch products
- Fetch table details
- Display restaurant menu beautifully
- Add to cart
- Place order button
- Submit order to:
    POST /api/orders/customer

After placing:
- Show success toast:
   "Order placed successfully. Waiting for cashier approval."

====================================================
CASHIER DASHBOARD CHANGES
====================================================

Modify existing CashierPage:

Add 2 tabs/sections:

1. Manual Billing
   - Existing functionality remains.

2. Pending Customer Orders
   - Display all PENDING QR orders.
   - Show:
      Order Number
      Table Number
      Items
      Total
      Time
   - Add APPROVE button.

Approve Button:
- Calls:
   PATCH /api/orders/:id/approve

After approval:
- Remove from pending list.

====================================================
KITCHEN DISPLAY CHANGES
====================================================

Modify KitchenPage:

Kitchen should ONLY display orders where status is:

- APPROVED
- PREPARING
- READY

Kitchen should NOT display:
- PENDING orders.

Kitchen workflow:
APPROVED → PREPARING → READY → COMPLETED

====================================================
QR CODE GENERATION
====================================================

Add Admin/Table Management page:

- Create tables.
- Generate QR token.
- Display QR code for each table.
- QR should point to:
   https://yourdomain.com/menu/{qrToken}

Use npm package:
   qrcode.react OR similar.

====================================================
UI/UX REQUIREMENTS
====================================================

Make UI modern and responsive.

Customer Menu Page should:
- Look mobile-friendly.
- Card based menu design.
- Sticky cart button.
- Quantity controls.

Cashier/Kitchen dashboard:
- Maintain current styling/theme.

====================================================
IMPORTANT IMPLEMENTATION NOTES
====================================================

- Preserve all existing functionality.
- Refactor code cleanly.
- Keep TypeScript types strict.
- Update API service files.
- Update routes in App.tsx.
- Maintain proper folder structure.
- Write reusable components.
- Use proper loading/error states.
- Ensure no breaking changes.

Implement ALL code changes across backend, frontend, Prisma schema, and routes.
Return full updated code for every changed/new file.

ADDITIONAL INSTRUCTIONS:

- First analyze my existing codebase thoroughly before implementing anything.
- Do not assume file names or structure without checking.
- Modify my existing files where appropriate instead of creating unnecessary duplicates.
- Preserve all current functionality and UI styling.
- Maintain my current folder structure and architecture patterns.
- Use strict TypeScript types/interfaces for all new code.
- Reuse existing API service/util/helper files wherever possible.
- Ensure backend/frontend integration matches my current coding style.
- Do not hardcode values unnecessarily.
- Add proper validation and error handling for all new endpoints/forms.
- Keep code modular, scalable, and production-ready.

WHEN RETURNING RESPONSE:
1. First explain implementation plan briefly.
2. Then list all files that will be changed/created.
3. Then provide code for each changed/new file.
4. Mention npm packages required (if any).
5. Mention Prisma migration commands if schema changes.
6. Mention environment variable changes if needed.
7. Ensure final code has no build/lint/type errors.

IMPORTANT:
- If response is too long, split into multiple responses automatically and continue.
- Do not skip any file needed for complete implementation.
- Return complete code for changed files only.