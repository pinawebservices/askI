// scripts/test-client-search.js
// Universal client search testing script

import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import supabase from '../lib/services/supabase-client.ts';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

// Initialize services
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

/**
 * Test search functionality for a client
 */
async function testClientSearch(clientId, options = {}) {
    const {
        queries = null,  // Custom queries or use defaults
        waitTime = 5000, // Time to wait for indexing
        topK = 3,        // Number of results to return
        verbose = true   // Show detailed output
    } = options;

    console.log('\n' + '='.repeat(60));
    console.log(`🔍 TESTING SEARCH FOR CLIENT: ${clientId}`);
    console.log('='.repeat(60));

    try {
        // Step 1: Verify client exists in Supabase
        console.log('\n📊 Checking Supabase...');
        const { data: client, error } = await supabase
            .from('clients')
            .select('business_name, plan_type')
            .eq('client_id', clientId)
            .single();

        if (error || !client) {
            throw new Error(`Error retrieving client or Client ${clientId} not found in Supabase`);
        }

        console.log(`✅ Found: ${client.business_name}`);
        console.log(`   Plan: ${client.plan_type}`);

        // Step 2: Get industry-specific test queries
        const testQueries = queries || await getIndustryQueries(client.industry, clientId);

        // Step 3: Setup Pinecone namespace
        const index = pinecone.index('chatbot-knowledge');
        const namespace = index.namespace(clientId);

        // Step 4: Wait for indexing if needed
        if (waitTime > 0) {
            console.log(`\n⏳ Waiting ${waitTime/1000} seconds for Pinecone indexing...`);
            await new Promise(r => setTimeout(r, waitTime));
        }

        // Step 5: Test each query
        console.log(`\n🧪 Testing ${testQueries.length} queries:\n`);

        const results = {
            successful: 0,
            failed: 0,
            queries: []
        };

        for (const query of testQueries) {
            console.log(`📝 Query: "${query}"`);

            try {
                // Create embedding
                const embedding = await openai.embeddings.create({
                    model: 'text-embedding-3-small',
                    input: query
                });

                // Search Pinecone
                const searchResults = await namespace.query({
                    vector: embedding.data[0].embedding,
                    topK: topK,
                    includeMetadata: true
                });

                if (searchResults.matches && searchResults.matches.length > 0) {
                    results.successful++;
                    console.log(`   ✅ Found ${searchResults.matches.length} results`);

                    if (verbose) {
                        searchResults.matches.forEach((match, idx) => {
                            const preview = match.metadata.text?.substring(0, 80) || 'No text';
                            console.log(`      ${idx + 1}. [${match.score.toFixed(3)}] ${match.metadata.source}: ${preview}...`);
                        });
                    }

                    results.queries.push({
                        query,
                        success: true,
                        matches: searchResults.matches.length,
                        topScore: searchResults.matches[0]?.score
                    });
                } else {
                    results.failed++;
                    console.log(`   ❌ No results found`);

                    results.queries.push({
                        query,
                        success: false,
                        matches: 0
                    });
                }
            } catch (error) {
                results.failed++;
                console.log(`   ❌ Error: ${error.message}`);

                results.queries.push({
                    query,
                    success: false,
                    error: error.message
                });
            }

            console.log(); // Empty line between queries
        }

        // Step 6: Summary
        console.log('='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`Client: ${client.business_name} (${clientId})`);
        console.log(`Queries tested: ${testQueries.length}`);
        console.log(`✅ Successful: ${results.successful}`);
        console.log(`❌ Failed: ${results.failed}`);
        console.log(`Success rate: ${((results.successful / testQueries.length) * 100).toFixed(1)}%`);

        // Quality assessment
        const avgScore = results.queries
            .filter(q => q.topScore)
            .reduce((acc, q) => acc + q.topScore, 0) / results.successful || 0;

        console.log(`Average top score: ${avgScore.toFixed(3)}`);

        if (avgScore > 0.85) {
            console.log('⭐ Excellent relevance!');
        } else if (avgScore > 0.75) {
            console.log('👍 Good relevance');
        } else if (avgScore > 0.65) {
            console.log('⚠️ Fair relevance - consider adding more content');
        } else {
            console.log('❌ Poor relevance - review your content');
        }

        return results;

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
    }
}

/**
 * Get industry-specific test queries
 */
async function getIndustryQueries(industry, clientId) {
    const industryQueries = {
        law_firm: [
            'Do you offer free consultations?',
            'How much does a DUI defense cost?',
            'What types of personal injury cases do you handle?',
            'Do you offer payment plans?',
            'What should I bring to my consultation?',
            'How quickly can I speak with an attorney?',
            'Do you handle car accident cases?',
            'What are your business hours?'
        ],
        accounting_firm: [
            'Do you prepare personal taxes?',
            'What are your fees?',
            'Do you handle business taxes?',
            'Can you help with IRS problems?',
            'Do you offer bookkeeping services?',
            'What documents do I need for taxes?',
            'Do you work with small businesses?',
            'What are your hours?'
        ],
        medical_practice: [
            'What insurance do you accept?',
            'Do you take new patients?',
            'What are your hours?',
            'Do you offer same-day appointments?',
            'What services do you provide?',
            'How do I schedule an appointment?',
            'Do you have emergency hours?',
            'What should I bring to my first visit?'
        ],
        default: [
            'What services do you offer?',
            'What are your prices?',
            'What are your hours?',
            'How can I contact you?',
            'Where are you located?',
            'Do you offer consultations?',
            'How do I get started?',
            'Tell me about your business'
        ]
    };

    // Try to load client-specific queries from file
    try {
        const clientFile = path.join(__dirname, '..', 'clients', `${clientId}.js`);
        if (fs.existsSync(clientFile)) {
            const { default: clientData } = await import(`../clients/${clientId}.js`);

            // Generate queries from FAQ if available
            if (clientData.faq && clientData.faq.length > 0) {
                const faqQueries = clientData.faq.map(item => item.question);
                console.log(`📋 Using ${faqQueries.length} queries from client FAQ`);
                return faqQueries;
            }
        }
    } catch (error) {
        console.log('Using default industry queries');
    }

    return industryQueries[industry] || industryQueries.default;
}

/**
 * Compare two clients (useful for testing improvements)
 */
async function compareClients(clientId1, clientId2, queries) {
    console.log('\n🔀 COMPARING TWO CLIENTS');
    console.log('='.repeat(60));

    const results1 = await testClientSearch(clientId1, { queries, verbose: false });
    const results2 = await testClientSearch(clientId2, { queries, verbose: false });

    console.log('\n📊 COMPARISON RESULTS:');
    console.log(`${clientId1}: ${results1.successful}/${queries.length} successful`);
    console.log(`${clientId2}: ${results2.successful}/${queries.length} successful`);
}

// Main execution
async function main() {
    const clientId = process.argv[2];
    const mode = process.argv[3] || 'test'; // test, quick, compare

    if (!clientId) {
        console.log('🤖 Universal Client Search Tester');
        console.log('==================================\n');
        console.log('Usage:');
        console.log('  npm run test-search [client-id]           # Full test');
        console.log('  npm run test-search [client-id] quick     # Quick test (no wait)');
        console.log('  npm run test-search [client-id] compare [client-id-2]  # Compare two clients');
        console.log('\nExamples:');
        console.log('  npm run test-search law-101');
        console.log('  npm run test-search law-101 quick');
        console.log('  npm run test-search law-101 compare acc-102');

        // List available clients
        console.log('\nAvailable clients:');
        const { data: clients } = await supabase
            .from('clients')
            .select('client_id, business_name')
            .order('created_at', { ascending: false });

        if (clients && clients.length > 0) {
            clients.forEach(c => {
                console.log(`  - ${c.client_id}: ${c.business_name}`);
            });
        } else {
            console.log('  No clients found in database');
        }

        process.exit(0);
    }

    try {
        switch (mode) {
            case 'quick':
                await testClientSearch(clientId, { waitTime: 0 });
                break;

            case 'compare':
                const clientId2 = process.argv[4];
                if (!clientId2) {
                    console.error('Please provide second client ID for comparison');
                    process.exit(1);
                }
                const queries = ['What services do you offer?', 'What are your prices?', 'What are your hours?'];
                await compareClients(clientId, clientId2, queries);
                break;

            default:
                await testClientSearch(clientId);
        }
    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}

// Export for use in other scripts
export { testClientSearch, getIndustryQueries, compareClients };