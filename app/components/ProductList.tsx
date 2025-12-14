"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoStorefrontOutline } from 'react-icons/io5';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  stock: number;
  category: {
    id: number;
    name: string;
  };
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch products dari API
  useEffect(() => {
    fetchProducts();
  }, []);

  // fungsi untuk mengambil data produk dari api backend
  const fetchProducts = async (category?: string) => {
    try {
      setLoading(true);
      setError('');

      // jika ada kategori yang dipilih, tambahkan query parameter ke url
      const url = category && category !== 'All'
        ? `/api/products?category=${encodeURIComponent(category)}`
        : '/api/products';

      const response = await fetch(url);

      const data = await response.json();

      console.log('📦 API Response:', data);

      // ✅ Handle response (API return array langsung)
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        // Kalau API return { products: [...] }
        setProducts(data.products);
      } else if (data && data.error) {
        console.error('❌ API Error:', data.error);
        setError(data.error);
        setProducts([]);
      } else {
        console.error('❌ Invalid format:', data);
        setError('Format data tidak valid');
        setProducts([]);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Terjadi kesalahan saat memuat produk');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === 'All') {
      fetchProducts();
    } else if (filter === 'Small Size' || filter === 'Big Size') {
      // Untuk size filter, fetch semua lalu filter di frontend
      fetchProducts();
    } else {
      // Untuk category filter, fetch dari API
      fetchProducts(filter);
    }
  };

  // Filter buttons data
  const filters = ['All', 'Fruit Pie', 'Brownies', 'Cake', 'Small Size', 'Big Size'];

  // Determine size dari nama produk
  // fungsi logika buatan untuk menentukan ukuran produk berdasarkan namanya
  // ini digunakan karena di database tidak ada kolom khusus untuk size
  const getProductSize = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('5cm') || lowerName.includes('small')) {
      return 'Small Size';
    }
    if (lowerName.includes('6cm') || lowerName.includes('big') || lowerName.includes('20cm') || lowerName.includes('15cm')) {
      return 'Big Size';
    }
    return 'Regular';
  };

  // logika untuk memfilter produk yang sudah diambil dari api (client-side filtering untuk size)
  const filteredProducts = (() => {
    // Safety check: pastikan products adalah array
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }

    // Filter berdasarkan active filter (tombol yang diklik user)
    if (activeFilter === 'All') {
      return products;
    } else if (activeFilter === 'Small Size') {
      return products.filter(p => getProductSize(p.name) === 'Small Size');
    } else if (activeFilter === 'Big Size') {
      return products.filter(p => getProductSize(p.name) === 'Big Size');
    } else {
      // Filter by category (biasanya sudah difetch ulang, tapi ini filter tambahan di sisi klien)
      return products.filter(p => p.category?.name === activeFilter);
    }
  })();

  return (
    <div className="bg-gray-50 min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 lg:h-96 w-full mb-8">
        <Image
          src="/assets/pie_buah_3.jpg"
          alt="Store Hero"
          fill
          sizes="100vw"
          className="object-cover"
          priority
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = '/assets/placeholder.jpg';
          }}

        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-widest">
            STORE
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Menu Oppie Pie Header */}
        <div className="flex items-center gap-3 mb-6">
          <IoStorefrontOutline className="w-8 h-8 text-gray-900" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Menu Oppie Pie
          </h2>
        </div>

        {/* Divider */}
        <div className="h-1 bg-amber-600 mb-8"></div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterChange(filter)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${activeFilter === filter
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-40 md:h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  <Image
                    src={product.image || '/assets/placeholder.jpg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/placeholder.jpg';
                    }}
                  />

                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      HABIS
                    </div>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.stock} tersisa
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 md:p-4">
                  {/* Category & Size Label */}
                  <div className="flex gap-2 mb-2 text-xs">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {getProductSize(product.name)}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-sm md:text-base font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    Rp {product.price.toLocaleString('id-ID')},00
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              Tidak ada produk
            </p>
            <p className="text-gray-400 text-sm">
              {activeFilter === 'All'
                ? 'Belum ada produk yang tersedia'
                : `Tidak ada produk untuk filter "${activeFilter}"`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}