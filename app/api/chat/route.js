// app/api/chat/route.js - Enhanced with Supabase
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
    try {
        const { messages, clientId = 'demo-wellness' } = await request.json();
        const userMessage = messages[messages.length - 1].content;

        // 1. Get client instructions from Supabase
        const { data: instructions, error: instructionsError } = await supabaseAdmin
            .from('client_instructions')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (instructionsError) {
            console.log('No custom instructions found, using defaults');
        }

        // 2. Initialize Pinecone and OpenAI
        const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // 3. Search Pinecone for relevant content
        const embedding = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: userMessage
        });

        const searchResults = await namespace.query({
            vector: embedding.data[0].embedding,
            topK: 5,
            includeMetadata: true
        });

        const relevantContext = searchResults.matches
            .map(match => match.metadata.text)
            .join('\n\n');

        // 4. Build enhanced prompt with instructions
        const systemPrompt = `You are a customer service assistant for ${instructions?.business_name || 'the business'}.

RELEVANT INFORMATION:
${relevantContext}

${instructions?.special_instructions ? `SPECIAL INSTRUCTIONS:
${instructions.special_instructions}` : ''}

${instructions?.tone_style ? `TONE: Be ${instructions.tone_style} and professional.` : ''}

${instructions?.formatting_rules ? `FORMATTING:
${instructions.formatting_rules}` : ''}

${instructions?.lead_capture_process ? `FOR BOOKINGS:
${instructions.lead_capture_process}` : ''}

Answer based on the information provided. Be helpful and professional.`;

        // 5. Generate response
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 400
        });

        // 6. Log conversation to Supabase for analytics
        await supabaseAdmin.from('chat_conversations').insert({
            client_id: clientId,
            conversation_id: `conv_${Date.now()}`,
            user_message: userMessage,
            bot_response: completion.choices[0].message.content,
            chunks_used: searchResults.matches.length,
            tokens_used: completion.usage?.total_tokens || 0
        });

        return Response.json({
            message: completion.choices[0].message.content,
            debug: {
                hasCustomInstructions: !!instructions,
                chunksUsed: searchResults.matches.length
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        return Response.json({ error: 'Failed to process' }, { status: 500 });
    }
}
