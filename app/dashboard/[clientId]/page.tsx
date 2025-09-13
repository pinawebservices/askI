import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Client } from '@/types/database';
import {cookies} from "next/headers";
import { PricingCards } from "@/components/landing-page/pricing-cards";
import PricingCardsWrapper from "@/app/pricing-cards-wrapper";

interface ClientDashboardProps {
    params: Promise<{  // Note: params is a Promise in Next.js 15!
        clientId: string;
    }>;
}

export default async function ClientDashboard({
                                                  params
                                              }: ClientDashboardProps) {
    // AWAIT the params!
    const { clientId } = await params;
    const supabaseServerClient = createServerComponentClient({ cookies });

    // Now you can use clientId
    const { data: client, error } = await supabaseServerClient
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single<Client>();

    if (error || !client) {
        // For testing, you might want to show what went wrong
        if (error) {
            return (
                <div className="p-6">
                    <h1>Error loading client: {clientId}</h1>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                    <Link href="/dashboard" className="text-blue-500">← Back to Dashboard</Link>
                </div>
            );
        }
        notFound();
    }

// Check if they have an active subscription
    const { data: subscription } = await supabaseServerClient
        .from('stripe_subscriptions')
        .select('*')
        .eq('organization_id', client?.organization_id)
        .single();

    // If no active subscription, show pricing
    if (!subscription || (subscription.status !== 'active' && subscription.status !== 'trialing')) {
        return (
            <div className="min-h-screen bg-white py-12">
                <PricingCardsWrapper organizationId={client.organization_id} />
            </div>
        );
    }

    // Otherwise show normal dashboard
    return (
        <div>
            {/* Your existing dashboard content */}
            <h1>Welcome to your dashboard</h1>
            <p>Current plan: {subscription.plan_type}</p>
        </div>
    );
}