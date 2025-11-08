/**
 * Email templates for team invitations
 */

interface ReInviteEmailParams {
  organizationName: string;
  resetLink: string;
  recipientName?: string;
}

/**
 * HTML template for re-invite email
 * Matches the design of Supabase password reset template
 */
export function getReInviteEmailHtml({
  organizationName,
  resetLink,
  recipientName
}: ReInviteEmailParams): string {
  const greeting = recipientName ? `Hi ${recipientName},` : 'Hello,';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You've Been Re-invited - WidgetWise</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; max-width: 600px; width: 100%;">

                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 40px; border-bottom: 1px solid #e5e7eb;">
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
                                        <span style="font-size: 20px; font-weight: 600; color: #000000;">WidgetWise</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #111827;">
                                Welcome Back to ${organizationName}!
                            </h1>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                ${greeting}
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                Good news! You've been re-invited to join ${organizationName} on WidgetWise. Your account has been reactivated.
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                To get started, click the button below to reset your password and regain access:
                            </p>

                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 24px 0;">
                                <tr>
                                    <td style="border-radius: 6px; background: #000000;">
                                        <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: 500; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                            Reset Password & Log In
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">
                                Or copy this link:
                            </p>
                            <p style="margin: 0 0 24px 0; font-size: 13px; word-break: break-all;">
                                <a href="${resetLink}" style="color: #3b82f6;">${resetLink}</a>
                            </p>

                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                This link is valid for one hour. If you did not expect this invitation, you can safely disregard this message.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
                                Questions? Email support@aiwidgetwise.com
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                                © 2025 WidgetWise, LLC
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Plain text version of re-invite email
 */
export function getReInviteEmailText({
  organizationName,
  resetLink,
  recipientName
}: ReInviteEmailParams): string {
  const greeting = recipientName ? `Hi ${recipientName},` : 'Hello,';

  return `${greeting}

Good news! You've been re-invited to join ${organizationName} on WidgetWise. Your account has been reactivated.

To get started, click the link below to reset your password and regain access:

${resetLink}

This link is valid for one hour. If you did not expect this invitation, you can safely disregard this message.

Questions? Email support@aiwidgetwise.com

© 2025 WidgetWise, LLC`;
}

interface AccountDeactivationEmailParams {
  organizationName: string;
  recipientName?: string;
}

/**
 * HTML template for account deactivation email
 * Matches the design of Supabase password reset template
 */
export function getAccountDeactivationEmailHtml({
  organizationName,
  recipientName
}: AccountDeactivationEmailParams): string {
  const greeting = recipientName ? `Hi ${recipientName},` : 'Hello,';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Deactivated - WidgetWise</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; max-width: 600px; width: 100%;">

                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 40px; border-bottom: 1px solid #e5e7eb;">
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
                                        <span style="font-size: 20px; font-weight: 600; color: #000000;">WidgetWise</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 48px 40px;">
                            <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 600; color: #111827;">
                                Account Deactivated
                            </h1>

                            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                ${greeting}
                            </p>

                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #4b5563;">
                                Your WidgetWise account for ${organizationName} has been deactivated by an administrator. You will no longer be able to access this organization's dashboard or resources.
                            </p>

                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                                If you have any questions about this action, please reach out to your organization's administrator directly.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; font-size: 13px; color: #9ca3af;">
                                © 2025 WidgetWise, LLC
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Plain text version of account deactivation email
 */
export function getAccountDeactivationEmailText({
  organizationName,
  recipientName
}: AccountDeactivationEmailParams): string {
  const greeting = recipientName ? `Hi ${recipientName},` : 'Hello,';

  return `${greeting}

Your WidgetWise account for ${organizationName} has been deactivated by an administrator. You will no longer be able to access this organization's dashboard or resources.

Think this is a mistake?
If you believe this deactivation was made in error, please contact your organization's system administrator for assistance.

If you have any questions about this action, please reach out to your organization's administrator directly.

Questions? Email support@aiwidgetwise.com

© 2025 WidgetWise, LLC`;
}