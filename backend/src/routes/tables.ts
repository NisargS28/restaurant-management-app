import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { prisma } from '../prisma';

const router = Router();

// GET /api/tables - List all tables with active session info
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tables = await prisma.table.findMany({
      orderBy: { tableNo: 'asc' },
      include: {
        orders: {
          where: {
            source: 'QR',
          },
          include: {
            orderItems: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Compute active session info for each table
    const tablesWithSession = tables.map((table) => {
      const sessionOrders = table.orders.filter(
        (order) => new Date(order.createdAt) > new Date(table.lastSettledAt)
      );
      const sessionTotal = sessionOrders.reduce(
        (sum, order) => sum + parseFloat(order.totalAmount.toString()),
        0
      );

      return {
        ...table,
        orders: undefined, // Don't send all orders in list view
        activeSession: {
          orderCount: sessionOrders.length,
          totalAmount: sessionTotal,
        },
      };
    });

    res.json(tablesWithSession);
  } catch (error) {
    console.error('Tables GET error:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

// POST /api/tables - Create a new table
router.post('/', async (req: Request, res: Response) => {
  try {
    const { tableNo } = req.body;

    if (!tableNo || typeof tableNo !== 'string' || tableNo.trim().length === 0) {
      res.status(400).json({ error: 'Table number is required' });
      return;
    }

    // Check if table number already exists
    const existing = await prisma.table.findUnique({
      where: { tableNo: tableNo.trim() },
    });

    if (existing) {
      res.status(409).json({ error: 'Table number already exists' });
      return;
    }

    const qrToken = randomUUID();

    const table = await prisma.table.create({
      data: {
        tableNo: tableNo.trim(),
        qrToken,
      },
    });

    res.status(201).json(table);
  } catch (error) {
    console.error('Tables POST error:', error);
    res.status(500).json({ error: 'Failed to create table' });
  }
});

// GET /api/tables/:token - Get table info by QR token (public, for customer menu)
router.get('/:token', async (req: Request, res: Response) => {
  try {
    const table = await prisma.table.findUnique({
      where: { qrToken: req.params.token },
    });

    if (!table) {
      res.status(404).json({ error: 'Table not found' });
      return;
    }

    if (!table.isActive) {
      res.status(403).json({ error: 'This table is currently inactive' });
      return;
    }

    res.json(table);
  } catch (error) {
    console.error('Table GET by token error:', error);
    res.status(500).json({ error: 'Failed to fetch table' });
  }
});

// GET /api/tables/:token/session - Get current session orders for a table
router.get('/:token/session', async (req: Request, res: Response) => {
  try {
    const table = await prisma.table.findUnique({
      where: { qrToken: req.params.token },
    });

    if (!table) {
      res.status(404).json({ error: 'Table not found' });
      return;
    }

    // Get all orders since last settlement
    const sessionOrders = await prisma.order.findMany({
      where: {
        tableId: table.id,
        source: 'QR',
        createdAt: {
          gt: table.lastSettledAt,
        },
      },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalAmount = sessionOrders.reduce(
      (sum, order) => sum + parseFloat(order.totalAmount.toString()),
      0
    );

    res.json({
      table,
      orders: sessionOrders,
      totalAmount,
      orderCount: sessionOrders.length,
    });
  } catch (error) {
    console.error('Table session GET error:', error);
    res.status(500).json({ error: 'Failed to fetch table session' });
  }
});

// PATCH /api/tables/:id - Toggle table active status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      res.status(400).json({ error: 'isActive (boolean) is required' });
      return;
    }

    const table = await prisma.table.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive },
    });

    res.json(table);
  } catch (error) {
    console.error('Table PATCH error:', error);
    res.status(500).json({ error: 'Failed to update table' });
  }
});

// PATCH /api/tables/:id/settle - Settle table (cashier receives payment)
router.patch('/:id/settle', async (req: Request, res: Response) => {
  try {
    const tableId = parseInt(req.params.id);

    const table = await prisma.table.update({
      where: { id: tableId },
      data: { lastSettledAt: new Date() },
    });

    res.json({ message: 'Table settled successfully', table });
  } catch (error) {
    console.error('Table settle error:', error);
    res.status(500).json({ error: 'Failed to settle table' });
  }
});

// DELETE /api/tables/:id - Delete a table
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.table.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Table DELETE error:', error);
    res.status(500).json({ error: 'Failed to delete table' });
  }
});

export default router;
