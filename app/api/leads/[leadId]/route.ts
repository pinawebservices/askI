import { createClient } from '@/lib/supabase/server-client';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ leadId: string }> }
) {
    try {
        const { leadId } = await context.params;
        const body = await request.json();
        const supabase = await createClient();

        // Get the current user session
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify the lead belongs to a client in the user's organization
        const { data: lead } = await supabase
            .from('captured_leads')
            .select('client_id')
            .eq('id', leadId)
            .single();

        if (!lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Get user's organization
        const { data: userData } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', session.user.id)
            .single();

        // Verify the client belongs to the user's organization
        const { data: client } = await supabase
            .from('clients')
            .select('organization_id')
            .eq('client_id', lead.client_id)
            .single();

        if (!client || client.organization_id !== userData?.organization_id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update the lead
        const updateData: {
            status?: string;
            notes?: string;
            last_contacted_at?: string;
            updated_at: string;
        } = {
            updated_at: new Date().toISOString(),
        };

        if (body.status !== undefined) {
            updateData.status = body.status;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        if (body.last_contacted_at !== undefined) {
            updateData.last_contacted_at = body.last_contacted_at;
        }

        const { data: updatedLead, error: updateError } = await supabase
            .from('captured_leads')
            .update(updateData)
            .eq('id', leadId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating lead:', updateError);
            return NextResponse.json(
                { error: 'Failed to update lead' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data: updatedLead });
    } catch (error) {
        console.error('Error in PATCH /api/leads/[leadId]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ leadId: string }> }
) {
    try {
        const { leadId } = await context.params;
        const supabase = await createClient();

        // Get the current user session
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's organization
        const { data: userData } = await supabase
            .from('users')
            .select('organization_id')
            .eq('id', session.user.id)
            .single();

        // Fetch the lead
        const { data: lead, error } = await supabase
            .from('captured_leads')
            .select('*')
            .eq('id', leadId)
            .single();

        if (error || !lead) {
            return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
        }

        // Verify the client belongs to the user's organization
        const { data: client } = await supabase
            .from('clients')
            .select('organization_id')
            .eq('client_id', lead.client_id)
            .single();

        if (!client || client.organization_id !== userData?.organization_id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: lead });
    } catch (error) {
        console.error('Error in GET /api/leads/[leadId]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}