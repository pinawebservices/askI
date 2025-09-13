import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '22025-08-27.basil',
});

const PRICE_IDS = {
    basic: process.env.STRIPE_PRICE_BASIC!,
    pro: process.env.STRIPE_PRICE_PRO!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
};

export async function POST(req: NextRequest) {
    try {
        const { priceId, planType } = await req.json();
        const supabase = createRouteHandlerClient({ cookies });

        // Get user and organization
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user and Organization
        const { data: userOrgData, error } = await supabase
            .from('users')
            .select(`
        organization_id,
        organizations (
            id,
            name,
            stripe_customer_id
        )
    `)
            .eq('id', user.id)
            .single();

        if (error || !userOrgData) {
            return NextResponse.json({ error: error }, { status: 404 });
        }

        // Get client id
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('client_id')
            .eq('organization_id', userOrgData.organization_id)
            .single();

        if (clientError || !client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // Check if customer exists in Stripe tables
        const { data: stripeCustomer } = await supabase
            .from('stripe_customers')
            .select('stripe_customer_id')
            .eq('organization_id', userOrgData.organization_id)
            .single();

        let customerId = stripeCustomer?.stripe_customer_id;

        if (!customerId) {
            // Create new Stripe customer
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    organization_id: userOrgData.organization_id,
                    user_id: user.id,
                }
            });
            customerId = customer.id;

            // Save to our stripe_customers table
            await supabase
                .from('stripe_customers')
                .insert({
                    organization_id: userOrgData.organization_id,
                    stripe_customer_id: customerId,
                    email: user.email
                });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',  // Required for subscriptions
            customer: customerId,  // Stripe customer ID
            line_items: [{
                price: PRICE_IDS[planType as keyof typeof PRICE_IDS],
                quantity: 1,
            }],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${client.client_id}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${client.client_id}`,
            metadata: {
                organization_id: userOrgData.organization_id,
                plan_type: planType,
            },
            subscription_data: {
                trial_period_days: 14,  // Optional trial
                metadata: {
                    organization_id: userOrgData.organization_id,
                    plan_type: planType,
                }
            }
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}