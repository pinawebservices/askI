// lib/customerData.js
export const customerDatabase = {
    'mfr-001': {
        businessName: "My Functional Recovery",

        // Business Background
        businessBackground: `My Functional Recovery integrates my knowledge in body mechanics, kinesiology, mobility and range of motion gathered as a personal trainer along with my aligned goals as an Occupational Therapy assistant to help people reach or return to the activities that are most meaningful to them.
         As a recovery specialist I provide customized sessions including neuro cupping, different stretching modalities, scrapping (Gua Sha, also known as Graston, Technique), Ice Therapy, and SRT (soft stretch myofascial release). 
         Each session is customized to the client's needs. I am very grateful with my clients for their acceptance of my services and all the positive feedback I have received. 
         It encourages me to continue to learn and better my business while providing the best service possible.`,

        // Services & Pricing (formatted for AI)
        servicesPricing: [
            {
                category: "Body work",
                services: [
                    {
                        name: "Customized Body work - 1 Hour",
                        description: "Customized Bodywork Session. Treat yourself to a fully customized session designed to meet your unique needs and wellness goals. This integrative treatment may include: Massage Therapy – to relieve tension, reduce stress, and improve circulation; Scraping (Gua Sha) – to help release muscle adhesions and promote lymphatic flow; Cupping Therapy – to increase blood flow and support deep muscle relaxation; Hot Stones – to soothe tight muscles and enhance relaxation",
                        pricing: "$90",
                        duration: "60 minutes",
                        notes: ""
                    },
                    {
                        name: "Customized Body work - 2 Hour",
                        description: "Extended customized bodywork session with all modalities available for deeper therapeutic work",
                        pricing: "$160",
                        duration: "120 minutes",
                        notes: ""
                    },
                    {
                        name: "Customized Body work - 1.5 Hour",
                        description: "Mid-length customized bodywork session perfect for comprehensive treatment",
                        pricing: "$120",
                        duration: "90 minutes",
                        notes: ""
                    }
                ]
            },
            {
                category: "Face Massage",
                services: [
                    {
                        name: "Radiant Face Massage",
                        description: "Relaxing Facial Massage to improve circulation, reduce tension, and promote healthy glow. Great for stress relief and TMJ (temporomandibular joint) tension.",
                        pricing: "$60",
                        duration: "30 minutes"
                    },
                    {
                        name: "Radiant Face Massage - Add On",
                        description: "Add to a regular massage session. A relaxing facial massage to improve circulation, reduce tension and promote healthy glow. Great for stress relief and TMJ tension.",
                        pricing: "$40",
                        duration: "30 minutes",
                        notes: "Must be purchased in conjunction with a base body or face massage service."
                    },
                    {
                        name: "Sculpt and Restore",
                        description: "INCLUDES: a full session combining a facial massage, facial cupping, neck and shoulder tension relief. Ideal for deep relaxation and tension headaches.",
                        pricing: "$120",
                        duration: "60 minutes"
                    }
                ]
            }
        ],

        // Hours
        businessHours: {
            monday: "CLOSED",
            tuesday: "9:00 AM - 7:00 PM",
            wednesday: "9:00 AM - 7:00 PM",
            thursday: "9:00 AM - 8:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "8:00 AM - 5:00 PM",
            sunday: "10:00 AM - 4:00 PM",
            notes: "Flexible scheduling available. Please call to discuss your preferred appointment times."
        },

        // FAQ Section
        faqSection: `
Q: What should I expect during my first session?
A: We'll start with a brief consultation to discuss your health history, current concerns, and wellness goals. Then I'll customize the session to your specific needs using various therapeutic modalities.

Q: Do you accept insurance?
A: I do not directly bill insurance, but I can provide receipts for potential reimbursement through your HSA/FSA or insurance provider.

Q: How should I prepare for my session?
A: Wear comfortable clothing that allows easy movement. Avoid eating a large meal 2 hours before your session. Arrive a few minutes early to complete intake forms.

Q: How often should I schedule sessions?
A: This depends on your individual needs and goals. Some clients benefit from weekly sessions, while others prefer bi-weekly or monthly maintenance sessions.

Q: What conditions do you work with?
A: I work with various conditions including muscle tension, stress, limited mobility, post-injury recovery, and general wellness maintenance. However, I do not diagnose or treat medical conditions.`,

        // Contact Info
        contactInfo: `
Phone: (954) 555-0123
Email: info@myfunctionalrecovery.com
Address: 123 Wellness Way, Fort Lauderdale, FL 33301

Scheduling: Online booking available or call/text to schedule
Parking: Free parking available on-site
Payment: Cash, credit cards, HSA/FSA accepted`,

        // Special Instructions
        specialInstructions: `
- Always emphasize that sessions are customized to individual needs
- Mention that I'm both a certified personal trainer and occupational therapy assistant
- For new clients, offer to explain the different modalities available
- If someone has specific injuries or medical conditions, recommend they consult with their healthcare provider first
- Always collect health history information before first sessions
- Mention flexible scheduling options for busy professionals`,

        // Tone & Style
        toneStyle: "professional and caring",
        communicationStyle: "knowledgeable but approachable",
        formalityLevel: "professional but warm",
        responseTime: "within 2 hours during business hours",

        // Technical Settings
        primaryColor: "#4A90E2", // Professional blue
        businessType: "wellness"
    },

    'bella-salon-002': {
        businessName: "Bella's Hair Salon & Spa",
        businessBackground: `Bella's Hair Salon & Spa has been serving the downtown area for over 15 years. We're a full-service salon specializing in precision cuts, color services, and relaxing spa treatments.`,
        servicesPricing: [
            {
                category: "Hair Services",
                services: [
                    {
                        name: "Women's Cut & Style",
                        description: "Includes consultation, wash, precision cut, and blow dry styling",
                        pricing: "$65-85",
                        duration: "60-75 minutes",
                        notes: "Price varies by hair length and complexity"
                    }
                ]
            }
        ],
        businessHours: {
            monday: "CLOSED",
            tuesday: "9:00 AM - 7:00 PM",
            wednesday: "9:00 AM - 7:00 PM",
            thursday: "9:00 AM - 8:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "8:00 AM - 5:00 PM",
            sunday: "10:00 AM - 4:00 PM"
        },
        toneStyle: "warm and welcoming",
        communicationStyle: "friendly and professional",
        formalityLevel: "casual but polished",
        responseTime: "2 hours",
        primaryColor: "#E91E63"
    }
};

export function getCustomerData(customerId) {
    console.log('🔍 Searching for customerId:', customerId);
    console.log('📚 Available customers:', Object.keys(customerDatabase));
    const result = customerDatabase[customerId] || null;
    console.log('✅ Found customer data:', !!result);
    return result;
}