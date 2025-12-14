import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // validasi input: pastikan email dan password tidak kosong
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email dan password wajib diisi' },
                { status: 400 }
            );
        }

        // cari user di database berdasarkan email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Email atau password salah' },
                { status: 401 }
            );
        }

        // cek apakah password yang dikirim cocok dengan yang di database
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Email atau password salah' },
                { status: 401 }
            );
        }

        // User can be either ADMIN or USER
        // No role restriction for login

        // buat token jwt untuk sesi login user
        // token ini nanti disimpan di cookie browser agar user tetap login
        const token = await signToken({
            userId: user.id.toString(),
            email: user.email,
            role: user.role,
        });

        // simpan token ke dalam cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true, // aman, tidak bisa dibaca javascript client
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // token berlaku selama 7 hari
            path: '/',
        });

        return NextResponse.json({
            message: 'Login berhasil',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Terjadi kesalahan saat login' },
            { status: 500 }
        );
    }
}
