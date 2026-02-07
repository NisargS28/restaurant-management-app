import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTodayDate } from '@/lib/utils';
import { DailySalesReport, OrderStatus, PaymentMode } from '@/lib/types';

// GET /api/reports/daily-sales - Get daily sales report
export async function GET(request: NextRequest): Promise<NextResponse<DailySalesReport | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const targetDate: string = dateParam || getTodayDate();

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
    const totalOrders: number = orders.length;
    const totalRevenue: number = orders.reduce(
      (sum: number, order: any) => sum + parseFloat(order.totalAmount.toString()),
      0
    );

    // Group by status
    const ordersByStatus: Record<OrderStatus, number> = orders.reduce(
      (acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<OrderStatus, number>
    );

    // Group by payment mode
    const ordersByPaymentMode: Record<PaymentMode, number> = orders.reduce(
      (acc: any, order: any) => {
        if (order.paymentMode) {
          acc[order.paymentMode] = (acc[order.paymentMode] || 0) + 1;
        }
        return acc;
      },
      {} as Record<PaymentMode, number>
    );

    const report: DailySalesReport = {
      date: targetDate,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      ordersByPaymentMode,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Daily sales report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily sales report' },
      { status: 500 }
    );
  }
}
