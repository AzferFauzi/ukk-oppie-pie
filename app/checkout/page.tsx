"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginRequiredModal from '../components/LoginRequiredModal';
import OrderSuccessModal from '../components/OrderSuccessModal';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, totalItems, clearCart } = useCart();

  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    noHp: '',
    alamat: '',
    catatan: ''
  });

  // Error state
  const [errors, setErrors] = useState({
    nama: '',
    noHp: '',
    alamat: ''
  });

  // Loading & toast state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Redirect ke menu kalau cart kosong (pakai useEffect)
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/menu');
    }
  }, [cart.length, router]);

  // auth check & prefill data
  // cek apakah user sudah login, jika ya, isi otomatis data nama, nohp, alamat
  useEffect(() => {
    const checkAuthAndPrefill = async () => {
      try {
        const response = await fetch('/api/auth/me'); // endpoint cek session user
        if (!response.ok) {
          // kalau belum login, biarkan form kosong
          return;
        }

        const data = await response.json();
        if (data.user) {
          // prefill form dengan data user dari database
          setFormData(prev => ({
            ...prev,
            nama: data.user.name || '',
            noHp: data.user.noTelp || '',
            alamat: data.user.alamat || '',
          }));
        }
      } catch (error) {
        console.error(error);
        // ignore error kalau gagal fetch
      }
    };

    checkAuthAndPrefill();
  }, [router]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error saat user mulai ketik
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validasi form
  const validateForm = () => {
    const newErrors = {
      nama: '',
      noHp: '',
      alamat: ''
    };

    if (!formData.nama.trim() || formData.nama.trim().length < 3) {
      newErrors.nama = 'Nama harus diisi minimal 3 karakter';
    }

    if (!formData.noHp.trim() || formData.noHp.trim().length < 10) {
      newErrors.noHp = 'No HP harus diisi minimal 10 digit';
    } else if (!/^[0-9]+$/.test(formData.noHp.trim())) {
      newErrors.noHp = 'No HP hanya boleh berisi angka';
    }

    if (!formData.alamat.trim() || formData.alamat.trim().length < 10) {
      newErrors.alamat = 'Alamat harus diisi minimal 10 karakter';
    }

    setErrors(newErrors);
    return !newErrors.nama && !newErrors.noHp && !newErrors.alamat;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // New: Check auth before submitting
    try {
      const authResponse = await fetch('/api/auth/me');
      if (!authResponse.ok) {
        setShowLoginModal(true);
        return;
      }
    } catch (e) {
      setShowLoginModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // siapkan data pesanan
      const orderData = {
        nama: formData.nama.trim(),
        noHp: formData.noHp.trim(),
        alamat: formData.alamat.trim(),
        catatan: formData.catatan.trim() || '-',
        rasaPie: cart.map(item => `${item.name} (${item.qty}x)`).join(', '),
        jumlah: totalItems,
        totalPrice: totalPrice,
        items: cart
      };

      // kirim data ke api pesanan (simpan ke database)
      const response = await fetch('/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // 1. Prepare WhatsApp message FIRST (before clearing cart)
        const productDetails = cart.map(item =>
          `• Produk: ${item.name} ${item.size ? `(${item.size})` : ''}
• Quantity (Qty): ${item.qty} pack
• Harga per pesanan: Rp ${(item.price * item.qty).toLocaleString('id-ID')}`
        ).join('\n\n');

        // siapkan pesan whatsapp untuk notifikasi ke admin/toko
        const waMessage = `Halo Kak Oppie Pie, saya ingin melakukan pemesanan produk. Berikut detailnya:

🛒 Detail Pesanan:
${productDetails}

💰 Total Pembayaran:
Rp ${totalPrice.toLocaleString('id-ID')}

📦 Data Lengkap Pemesan:
• Nama: ${formData.nama}
• No. HP: ${formData.noHp}
• Alamat Lengkap:
${formData.alamat}
• Catatan Pesanan:
${formData.catatan ? formData.catatan : '-'}

Terima kasih Kak Oppie Pie!
Jika pesanan sudah diproses, mohon dikonfirmasi ya kak 😊`;

        // 2. Clear cart (hapus keranjang setelah sukses order)
        clearCart();

        // 3. Tampilkan modal sukses
        setShowSuccessModal(true);

        // 4. Redirect ke WhatsApp otomatis
        const encodedMessage = encodeURIComponent(waMessage);
        const waLink = `https://wa.me/6285122667568?text=${encodedMessage}`;

        setTimeout(() => {
          window.location.href = waLink;
        }, 1500);
      } else {
        const data = await response.json();
        setToast({ message: data.error || 'Gagal mengirim pesanan. Silakan coba lagi.', type: 'error' });
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setToast({ message: 'Terjadi kesalahan. Silakan coba lagi.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilkan loading kalau cart kosong (sedang redirect)
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mengalihkan ke halaman menu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => router.push('/menu')}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-gray-50 min-h-screen py-8 md:py-12 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => router.back()}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
                aria-label="Go back"
              >
                <span className="text-3xl">←</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>

          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left: Form Data Pemesan */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Data Pemesan</h2>

                <div className="space-y-5">
                  {/* Nama Lengkap */}
                  <div>
                    <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 ${errors.nama ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Masukkan nama lengkap"
                    />
                    {errors.nama && (
                      <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
                    )}
                  </div>

                  {/* No WhatsApp */}
                  <div>
                    <label htmlFor="noHp" className="block text-sm font-medium text-gray-700 mb-2">
                      No. WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="noHp"
                      name="noHp"
                      value={formData.noHp}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 ${errors.noHp ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="08123456789"
                    />
                    {errors.noHp && (
                      <p className="text-red-500 text-sm mt-1">{errors.noHp}</p>
                    )}
                  </div>

                  {/* Alamat Lengkap */}
                  <div>
                    <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="alamat"
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 resize-none ${errors.alamat ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Masukkan alamat lengkap pengiriman"
                    />
                    {errors.alamat && (
                      <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
                    )}
                  </div>

                  {/* Catatan (Optional) */}
                  <div>
                    <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-2">
                      Catatan <span className="text-gray-400 text-xs">(Opsional)</span>
                    </label>
                    <textarea
                      id="catatan"
                      name="catatan"
                      value={formData.catatan}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-900 resize-none"
                      placeholder="Contoh: Tolong kirim pagi hari"
                    />
                  </div>

                  {/* Submit Button - Mobile Only */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="lg:hidden w-full py-4 bg-amber-600 text-white rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Pesan Sekarang'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8 lg:sticky lg:top-24">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Ringkasan Pesanan</h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category} • {item.size}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-gray-600">Qty: {item.qty}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            Rp {(item.price * item.qty).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Total Items */}
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Total Item</span>
                  <span>{totalItems} item</span>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-gray-900">Total Harga</span>
                  <span className="text-2xl font-bold text-amber-600">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>

                {/* Submit Button - Desktop Only */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="hidden lg:block w-full py-4 bg-amber-600 text-white rounded-lg font-semibold text-lg hover:bg-amber-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                >
                  {isSubmitting ? 'Mengirim...' : 'Pesan Sekarang'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}