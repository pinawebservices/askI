// Simplified Pinecone Implementation for Your SaaS
// Much easier than Supabase, perfect for your use case

// ============================================
// Installation
// ============================================
// npm install @pinecone-database/pinecone openai

// ============================================
// lib/pineconeVectorStore.js
// ============================================

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { MultiSourceClient } from './multiSourceClient.js';
import crypto from 'crypto';

export class PineconeVectorStore {
    constructor() {
        // Initialize Pinecone - SUPER SIMPLE!
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

    /**
     * Initialize index (run once)
     */
    async initializeIndex() {
        const indexes = await this.pinecone.listIndexes();

        if (!indexes.indexes?.find(i => i.name === this.indexName)) {
            // Create index with correct dimensions for OpenAI embeddings
            await this.pinecone.createIndex({
                name: this.indexName,
                dimension: 1536, // OpenAI embedding size
                metric: 'cosine',
                spec: {
                    serverless: {
                        cloud: 'aws',
                        region: 'us-west-2' // Choose closest region
                    }
                }
            });

            console.log('✅ Created Pinecone index');

            // Wait for index to be ready
            await new Promise(r => setTimeout(r, 60000));
        }

        this.index = this.pinecone.index(this.indexName);
        console.log('✅ Pinecone ready');
    }

    /**
     * Process documents for a client
     * Each client gets their own namespace - BRILLIANT for isolation!
     */
    async processClientDocuments(clientId) {
        console.log(`📚 Processing documents for ${clientId}`);

        // Get the namespace for this client (automatic isolation!)
        const namespace = this.index.namespace(clientId);

        // Get documents from Google Drive
        const multiSource = new MultiSourceClient(clientId);
        await multiSource.initialize();

        const config = {
            googleSheets: {
                enabled: true,
                spreadsheetId: process.env[`CLIENT_${clientId.toUpperCase().replace('-', '_')}_SHEET_ID`]
                    || '1Bkk_a1pU8n53IO89ljee0wzuVYkTMiD2tjsW8EqzcrM'
            },
            googleDrive: {
                enabled: true,
                folderId: null,
                fileTypes: ['gdoc', 'txt', 'pdf']
            }
        };

        const businessData = await multiSource.getBusinessData(config);

        // Process all documents
        let allChunks = [];

        // Process documents
        Object.entries(businessData.documents).forEach(([docName, doc]) => {
            const chunks = this.createChunks(doc.content);
            chunks.forEach((chunk, idx) => {
                allChunks.push({
                    id: `${docName}-${idx}`,
                    text: chunk,
                    metadata: {
                        source: docName,
                        type: 'document',
                        chunkIndex: idx
                    }
                });
            });
        });

        // Process services as searchable content
        if (businessData.structured.services) {
            businessData.structured.services.forEach((service, idx) => {
                allChunks.push({
                    id: `service-${idx}`,
                    text: `Service: ${service.name}\nPrice: ${service.price}\nDuration: ${service.duration}\nDescription: ${service.description}`,
                    metadata: {
                        source: 'Services',
                        type: 'service',
                        serviceName: service.name,
                        price: service.price
                    }
                });
            });
        }

        // Process in batches
        console.log(`📊 Processing ${allChunks.length} chunks...`);
        const batchSize = 10;

        for (let i = 0; i < allChunks.length; i += batchSize) {
            const batch = allChunks.slice(i, i + batchSize);

            // Create embeddings
            const embeddings = await this.createEmbeddings(
                batch.map(c => c.text)
            );

            // Prepare vectors for Pinecone
            const vectors = batch.map((chunk, idx) => ({
                id: chunk.id,
                values: embeddings[idx],
                metadata: {
                    ...chunk.metadata,
                    text: chunk.text // Store text in metadata for retrieval
                }
            }));

            // Upsert to Pinecone (upsert = insert or update)
            await namespace.upsert(vectors);

            // Small delay for rate limits
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log(`✅ Processed ${allChunks.length} chunks for ${clientId}`);
        return allChunks.length;
    }

    /**
     * Search for relevant content
     */
    async search(clientId, query, topK = 5) {
        // Get client's namespace
        const namespace = this.index.namespace(clientId);

        // Create embedding for query
        const [queryEmbedding] = await this.createEmbeddings([query]);

        // Search in Pinecone
        const results = await namespace.query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true
        });

        // Extract text from metadata
        return results.matches.map(match => ({
            text: match.metadata.text,
            score: match.score,
            source: match.metadata.source,
            type: match.metadata.type
        }));
    }

    /**
     * Delete all data for a client (useful for updates)
     */
    async clearClientData(clientId) {
        const namespace = this.index.namespace(clientId);
        await namespace.deleteAll();
        console.log(`🗑️ Cleared all data for ${clientId}`);
    }

    /**
     * Create chunks from text
     */
    createChunks(text) {
        const chunks = [];
        const sentences = text.split(/[.!?]+/);
        let currentChunk = '';

        for (const sentence of sentences) {
            if (currentChunk.length + sentence.length > this.CHUNK_SIZE) {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                }
                // Keep some overlap
                const words = currentChunk.split(' ');
                currentChunk = words.slice(-20).join(' ') + ' ' + sentence;
            } else {
                currentChunk += sentence + '. ';
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }

    /**
     * Create embeddings using OpenAI
     */
    async createEmbeddings(texts) {
        const response = await this.openai.embeddings.create({
            model: 'text-embedding-3-small', // Cheaper, good quality
            input: texts
        });

        return response.data.map(item => item.embedding);
    }
}

// ============================================
// app/api/chat/route.js - Your Chat Endpoint
// ============================================

import { PineconeVectorStore } from '@/lib/pineconeVectorStore';
import OpenAI from 'openai';

// Initialize once and reuse
let vectorStore;
let openai;

async function getInstances() {
    if (!vectorStore) {
        vectorStore = new PineconeVectorStore();
        await vectorStore.initializeIndex();
    }
    if (!openai) {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return { vectorStore, openai };
}

export async function POST(request) {
    try {
        const { messages, clientId } = await request.json();
        const { vectorStore, openai } = await getInstances();

        // Get user's question
        const userQuery = messages[messages.length - 1].content;

        // Search for relevant chunks (ONLY 5 chunks, not 750K tokens!)
        const relevantChunks = await vectorStore.search(
            clientId,
            userQuery,
            5
        );

        // Build context from relevant chunks only
        const context = relevantChunks
            .map(chunk => chunk.text)
            .join('\n\n---\n\n');

        console.log(`📊 Using ${relevantChunks.length} chunks (~${Math.ceil(context.length/4)} tokens)`);

        // Create system prompt with minimal context
        const systemPrompt = `You are a helpful assistant for a wellness business.
        
Based on the following information, answer the user's question:

${context}

Be concise and helpful. Only use information provided above.`;

        // Generate response - NO MORE TOKEN LIMITS!
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        return Response.json({
            message: completion.choices[0].message.content,
            debug: {
                chunksUsed: relevantChunks.length,
                topScore: relevantChunks[0]?.score || 0
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        return Response.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}

// ============================================
// scripts/setup-pinecone.js - One-time Setup
// ============================================

import { PineconeVectorStore } from '../lib/pineconeVectorStore.js';
import dotenv from 'dotenv';

dotenv.config();

async function setupPinecone() {
    console.log('🚀 Setting up Pinecone for your chatbot');

    const vectorStore = new PineconeVectorStore();

    // Initialize index
    await vectorStore.initializeIndex();

    // Process documents for your first client
    const testClientId = 'demo-wellness';
    await vectorStore.processClientDocuments(testClientId);

    // Test search
    console.log('\n🧪 Testing search...');
    const results = await vectorStore.search(
        testClientId,
        'What is the cancellation policy?',
        3
    );

    console.log('Search results:');
    results.forEach((r, i) => {
        console.log(`${i + 1}. [${r.score.toFixed(2)}] ${r.text.substring(0, 100)}...`);
    });

    console.log('\n✅ Pinecone setup complete!');
}

setupPinecone().catch(console.error);

// ============================================
// Simple Admin API to Add New Clients
// ============================================

// app/api/admin/add-client/route.js

export async function POST(request) {
    const { clientId, spreadsheetId } = await request.json();

    // Save to your database
    // Then process their documents
    const vectorStore = new PineconeVectorStore();
    await vectorStore.initializeIndex();

    // Clear any old data
    await vectorStore.clearClientData(clientId);

    // Process new documents
    const chunks = await vectorStore.processClientDocuments(clientId);

    return Response.json({
        success: true,
        message: `Added ${clientId} with ${chunks} chunks`
    });
}