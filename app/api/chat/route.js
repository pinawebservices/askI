// app/api/chat/route.js - DEBUG MULTI-SOURCE VERSION
import OpenAI from 'openai';
import { getPrompt } from '@/lib/prompts';
import { getEnhancedCustomerData } from '@/lib/customerDatabase';
import { buildMultiSourcePrompt } from '@/lib/promptBuilder';

const isDevelopment = process.env.NODE_ENV === 'development';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const { messages, businessType = 'default', customDetails = '', customerId } = await request.json();

        console.log('🔍 DEBUG - Multi-Source API received request:', {
            businessType,
            customerId,
            messageCount: messages?.length
        });

        if (!messages || !Array.isArray(messages)) {
            return corsResponse({ error: 'Messages array is required' }, 400);
        }

        // Security check
        const origin = request.headers.get('origin');
        if (origin?.includes('localhost') && !isDevelopment) {
            console.log('Blocked localhost request in production:', { origin });
            return new Response(JSON.stringify({ error: 'Unauthorized access' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Enhanced customer data loading with detailed debugging
        let customerData = null;
        let liveDataStatus = 'none';

        if (customerId) {
            console.log('🔍 DEBUG - Fetching enhanced data for:', customerId);
            console.log('🔍 DEBUG - About to call getEnhancedCustomerData...');

            try {
                // This calls your multi-source customer database
                customerData = await getEnhancedCustomerData(customerId);

                console.log('🔍 DEBUG - getEnhancedCustomerData returned:', {
                    found: !!customerData,
                    businessName: customerData?.businessName,
                    hasLiveData: !!customerData?.liveData,
                    hasGoogleSheets: !!customerData?.googleSheets,
                    spreadsheetId: customerData?.googleSheets?.spreadsheetId
                });

                if (customerData) {
                    console.log('📋 DEBUG - Customer found:', customerData.businessName);

                    if (customerData.liveData) {
                        liveDataStatus = 'multi_source_loaded';
                        console.log('✅ DEBUG - Multi-source data loaded!');
                        console.log('📊 DEBUG - Live data structure:', {
                            hasStructured: !!customerData.liveData.structured,
                            hasDocuments: !!customerData.liveData.documents,
                            hasSummary: !!customerData.liveData.summary,
                            lastUpdated: customerData.liveData.lastUpdated
                        });

                        // Check structured data
                        if (customerData.liveData.structured) {
                            console.log('📊 DEBUG - Structured data:', {
                                services: customerData.liveData.structured.services?.length || 0,
                                schedule: customerData.liveData.structured.schedule?.length || 0,
                                specials: customerData.liveData.structured.specials?.length || 0
                            });

                            // Log actual services if found
                            if (customerData.liveData.structured.services?.length > 0) {
                                console.log('💰 DEBUG - Live services found:');
                                customerData.liveData.structured.services.forEach((service, index) => {
                                    console.log(`   ${index + 1}. ${service.name} - ${service.price} (${service.duration})`);
                                });
                            } else {
                                console.log('⚠️ DEBUG - No services in structured data');
                            }
                        } else {
                            console.log('⚠️ DEBUG - No structured data found');
                        }

                        // Check documents data
                        if (customerData.liveData.documents) {
                            const docCount = Object.keys(customerData.liveData.documents).length;
                            console.log(`📄 DEBUG - Documents found: ${docCount}`);
                            if (docCount > 0) {
                                Object.keys(customerData.liveData.documents).forEach(docName => {
                                    const doc = customerData.liveData.documents[docName];
                                    console.log(`   - ${docName}: ${doc.wordCount} words`);
                                });
                            }
                        } else {
                            console.log('📄 DEBUG - No documents data');
                        }

                        // Check data sources used
                        if (customerData.dataSourcesUsed) {
                            console.log('🔗 DEBUG - Data sources used:', customerData.dataSourcesUsed);
                        }

                    } else if (customerData.googleSheets?.enabled) {
                        liveDataStatus = 'sheets_enabled_but_no_data';
                        console.log('⚠️ DEBUG - Google Sheets enabled but no live data returned');
                        console.log('📊 DEBUG - Google Sheets config:', {
                            enabled: customerData.googleSheets.enabled,
                            spreadsheetId: customerData.googleSheets.spreadsheetId,
                            autoSync: customerData.googleSheets.autoSync
                        });
                    } else {
                        liveDataStatus = 'static_fallback';
                        console.log('📊 DEBUG - Using static fallback data (Google Sheets not enabled)');
                    }
                } else {
                    console.log('❌ DEBUG - No customer data found for ID:', customerId);
                    liveDataStatus = 'customer_not_found';
                }
            } catch (error) {
                console.error('❌ DEBUG - Error in getEnhancedCustomerData:', error);
                console.error('❌ DEBUG - Error stack:', error.stack);
                liveDataStatus = 'error';
            }
        } else {
            console.log('⚠️ DEBUG - No customerId provided');
        }

        // Build enhanced system prompt with multi-source data
        console.log('📝 DEBUG - Building enhanced prompt...');
        console.log('📝 DEBUG - Using buildMultiSourcePrompt with:', {
            businessType,
            hasCustomDetails: !!customDetails,
            hasCustomerData: !!customerData,
            hasLiveData: !!customerData?.liveData
        });

        const systemPrompt = buildEnhancedPrompt(businessType, customDetails, customerData);

        console.log('📝 DEBUG - Enhanced prompt built:');
        console.log(`   - Total length: ${systemPrompt.length} characters`);
        console.log(`   - Live data status: ${liveDataStatus}`);

        // Log a preview of the prompt to see what's included
        const promptPreview = systemPrompt.substring(0, 500) + (systemPrompt.length > 500 ? '...' : '');
        console.log('📝 DEBUG - Prompt preview:', promptPreview);

        // Check if live data is in the prompt
        if (systemPrompt.includes('LIVE BUSINESS DATA')) {
            console.log('✅ DEBUG - Prompt includes live data section');
        } else {
            console.log('⚠️ DEBUG - Prompt does NOT include live data section');
        }

        // Log sample live pricing if available
        if (customerData?.liveData?.structured?.services?.length > 0) {
            const sampleService = customerData.liveData.structured.services[0];
            console.log(`💰 DEBUG - Sample live pricing: ${sampleService.name} - ${sampleService.price}`);
        }

        console.log('🤖 DEBUG - Calling OpenAI...');
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            max_tokens: 300,
            temperature: 0.7,
        });

        const assistantMessage = completion.choices[0].message.content;
        console.log('✅ DEBUG - OpenAI response received:', assistantMessage.length, 'characters');

        return corsResponse({
            message: assistantMessage,
            usage: completion.usage,
            debug: {
                customerFound: !!customerData,
                customerId: customerId,
                liveDataStatus: liveDataStatus,
                hasLiveData: !!customerData?.liveData,
                hasStructuredData: !!customerData?.liveData?.structured,
                hasDocuments: !!customerData?.liveData?.documents,
                liveDataTimestamp: customerData?.liveData?.lastUpdated,
                businessName: customerData?.businessName || 'none',
                servicesCount: customerData?.liveData?.structured?.services?.length || 0,
                documentsCount: customerData?.liveData?.documents ? Object.keys(customerData.liveData.documents).length : 0,
                dataSourcesUsed: customerData?.dataSourcesUsed,
                promptLength: systemPrompt.length
            }
        });

    } catch (error) {
        console.error('❌ DEBUG - Enhanced Chat API Error:', error);
        console.error('❌ DEBUG - Error stack:', error.stack);

        if (error.code === 'insufficient_quota') {
            return corsResponse({
                error: 'OpenAI API quota exceeded. Please check your billing.'
            }, 429);
        }

        return corsResponse({
            error: 'Failed to process chat message',
            details: error.message,
            stack: isDevelopment ? error.stack : undefined,
            debug: {
                errorOccurred: true,
                errorMessage: error.message
            }
        }, 500);
    }
}

// Enhanced prompt building function with multi-source support
function buildEnhancedPrompt(businessType, customDetails, customerData) {
    console.log('📝 DEBUG - buildEnhancedPrompt called with:', {
        businessType,
        hasCustomDetails: !!customDetails,
        hasCustomerData: !!customerData,
        hasLiveData: !!customerData?.liveData
    });

    try {
        // Use the multi-source prompt builder
        const prompt = buildMultiSourcePrompt(businessType, customDetails, customerData);
        console.log('✅ DEBUG - buildMultiSourcePrompt successful, length:', prompt.length);
        return prompt;
    } catch (error) {
        console.error('❌ DEBUG - Error in buildMultiSourcePrompt:', error.message);
        console.log('🔄 DEBUG - Falling back to basic prompt builder');
        // Fallback to basic prompt building
        return getPrompt(businessType, customDetails, customerData);
    }
}

// Handle CORS for embed usage
export async function OPTIONS(request) {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

// Add CORS headers to POST response
function corsResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}