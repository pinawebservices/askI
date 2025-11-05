// lib/services/notifications/emailNotifications.js
import { resend } from '@/lib/resend';
import {supabaseAdmin as supabase} from '@/lib/supabase-admin.ts';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate AI summary of conversation
 * Returns 3-5 bullet points about what the lead is interested in
 */
export async function generateConversationSummary(conversation) {
    try {
        if (!conversation || conversation.length === 0) {
            return null;
        }

        // Build conversation text for AI analysis
        const conversationText = conversation
            .map(msg => `${msg.role === 'user' ? 'Visitor' : 'Agent'}: ${msg.content}`)
            .join('\n');

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `You are analyzing a conversation between a website visitor and an AI chatbot.

Provide a concise summary in 3-5 bullet points that answers:
- What services/products is the visitor interested in?
- What specific questions did they ask?
- What is their intent level? (Just browsing, gathering information, ready to purchase, urgent need)
- Any key details or requirements they mentioned?

Format your response as HTML bullet points (<li> tags). Be concise and factual. Focus on actionable insights for the business owner.`
                },
                {
                    role: 'user',
                    content: conversationText
                }
            ],
            temperature: 0.3,
            max_tokens: 300
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating conversation summary:', error);
        return null;
    }
}

/**
 * Send lead notification email to client (MVP version)
 */
export async function sendLeadNotificationEmail(leadInfo, clientId) {
    try {
        // Get client details
        const { data: client } = await supabase
            .from('clients')
            .select('notification_email, business_name, notification_preferences')
            .eq('client_id', clientId)
            .single();

        console.log('Client details:', client);

        if (!client?.notification_email) {
            console.error('No client email found for:', clientId);
            return null;
        }

        const recipientEmail = client?.notification_email;

        // Check if email notifications are enabled
        const emailEnabled = client?.notification_preferences?.email_enabled !== false;

        if (!recipientEmail || !emailEnabled) {
            console.log('Email notifications disabled or no email found for client:', clientId);
            return null;
        }

        // Generate AI summary of conversation
        console.log('Generating conversation summary...');
        const conversationSummary = await generateConversationSummary(leadInfo.conversation);
        console.log('Conversation summary generated:', conversationSummary ? 'Success' : 'Failed');

        // Simple subject line for MVP
        const subject = `New Lead Captured: ${leadInfo.name || 'Contact Information Captured'}`;

        // Generate branded email matching confirmation/password reset style
        const htmlContent = generateBrandedLeadEmail(leadInfo, client.business_name, conversationSummary);

        // Send email
        const { data, error } = await resend.emails.send({
            from: 'WidgetWise Notifications <notifications@notifications.aiwidgetwise.com>',
            to: recipientEmail,
            subject: subject,
            html: htmlContent,
        });

        if (error) {
            console.error('Failed to send email:', error);
            return null;
        }

        console.log('✅ Email sent successfully:', data.id);
        return data.id;

    } catch (error) {
        console.error('Error sending email:', error);
        return null;
    }
}

/**
 * Send trial ending reminder email (3 days before trial ends)
 */
export async function sendTrialEndingReminderEmail(customerEmail, trialEndDate, planType, planPrice) {
    try {
        const formattedDate = new Date(trialEndDate * 1000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        const htmlContent = generateTrialReminderEmail(formattedDate, planType, planPrice);

        const { data, error } = await resend.emails.send({
            from: 'WidgetWise Notifications <notifications@notifications.aiwidgetwise.com>',
            to: customerEmail,
            subject: `Your free trial ends in 3 days - ${formattedDate}`,
            html: htmlContent,
        });

        if (error) {
            console.error('Failed to send trial reminder email:', error);
            return null;
        }

        console.log('✅ Trial reminder email sent:', data.id);
        return data.id;

    } catch (error) {
        console.error('Error sending trial reminder email:', error);
        return null;
    }
}

/**
 * Generate trial reminder email HTML
 */
function generateTrialReminderEmail(trialEndDate, planType, planPrice) {
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://aiwidgetwise.com'}/dashboard`;
    const planName = planType.charAt(0).toUpperCase() + planType.slice(1);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Trial Ends Soon - WidgetWise</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); max-width: 600px; width: 100%;">

                        <!-- Header with Logo -->
                        <tr>
                            <td style="padding: 32px 40px; border-bottom: 1px solid #e5e7eb;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td align="left">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding-right: 12px; vertical-align: middle;">
                                                        <svg width="28" height="17" viewBox="0 0 179.25 108.52" fill="#000000" style="display: block;">
                                                            <path fill-rule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                                                            <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                                            <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                                        </svg>
                                                    </td>
                                                    <td style="vertical-align: middle;">
                                                        <span style="font-size: 20px; font-weight: 600; color: #000000; letter-spacing: -0.02em;">WidgetWise</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 48px 40px;">
                                <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #111827; line-height: 1.3;">
                                    Your Free Trial Ends in 3 Days
                                </h1>

                                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Your 14-day free trial of WidgetWise ${planName} Plan will end on <strong>${trialEndDate}</strong>.
                                </p>

                                <!-- Trial Info Box -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 24px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #1e3a8a;">
                                                What Happens Next?
                                            </h2>

                                            <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #1e40af;">
                                                <strong>On ${trialEndDate}:</strong><br/>
                                                Your payment method will be charged <strong>${planPrice}/month</strong> to continue using the ${planName} Plan.
                                            </p>

                                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e40af;">
                                                <strong>Want to cancel?</strong><br/>
                                                You can cancel anytime before ${trialEndDate} to avoid being charged.
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Action Buttons -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td align="center" style="padding: 16px 0;">
                                            <a href="${cancelUrl}" style="display: inline-block; padding: 12px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                                Manage Subscription
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Benefits Reminder -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
                                    <tr>
                                        <td>
                                            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">
                                                Your ${planName} Plan Includes:
                                            </h3>
                                            <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #4b5563;">
                                                <li>AI-Powered Chat Widget</li>
                                                <li>Lead Capture & Email Notifications</li>
                                                <li>Unlimited Conversations</li>
                                                <li>24/7 Customer Support</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Cancellation Info -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 16px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                                                <strong style="color: #92400e;">How to Cancel:</strong><br/>
                                                Log in to your dashboard and click "Subscription" to manage or cancel your plan. No questions asked.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <div style="border-top: 1px solid #e5e7eb;"></div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 32px 40px;">
                                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                                    Questions? Contact our support team at
                                    <a href="mailto:support@aiwidgetwise.com" style="color: #3b82f6; text-decoration: none;">support@aiwidgetwise.com</a>
                                </p>
                                <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                                    © 2025 WidgetWise, LLC. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
}

/**
 * Send payment confirmation email after successful charge
 */
export async function sendPaymentConfirmationEmail(customerEmail, invoiceData) {
    try {
        const { amount, planType, planPrice, periodStart, periodEnd, invoiceUrl } = invoiceData;

        const formattedAmount = (amount / 100).toFixed(2); // Convert cents to dollars
        const formattedPeriodStart = new Date(periodStart * 1000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        const formattedPeriodEnd = new Date(periodEnd * 1000).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        const htmlContent = generatePaymentConfirmationEmail({
            amount: formattedAmount,
            planType,
            planPrice,
            periodStart: formattedPeriodStart,
            periodEnd: formattedPeriodEnd,
            invoiceUrl
        });

        const { data, error } = await resend.emails.send({
            from: 'WidgetWise Notifications <notifications@notifications.aiwidgetwise.com>',
            to: customerEmail,
            subject: `Payment Confirmation - $${formattedAmount} for WidgetWise ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`,
            html: htmlContent,
        });

        if (error) {
            console.error('Failed to send payment confirmation email:', error);
            return null;
        }

        console.log('✅ Payment confirmation email sent:', data.id);
        return data.id;

    } catch (error) {
        console.error('Error sending payment confirmation email:', error);
        return null;
    }
}

/**
 * Generate payment confirmation email HTML
 */
function generatePaymentConfirmationEmail({ amount, planType, planPrice, periodStart, periodEnd, invoiceUrl }) {
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://aiwidgetwise.com'}/dashboard`;
    const planName = planType.charAt(0).toUpperCase() + planType.slice(1);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation - WidgetWise</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); max-width: 600px; width: 100%;">

                        <!-- Header with Logo -->
                        <tr>
                            <td style="padding: 32px 40px; border-bottom: 1px solid #e5e7eb;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td align="left">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding-right: 12px; vertical-align: middle;">
                                                        <svg width="28" height="17" viewBox="0 0 179.25 108.52" fill="#000000" style="display: block;">
                                                            <path fill-rule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                                                            <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                                            <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                                        </svg>
                                                    </td>
                                                    <td style="vertical-align: middle;">
                                                        <span style="font-size: 20px; font-weight: 600; color: #000000; letter-spacing: -0.02em;">WidgetWise</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 48px 40px;">
                                <!-- Success Icon -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td align="center">
                                            <div style="width: 64px; height: 64px; background-color: #dcfce7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #111827; line-height: 1.3; text-align: center;">
                                    Payment Successful!
                                </h1>

                                <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #4b5563; text-align: center;">
                                    Thank you for your payment. Your subscription is active.
                                </p>

                                <!-- Payment Details Box -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 24px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">
                                                Payment Details
                                            </h2>

                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 140px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Amount Charged:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    <strong style="font-size: 18px; color: #16a34a;">$${amount}</strong>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 140px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Plan:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${planName} Plan - ${planPrice}/month
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 140px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Billing Period:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${periodStart} - ${periodEnd}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 140px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Next Billing Date:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${periodEnd}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Action Buttons -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px;">
                                    <tr>
                                        <td align="center" style="padding: 8px 0;">
                                            <a href="${invoiceUrl}" style="display: inline-block; padding: 12px 32px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin-right: 8px;">
                                                View Invoice
                                            </a>
                                            <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 32px; background-color: #ffffff; color: #3b82f6; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; border: 2px solid #3b82f6;">
                                                Go to Dashboard
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <!-- What's Included -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; padding: 20px; background-color: #eff6ff; border-radius: 8px;">
                                    <tr>
                                        <td>
                                            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #111827;">
                                                Your ${planName} Plan Includes:
                                            </h3>
                                            <ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8; color: #4b5563;">
                                                <li>AI-Powered Chat Widget</li>
                                                <li>Lead Capture & Email Notifications</li>
                                                <li>Unlimited Conversations</li>
                                                <li>24/7 Customer Support</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Support Info -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4b5563;">
                                                <strong style="color: #111827;">Need help?</strong><br/>
                                                Our support team is here to help. Email us at <a href="mailto:support@aiwidgetwise.com" style="color: #3b82f6; text-decoration: none;">support@aiwidgetwise.com</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <div style="border-top: 1px solid #e5e7eb;"></div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 32px 40px;">
                                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #6b7280; text-align: center;">
                                    This is an automated receipt for your payment to WidgetWise.
                                </p>
                                <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5; text-align: center;">
                                    © 2025 WidgetWise, LLC. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
}

/**
 * Format conversation for email display
 */
function formatConversationForEmail(conversation) {
    if (!conversation || conversation.length === 0) {
        return '<p style="color: #6b7280; font-style: italic;">No conversation history available.</p>';
    }

    return conversation
        .map(msg => {
            const role = msg.role === 'user' ? 'Visitor' : 'Agent';
            const roleColor = msg.role === 'user' ? '#3b82f6' : '#10b981';
            const bgColor = msg.role === 'user' ? '#eff6ff' : '#f0fdf4';

            return `
                <div style="margin-bottom: 12px; padding: 12px; background-color: ${bgColor}; border-radius: 6px; border-left: 3px solid ${roleColor};">
                    <div style="font-weight: 600; font-size: 13px; color: ${roleColor}; margin-bottom: 6px;">
                        ${role}:
                    </div>
                    <div style="font-size: 14px; line-height: 1.6; color: #374151;">
                        ${msg.content.replace(/\n/g, '<br/>')}
                    </div>
                </div>
            `;
        })
        .join('');
}

/**
 * Generate branded HTML email for lead notifications
 * Matches the style of confirmation and password reset emails
 */
function generateBrandedLeadEmail(leadInfo, businessName, conversationSummary) {
    const capturedTime = new Date(leadInfo.timestamp).toLocaleString();
    const conversationHTML = formatConversationForEmail(leadInfo.conversation);

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead Captured - AIWidgetWise</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); max-width: 600px; width: 100%;">
                        
                        <!-- Header with Logo -->
                        <tr>
                            <td style="padding: 32px 40px; border-bottom: 1px solid #e5e7eb;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td align="left">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding-right: 12px; vertical-align: middle;">
                                                        <svg width="28" height="17" viewBox="0 0 179.25 108.52" fill="#000000" style="display: block;">
                                                            <path fill-rule="evenodd" d="M116.44,108.52c29.62,0,62.8-22.28,62.8-54.26S146.06,0,116.44,0h-1.56c22.22,0,40.4,18.18,40.4,40.4s-18.18,40.4-40.4,40.4h-50.81c-22.22,0-40.4-18.18-40.4-40.4S41.85,0,64.07,0h-1.26C33.18,0,0,22.28,0,54.26s33.18,54.26,62.8,54.26h53.64Z"/>
                                                            <path d="M65.58,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                                            <path d="M113.66,24.61c7.71,0,13.95,6.25,13.95,13.95s-6.25,13.95-13.95,13.95-13.95-6.25-13.95-13.95,6.25-13.95,13.95-13.95h0Z"/>
                                                        </svg>
                                                    </td>
                                                    <td style="vertical-align: middle;">
                                                        <span style="font-size: 20px; font-weight: 600; color: #000000; letter-spacing: -0.02em;">WidgetWise</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 48px 40px;">
                                <h1 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 700; color: #111827; line-height: 1.3;">
                                    New Lead Captured
                                </h1>
                                
                                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Your AI Agent captured a new lead for <strong>${businessName}</strong>
                                </p>

                                <!-- Lead Details Box -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 24px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 600; color: #111827;">
                                                Contact Information
                                            </h2>
                                            
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 100px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Name:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${leadInfo.name || 'Not provided'}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 100px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Email:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${leadInfo.email ? `<a href="mailto:${leadInfo.email}" style="color: #3b82f6; text-decoration: none;">${leadInfo.email}</a>` : 'Not provided'}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 100px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Phone:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${leadInfo.phone ? `<a href="tel:${leadInfo.phone}" style="color: #3b82f6; text-decoration: none;">${leadInfo.phone}</a>` : 'Not provided'}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 10px 0;">
                                                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                            <tr>
                                                                <td style="width: 100px; font-weight: 600; font-size: 14px; color: #6b7280; vertical-align: top;">
                                                                    Captured:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${capturedTime}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Quick Action Tip -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 16px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e40af;">
                                                <strong style="color: #1e3a8a;">Quick Tip:</strong> Leads are most responsive within the first hour. Reach out soon for best results!
                                            </p>
                                        </td>
                                    </tr>
                                </table>

                                ${conversationSummary ? `
                                <!-- AI Summary Section -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 24px; background-color: #fdf4ff; border-radius: 8px; border: 1px solid #e9d5ff;">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">
                                                🤖 AI Summary
                                            </h2>
                                            <div style="font-size: 14px; line-height: 1.8; color: #4b5563;">
                                                <ul style="margin: 0; padding-left: 20px;">
                                                    ${conversationSummary}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                ` : ''}

                                <!-- Full Conversation Section -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 24px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">
                                                💬 Full Conversation
                                            </h2>
                                            <div style="font-size: 14px; line-height: 1.6;">
                                                ${conversationHTML}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td style="padding: 0 40px;">
                                <div style="border-top: 1px solid #e5e7eb;"></div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 32px 40px;">
                                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                                    This notification was sent automatically by your WidgetWise AI Agent.
                                </p>
                                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                                    Questions? Contact support at 
                                    <a href="mailto:support@aiwidgetwise.com" style="color: #3b82f6; text-decoration: none;">support@aiwidgetwise.com</a>
                                </p>
                                <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.5;">
                                    © 2025 WidgetWise, LLC. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
}