// services/emailNotifications.js
import { resend, isAfterHours } from '@/lib/resend';
import supabase from '../supabaseService.js';

/**
 * Send lead notification email to client (MVP version)
 */
export async function sendLeadNotificationEmail(leadInfo, clientId) {
    try {
        // Get client details
        const { data: client } = await supabase
            .from('clients')
            .select('email, business_name')
            .eq('client_id', clientId)
            .single();

        if (!client?.email) {
            console.error('No client email found for:', clientId);
            return null;
        }

        // Simple subject line for MVP
        const subject = `New Lead Captured: ${leadInfo.name || 'New Lead Captured'}`;

        // Generate simple but professional email
        const htmlContent = generateSimpleLeadEmail(leadInfo, client.business_name);

        // Send email
        const { data, error } = await resend.emails.send({
            from: 'AI Agent <notifications@notifications.aiwidgetwise.com>', // TODO: Replace with your domain
            to: client.email,
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
 * Generate simple HTML email for MVP
 */
function generateSimpleLeadEmail(leadInfo, businessName) {
    const capturedTime = new Date(leadInfo.timestamp).toLocaleString();
    const afterHours = isAfterHours();

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          background: #4F46E5; 
          color: white; 
          padding: 30px; 
          border-radius: 8px 8px 0 0; 
          text-align: center;
        }
        .content { 
          background: white; 
          padding: 30px; 
          border: 1px solid #e5e7eb; 
          border-radius: 0 0 8px 8px; 
        }
        .info-row { 
          padding: 12px 0; 
          border-bottom: 1px solid #f3f4f6; 
        }
        .info-row:last-child { 
          border-bottom: none; 
        }
        .label { 
          font-weight: 600; 
          color: #6b7280; 
          display: inline-block;
          width: 100px;
        }
        .value { 
          color: #111827; 
        }
        .footer { 
          text-align: center; 
          color: #9ca3af; 
          font-size: 12px; 
          margin-top: 30px; 
        }
        .alert { 
          background: #FEF3C7; 
          border: 1px solid #FCD34D; 
          padding: 12px; 
          border-radius: 6px; 
          margin-bottom: 20px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">New Lead Captured</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your AI Agent captured a new lead for ${businessName}</p>
        </div>
        
        <div class="content">
          ${afterHours ? `
            <div class="alert">
              📌 This lead was captured outside business hours. Quick follow-up recommended.
            </div>
          ` : ''}
          
          <h3 style="color: #374151; margin-top: 0;">Lead Information:</h3>
          
          <div class="info-row">
            <span class="label">Name:</span>
            <span class="value">${leadInfo.name || 'Not provided'}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${leadInfo.email || 'Not provided'}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Phone:</span>
            <span class="value">${leadInfo.phone || 'Not provided'}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Captured:</span>
            <span class="value">${capturedTime}</span>
          </div>
          
          <div class="footer">
            <p>This notification was sent automatically by your AI Agent.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}