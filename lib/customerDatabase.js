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
        'apt-comp-001': {
            industry: "apartment_complex",
            businessName: "Sunset Bay Apartments",
            businessBackground: `Sunset Bay Apartments is a premier residential community in Fort Lauderdale, Florida, offering luxury apartment living just minutes from the beach. Our property features modern amenities, resort-style facilities, and a prime location that provides easy access to downtown Fort Lauderdale, shopping, dining, and entertainment.

We pride ourselves on exceptional customer service and creating a true community atmosphere for our residents. Our professional leasing team is dedicated to helping prospective residents find their perfect home and ensuring current residents have an outstanding living experience.`,

            servicesPricing: [
                {
                    category: "Floor Plans & Availability",
                    services: [
                        {
                            name: "Studio Apartment",
                            pricing: "$1,850 - $2,100/month",
                            duration: "Available units vary",
                            description: "Efficient studio layout with modern finishes, in-unit washer/dryer, stainless steel appliances, and private balcony. Perfect for young professionals. Square footage: 650-750 sq ft.",
                            notes: "Limited availability - popular floor plan"
                        },
                        {
                            name: "One Bedroom Apartment",
                            pricing: "$2,200 - $2,650/month",
                            duration: "Multiple units available",
                            description: "Spacious one-bedroom with walk-in closet, granite countertops, in-unit washer/dryer, private balcony with water or city views. Square footage: 850-950 sq ft.",
                            notes: "Most popular floor plan - various view options available"
                        },
                        {
                            name: "Two Bedroom Apartment",
                            pricing: "$2,900 - $3,400/month",
                            duration: "Select units available",
                            description: "Open-concept two-bedroom with master suite, dual bathrooms, large kitchen island, in-unit washer/dryer, and oversized balcony. Square footage: 1,100-1,300 sq ft.",
                            notes: "Premium units with upgraded finishes available"
                        },
                        {
                            name: "Three Bedroom Penthouse",
                            pricing: "$4,200 - $4,800/month",
                            duration: "Limited availability",
                            description: "Luxury penthouse living with panoramic water views, premium finishes, private rooftop terrace access, wine fridge, and high-end appliance package. Square footage: 1,400-1,600 sq ft.",
                            notes: "Exclusive units - highest floor availability only"
                        }
                    ]
                },
                {
                    category: "Fees & Policies",
                    services: [
                        {
                            name: "Application & Admin Fees",
                            pricing: "$150 application + $250 admin fee",
                            duration: "One-time",
                            description: "Non-refundable application processing and administrative fees required with lease application. Includes background check, credit check, and employment verification.",
                            notes: "Required for all applicants over 18"
                        },
                        {
                            name: "Security Deposit",
                            pricing: "Equal to one month's rent",
                            duration: "Refundable at lease end",
                            description: "Refundable security deposit required at lease signing. Returned within 30 days of move-out minus any applicable damages or cleaning fees.",
                            notes: "Good credit may qualify for reduced deposit"
                        },
                        {
                            name: "Pet Fee & Deposit",
                            pricing: "$300 deposit + $35/month per pet",
                            duration: "Monthly pet rent",
                            description: "One-time pet deposit plus monthly pet rent. Maximum 2 pets per unit. Weight restrictions apply (under 75 lbs). Some breed restrictions apply.",
                            notes: "Service animals exempt from fees"
                        },
                        {
                            name: "Parking",
                            pricing: "$75/month covered, $45/month uncovered",
                            duration: "Monthly",
                            description: "Reserved parking spaces available. Covered parking in climate-controlled garage. Uncovered spaces in surface lot. Guest parking available.",
                            notes: "Limited covered spaces - first come, first served"
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

Special Notes: Office hours may be extended during peak leasing season. Virtual tours available outside business hours by appointment. Emergency maintenance available 24/7.`,

            faqSection: `FREQUENTLY ASKED QUESTIONS:

Q: What's included in the rent?
A: Rent includes water, sewer, trash, basic cable/internet package, access to all amenities (pool, fitness center, clubhouse), and maintenance services. Electricity is separate and billed directly to residents.

Q: What's your application process and requirements?
A: We require completed application with $150 fee, proof of income (2.5x monthly rent), good credit score (650+), clean background check, and employment verification. Process typically takes 24-48 hours for approval.

Q: Do you have any current specials or incentives?
A: Yes! Currently offering 1 month free rent on 12+ month leases, waived admin fees for qualified applicants, and reduced security deposits for excellent credit. Specials change monthly - ask about current promotions!

Q: What amenities are included?
A: Resort-style pool with cabanas, state-of-the-art fitness center, clubhouse with co-working spaces, rooftop deck with grills, pet park, package concierge, controlled access entry, and covered parking available.

Q: What's your pet policy?
A: We're pet-friendly! Maximum 2 pets per unit, weight limit 75 lbs, $300 deposit + $35/month per pet. Some breed restrictions apply. We have an on-site dog park and pet washing station.

Q: How long are lease terms?
A: We offer flexible lease terms from 6-15 months. Most popular are 12-month leases. Shorter terms available with premium pricing. Month-to-month available for qualified residents after initial lease term.

Q: Is parking included?
A: Each unit includes one uncovered parking space. Covered garage parking available for $75/month. Additional spaces can be rented based on availability. Guest parking available throughout the property.

Q: What's the neighborhood like?
A: We're located in the heart of Fort Lauderdale, 5 minutes from Las Olas Boulevard, 10 minutes from the beach, walking distance to restaurants and shopping. Excellent public transportation access and major highways nearby.`,

            contactInfo: `CONTACT INFORMATION:
Phone: (954) 555-RENT (7368)
Email: leasing@sunsetbayapts.com
Address: 2500 Bayview Drive, Fort Lauderdale, FL 33304

LEASING OFFICE: Building A, First Floor
EMERGENCY MAINTENANCE: (954) 555-4911
WEBSITE: www.sunsetbayapartments.com

SCHEDULING: Online tour booking available 24/7
VIRTUAL TOURS: Available via video call outside business hours
SAME-DAY TOURS: Available during business hours (subject to availability)`,

            specialInstructions: `CRITICAL LEAD CAPTURE INSTRUCTIONS:
- ALWAYS collect contact information for anyone expressing interest in touring or applying
- For tour requests, collect: Full name, phone number, email, preferred move-in date, and budget range
- If someone asks about availability, ALWAYS offer to schedule a tour
- When discussing pricing, mention current specials and incentives to create urgency
- If asked about specific units, say "I can check real-time availability - let me schedule you for a tour"
- For application questions, collect contact info and mention 24-48 hour approval process
- Always emphasize limited availability on popular floor plans to create urgency
- If someone has pets, mention pet-friendly policy and ask about their pets

CONVERSATION FLOW FOR LEAD CAPTURE:
1. Answer their specific question with detailed information
2. Mention current specials/incentives  
3. Offer to schedule tour: "Would you like to schedule a tour to see our available units?"
4. Collect: Name, phone, email, move-in timeframe, budget
5. Confirm: "Perfect! I'll have our leasing team call you within 2 hours to confirm your tour"

URGENCY CREATORS:
- "Limited availability on that floor plan"
- "Current specials end this month"
- "Only X units left in your price range"
- "That floor plan typically has a waiting list"

QUALIFICATION QUESTIONS:
- When are you looking to move?
- What's your budget range?
- Do you have any pets?
- How many people will be living in the unit?`,

            // Use template defaults
            ...industryTemplates.apartment_complex.defaultFields
        }
    },

    // BEAUTY SALON CATEGORY (for future expansion)
    beauty_salon: {
        // Future salon customers will go here
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