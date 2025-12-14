"use client";

import { IoStatsChart } from 'react-icons/io5';

export default function RevenuePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                    <IoStatsChart size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Laporan Pendapatan</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="mb-4 text-6xl">📊</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Halaman Pendapatan Detail</h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Halaman ini akan menampilkan grafik pendapatan per minggu, per bulan, dan per tahun secara detail.
                    Fitur ini sedang dalam pengembangan.
                </p>
            </div>
        </div>
    );
}
