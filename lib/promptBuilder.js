// lib/promptBuilder.js - FIXED for GoogleSheetsClient data structure
import { getPrompt } from './prompts.js';

export function buildMultiSourcePrompt(businessType, customDetails, customerData) {
    // Start with base prompt from your existing prompts.js
    let prompt = getPrompt(businessType, customDetails, customerData);

    // If we have live data from GoogleSheetsClient, enhance the prompt
    if (customerData?.liveData) {
        prompt += `\n\n=== LIVE BUSINESS DATA (Updated: ${customerData.liveData.lastUpdated}) ===\n`;

        // Add services data from GoogleSheetsClient (direct path)
        if (customerData.liveData.services?.length > 0) {
            prompt += `\n🔴 CURRENT SERVICES & PRICING (LIVE FROM GOOGLE SHEETS):\n`;
            prompt += `=== IMPORTANT: Use this live pricing data instead of any static pricing ===\n\n`;

            customerData.liveData.services.forEach(service => {
                prompt += `**${service.name}**`;
                if (service.category) prompt += ` (${service.category})`;
                prompt += `\n`;
                if (service.price) prompt += `💰 Current Price: ${service.price}\n`;
                if (service.duration) prompt += `⏱️ Duration: ${service.duration}\n`;
                if (service.description) prompt += `📝 Description: ${service.description}\n`;
                prompt += `\n`;
            });
        }

        // Add live availability from schedule (direct path)
        if (customerData.liveData.schedule?.length > 0) {
            const availableSlots = customerData.liveData.schedule.filter(slot =>
                slot.status && slot.status.toLowerCase().includes('available')
            );

            if (availableSlots.length > 0) {
                prompt += `\n📅 CURRENT AVAILABILITY (LIVE FROM GOOGLE SHEETS):\n`;
                availableSlots.slice(0, 5).forEach(slot => {
                    prompt += `• ${slot.date} at ${slot.time}`;
                    if (slot.practitioner) prompt += ` with ${slot.practitioner}`;
                    if (slot.service) prompt += ` for ${slot.service}`;
                    prompt += `\n`;
                });

                if (availableSlots.length > 5) {
                    prompt += `... and ${availableSlots.length - 5} more available slots\n`;
                }
                prompt += `\n`;
            }
        }

        // Add live specials from GoogleSheetsClient (direct path)
        if (customerData.liveData.specials?.length > 0) {
            prompt += `\n🎉 CURRENT SPECIALS & PROMOTIONS (LIVE FROM GOOGLE SHEETS):\n`;
            customerData.liveData.specials.forEach(special => {
                prompt += `**${special.name}**: ${special.description}`;
                if (special.discount) prompt += ` (${special.discount})`;
                if (special.validUntil) prompt += ` - Valid until ${special.validUntil}`;
                prompt += `\n`;
            });
            prompt += `\n`;
        }

        // Add data source summary and instructions
        prompt += `\n🎯 DATA SOURCE PRIORITY INSTRUCTIONS:\n`;
        prompt += `1. **Current Pricing & Services**: Always use Google Sheets data (marked with 🔴)\n`;
        prompt += `2. **Fallback**: Only use static information if live data is not available\n`;

        // Add summary information
        const servicesCount = customerData.liveData.services?.length || 0;
        const scheduleCount = customerData.liveData.schedule?.length || 0;
        const specialsCount = customerData.liveData.specials?.length || 0;

        prompt += `\nData Summary: ${servicesCount} live services, ${scheduleCount} schedule entries, ${specialsCount} current specials\n`;
        prompt += `Data Source: ${customerData.liveData.source || 'Google Sheets'}\n`;

        prompt += `\n🔴 CRITICAL: This live Google Sheets data takes PRIORITY over any static information. Always use the current pricing and services listed above.\n\n`;
    }

    return prompt;
}