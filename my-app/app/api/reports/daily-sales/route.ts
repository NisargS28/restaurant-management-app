import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTodayDate } from '@/lib/utils';

// GET /api/reports/daily-sales - Get daily sales report
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const targetDate = dateParam || getTodayDate();

    // Get start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all orders for the day
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Calculate totals
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + parseFloat(order.totalAmount.toString()),
      0
    );

    // Group by status
    const ordersByStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Group by payment mode
    const ordersByPaymentMode = orders.reduce(
      (acc, order) => {
        if (order.paymentMode) {
          acc[order.paymentMode] = (acc[order.paymentMode] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      date: targetDate,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      ordersByPaymentMode,
    });
  } catch (error) {
    console.error('Daily sales report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily sales report' },
      { status: 500 }
    );
  }
}
