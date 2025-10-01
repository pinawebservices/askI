// app/api/setup-client-pinecone/route.js
import ClientSetupService from '@/lib/services/clientSetupCompleteService.js';
import { supabaseAdmin } from '@/lib/supabase-admin.ts';
import {NextResponse} from "next/server";

export async function POST(request) {

    try {
        const { clientId, forceUpdate = false } = await request.json();
        console.log('Pinecone operation for client:', clientId, 'Force update:', forceUpdate);

        // Get client data
        const { data: client, error: clientError } = await supabaseAdmin
            .from('clients')
            .select('*')
            .eq('client_id', clientId)
            .single();

        if (clientError || !client) {
            return NextResponse.json({ error: 'Client not found', clientError }, { status: 404 });
        }

        const setupService = new ClientSetupService();

        if (!client.is_pinecone_configured) {
            // Initial setup
            console.log('Initial Pinecone setup');
            await setupService.setupPinecone(clientId);

            await supabaseAdmin
                .from('clients')
                .update({ is_pinecone_configured: true, is_active: true })
                .eq('client_id', clientId);

            return NextResponse.json({ success: true, action: 'created' });
        } else if (forceUpdate) {
            // Update existing
            console.log('Updating Pinecone vectors');
            await setupService.updateClient(clientId, !!client.google_drive_folder_id);

            return NextResponse.json({ success: true, action: 'updated' });
        } else {
            return NextResponse.json({ success: true, action: 'already_configured' });
        }

    } catch (error) {
        console.error('Pinecone setup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}