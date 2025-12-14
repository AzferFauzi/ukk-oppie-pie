'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface User {
    id: number;
    email: string;
    name: string | null;
    noTelp: string | null;
    alamat: string | null;
    avatar: string | null;
    role: string;
}

interface Order {
    id: number;
    items: { product: { name: string }, qty: number }[];
    status: string;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [changePasswordMode, setChangePasswordMode] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        noTelp: '',
        alamat: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUserData();
        fetchOrders();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (!response.ok) {
                router.push('/auth/login');
                return;
            }
            const data = await response.json();
            setUser(data.user);
            setFormData({
                name: data.user.name || '',
                noTelp: data.user.noTelp || '',
                alamat: data.user.alamat || '',
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            router.push('/auth/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders/my-orders');
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders.slice(0, 2)); // Only get 2 latest orders
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setUser({ ...user!, ...formData });
                setEditMode(false);
                setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Gagal memperbarui profil' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' });
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Password baru tidak cocok!' });
            return;
        }

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setChangePasswordMode(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setMessage({ type: 'success', text: 'Password berhasil diubah!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Gagal mengubah password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' });
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch('/api/auth/upload-avatar', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUser({ ...user!, avatar: data.avatarUrl });
                setMessage({ type: 'success', text: 'Foto profil berhasil diperbarui!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Gagal upload foto' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' });
        } finally {
            setUploading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat profil...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Back Button & Title */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">PROFIL</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column: Profile Info */}
                    <div>
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-32 h-32 rounded-full border border-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                                {user.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.name || 'User'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <svg className="w-16 h-16 text-black" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                                    {user.name || 'Nama Belum Diisi'}
                                </h2>
                                <p className="text-gray-600 text-lg">{user.email}</p>
                                <p className="text-gray-600 text-lg">{user.noTelp || '-'}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Alamat</h3>
                                <div className="bg-gray-100 rounded-lg p-4 text-gray-700 leading-relaxed min-h-[100px]">
                                    {user.alamat || 'Alamat belum diisi'}
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition-colors"
                                >
                                    {editMode ? 'Batal Edit' : 'Edit Profil'}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-[#C19A6B] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#A07C50] transition-colors flex items-center justify-center gap-2"
                                >
                                    Log out
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Edit Form (Conditional) */}
                        {editMode && (
                            <div className="mt-8 border-t border-gray-200 pt-8">
                                <h3 className="text-xl font-bold mb-4">Edit Profil</h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-200 rounded-lg p-3 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">No. Telephone</label>
                                        <input
                                            type="text"
                                            value={formData.noTelp}
                                            onChange={(e) => setFormData({ ...formData, noTelp: e.target.value })}
                                            className="w-full bg-gray-200 rounded-lg p-3 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Alamat</label>
                                        <textarea
                                            value={formData.alamat}
                                            onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                            className="w-full bg-gray-200 rounded-lg p-3 outline-none h-24 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-[#C19A6B] text-white py-3 rounded-lg font-bold hover:bg-[#A07C50] transition-colors"
                                    >
                                        Konfirmasi
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Aktivitas */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Aktivitas</h2>
                        <div className="border border-gray-300 rounded-lg h-[500px] overflow-y-auto p-4 bg-white">
                            {orders.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    Belum ada aktivitas
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="border-b border-gray-100 pb-4 last:border-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-900">Order #{order.id}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {order.items && order.items.length > 0
                                                            ? `${order.items[0].product.name} ${order.items.length > 1 ? `+${order.items.length - 1} lainnya` : ''}`
                                                            : 'Detail items tidak tersedia'}
                                                    </p>
                                                </div>
                                                {getStatusBadge(order.status)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
