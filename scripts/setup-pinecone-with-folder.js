// scripts/setup-pinecone-with-folder.js
// Updated version that only processes files from specific folders

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { MultiSourceClient } from '../lib/multiSourceClient.js';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
const envPath = fs.existsSync('.env.local') ? '.env.local' : '.env';
dotenv.config({ path: envPath });

class PineconeSetupWithFolder {
    constructor() {
        this.pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY
        });

        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        this.indexName = 'chatbot-knowledge';
        this.CHUNK_SIZE = 800;
    }

    /**
     * Get the folder ID from folder path
     */
    async getFolderId(clientId) {
        console.log(`🔍 Finding folder for ${clientId}...`);

        // Initialize Google Drive
        const multiSource = new MultiSourceClient(clientId);
        await multiSource.initialize();

        const drive = google.drive({ version: 'v3', auth: multiSource.auth });

        // Search for the folder
        const folderPath = `AskI Bot Clients/${clientId}`;
        console.log(`📁 Looking for folder: ${folderPath}`);

        try {
            // First, find "AskI Bot Clients" folder
            const parentResponse = await drive.files.list({
                q: "name='AskI Bot Clients' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                fields: 'files(id, name)',
                pageSize: 1
            });

            if (!parentResponse.data.files || parentResponse.data.files.length === 0) {
                console.error('❌ "AskI Bot Clients" folder not found');
                return null;
            }

            const parentFolderId = parentResponse.data.files[0].id;
            console.log(`✅ Found parent folder: ${parentFolderId}`);

            // Now find the client folder inside it
            const clientFolderResponse = await drive.files.list({
                q: `name='${clientId}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
                fields: 'files(id, name)',
                pageSize: 1
            });

            if (!clientFolderResponse.data.files || clientFolderResponse.data.files.length === 0) {
                console.error(`❌ Client folder "${clientId}" not found in "AskI Bot Clients"`);
                return null;
            }

            const clientFolderId = clientFolderResponse.data.files[0].id;
            console.log(`✅ Found client folder: ${clientFolderId}`);

            return clientFolderId;

        } catch (error) {
            console.error('❌ Error finding folder:', error.message);
            return null;
        }
    }

    async clearClientData(clientId) {
        console.log(`🗑️ Clearing existing data for ${clientId}...`);

        try {
            const index = this.pinecone.index(this.indexName);
            const namespace = index.namespace(clientId);

            // Delete all vectors in this namespace
            await namespace.deleteAll();
            console.log(`✅ Cleared all existing data for ${clientId}`);
        } catch (error) {
            console.log(`ℹ️ No existing data to clear for ${clientId}`);
        }
    }

    async setupIndex() {
        console.log('🚀 Setting up Pinecone index...\n');

        try {
            const indexes = await this.pinecone.listIndexes();
            const indexExists = indexes.indexes?.some(index => index.name === this.indexName);

            if (!indexExists) {
                console.log(`📝 Creating new index: ${this.indexName}`);

                await this.pinecone.createIndex({
                    name: this.indexName,
                    dimension: 1536,
                    metric: 'cosine',
                    spec: {
                        serverless: {
                            cloud: 'aws',
                            region: 'us-east-1' // Free tier region
                        }
                    }
                });

                console.log('⏳ Waiting for index to be ready...');

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

            this.index = this.pinecone.index(this.indexName);
            console.log('✅ Connected to index\n');

        } catch (error) {
            console.error('❌ Error setting up index:', error);
            throw error;
        }
    }

    async processClientDocuments(clientId) {
        console.log(`📚 Processing documents for client: ${clientId}\n`);

        // Clear existing data first
        await this.clearClientData(clientId);

        // Get the specific folder ID
        const folderId = await this.getFolderId(clientId);

        if (!folderId) {
            console.error(`❌ Could not find folder for ${clientId}`);
            console.log(`Please create folder: /AskI Bot Clients/${clientId}`);
            return;
        }

        // Get client namespace
        const namespace = this.index.namespace(clientId);

        // Initialize MultiSourceClient with folder restriction
        const multiSource = new MultiSourceClient(clientId);
        await multiSource.initialize();

        // Configuration with SPECIFIC FOLDER
        const config = {
            googleSheets: {
                enabled: true,
                spreadsheetId: '1Bkk_a1pU8n53IO89ljee0wzuVYkTMiD2tjsW8EqzcrM' // Your sheet ID
            },
            googleDrive: {
                enabled: true,
                folderId: folderId, // RESTRICT TO THIS FOLDER ONLY
                fileTypes: ['gdoc', 'txt', 'pdf']
            }
        };

        console.log(`📄 Fetching documents ONLY from folder: /AskI Bot Clients/${clientId}`);
        const businessData = await multiSource.getBusinessData(config);

        // Show what we found
        console.log(`\n📊 Found in folder:`);
        console.log(`   - Documents: ${Object.keys(businessData.documents).length}`);
        if (businessData.structured.services) {
            console.log(`   - Services: ${businessData.structured.services.length}`);
        }

        // List the documents we're processing
        console.log(`\n📄 Documents to process:`);
        Object.keys(businessData.documents).forEach(docName => {
            console.log(`   - ${docName}`);
        });

        // Prepare all chunks
        let allChunks = [];

        // Process documents
        Object.entries(businessData.documents).forEach(([docName, doc]) => {
            const chunks = this.createChunks(doc.content);
            chunks.forEach((chunk, idx) => {
                allChunks.push({
                    id: `${docName.replace(/[^a-zA-Z0-9]/g, '-')}-${idx}`,
                    text: chunk,
                    metadata: {
                        source: docName,
                        type: 'document',
                        folderId: folderId,
                        clientId: clientId
                    }
                });
            });
        });

        // Process services from sheets
        if (businessData.structured.services && businessData.structured.services.length > 0) {
            businessData.structured.services.forEach((service, idx) => {
                allChunks.push({
                    id: `service-${idx}`,
                    text: `Service: ${service.name}\nCategory: ${service.category}\nPrice: ${service.price}\nDuration: ${service.duration}\nDescription: ${service.description}`,
                    metadata: {
                        source: 'Google Sheets - Services',
                        type: 'service',
                        serviceName: service.name,
                        clientId: clientId
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
                console.log(`⚡ Creating embeddings for chunks ${i + 1}-${Math.min(i + batchSize, allChunks.length)}...`);

                const embeddings = await this.openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: batch.map(chunk => chunk.text)
                });

                const vectors = batch.map((chunk, idx) => ({
                    id: chunk.id,
                    values: embeddings.data[idx].embedding,
                    metadata: {
                        ...chunk.metadata,
                        text: chunk.text.substring(0, 1000)
                    }
                }));

                await namespace.upsert(vectors);
                processed += batch.length;

                console.log(`✅ Processed ${processed}/${allChunks.length} chunks`);

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

        console.log(`\n✅ Successfully processed ${allChunks.length} chunks for ${clientId}!`);
        console.log(`✅ All documents are from: /AskI Bot Clients/${clientId}\n`);
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

        const queryEmbedding = await this.openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: query
        });

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
    console.log('=========================================');
    console.log('🚀 Pinecone Setup with Folder Restriction');
    console.log('=========================================\n');

    const setup = new PineconeSetupWithFolder();

    try {
        // Setup index
        await setup.setupIndex();

        // Process documents for your client
        const clientId = 'demo-wellness';
        await setup.processClientDocuments(clientId);

        // Test searches
        console.log('================================');
        console.log('🧪 Testing Search Functionality');
        console.log('================================');

        await setup.testSearch(clientId, 'What is the cancellation policy?');
        await setup.testSearch(clientId, 'What services do you offer?');

        console.log('\n✨ Setup Complete!');
        console.log(`\nOnly documents from /AskI Bot Clients/${clientId} have been indexed.`);

    } catch (error) {
        console.error('\n❌ Setup failed:', error);
        process.exit(1);
    }
}

main().catch(console.error);