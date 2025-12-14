"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoLocationSharp } from 'react-icons/io5';
// Images are now in public/assets/products/ folder
const GHero = "/assets/products/pie_besar_11.jpg";
const Gambar1 = "/assets/products/hbd_1.jpg";
const Gambar2 = "/assets/products/hbd_3jpg.jpg";
const Gambar3 = "/assets/products/pie_besar_2.jpg";
const Gambar4 = "/assets/products/pie_buah_2.jpg";
const FGambar = "/assets/products/footer.jpg";



// Type untuk produk
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string | null;
  category: {
    name: string;
  };
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      console.log('📦 API Response:', data);
      console.log('📦 Is Array?', Array.isArray(data));

      // ✅ Cek apakah data adalah array
      if (Array.isArray(data)) {
        setFeaturedProducts(data.slice(0, 6));
      } else if (data && data.error) {
        // Kalau API return error
        console.error('❌ API Error:', data.error);
        setFeaturedProducts([]);
      } else {
        console.error('❌ Invalid data format:', data);
        setFeaturedProducts([]);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <div className="relative w-full h-full">
          <Image
            src={GHero}
            alt="Oppie Pie Hero"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-wider drop-shadow-lg">
              OPPIE PIE
            </h1>
            <p className="text-xl md:text-2xl text-white leading-relaxed drop-shadow-md px-4">
              Healthy pies for happy tummies<br />Healthy pies that always yummy <br /> Healthy pies that always make your day sunny
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div className="space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">OPPIE PIE</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-justify text-base md:text-lg">
                <p>
                  Oppie Pie menghadirkan fruit tart premium dengan kombinasi buah segar, krim lembut, dan pie base yang renyah. Setiap pie dibuat dengan cermat menggunakan bahan berkualitas tinggi untuk memberikan pengalaman rasa yang tak terlupakan.
                </p>
                <p>
                  Kami percaya bahwa kebahagiaan dimulai dari hal-hal sederhana. Dengan harga yang terjangkau dan rasa yang memukau, Oppie Pie hadir sebagai pilihan sempurna untuk setiap momen spesial dalam hidup Anda.
                </p>
                <p>
                  Dari perayaan ulang tahun, gathering keluarga, hingga sekadar cemilan sore hari - Oppie Pie siap menemani setiap kebahagiaan Anda dengan kelezatan yang autentik dan berkualitas.
                </p>
              </div>
            </div>

            {/* Right - Image Grid 2x2 */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src={Gambar3}
                    alt={`Oppie Pie Gallery ${index}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = '/assets/placeholder.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Middle Banner */}
      <section className="relative h-72 md:h-[500px] w-full">
        <Image
          src={Gambar1}
          alt="Oppie Pie Banner"
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-[0.3em] drop-shadow-lg">
            OPPIE PIE
          </h2>
        </div>
      </section>

      {/* Product Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="bg-black rounded-full p-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">PRODUK</h2>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="text-gray-600 mt-4">Memuat produk...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = '/assets/placeholder.jpg';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="p-5 space-y-3">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                          {product.description || 'Fruit tart premium dengan kombinasi buah segar'}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-amber-600">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Button Lihat Semua */}
              <div className="text-center">
                <Link
                  href="/menu"
                  className="inline-block px-10 py-4 bg-black text-white font-semibold text-lg rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
                >
                  Lihat Semua Produk
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#C9A06B' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <div className="bg-black rounded-full p-4 flex-shrink-0 shadow-lg">
              <IoLocationSharp className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Oppie Pie Store Location
            </h2>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left - Map */}
            <div className="w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2977654326447!2d110.44184931477457!3d-7.054729594866895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708c5b36e6c5f9%3A0x5c2b7e8c8e8c8e8c!2sKlipang%20Pesona%20Asri%203!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Right - Info */}
            <div className="space-y-8 bg-white p-8 lg:p-10 rounded-xl shadow-2xl">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Jawa Tengah, Semarang
                </h3>
                <div className="space-y-4 text-gray-700 text-base md:text-lg">
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Alamat:</p>
                    <p className="leading-relaxed">
                      Klipang Pesona Asri 3 Blk. B No.66,<br />
                      Sendangmulyo, Kec. Tembalang,<br />
                      Kota Semarang, Jawa Tengah 50272
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Jam Operasional:</p>
                    <p>Senin - Minggu: 09.00 - 20.00 WIB</p>
                  </div>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir//Klipang+Pesona+Asri+3,+Sendangmulyo,+Tembalang,+Semarang+City,+Central+Java/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
              >
                How to Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="relative h-72 md:h-[500px] w-full">
        <Image
          src={FGambar}
          alt="Oppie Pie Collection"
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-[0.3em] drop-shadow-lg">
            OPPIE PIE
          </h2>
        </div>
      </section>
    </>
  );
}
