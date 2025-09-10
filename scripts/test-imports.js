// scripts/test-imports.js
console.log('Testing imports...\n');

// Test Supabase
try {
    const { createClient } = await import('../lib/services/supabase-client.ts');
    console.log('✅ Supabase import works');
} catch (error) {
    console.error('❌ Supabase import failed:', error.message);
}

// Test your service
try {
    const { ClientSetupService } = await import('../lib/services/clientSetupCompleteService.js');
    console.log('✅ ClientSetupService import works');
} catch (error) {
    console.error('❌ ClientSetupService import failed:', error.message);
}

// Test environment
console.log('\nEnvironment:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌');
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌');