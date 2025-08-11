// lib/customerDatabase.js - UPDATED with smart client selection
import { GoogleSheetsClient } from './googleSheetsClient.js';
import { MultiSourceClient } from './multiSourceClient.js';

export const customersDatabase = {
    'demo-wellness': {
        businessName: 'Serenity Wellness Center',
        industry: 'wellness',

        // Data source configuration determines which client to use
        dataSources: {
            googleSheets: {
                enabled: true,
                spreadsheetId: 'PUT_YOUR_SPREADSHEET_ID_HERE'
            },
            googleDrive: {
                enabled: true,        // This triggers MultiSourceClient
                folderId: null,
                fileTypes: ['pdf', 'gdoc', 'txt']
            }
        },

        // Service tier affects feature access
        tier: 'professional', // basic, professional, enterprise

        // Fallback data...
        servicesPricing: [/*...*/]
    },

    'demo-basic': {
        businessName: 'Simple Auto Shop',
        industry: 'auto_repair',

        dataSources: {
            googleSheets: {
                enabled: true,
                spreadsheetId: 'ANOTHER_SPREADSHEET_ID'
            },
            googleDrive: {
                enabled: false       // This uses GoogleSheetsClient only
            }
        },

        tier: 'basic',
        servicesPricing: [/*...*/]
    }
};

// Smart function that chooses the right client
export async function getEnhancedCustomerData(customerId) {
    console.log(`🔍 Getting enhanced data for customer: ${customerId}`);

    const baseConfig = customersDatabase[customerId];
    if (!baseConfig) {
        console.log(`❌ Customer ${customerId} not found`);
        return null;
    }

    // Determine which client to use based on configuration
    const needsMultiSource = baseConfig.dataSources?.googleDrive?.enabled;
    const hasSheetsOnly = baseConfig.dataSources?.googleSheets?.enabled && !needsMultiSource;

    try {
        if (needsMultiSource) {
            // Use MultiSourceClient for customers with document integration
            console.log(`🔄 Using MultiSourceClient for ${customerId} (Sheets + Documents)`);
            return await getMultiSourceData(customerId, baseConfig);

        } else if (hasSheetsOnly) {
            // Use simple GoogleSheetsClient for sheets-only customers
            console.log(`📊 Using GoogleSheetsClient for ${customerId} (Sheets only)`);
            return await getSheetsOnlyData(customerId, baseConfig);

        } else {
            // No live data sources enabled
            console.log(`📋 Using static data for ${customerId} (no live sources)`);
            return baseConfig;
        }

    } catch (error) {
        console.error(`❌ Error fetching data for ${customerId}:`, error.message);
        console.log(`📋 Falling back to static data`);
        return baseConfig;
    }
}

// Multi-source data fetching (Sheets + Documents)
async function getMultiSourceData(customerId, baseConfig) {
    const client = new MultiSourceClient(customerId);
    const initialized = await client.initialize();

    if (!initialized) {
        throw new Error('Failed to initialize MultiSourceClient');
    }

    const businessData = await client.getBusinessData(baseConfig.dataSources);

    return {
        ...baseConfig,
        liveData: businessData,
        dataSourcesUsed: {
            type: 'multi-source',
            sheets: businessData.structured.services?.length > 0,
            documents: Object.keys(businessData.documents).length > 0,
            summary: businessData.summary
        }
    };
}

// Sheets-only data fetching (Simple, fast)
async function getSheetsOnlyData(customerId, baseConfig) {
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
}

// Utility functions
export function getCustomerTier(customerId) {
    return customersDatabase[customerId]?.tier || 'basic';
}

export function hasDocumentIntegration(customerId) {
    return customersDatabase[customerId]?.dataSources?.googleDrive?.enabled || false;
}

export function hasSheetsIntegration(customerId) {
    return customersDatabase[customerId]?.dataSources?.googleSheets?.enabled || false;
}

// Legacy compatibility
export function getCustomerData(customerId) {
    return customersDatabase[customerId] || null;
}