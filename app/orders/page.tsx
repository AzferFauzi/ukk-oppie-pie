'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface OrderItem {
    id: number;
    productId: number;
    qty: number;
    price: number;
    product: {
        name: string;
    };
}

interface Order {
    id: number;
    items: OrderItem[];
    total: number;
    status: string;
    nama: string;
    alamat: string;
    noHp: string;
    catatan: string | null;
    createdAt: string;
}

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders/my-orders');
            if (!response.ok) {
                router.push('/auth/login');
                return;
            }
            const data = await response.json();
            setOrders(data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
            processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Diproses' },
            shipping: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Dikirim' },
            completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
        };

        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat pesanan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Riwayat Pesanan</h2>
                    <p className="text-gray-600">Lihat semua pesanan Anda di sini</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === 'all'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Semua
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === 'pending'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Menunggu
                    </button>
                    <button
                        onClick={() => setFilter('processing')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === 'processing'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Diproses
                    </button>
                    <button
                        onClick={() => setFilter('shipping')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === 'shipping'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Dikirim
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === 'completed'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Selesai
                    </button>
                    <button
                        onClick={() => setFilter('cancelled')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filter === 'cancelled'
                            ? 'bg-amber-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Dibatalkan
                    </button>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada pesanan</h3>
                        <p className="text-gray-500 mb-6">Anda belum memiliki pesanan dengan status ini</p>
                        <button
                            onClick={() => router.push('/menu')}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Mulai Belanja
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="p-6">
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>

                                    {/* Order Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Product Info */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                </svg>
                                                Detail Produk
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-start">
                                                    <span className="text-gray-500 w-24">Produk:</span>
                                                    <div className="flex-1">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="text-gray-800 font-medium">
                                                                {item.product.name} x {item.qty}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-gray-500 w-24">Total:</span>
                                                    <span className="text-gray-800 font-medium">Rp {order.total.toLocaleString('id-ID')}</span>
                                                </div>
                                                {order.catatan && (
                                                    <div className="flex items-start">
                                                        <span className="text-gray-500 w-24">Catatan:</span>
                                                        <span className="text-gray-800">{order.catatan}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Delivery Info */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Informasi Pengiriman
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-start">
                                                    <span className="text-gray-500 w-24">Nama:</span>
                                                    <span className="text-gray-800 font-medium">{order.nama}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-gray-500 w-24">No. HP:</span>
                                                    <span className="text-gray-800">{order.noHp}</span>
                                                </div>
                                                <div className="flex items-start">
                                                    <span className="text-gray-500 w-24">Alamat:</span>
                                                    <span className="text-gray-800">{order.alamat}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
