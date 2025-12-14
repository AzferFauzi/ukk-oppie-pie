"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import InShopNavbar from '../../components/InShopNavbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';

// Product data fetched from API now

// halaman detail produk dinamis, [id] berarti halaman ini bisa menangkap id produk dari url
export default function ProductDetailPage() {
  const params = useParams(); // hook untuk mengambil parameter [id] dari url
  const productId = Number(params.id);
  const { addToCart } = useCart(); // hook custom untuk fungsi keranjang belanja

  // State
  const [product, setProduct] = useState<any | null>(null); // Using any for flexibility or define interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  // Helper untuk size (sama dengan ProductList logic)
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

  // Fetch product data
  // fetch data detail produk ketika komponen dimuat atau id berubah
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // panggil api untuk satu produk spesifik
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          throw new Error('Produk tidak ditemukan');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Produk tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setLoading(false);
      setError('ID Invalid');
    }
  }, [productId]);

  // Handler untuk + dan -
  // Handler untuk + dan -
  // fungsi tombol tambah dan kurang quantity
  const handleIncrease = () => {
    // cek stok dulu sebelum menambah
    if (product && qty < product.stock) {
      setQty(prev => prev + 1);
    }
  };
  const handleDecrease = () => {
    // minimal beli 1
    if (qty > 1) setQty(prev => prev - 1);
  };

  // Handler untuk Add to Cart
  // fungsi masukkan barang ke keranjang global
  const handleAddToCart = () => {
    if (product) {
      // panggil fungsi dari CartContext
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category?.name || 'Uncategorized',
          size: getProductSize(product.name), // tentukan size otomatis
        },
        qty
      );
      // tampilkan notifikasi sukses (toast)
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // Kalkulasi total harga
  const totalPrice = product ? product.price * qty : 0;

  if (loading) {
    return (
      <>
        <InShopNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  // Kalau produk tidak ditemukan
  if (error || !product) {
    return (
      <>
        <InShopNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Produk tidak ditemukan</p>
            <button
              onClick={() => window.location.href = '/menu'}
              className="text-amber-600 hover:underline"
            >
              Kembali ke Menu
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <InShopNavbar />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-5 rounded-xl shadow-2xl flex items-center gap-4 border border-green-400">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <p className="font-bold text-lg">Berhasil!</p>
              <p className="text-sm text-green-100">Produk ditambahkan ke cart</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 min-h-screen pt-20 md:pt-24 py-4 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-12 lg:px-16">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-12">
              {/* Left: Product Image */}
              <div className="relative h-64 md:h-[500px] lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.image || '/assets/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = '/assets/placeholder.jpg';
                  }}
                />
              </div>

              {/* Right: Product Info */}
              <div className="flex flex-col justify-between">
                {/* Product Name */}
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                    {product.name}
                  </h1>

                  {/* Rating Stars */}
                  <div className="flex gap-1 md:gap-2 mb-4 md:mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl md:text-2xl">★</span>
                    ))}
                  </div>

                  {/* Category Tags */}
                  <div className="flex gap-2 md:gap-3 mb-6 md:mb-8">
                    <span className="px-4 md:px-6 py-2 md:py-3 bg-gray-100 text-gray-700 rounded-full text-sm md:text-base font-medium">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                    <span className="px-4 md:px-6 py-2 md:py-3 bg-gray-100 text-gray-700 rounded-full text-sm md:text-base font-medium">
                      {getProductSize(product.name)}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6 md:mb-10">
                    <p className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900">
                      Rp {totalPrice.toLocaleString('id-ID')},-
                    </p>
                    {qty > 1 && (
                      <p className="text-sm md:text-base text-gray-500 mt-2">
                        Rp {product.price.toLocaleString('id-ID')},- x {qty}
                      </p>
                    )}
                  </div>

                  {/* Description if available */}
                  {product.description && (
                    <div className="mb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {/* Stock Info */}
                  <div className="mb-6">
                    <p className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `Stok Tersedia: ${product.stock}` : 'Stok Habis'}
                    </p>
                  </div>
                </div>

                {/* Quantity Counter */}
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-4 md:gap-6">
                    <button
                      onClick={handleDecrease}
                      className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xl md:text-2xl font-bold"
                      disabled={qty <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={qty}
                      onChange={(e) => {
                        let value = parseInt(e.target.value) || 1;
                        if (value > product.stock) value = product.stock;
                        if (value < 1) value = 1;
                        setQty(value);
                      }}
                      className="w-20 h-10 md:w-32 md:h-16 text-center border-2 border-gray-300 rounded-lg text-lg md:text-2xl font-semibold focus:outline-none focus:border-amber-500"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={handleIncrease}
                      className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-xl md:text-2xl font-bold"
                      disabled={qty >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className={`w-full py-3 md:py-5 rounded-lg font-semibold text-lg md:text-xl transition-colors shadow-md ${product.stock > 0
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}