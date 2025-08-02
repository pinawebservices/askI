// app/api/chat/route.js
import OpenAI from 'openai';
import { getPrompt } from '@/lib/prompts';
import { getCustomerData } from '@/lib/customerDatabase'; // ← Add this import

const isDevelopment = process.env.NODE_ENV === 'development';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    try {
        // ← Add customerId to the destructuring
        const { messages, businessType = 'default', customDetails = '', customerId } = await request.json();

        console.log('🔍 DEBUG - Received request:', { businessType, customerId, messageCount: messages?.length });

        if (!messages || !Array.isArray(messages)) {
            return corsResponse({ error: 'Messages array is required' }, 400);
        }

        // In your API route, add this check:
        const origin = request.headers.get('origin');

        if (origin?.includes('localhost') && !isDevelopment) {
            // Only block localhost in production
            console.log('Blocked localhost request in production:', { origin, referer });
            return new Response(JSON.stringify({ error: 'Unauthorized access' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        // Enhanced customer data loading with debugging
        let customerData = null;
        if (customerId) {
            console.log('🔍 DEBUG - Looking for customer:', customerId);
            customerData = getCustomerData(customerId);
            console.log('📊 DEBUG - Customer data found:', !!customerData);

            if (customerData) {
                console.log('📋 DEBUG - Customer business:', customerData.businessName);
                console.log('🏷️ DEBUG - Services count:', customerData.servicesPricing?.length || 0);

                // Log the actual services data
                if (customerData.servicesPricing) {
                    customerData.servicesPricing.forEach((category, index) => {
                        console.log(`📦 DEBUG - Category ${index}:`, category.category);
                        console.log(`🔧 DEBUG - Services in category:`, category.services?.length || 0);
                    });
                }
            } else {
                console.log('❌ DEBUG - No customer data found for ID:', customerId);
            }
        } else {
            console.log('⚠️ DEBUG - No customerId provided');
        }

        // Get the prompt and log it
        const systemPrompt = getPrompt(businessType, customDetails, customerData);
        console.log('📝 DEBUG - Prompt length:', systemPrompt.length);
        console.log('📝 DEBUG - Prompt preview (first 500 chars):', systemPrompt.substring(0, 500));

        // Find and log the services section specifically
        const servicesStart = systemPrompt.indexOf('DETAILED SERVICES & PRICING:');
        const servicesEnd = systemPrompt.indexOf('HOURS OF OPERATION:');

        if (servicesStart > -1 && servicesEnd > -1) {
            const servicesSection = systemPrompt.substring(servicesStart, servicesEnd);
            console.log('🎯 DEBUG - Services section found, length:', servicesSection.length);
            console.log('🎯 DEBUG - Services section preview:', servicesSection.substring(0, 500));
        } else {
            console.log('❌ DEBUG - Could not find services section in prompt');
        }

        // Log if services are properly formatted in the prompt
        if (systemPrompt.includes('=== BODYWORK SESSIONS ===') ||
            systemPrompt.includes('Customized Bodywork') ||
            systemPrompt.includes('SERVICE 1:')) {
            console.log('✅ DEBUG - Services properly included in prompt');
        } else {
            console.log('❌ DEBUG - Services NOT found in prompt');
            // Log a section of the prompt to see what's actually there
            const servicesSection = systemPrompt.indexOf('DETAILED SERVICES');
            if (servicesSection > -1) {
                console.log('📝 DEBUG - Services section preview:',
                    systemPrompt.substring(servicesSection, servicesSection + 800));
            }
        }


        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            max_tokens: 300, // ← Increased for more detailed customer responses
            temperature: 0.7,
        });

        const assistantMessage = completion.choices[0].message.content;
        console.log('✅ DEBUG - OpenAI response received, length:', assistantMessage.length);

        return corsResponse({
            message: assistantMessage,
            usage: completion.usage,
            // debug info
            debug: {
                customerFound: !!customerData,
                customerId: customerId,
                servicesCount: customerData?.servicesPricing?.length || 0,
                promptLength: systemPrompt.length,
                businessType: businessType,
                hasCustomerData: !!customerData,
                customerBusinessName: customerData?.businessName || 'none'
            }
        });

    } catch (error) {
        console.error('❌ Chat API Error:', error);

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