"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoArrowBack, IoClose } from 'react-icons/io5';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function CartPage() {
  const router = useRouter(); // hook navigasi
  // ambil data keranjang dari context global
  const { cart, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <>
      <Navbar />

      {/* Cart Content */}
      <div className="bg-gray-50 min-h-screen pb-8 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          {/* Page Title */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              aria-label="Go back"
            >
              <IoArrowBack className="w-7 h-7 text-gray-800" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-xl text-gray-500 mb-4">Keranjang Anda kosong</p>
              <Link
                href="/menu"
                className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                Belanja Sekarang
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-4 mb-6">
                {/* mapping setiap item dalam cart untuk ditampilkan */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-4 flex gap-4 relative"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.category} • {item.size}
                        </p>
                        <div className="inline-block px-3 py-1 bg-black text-white rounded text-sm font-medium">
                          Qty : {item.qty}
                        </div>
                      </div>
                      <p className="font-bold text-lg md:text-xl text-gray-900 mt-2">
                        Rp {(item.price * item.qty).toLocaleString('id-ID')},00
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 hover:bg-gray-100 p-1 rounded-full transition-colors"
                      aria-label="Remove item"
                    >
                      <IoClose className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Item</span>
                  <span className="text-sm font-medium text-gray-900">{totalItems} item</span>
                </div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">Total Harga</span>
                  <span className="text-2xl font-bold text-amber-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-4 bg-amber-600 text-white rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors shadow-md"
                >
                  Lanjut ke Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}