// scripts/update-client.js
import ClientSetupService from '../lib/clientSetupService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

async function updateClient(clientId) {
    const setupService = new ClientSetupService();

    try {
        // Load client data file
        const { default: clientData } = await import(`../clients/${clientId}.js`);

        console.log(`🔄 Updating client: ${clientData.business_name}`);

        const googleConfig = clientData.google_config || {};

        await setupService.updateClient(
            clientId,
            googleConfig.includeGoogleDrive
        );

        console.log('✅ Update complete!');

    } catch (error) {
        console.error('❌ Update failed:', error);
        process.exit(1);
    }
}

const clientId = process.argv[2];

if (!clientId) {
    console.log('Usage: npm run update-client [client-id]');
    process.exit(1);
}

updateClient(clientId);