'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PricingCardsProps {
    mode?: 'landing' | 'dashboard';
    onSelectPlan?: (priceId: string) => Promise<void>;
    currentPlan?: string | null;
}

const plans = [
    {
        id: 'basic',
        name: "Basic",
        price: "$97",
        description: "Perfect for small businesses getting started with AI automation",
        features: [
            "1,000 conversations per month",
            "Email notifications for new leads",
            "Basic AI agent customization",
            "Standard email support",
            "Simple analytics dashboard"
        ],
        popular: false,
    },
    {
        id: 'pro',
        name: "Professional",
        price: "$197",
        description: "Ideal for growing businesses needing advanced features",
        features: [
            "5,000 conversations per month",
            "Email + SMS notifications",
            "Google Drive document training",
            "Advanced customization options",
            "Priority support",
            "Detailed analytics & insights",
            "Lead scoring & qualification"
        ],
        popular: true,
    },
    {
        id: 'premium',
        name: "Premium",
        price: "$497",
        description: "For enterprises requiring unlimited scale and white-glove service",
        features: [
            "Unlimited conversations",
            "All notification channels",
            "White-glove onboarding",
            "Custom integrations",
            "Dedicated account manager",
            "Custom AI training",
            "API access",
            "SLA guarantee"
        ],
        popular: false,
    },
];

export function PricingCards({ mode = 'landing', onSelectPlan, currentPlan }: PricingCardsProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleSelectPlan = async (planId: string, planPrice: string) => {
        if (mode === 'landing') {
            router.push('/signup');
        } else if (mode === 'dashboard' && onSelectPlan) {
            setLoading(planId);
            try {
                await onSelectPlan(planId);
            } catch (error) {
                console.error('Error selecting plan:', error);
                alert('Failed to start checkout. Please try again.');
            } finally {
                setLoading(null);
            }
        }
    };

    const getButtonText = (planId: string, planPrice: string) => {
        if (loading === planId) return 'Processing...';
        if (currentPlan === planId) return 'Current Plan';
        if (mode === 'dashboard') return 'Start Free Trial';
        if (planPrice === "Custom") return 'Contact Sales';
        return 'Start Free Trial';
    };

    return (
        <section id="pricing" className="px-6 py-20 lg:px-8 sm:py-32">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                        {mode === 'dashboard'
                            ? 'Choose Your Plan'
                            : 'Simple, transparent pricing'}
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
                        {mode === 'dashboard'
                            ? 'Start your 14-day free trial. No credit card required.'
                            : 'Choose the plan that fits your team\'s needs. All plans include a 14-day free trial.'}
                    </p>
                </div>

                <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative ${
                                plan.popular ? "border-primary shadow-lg" : ""
                            } ${
                                currentPlan === plan.id ? "opacity-75" : ""
                            }`}
                        >
                            {plan.popular && currentPlan !== plan.id && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {currentPlan === plan.id && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-green-600 text-white px-3 py-1 text-sm font-medium rounded-full">
                                        Current Plan
                                    </span>
                                </div>
                            )}

                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <div className="mt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                                </div>
                                <CardDescription className="mt-4">{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center gap-3">
                                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={plan.popular && currentPlan !== plan.id ? "default" : "outline"}
                                    onClick={() => handleSelectPlan(plan.id, plan.price)}
                                    disabled={loading === plan.id || currentPlan === plan.id}
                                >
                                    {getButtonText(plan.id, plan.price)}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}