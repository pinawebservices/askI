// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        // Generate branded email HTML
        const htmlContent = generateContactEmail({ name, email, subject, message });

        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: 'WidgetWise Contact Form <notifications@notifications.aiwidgetwise.com>',
            to: 'support@aiwidgetwise.com',
            replyTo: email, // Allow direct reply to the person who submitted
            subject: `[Contact Form] ${subject}`,
            html: htmlContent,
        });

        if (error) {
            console.error('Failed to send contact email:', error);
            return NextResponse.json(
                { error: 'Failed to send message. Please try again or email us directly.' },
                { status: 500 }
            );
        }

        console.log('✅ Contact form email sent:', data?.id);

        return NextResponse.json({
            success: true,
            message: 'Message sent successfully'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again.' },
            { status: 500 }
        );
    }
}

/**
 * Generate branded HTML email for contact form submissions
 */
function generateContactEmail({ name, email, subject, message }: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    const submittedTime = new Date().toLocaleString();
    const isPrivacyRequest = subject.toLowerCase().includes('privacy') ||
                            subject.toLowerCase().includes('data') ||
                            subject.toLowerCase().includes('deletion') ||
                            subject.toLowerCase().includes('access');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission - WidgetWise</title>
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
                                    New Contact Form Submission
                                </h1>

                                <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                    Someone submitted the contact form on your website.
                                </p>

                                ${isPrivacyRequest ? `
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 16px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #78350f;">
                                                <strong style="color: #92400e;">⚠️ Privacy Request</strong><br/>
                                                This appears to be a privacy-related request. Please respond promptly as required by law.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                ` : ''}

                                <!-- Contact Details Box -->
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
                                                                    ${name}
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
                                                                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
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
                                                                    Subject:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    <strong>${subject}</strong>
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
                                                                    Submitted:
                                                                </td>
                                                                <td style="font-size: 14px; color: #111827;">
                                                                    ${submittedTime}
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Message Box -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 32px; padding: 24px; background-color: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                                    <tr>
                                        <td>
                                            <h2 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #111827;">
                                                Message
                                            </h2>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Quick Action Tip -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding: 16px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #1e40af;">
                                                <strong style="color: #1e3a8a;">Quick Action:</strong> You can reply directly to this email to respond to ${name}.
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
                                    This message was sent via the WidgetWise contact form.
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