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

        console.log('Request parsed:', { businessType, messageCount: messages?.length, customerId });

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

        if (!messages || !Array.isArray(messages)) {
            return corsResponse({ error: 'Messages array is required' }, 400);
        }

        // ← Add customer data loading
        let customerData = null;
        if (customerId) {
            console.log('🔍 Looking for customer:', customerId);
            customerData = getCustomerData(customerId);
            console.log('📊 Customer data found:', !!customerData);
            if (customerData) {
                console.log('📋 Customer business:', customerData.businessName);
            }
        } else {
            console.log('⚠️ No customerId provided, using fallback');
        }

        // ← Update to use customer data
        const systemPrompt = getPrompt(businessType, customDetails, customerData);
        console.log('📝 Using prompt type:', customerData ? 'custom' : 'fallback');

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
        console.log('✅ OpenAI response received');

        return corsResponse({
            message: assistantMessage,
            usage: completion.usage
        });

    } catch (error) {
        console.error('Chat API Error:', error);

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