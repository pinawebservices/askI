'use client';

import { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';
import { useSubscription } from '@/app/contexts/subscription-context';

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as string;
    const { planType } = useSubscription();

    useEffect(() => {
        const handleSubscription = async () => {
            try {
                // If user has no plan, create Stripe checkout session for Basic plan trial
                if (planType === 'none') {
                    const response = await fetch('/api/stripe/checkout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            priceId: 'basic',
                            planType: 'basic',
                        }),
                    });

                    const data = await response.json();

                    if (data.url) {
                        // Redirect to Stripe Checkout
                        window.location.href = data.url;
                    } else {
                        setError(data.error || 'Failed to start checkout');
                        setLoading(false);
                    }
                    return;
                }

                // If user has a plan, redirect to Stripe Customer Portal
                const response = await fetch('/api/stripe/portal', {
                    method: 'POST',
                });

                const data = await response.json();

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    setError('Unable to access subscription management');
                    setLoading(false);
                }
            } catch (err) {
                setError('Failed to load subscription portal');
                setLoading(false);
            }
        };

        handleSubscription();
    }, [planType, router, clientId]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => router.push(`/dashboard/${clientId}`)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-6">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {planType === 'none' ? 'Starting Your Trial...' : 'Loading Subscription Portal...'}
                        </h2>
                        <p className="text-gray-600">
                            {planType === 'none'
                                ? 'Setting up your 14-day free trial'
                                : 'Redirecting to secure subscription management'}
                        </p>
                    </div>

                    {planType !== 'none' && (
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                What you can do in the portal:
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    View your current plan and billing history
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Update your payment method
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Upgrade or downgrade your plan
                                </li>
                                <li className="flex items-start">
                                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Cancel your subscription anytime
                                </li>
                            </ul>

                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-800">
                                    <strong>Note:</strong> If you cancel, your subscription will remain active until the end of your current billing period. You won't be charged again.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}