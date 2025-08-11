// app/api/chat/route.js - ENHANCED VERSION with Google Sheets Integration
import OpenAI from 'openai';
import { getPrompt } from '@/lib/prompts';
import { getEnhancedCustomerData } from '@/lib/customerDatabase'; // Updated import


const isDevelopment = process.env.NODE_ENV === 'development';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        const { messages, businessType = 'default', customDetails = '', customerId } = await request.json();

        console.log('🔍 DEBUG - Enhanced API received request:', {
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
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        // Enhanced customer data loading with live Google Sheets
        let customerData = null;
        let liveDataStatus = 'none';

        if (customerId) {
            console.log('🔍 Fetching enhanced data for:', customerId);

            // This now fetches live Google Sheets data!
            customerData = await getEnhancedCustomerData(customerId);

            if (customerData) {
                console.log('📋 Customer found:', customerData.businessName);

                if (customerData.liveData) {
                    liveDataStatus = 'live_sheets';
                    console.log('✅ Live Google Sheets data loaded!');
                    console.log(`📊 Live services: ${customerData.liveData.services.length}`);
                    console.log(`📅 Live schedule: ${customerData.liveData.schedule.length}`);
                    console.log(`🎉 Live specials: ${customerData.liveData.specials.length}`);
                    console.log(`🕒 Last updated: ${customerData.liveData.lastUpdated}`);
                } else {
                    liveDataStatus = 'static_fallback';
                    console.log('📊 Using static fallback data (Google Sheets not available)');
                }
            } else {
                console.log('❌ No customer data found for ID:', customerId);
            }
        } else {
            console.log('⚠️ No customerId provided');
        }

        // Build enhanced system prompt with live data
        const systemPrompt = buildEnhancedPrompt(businessType, customDetails, customerData);

        console.log('📝 Enhanced prompt length:', systemPrompt.length);
        console.log('📝 Live data status:', liveDataStatus);

        // Log if we have live pricing data
        if (customerData?.liveData?.services) {
            const sampleService = customerData.liveData.services[0];
            if (sampleService) {
                console.log(`💰 Sample live pricing: ${sampleService.name} - ${sampleService.price}`);
            }
        }

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
        console.log('✅ OpenAI response with live data:', assistantMessage.length, 'characters');

        return corsResponse({
            message: assistantMessage,
            usage: completion.usage,
            debug: {
                customerFound: !!customerData,
                customerId: customerId,
                liveDataStatus: liveDataStatus,
                hasLiveData: !!customerData?.liveData,
                liveDataTimestamp: customerData?.liveData?.lastUpdated,
                businessName: customerData?.businessName || 'none',
                servicesCount: customerData?.liveData?.services?.length || 0
            }
        });

    } catch (error) {
        console.error('❌ Enhanced Chat API Error:', error);

        if (error.code === 'insufficient_quota') {
            return corsResponse({
                error: 'OpenAI API quota exceeded. Please check your billing.'
            }, 429);
        }

        return corsResponse({
            error: 'Failed to process chat message',
            details: error.message
        }, 500);
    }
}

import { buildMultiSourcePrompt } from '@/lib/promptBuilder';

// Enhanced prompt building function with multi-source support
function buildEnhancedPrompt(businessType, customDetails, customerData) {
    // Use the new multi-source prompt builder
    return buildMultiSourcePrompt(businessType, customDetails, customerData);
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