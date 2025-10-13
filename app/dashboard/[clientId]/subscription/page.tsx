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
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Redirecting to subscription management...</p>
            </div>
        </div>
    );
}