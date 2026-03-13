import { Router, Request, Response } from 'express';
import { prisma } from '../prisma';

const router = Router();

// GET /api/users - Get all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(users);
  } catch (error) {
    console.error('Users GET error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
