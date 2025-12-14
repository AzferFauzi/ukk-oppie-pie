"use client";

import { useEffect, useState } from 'react';
import { IoCheckmarkCircleOutline } from "react-icons/io5";

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderSuccessModal({ isOpen, onClose }: OrderSuccessModalProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            setTimeout(() => setShow(false), 300); // Animation delay
        }
    }, [isOpen]);

    if (!show && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        <IoCheckmarkCircleOutline className="w-20 h-20 text-green-500 animate-bounce" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Pesanan Berhasil!
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Terima kasih telah memesan. Kami akan mengarahkan Anda ke WhatsApp untuk konfirmasi.
                    </p>

                    <div className="flex justify-center">
                        <div className="animate-pulse flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>Membuka WhatsApp...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
