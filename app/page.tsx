import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero'; // Tambahkan komponen Hero

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero /> {/* Tambahkan Hero di sini */}
      {/* Konten halaman lainnya akan ditambahkan nanti */}
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Selamat datang di OPPIE PIE!</h1>
      </main>
    </div>
  );
}

export default App;