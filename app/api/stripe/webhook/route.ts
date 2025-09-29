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

                // Get the subscription details
                if (session.subscription) {
                    try {
                        const subscription = await stripe.subscriptions.retrieve(
                            session.subscription as string
                        );

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

                        // Save subscription to database
                        const { data: subData, error: subError } = await supabaseAdmin
                            .from('stripe_subscriptions')
                            .insert( insertData );

                        if (subError) {
                            console.error('subData insert error:', subError);
                        } else {
                            console.log('Successfully inserted into stripe_subscriptions');
                        }

                        // insert subscription history
                        await supabaseAdmin
                            .from('subscription_history')
                            .insert({
                                organization_id: insertData.organization_id,
                                stripe_subscription_id: insertData.stripe_subscription_id,
                                action: 'created',
                                plan_type: insertData.plan_type,
                                status: insertData.status,
                                metadata: {
                                    customer_id: session.customer?.toString(),
                                    trial_end: insertData.trial_end,
                                    mode: session.mode
                                }
                            });

                        // Update organization plan_type
                        const { data: organizationsData, error: subHisError } = await supabaseAdmin
                            .from('organizations')
                            .update({plan_type})
                            .eq('id', organization_id);

                        if (organizationsData) {
                            console.error('organizations insert error:', subHisError);
                        } else {
                            console.log('Successfully updated organizations to plan type: ', plan_type);
                        }


                    } catch (err) {
                        console.error('Error processing subscription:', err);
                    }
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const previousAttributes = event.data.previous_attributes as any;

                // Check what changed
                const statusChanged = previousAttributes?.status !== undefined;
                const planChanged = previousAttributes?.items?.data[0]?.price?.id !== undefined;

                // Build the update object dynamically based on what changed
                const updateData: any = {
                    status: subscription.status,
                    current_period_end: new Date(subscription.items.data[0].current_period_end * 1000).toISOString(),
                    stripe_price_id: subscription.items.data[0].price.id,  // ADD THIS
                };

                // If the price changed, we need to determine the new plan_type
                if (planChanged) {
                    // Map price ID to plan type (you'll need to define this mapping)
                    const priceIdToPlanType: Record<string, string> = {
                        [process.env.STRIPE_PRICE_BASIC!]: 'basic',
                        [process.env.STRIPE_PRICE_PRO!]: 'pro',
                        [process.env.STRIPE_PRICE_PREMIUM!]: 'premium',
                    };

                    const newPlanType = priceIdToPlanType[subscription.items.data[0].price.id];
                    if (newPlanType) {
                        updateData.plan_type = newPlanType;  // ADD THIS
                    }
                }

                const { data: subData, error: subError } = await supabaseAdmin
                    .from('stripe_subscriptions')
                    .update(updateData)
                    .eq('stripe_subscription_id', subscription.id)
                    .select()
                    .single();

                if (subError ) {
                    console.error('subData update error:', subError);
                } else if (!subData) {
                    console.error('subData update: no records returned');
                } else {
                    console.log('Successfully updated stripe_subscriptions');
                }

                // Log to subscription_history
                if (statusChanged || planChanged) {
                    await supabaseAdmin
                        .from('subscription_history')
                        .insert({
                            organization_id: subData?.organization_id,
                            stripe_subscription_id: subscription.id,
                            stripe_price_id: subscription.items.data[0].price.id,
                            action: previousAttributes?.items?.data?.[0]?.price?.id ? 'plan_changed' : 'status_changed',
                            plan_type: subData?.plan_type,
                            status: subscription.status,
                            metadata: {
                                previous_attributes: previousAttributes,
                                changed_fields: Object.keys(previousAttributes || {})
                            }
                        });

                    console.log('✅ Subscription updated:', {
                        status: subscription.status,
                        previous: previousAttributes?.status,
                        plan_changed: planChanged
                    });
                }

                // Update organization if plan changed
                if (planChanged && subData) {
                    const { error: orgError } = await supabaseAdmin
                        .from('organizations')
                        .update({ plan_type: updateData.plan_type })
                        .eq('id', subData.organization_id);

                    if (orgError) {
                        console.error('Error updating organization plan change:', orgError);
                    }
                }

                console.log(`Subscription updated successfully.`);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;

                const { data: subData, error: subError } = await supabaseAdmin
                    .from('stripe_subscriptions')
                    .select('organization_id, plan_type')
                    .eq('stripe_subscription_id', subscription.id)
                    .single();


                if (!subData) {
                    console.error('subData delete: no records returned');
                } else if (subError) {
                    console.error('subData delete error:', subError);
                }


                if (subData) {

                    const { error: supDeleteErr } = await supabaseAdmin
                        .from('stripe_subscriptions')
                        .update({status: 'cancelled'})
                        .eq('stripe_subscription_id', subscription.id);

                    if (supDeleteErr) {
                        console.error('Error cancelling subscription stripe_subscriptions:', supDeleteErr);
                    }

                    const { error: subHisErr } = await supabaseAdmin
                        .from('subscription_history')
                        .insert({
                            organization_id: subData.organization_id,
                            stripe_subscription_id: subscription.id,
                            stripe_price_id: subscription.items.data[0]?.price.id || null,
                            action: 'subscription cancelled',  // was event_type
                            plan_type: subData.plan_type,
                            status: 'cancelled',
                            metadata: JSON.parse(JSON.stringify({
                                cancellation_details: subscription.cancellation_details,
                                cancelled_at: subscription.canceled_at
                            }))
                        });

                    // Reset organization to free plan
                    const { organization_id } = subscription.metadata;

                    const { error: orgDeleteErr } = await supabaseAdmin
                        .from('organizations')
                        .update({plan_type: 'none'})
                        .eq('id', organization_id);

                    if (orgDeleteErr) {
                        console.error('Error resetting organization plan type:', orgDeleteErr);
                    }

                    console.log('Organization plan type updated');
                }

                break;
            }

            case 'customer.subscription.trial_will_end': {
                const subscription = event.data.object as Stripe.Subscription;

                // Send reminder email 3 days before trial ends
                console.log('Trial ending soon for subscription:', subscription.id);

                // TODO: Send email notification to customer
                // You could use Resend or your email service here

                await supabaseAdmin
                    .from('subscription_history')
                    .insert({
                        organization_id: subscription.metadata.organization_id,
                        stripe_subscription_id: subscription.id,
                        action: 'trial_ending_soon',
                        status: subscription.status,
                        metadata: {
                            trial_end: subscription.trial_end,
                            days_remaining: 3
                        }
                    });
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