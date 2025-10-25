// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ContactPage() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const clientId = searchParams.get('clientId');

    // Set default subject to Feedback if coming from dashboard, otherwise Privacy Inquiry
    const defaultSubject = from === 'dashboard' ? 'Feedback' : 'Privacy Inquiry';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: defaultSubject,
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setSuccess(true);
            setFormData({ name: '', email: '', subject: 'Privacy Inquiry', message: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white py-12 px-4">
            {/* Background gradient orbs - matching login/signup */}
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
                    {/* Header */}
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Contact Us
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Send us a message and we&apos;ll respond within 24 hours
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Message sent successfully! We&apos;ll get back to you soon.</span>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Contact Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="john@example.com"
                                />
                            </div>

                            {/* Subject */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                    Subject
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="Feedback">Feedback</option>
                                    <option value="Privacy Inquiry">Privacy Inquiry</option>
                                    <option value="Data Access Request">Data Access Request</option>
                                    <option value="Data Deletion Request">Data Deletion Request</option>
                                    <option value="Do Not Sell My Information">Do Not Sell My Information</option>
                                    <option value="General Question">General Question</option>
                                    <option value="Technical Support">Technical Support</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                                    placeholder="Please describe your inquiry..."
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    For privacy requests, please include any relevant account information
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={sending}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {sending ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </div>

                        {/* Additional info */}
                        <div className="text-center space-y-2">
                            <p className="text-xs text-gray-500">
                                You can also email us directly at{' '}
                                <a href="mailto:support@aiwidgetwise.com" className="text-blue-600 hover:text-blue-500 font-medium">
                                    support@aiwidgetwise.com
                                </a>
                            </p>
                            <p className="text-sm text-gray-600">
                                {from === 'dashboard' && clientId ? (
                                    <Link href={`/dashboard/${clientId}`} className="font-medium text-blue-600 hover:text-blue-500">
                                        ← Back to Dashboard
                                    </Link>
                                ) : (
                                    <Link href="/" className="font-medium text-blue-600 hover:text-blue-500">
                                        ← Back to home
                                    </Link>
                                )}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}