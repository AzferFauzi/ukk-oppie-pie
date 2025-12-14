"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    IoCart, IoPeople, IoStatsChart, IoTime,
    IoArrowForward, IoCube, IoWarning
} from 'react-icons/io5';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface DashboardStats {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    chartData: { name: string; total: number }[];
}

interface RecentOrder {
    id: number;
    nama: string;
    total: number;
    status: string;
    createdAt: string;
}

interface Product {
    id: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
        chartData: []
    });
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [processingOrders, setProcessingOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [cancelledOrders, setCancelledOrders] = useState(0);
    const [loading, setLoading] = useState(true);

    // ambil data statistik dari api untuk ditampilkan di dashboard
    useEffect(() => {
        const fetchData = async () => {
            try {
                // panggil 3 endpoint api secara bersamaan (parallel)
                const [statsRes, ordersRes, productsRes] = await Promise.all([
                    fetch('/api/admin/stats'),  // statistik penjualan
                    fetch('/api/pesanan'),      // data pesanan terbaru
                    fetch('/api/products')      // data total produk
                ]);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats(statsData);
                }

                if (ordersRes.ok) {
                    const ordersData: RecentOrder[] = await ordersRes.json();
                    setTotalOrders(ordersData.length);
                    // Take top 5 recent orders
                    setRecentOrders(ordersData.slice(0, 5));

                    // Count statuses
                    setPendingOrders(ordersData.filter(o => o.status === 'pending').length);
                    setProcessingOrders(ordersData.filter(o => o.status === 'processing').length);
                    setCompletedOrders(ordersData.filter(o => o.status === 'completed').length);
                    setCancelledOrders(ordersData.filter(o => o.status === 'cancelled').length);
                }

                if (productsRes.ok) {
                    const productsData = await productsRes.json();
                    setTotalProducts(productsData.length);
                }

            } catch (error) {
                console.error('Error in dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    // helper untuk warna badge status (pending=kuning, dll)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'processing': return 'text-blue-600 bg-blue-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
                <p className="text-gray-600">Selamat datang di Admin Dashboard Oppie Pie</p>
            </div>

            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Orders - Blue */}
                <div className="bg-blue-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium text-sm mb-1">Total Orders</p>
                        <h3 className="text-4xl font-bold mb-4">{totalOrders}</h3>
                        <Link href="/admin/orders" className="flex items-center text-sm font-medium hover:underline text-blue-100">
                            Lihat semua <IoArrowForward className="ml-1" />
                        </Link>
                    </div>
                    <div className="absolute top-4 right-4 text-blue-400 opacity-30 group-hover:scale-110 transition-transform">
                        <IoCart size={64} />
                    </div>
                </div>

                {/* Total Product - Green */}
                <div className="bg-green-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-green-100 font-medium text-sm mb-1">Total Product</p>
                        <h3 className="text-4xl font-bold mb-4">{totalProducts}</h3>
                        <Link href="/admin/products" className="flex items-center text-sm font-medium hover:underline text-green-100">
                            Kelola Product <IoArrowForward className="ml-1" />
                        </Link>
                    </div>
                    <div className="absolute top-4 right-4 text-green-400 opacity-30 group-hover:scale-110 transition-transform">
                        <IoCube size={64} />
                    </div>
                </div>

                {/* Pendapatan Hari Ini - Orange */}
                <div className="bg-orange-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-orange-100 font-medium text-sm mb-1">Pendapatan Hari Ini</p>
                        <h3 className="text-2xl font-bold mb-6">Rp {stats.daily.toLocaleString('id-ID')}</h3>
                        {/* Placeholder link or info */}
                        <div className="h-5"></div>
                    </div>
                    <div className="absolute top-4 right-4 text-orange-400 opacity-30 group-hover:scale-110 transition-transform">
                        <IoStatsChart size={64} />
                    </div>
                </div>

                {/* Pending Orders - Purple */}
                <div className="bg-purple-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-purple-100 font-medium text-sm mb-1">Pesanan Pending</p>
                        <h3 className="text-4xl font-bold mb-4">{pendingOrders}</h3>
                        <Link href="/admin/orders" className="flex items-center text-sm font-medium hover:underline text-purple-100">
                            Lihat detail <IoArrowForward className="ml-1" />
                        </Link>
                    </div>
                    <div className="absolute top-4 right-4 text-purple-400 opacity-30 group-hover:scale-110 transition-transform">
                        <IoTime size={64} />
                    </div>
                </div>
            </div>

            {/* Middle Section: Status Summary & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Order Summary (Left) */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Status Order</h2>
                    <div className="space-y-4">
                        <div className="bg-yellow-100 rounded-lg p-4 flex justify-between items-center text-yellow-800">
                            <span className="font-medium">Pending</span>
                            <span className="font-bold text-xl">{pendingOrders}</span>
                        </div>
                        <div className="bg-blue-100 rounded-lg p-4 flex justify-between items-center text-blue-800">
                            <span className="font-medium">Processing</span>
                            <span className="font-bold text-xl">{processingOrders}</span>
                        </div>
                        <div className="bg-green-100 rounded-lg p-4 flex justify-between items-center text-green-800">
                            <span className="font-medium">Completed</span>
                            <span className="font-bold text-xl">{completedOrders}</span>
                        </div>
                        <div className="bg-red-100 rounded-lg p-4 flex justify-between items-center text-red-800">
                            <span className="font-medium">Canceled</span>
                            <span className="font-bold text-xl">{cancelledOrders}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table (Right - Wider) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 border-b pb-2">Recent Orders</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                                    <th className="pb-3 font-semibold pl-2">Order ID</th>
                                    <th className="pb-3 font-semibold">Customer</th>
                                    <th className="pb-3 font-semibold">Total</th>
                                    <th className="pb-3 font-semibold">Status</th>
                                    <th className="pb-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500 italic">
                                            Belum ada order.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 pl-2 font-medium text-gray-900">#{order.id}</td>
                                            <td className="py-4 text-gray-600">{order.nama}</td>
                                            <td className="py-4 font-medium text-gray-900">Rp {order.total.toLocaleString('id-ID')}</td>
                                            <td className="py-4">
                                                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(order.status)} capitalize`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Quick Action */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick action</h2>
                <div className="flex gap-4">
                    {/* Not much specified, so creating a placeholder action or link */}
                    <Link href="/admin/products/new" className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
                        + Tambah Produk Baru
                    </Link>
                    <Link href="/admin/revenue" className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors">
                        Lihat Laporan Pendapatan
                    </Link>
                </div>
            </div>

            {/* Weekly Revenue Graph */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Pendapatan</h2>
                <p className="text-gray-500 text-sm mb-6">per - Minggu ini</p>

                <div className="h-[300px] w-full bg-gray-50 rounded-lg p-4">
                    {stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `Rp${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#D1D5DB"
                                    radius={[4, 4, 0, 0]}
                                    barSize={40}
                                    activeBar={{ fill: '#F97316' }} // Orange on hover/active to match design hint
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Memuat data grafik...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
