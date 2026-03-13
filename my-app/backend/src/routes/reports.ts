import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Helper to get today's date
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// GET /api/reports/daily-sales - Get daily sales report
router.get('/daily-sales', async (req: Request, res: Response) => {
  try {
    const dateParam = req.query.date as string | undefined;
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

    res.json({
      date: targetDate,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      ordersByPaymentMode,
    });
  } catch (error) {
    console.error('Daily sales report error:', error);
    res.status(500).json({ error: 'Failed to generate daily sales report' });
  }
});

// GET /api/reports/item-sales - Get item-wise sales report
router.get('/item-sales', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

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

    res.json(itemSales);
  } catch (error) {
    console.error('Item sales report error:', error);
    res.status(500).json({ error: 'Failed to generate item sales report' });
  }
});

// GET /api/reports/payment-summary - Get payment mode summary
router.get('/payment-summary', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;

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

    res.json(paymentSummary);
  } catch (error) {
    console.error('Payment summary report error:', error);
    res.status(500).json({ error: 'Failed to generate payment summary report' });
  }
});

export default router;
