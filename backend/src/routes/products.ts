import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET /api/products - Get all products or filter by active status
router.get('/', async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active === 'true';

    const products = await prisma.product.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    res.json(products);
  } catch (error: any) {
    console.error('Products GET error:', error?.message || error);
    res.status(500).json({
      error: 'Failed to fetch products',
      details: error?.message || String(error),
    });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      res.status(400).json({ error: 'Name, price, and category are required' });
      return;
    }

    if (body.price <= 0) {
      res.status(400).json({ error: 'Price must be greater than 0' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        category: body.category,
        isActive: body.isActive ?? true,
      },
    });

    res.status(201).json(product);
  } catch (error: any) {
    console.error('Products POST error:', error?.message || error);
    res.status(500).json({
      error: 'Failed to create product',
      details: error?.message || String(error),
    });
  }
});

// GET /api/products/:id - Get a single product
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Product GET error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// PUT /api/products/:id - Update a product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      res.status(400).json({ error: 'Name, price, and category are required' });
      return;
    }

    if (body.price <= 0) {
      res.status(400).json({ error: 'Price must be greater than 0' });
      return;
    }

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: body.name,
        price: body.price,
        category: body.category,
        isActive: body.isActive,
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Product PUT error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// PATCH /api/products/:id - Toggle product active status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        isActive: body.isActive,
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Product PATCH error:', error);
    res.status(500).json({ error: 'Failed to update product status' });
  }
});

export default router;
