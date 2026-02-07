# RestoPOS - Restaurant Point of Sale System

A simple and powerful POS system built for small restaurants and cafes. Manage orders, products, kitchen operations, and view sales reports all in one place.

## ✨ Features

### 👤 Cashier Role

- **Product Management**: Add, edit, and disable products
- **Order Processing**: Quick order placement with cart management
- **Payment Modes**: Support for CASH, UPI, and CARD payments
- **Sales Reports**: Daily sales, item-wise sales, and payment summaries
- **Category Organization**: Products grouped by categories for easy navigation

### 👨‍🍳 Kitchen Role

- **Order Display**: View incoming orders without prices
- **Status Management**: Update order status (PENDING → PREPARING → READY → COMPLETED)
- **Auto-Refresh**: Orders refresh automatically every 5 seconds
- **Filter Options**: Filter by order status for better workflow
- **Real-time Updates**: See new orders as they come in

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (hosted on Supabase)
- **ORM**: Prisma 5
- **Language**: TypeScript 5

## 🛠️ Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Create a `.env` file with your Supabase connection:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

**Note**: URL-encode special characters in password (e.g., `@` → `%40`).

### 3. Initialize Database

```bash
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Create database tables
npm run prisma:seed      # Add sample data
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

1. **Select Role**: Choose CASHIER or KITCHEN from home page
2. **As Cashier**: Place orders, manage products, view reports
3. **As Kitchen**: View and update order status

See [TESTING.md](TESTING.md) for detailed testing guide.

## 📁 Project Structure

```
app/              # Next.js pages and API routes
components/       # React components
lib/              # Utilities, types, and API client
prisma/           # Database schema and seed
```

## 🔧 Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database
```

## 📊 API Endpoints

- **Products**: `/api/products` - CRUD operations
- **Orders**: `/api/orders` - Order management
- **Reports**: `/api/reports/*` - Sales analytics
- **Users**: `/api/users` - User data

## 🚀 Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

---

**Made with ❤️ for small restaurants and cafes**
