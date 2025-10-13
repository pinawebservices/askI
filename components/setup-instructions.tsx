'use client';

import { useState } from 'react';
import {
    CheckCircle2,
    Circle,
    ChevronRight,
    DollarSign,
    Settings,
    Bot,
    X
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';

interface SetupStep {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    completed: boolean;
}

interface SetupInstructionsProps {
    completedSteps?: string[];
    onDismiss?: () => void;
    isDismissible?: boolean;
}

export function SetupInstructions({
                                      completedSteps = [],
                                      onDismiss,
                                      isDismissible = true
                                  }: SetupInstructionsProps) {
    const router = useRouter();
    const params = useParams();
    const clientId = params?.clientId as string;

    const [isExpanded, setIsExpanded] = useState(true);

    const steps: SetupStep[] = [
        {
            id: 'services',
            title: 'Services and Pricing',
            description: 'Define your business services, pricing, and what you offer to customers',
            icon: <DollarSign className="h-5 w-5" />,
            href: `/dashboard/${clientId}/services`,
            completed: completedSteps.includes('services')
        },
        {
            id: 'settings',
            title: 'Notification Settings',
            description: 'Configure how you want to be notified when customers contact you',
            icon: <Settings className="h-5 w-5" />,
            href: `/dashboard/${clientId}/settings`,
            completed: completedSteps.includes('settings')
        },
        {
            id: 'agent-config',
            title: 'AI Agent Configuration',
            description: 'Customize your AI agent responses and get your widget embed code',
            icon: <Bot className="h-5 w-5" />,
            href: `/dashboard/${clientId}/agent-config`,
            completed: completedSteps.includes('agent-config')
        }
    ];

    const completionPercentage = Math.round((completedSteps.length / steps.length) * 100);
    const allStepsCompleted = completedSteps.length === steps.length;

    if (!isExpanded) {
        return (
            <Card className="mb-6 border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <svg className="w-10 h-10 transform -rotate-90">
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="18"
                                        stroke="#e0e7ff"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <circle
                                        cx="20"
                                        cy="20"
                                        r="18"
                                        stroke="#3b82f6"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 18}`}
                                        strokeDashoffset={`${2 * Math.PI * 18 * (1 - completionPercentage / 100)}`}
                                        className="transition-all duration-500"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
                                    {completionPercentage}%
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Setup Progress</h3>
                                <p className="text-sm text-gray-600">
                                    {completedSteps.length} of {steps.length} steps completed
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(true)}
                        >
                            View Steps
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={`mb-6 ${allStepsCompleted ? 'border-green-200 bg-green-50/50' : 'border-blue-200 bg-blue-50/50'}`}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            {allStepsCompleted ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    Setup Complete!
                                </>
                            ) : (
                                <>
                                    <Bot className="h-5 w-5 text-blue-600" />
                                    Get Your AI Agent Live
                                </>
                            )}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {allStepsCompleted
                                ? 'Your AI agent is ready to be added to your website'
                                : 'Follow these steps to configure your AI customer service agent'
                            }
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Minimize
                        </Button>
                        {isDismissible && allStepsCompleted && onDismiss && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onDismiss}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-semibold text-gray-900">{completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`group relative flex items-start gap-4 p-4 rounded-lg transition-all cursor-pointer
                                ${step.completed
                                ? 'bg-white border border-green-200 hover:border-green-300'
                                : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm'
                            }`}
                            onClick={() => !step.completed && router.push(step.href)}
                        >
                            {/* Step Number/Check */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                ${step.completed
                                ? 'bg-green-100 text-green-600'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                            }`}>
                                {step.completed ? (
                                    <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                <div className="flex items-center gap-2">
                                    <div className={`${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                                        {step.icon}
                                    </div>
                                    <h3 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-900'}`}>
                                        {step.title}
                                    </h3>
                                    {step.completed && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            </div>

                            {/* Action */}
                            {!step.completed && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-shrink-0 group-hover:bg-blue-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(step.href);
                                    }}
                                >
                                    Configure
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Final CTA */}
                {allStepsCompleted && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-semibold text-green-900">Ready to go live!</h4>
                                <p className="text-sm text-green-700 mt-1">
                                    Get your widget embed code to add the AI agent to your website
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push(`/dashboard/${clientId}/agent-config`)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Get Embed Code
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}