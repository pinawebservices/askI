// test-chatbot-integration.js
// Flexible test that works with both .env and .env.local

import { MultiSourceClient } from './lib/multiSourceClient.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Try to load .env.local first, then .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
    console.log('📁 Loading environment from .env.local');
    dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
    console.log('📁 Loading environment from .env');
    dotenv.config({ path: envPath });
} else {
    console.log('⚠️ No .env or .env.local file found');
    console.log('Create one with: echo "OPENAI_API_KEY=your-key" > .env');
}

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    console.log('\nPlease set it using one of these methods:');
    console.log('1. Create .env file: echo "OPENAI_API_KEY=sk-..." > .env');
    console.log('2. Or copy from .env.local: cp .env.local .env');
    console.log('3. Or set temporarily: export OPENAI_API_KEY=sk-...');
    process.exit(1);
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testChatbotWithRealData() {
    console.log('🧪 Testing Chatbot with Multi-Source Data');
    console.log('=========================================\n');

    // Initialize multi-source client
    const client = new MultiSourceClient('demo-wellness');
    await client.initialize();

    // Your configuration
    const config = {
        googleSheets: {
            enabled: true,
            spreadsheetId: '1Bkk_a1pU8n53IO89ljee0wzuVYkTMiD2tjsW8EqzcrM'
        },
        googleDrive: {
            enabled: true,
            folderId: null,
            fileTypes: ['gdoc', 'txt', 'pdf']
        }
    };

    // Get all business data
    console.log('📊 Fetching business data from Google...\n');
    const businessData = await client.getBusinessData(config);

    // Build context from documents
    let documentContent = '';
    Object.entries(businessData.documents).forEach(([name, doc]) => {
        console.log(`📄 Including document: ${name} (${doc.wordCount} words)`);
        documentContent += `\n${doc.content}\n`;
    });

    // Build context from sheets
    let servicesContent = '';
    if (businessData.structured.services?.length > 0) {
        servicesContent = '\n\nCURRENT SERVICES AND PRICING:\n';
        businessData.structured.services.forEach(service => {
            servicesContent += `- ${service.name}: ${service.price} (${service.duration})\n`;
        });
    }

    // Create system prompt with ALL the data
    const systemPrompt = `You are a helpful customer service assistant for Serenity Wellness Center.
    
BUSINESS INFORMATION AND POLICIES:
${documentContent}

${servicesContent}

Important: Answer questions based ONLY on the information provided above. Be specific and quote policies when relevant.`;

    // Test questions that should work with your Google Docs content
    const testQuestions = [
        "What is your cancellation policy?",
        "What is your address?",
        "What are your business hours?",
        "How much does a deep tissue massage cost?",
        "What services do you offer?"
    ];

    console.log('\n📝 Testing Questions with AI:\n');
    console.log('=' .repeat(50));

    for (const question of testQuestions) {
        console.log(`\n❓ Question: "${question}"`);

        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ],
                temperature: 0.3,
                max_tokens: 200
            });

            console.log(`\n✅ Answer: ${completion.choices[0].message.content}`);
            console.log('-'.repeat(50));
        } catch (error) {
            console.error(`❌ Error: ${error.message}\n`);
            if (error.message.includes('API key')) {
                console.log('Check that your API key is valid and has credits.');
            }
        }
    }

    console.log('\n✨ Test complete!');
    console.log('\n📋 Summary:');
    console.log(`   - Documents loaded: ${businessData.summary.totalDocuments}`);
    console.log(`   - Total content: ${businessData.summary.totalWords} words`);
    console.log(`   - Services loaded: ${businessData.summary.totalServices}`);
    console.log('\n🚀 Your chatbot can now answer from both Google Sheets AND Docs!');
}

// Run the test
testChatbotWithRealData().catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
});