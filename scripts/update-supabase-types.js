#!/usr/bin/env node
import { execSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const projectId = process.env.SUPABASE_PROJECT_ID;

if (!projectId) {
    console.error('Error: SUPABASE_PROJECT_ID not found in .env.local');
    process.exit(1);
}

try {
    execSync(`npx supabase gen types typescript --project-id ${projectId} > types/supabase.ts`, {
        stdio: 'inherit'
    });
    console.log('✅ Types generated successfully');
} catch (error) {
    console.error('❌ Failed to generate types:', error.message);
    process.exit(1);
}