// app/api/check-env/route.ts
// Create this file to check your environment variables

import { NextResponse } from 'next/server'

export async function GET() {
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Don't expose the actual values, just check if they exist
    const status = {
        supabase_url: hasSupabaseUrl ? 'SET ✓' : 'MISSING ✗',
        supabase_anon_key: hasSupabaseKey ? 'SET ✓' : 'MISSING ✗',
        url_preview: hasSupabaseUrl
            ? process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
            : 'Not set',
        all_good: hasSupabaseUrl && hasSupabaseKey
    }

    return NextResponse.json(status)
}