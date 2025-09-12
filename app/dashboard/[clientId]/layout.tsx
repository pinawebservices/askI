// app/dashboard/[clientId]/layout.tsx
// Remove 'use client' - this should be a server component since it's fetching data
import { notFound } from 'next/navigation';
import ClientLayoutClient from './ClientLayoutClient';
import {supabaseAdmin} from "@/lib/supabase-admin";

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

    // Fetch client data once for all pages
    const { data: client, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single();

    if (error || !client) {
        // For development/testing without database
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

    // Pass the data to a client component for interactivity
    return (
        <ClientLayoutClient client={client} clientId={clientId}>
            {children}
        </ClientLayoutClient>
    );
}