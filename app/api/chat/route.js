// app/api/chat/route.js (or wherever your chat endpoint is)
// This connects your widget to Pinecone

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

// Initialize clients (do this once)
let pinecone;
let openai;
let index;

async function initializeClients() {
    if (!pinecone) {
        pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });
        index = pinecone.index('chatbot-knowledge');
    }

    if (!openai) {
        openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    return { pinecone, openai, index };
}

export async function POST(request) {
    try {
        const { messages, clientId = 'demo-wellness' } = await request.json();

        // Initialize clients
        const { index, openai } = await initializeClients();

        // Get the user's question (last message)
        const userQuestion = messages[messages.length - 1].content;
        console.log(`📝 Question from ${clientId}: ${userQuestion}`);

        // Get the namespace for this client
        const namespace = index.namespace(clientId);

        // Create embedding for the question
        console.log('🔍 Creating embedding for question...');
        const questionEmbedding = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: userQuestion
        });

        // Search Pinecone for relevant chunks
        console.log('🔎 Searching for relevant information...');
        const searchResults = await namespace.query({
            vector: questionEmbedding.data[0].embedding,
            topK: 5, // Get top 5 most relevant chunks
            includeMetadata: true
        });

        // Extract the text from results
        const relevantContext = searchResults.matches
            .map(match => match.metadata.text)
            .join('\n\n---\n\n');

        console.log(`✅ Found ${searchResults.matches.length} relevant chunks`);
        console.log(`📊 Context size: ${relevantContext.length} characters (was 750K before!)`);

        // Create the system prompt with ONLY relevant context
        const systemPrompt = `You are a helpful and professional customer service assistant for Serenity Wellness Center.

Here is relevant information to answer the user's question:

${relevantContext}

Instructions:
- Answer based ONLY on the information provided above
- Be friendly, professional, and helpful
- If the information doesn't contain the answer, politely say you don't have that information
- Keep responses concise and clear`;

        // Get response from OpenAI with the relevant context
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        // Return the response
        return Response.json({
            message: completion.choices[0].message.content,
            debug: {
                chunksUsed: searchResults.matches.length,
                topScore: searchResults.matches[0]?.score || 0,
                contextSize: relevantContext.length
            }
        });

    } catch (error) {
        console.error('❌ Chat API error:', error);
        return Response.json(
            { error: 'Failed to process chat request', details: error.message },
            { status: 500 }
        );
    }
}

// Optional: Add a test endpoint
export async function GET(request) {
    return Response.json({
        status: 'Chat API with Pinecone is running',
        instructions: 'Send POST request with { messages: [...], clientId: "demo-wellness" }'
    });
}