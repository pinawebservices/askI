// test-widget-with-pinecone.js
// Quick test to verify everything works before using the widget

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

async function testChatWithPinecone() {
    console.log('🧪 Testing Chat with Pinecone Integration');
    console.log('=========================================\n');

    // Initialize clients
    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    });

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const index = pinecone.index('chatbot-knowledge');
    const namespace = index.namespace('demo-wellness');

    // Test questions
    const testQuestions = [
        "What is your cancellation policy?",
        "What's your address?",
        "What services do you offer?",
        "How much does a massage cost?",
        "What are your business hours?"
    ];

    for (const question of testQuestions) {
        console.log(`\n❓ Question: "${question}"`);

        try {
            // Create embedding for question
            const embedding = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: question
            });

            // Search Pinecone
            const results = await namespace.query({
                vector: embedding.data[0].embedding,
                topK: 3,
                includeMetadata: true
            });

            // Build context
            const context = results.matches
                .map(m => m.metadata.text)
                .join('\n\n');

            console.log(`📊 Found ${results.matches.length} relevant chunks`);
            console.log(`📏 Context size: ${context.length} characters`);

            // Get answer from GPT
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant for Serenity Wellness Center. Answer based on this context:\n\n${context}`
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                temperature: 0.7,
                max_tokens: 200
            });

            console.log(`✅ Answer: ${completion.choices[0].message.content}`);
            console.log('-'.repeat(50));

        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        }

        // Small delay between questions
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log('\n✨ Test complete!');
    console.log('Your chatbot can now answer questions using Pinecone!');
}

// Run the test
testChatWithPinecone().catch(console.error);