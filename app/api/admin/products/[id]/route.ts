import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, price, description, categoryId, stock, image } = body;

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                ...(name && { name }),
                ...(price && { price: parseInt(price) }),
                ...(description !== undefined && { description }),
                ...(categoryId && { categoryId: parseInt(categoryId) }),
                ...(stock !== undefined && { stock: parseInt(stock) }),
                ...(image !== undefined && { image }),
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE - Delete product
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
