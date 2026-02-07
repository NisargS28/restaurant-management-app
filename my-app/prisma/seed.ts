import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create users
  const cashier = await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Cashier User',
      role: 'CASHIER',
    },
  });

  const kitchen = await prisma.user.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Kitchen Staff',
      role: 'KITCHEN',
    },
  });

  console.log('✅ Users created:', cashier, kitchen);

  // Create sample products
  const products = [
    // Beverages
    { name: 'Masala Tea', price: 20, category: 'Beverages', isActive: true },
    { name: 'Coffee', price: 30, category: 'Beverages', isActive: true },
    { name: 'Cold Coffee', price: 50, category: 'Beverages', isActive: true },
    { name: 'Fresh Lime Soda', price: 40, category: 'Beverages', isActive: true },
    
    // Snacks
    { name: 'Samosa', price: 15, category: 'Snacks', isActive: true },
    { name: 'Vada Pav', price: 25, category: 'Snacks', isActive: true },
    { name: 'Pav Bhaji', price: 80, category: 'Snacks', isActive: true },
    { name: 'Spring Roll', price: 60, category: 'Snacks', isActive: true },
    
    // Main Course
    { name: 'Dosa', price: 50, category: 'Main Course', isActive: true },
    { name: 'Idli (2 pcs)', price: 40, category: 'Main Course', isActive: true },
    { name: 'Uttapam', price: 60, category: 'Main Course', isActive: true },
    { name: 'Paneer Sandwich', price: 70, category: 'Main Course', isActive: true },
    { name: 'Veg Fried Rice', price: 90, category: 'Main Course', isActive: true },
    
    // Desserts
    { name: 'Gulab Jamun', price: 30, category: 'Desserts', isActive: true },
    { name: 'Ice Cream', price: 40, category: 'Desserts', isActive: true },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: {},
      create: {
        ...product,
        id: products.indexOf(product) + 1,
      },
    });
  }

  console.log(`✅ Created ${products.length} products`);

  // Create a sample order
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      totalAmount: 140,
      paymentMode: 'CASH',
      status: 'COMPLETED',
      orderItems: {
        create: [
          { productId: 1, quantity: 2, price: 20 }, // 2x Masala Tea
          { productId: 5, quantity: 2, price: 15 }, // 2x Samosa
          { productId: 9, quantity: 2, price: 50 }, // 2x Dosa
        ],
      },
    },
  });

  console.log('✅ Sample order created:', order);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
