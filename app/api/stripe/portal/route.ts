import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server-client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get the user's organization_id first
        const { data: userData } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', user.id)
            .single();

        if (!userData?.organization_id) {
            return NextResponse.json({ error: 'User organization not found' }, { status: 404 });
        }

        // Then get the stripe customer ID using the organization_id
        const { data: customer } = await supabase
            .from('stripe_customers')
            .select('stripe_customer_id')
            .eq('organization_id', userData.organization_id)
            .single();

        if (!customer?.stripe_customer_id) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
        }

        // Create portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customer.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        });

        return NextResponse.json({ url: session.url });

    } catch (error) {
        console.error('Portal session error:', error);
        return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
    }
}