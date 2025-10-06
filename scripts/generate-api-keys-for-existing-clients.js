// scripts/generate-api-keys.js
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function generateApiKey(clientId) {
    const randomString = crypto.randomBytes(24).toString('hex');
    return `ak_${clientId}_${randomString}`;
}

async function generateKeys() {
    try {
        const { data: clients, error } = await supabase
            .from('clients')
            .select('client_id, business_name')
            .is('api_key', null);

        if (error) {
            console.error('Error fetching clients:', error);
            return;
        }

        if (!clients || clients.length === 0) {
            console.log('No clients need API keys - all set!');
            return;
        }

        console.log(`Generating API keys for ${clients.length} clients...\n`);

        for (const client of clients) {
            const apiKey = generateApiKey(client.client_id);

            const { error: updateError } = await supabase
                .from('clients')
                .update({
                    api_key: apiKey,
                    allowed_domains: ['*'] // Use wildcard for auto-detection
                })
                .eq('client_id', client.client_id);

            if (updateError) {
                console.error(`❌ Failed for ${client.business_name}:`, updateError);
            } else {
                console.log(`✅ ${client.business_name}`);
                console.log(`   API Key: ${apiKey}\n`);
            }
        }

        console.log('✨ Done!');
    } catch (err) {
        console.error('Script failed:', err);
    }
}

generateKeys();