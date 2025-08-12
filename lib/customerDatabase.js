// lib/customerDatabase.js - CLEAN SHEETS-ONLY VERSION
import { GoogleSheetsClient } from './googleSheetsClient.js';

export const customersDatabase = {
    'demo-wellness': {
        businessName: 'Serenity Wellness Center',
        industry: 'wellness',

        // SHEETS-ONLY configuration for now
        dataSources: {
            googleSheets: {
                enabled: true,
                spreadsheetId: '10kk_a1pUBn53IO09ljwwDwzuVYkTMiD2tjsW0EgzezM'  // ⚠️ REPLACE THIS
            },
            googleDrive: {
                enabled: false  // 👈 DISABLED for clean setup
            }
        },

        tier: 'professional',

        // Fallback static data
        servicesPricing: [
            {
                category: 'Massage Therapy',
                services: [
                    { name: 'Swedish Massage', duration: '60 min', price: '$120', description: 'Relaxing full-body massage' },
                    { name: 'Deep Tissue Massage', duration: '60 min', price: '$140', description: 'Therapeutic muscle work' },
                    { name: 'Hot Stone Massage', duration: '90 min', price: '$180', description: 'Heated stones for deep relaxation' }
                ]
            },
            {
                category: 'Wellness Services',
                services: [
                    { name: 'Reiki Healing', duration: '45 min', price: '$90', description: 'Energy healing session' },
                    { name: 'Aromatherapy', duration: '60 min', price: '$110', description: 'Essential oil therapy' },
                    { name: 'Reflexology', duration: '45 min', price: '$85', description: 'Foot pressure point therapy' }
                ]
            }
        ],

        businessInfo: {
            phone: '(555) 123-4567',
            email: 'info@serenitywellness.com',
            address: '123 Wellness Way, Fort Lauderdale, FL 33301',
            hours: {
                monday: '9:00 AM - 7:00 PM',
                tuesday: '9:00 AM - 7:00 PM',
                wednesday: '9:00 AM - 7:00 PM',
                thursday: '9:00 AM - 7:00 PM',
                friday: '9:00 AM - 6:00 PM',
                saturday: '10:00 AM - 5:00 PM',
                sunday: 'Closed'
            }
        },

        policies: {
            cancellation: '24-hour cancellation policy required',
            lateness: 'Arriving more than 15 minutes late may result in shortened session',
            payment: 'We accept cash, credit cards, and HSA/FSA cards'
        }
    }
};

// SIMPLE function - only uses GoogleSheetsClient
export async function getEnhancedCustomerData(customerId) {
    console.log(`🔍 Getting enhanced data for customer: ${customerId}`);

    const baseConfig = customersDatabase[customerId];
    if (!baseConfig) {
        console.log(`❌ Customer ${customerId} not found`);
        return null;
    }

    // Check if Google Sheets is enabled
    if (!baseConfig.dataSources?.googleSheets?.enabled) {
        console.log(`📋 Using static data for ${customerId} (no live sources)`);
        return baseConfig;
    }

    // Use GoogleSheetsClient only
    try {
        console.log(`📊 Using GoogleSheetsClient for ${customerId} (Sheets only)`);

        const client = new GoogleSheetsClient(customerId);
        const initialized = await client.initialize();

        if (!initialized) {
            throw new Error('Failed to initialize GoogleSheetsClient');
        }

        const spreadsheetId = baseConfig.dataSources.googleSheets.spreadsheetId;

        // Test connection first
        const connectionTest = await client.testConnection(spreadsheetId);
        if (!connectionTest) {
            throw new Error('Google Sheets connection test failed');
        }

        // Fetch live sheets data
        const [liveServices, liveSchedule, liveSpecials] = await Promise.all([
            client.getLiveServices(spreadsheetId),
            client.getLiveSchedule(spreadsheetId),
            client.getLiveSpecials(spreadsheetId)
        ]);

        return {
            ...baseConfig,
            liveData: {
                services: liveServices,
                schedule: liveSchedule,
                specials: liveSpecials,
                lastUpdated: new Date().toISOString(),
                source: 'google_sheets_only'
            },
            dataSourcesUsed: {
                type: 'sheets-only',
                sheets: true,
                documents: false,
                summary: {
                    totalServices: liveServices.length,
                    totalDocuments: 0,
                    totalWords: 0
                }
            }
        };

    } catch (error) {
        console.error(`❌ Error fetching data for ${customerId}:`, error.message);
        console.log(`📋 Falling back to static data`);
        return baseConfig;
    }
}

// Utility functions
export function getCustomerTier(customerId) {
    return customersDatabase[customerId]?.tier || 'basic';
}

export function hasDocumentIntegration(customerId) {
    return false; // Disabled for now
}

export function hasSheetsIntegration(customerId) {
    return customersDatabase[customerId]?.dataSources?.googleSheets?.enabled || false;
}

export function getCustomerData(customerId) {
    return customersDatabase[customerId] || null;
}