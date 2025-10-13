// hooks/use-setup-progress.ts
'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';

interface SetupProgress {
    completedSteps: string[];
    isLoading: boolean;
    markStepComplete: (stepId: string) => Promise<void>;
    checkStepCompletion: () => Promise<void>;
}

export function useSetupProgress(clientId: string): SetupProgress {
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    const checkStepCompletion = useCallback(async () => {
        if (!clientId) return;

        setIsLoading(true);
        const steps: string[] = [];

        try {
            // Check if services are configured
            const { data: services } = await supabase
                .from('client_services')
                .select('id')
                .eq('client_id', clientId)
                .limit(1);

            if (services && services.length > 0) {
                steps.push('services');
            }

            // Check if notification settings are configured
            const { data: client } = await supabase
                .from('clients')
                .select('notification_email')
                .eq('client_id', clientId)
                .single();

            if (client && (client.notification_email)) {
                steps.push('settings');
            }

            // Check if AI config is set up (has instructions)
            const { data: instructions } = await supabase
                .from('client_instructions')
                .select('id')
                .eq('client_id', clientId)
                .limit(1);

            if (instructions && instructions.length > 0) {
                steps.push('agent-config');
            }

            setCompletedSteps(steps);
        } catch (error) {
            console.error('Error checking setup progress:', error);
        } finally {
            setIsLoading(false);
        }
    }, [clientId, supabase]);

    const markStepComplete = async (_stepId: string) => {
        // This is handled automatically by checking the actual data
        // but you could store explicit completion status if needed
        await checkStepCompletion();
    };

    useEffect(() => {
        checkStepCompletion();
    }, [clientId, checkStepCompletion]);

    return {
        completedSteps,
        isLoading,
        markStepComplete,
        checkStepCompletion
    };
}