// scripts/setup-client.js
// Universal client setup script

import ClientSetupService from '../lib/services/clientSetupCompleteService.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

async function setupClient(clientId) {
    const setupService = new ClientSetupService();

    try {
        // Load client data file
        const clientFilePath = path.join(__dirname, '..', 'clients', `${clientId}.js`);

        if (!fs.existsSync(clientFilePath)) {
            console.error(`❌ Client data file not found: clients/${clientId}.js`);
            console.log('\nAvailable clients:');

            // List available client files
            const clientsDir = path.join(__dirname, '..', 'clients');
            const files = fs.readdirSync(clientsDir)
                .filter(f => f.endsWith('.js') && !f.startsWith('_'));

            files.forEach(f => {
                console.log(`  - ${f.replace('.js', '')}`);
            });

            process.exit(1);
        }

        // Import client data
        const { default: clientData } = await import(`../clients/${clientId}.js`);

        console.log(`\n🚀 Setting up client: ${clientData.business_name}`);
        console.log(`📋 Client ID: ${clientData.client_id}`);
        console.log(`🏢 Industry: ${clientData.industry}`);
        console.log(`💼 Plan: ${clientData.plan_type}`);
        console.log('\n' + '='.repeat(50) + '\n');

        // Extract Google config if present
        const googleConfig = clientData.google_config || {
            includeGoogleDrive: false
        };

        // Remove google_config from main data object
        const setupData = { ...clientData };
        delete setupData.google_config;

        // Run setup
        const result = await setupService.setupClient(setupData, googleConfig);

        // Success message
        console.log('\n' + '='.repeat(50));
        console.log('✅ SETUP COMPLETE!');
        console.log('='.repeat(50));
        console.log(`\n📊 Client: ${clientData.business_name}`);
        console.log(`🔑 ID: ${clientData.client_id}`);
        console.log('\n📍 Test URLs:');
        console.log(`   Widget: http://localhost:3000/test?clientId=${clientData.client_id}`);
        console.log(`   Dashboard: http://localhost:3000/dashboard/${clientData.client_id}`);

        if (googleConfig.includeGoogleDrive) {
            console.log('\n📁 Google Drive: Configured and indexed');
        }

        console.log('\n💡 Next steps:');
        console.log('   1. Test the chatbot with the widget URL above');
        console.log('   2. Try asking about services, pricing, and FAQs');
        console.log('   3. Test lead capture by asking for a consultation');

    } catch (error) {
        console.error('\n❌ Setup failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

// Get client ID from command line
const clientId = process.argv[2];

if (!clientId) {
    console.log('🤖 Universal Client Setup Script');
    console.log('================================\n');
    console.log('Usage: npm run setup-client [client-id]');
    console.log('\nExamples:');
    console.log('  npm run setup-client law-101');
    console.log('  npm run setup-client acc-102');
    console.log('\n Available clients:');

    // List available client files
    const clientsDir = path.join(__dirname, '..', 'clients');
    if (fs.existsSync(clientsDir)) {
        const files = fs.readdirSync(clientsDir)
            .filter(f => f.endsWith('.js') && !f.startsWith('_'));

        files.forEach(f => {
            console.log(`  - ${f.replace('.js', '')}`);
        });
    }

    process.exit(1);
}

// Run setup
setupClient(clientId);