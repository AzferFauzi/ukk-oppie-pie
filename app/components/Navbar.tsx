'use client';

import React from 'react';
import { FaStore, FaShoppingCart, FaUser } from 'react-icons/fa';
import Link from 'next/link'; // Import Link dari Next.js
import Image from 'next/image';
import Logo from '@/assets/logo-Photoroom.png'

const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-t-4 border-blue-500 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo dengan Link ke Home */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
          alt='logo'
          src={Logo}
          className='h-10 w-10'/>
          <span className="font-bold text-lg text-gray-800">OPPIE PIE</span>
        </Link>

        {/* Icon Navigasi */}
        <div className="flex items-center space-x-4">
          <button 
            className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Toko"
          >
            <FaStore size={20} />
          </button>
          <button 
            className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Keranjang"
          >
            <FaShoppingCart size={20} />
          </button>
          <button 
            className="text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
            aria-label="Profil"
          >
            <FaUser size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;