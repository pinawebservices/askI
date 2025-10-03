'use client';

import { createContext, useContext, ReactNode } from 'react';

type PlanType = 'none' | 'basic' | 'pro' | 'premium' | null;
type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | null;

interface SubscriptionContextType {
    planType: PlanType;
    status: SubscriptionStatus;
    isActive: boolean;
    hasActivePlan: boolean;
    hasFeature: (feature: string) => boolean;
    canAccessPlan: (requiredPlan: PlanType) => boolean;
}

// Define feature gates for each plan
const FEATURE_GATES = {
    none: [],
    basic: [
        'agent_config',
        'email_notifications',
        'basic_customization',
        'standard_support'
    ],
    pro: [
        'agent_config',
        'email_notifications',
        'sms_notifications',
        'document_training',
        'industry_prompts',
        'advanced_customization',
        'priority_support',
        'analytics'
    ],
    premium: [
        'agent_config',
        'email_notifications',
        'sms_notifications',
        'document_training',
        'industry_prompts',
        'advanced_customization',
        'custom_prompts',
        'white_glove_onboarding',
        'dedicated_support',
        'analytics',
        'api_access',
        'widget_customization'
    ]
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({
                                         children,
                                         planType = 'none',
                                         status
                                     }: {
    children: ReactNode;
    planType: PlanType;
    status: SubscriptionStatus;
}) {
    // Has any plan (even if not active)
    const hasActivePlan = planType !== 'none';

    // Subscription is active during trial or when active
    const isActive = status === 'trialing' || status === 'active';

    // Check if user has access to a specific feature
    const hasFeature = (feature: string): boolean => {
        if (!isActive || !planType || planType === 'none') return false;
        return FEATURE_GATES[planType]?.includes(feature) || false;
    };

    // Check if user's plan meets minimum requirement
    const canAccessPlan = (requiredPlan: PlanType): boolean => {
        if (!isActive || !planType || planType === 'none' || !requiredPlan) return false;

        const planHierarchy = { none: 0, basic: 1, pro: 2, premium: 3 };
        return planHierarchy[planType] >= planHierarchy[requiredPlan];
    };

    return (
        <SubscriptionContext.Provider value={{
            planType,
            status,
            isActive,
            hasActivePlan,
            hasFeature,
            canAccessPlan
        }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within SubscriptionProvider');
    }
    return context;
};