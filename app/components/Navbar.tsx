"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoStorefrontOutline, IoCartOutline, IoPersonOutline } from 'react-icons/io5';
const Logo = "/assets/logo-Photoroom.png";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user?.role === 'ADMIN') {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Nama Toko */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {/* Gambar Logo */}
            <div className="relative w-12 h-12 md:w-14 md:h-14  rounded flex-shrink-0">
              <Image
                src={Logo}
                alt="Oppie Pie Logo"
                fill
                className="object-cover rounded"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.backgroundColor = '#e5e7eb';
                }}
              />
            </div>

            {/* Nama Toko */}
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide">
              OPPIE PIE
            </span>
          </Link>

          {/* Ikon di Sebelah Kanan */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Ikon Store */}
            <Link
              href="/menu"
              className="hover:scale-110 transition-transform"
              aria-label="Store"
            >
              <IoStorefrontOutline className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
            </Link>

            {/* Ikon Cart */}
            <Link
              href="/cart"
              className="hover:scale-110 transition-transform"
              aria-label="Cart"
            >
              <IoCartOutline className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
            </Link>

            {/* Ikon User */}
            <Link
              href={isAdmin ? "/admin/dashboard" : "/profile"}
              className="hover:scale-110 transition-transform"
              aria-label={isAdmin ? "Admin Dashboard" : "User Profile"}
            >
              <IoPersonOutline className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;