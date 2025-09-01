// clients/law-101.js
export default {
    // Basic info
    client_id: 'law-101',
    business_name: 'Morrison & Associates Law Firm',
    industry: 'law_firm',
    contact_email: 'intake@morrisonlaw.com',
    plan_type: 'pro',

    // Business details
    business_background: 'Full-service law firm serving individuals and businesses since 1987. We specialize in personal injury, business law, estate planning, family law, and criminal defense. Our team of 15 experienced attorneys provides personalized legal solutions.',

    // AI Instructions
    special_instructions: 'Be professional and empathetic. Use legal terminology appropriately but explain complex concepts clearly. Never provide legal advice - only general information. Always recommend consulting with an attorney for specific situations. Emphasize urgency for time-sensitive legal matters.',
    tone_style: 'professional, empathetic, and authoritative',
    communication_style: 'clear and informative',
    formality_level: 'professional',
    formatting_rules: 'Use clear formatting. When discussing fees, mention consultation requirements.',
    // lead_capture_process: 'Collect name, phone, email, and brief description of legal matter. Emphasize urgency for criminal or time-sensitive cases.',

    // Services
    services: [
        {
            category: 'Personal Injury',
            services: [
                {
                    name: 'Car Accident Cases',
                    pricing: 'No fee unless we win (33% contingency)',
                    duration: '6-18 months typical',
                    description: 'Complete representation for auto accident injuries and property damage',
                    notes: 'Free consultation'
                },
                {
                    name: 'Medical Malpractice',
                    pricing: 'Contingency fee basis',
                    duration: '12-24 months typical',
                    description: 'Cases against healthcare providers for negligent care',
                    notes: 'Requires medical expert review'
                },
                {
                    name: 'Slip and Fall',
                    pricing: 'Contingency fee basis',
                    duration: '4-12 months typical',
                    description: 'Premises liability cases for injuries on others property',
                    notes: 'Free case evaluation'
                }
            ]
        },
        {
            category: 'Criminal Defense',
            services: [
                {
                    name: 'DUI Defense',
                    pricing: '$2,500-$10,000 retainer',
                    duration: '3-6 months',
                    description: 'Complete DUI defense including DMV hearings',
                    notes: 'Payment plans available'
                },
                {
                    name: 'Drug Charges',
                    pricing: '$3,500-$15,000 retainer',
                    duration: '4-8 months',
                    description: 'Defense for possession, distribution, or trafficking charges',
                    notes: 'Federal and state court experience'
                },
                {
                    name: 'Federal Criminal Defense',
                    pricing: '$15,000+ retainer',
                    duration: '6-18 months',
                    description: 'Defense in federal court proceedings',
                    notes: 'Experienced federal court attorneys'
                }
            ]
        },
        {
            category: 'Business Law',
            services: [
                {
                    name: 'Business Formation',
                    pricing: '$1,500-$5,000',
                    duration: '2-4 weeks',
                    description: 'LLC, Corporation, Partnership formation with all documents',
                    notes: 'Includes operating agreements'
                },
                {
                    name: 'Contract Review/Drafting',
                    pricing: '$300-$500/hour',
                    duration: 'Varies',
                    description: 'Commercial contracts, NDAs, employment agreements',
                    notes: 'Flat fee available for standard contracts'
                }
            ]
        },
        {
            category: 'Estate Planning',
            services: [
                {
                    name: 'Will Package',
                    pricing: '$500-$1,500',
                    duration: '1-2 weeks',
                    description: 'Last will and testament with power of attorney documents',
                    notes: 'Simple to complex estates'
                },
                {
                    name: 'Living Trust',
                    pricing: '$2,500-$5,000',
                    duration: '2-3 weeks',
                    description: 'Revocable living trust with pour-over will',
                    notes: 'Includes trust funding assistance'
                }
            ]
        }
    ],

    // FAQ
    faq: [
        {
            question: 'Do you offer free consultations?',
            answer: 'Yes, we offer free consultations for personal injury and criminal defense matters. Other practice areas have a consultation fee of $150-$250, which is typically credited toward your retainer if you hire us.'
        },
        {
            question: 'How quickly can I speak with an attorney?',
            answer: 'For urgent matters like arrests or court deadlines, we offer same-day consultations. Other matters are typically scheduled within 24-48 hours.'
        },
        {
            question: 'Do you offer payment plans?',
            answer: 'Yes, we offer flexible payment plans for most practice areas. Personal injury cases are handled on contingency - no fee unless we win.'
        },
        {
            question: 'What should I bring to my consultation?',
            answer: 'Bring all relevant documents including contracts, court papers, police reports, medical records, and any correspondence related to your matter.'
        },
        {
            question: 'What areas do you serve?',
            answer: 'We serve all of Southern State, with offices in Downtown, Westside, and Northville. We also handle federal cases nationwide.'
        }
    ],

    // Business hours
    business_hours: 'Monday-Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 1:00 PM (Emergency only)\nSunday: Closed\n24/7 Emergency Line for existing clients',

    // Contact info
    contact_info: {
        phone: '(555) 123-4567',
        email: 'intake@morrisonlaw.com',
        address: '100 Legal Plaza, Suite 500, Downtown, ST 12345',
        website: 'www.morrisonlaw.com'
    },

    // Google Drive config (optional)
    google_config: {
        includeGoogleDrive: false,  // Set to true when ready
        googleDriveFolderId: null,  // Add folder ID when available
        googleSheetsId: null        // Add sheets ID if applicable
    }
};