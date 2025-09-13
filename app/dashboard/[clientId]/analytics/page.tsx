import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Client } from '@/types/database';

interface ClientDashboardProps {
    params: Promise<{
        clientId: string;
    }>;
}

export default async function ClientDashboard({ params }: ClientDashboardProps) {
    const { clientId } = await params;

    // Fetch client data with type safety
    const { data: client, error } = await supabaseAdmin
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single<Client>();

    if (error || !client) {
        notFound(); // This will show a 404 page
    }

    // Calculate some stats (example)
    const { count: messageCount } = await supabaseAdmin
        .from('chat_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', clientId);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    {client.business_name}
                </h1>
                <p className="text-gray-600">
                    Client ID: {client.client_id} | Plan: {client.plan_type}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600">Total Messages</h3>
                    <p className="text-2xl font-bold">{messageCount || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600">Status</h3>
                    <p className="text-2xl font-bold">
                        {client.is_active ? '✅ Active' : '❌ Inactive'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DashboardLink
                    href={`/dashboard/${clientId}/instructions`}
                    icon="📝"
                    title="Instructions"
                    description="Manage chatbot personality"
                />

                <DashboardLink
                    href={`/dashboard/${clientId}/analytics`}
                    icon="📊"
                    title="Analytics"
                    description="View chat statistics"
                />

                <DashboardLink
                    href={`/dashboard/${clientId}/documents`}
                    icon="📁"
                    title="Documents"
                    description="Manage knowledge base"
                />

                <DashboardLink
                    href={`/dashboard/${clientId}/settings`}
                    icon="⚙️"
                    title="Settings"
                    description="Configure integrations"
                />
            </div>
        </div>
    );
}

// Component for dashboard links
interface DashboardLinkProps {
    href: string;
    icon: string;
    title: string;
    description: string;
}

function DashboardLink({ href, icon, title, description }: DashboardLinkProps) {
    return (
        <Link
            href={href}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
        >
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </Link>
    );
}