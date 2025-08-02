// lib/customerOnboarding.js - Helper functions for adding new customers

import { industryTemplates } from './customerDatabase.js';

/**
 * Generate a new customer template based on industry type
 */
export function generateCustomerTemplate(industryType, customerId, basicInfo = {}) {
    const template = industryTemplates[industryType];
    if (!template) {
        throw new Error(`Unknown industry type: ${industryType}`);
    }

    return {
        industry: industryType,
        businessName: basicInfo.businessName || 'Business Name',
        businessBackground: basicInfo.businessBackground || 'Enter business background...',

        // Use template's common service categories as starting point
        servicesPricing: template.commonServiceCategories.map(categoryName => ({
            category: categoryName,
            services: [
                {
                    name: 'Service Name',
                    pricing: '$XX',
                    duration: 'XX minutes',
                    description: 'Service description...',
                    notes: 'Any special notes...'
                }
            ]
        })),

        businessHours: basicInfo.businessHours || `MONDAY - FRIDAY: 9:00 AM - 6:00 PM
SATURDAY: 10:00 AM - 4:00 PM
SUNDAY: CLOSED

Special Notes: Extended hours available by appointment.`,

        faqSection: `FREQUENTLY ASKED QUESTIONS:

${template.commonQuestions.map(q => `Q: ${q}?
A: [Enter answer for ${q}]`).join('\n\n')}`,

        contactInfo: basicInfo.contactInfo || `CONTACT INFORMATION:
Phone: (XXX) XXX-XXXX
Email: info@business.com
Address: Business Address

SCHEDULING: Call or online booking
PAYMENT: Cash, credit cards accepted`,

        specialInstructions: basicInfo.specialInstructions || 'Enter special instructions for AI assistant...',

        // Apply industry defaults
        ...template.defaultFields,

        // Override with any custom settings
        ...basicInfo
    };
}

/**
 * Quick setup for apartment complexes
 */
export function createApartmentTemplate(customerId, apartmentInfo) {
    const basicTemplate = generateCustomerTemplate('apartment_complex', customerId, apartmentInfo);

    // Apartment-specific service categories
    basicTemplate.servicesPricing = [
        {
            category: "Floor Plans & Availability",
            services: [
                {
                    name: "Studio Apartment",
                    pricing: "$X,XXX - $X,XXX/month",
                    duration: "Available units vary",
                    description: "Studio layout with modern amenities. Square footage: XXX sq ft.",
                    notes: "Limited availability"
                },
                {
                    name: "One Bedroom Apartment",
                    pricing: "$X,XXX - $X,XXX/month",
                    duration: "Multiple units available",
                    description: "Spacious one-bedroom with modern amenities. Square footage: XXX sq ft.",
                    notes: "Most popular floor plan"
                },
                {
                    name: "Two Bedroom Apartment",
                    pricing: "$X,XXX - $X,XXX/month",
                    duration: "Select units available",
                    description: "Two-bedroom with modern amenities. Square footage: XXX sq ft.",
                    notes: "Premium units available"
                }
            ]
        },
        {
            category: "Fees & Policies",
            services: [
                {
                    name: "Application & Admin Fees",
                    pricing: "$XXX application + $XXX admin fee",
                    duration: "One-time",
                    description: "Non-refundable application and administrative fees.",
                    notes: "Required for all applicants over 18"
                },
                {
                    name: "Security Deposit",
                    pricing: "Equal to one month's rent",
                    duration: "Refundable at lease end",
                    description: "Refundable security deposit required at lease signing.",
                    notes: "Good credit may qualify for reduced deposit"
                },
                {
                    name: "Pet Fee & Deposit",
                    pricing: "$XXX deposit + $XX/month per pet",
                    duration: "Monthly pet rent",
                    description: "Pet deposit plus monthly pet rent. Weight and breed restrictions apply.",
                    notes: "Service animals exempt from fees"
                }
            ]
        }
    ];

    return basicTemplate;
}

/**
 * Quick setup for wellness/spa businesses
 */
export function createWellnessTemplate(customerId, wellnessInfo) {
    const basicTemplate = generateCustomerTemplate('wellness_spa', customerId, wellnessInfo);

    // Wellness-specific service categories
    basicTemplate.servicesPricing = [
        {
            category: "Massage Therapy",
            services: [
                {
                    name: "60-Minute Massage",
                    pricing: "$XXX",
                    duration: "60 minutes",
                    description: "Customized massage therapy session.",
                    notes: "Most popular service"
                },
                {
                    name: "90-Minute Massage",
                    pricing: "$XXX",
                    duration: "90 minutes",
                    description: "Extended massage therapy session.",
                    notes: "For comprehensive treatment"
                }
            ]
        },
        {
            category: "Facial Treatments",
            services: [
                {
                    name: "Classic Facial",
                    pricing: "$XXX",
                    duration: "60 minutes",
                    description: "Rejuvenating facial treatment.",
                    notes: "Great for all skin types"
                }
            ]
        }
    ];

    return basicTemplate;
}

/**
 * Quick setup for beauty salons
 */
export function createSalonTemplate(customerId, salonInfo) {
    const basicTemplate = generateCustomerTemplate('beauty_salon', customerId, salonInfo);

    // Salon-specific service categories
    basicTemplate.servicesPricing = [
        {
            category: "Hair Services",
            services: [
                {
                    name: "Women's Cut & Style",
                    pricing: "$XX - $XXX",
                    duration: "60-75 minutes",
                    description: "Professional haircut with wash and styling.",
                    notes: "Price varies by hair length"
                },
                {
                    name: "Men's Cut",
                    pricing: "$XX",
                    duration: "30 minutes",
                    description: "Professional men's haircut.",
                    notes: "Quick and efficient"
                },
                {
                    name: "Color Service",
                    pricing: "$XXX - $XXX",
                    duration: "2-3 hours",
                    description: "Professional hair coloring service.",
                    notes: "Consultation recommended"
                }
            ]
        },
        {
            category: "Nail Services",
            services: [
                {
                    name: "Manicure",
                    pricing: "$XX",
                    duration: "30 minutes",
                    description: "Professional nail care and polish.",
                    notes: "Gel options available"
                },
                {
                    name: "Pedicure",
                    pricing: "$XX",
                    duration: "45 minutes",
                    description: "Relaxing foot care and polish.",
                    notes: "Perfect for relaxation"
                }
            ]
        }
    ];

    return basicTemplate;
}

/**
 * Validate and suggest improvements for customer data
 */
export function validateAndSuggestImprovements(customerData) {
    const suggestions = [];

    // Check business background
    if (!customerData.businessBackground || customerData.businessBackground.length < 100) {
        suggestions.push("Business background should be more detailed (at least 100 characters) to help the AI understand your business better.");
    }

    // Check services
    if (!customerData.servicesPricing || customerData.servicesPricing.length === 0) {
        suggestions.push("Add at least one service category with pricing information.");
    } else {
        customerData.servicesPricing.forEach((category, catIndex) => {
            if (!category.services || category.services.length === 0) {
                suggestions.push(`Category "${category.category}" should have at least one service.`);
            } else {
                category.services.forEach((service, serviceIndex) => {
                    if (!service.description || service.description.length < 50) {
                        suggestions.push(`Service "${service.name}" needs a more detailed description (at least 50 characters).`);
                    }
                    if (!service.pricing || service.pricing === '$XX') {
                        suggestions.push(`Service "${service.name}" needs actual pricing information.`);
                    }
                });
            }
        });
    }

    // Check FAQ section
    if (!customerData.faqSection || customerData.faqSection.includes('[Enter answer')) {
        suggestions.push("Complete the FAQ section with actual answers to common customer questions.");
    }

    // Check contact info
    if (!customerData.contactInfo || customerData.contactInfo.includes('XXX')) {
        suggestions.push("Update contact information with actual phone number, email, and address.");
    }

    // Check special instructions
    if (!customerData.specialInstructions || customerData.specialInstructions.includes('Enter special')) {
        suggestions.push("Add specific instructions for how the AI should handle your business inquiries.");
    }

    return {
        isValid: suggestions.length === 0,
        suggestions: suggestions
    };
}

/**
 * Export customer data to JSON for easy editing
 */
export function exportCustomerToJSON(customerId, customerData) {
    return JSON.stringify({
        customerId: customerId,
        ...customerData
    }, null, 2);
}

/**
 * Import customer data from JSON
 */
export function importCustomerFromJSON(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        const { customerId, ...customerData } = data;
        return { customerId, customerData };
    } catch (error) {
        throw new Error('Invalid JSON format');
    }
}