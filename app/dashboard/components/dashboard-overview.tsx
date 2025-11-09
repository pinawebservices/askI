'use client';

import { useEffect, useState } from 'react';
import { SetupInstructions } from '@/components/setup-instructions';
import { useSetupProgress } from '@/hooks/use-setup-progress';
import { useSubscription } from '@/app/contexts/subscription-context';

interface DashboardOverviewProps {
    clientId: string;
    firstName?: string | null;
}

export function DashboardOverview({ clientId, firstName }: DashboardOverviewProps) {
    const { planType, status } = useSubscription();
    const { completedSteps, isLoading, checkStepCompletion } = useSetupProgress(clientId);
    const [instructionsDismissed, setInstructionsDismissed] = useState(false);

    // Check if instructions were previously dismissed
    useEffect(() => {
        const dismissed = localStorage.getItem(`instructions-dismissed-${clientId}`);
        if (dismissed === 'true') {
            setInstructionsDismissed(true);
        }
    }, [clientId]);

    // Refresh completion status when returning to this page
    useEffect(() => {
        const handleFocus = () => checkStepCompletion();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [checkStepCompletion]);

    const handleDismissInstructions = () => {
        setInstructionsDismissed(true);
        localStorage.setItem(`instructions-dismissed-${clientId}`, 'true');
    };

    // Only show instructions if user has a plan (not 'none') and hasn't dismissed them
    const shouldShowInstructions =
        planType !== 'none' &&
        !instructionsDismissed &&
        completedSteps.length < 3;

    return (
        <div>
            {/* Dashboard Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome {firstName ? firstName : 'back'}!
                </h1>
                <p className="text-gray-600 mt-2">
                    Here&apos;s what&apos;s happening with your AI agent.
                </p>
            </div>

            {/* Setup Instructions Module */}
            {shouldShowInstructions && !isLoading && (
                <SetupInstructions
                    completedSteps={completedSteps}
                    onDismiss={handleDismissInstructions}
                    isDismissible={completedSteps.length === 3}
                />
            )}

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Plan</h3>
                    <p className="text-2xl font-bold text-blue-600 capitalize">
                        {planType === 'none' ? 'No Plan' : planType}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 capitalize">
                        {status ? `Status: ${status}` : 'No active subscription'}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Progress</h3>
                    <p className="text-2xl font-bold text-green-600">{completedSteps.length}/3</p>
                    <p className="text-sm text-gray-600 mt-1">Steps completed</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Agent Status</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">
                            {completedSteps.length === 3 ? '🟢' : '🟡'}
                        </span>
                        <span className="text-xl font-bold text-gray-900">
                            {completedSteps.length === 3 ? 'Active' : 'Setup Required'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        {completedSteps.length === 3 ? 'Ready to use' : 'Complete setup to activate'}
                    </p>
                </div>
            </div>

            {/* Support Contact Message */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="text-sm text-blue-900">
                            <strong>Need Help?</strong> To get in contact with our support team, please send an email to{' '}
                            <a href="mailto:support@aiwidgetwise.com" className="underline hover:text-blue-700">
                                support@aiwidgetwise.com
                            </a>
                            {' '}and someone will contact you back as soon as possible.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}