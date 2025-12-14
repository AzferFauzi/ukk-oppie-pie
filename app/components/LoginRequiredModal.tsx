"use client";

import { IoLogInOutline, IoClose } from 'react-icons/io5';
import Link from 'next/link';

interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                >
                    <IoClose className="w-6 h-6 text-gray-500" />
                </button>

                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center">
                    <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <IoLogInOutline className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                        Login Diperlukan
                    </h3>
                </div>

                {/* Content */}
                <div className="p-8 text-center">
                    <p className="text-gray-600 mb-6">
                        Silakan login terlebih dahulu untuk melanjutkan ke proses checkout.
                        Jika belum punya akun, Anda bisa mendaftar secara gratis.
                    </p>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/auth/login"
                            className="block w-full px-6 py-4 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors"
                        >
                            Login Sekarang
                        </Link>
                        <Link
                            href="/auth/register"
                            className="block w-full px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Daftar Akun Baru
                        </Link>
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                    >
                        Kembali ke Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
