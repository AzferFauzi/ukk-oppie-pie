import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Parse URL untuk get query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    console.log('🔍 API Products called with category:', category);

    // Build where clause
    let where = {};
    if (category && category !== 'All') {
      where = {
        category: {
          name: category
        }
      };
    }

    console.log('🔍 Where clause:', JSON.stringify(where));

    // Fetch products from database
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ Fetched ${products.length} products`);

    // ✅ Return array langsung (sesuai dengan frontend)
    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    console.error('❌ API Error:', error);

    // Return error yang informatif
    return NextResponse.json(
      {
        error: 'Gagal mengambil data produk',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}