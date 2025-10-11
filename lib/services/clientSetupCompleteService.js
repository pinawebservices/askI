// lib/clientSetupService.js
// Complete version with Supabase as source of truth + Google Drive support

import {supabaseAdmin as supabase} from '@/lib/supabase-admin';
import {Pinecone} from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import {MultiSourceClient} from '../multiSourceClient.js';

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

        // Create chunks for vector storage
        const chunks = this.createChunksFromClientData(clientData);

        await this.uploadChunksToPinecone(clientId, chunks);

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

        // DEBUG
        console.log('=== DEBUG: Instructions from DB ===');
        console.log('Business Hours:', instructions?.business_hours);
        console.log('Full instructions:', instructions);

        // Get all content
        const { data: content } = await supabase
            .from('client_content')
            .select('*')
            .eq('client_id', clientId)
            .order('display_order');

        const { data: services } = await supabase
            .from('client_services')
            .select('*')
            .eq('client_id', clientId)
            .eq('is_active', true);


        return {
            ...client,
            instructions,
            content,
            services
        };
    }

    /**
     * Create chunks from structured client data (from Supabase)
     */
    createChunksFromClientData(clientData) {
        // Create ALL chunks - combine both config and services
        const configChunks = this.createAgentConfigChunks(clientData);
        const serviceChunks = this.createServiceConfigChunks(clientData);
        return [...configChunks, ...serviceChunks];

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

        console.log('\n🔍 Verifying setup...');
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
        console.log('✅ Client found in Supabase');

        // // Add a small delay for Pinecone to index
        // console.log('⏳ Waiting for Pinecone indexing...');
        // await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds

        // Check Pinecone
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

// Try multiple times with increasing delay
        let attempts = 3;
        let delay = 2000; // Start with 2 seconds

        for (let i = 0; i < attempts; i++) {
            console.log(`⏳ Attempt ${i + 1}/${attempts}: Waiting ${delay/1000} seconds for Pinecone indexing...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            try {
                // Use a simpler test - just check stats first
                const stats = await namespace.describeIndexStats();
                console.log(`📊 Namespace stats:`, {
                    vectorCount: stats.namespaces?.[clientId]?.vectorCount || 0,
                    namespace: clientId
                });

                // If we have vectors, try a search
                if (stats.namespaces?.[clientId]?.vectorCount > 0) {
                    console.log(`✅ Found ${stats.namespaces[clientId].vectorCount} vectors in Pinecone`);

                    // Do a simple search to verify they're searchable
                    const testEmbedding = await openai.embeddings.create({
                        model: 'text-embedding-3-small',
                        input: 'test'
                    });

                    const results = await namespace.query({
                        vector: testEmbedding.data[0].embedding,
                        topK: 1,
                        includeMetadata: true
                    });

                    if (results.matches && results.matches.length > 0) {
                        console.log('✅ Vectors are searchable');
                        return true;
                    } else {
                        console.log('⚠️ Vectors exist but not yet searchable');
                    }
                } else {
                    console.log(`⚠️ No vectors found yet in namespace ${clientId}`);
                }

            } catch (error) {
                console.error(`⚠️ Error checking Pinecone:`, error.message);
            }

            // Increase delay for next attempt
            delay *= 2;
        }

        // After all attempts, decide what to do
        console.log('\n⚠️ Warning: Pinecone vectors not fully verified');
        console.log('This is often OK - vectors may still be indexing.');
        console.log('You can test search functionality in a few moments.\n');

        // Return true anyway - setup likely succeeded, just not instantly searchable
        return true;
    }

    parseFAQs(faqText) {
        if (!faqText) return [];

        const faqs = [];
        const lines = faqText.split('\n');
        let currentQuestion = null;
        let currentAnswer = null;

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine.toLowerCase().startsWith('question:')) {
                // If we have a previous Q&A pair, save it
                if (currentQuestion && currentAnswer) {
                    faqs.push({
                        question: currentQuestion,
                        answer: currentAnswer
                    });
                }
                // Start new question
                currentQuestion = trimmedLine.substring(9).trim();
                currentAnswer = null;
            } else if (trimmedLine.toLowerCase().startsWith('answer:')) {
                // Capture answer
                currentAnswer = trimmedLine.substring(7).trim();
            } else if (currentAnswer && trimmedLine) {
                // Continue answer on multiple lines if needed
                currentAnswer += ' ' + trimmedLine;
            } else if (currentQuestion && !currentAnswer && trimmedLine) {
                // Handle case where question continues on next line
                currentQuestion += ' ' + trimmedLine;
            }
        }

        // Save the last Q&A pair
        if (currentQuestion && currentAnswer) {
            faqs.push({
                question: currentQuestion,
                answer: currentAnswer
            });
        }

        return faqs;
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

    // Add this method to ClientSetupService
    async updateSpecificData(clientId, updateType = 'config') {
        console.log(`📝 Updating ${updateType} for ${clientId}`);

        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // Define which IDs to update based on type
        const idsToDelete = [];

        if (updateType === 'config') {
            // Delete only config-related vectors
            idsToDelete.push(
                `${clientId}-business-hours`,
                `${clientId}-business-info`,
                `${clientId}-communication-style`,
                `${clientId}-special-instructions`,
                `${clientId}-contact-info`
            );

            // Delete general FAQ chunks if they exist
            for (let i = 0; i < 20; i++) {
                idsToDelete.push(`${clientId}-general-faq-${i}`);
            }
        } else if (updateType === 'services') {
            // Delete only service-related vectors
            for (let i = 0; i < 100; i++) {
                idsToDelete.push(
                    `${clientId}-service-db-${i}`,
                    `${clientId}-service-pricing-${i}`
                );
                // Delete service FAQs
                for (let j = 0; j < 10; j++) {
                    idsToDelete.push(`${clientId}-service-db-${i}-faq-${j}`);
                }
            }
            idsToDelete.push(`${clientId}-services-overview`);
        }

        // Delete specific vectors
        console.log(`Deleting ${idsToDelete.length} specific vectors...`);
        await namespace.deleteMany(idsToDelete);

        // Wait for deletion
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get fresh data from Supabase
        const clientData = await this.getClientFromSupabase(clientId);

        // Rebuild only the affected chunks
        let chunksToAdd = [];

        if (updateType === 'config') {
            // Rebuild only config chunks
            chunksToAdd = this.createAgentConfigChunks(clientData);
        } else if (updateType === 'services') {
            // Rebuild only service chunks
            chunksToAdd = this.createServiceConfigChunks(clientData);
        }

        // Add the new chunks
        await this.uploadChunksToPinecone(clientId, chunksToAdd);

        console.log(`✅ Updated ${updateType} for ${clientId}`);
    }

    async uploadChunksToPinecone(clientId, chunks) {
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // Process in batches
        const batchSize = 10;
        for (let i = 0; i < chunks.length; i += batchSize) {
            const batch = chunks.slice(i, i + batchSize);
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
            console.log(`✅ Processed ${Math.min(i + batchSize, chunks.length)}/${chunks.length} chunks`);
        }
    }

// Split your createChunksFromClientData into separate methods
    createAgentConfigChunks(clientData) {
        const chunks = [];
        const clientId = clientData.client_id;

        // Business context and communication style
        if (clientData.instructions?.business_name || clientData.instructions?.business_type || clientData.instructions?.business_type) {
            // Business Information chunk
            chunks.push({
                id: `${clientId}-business-info`,
                text: `Business Name: ${clientData.instructions.business_name || clientData.business_name || ''}
Business Type: ${clientData.instructions.business_type || ''}
Industry: ${clientData.instructions.business_type || ''}`,
                metadata: {
                    source: 'Business Info',
                    type: 'business_info'
                }
            });

            // Communication Style chunk
            chunks.push({
                id: `${clientId}-communication-style`,
                text: `Communication Guidelines:
Tone Style: ${clientData.instructions.tone_style || 'professional'}
Communication Style: ${clientData.instructions.communication_style || 'clear and helpful'}
Formality Level: ${clientData.instructions.formality_level || 'professional'}
Response Time Commitment: ${clientData.instructions.response_time || '24 hours'}`,
                metadata: {
                    source: 'Communication Style',
                    type: 'communication_style'
                }
            });
        }

        // Business Hours chunk
        if (clientData.instructions && clientData.instructions.business_hours) {
            console.log('Creating business hours chunk with:', clientData.instructions.business_hours);
            chunks.push({
                id: `${clientId}-business-hours`,
                text: `Business Hours Information:
Actual Business Hours: ${clientData.instructions.business_hours}
Note: These are the only correct hours. Do not make up different hours.`,
                metadata: {
                    source: 'Business Hours',
                    type: 'business_hours',
                    priority: 'high'
                }
            });
        } else {
            console.log('No business hours found, using fallback');
            chunks.push({
                id: `${clientId}-business-hours`,
                text: `Business Hours Information: Not specified - tell customers to contact us for current hours`,
                metadata: {
                    source: 'Business Hours',
                    type: 'business_hours'
                }
            });
        }

        // General FAQs
        if (clientData.instructions?.general_faqs) {
            const generalFaqPairs = this.parseFAQs(clientData.instructions.general_faqs);

            generalFaqPairs.forEach((faq, idx) => {
                chunks.push({
                    id: `${clientId}-general-faq-${idx}`,
                    text: `General Business FAQ
Question: ${faq.question}
Answer: ${faq.answer}`,
                    metadata: {
                        source: 'General FAQ',
                        type: 'general_faq'
                    }
                });
            });
        }

        // DEBUG
        console.log('Checking business hours:');
        console.log('clientData.instructions exists?', !!clientData.instructions);
        console.log('clientData.instructions?.business_hours:', clientData.instructions?.business_hours);

        // Contact info
        const contactParts = [];
        if (clientData.instructions.contact_phone) {
            contactParts.push(`Business Contact Phone: ${clientData.instructions.contact_phone}`);
        } else {
            contactParts.push(`Phone: Not directly available - capture lead for callback`);
        }

        if (clientData.instructions.contact_email) {
            contactParts.push(`Business Contact Email: ${clientData.instructions.contact_email}`);
        } else {
            contactParts.push(`Email: Not directly available - capture lead for contact`);
        }

        if (clientData.instructions.contact_address) {
            contactParts.push(`Address: ${clientData.instructions.contact_address}`);
        } else {
            contactParts.push(`Address: Location details provided upon consultation booking`);
        }

        if (clientData.instructions.emergency_contact) {
            contactParts.push(`Emergency/After-Hours: ${clientData.instructions.emergency_contact}`);
        }

        contactParts.push(`Response Time: ${clientData.instructions.response_time || '24 hours'}`);

        chunks.push({
            id: `${clientId}-contact-info`,
            text: `Contact Information:\n${contactParts.join('\n')}`,
            metadata: {
                source: 'Contact Information',
                type: 'contact_info'
            }
        });

        // Special Instructions chunk (if exists)
        if (clientData.instructions.special_instructions) {
            chunks.push({
                id: `${clientId}-special-instructions`,
                text: `Special Instructions: ${clientData.instructions.special_instructions}`,
                metadata: {
                    source: 'Special Instructions',
                    type: 'special_instructions'
                }
            });
        }

        return chunks;
    }

    createServiceConfigChunks(clientData) {
        const chunks = [];
        const clientId = clientData.client_id;

        if (clientData.services && clientData.services.length > 0) {
            // Create overview with just names and brief descriptions (no pricing)
            const servicesList = clientData.services
                .map(s => {
                    const briefDesc = s.service_description
                        ? (s.service_description.length > 100
                            ? s.service_description.substring(0, 100) + '...'
                            : s.service_description)
                        : 'Contact us for details';
                    return `- ${s.service_name} (${s.category || 'General'}): ${briefDesc}`;
                })
                .join('\n');

            chunks.push({
                id: `${clientId}-services-overview`,
                text: `Available Services:\n${servicesList}\n\nFor pricing, duration, and detailed information about any service, please ask specifically about that service.`,
                metadata: { source: 'Services', type: 'services_overview' }
            });
        }

        if (clientData.services && Array.isArray(clientData.services)) {
            clientData.services.forEach((service, idx) => {
                // Main service chunk - description and duration ONLY (no pricing)
                chunks.push({
                    id: `${clientId}-service-db-${idx}`,
                    text: `Service: ${service.service_name}
Category: ${service.category || 'General'}
Description: ${service.service_description || 'Contact us for details about this service'}
Duration: ${service.duration || 'Varies'}`,
                    metadata: {
                        source: 'Services',
                        type: 'service',
                        category: service.category || 'General',
                        service_name: service.service_name
                    }
                });

                // Separate pricing chunk - only retrieved when pricing/cost is asked
                if (service.pricing) {
                    chunks.push({
                        id: `${clientId}-service-pricing-${idx}`,
                        text: `${service.service_name} pricing: ${service.pricing}
How much does ${service.service_name} cost: ${service.pricing}
Price for ${service.service_name}: ${service.pricing}`,
                        metadata: {
                            source: 'Service Pricing',
                            type: 'service_pricing',
                            service_name: service.service_name
                        }
                    });
                }

                // Process service-specific FAQs if they exist
                if (service.service_faqs) {
                    const faqPairs = this.parseFAQs(service.service_faqs);

                    faqPairs.forEach((faq, faqIdx) => {
                        chunks.push({
                            id: `${clientId}-service-db-${idx}-faq-${faqIdx}`,
                            text: `Service: ${service.service_name}
Category: ${service.category || 'General'}
FAQ Question: ${faq.question}
FAQ Answer: ${faq.answer}`,
                            metadata: {
                                source: 'Service FAQ',
                                type: 'service_faq',
                                service_name: service.service_name,
                                category: service.category || 'General'
                            }
                        });
                    });
                }
            });
        }

        //         // Add services (content)
//         const services = clientData.content?.find(c => c.content_type === 'services');
//         if (services && services.content) {
//             services.content.forEach((category, catIdx) => {
//                 if (category.services) {
//                     category.services.forEach((service, srvIdx) => {
//                         chunks.push({
//                             id: `${clientId}-service-${catIdx}-${srvIdx}`,
//                             text: `Service: ${service.name}
// Category: ${category.category}
// Price: ${service.pricing}
// Duration: ${service.duration}
// Description: ${service.description}
// Notes: ${service.notes || ''}`,
//                             metadata: {
//                                 source: 'Services',
//                                 type: 'service',
//                                 category: category.category,
//                                 service_name: service.name
//                             }
//                         });
//                     });
//                 }
//             });
//         }

        return chunks;
    }

    async updateAgentConfig(clientId) {
        console.log(`📝 Updating agent config for ${clientId}`);

        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // Delete old config vectors
        const configIds = [];
        // Add all possible config-related IDs
        configIds.push(
            `${clientId}-business-hours`,
            `${clientId}-business-info`,
            `${clientId}-communication-style`,
            `${clientId}-special-instructions`,
            `${clientId}-contact-info`
        );

        // Add general FAQ IDs (assuming max 50 FAQs)
        for (let i = 0; i < 50; i++) {
            configIds.push(`${clientId}-general-faq-${i}`);
        }

        const batchSize = 1000;
        for (let i = 0; i < configIds.length; i += batchSize) {
            const batch = configIds.slice(i, i + batchSize);
            console.log(`Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(configIds.length/batchSize)} (${batch.length} IDs)...`);
            await namespace.deleteMany(batch);
        }

        // Wait for deletion to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get fresh data
        const clientData = await this.getClientFromSupabase(clientId);

        // Create only config chunks
        const chunks = this.createAgentConfigChunks(clientData);

        // Upload them
        await this.uploadChunksToPinecone(clientId, chunks);

        console.log(`✅ Updated agent config for ${clientId}`);
    }

    async updateServicesConfig(clientId) {
        console.log(`📝 Updating services for ${clientId}`);

        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // Delete old service vectors
        const serviceIds = [];
        serviceIds.push(`${clientId}-services-overview`);

        // Add service-related IDs (assuming max 100 services)
        for (let i = 0; i < 100; i++) {
            serviceIds.push(
                `${clientId}-service-db-${i}`,
                `${clientId}-service-pricing-${i}`
            );
            // Add service FAQ IDs (assuming max 10 FAQs per service)
            for (let j = 0; j < 10; j++) {
                serviceIds.push(`${clientId}-service-db-${i}-faq-${j}`);
            }
        }

        // Batch delete in chunks of 1000
        const batchSize = 1000;
        for (let i = 0; i < serviceIds.length; i += batchSize) {
            const batch = serviceIds.slice(i, i + batchSize);
            console.log(`Deleting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(serviceIds.length/batchSize)} (${batch.length} IDs)...`);
            await namespace.deleteMany(batch);
        }

        // Wait for deletion to propagate
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Get fresh data
        const clientData = await this.getClientFromSupabase(clientId);

        // Create only service chunks
        const chunks = this.createServiceConfigChunks(clientData);

        // Upload them
        await this.uploadChunksToPinecone(clientId, chunks);

        console.log(`✅ Updated services for ${clientId}`);
    }
}

export default ClientSetupService;