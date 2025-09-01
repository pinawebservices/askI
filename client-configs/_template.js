// clients/_template.js
// Copy this file and rename to create new clients

export default {
    // Basic info
    client_id: 'xxx-000',  // Unique identifier
    business_name: 'Business Name Here',
    industry: 'industry_type',  // law_firm, accounting_firm, medical_practice, etc.
    contact_email: 'email@example.com',
    plan_type: 'starter',  // free, starter, pro, enterprise

    // Business details
    business_background: 'Describe the business...',

    // AI Instructions
    special_instructions: 'Special instructions for the AI...',
    tone_style: 'professional',
    communication_style: 'clear and helpful',
    formality_level: 'professional',
    formatting_rules: 'Formatting guidelines...',
    lead_capture_process: 'How to capture leads...',

    // Services
    services: [
        {
            category: 'Category Name',
            services: [
                {
                    name: 'Service Name',
                    pricing: '$XXX',
                    duration: 'XX minutes',
                    description: 'Service description',
                    notes: 'Additional notes'
                }
            ]
        }
    ],

    // FAQ
    faq: [
        {
            question: 'Common question?',
            answer: 'Detailed answer.'
        }
    ],

    // Business hours
    business_hours: 'Monday-Friday: 9:00 AM - 5:00 PM',

    // Contact info
    contact_info: {
        phone: '(555) 000-0000',
        email: 'info@example.com',
        address: '123 Main St, City, ST 12345',
        website: 'www.example.com'
    },

    // Google Drive config (optional)
    google_config: {
        includeGoogleDrive: false,
        googleDriveFolderId: null,
        googleSheetsId: null
    }
};