'use client';

import { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';

export default function SubscriptionPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const params = useParams();
    const clientId = params.clientId as string;

    useEffect(() => {
        const redirectToPortal = async () => {
            try {
                const response = await fetch('/api/stripe/portal', {
                    method: 'POST',
                });

                const data = await response.json();

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    setError('Unable to access subscription management');
                }
            } catch (err) {
                setError('Failed to load subscription portal');
                setLoading(false);
            }
        };

        redirectToPortal();
    }, []);

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