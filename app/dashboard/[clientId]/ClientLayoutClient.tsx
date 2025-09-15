// app/dashboard/[clientId]/ClientLayoutClient.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { supabaseAdmin } from "@/lib/supabase-admin";


interface ClientLayoutClientProps {
    children: ReactNode;
    client: any; // Replace with your Client type
    clientId: string;
}

// Sidebar Link Component
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

export default function ClientLayoutClient({
                                               children,
                                               client,
                                               clientId
                                           }: ClientLayoutClientProps) {
    const router = useRouter();

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
                                {client.is_active ? '✅ Active' : '❌ Inactive'}
                            </span>
                            <span className="text-sm text-gray-500">
                                Plan: {client.plan_type || 'none'}
                            </span>
                        </div>

                        <button
                            onClick={ () =>{
                                router.push('/dashboard/logout');
                            }}
                            className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Layout with Sidebar */}
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r">
                    <div className="p-4">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                            Management
                        </h2>
                        <nav className="space-y-1">
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
                            {/*<SidebarLink*/}
                            {/*    href={`/dashboard/${clientId}/analytics`}*/}
                            {/*    icon="📊"*/}
                            {/*    label="Analytics"*/}
                            {/*/>*/}
                            {/*<SidebarLink*/}
                            {/*    href={`/dashboard/${clientId}/documents`}*/}
                            {/*    icon="📁"*/}
                            {/*    label="Documents"*/}
                            {/*/>*/}
                            {/*<SidebarLink*/}
                            {/*    href={`/dashboard/${clientId}/training`}*/}
                            {/*    icon="🎯"*/}
                            {/*    label="Training Q&A"*/}
                            {/*/>*/}
                            <SidebarLink
                                href={`/dashboard/${clientId}/settings`}
                                icon="⚙️"
                                label="Settings"
                            />
                            <SidebarLink
                                href={`/dashboard/${clientId}/subscription`}
                                icon="💳"
                                label="Manage Subscription"
                            />
                        </nav>

                        <div className="mt-8">
                            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                Tools
                            </h2>
                            <nav className="space-y-1">
                                <SidebarLink
                                    href={`/dashboard/${clientId}/widget`}
                                    icon="💬"
                                    label="Widget Code"
                                    highlight={true}
                                />
                                {/*<SidebarLink*/}
                                {/*    href={`/dashboard/${clientId}/test`}*/}
                                {/*    icon="🧪"*/}
                                {/*    label="Test Chat"*/}
                                {/*/>*/}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}