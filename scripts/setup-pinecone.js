// scripts/setup-pinecone.js
// Create this file in a 'scripts' folder in your project root

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { MultiSourceClient } from '../lib/multiSourceClient.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

// Check for required environment variables
if (!process.env.PINECONE_API_KEY) {
    console.error('❌ Missing PINECONE_API_KEY in environment variables');
    console.log('Add to your .env or .env.local file:');
    console.log('PINECONE_API_KEY=your-pinecone-api-key-here');
    process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
    console.error('❌ Missing OPENAI_API_KEY in environment variables');
    process.exit(1);
}

class PineconeSetup {
    constructor() {
        this.pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        this.indexName = 'chatbot-knowledge';
        this.CHUNK_SIZE = 800;
        this.CHUNK_OVERLAP = 200;
    }

    async setupIndex() {
        console.log('🚀 Setting up Pinecone index...\n');

        try {
            // Check if index already exists
            const indexes = await this.pinecone.listIndexes();
            const indexExists = indexes.indexes?.some(index => index.name === this.indexName);

            if (!indexExists) {
                console.log(`📝 Creating new index: ${this.indexName}`);

                await this.pinecone.createIndex({
                    name: this.indexName,
                    dimension: 1536, // OpenAI embedding dimension
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud: 'aws',
                            region: 'us-east-1' // Free tier region
                        }
                    }
                });

                console.log('⏳ Waiting for index to be ready (this may take 60 seconds)...');

                // Wait for index to be ready
                let ready = false;
                while (!ready) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    const indexes = await this.pinecone.listIndexes();
                    const index = indexes.indexes?.find(i => i.name === this.indexName);
                    ready = index?.status?.ready;
                    process.stdout.write('.');
                }

                console.log('\n✅ Index created successfully!');
            } else {
                console.log(`✅ Index "${this.indexName}" already exists`);
            }

            // Connect to index
            this.index = this.pinecone.index(this.indexName);
            console.log('✅ Connected to index\n');

        } catch (error) {
            console.error('❌ Error setting up index:', error);
            throw error;
        }
    }

    async processClientDocuments(clientId) {
        console.log(`📚 Processing documents for client: ${clientId}\n`);

        // Get client namespace
        const namespace = this.index.namespace(clientId);

        // Initialize your existing MultiSourceClient
        const multiSource = new MultiSourceClient(clientId);
        const initialized = await multiSource.initialize();

        if (!initialized) {
            console.error(`❌ Failed to initialize MultiSourceClient for ${clientId}`);
            console.log('Make sure you have the correct token file in mcp-server/');
            return;
        }

        // Configuration for fetching documents
        const config = {
            googleSheets: {
                enabled: true,
                spreadsheetId: '1Bkk_a1pU8n53IO89ljee0wzuVYkTMiD2tjsW8EqzcrM' // Your sheet ID
            },
            googleDrive: {
                enabled: true,
                folderId: null,
                fileTypes: ['gdoc', 'txt', 'pdf']
            }
        };

        // Fetch all business data
        console.log('📄 Fetching documents from Google Drive...');
        const businessData = await multiSource.getBusinessData(config);

        // Prepare all chunks
        let allChunks = [];

        // Process documents
        Object.entries(businessData.documents).forEach(([docName, doc]) => {
            console.log(`  Processing: ${docName} (${doc.wordCount} words)`);

            const chunks = this.createChunks(doc.content);
            chunks.forEach((chunk, idx) => {
                allChunks.push({
                    id: `${docName.replace(/[^a-zA-Z0-9]/g, '-')}-${idx}`,
                    text: chunk,
                    metadata: {
                        source: docName,
                        type: 'document',
                        chunkIndex: idx
                    }
                });
            });
        });

        // Process services from sheets
        if (businessData.structured.services && businessData.structured.services.length > 0) {
            console.log(`  Processing: Services (${businessData.structured.services.length} items)`);

            businessData.structured.services.forEach((service, idx) => {
                allChunks.push({
                    id: `service-${idx}`,
                    text: `Service: ${service.name}\nCategory: ${service.category}\nPrice: ${service.price}\nDuration: ${service.duration}\nDescription: ${service.description}`,
                    metadata: {
                        source: 'Google Sheets - Services',
                        type: 'service',
                        serviceName: service.name
                    }
                });
            });
        }

        console.log(`\n📊 Total chunks to process: ${allChunks.length}\n`);

        // Process in batches
        const batchSize = 10;
        let processed = 0;

        for (let i = 0; i < allChunks.length; i += batchSize) {
            const batch = allChunks.slice(i, i + batchSize);

            try {
                // Create embeddings for batch
                console.log(`⚡ Creating embeddings for chunks ${i + 1}-${Math.min(i + batchSize, allChunks.length)}...`);

                const embeddings = await this.openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: batch.map(chunk => chunk.text)
                });

                // Prepare vectors for Pinecone
                const vectors = batch.map((chunk, idx) => ({
                    id: chunk.id,
                    values: embeddings.data[idx].embedding,
                    metadata: {
                        ...chunk.metadata,
                        text: chunk.text.substring(0, 1000) // Store text in metadata (Pinecone limit)
                    }
                }));

                // Upsert to Pinecone
                await namespace.upsert(vectors);
                processed += batch.length;

                console.log(`✅ Processed ${processed}/${allChunks.length} chunks`);

                // Small delay to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                console.error(`❌ Error processing batch:`, error.message);
                if (error.message.includes('rate')) {
                    console.log('⏳ Rate limit hit, waiting 60 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 60000));
                    i -= batchSize; // Retry this batch
                }
            }
        }

        console.log(`\n✅ Successfully processed all ${allChunks.length} chunks for ${clientId}!\n`);
    }

    createChunks(text) {
        const chunks = [];
        const sentences = text.split(/[.!?]+/);
        let currentChunk = '';

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (!trimmedSentence) continue;

            if (currentChunk.length + trimmedSentence.length > this.CHUNK_SIZE) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                }
                // Keep some overlap for context
                const words = currentChunk.split(' ');
                const overlapWords = words.slice(-20).join(' ');
                currentChunk = overlapWords + ' ' + trimmedSentence;
            } else {
                currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    async testSearch(clientId, query) {
        console.log(`\n🔍 Testing search for: "${query}"\n`);

        const namespace = this.index.namespace(clientId);

        // Create embedding for query
        const queryEmbedding = await this.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query
        });

        // Search in Pinecone
        const results = await namespace.query({
            vector: queryEmbedding.data[0].embedding,
            topK: 3,
            includeMetadata: true
        });

        console.log('Top 3 results:');
        results.matches.forEach((match, idx) => {
            console.log(`\n${idx + 1}. Score: ${match.score.toFixed(3)}`);
            console.log(`   Source: ${match.metadata.source}`);
            console.log(`   Text: ${match.metadata.text.substring(0, 150)}...`);
        });
    }
}

// Main execution
async function main() {
    console.log('================================');
    console.log('🚀 Pinecone Setup for AI Chatbot');
    console.log('================================\n');

    const setup = new PineconeSetup();

    try {
        // Step 1: Setup index
        await setup.setupIndex();

        // Step 2: Process documents for your client
        const clientId = 'demo-wellness'; // or 'wellness' depending on your token file
        await setup.processClientDocuments(clientId);

        // Step 3: Test with sample searches
        console.log('================================');
        console.log('🧪 Testing Search Functionality');
        console.log('================================');

        await setup.testSearch(clientId, 'What is the cancellation policy?');
        await setup.testSearch(clientId, 'What services do you offer?');
        await setup.testSearch(clientId, 'What are your business hours?');

        console.log('\n================================');
        console.log('✨ Setup Complete!');
        console.log('================================');
        console.log('\nYour Pinecone vector database is ready!');
        console.log(`Client "${clientId}" documents have been indexed.`);
        console.log('\nNext steps:');
        console.log('1. Update your chat API endpoint to use Pinecone search');
        console.log('2. Test with your chatbot widget');
        console.log('3. Add more clients as needed');

    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        console.error('\nTroubleshooting:');
        console.error('1. Check your PINECONE_API_KEY is correct');
        console.error('2. Check your OPENAI_API_KEY is correct');
        console.error('3. Make sure you have the correct client token file');
        process.exit(1);
    }
}

// Run the setup
main().catch(console.error);