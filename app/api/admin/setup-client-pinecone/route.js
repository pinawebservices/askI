// app/api/setup-client-pinecone/route.js
import ClientSetupService from '@/lib/services/clientSetupCompleteService.js';
import { supabaseAdmin } from '@/lib/supabase-admin.js';
import {NextResponse} from "next/server";

export async function POST(request) {
    try {
        const { clientId } = await request.json();

        // Get client data
        const { data: client } = await supabaseAdmin
            .from('clients')
            .select('is_pinecone_configured')
            .eq('client_id', clientId)
            .single();

        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        } else if (client?.is_pinecone_configured) {
            return NextResponse.json({
                success: true,
                message: 'Pinecone already configured'
            });
        }

        // Use your existing setup service for Pinecone
        const setupService = new ClientSetupService();

        // Just setup Pinecone (client already exists in Supabase)
        await setupService.setupPinecone(clientId);

        // Mark client as active
        await supabaseAdmin
            .from('clients')
            .update({
                is_pinecone_configured: true,
                is_active: true })
            .eq('client_id', clientId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Pinecone setup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}