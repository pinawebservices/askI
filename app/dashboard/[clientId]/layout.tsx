// app/dashboard/[clientId]/layout.tsx
// This layout wraps ALL pages under /dashboard/[clientId]/*
'use client';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Client } from '@/types/database';

// Sidebar Link Component with active state detection
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
    children: React.ReactNode;
    params: {
        clientId: string;
    };
}

export default async function ClientLayout({
                                               children,
                                               params
                                           }: ClientLayoutProps) {
    // AWAIT the params!
    const { clientId } = await params;

    // Fetch client data once for all pages
    const { data: client, error } = await supabase
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single<Client>();

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Home */}
                        <div className="flex items-center">
                            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
                                🤖 AI Chatbot Platform
                            </Link>
                            <span className="mx-3 text-gray-400">/</span>
                            <span className="text-gray-600">{client.business_name}</span>
                        </div>

                        {/* Client Status */}
                        <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  client.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
              }`}>
                {client.is_active ? 'Active' : 'Inactive'}
              </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {client.plan_type} Plan
              </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Side Navigation */}
            <div className="flex">
                <ClientSidebar clientId={clientId} />

                {/* Main Content Area */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

// Sidebar Component
function ClientSidebar({ clientId }: { clientId: string }) {
    return (
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
            <nav className="p-4 space-y-2">
                <SidebarLink
                    href={`/dashboard/${clientId}`}
                    icon="🏠"
                    label="Overview"
                />
                <SidebarLink
                    href={`/dashboard/${clientId}/instructions`}
                    icon="📝"
                    label="Instructions"
                />
                <SidebarLink
                    href={`/dashboard/${clientId}/analytics`}
                    icon="📊"
                    label="Analytics"
                />
                <SidebarLink
                    href={`/dashboard/${clientId}/documents`}
                    icon="📁"
                    label="Documents"
                />
                <SidebarLink
                    href={`/dashboard/${clientId}/training`}
                    icon="🎓"
                    label="Training Q&A"
                />
                <SidebarLink
                    href={`/dashboard/${clientId}/settings`}
                    icon="⚙️"
                    label="Settings"
                />

                <hr className="my-4" />

                <SidebarLink
                    href={`/dashboard/${clientId}/widget`}
                    icon="💬"
                    label="Widget Code"
                    highlight
                />
            </nav>
        </aside>
    );
}

interface SidebarLinkProps {
    href: string;
    icon: string;
    label: string;
    highlight?: boolean;
}

function SidebarLink({ href, icon, label, highlight = false }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
        ${isActive
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }
        ${highlight ? 'bg-gradient-to-r from-blue-50 to-purple-50' : ''}
      `}
        >
            <span className="text-xl">{icon}</span>
            <span className="text-sm">{label}</span>
        </Link>
    );
}