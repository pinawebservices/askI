'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
            });

            if (error) throw error;

            setMessage('Check your email for a password reset link!');
            setEmail('');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">

            {/* Background gradient orbs - same as landing page */}
            <div className="absolute inset-0 bg-white">
                {/* Orb 1 - Top Left */}
                <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-400 opacity-20 blur-3xl" />

                {/* Orb 2 - Top Right */}
                <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-teal-400 opacity-15 blur-3xl" />

                {/* Orb 3 - Bottom Left */}
                <div className="absolute bottom-[-20%] left-[10%] w-[400px] h-[400px] rounded-full bg-purple-400 opacity-15 blur-3xl" />

                {/* Orb 4 - Center */}
                <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-cyan-300 opacity-10 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-md w-full">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8 border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your email and we&apos;ll send you a reset link
                    </p>
                </div>

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Sending...' : 'Send reset link'}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}