// lib/promptBuilder.js - NEW FILE for enhanced prompt building
import { getPrompt } from './prompts.js';

export function buildMultiSourcePrompt(businessType, customDetails, customerData) {
    // Start with base prompt from your existing prompts.js
    let prompt = getPrompt(businessType, customDetails, customerData);

    // If we have live multi-source data, enhance the prompt significantly
    if (customerData?.liveData) {
        prompt += `\n\n=== LIVE BUSINESS DATA (Multi-Source, Updated: ${customerData.liveData.lastUpdated}) ===\n`;

        // Add structured data from Google Sheets
        if (customerData.liveData.structured?.services?.length > 0) {
            prompt += `\n🔴 CURRENT SERVICES & PRICING (LIVE FROM GOOGLE SHEETS):\n`;
            prompt += `=== IMPORTANT: Use this live pricing data instead of any static pricing ===\n\n`;

            customerData.liveData.structured.services.forEach(service => {
                prompt += `**${service.name}**`;
                if (service.category) prompt += ` (${service.category})`;
                prompt += `\n`;
                prompt += `💰 Current Price: ${service.price}\n`;
                if (service.duration) prompt += `⏱️ Duration: ${service.duration}\n`;
                if (service.description) prompt += `📝 Description: ${service.description}\n`;
                prompt += `\n`;
            });
        }

        // Add live availability from schedule
        if (customerData.liveData.structured?.schedule?.length > 0) {
            const availableSlots = customerData.liveData.structured.schedule.filter(slot =>
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

        // Add live specials from Google Sheets
        if (customerData.liveData.structured?.specials?.length > 0) {
            prompt += `\n🎉 CURRENT SPECIALS & PROMOTIONS (LIVE FROM GOOGLE SHEETS):\n`;
            customerData.liveData.structured.specials.forEach(special => {
                prompt += `**${special.name}**: ${special.description}`;
                if (special.discount) prompt += ` (${special.discount})`;
                if (special.validUntil) prompt += ` - Valid until ${special.validUntil}`;
                prompt += `\n`;
            });
            prompt += `\n`;
        }

        // Add document content from PDFs and other files
        if (Object.keys(customerData.liveData.documents).length > 0) {
            prompt += `\n📚 DETAILED BUSINESS INFORMATION (FROM DOCUMENTS):\n`;
            prompt += `=== Use this information for detailed questions about policies, procedures, and background ===\n\n`;

            Object.entries(customerData.liveData.documents).forEach(([fileName, docData]) => {
                if (docData.content && docData.content.length > 50) {
                    // Add document content with smart truncation
                    const excerpt = docData.content.length > 1000
                        ? docData.content.substring(0, 1000) + '...'
                        : docData.content;

                    prompt += `**Document: ${fileName}**\n`;
                    prompt += `Content: ${excerpt}\n`;
                    prompt += `(${docData.wordCount} words, last updated: ${docData.lastModified})\n\n`;
                }
            });
        }

        // Add data source summary and instructions
        prompt += `\n🎯 DATA SOURCE PRIORITY INSTRUCTIONS:\n`;
        prompt += `1. **Current Pricing & Availability**: Always use Google Sheets data (marked with 🔴)\n`;
        prompt += `2. **Detailed Information**: Use document content for policies, procedures, detailed descriptions\n`;
        prompt += `3. **Fallback**: Only use static information if live data is not available\n`;

        if (customerData.liveData.summary) {
            prompt += `\nData Summary: ${customerData.liveData.summary.totalServices} services, ${customerData.liveData.summary.totalDocuments} documents, ${customerData.liveData.summary.totalWords} words of content\n`;
        }

        prompt += `\n🔴 CRITICAL: This multi-source data takes PRIORITY over any static information. Combine structured data (pricing) with document content (detailed info) for complete answers.\n\n`;
    }

    return prompt;
}

// Helper function to extract key information from documents
export function extractDocumentInsights(documents) {
    const insights = {
        policies: [],
        procedures: [],
        services: [],
        general: []
    };

    Object.entries(documents).forEach(([fileName, docData]) => {
        const content = docData.content.toLowerCase();
        const name = fileName.toLowerCase();

        // Categorize documents based on filename and content
        if (name.includes('policy') || name.includes('terms') || content.includes('policy') || content.includes('cancellation')) {
            insights.policies.push({ name: fileName, content: docData.content });
        } else if (name.includes('procedure') || name.includes('process') || content.includes('step') || content.includes('process')) {
            insights.procedures.push({ name: fileName, content: docData.content });
        } else if (name.includes('service') || name.includes('treatment') || name.includes('menu')) {
            insights.services.push({ name: fileName, content: docData.content });
        } else {
            insights.general.push({ name: fileName, content: docData.content });
        }
    });

    return insights;
}

// Function to create smart document summaries
export function createDocumentSummary(documents) {
    const summary = {
        totalDocuments: Object.keys(documents).length,
        totalWords: Object.values(documents).reduce((sum, doc) => sum + (doc.wordCount || 0), 0),
        documentTypes: {},
        lastUpdated: null
    };

    Object.entries(documents).forEach(([fileName, docData]) => {
        // Categorize by file type
        const extension = fileName.split('.').pop()?.toLowerCase() || 'unknown';
        summary.documentTypes[extension] = (summary.documentTypes[extension] || 0) + 1;

        // Track most recent update
        if (!summary.lastUpdated || new Date(docData.lastModified) > new Date(summary.lastUpdated)) {
            summary.lastUpdated = docData.lastModified;
        }
    });

    return summary;
}