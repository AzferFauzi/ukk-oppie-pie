import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Handler untuk POST (submit pesanan)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, alamat, noHp, catatan, items, totalPrice } = body;

    // cek user login (wajib login untuk bisa order)
    let userId: number | null = null;
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (token) {
        // verifikasi token jwt
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string | number };
        userId = parseInt(String(decoded.userId));
      }
    } catch (error) {
      console.log('Invalid token');
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Anda harus login untuk melakukan pemesanan.' },
        { status: 401 }
      );
    }


    // Validasi input
    if (!nama || !alamat || !noHp || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    // gunakan transaction ($transaction) untuk operasi database yang atomik
    // artinya: jika satu langkah gagal, maka semua dibatalkan (rollback)
    // ini penting untuk memastikan stok tidak berkurang jika order gagal dibuat
    const result = await prisma.$transaction(async (tx) => {
      // 1. cek stok dulu untuk semua item yang dibeli
      for (const item of items) {
        const pId = parseInt(String(item.id));
        const pQty = parseInt(String(item.qty));

        const product = await tx.product.findUnique({
          where: { id: pId },
        });

        if (!product) {
          throw new Error(`Produk dengan ID ${item.id} tidak ditemukan`);
        }

        // jika stok kurang dari permintaan, batalkan transaksi
        if (product.stock < pQty) {
          throw new Error(`Stok produk ${product.name} tidak mencukupi. Sisa: ${product.stock}`);
        }
      }

      // 2. buat data order baru di tabel 'order'
      const newOrder = await tx.order.create({
        data: {
          userId, // relasikan dengan id user yang login
          nama,
          alamat,
          noHp,
          catatan,
          total: totalPrice,
          status: 'pending',
          items: {
            // masukkan juga detail item ke tabel 'orderitem'
            create: items.map((item: any) => ({
              productId: parseInt(String(item.id)),
              qty: parseInt(String(item.qty)),
              price: item.price,
              subtotal: item.price * parseInt(String(item.qty)),
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 3. kurangi stok produk sesuai jumlah yang dibeli
      for (const item of items) {
        await tx.product.update({
          where: { id: parseInt(String(item.id)) },
          data: {
            stock: {
              decrement: parseInt(String(item.qty)),
            },
          },
        });
      }

      return newOrder;
    });

    return NextResponse.json(
      { message: 'Pesanan berhasil disimpan', order: result },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error saat menyimpan pesanan:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal menyimpan pesanan' },
      { status: 500 }
    );
  }
}

// Handler untuk GET (ambil semua pesanan - untuk admin/debug)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('Error saat mengambil pesanan:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil pesanan' },
      { status: 500 }
    );
  }
}