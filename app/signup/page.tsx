// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function validatePassword(password: string): string[] {
    const errors: string[] = [];

    // Length check
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters.');
    }

    if (password.length > 36) {
        errors.push('Password must be less than 128 characters.');
    }

    // Character requirements
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter.');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter.');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number.');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character.');
    }

    // Check against common passwords (optional but good)
    const commonPasswords = ['Password123!','Password1!','P@ssword1!','P@ssword123!'];
    if (commonPasswords.includes(password.toLowerCase())) {
        errors.push('Password is too common. Please choose a more unique password.');
    }

    return errors;
}

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

    const checkPasswordStrength = (pass: string) => {
        const errors = validatePassword(pass);
        if (errors.length === 0) return 'strong';
        if (errors.length <= 2) return 'medium';
        return 'weak';
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Password validation
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
            setError(passwordErrors.join(' '));
            setLoading(false);
            return;
        }



        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        business_name: businessName,
                    },
                },
            });

            if (authError) throw authError;

            // 2. Call API to create organization (remove the direct database calls)
            if (authData.user) {
                const response = await fetch('/api/admin/create-organization', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: authData.user.id,
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        businessName: businessName,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to create organization');
                }
            }

            alert('Check your email to confirm your account!');
            router.push('/login');

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
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Start your 14-day free trial
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Business Name */}
                        <div>
                            <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                                Business Name
                            </label>
                            <input
                                id="business-name"
                                type="text"
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Acme Inc."
                            />
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    id="first-name"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    id="last-name"
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="john@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordStrength(checkPasswordStrength(e.target.value));}}
                                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                minLength={6}
                                placeholder="Enter a strong password"
                            />
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        <div className={`h-1 flex-1 rounded ${
                                            passwordStrength === 'weak' ? 'bg-red-500' :
                                                passwordStrength === 'medium' ? 'bg-yellow-500' :
                                                    'bg-green-500'
                                        }`} />
                                        <div className={`h-1 flex-1 rounded ${
                                            passwordStrength === 'medium' || passwordStrength === 'strong'
                                                ? passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                                : 'bg-gray-200'
                                        }`} />
                                        <div className={`h-1 flex-1 rounded ${
                                            passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                                        }`} />
                                    </div>
                                    <p className="text-xs mt-1 text-gray-600">
                                        {passwordStrength === 'weak' && 'Weak password'}
                                        {passwordStrength === 'medium' && 'Medium strength'}
                                        {passwordStrength === 'strong' && 'Strong password'}
                                    </p>
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                        </p>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </div>

                    <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </span>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
}