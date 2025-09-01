// lib/clientSetupService.js
// Complete version with Supabase as source of truth + Google Drive support

import { createClient } from '@supabase/supabase-js';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { MultiSourceClient } from '../multiSourceClient.js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export class ClientSetupService {
    constructor() {
        this.CHUNK_SIZE = 800;
        this.CHUNK_OVERLAP = 200;
    }

    /**
     * Complete client setup - with optional Google Drive
     */
    async setupClient(clientData, options = {}) {
        console.log(`🚀 Setting up client: ${clientData.client_id}`);

        const {
            includeGoogleDrive = false,
            googleDriveFolderId = null,
            googleSheetsId = null
        } = options;

        try {
            // Step 1: Create in Supabase (including Google config)
            const supabaseResult = await this.createInSupabase({
                ...clientData,
                google_drive_folder_id: googleDriveFolderId,
                google_sheets_id: googleSheetsId
            });

            // Step 2: Setup Pinecone from Supabase data
            await this.setupPinecone(clientData.client_id);

            // Step 3: If Google Drive is enabled, add those vectors too
            if (includeGoogleDrive && googleDriveFolderId) {
                await this.addGoogleDriveVectors(clientData.client_id, googleDriveFolderId);
            }

            // Step 4: Verify setup
            const verified = await this.verifySetup(clientData.client_id);

            if (!verified) {
                throw new Error('Setup verification failed');
            }

            console.log(`✅ Client ${clientData.client_id} setup complete!`);
            return supabaseResult;

        } catch (error) {
            console.error(`❌ Setup failed for ${clientData.client_id}:`, error);
            await this.rollback(clientData.client_id);
            throw error;
        }
    }

    /**
     * Create all client data in Supabase
     */
    async createInSupabase(clientData) {
        const results = {};

        // 1. Create main client record
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .upsert({
                client_id: clientData.client_id,
                business_name: clientData.business_name,
                email: clientData.contact_email,
                plan_type: clientData.plan_type || 'starter',
                is_active: true,
                pinecone_namespace: clientData.client_id,
                google_drive_folder_id: clientData.google_drive_folder_id || null,
                google_sheets_id: clientData.google_sheets_id || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'client_id'
            })
            .select()
            .single();

        if (clientError) throw clientError;
        results.client = client;

        // 2. Create client instructions
        const { data: instructions, error: instructionsError } = await supabase
            .from('client_instructions')
            .upsert({
                client_id: clientData.client_id,
                business_name: clientData.business_name,
                business_type: clientData.industry,
                tone_style: clientData.tone_style || 'professional',
                communication_style: clientData.communication_style || 'clear and helpful',
                formality_level: clientData.formality_level || 'professional',
                special_instructions: clientData.special_instructions,
                formatting_rules: clientData.formatting_rules,
                lead_capture_process: clientData.lead_capture_process,
                response_time: 'immediate',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'client_id'
            })
            .select()
            .single();

        if (instructionsError) throw instructionsError;
        results.instructions = instructions;

        // 3. Create client content (services, FAQ, etc.)
        const contentItems = [];

        // Add services
        if (clientData.services) {
            contentItems.push({
                client_id: clientData.client_id,
                content_type: 'services',
                content: clientData.services,
                display_order: 1
            });
        }

        // Add FAQ
        if (clientData.faq) {
            contentItems.push({
                client_id: clientData.client_id,
                content_type: 'faq',
                content: { items: clientData.faq },
                display_order: 2
            });
        }

        // Add business hours
        if (clientData.business_hours) {
            contentItems.push({
                client_id: clientData.client_id,
                content_type: 'hours',
                content: { hours: clientData.business_hours },
                display_order: 3
            });
        }

        // Add contact info
        if (clientData.contact_info) {
            contentItems.push({
                client_id: clientData.client_id,
                content_type: 'contact',
                content: clientData.contact_info,
                display_order: 4
            });
        }

        // Add business background
        if (clientData.business_background) {
            contentItems.push({
                client_id: clientData.client_id,
                content_type: 'background',
                content: { text: clientData.business_background },
                display_order: 0
            });
        }

        // Insert all content items
        if (contentItems.length > 0) {
            const { data: content, error: contentError } = await supabase
                .from('client_content')
                .upsert(contentItems, {
                    onConflict: 'client_id,content_type'
                })
                .select();

            if (contentError) throw contentError;
            results.content = content;
        }

        return results;
    }

    /**
     * Setup Pinecone namespace with data from Supabase
     */
    async setupPinecone(clientId) {
        console.log(`🔍 Setting up Pinecone for ${clientId}...`);

        // Get all data from Supabase (single source of truth!)
        const clientData = await this.getClientFromSupabase(clientId);

        if (!clientData) {
            throw new Error(`Client ${clientId} not found in Supabase`);
        }

        // Initialize Pinecone
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // Create chunks for vector storage
        const chunks = this.createChunksFromClientData(clientData);

        // Process in batches
        const batchSize = 10;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);

            // Create embeddings
            const embeddings = await openai.embeddings.create({
                model: 'text-embedding-3-small',
                input: batch.map(chunk => chunk.text)
            });

            // Prepare vectors
            const vectors = batch.map((chunk, idx) => ({
                id: chunk.id,
                values: embeddings.data[idx].embedding,
                metadata: {
                    ...chunk.metadata,
                    text: chunk.text.substring(0, 1000),
                    client_id: clientId
                }
            }));

            // Upsert to Pinecone
            await namespace.upsert(vectors);
            console.log(`✅ Processed ${Math.min(i + batchSize, chunks.length)}/${chunks.length} chunks`);
        }

        console.log(`✅ Pinecone setup complete for ${clientId}`);
    }

    /**
     * Add Google Drive documents to Pinecone
     */
    async addGoogleDriveVectors(clientId, folderId) {
        console.log(`📁 Adding Google Drive documents for ${clientId}...`);

        try {
            // Use existing MultiSourceClient
            const multiSource = new MultiSourceClient(clientId);
            const initialized = await multiSource.initialize();

            if (!initialized) {
                console.log('⚠️ Google Drive not configured for this client');
                return;
            }

            // Get documents from Google Drive
            const config = {
                googleDrive: {
                    enabled: true,
                    folderId: folderId,
                    fileTypes: ['gdoc', 'txt', 'pdf']
                }
            };

            const driveData = await multiSource.getBusinessData(config);

            if (!driveData.documents || Object.keys(driveData.documents).length === 0) {
                console.log('No documents found in Google Drive');
                return;
            }

            // Process Google Drive documents into vectors
            const index = pinecone.index('chatbot-knowledge');
            const namespace = index.namespace(clientId);

            const chunks = [];

            // Process each document
            for (const [docName, doc] of Object.entries(driveData.documents)) {
                const docChunks = this.createTextChunks(doc.content);
                docChunks.forEach((chunk, idx) => {
                    chunks.push({
                        id: `gdrive-${docName.replace(/[^a-zA-Z0-9]/g, '-')}-${idx}`,
                        text: chunk,
                        metadata: {
                            source: 'Google Drive',
                            document_name: docName,
                            type: 'document',
                            chunk_index: idx
                        }
                    });
                });
            }

            // Process chunks in batches
            console.log(`📊 Processing ${chunks.length} Google Drive chunks...`);

            for (let i = 0; i < chunks.length; i += 10) {
                const batch = chunks.slice(i, i + 10);

                const embeddings = await openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: batch.map(chunk => chunk.text)
                });

                const vectors = batch.map((chunk, idx) => ({
                    id: chunk.id,
                    values: embeddings.data[idx].embedding,
                    metadata: {
                        ...chunk.metadata,
                        text: chunk.text.substring(0, 1000),
                        client_id: clientId
                    }
                }));

                await namespace.upsert(vectors);
                console.log(`✅ Processed ${Math.min(i + 10, chunks.length)}/${chunks.length} Google Drive chunks`);
            }

            console.log(`✅ Added ${chunks.length} chunks from Google Drive`);

        } catch (error) {
            console.error('Error processing Google Drive documents:', error);
            console.log('⚠️ Continuing without Google Drive documents');
        }
    }

    /**
     * Get all client data from Supabase
     */
    async getClientFromSupabase(clientId) {
        // Get main client info
        const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (!client) return null;

        // Get instructions
        const { data: instructions } = await supabase
            .from('client_instructions')
            .select('*')
            .eq('client_id', clientId)
            .single();

        // Get all content
        const { data: content } = await supabase
            .from('client_content')
            .select('*')
            .eq('client_id', clientId)
            .order('display_order');

        return {
            ...client,
            instructions,
            content
        };
    }

    /**
     * Create chunks from structured client data (from Supabase)
     */
    createChunksFromClientData(clientData) {
        const chunks = [];
        const clientId = clientData.client_id;

        // Add business background
        const background = clientData.content?.find(c => c.content_type === 'background');
        if (background) {
            chunks.push({
                id: `${clientId}-background`,
                text: `About ${clientData.business_name}: ${background.content.text}`,
                metadata: {
                    source: 'Business Background',
                    type: 'background'
                }
            });
        }

        // Add services
        const services = clientData.content?.find(c => c.content_type === 'services');
        if (services && services.content) {
            services.content.forEach((category, catIdx) => {
                if (category.services) {
                    category.services.forEach((service, srvIdx) => {
                        chunks.push({
                            id: `${clientId}-service-${catIdx}-${srvIdx}`,
                            text: `Service: ${service.name}
Category: ${category.category}
Price: ${service.pricing}
Duration: ${service.duration}
Description: ${service.description}
Notes: ${service.notes || ''}`,
                            metadata: {
                                source: 'Services',
                                type: 'service',
                                category: category.category,
                                service_name: service.name
                            }
                        });
                    });
                }
            });
        }

        // Add FAQ
        const faq = clientData.content?.find(c => c.content_type === 'faq');
        if (faq && faq.content.items) {
            faq.content.items.forEach((item, idx) => {
                chunks.push({
                    id: `${clientId}-faq-${idx}`,
                    text: `Question: ${item.question}\nAnswer: ${item.answer}`,
                    metadata: {
                        source: 'FAQ',
                        type: 'faq'
                    }
                });
            });
        }

        // Add hours
        const hours = clientData.content?.find(c => c.content_type === 'hours');
        if (hours) {
            chunks.push({
                id: `${clientId}-hours`,
                text: `Business Hours: ${hours.content.hours}`,
                metadata: {
                    source: 'Business Hours',
                    type: 'hours'
                }
            });
        }

        // Add contact info
        const contact = clientData.content?.find(c => c.content_type === 'contact');
        if (contact) {
            const contactText = `Contact Information: 
Phone: ${contact.content.phone || 'Not provided'}
Email: ${contact.content.email || 'Not provided'}
Address: ${contact.content.address || 'Not provided'}
Website: ${contact.content.website || 'Not provided'}`;

            chunks.push({
                id: `${clientId}-contact`,
                text: contactText,
                metadata: {
                    source: 'Contact Info',
                    type: 'contact'
                }
            });
        }

        // Add instructions as context
        if (clientData.instructions) {
            chunks.push({
                id: `${clientId}-instructions`,
                text: `Business Instructions: ${clientData.instructions.special_instructions || ''}
Tone: ${clientData.instructions.tone_style || ''}
Communication Style: ${clientData.instructions.communication_style || ''}`,
                metadata: {
                    source: 'Instructions',
                    type: 'instructions'
                }
            });
        }

        return chunks;
    }

    /**
     * Create text chunks from unstructured text (for Google Drive docs)
     */
    createTextChunks(text) {
        if (!text) return [];

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

    /**
     * Verify the setup worked
     */
    async verifySetup(clientId) {
        // Check Supabase
        const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (!client) {
            console.error('❌ Client not found in Supabase');
            return false;
        }

        // Check Pinecone
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // Test search
        const testEmbedding = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: 'test query'
        });

        const results = await namespace.query({
            vector: testEmbedding.data[0].embedding,
            topK: 1,
            includeMetadata: true
        });

        if (!results.matches || results.matches.length === 0) {
            console.error('❌ No vectors found in Pinecone');
            return false;
        }

        console.log('✅ Setup verified successfully');
        return true;
    }

    /**
     * Rollback on failure
     */
    async rollback(clientId) {
        console.log(`🔄 Rolling back setup for ${clientId}...`);

        try {
            // Delete from Supabase (cascades to related tables)
            await supabase
                .from('clients')
                .delete()
                .eq('client_id', clientId);

            // Clear Pinecone namespace
            const index = pinecone.index('chatbot-knowledge');
            const namespace = index.namespace(clientId);
            await namespace.deleteAll();

            console.log(`✅ Rollback complete for ${clientId}`);
        } catch (error) {
            console.error('Error during rollback:', error);
        }
    }

    /**
     * Update existing client (sync to Pinecone)
     */
    async updateClient(clientId, includeGoogleDrive = false) {
        console.log(`🔄 Updating client ${clientId}...`);

        // Get client config from Supabase
        const { data: client } = await supabase
            .from('clients')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (!client) {
            throw new Error(`Client ${clientId} not found`);
        }

        // Clear Pinecone
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);
        await namespace.deleteAll();

        // Re-setup from Supabase
        await this.setupPinecone(clientId);

        // Re-add Google Drive if configured
        if (includeGoogleDrive && client.google_drive_folder_id) {
            await this.addGoogleDriveVectors(clientId, client.google_drive_folder_id);
        }

        console.log(`✅ Client ${clientId} updated`);
    }

    /**
     * Delete client completely
     */
    async deleteClient(clientId) {
        console.log(`🗑️ Deleting client ${clientId}...`);

        try {
            // Delete from Supabase (cascades to related tables)
            await supabase
                .from('clients')
                .delete()
                .eq('client_id', clientId);

            // Clear Pinecone namespace
            const index = pinecone.index('chatbot-knowledge');
            const namespace = index.namespace(clientId);
            await namespace.deleteAll();

            console.log(`✅ Client ${clientId} deleted`);
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    }
}

export default ClientSetupService;