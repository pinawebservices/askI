// lib/customerDatabase.js - Categorized Structure

// Industry Templates - Base configurations for different business types
export const industryTemplates = {
    wellness_spa: {
        defaultFields: {
            businessType: "wellness_spa",
            toneStyle: "professional and caring",
            communicationStyle: "knowledgeable but approachable",
            formalityLevel: "professional but warm",
            responseTime: "within 2 hours during business hours",
            primaryColor: "#4A90E2"
        },
        commonServiceCategories: [
            "Massage Therapy",
            "Facial Treatments",
            "Body Treatments",
            "Wellness Services",
            "Package Deals"
        ],
        commonQuestions: [
            "service pricing and duration",
            "appointment scheduling",
            "preparation instructions",
            "cancellation policies",
            "health considerations",
            "package deals and memberships"
        ],
        leadCaptureFields: ["name", "phone", "email", "preferred_service", "preferred_date_time", "health_considerations"]
    },

    apartment_complex: {
        defaultFields: {
            businessType: "apartment_complex",
            toneStyle: "professional and enthusiastic",
            communicationStyle: "consultative sales approach",
            formalityLevel: "professional but approachable",
            responseTime: "within 2 hours during business hours, same day on weekends",
            primaryColor: "#1E88E5"
        },
        commonServiceCategories: [
            "Floor Plans & Availability",
            "Fees & Policies",
            "Amenities & Features",
            "Location & Transportation",
            "Lease Terms & Specials"
        ],
        commonQuestions: [
            "availability and pricing",
            "application requirements",
            "pet policies",
            "amenities and features",
            "neighborhood information",
            "current specials and incentives"
        ],
        leadCaptureFields: ["name", "phone", "email", "move_in_date", "budget_range", "pets", "tour_preference"]
    },

    beauty_salon: {
        defaultFields: {
            businessType: "beauty_salon",
            toneStyle: "warm and welcoming",
            communicationStyle: "friendly and professional",
            formalityLevel: "casual but polished",
            responseTime: "2 hours during business hours",
            primaryColor: "#E91E63"
        },
        commonServiceCategories: [
            "Hair Services",
            "Nail Services",
            "Facial Services",
            "Special Occasion",
            "Package Deals"
        ],
        commonQuestions: [
            "service pricing and timing",
            "stylist availability",
            "hair care recommendations",
            "special event preparation",
            "product recommendations",
            "membership programs"
        ],
        leadCaptureFields: ["name", "phone", "preferred_service", "preferred_stylist", "preferred_date_time", "special_requests"]
    },

    medical_dental: {
        defaultFields: {
            businessType: "medical_dental",
            toneStyle: "professional and reassuring",
            communicationStyle: "informative and empathetic",
            formalityLevel: "professional and respectful",
            responseTime: "within 4 hours during business hours",
            primaryColor: "#2E7D32"
        },
        commonServiceCategories: [
            "General Services",
            "Specialized Treatments",
            "Preventive Care",
            "Emergency Services",
            "Insurance & Billing"
        ],
        commonQuestions: [
            "appointment scheduling",
            "insurance acceptance",
            "service explanations",
            "preparation instructions",
            "emergency procedures",
            "billing and payment"
        ],
        leadCaptureFields: ["name", "phone", "insurance_provider", "preferred_appointment_type", "urgent_vs_routine", "preferred_date_time"]
    },

    auto_service: {
        defaultFields: {
            businessType: "auto_service",
            toneStyle: "professional and trustworthy",
            communicationStyle: "knowledgeable but not overly technical",
            formalityLevel: "professional and straightforward",
            responseTime: "within 3 hours during business hours",
            primaryColor: "#FF6F00"
        },
        commonServiceCategories: [
            "Maintenance Services",
            "Repair Services",
            "Diagnostic Services",
            "Emergency Services",
            "Pricing & Warranties"
        ],
        commonQuestions: [
            "service estimates and timing",
            "vehicle diagnostics",
            "maintenance schedules",
            "warranty information",
            "emergency repairs",
            "pickup and delivery"
        ],
        leadCaptureFields: ["name", "phone", "vehicle_year", "vehicle_make_model", "issue_description", "preferred_date_time", "service_type"]
    }
};

// Categorized Customer Database
export const customerDatabase = {
    // WELLNESS & SPA CATEGORY
    wellness_spa: {
        'mfr-001': {
            industry: "wellness_spa",
            businessName: "My Functional Recovery",
            businessBackground: `My Functional Recovery integrates my knowledge in body mechanics, kinesiology, mobility and range of motion gathered as a personal trainer along with my aligned goals as an Occupational Therapy assistant to help people reach or return to the activities that are most meaningful to them.

As a recovery specialist I provide customized sessions including neuro cupping, different stretching modalities, scrapping (Gua Sha, also known as Graston, Technique), Ice Therapy, and SRT (soft stretch myofascial release). 

Each session is customized to the client's needs. I am very grateful with my clients for their acceptance of my services and all the positive feedback I have received. It encourages me to continue to learn and better my business while providing the best service possible.`,

            servicesPricing: [
                {
                    category: "Bodywork Sessions",
                    services: [
                        {
                            name: "Customized Bodywork - 1 Hour",
                            pricing: "$90",
                            duration: "60 minutes",
                            description: "A fully customized bodywork session designed to meet your unique needs and wellness goals. This integrative treatment may include: Massage Therapy to relieve tension, reduce stress, and improve circulation; Scraping (Gua Sha) to help release muscle adhesions and promote lymphatic flow; Cupping Therapy to increase blood flow and support deep muscle relaxation; Hot Stones to soothe tight muscles and enhance relaxation.",
                            notes: "Perfect for first-time clients or regular maintenance sessions"
                        },
                        {
                            name: "Customized Bodywork - 1.5 Hour",
                            pricing: "$120",
                            duration: "90 minutes",
                            description: "Extended customized bodywork session perfect for comprehensive treatment. Includes all available modalities with extra time for deeper therapeutic work and relaxation.",
                            notes: "Ideal for clients with multiple areas of concern or those seeking deeper relaxation"
                        },
                        {
                            name: "Customized Bodywork - 2 Hour",
                            pricing: "$160",
                            duration: "120 minutes",
                            description: "Our most comprehensive session with all therapeutic modalities available. Perfect for full-body treatment, deep tissue work, and maximum relaxation. Ideal for athletes, those with chronic tension, or anyone wanting the ultimate wellness experience.",
                            notes: "Best value for comprehensive full-body treatment"
                        }
                    ]
                },
                {
                    category: "Facial Treatments",
                    services: [
                        {
                            name: "Radiant Face Massage",
                            pricing: "$60",
                            duration: "30 minutes",
                            description: "Relaxing facial massage designed to improve circulation, reduce tension, and promote a healthy glow. Excellent for stress relief and TMJ (temporomandibular joint) tension relief.",
                            notes: "Great standalone service for facial rejuvenation"
                        },
                        {
                            name: "Radiant Face Massage - Add On",
                            pricing: "$40",
                            duration: "30 minutes",
                            description: "Add this relaxing facial massage to any bodywork session. Improves circulation, reduces facial tension, and promotes healthy glow. Great for stress relief and TMJ tension.",
                            notes: "Must be purchased with a bodywork session. Cannot be booked alone."
                        },
                        {
                            name: "Sculpt and Restore",
                            pricing: "$120",
                            duration: "60 minutes",
                            description: "Complete facial wellness package combining facial massage, facial cupping, and neck/shoulder tension relief. This comprehensive treatment targets facial circulation, lymphatic drainage, and upper body tension. Ideal for deep relaxation and tension headache relief.",
                            notes: "Our most popular facial service - includes neck and shoulder work"
                        }
                    ]
                }
            ],

            businessHours: `MONDAY: CLOSED
TUESDAY: 9:00 AM - 7:00 PM
WEDNESDAY: 9:00 AM - 7:00 PM
THURSDAY: 9:00 AM - 8:00 PM
FRIDAY: 9:00 AM - 6:00 PM
SATURDAY: 8:00 AM - 5:00 PM
SUNDAY: 10:00 AM - 4:00 PM

Special Notes: Flexible scheduling available outside these hours. Please call to discuss your preferred appointment times if these hours don't work for you.`,

            faqSection: `FREQUENTLY ASKED QUESTIONS:

Q: What should I expect during my first session?
A: We'll start with a brief consultation to discuss your health history, current concerns, and wellness goals. Then I'll customize the session to your specific needs using various therapeutic modalities like massage, cupping, scraping, and hot stones.

Q: Do you accept insurance?
A: I do not directly bill insurance, but I can provide detailed receipts for potential reimbursement through your HSA/FSA or insurance provider. Many clients successfully get partial reimbursement.

Q: How should I prepare for my session?
A: Wear comfortable clothing that allows easy movement. Avoid eating a large meal 2 hours before your session. Arrive a few minutes early to complete intake forms. Hydrate well before and after your session.

Q: How often should I schedule sessions?
A: This depends on your individual needs and goals. For therapeutic purposes, weekly sessions are often recommended initially. For maintenance and wellness, bi-weekly or monthly sessions work well. We'll discuss what's best for you during your consultation.

Q: What conditions do you work with?
A: I work with various conditions including muscle tension, stress, limited mobility, post-injury recovery, sports performance enhancement, and general wellness maintenance. However, I do not diagnose or treat medical conditions - I work with your existing healthcare team.

Q: What's the difference between the different session lengths?
A: 1-hour sessions are perfect for targeting specific areas or maintenance. 1.5-hour sessions allow for more comprehensive work and relaxation. 2-hour sessions provide the most thorough full-body treatment with time for all modalities.`,

            contactInfo: `CONTACT INFORMATION:
Phone: (954) 555-0123
Email: info@myfunctionalrecovery.com
Address: 123 Wellness Way, Fort Lauderdale, FL 33301

SCHEDULING: Online booking available or call/text to schedule
PARKING: Free parking available on-site
PAYMENT: Cash, credit cards, HSA/FSA accounts accepted
CANCELLATION: 24-hour cancellation policy`,

            specialInstructions: `IMPORTANT INSTRUCTIONS:
- Always emphasize that ALL sessions are completely customized to individual client needs
- When discussing services, mention my dual credentials as both a certified personal trainer AND occupational therapy assistant
- For new clients, always offer to explain the different therapeutic modalities available (cupping, scraping/Gua Sha, hot stones, massage, etc.)
- If someone mentions specific injuries or medical conditions, recommend they consult with their healthcare provider first, but emphasize that I work collaboratively with healthcare teams
- Always collect basic health history information before scheduling first sessions
- Mention flexible scheduling options for busy professionals and healthcare workers
- When asked about pricing, provide specific prices for each service and explain what's included
- For add-on services, clearly explain they must be combined with a base service
- If someone seems unsure about session length, recommend starting with 1-hour and adjusting future sessions based on their needs`,

            // Use template defaults
            ...industryTemplates.wellness_spa.defaultFields
        }
    },

    // APARTMENT COMPLEX CATEGORY
    apartment_complex: {
        'sunset-bay-001': {
            industry: "apartment_complex",
            businessName: "Sunset Bay Apartments",
            businessBackground: `Sunset Gardens Apartments is a premier residential community located in the heart of downtown Fort Lauderdale. We offer modern living with luxury amenities in a convenient location. Our property features beautifully designed apartments with contemporary finishes and resort-style amenities.`,

            servicesPricing: [
                {
                    category: "Floor Plans & Availability",
                    services: [
                        {
                            name: "Studio Apartment",
                            pricing: "$1,850 - $2,100/month",
                            duration: "650-750 sq ft",
                            description: "Perfect for singles or young professionals seeking modern downtown living",
                            notes: "Limited availability - popular floor plan. Includes: Modern finishes, in-unit washer/dryer, stainless steel appliances, private balcony"
                        },
                        {
                            name: "One Bedroom Apartment",
                            pricing: "$2,200 - $2,650/month",
                            duration: "850-950 sq ft",
                            description: "Spacious layout with premium finishes and stunning views",
                            notes: "Most popular floor plan. Includes: Walk-in closet, granite countertops, in-unit washer/dryer, water/city views"
                        },
                        {
                            name: "Two Bedroom Apartment",
                            pricing: "$2,800 - $3,200/month",
                            duration: "1,100-1,250 sq ft",
                            description: "Family-friendly layout with ample space and storage",
                            notes: "Family-friendly layout. Includes: Two full bathrooms, private balcony, walk-in closets, upgraded appliances"
                        },
                        {
                            name: "Luxury Penthouse",
                            pricing: "$4,200 - $4,800/month",
                            duration: "1,400-1,600 sq ft",
                            description: "Ultimate luxury living with exclusive amenities",
                            notes: "Only 4 units available - exclusive living. Includes: Panoramic city views, private rooftop access, premium finishes, concierge services"
                        }
                    ]
                }
            ],

            businessHours: `LEASING OFFICE HOURS:
MONDAY - FRIDAY: 9:00 AM - 6:00 PM
SATURDAY: 10:00 AM - 5:00 PM
SUNDAY: 12:00 PM - 5:00 PM

MAINTENANCE EMERGENCY HOTLINE: 24/7
AMENITY ACCESS: 6:00 AM - 10:00 PM Daily

Special Notes: Tours available by appointment outside regular hours. Emergency maintenance available 24/7.`,

            faqSection: `FREQUENTLY ASKED QUESTIONS:

Q: What's included in the rent?
A: All utilities except electricity are included. This covers water, sewer, trash, internet, and cable TV.

Q: Do you allow pets?
A: Yes! We're pet-friendly. There's a $300 pet deposit and $50/month pet rent. We have a dog park on-site.

Q: What amenities do you offer?
A: Resort-style pool, state-of-the-art fitness center, clubhouse, dog park, covered parking, 24/7 concierge, rooftop deck with city views.

Q: Are there any current specials?
A: Yes! New residents get their first month free on 12-month leases. Ask about our move-in specials.

Q: What's your application process?
A: Online applications are processed within 24 hours. We require proof of income (3x rent), background check, and references.

Q: Do you have parking?
A: Yes, covered parking is available for $75/month. Street parking is also available.`,

            contactInfo: `CONTACT INFORMATION:
Phone: (954) 555-RENT (7363)
Email: leasing@sunsetgardens.com
Address: 123 Sunset Boulevard, Fort Lauderdale, FL 33301

Leasing Office Hours: Monday-Friday 9AM-6PM, Saturday 10AM-5PM, Sunday 12PM-5PM
Emergency Maintenance: 24/7 hotline available
Virtual Tours: Available online anytime
In-Person Tours: Available by appointment`,

            specialInstructions: `CRITICAL LEAD CAPTURE INSTRUCTIONS:
- Always emphasize our luxury amenities and downtown location
- For tour requests, collect name, phone, email, and preferred date/time
- Mention current specials when appropriate
- Ask about specific needs (pet-friendly, floor preferences, move-in timeline)
- Highlight unique features like rooftop deck and concierge services
- If asked about availability, mention that inventory changes daily and encourage tours
- Always use the structured format when listing apartment options`,

            // Use template defaults
            ...industryTemplates.apartment_complex.defaultFields
        }
    },

    // BEAUTY SALON CATEGORY
    beauty_salon: {
        'bella-salon-002': {
            industry: "beauty_salon",
            businessName: "Bella's Hair Salon & Spa",
            businessBackground: `Bella's Hair Salon & Spa has been serving the downtown area for over 15 years. We're a full-service salon specializing in precision cuts, color services, and relaxing spa treatments.`,

            servicesPricing: [
                {
                    category: "Hair Services",
                    services: [
                        {
                            name: "Women's Cut & Style",
                            pricing: "$65-85",
                            duration: "60-75 minutes",
                            description: "Includes consultation, wash, precision cut, and blow dry styling",
                            notes: "Price varies by hair length and complexity"
                        }
                    ]
                }
            ],

            businessHours: `SALON HOURS:
MONDAY: CLOSED
TUESDAY: 9:00 AM - 7:00 PM
WEDNESDAY: 9:00 AM - 7:00 PM
THURSDAY: 9:00 AM - 8:00 PM
FRIDAY: 9:00 AM - 6:00 PM
SATURDAY: 8:00 AM - 5:00 PM
SUNDAY: 10:00 AM - 4:00 PM`,

            faqSection: `FREQUENTLY ASKED QUESTIONS:

Q: Do you take walk-ins?
A: We prefer appointments but accept walk-ins based on availability.

Q: What products do you use?
A: We use professional salon products including Redken, Paul Mitchell, and Olaplex.

Q: Do you offer consultations?
A: Yes! Free consultations are included with all services.`,

            contactInfo: `CONTACT INFORMATION:
Phone: (954) 555-HAIR (4247)
Email: info@bellasalon.com
Address: 456 Beauty Boulevard, Fort Lauderdale, FL 33301`,

            specialInstructions: `SALON INSTRUCTIONS:
- Always mention our 15+ years of experience
- Ask about hair type and previous treatments
- Recommend consultations for major changes
- Mention our professional product lines`,

            // Use template defaults
            ...industryTemplates.beauty_salon.defaultFields
        }
    },

    // MEDICAL/DENTAL CATEGORY (for future expansion)
    medical_dental: {
        // Future medical/dental customers will go here
    },

    // AUTO SERVICE CATEGORY (for future expansion)
    auto_service: {
        // Future auto service customers will go here
    }
};

// Updated getter function that handles categorized structure
export function getCustomerData(customerId) {
    console.log('🔍 Searching for customerId:', customerId);

    // Search through all categories
    for (const [category, customers] of Object.entries(customerDatabase)) {
        if (customers && typeof customers === 'object' && customers[customerId]) {
            console.log('✅ Found customer in category:', category);
            return customers[customerId];
        }
    }

    console.log('❌ Customer not found:', customerId);
    return null;
}

// New function to get industry template
export function getIndustryTemplate(industryType) {
    return industryTemplates[industryType] || null;
}

// New function to get all customers by industry
export function getCustomersByIndustry(industryType) {
    return customerDatabase[industryType] || {};
}