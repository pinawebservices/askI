// app/api/widget-config/[clientId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
    request: NextRequest,
    { params }: { params: { clientId: string } }
) {
    const { clientId } = params;
    console.log('1. Widget config requested for clientId:', clientId);
    const domain = request.nextUrl.searchParams.get('domain');

    // Fetch client configuration
    const { data: client, error } = await supabaseAdmin
        .from('clients')
        .select(`
            client_id,
            api_key,
            is_active,
            allowed_domains
        `)
        .eq('client_id', clientId)
        .single();

    console.log('2. Database query result:', { client, error });

    // Check each condition separately for debugging
    if (error) {
        console.log('3a. Database error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!client) {
        console.log('3b. No client found');
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    if (!client.is_active) {
        console.log('3c. Client is inactive:', client.is_active);
        return NextResponse.json({ error: 'Client is inactive' }, { status: 403 });
    }

    if (!client.api_key) {
        console.log('3d. Client has no API key');
        return NextResponse.json({ error: 'No API key configured' }, { status: 403 });
    }

    console.log('4. All checks passed, returning config');

    // Auto-add domain if it's new (optional)
    if (domain && !client.allowed_domains?.includes(domain)) {
        const domainCount = client.allowed_domains?.length || 0;

        if (domainCount < 5) {
            const updatedDomains = [...(client.allowed_domains || []), domain];

            await supabaseAdmin
                .from('clients')
                .update({allowed_domains: updatedDomains})
                .eq('client_id', clientId);

            console.log(`Auto-added domain ${domain} for client ${clientId}`);
        } else {
            console.warn(`Client ${clientId} has too many domains, manual approval needed`);
        }
    }

    // Return configuration
    return NextResponse.json({
        apiKey: client.api_key,
        apiUrl: process.env.NEXT_PUBLIC_APP_URL,
    });
}