'use client';

import { useEffect, useState } from 'react';
import { SetupInstructions } from '@/components/setup-instructions';
import { useSetupProgress } from '@/hooks/use-setup-progress';
import { useSubscription } from '@/app/contexts/subscription-context';

interface DashboardOverviewProps {
    clientId: string;
}

export function DashboardOverview({ clientId }: DashboardOverviewProps) {
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
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">
                    Welcome back! Here&apos;s what&apos;s happening with your AI agent.
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
        </div>
    );
}