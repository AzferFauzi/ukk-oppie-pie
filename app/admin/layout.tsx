"use client";

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { IoHome, IoReceipt, IoFastFood, IoLogOut, IoMenu, IoClose, IoStatsChart } from 'react-icons/io5';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                router.push('/auth/login');
                return;
            }

            const data = await response.json();
            if (data.user.role !== 'ADMIN') {
                router.push('/');
                return;
            }
            setUser(data.user);
            setLoading(false);
        } catch (error) {
            router.push('/auth/login');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-[9999]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    const menuItems = [
        { icon: IoHome, label: 'Dashboard', href: '/admin/dashboard' },
        { icon: IoReceipt, label: 'Order', href: '/admin/orders' },
        { icon: IoFastFood, label: 'Product', href: '/admin/products' },
        { icon: IoStatsChart, label: 'Pendapatan', href: '/admin/revenue' }, // New item
    ];

    return (
        <div className="fixed inset-0 bg-gray-100 overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md p-4 flex items-center justify-between z-50">
                <div className="flex items-center gap-3">
                    <Image
                        src="/assets/logo-Photoroom.png"
                        alt="Logo"
                        width={36}
                        height={36}
                    />
                    <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                </div>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                >
                    {sidebarOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
                </button>
            </div>

            <div className="flex h-full pt-16 lg:pt-0">
                {/* Sidebar */}
                <aside
                    className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] text-white transition-transform duration-300 ease-in-out flex flex-col`}
                >
                    {/* Header Logo Area */}
                    <div className="py-8 bg-[#1a1a1a] border-b border-gray-800 text-center">
                        <h1 className="text-2xl font-bold tracking-wider text-white">OPPIE PIE</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            // Check exact match or sub-paths
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-4 px-6 py-4 transition-all duration-200 ${isActive
                                        ? 'bg-[#C19A6B] text-white font-medium shadow-md' // Gold background for active
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={22} />
                                    <span className="text-base">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button Area */}
                    <div className="p-6 border-t border-gray-800 bg-[#1a1a1a]">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-3 w-full px-6 py-4 bg-[#C19A6B] hover:bg-[#A07C50] text-white transition-all duration-200 shadow-lg font-medium tracking-wide"
                        >
                            <IoLogOut size={22} />
                            <span>LOGOUT</span>
                        </button>
                    </div>
                </aside>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
