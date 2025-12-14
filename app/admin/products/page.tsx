"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoTrash, IoCreate, IoAdd, IoSearch, IoCloudUpload } from 'react-icons/io5';
import ConfirmModal from '../../components/ConfirmModal';

interface Category {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string | null;
    image: string | null;
    stock: number;
    categoryId: number;
    category: Category;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        categoryId: '',
        stock: '',
        image: '',
        size: 'Regular', // Virtual field for UI
    });
    const [uploading, setUploading] = useState(false);

    // Size options
    const sizeOptions = ['Regular', 'Small Size (5cm)', 'Big Size (20cm)', 'Small Pack (4x2)', 'Big Pack (3x3)'];


    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, searchTerm, categoryFilter]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Get unique categories from products
            const response = await fetch('/api/products');
            const data = await response.json();
            if (Array.isArray(data)) {
                const uniqueCategories = Array.from(
                    new Map(data.map(p => [p.category.id, p.category])).values()
                ) as Category[];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // filter produk secara lokal di client (tanpa panggil api lagi)
    // ini lebih cepat untuk data yang tidak terlalu besar
    const filterProducts = () => {
        let filtered = products;

        // Filter by category
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category.id === parseInt(categoryFilter));
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    // fungsi upload gambar ke endpoint backend
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            // set url gambar yang dikembalikan server ke state form
            setFormData(prev => ({ ...prev, image: data.url }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Gagal mengupload gambar');
        } finally {
            setUploading(false);
        }
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            description: '',
            categoryId: categories[0]?.id.toString() || '',
            stock: '0',
            image: '',
            size: 'Regular',
        });
        setShowModal(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            categoryId: product.categoryId.toString(),
            stock: product.stock.toString(),
            image: product.image || '',
            size: 'Regular', // Reset size on edit as it's part of name
        });
        setShowModal(true);
    };

    // handler untuk submit form tambah atau edit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // tentukan endpoint dan method berdasarkan mode (edit vs create)
            const url = editingProduct
                ? `/api/admin/products/${editingProduct.id}` // PUT (Edit)
                : '/api/admin/products';                     // POST (Create)

            const method = editingProduct ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchProducts(); // refresh data tabel
                setShowModal(false);
                setSuccessMessage(editingProduct ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!');
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleDelete = async (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const response = await fetch(`/api/admin/products/${deleteId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchProducts();
                setSuccessMessage('Produk berhasil dihapus!');
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
                >
                    <IoAdd size={20} />
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No products found
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative h-48 bg-gray-100">
                                <Image
                                    src={product.image || '/assets/placeholder.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = '/assets/placeholder.jpg';
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-gray-900 text-lg">{product.name}</h3>
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                        {product.category.name}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {product.description || 'No description'}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xl font-bold text-amber-600">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Stock: {product.stock}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <IoCreate size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-medium py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <IoTrash size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name * <span className="text-xs font-normal text-gray-500 ml-2">({formData.name.length}/50)</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={50}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                                />
                            </div>

                            {/* Size Selection Helper */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Size Helper <span className="text-xs text-gray-500">(Optional: Appends size to name)</span>
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {sizeOptions.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                // Only append if not already there to avoid duplicates
                                                if (!formData.name.includes(size) && size !== 'Regular') {
                                                    setFormData(prev => ({ ...prev, name: `${prev.name} - ${size}` }));
                                                }
                                            }}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-amber-50 hover:border-amber-500 hover:text-amber-700 transition-colors"
                                        >
                                            + {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-[#1a1a1a]"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Image
                                </label>

                                <div className="space-y-4">
                                    {/* Preview */}
                                    {formData.image && (
                                        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <Image
                                                src={formData.image}
                                                alt="Preview"
                                                fill
                                                className="object-contain"
                                                onError={(e) => {
                                                    const target = e.currentTarget as HTMLImageElement;
                                                    target.src = '/assets/placeholder.jpg';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                                title="Remove Image"
                                            >
                                                <IoTrash size={16} />
                                            </button>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <div className="flex items-center gap-4">
                                        <label className={`flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${uploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-amber-500'
                                            }`}>
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploading ? (
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-2"></div>
                                                ) : (
                                                    <IoCloudUpload className="w-8 h-8 text-gray-400 mb-2" />
                                                )}
                                                <p className="text-sm text-gray-500">
                                                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                                                </p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>

                                    {/* Manual URL Input (Optional Backup) */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">or</span>
                                        <input
                                            type="text"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="Paste image URL directly"
                                            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-amber-500 outline-none text-[#1a1a1a]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-amber-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
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
                title="Hapus Produk?"
                message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
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
