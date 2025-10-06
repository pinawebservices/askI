// lib/supabase.ts (or lib/supabase.js)
import { createClient } from '@supabase/supabase-js'

// Add debugging to see what's happening
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables!')

    // Throw an error in development, but try to continue in production
    if (process.env.NODE_ENV === 'development') {
        throw new Error('Missing required Supabase environment variables')
    }
}

// Create the client even if variables are missing (will fail gracefully)
export const supabaseAdmin = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
)