import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Client } from '@/types/database';
import { createClient } from '@/lib/supabase/server-client';
import PricingCardsWrapper from "@/app/dashboard/components/pricing-cards-wrapper";
import WelcomeAboard from "@/app/dashboard/components/welcome-aboard";

interface ClientDashboardProps {
    params: Promise<{  // Note: params is a Promise in Next.js 15!
        clientId: string;
    }>;
    searchParams: Promise<{ session_id?: string; success?: string }>;
}


export default async function ClientDashboard({
                                                  params, searchParams
                                              }: ClientDashboardProps) {
    // AWAIT the params!
    const { clientId } = await params;
    const search = await searchParams;
    const isSuccess = search?.success === 'true' || !!search?.session_id;

    const supabaseServerClient = await createClient();

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

    if (isSuccess) {
        return (
            <WelcomeAboard clientId={clientId} />
        );
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