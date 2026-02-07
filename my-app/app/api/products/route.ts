import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductFormData } from '@/lib/types';

// GET /api/products - Get all products or filter by active status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const products = await prisma.product.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: `Failed to fetch products: ${error}` },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body: ProductFormData = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    if (body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        category: body.category,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Products POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
