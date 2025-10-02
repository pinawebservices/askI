import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';

const PRICE_IDS = {
    basic: process.env.STRIPE_PRICE_BASIC!,
    pro: process.env.STRIPE_PRICE_PRO!,
    premium: process.env.STRIPE_PRICE_PREMIUM!,
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Request body:', body);

        const { priceId, planType } = await body;

        if (!priceId || !planType) {
            console.error('Missing required fields:', { priceId, planType });
            return NextResponse.json({
                error: 'Missing priceId or planType'
            }, { status: 400 });
        }

        const supabase = await createClient();

        // Get user and organization
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('User fetch result:', { userId: user?.id, error: userError });

        if (!user || userError) {
            console.error('User not authenticated:', userError);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user and Organization
        const { data: userOrgData, error: orgError } = await supabase
            .from('users')
            .select(`
        organization_id,
        organizations (
            id,
            name
        )
    `)
            .eq('id', user.id)
            .single();

        console.log('Organization fetch:', { data: userOrgData, error: orgError });

        if (orgError || !userOrgData) {
            console.error('Failed to fetch organization:', orgError);
            return NextResponse.json({
                error: 'Organization not found',
                details: orgError
            }, { status: 404 });
        }

        console.log('Organization fetch:', { data: userOrgData, error: orgError });

        // Get client id
        if (userOrgData?.organization_id) {
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('client_id')
            .eq('organization_id', userOrgData.organization_id)
            .single();

        if (clientError || !client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }


        // Initialize Stripe (with proper error handling)
        let stripe;
        try {
            stripe = require('stripe')(process.env.STRIPE_SECRET_KEY!, {
                apiVersion: '2025-08-27.basil',
            });
            console.log('Stripe initialized successfully');
        } catch (stripeInitError) {
            console.error('Failed to initialize Stripe:', stripeInitError);
            return NextResponse.json({
                error: 'Failed to initialize payment processor'
            }, { status: 500 });
        }

        // Check Stripe configuration
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Stripe secret key not configured');
            return NextResponse.json({
                error: 'Stripe configuration missing'
            }, { status: 500 });
        }

        // Check if customer exists in Stripe tables
        const { data: stripeCustomer } = await supabase
            .from('stripe_customers')
            .select('stripe_customer_id')
            .eq('organization_id', userOrgData.organization_id)
            .single();

        let stripeCustomerId = stripeCustomer?.stripe_customer_id;

        if (!stripeCustomerId) {
            // Create new Stripe customer
            console.log('Creating new Stripe customer');
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    organization_id: userOrgData.organization_id,
                    user_id: user.id,
                }
            });
            stripeCustomerId = customer.id;

            if (!userOrgData.organization_id || !stripeCustomerId || !user.email) {
                console.error('Missing required fields for stripe_customers insert');
                return NextResponse.json({
                    error: 'Missing required customer data'
                }, { status: 400 });
            }

            // Save to our stripe_customers table
            await supabase
                .from('stripe_customers')
                .insert({
                    organization_id: userOrgData.organization_id,
                    stripe_customer_id: stripeCustomerId,
                    email: user.email
                });
        }

        // Create checkout session
        try {
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',  // Required for subscriptions
                customer: stripeCustomerId,  // Stripe customer ID
                line_items: [{
                    price: PRICE_IDS[planType as keyof typeof PRICE_IDS],
                    quantity: 1,
                }],
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${client.client_id}?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${client.client_id}`,
                metadata: {
                    organization_id: userOrgData.organization_id,
                    plan_type: planType,
                },
                subscription_data: {
                    trial_period_days: 1,  // Optional trial
                    metadata: {
                        organization_id: userOrgData.organization_id,
                        plan_type: planType,
                    }
                }
            });

            console.log('Checkout session created:', session.id);
            return NextResponse.json({
                sessionId: session.id,
                url: session.url
            });

        } catch (sessionError: any) {
            console.error('Failed to create checkout session:', {
                error: sessionError.message,
                type: sessionError.type,
                code: sessionError.code
            });
            return NextResponse.json({
                error: 'Failed to create checkout session',
                details: sessionError.message
            }, { status: 500 });
        }
        }
    } catch (error: any) {
        console.error('Unexpected error in checkout API:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error.message},
            { status: 500 }
        );
    }
}