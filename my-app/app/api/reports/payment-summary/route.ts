import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/reports/payment-summary - Get payment mode summary
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

    // Get all orders
    const orders = await prisma.order.findMany({
      where: Object.keys(dateFilter).length > 0
        ? { createdAt: dateFilter }
        : undefined,
    });

    // Aggregate by payment mode
    const paymentSummaryMap = new Map<string, any>();

    orders.forEach((order) => {
      if (!order.paymentMode) return;

      const existing = paymentSummaryMap.get(order.paymentMode);
      const amount = parseFloat(order.totalAmount.toString());

      if (existing) {
        existing.count += 1;
        existing.totalAmount += amount;
      } else {
        paymentSummaryMap.set(order.paymentMode, {
          paymentMode: order.paymentMode,
          count: 1,
          totalAmount: amount,
        });
      }
    });

    const paymentSummary = Array.from(paymentSummaryMap.values());

    return NextResponse.json(paymentSummary);
  } catch (error) {
    console.error('Payment summary report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate payment summary report' },
      { status: 500 }
    );
  }
}
