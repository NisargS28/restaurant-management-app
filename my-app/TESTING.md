# Testing & Verification Guide

## Phase 6: Testing Checklist

### 1. Database Connection Test ✓

Run this command to verify database connection:

```bash
npm run prisma:push
```

Expected: "The database is already in sync with the Prisma schema."

### 2. Seed Data Test ✓

Verify sample data is loaded:

```bash
npm run prisma:seed
```

Expected: Users, products, and sample order created successfully.

### 3. API Routes Testing

#### Test Products API

Open in browser or use curl:

- **GET all products**: http://localhost:3000/api/products
- **GET active products**: http://localhost:3000/api/products?active=true

#### Test Orders API

- **GET all orders**: http://localhost:3000/api/orders
- **GET pending orders**: http://localhost:3000/api/orders?status=PENDING

#### Test Reports API

- **Daily sales**: http://localhost:3000/api/reports/daily-sales
- **Item sales**: http://localhost:3000/api/reports/item-sales
- **Payment summary**: http://localhost:3000/api/reports/payment-summary

#### Test Users API

- **GET all users**: http://localhost:3000/api/users

### 4. User Flow Testing

#### Cashier Flow

1. **Navigate**: http://localhost:3000
2. **Click**: "CASHIER" card
3. **Test Order Placement**:
   - Click on products to add to cart
   - Adjust quantities using +/- buttons
   - Remove items using × button
   - Select payment mode (CASH/UPI/CARD)
   - Click "Place Order"
   - Verify success message with order number
   - Check cart is cleared

4. **Test Product Management**:
   - Click "Manage Products" tab
   - Click "Add Product" button
   - Fill form: Name, Price, Category
   - Click "Create"
   - Verify product appears in grid
   - Click "Edit" on a product
   - Update details and save
   - Click "Disable" on a product
   - Verify product shows as "Inactive"
   - Click "Enable" to reactivate

5. **Test Reports**:
   - Click "View Reports"
   - Check "Daily Sales" tab
   - Select date and load report
   - Verify total orders and revenue display
   - Check "Item-wise Sales" tab
   - Select date range and load
   - Verify product sales table
   - Check "Payment Summary" tab
   - Verify payment mode breakdown

#### Kitchen Flow

1. **Navigate**: http://localhost:3000
2. **Click**: "KITCHEN" card
3. **Test Order Management**:
   - Verify orders are visible (no prices shown)
   - Check order items show quantity only
   - Click "Mark as PREPARING" on a pending order
   - Verify order status changes
   - Continue updating: PREPARING → READY → COMPLETED
   - Verify completed orders disappear from active list

4. **Test Filters**:
   - Click "All" - see all active orders
   - Click "Pending" - see only pending orders
   - Click "Preparing" - see only preparing orders
   - Click "Ready" - see only ready orders

5. **Test Auto-refresh**:
   - Keep kitchen page open
   - In another tab, place an order as cashier
   - Return to kitchen page
   - Verify new order appears within 5 seconds (auto-refresh)
   - Toggle "Auto-refresh" checkbox to disable/enable

### 5. Integration Testing

#### Complete Order Lifecycle

1. **As Cashier**: Place a new order
2. **As Kitchen**:
   - See the order appear
   - Update status: PENDING → PREPARING
3. **As Kitchen**: Update status: PREPARING → READY
4. **As Kitchen**: Update status: READY → COMPLETED
5. **As Cashier**: Check reports to see the order reflected

#### Product Lifecycle

1. **As Cashier**: Add a new product
2. **As Cashier**: Use the product in an order
3. **As Cashier**: Disable the product
4. **As Cashier**: Verify disabled product doesn't appear in order tab
5. **As Cashier**: Re-enable the product
6. **As Cashier**: Verify it appears again in order tab

### 6. Edge Cases Testing

#### Empty States

- [ ] Empty cart shows "Cart is empty"
- [ ] No orders in kitchen shows "No orders to display"
- [ ] Reports with no data show appropriate messages

#### Validation

- [ ] Cannot place order with empty cart
- [ ] Cannot create product without name
- [ ] Cannot create product with price ≤ 0
- [ ] Cannot create product without category

#### Error Handling

- [ ] API errors show alert messages
- [ ] Loading states appear during async operations
- [ ] Buttons disabled during processing

### 7. UI/UX Testing

#### Responsive Design

- [ ] Test on desktop (1920px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)

#### Touch-Friendly

- [ ] Buttons are large enough for touch
- [ ] Product cards clickable
- [ ] Cart controls easy to use

#### Visual Feedback

- [ ] Active tab highlighted
- [ ] Hover states on buttons
- [ ] Status badges colored correctly
- [ ] Payment mode selection shows active state

### 8. Performance Testing

#### Load Time

- [ ] Home page loads < 1s
- [ ] Cashier dashboard loads < 2s
- [ ] Kitchen page loads < 2s
- [ ] Reports load < 3s

#### API Response Time

- [ ] Products API responds < 500ms
- [ ] Orders API responds < 500ms
- [ ] Reports API responds < 1s

## Test Results Template

Record your test results:

```
Date: [YYYY-MM-DD]
Tester: [Your Name]

✅ Database Connection: PASS
✅ Seed Data: PASS
✅ API Routes: PASS
✅ Cashier Flow: PASS
✅ Kitchen Flow: PASS
✅ Integration Test: PASS
⚠️ Edge Cases: [Note any issues]
✅ UI/UX: PASS
✅ Performance: PASS

Issues Found:
1. [Description]
2. [Description]

Overall: READY FOR PRODUCTION / NEEDS FIXES
```

## Quick Test Commands

Test API endpoints from terminal:

```bash
# Test products endpoint
curl http://localhost:3000/api/products

# Test orders endpoint
curl http://localhost:3000/api/orders

# Test daily sales
curl http://localhost:3000/api/reports/daily-sales

# Create a test product (POST)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","price":50,"category":"Test"}'

# Create a test order (POST)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":1,"quantity":2,"price":20}],"totalAmount":40,"paymentMode":"CASH"}'
```

## Automated Tests (Optional)

For automated testing, consider adding:

- Jest for unit tests
- React Testing Library for component tests
- Playwright or Cypress for E2E tests

This would be a future enhancement beyond this phase.
