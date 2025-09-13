'use client';

import { PricingCards } from '@/components/landing-page/pricing-cards';

export default function PricingCardsWrapper({ organizationId }: { organizationId: string }) {
    const handleSelectPlan = async (priceId: string) => {
        const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                priceId,
                planType: priceId
            }),
        });

        const { url } = await response.json();
        if (url) {
            window.location.href = url;
        }
    };

    return (
        <PricingCards
            mode="dashboard"
            onSelectPlan={handleSelectPlan}
            currentPlan={null}
        />
    );
}