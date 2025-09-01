// scripts/list-clients.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function listClients() {
    console.log('\n📁 CLIENT DATA FILES');
    console.log('=' .repeat(40));

    const clientsDir = path.join(__dirname, '..', 'clients');
    const files = fs.readdirSync(clientsDir)
        .filter(f => f.endsWith('.js') && !f.startsWith('_'));

    for (const file of files) {
        const { default: data } = await import(`../clients/${file}`);
        console.log(`\n${file.replace('.js', '')}:`);
        console.log(`  Business: ${data.business_name}`);
        console.log(`  Industry: ${data.industry}`);
        console.log(`  Plan: ${data.plan_type}`);
    }

    console.log('\n\n💾 CLIENTS IN DATABASE');
    console.log('=' .repeat(40));

    const { data: dbClients } = await supabase
        .from('clients')
        .select('client_id, business_name, plan_type, is_active')
        .order('created_at', { ascending: false });

    if (dbClients && dbClients.length > 0) {
        dbClients.forEach(client => {
            console.log(`\n${client.client_id}:`);
            console.log(`  Business: ${client.business_name}`);
            console.log(`  Plan: ${client.plan_type}`);
            console.log(`  Active: ${client.is_active ? '✅' : '❌'}`);
        });
    } else {
        console.log('\nNo clients in database yet.');
    }
}

listClients();