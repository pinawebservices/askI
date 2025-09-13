import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from "@/lib/supabase-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// This is critical - Stripe needs the raw body
export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Webhook received:', event.type);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('Checkout completed for session:', session.id);
                console.log('Session metadata:', session.metadata);
                console.log('Subscription ID:', session.subscription);

                // Get the subscription details
                if (session.subscription) {
                    try {
                        const subscription = await stripe.subscriptions.retrieve(
                            session.subscription as string
                        );

                        console.log('Retrieved subscription:', subscription.id);
                        console.log('Subscription status:', subscription.status);

                        const {organization_id, plan_type} = session.metadata!;

                        const insertData = {
                            organization_id,
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_id: subscription.id,
                            stripe_price_id: subscription.items.data[0].price.id,
                            plan_type,
                            status: subscription.status,
                            current_period_start: new Date(subscription.items.data[0].current_period_start * 1000).toISOString(),
                            current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
                            trial_start: subscription.trial_start
                                ? new Date(subscription.trial_start * 1000).toISOString()
                                : null,
                            trial_end: subscription.trial_end
                                ? new Date(subscription.trial_end * 1000).toISOString()
                                : null,
                        };

                        console.log('Inserting data:', insertData);

                        // Save subscription to database
                        const { data, error } = await supabaseAdmin
                            .from('stripe_subscriptions')
                            .insert( insertData );

                        if (error) {
                            console.error('Database insert error:', error);
                        } else {
                            console.log('Successfully inserted subscription:', data);
                        }

                        // Update organization plan_type
                        await supabaseAdmin
                            .from('organizations')
                            .update({plan_type})
                            .eq('id', organization_id);


                    } catch (err) {
                        console.error('Error processing subscription:', err);
                    }
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;

                await supabaseAdmin
                    .from('stripe_subscriptions')
                    .update({
                        status: subscription.status,
                        current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                console.log('Subscription updated:', subscription.id);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                await supabaseAdmin
                    .from('stripe_subscriptions')
                    .update({ status: 'cancelled' })
                    .eq('stripe_subscription_id', subscription.id);

                console.log('Subscription cancelled:', subscription.id);

                // Reset organization to free plan
                const { organization_id } = subscription.metadata;
                await supabaseAdmin
                    .from('organizations')
                    .update({ plan_type: 'none' })
                    .eq('id', organization_id);

                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}