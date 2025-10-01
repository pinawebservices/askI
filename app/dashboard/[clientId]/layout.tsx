// app/dashboard/[clientId]/layout.tsx
// Remove 'use client' - this should be a server component since it's fetching data
import { notFound } from 'next/navigation';
import ClientLayoutClient from './ClientLayoutClient';
import {supabaseAdmin} from "@/lib/supabase-admin";
import {SubscriptionProvider} from "@/app/contexts/subscription-context";

interface ClientLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        clientId: string;
    }>;
}

export default async function ClientLayout({
                                               children,
                                               params
                                           }: ClientLayoutProps) {
    // AWAIT the params properly for Next.js 15
    const { clientId } = await params;
    if (!clientId) {
        return notFound();
    }

    // Fetch client data once for all pages
    const { data: client, error } = await supabaseAdmin
        .from('clients')
        .select('client_id, organization_id')
        .eq('client_id', clientId)
        .single();

    if (error || !client) {
        // #FIXME: For development/testing without database
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-4">Development Mode</h1>
                    <p>Client ID: {clientId}</p>
                    <p className="text-red-600">Client not found in database</p>
                    {children}
                </div>
            </div>
        );
    }

    // Fetch subscription data
// Fetch subscription data only if organization_id exists
    let subscription = null;
    if (client.organization_id) {
        const { data } = await supabaseAdmin
            .from('stripe_subscriptions')
            .select('*')
            .eq('organization_id', client.organization_id)
            .single();
        subscription = data;
    }

    // Default to 'none' if no subscription exists
    const planType = (subscription?.plan_type as 'none' | 'basic' | 'pro' | 'premium') || 'none';
    const status = (subscription?.status as 'trialing' | 'active' | 'past_due' | 'cancelled') || null;

    // Pass the data to a client component for interactivity
    return (
        <SubscriptionProvider planType={planType} status={status}>
        <ClientLayoutClient
            client={client}
            clientId={clientId}
        >
            {children}
        </ClientLayoutClient>
        </SubscriptionProvider>
    );
}