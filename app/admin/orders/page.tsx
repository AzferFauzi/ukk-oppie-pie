"use client";

import { useEffect, useState } from 'react';
import { IoTrash, IoCreate, IoSearch } from 'react-icons/io5';
import ConfirmModal from '../../components/ConfirmModal';

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
    nama: string;
    alamat: string;
    noHp: string;
    total: number;
    catatan: string | null;
    status: string;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchTerm, statusFilter]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/admin/orders');
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(o =>
                o.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.items.some(item => item.product.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredOrders(filtered);
    };

    const handleEdit = (order: Order) => {
        setEditingOrder(order);
        setShowEditModal(true);
    };

    const handleUpdateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;

        try {
            const response = await fetch(`/api/admin/orders/${editingOrder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: editingOrder.status,
                    catatan: editingOrder.catatan,
                }),
            });

            if (response.ok) {
                await fetchOrders();
                setShowEditModal(false);
                setEditingOrder(null);
                setSuccessMessage('Status order berhasil diperbarui!');
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleDelete = async (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`/api/admin/orders/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchOrders();
                setSuccessMessage('Order berhasil dihapus!');
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
                <p className="text-gray-600 mt-1">Manage customer orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by customer name or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">ID</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contact</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Products</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-6 text-sm">#{order.id}</td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-900">{order.nama}</div>
                                            <div className="text-sm text-gray-500">{order.alamat}</div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">{order.noHp}</td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="text-sm">
                                                        <span className="font-medium">{item.product.name}</span>
                                                        <span className="text-gray-500"> x {item.qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.catatan && (
                                                <div className="text-xs text-gray-500 mt-1 italic">Note: {order.catatan}</div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium">
                                            Rp {order.total.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(order)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <IoCreate size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <IoTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Order #{editingOrder.id}</h2>

                        <form onSubmit={handleUpdateOrder} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer: {editingOrder.nama}
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={editingOrder.status}
                                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={editingOrder.catatan || ''}
                                    onChange={(e) => setEditingOrder({ ...editingOrder, catatan: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingOrder(null);
                                    }}
                                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title="Hapus Order?"
                message="Apakah Anda yakin ingin menghapus order ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Ya, Hapus"
                cancelText="Batal"
                type="danger"
            />

            {/* Success Modal */}
            <ConfirmModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onConfirm={() => setShowSuccessModal(false)}
                title="Berhasil!"
                message={successMessage}
                confirmText="OK"
                cancelText="Tutup"
                type="success"
            />
        </div>
    );
}
