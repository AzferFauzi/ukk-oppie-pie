// app/page.tsx

import Navbar from './components/Navbar'; // Pastikan file ini ada
import Hero from './components/Hero';     // Pastikan file ini ada
import Footer from './components/Footer'; // Pastikan file ini ada

// ini adalah komponen utama halaman depan (home)
export default function Home() {
  return (
    <div>
      {/* memanggil komponen navigasi, hero banner, dan footer */}
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}