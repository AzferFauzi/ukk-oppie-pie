import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        const { name, noTelp, alamat } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(decoded.userId) },
            data: {
                name: name || null,
                noTelp: noTelp || null,
                alamat: alamat || null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                noTelp: true,
                alamat: true,
                avatar: true,
                role: true,
            },
        });

        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
