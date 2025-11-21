// src/components/Hero.tsx
import React from 'react';

// Anda harus mengimpor gambar seperti ini di CRA/Vite
import heroImage from '@/assets/pie_besar_11.jpg';
import pie1 from '@/assets/pie_2.jpg';
import pie2 from '@/assets/pie_besar_2.jpg';
import pie3 from '@/assets/hbd_4.jpg';

import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <section className="bg-gray-50 py-8">
      {/* Hero Banner */}
      <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg mb-8">
        <Image
          src={heroImage}
          alt="OPPIE PIE - Fresh Fruit Pie"
          className="w-full h-full object-cover brightness-90"
        />
        {/* Overlay Text */}
        <div className="absolute inset-0  bg-opacity-30 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">OPPIE PIE</h1>
          <p className="text-sm md:text-base text-center max-w-md">
            Healthy pies for happy tummies<br />
            Healthy pies that always yummy<br />
            Healthy pies that always make your day sunny
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Deskripsi */}
          <div className="md:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">OPPIE PIE</h2>
            <p className="text-gray-700 leading-relaxed">
              Oppie Pie menghadirkan Fruit Pie dan Brownie Pie dengan cita rasa spesial, cocok sebagai hantaran atau oleh-oleh untuk teman dan kerabat. Dibuat dengan bahan berkualitas dan sentuhan homemade, setiap gigitan menghadirkan kehangatan dan kebahagiaan.
            </p>
          </div>

          {/* Grid Gambar Produk */}
          <div className="md:w-1/3 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={pie1}
                  alt="Strawberry Pie"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={pie2}
                  alt="Kiwi Orange Pie"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <Image
                src={pie3}
                alt="Chocolate Strawberry Pie"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;