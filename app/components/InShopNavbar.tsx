"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IoArrowBack, IoStorefrontOutline, IoCartOutline, IoPersonOutline } from 'react-icons/io5';

export default function InShopNavbar() {
  const router = useRouter();
  const [profileLink, setProfileLink] = useState('/auth/login');

  useEffect(() => {
    // Cek token untuk update profile link
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user?.role === 'ADMIN') {
            setProfileLink('/admin/dashboard');
          } else {
            setProfileLink('/profile');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left: Back Button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              aria-label="Go back"
            >
              <IoArrowBack className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">In Shop</h1>
          </div>

          {/* Right: Navigation Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Store Icon */}
            <Link
              href="/menu"
              className="hover:scale-110 transition-transform"
              aria-label="Store"
            >
              <IoStorefrontOutline className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="hover:scale-110 transition-transform"
              aria-label="Cart"
            >
              <IoCartOutline className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
            </Link>

            {/* User Icon */}
            <Link
              href={profileLink}
              className="hover:scale-110 transition-transform"
              aria-label="User Profile"
            >
              <IoPersonOutline className="w-6 h-6 md:w-7 md:h-7 text-gray-800" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}