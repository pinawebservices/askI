// lib/middleware/cors-auth-simple.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Simple cache for API keys
const apiKeyCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Define the shape of what we're storing in cache
interface CachedClient {
    client_id: string;
    allowed_domains: string[];
    is_active: boolean;
    timestamp: number;
}

export async function validateApiRequest(request: NextRequest) {
    const origin = request.headers.get('origin') || '';
    const apiKey = request.headers.get('x-api-key');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': origin,
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
            }
        });
    }

    // Check API key
    if (!apiKey) {
        return NextResponse.json(
            { error: 'API key required' },
            { status: 401 }
        );
    }

    // Check cache first
    let client = apiKeyCache.get(apiKey);

    if (!client || Date.now() - client.timestamp > CACHE_TTL) {

        // Fetch from database
        const { data, error } = await supabaseAdmin
            .from('clients')
            .select('client_id, allowed_domains, is_active')
            .eq('api_key', apiKey)
            .single();

        if (error || !data || !data.is_active) {
            return NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
        }

        // Explicitly handle the allowed_domains type
        const allowedDomains: string[] = Array.isArray(data.allowed_domains)
            ? data.allowed_domains
            : [];

        // Create properly typed client object
        client = {
            client_id: data.client_id,
            allowed_domains: allowedDomains,
            is_active: data.is_active,
            timestamp: Date.now()
        };

        apiKeyCache.set(apiKey, client);
    }

    // Check origin
    const isAllowed = (client.allowed_domains || []).some((domain: string)=> {
        return domain === origin || domain === '*'; // * for dev only
    });

    if (!isAllowed && process.env.NODE_ENV === 'production') {
        return NextResponse.json(
            { error: 'Origin not allowed' },
            { status: 403 }
        );
    }

    // Add client_id to headers for the API route
    const response = NextResponse.next();
    response.headers.set('X-Client-Id', client.client_id);
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'POST');

    return response;
}