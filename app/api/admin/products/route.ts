import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Create product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, price, description, categoryId, stock, image } = body;

        // Validation
        if (!name || !price || !categoryId) {
            return NextResponse.json(
                { error: 'Name, price, and category are required' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseInt(price),
                description: description || null,
                categoryId: parseInt(categoryId),
                stock: parseInt(stock) || 0,
                image: image || null,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
