import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// Helper to generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

// GET /api/orders - Get all orders or filter by status
// Special query: ?kitchen=true returns only APPROVED, PREPARING, READY orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const kitchenView = req.query.kitchen === 'true';

    const whereClause = kitchenView
      ? { status: { in: ['APPROVED', 'PREPARING', 'READY'] as any[] } }
      : status
      ? { status: status as any }
      : undefined;

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Orders GET error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/pending-approval - Get all pending QR orders
router.get('/pending-approval', async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        source: 'QR',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Pending approval GET error:', error);
    res.status(500).json({ error: 'Failed to fetch pending orders' });
  }
});

// POST /api/orders - Create a new order (CASHIER source)
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Validate request
    if (!body.items || body.items.length === 0) {
      res.status(400).json({ error: 'Order must have at least one item' });
      return;
    }

    if (!body.totalAmount || body.totalAmount <= 0) {
      res.status(400).json({ error: 'Total amount must be greater than 0' });
      return;
    }

    if (!body.paymentMode) {
      res.status(400).json({ error: 'Payment mode is required' });
      return;
    }

    // Create order — CASHIER orders go directly to APPROVED so kitchen sees them immediately
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        totalAmount: body.totalAmount,
        paymentMode: body.paymentMode,
        status: 'APPROVED',
        source: 'CASHIER',
        orderItems: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Orders POST error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST /api/orders/customer - Create a customer order via QR (must be defined before /:id routes)
router.post('/customer', async (req: Request, res: Response) => {
  try {
    const { tableToken, items } = req.body;

    if (!tableToken || typeof tableToken !== 'string') {
      res.status(400).json({ error: 'Table token is required' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Order must have at least one item' });
      return;
    }

    // Find the table by QR token
    const table = await prisma.table.findUnique({
      where: { qrToken: tableToken },
    });

    if (!table) {
      res.status(404).json({ error: 'Invalid table QR code' });
      return;
    }

    if (!table.isActive) {
      res.status(403).json({ error: 'This table is currently inactive' });
      return;
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity),
      0
    );

    if (totalAmount <= 0) {
      res.status(400).json({ error: 'Total amount must be greater than 0' });
      return;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        totalAmount,
        status: 'PENDING',
        source: 'QR',
        tableId: table.id,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Customer order POST error:', error);
    res.status(500).json({ error: 'Failed to create customer order' });
  }
});

// GET /api/orders/:id - Get a single order
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id as string) },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Order GET error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/orders/:id/approve - Approve a pending customer order
router.patch('/:id/approve', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id as string);

    // Verify the order exists and is PENDING
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (existingOrder.status !== 'PENDING') {
      res.status(400).json({ error: 'Only PENDING orders can be approved' });
      return;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'APPROVED' },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Order approve error:', error);
    res.status(500).json({ error: 'Failed to approve order' });
  }
});

// PATCH /api/orders/:id - Update order status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body.status) {
      res.status(400).json({ error: 'Status is required' });
      return;
    }

    const validStatuses = ['PENDING', 'APPROVED', 'PREPARING', 'READY', 'COMPLETED'];
    if (!validStatuses.includes(body.status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }

    const order = await prisma.order.update({
      where: { id: parseInt(req.params.id as string) },
      data: { status: body.status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Order PATCH error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

export default router;
