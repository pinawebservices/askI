import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Client } from '@/types/database';

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

    // Now you can use clientId
    const { data: client, error } = await supabase
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

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                {client.business_name}
            </h1>
            <p className="text-gray-600 mb-6">
                Client ID: {client.client_id}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                    href={`/dashboard/${clientId}/instructions`}
                    className="p-4 bg-blue-100 rounded-lg hover:bg-blue-200"
                >
                    📝 Instructions
                </Link>

                {/*<Link*/}
                {/*    href={`/dashboard/${clientId}/analytics`}*/}
                {/*    className="p-4 bg-green-100 rounded-lg hover:bg-green-200"*/}
                {/*>*/}
                {/*    📊 Analytics*/}
                {/*</Link>*/}
            </div>
        </div>
    );
}