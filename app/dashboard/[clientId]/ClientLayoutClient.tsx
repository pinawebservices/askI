// app/dashboard/[clientId]/ClientLayoutClient.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useSubscription } from '@/app/contexts/subscription-context';

type PlanType = 'none' | 'basic' | 'pro' | 'premium';
type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | null;

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
    disabled?: boolean;
    badge?: string | null;
}

function SidebarLink({ href, icon, label, highlight = false , disabled , badge = null }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    if (disabled) {
        return (
            <div className="flex items-center justify-between px-3 py-2 text-gray-400 cursor-not-allowed opacity-50">
                <div className="flex items-center gap-3">
                    <span>{icon}</span>
                    <span className="text-sm">{label}</span>
                </div>
                {badge && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {badge}
          </span>
                )}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
                isActive
                    ? 'bg-blue-50 text-blue-700'
                    : highlight
                        ? 'text-blue-600 hover:bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
            }`}
        >
            <div className="flex items-center gap-3">
                <span>{icon}</span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            {badge && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
          {badge}
        </span>
            )}
        </Link>
    );
}

export default function ClientLayoutClient({
                                               children,
                                               client,
                                               clientId
                                           }: ClientLayoutClientProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Get subscription context
    const {
        planType,
        status,
        isActive,
        hasFeature,
        canAccessPlan
    } = useSubscription();

    // Plan display helper
    const getPlanDisplay = () => {
        const planNames = {
            none: 'No Plan',
            basic: 'Basic',
            pro: 'Professional',
            premium: 'Premium'
        };
        return planNames[planType || 'none'] || 'No Plan';
    };

    // Status badge helper
    const getStatusBadge = () => {
        if (planType === 'none' || !status) return null;

        const statusConfig = {
            trialing: { label: 'Trial', className: 'bg-blue-100 text-blue-800' },
            active: { label: 'Active', className: 'bg-green-100 text-green-800' },
            past_due: { label: 'Past Due', className: 'bg-red-100 text-red-800' },
            cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-800' }
        };

        const config = statusConfig[status];
        return config ? (
            <span className={`px-2 py-1 text-xs rounded-full ${config.className}`}>
        {config.label}
      </span>
        ) : null;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <h1 className="text-xl font-semibold">
                            {client.business_name}
                        </h1>

                        <div className="flex items-center gap-4">
                            {/* Plan and Status Display */}
                            <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${
                    planType === 'none' ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {getPlanDisplay()}
                </span>
                                {getStatusBadge()}
                            </div>

                            {/* Show upgrade prompt if no plan */}
                            {planType === 'none' && (
                                <Link
                                    href={`/dashboard/${clientId}/subscription`}
                                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Start Free Trial
                                </Link>
                            )}

                            {/* Client Status Badge */}
                            <span className={`px-2 py-1 rounded text-xs ${
                                client.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                {client.is_active ? '✅ Active' : '❌ Inactive'}
              </span>

                            <button
                                onClick={() => router.push('/dashboard/logout')}
                                className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
                            >
                                Sign Out
                            </button>
                        </div>
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
                                href={hasFeature('agent_config')
                                    ? `/dashboard/${clientId}/agent-config`
                                    : `/dashboard/${clientId}/subscription`}
                                icon="🤖"
                                label="Agent Config"
                                disabled={!hasFeature('agent_config')}
                                badge={planType === 'none' ? 'Requires Plan' : (!isActive ? 'Inactive' : null)}
                            />

                            {/*/!* Show features based on plan *!/*/}
                            {/*{canAccessPlan('pro') && (*/}
                            {/*    <>*/}
                            {/*        <SidebarLink*/}
                            {/*            href={hasFeature('document_training')*/}
                            {/*                ? `/dashboard/${clientId}/documents`*/}
                            {/*                : `/dashboard/${clientId}/subscription`}*/}
                            {/*            icon="📁"*/}
                            {/*            label="Documents"*/}
                            {/*            disabled={!hasFeature('document_training')}*/}
                            {/*            badge={!isActive ? 'Inactive' : null}*/}
                            {/*        />*/}

                            {/*        <SidebarLink*/}
                            {/*            href={hasFeature('analytics')*/}
                            {/*                ? `/dashboard/${clientId}/analytics`*/}
                            {/*                : `/dashboard/${clientId}/subscription`}*/}
                            {/*            icon="📊"*/}
                            {/*            label="Analytics"*/}
                            {/*            disabled={!hasFeature('analytics')}*/}
                            {/*            badge={!isActive ? 'Inactive' : null}*/}
                            {/*        />*/}
                            {/*    </>*/}
                            {/*)}*/}

                            {/*/!* Show as upgrade prompts for Basic users *!/*/}
                            {/*{planType === 'basic' && (*/}
                            {/*    <>*/}
                            {/*        <SidebarLink*/}
                            {/*            href={`/dashboard/${clientId}/subscription`}*/}
                            {/*            icon="📁"*/}
                            {/*            label="Documents"*/}
                            {/*            disabled={true}*/}
                            {/*            badge="Pro+"*/}
                            {/*        />*/}
                            {/*        <SidebarLink*/}
                            {/*            href={`/dashboard/${clientId}/subscription`}*/}
                            {/*            icon="📊"*/}
                            {/*            label="Analytics"*/}
                            {/*            disabled={true}*/}
                            {/*            badge="Pro+"*/}
                            {/*        />*/}
                            {/*    </>*/}
                            {/*)}*/}

                            <SidebarLink
                                href={`/dashboard/${clientId}/settings`}
                                icon="⚙️"
                                label="Settings"
                            />

                            <SidebarLink
                                href={`/dashboard/${clientId}/subscription`}
                                icon="💳"
                                label={planType === 'none' ? 'Start Trial' : 'Manage Subscription'}
                                highlight={planType === 'none'}
                            />
                        </nav>

                        {/* Tools section */}
                        {hasFeature('widget_access') && (
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
                                </nav>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {/* Upgrade/payment prompts stay the same */}
                        {planType === 'none' && !pathname.includes('/subscription') && (
                            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">
                                            Start your free trial
                                        </p>
                                        <p className="text-sm text-yellow-700 mt-1">
                                            Get 14 days free access to all Basic plan features.
                                        </p>
                                    </div>
                                    <Link
                                        href={`/dashboard/${clientId}/subscription`}
                                        className="px-4 py-2 bg-yellow-800 text-white text-sm rounded hover:bg-yellow-900"
                                    >
                                        Choose Plan
                                    </Link>
                                </div>
                            </div>
                        )}

                        {status === 'past_due' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-800">
                                    ⚠️ Your subscription payment failed. Please update your payment method.
                                    <Link
                                        href={`/dashboard/${clientId}/subscription`}
                                        className="ml-2 font-medium underline hover:no-underline"
                                    >
                                        Update Payment →
                                    </Link>
                                </p>
                            </div>
                        )}

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}