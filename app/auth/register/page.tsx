'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Redirect to login page after successful registration
            router.push('/auth/login?registered=true');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        // Implement Google OAuth signup here
        console.log('Google signup clicked');
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex pt-16 md:pt-20">
                {/* Left Side - Image */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="absolute inset-0 flex items-center justify-center p-12">
                        <div className="relative w-full h-full max-w-2xl">
                            <Image
                                src="/assets/pie_buah_4.jpg"
                                alt="Oppie Pie"
                                fill
                                className="object-contain rounded-3xl shadow-2xl"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side - Sign Up Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                    <div className="w-full max-w-md">
                        {/* Logo */}
                        <div className="flex items-center justify-center mb-8">
                            <Image
                                src="/assets/logo-Photoroom.png"
                                alt="Oppie Pie Logo"
                                width={60}
                                height={60}
                                className="mr-3"
                            />
                            <h1 className="text-2xl font-bold text-gray-800">OPPIE PIE</h1>
                        </div>

                        {/* Sign Up Form */}
                        <div className="bg-white">
                            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Sign Up</h2>
                            <p className="text-center text-gray-500 mb-8 text-sm">Sign up to oppie pie website</p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Input */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-[#1a1a1a]"
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all pr-12 text-[#1a1a1a]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="flex items-center my-6">
                                    <div className="flex-1 border-t border-gray-300"></div>
                                    <span className="px-4 text-sm text-gray-500">or Sign up with</span>
                                    <div className="flex-1 border-t border-gray-300"></div>
                                </div>

                                {/* Google Sign Up Button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignUp}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.8055 10.2292C19.8055 9.55156 19.7501 8.86719 19.6323 8.19531H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6177 15.0875V17.5867H16.8251C18.7175 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4" />
                                        <path d="M10.2002 20.0008C12.9527 20.0008 15.2643 19.1056 16.8321 17.5867L13.6247 15.0875C12.7434 15.6979 11.5991 16.0437 10.2072 16.0437C7.54343 16.0437 5.29098 14.2828 4.51536 11.9102H1.21094V14.4819C2.81536 17.6752 6.34106 20.0008 10.2002 20.0008Z" fill="#34A853" />
                                        <path d="M4.50852 11.9102C4.04852 10.6683 4.04852 9.33333 4.50852 8.09143V5.51953H1.21094C-0.154056 8.23333 -0.154056 11.7675 1.21094 14.4813L4.50852 11.9102Z" fill="#FBBC04" />
                                        <path d="M10.2002 3.95656C11.6698 3.93406 13.0894 4.47406 14.1641 5.47656L17.0177 2.60344C15.1738 0.890313 12.7295 -0.0354687 10.2002 -0.000781249C6.34106 -0.000781249 2.81536 2.32422 1.21094 5.51953L4.50852 8.09141C5.27731 5.71172 7.53659 3.95656 10.2002 3.95656Z" fill="#EA4335" />
                                    </svg>
                                    <span className="text-gray-700 font-medium">Sign up with Google</span>
                                </button>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Creating account...' : 'Sign up'}
                                </button>
                            </form>

                            {/* Login Link */}
                            <p className="text-center mt-6 text-sm text-gray-600">
                                Already have account?{' '}
                                <Link href="/auth/login" className="text-amber-600 hover:text-amber-700 font-semibold">
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
