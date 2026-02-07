// Cashier page: shows product list, cart, total amount, and place order button
You are helping me build a Restaurant POS (Point of Sale) web application similar to PetPooja, focused on small fast-food shops and cafes.

Tech Stack:
- Frontend: Next.js (App Router) + React
- Styling: Tailwind CSS
- Backend: Next.js API routes (Node.js)
- Database: PostgreSQL (hosted on Supabase)
- ORM (optional): Prisma

Core Roles:
1. CASHIER
   - Can add, update, and disable products (menu management)
   - Can place orders and generate bills
   - Can select payment mode (CASH / UPI / CARD)
   - Can view sales reports

2. KITCHEN
   - Can only view incoming orders
   - Can update order status (PENDING → PREPARING → READY → COMPLETED)
   - Cannot see prices, payments, or product management

Core Database Tables:
- users(id, name, role)
- products(id, name, price, category, is_active)
- orders(id, order_number, total_amount, payment_mode, status, created_at)
- order_items(id, order_id, product_id, quantity, price)

Core Features:
- Cashier UI with menu on the left and bill/cart on the right
- Clicking a product adds it to cart and updates total
- Placing an order saves order + order_items with status = PENDING
- Kitchen screen auto-refreshes to show new orders
- Cashier can disable products instead of deleting them
- Reports include daily sales, item-wise sales, and payment-mode summary

Important Rules:
- Use simple, clean, production-ready code
- Prefer clarity over overengineering
- Do NOT use MongoDB or NoSQL
- Do NOT delete products; use is_active = false
- Assume small restaurant use case (fast UI, big buttons, minimal screens)

When generating code:
- Follow role-based access control
- Validate inputs
- Use SQL-friendly and report-friendly logic
- Keep APIs RESTful and simple
