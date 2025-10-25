// app/dashboard/[clientId]/ClientLayoutClient.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useState } from 'react';
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
    isCollapsed?: boolean;
}

function SidebarLink({ href, icon, label, highlight = false , disabled , badge = null, isCollapsed = false }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    if (disabled) {
        return (
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-gray-400 cursor-not-allowed opacity-50`}
                 title={isCollapsed ? label : undefined}
            >
                <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                    <span className="text-xl">{icon}</span>
                    {!isCollapsed && <span className="text-sm">{label}</span>}
                </div>
                {!isCollapsed && badge && (
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
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-md transition-colors ${
                isActive
                    ? 'bg-blue-50 text-blue-700'
                    : highlight
                        ? 'text-blue-600 hover:bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
            }`}
            title={isCollapsed ? label : undefined}
        >
            <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
                <span className="text-xl">{icon}</span>
                {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
            </div>
            {!isCollapsed && badge && (
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
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
        const planConfig = {
            none: { label: 'No Plan', className: 'bg-gray-100 text-gray-700 border border-gray-300' },
            basic: { label: 'Basic Plan', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
            pro: { label: 'Professional', className: 'bg-purple-100 text-purple-700 border border-purple-200' },
            premium: { label: 'Premium Plan', className: 'bg-amber-100 text-amber-700 border border-amber-200' }
        };

        const config = planConfig[planType || 'none'];
        return (
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-md ${config.className}`}>
                {config.label}
            </span>
        );
    };

    // Status badge helper
    const getStatusBadge = () => {
        if (planType === 'none' || !status) return null;

        const statusConfig = {
            trialing: { label: 'Trial', className: 'bg-green-100 text-green-700 border border-green-200' },
            active: { label: 'Active', className: 'bg-green-100 text-green-700 border border-green-200' },
            past_due: { label: 'Past Due', className: 'bg-red-100 text-red-700 border border-red-200' },
            cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-700 border border-gray-200' }
        };

        const config = statusConfig[status];
        return config ? (
            <span className={`px-3 py-1.5 text-xs font-semibold rounded-md ${config.className}`}>
                {config.label}
            </span>
        ) : null;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="text-black text-2xl font-bold">
                                <svg className="h-7 w-7" viewBox="0 0 179.25 108.52" fill="currentColor">
                                    <path fillRule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                                    <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                    <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                </svg>
                            </div>
                            <span className="text-black text-xl font-semibold">WidgetWise</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Plan and Status Display */}
                            <div className="flex items-center gap-2">
                                {getPlanDisplay()}
                                {getStatusBadge()}
                            </div>

                            {/* Show upgrade prompt if no plan */}
                            {planType === 'none' && (
                                <Link
                                    href={`/dashboard/${clientId}/subscription`}
                                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Start Free Trial
                                </Link>
                            )}

                            {/* Feedback Button */}
                            <Link
                                href={`/contact?from=dashboard&clientId=${clientId}`}
                                className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                            >
                                Give Feedback
                            </Link>

                            <button
                                onClick={() => router.push('/dashboard/logout')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
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
                <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r transition-all duration-300 ease-in-out`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            {!isSidebarCollapsed && (
                                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Management
                                </h2>
                            )}
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isSidebarCollapsed ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    )}
                                </svg>
                            </button>
                        </div>
                        <nav className="space-y-1">
                            <SidebarLink
                                href={`/dashboard/${clientId}`}
                                icon="🏠"
                                label="Overview"
                                isCollapsed={isSidebarCollapsed}
                            />

                            <SidebarLink
                                href={hasFeature('agent_config')
                                    ? `/dashboard/${clientId}/agent-config`
                                    : `/dashboard/${clientId}/subscription`}
                                icon="🤖"
                                label="Agent Config"
                                disabled={!hasFeature('agent_config')}
                                badge={planType === 'none' ? 'Requires Plan' : (!isActive ? 'Inactive' : null)}
                                isCollapsed={isSidebarCollapsed}
                            />

                            <SidebarLink
                                href={hasFeature('agent_config')
                                    ? `/dashboard/${clientId}/services`
                                    : `/dashboard/${clientId}/subscription`}
                                icon="🏷️"
                                label="Services & Pricing"
                                disabled={!hasFeature('agent_config')}
                                badge={planType === 'none' ? 'Requires Plan' : (!isActive ? 'Inactive' : null)}
                                isCollapsed={isSidebarCollapsed}
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
                                isCollapsed={isSidebarCollapsed}
                            />

                            <SidebarLink
                                href={`/dashboard/${clientId}/subscription`}
                                icon="💳"
                                label={planType === 'none' ? 'Start Trial' : 'Manage Subscription'}
                                highlight={planType === 'none'}
                                isCollapsed={isSidebarCollapsed}
                            />
                        </nav>

                        {/* Tools section */}
                        {/*{hasFeature('widget_access') && (*/}
                        {/*    <div className="mt-8">*/}
                        {/*        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">*/}
                        {/*            Tools*/}
                        {/*        </h2>*/}
                        {/*        <nav className="space-y-1">*/}
                        {/*            <SidebarLink*/}
                        {/*                href={`/dashboard/${clientId}/widget`}*/}
                        {/*                icon="💬"*/}
                        {/*                label="Widget Code"*/}
                        {/*                highlight={true}*/}
                        {/*            />*/}
                        {/*        </nav>*/}
                        {/*    </div>*/}
                        {/*)}*/}
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