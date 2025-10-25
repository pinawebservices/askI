// lib/resend.js
import { Resend } from 'resend';

// Initialize Resend
export const resend = new Resend(process.env.RESEND_API_KEY);

// For future expansion - just return 'standard' for now
export function getLeadPriority(leadInfo) {
    return 'standard';
}

// For future expansion - check if after business hours -
// if we want to add this to email template
export function isAfterHours() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    // Weekend or outside 9 AM - 6 PM
    return day === 0 || day === 6 || hour < 9 || hour >= 18;
}