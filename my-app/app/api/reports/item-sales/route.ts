import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reports/item-sales - Get item-wise sales report
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
      dateFilter.gte.setHours(0, 0, 0, 0);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
      dateFilter.lte.setHours(23, 59, 59, 999);
    }

    // Get all order items with products
    const orderItems = await prisma.orderItem.findMany({
      where: Object.keys(dateFilter).length > 0
        ? {
            order: {
              createdAt: dateFilter,
            },
          }
        : undefined,
      include: {
        product: true,
      },
    });

    // Aggregate by product
    const itemSalesMap = new Map<number, any>();

    orderItems.forEach((item) => {
      const existing = itemSalesMap.get(item.productId);
      const revenue = parseFloat(item.price.toString()) * item.quantity;

      if (existing) {
        existing.quantitySold += item.quantity;
        existing.totalRevenue += revenue;
      } else {
        itemSalesMap.set(item.productId, {
          productId: item.productId,
          productName: item.product.name,
          category: item.product.category,
          quantitySold: item.quantity,
          totalRevenue: revenue,
        });
      }
    });

    const itemSales = Array.from(itemSalesMap.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );

    return NextResponse.json(itemSales);
  } catch (error) {
    console.error('Item sales report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate item sales report' },
      { status: 500 }
    );
  }
}
