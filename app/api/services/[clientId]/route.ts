// app/api/services/[clientId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// GET all services for a client
export async function GET(
    request: NextRequest,
    { params }: { params: { clientId: string } }
) {
    try {
        const { clientId } = await params;

        const { data, error } = await supabaseAdmin
            .from('client_services')
            .select('*')
            .eq('client_id', clientId)
            .eq('is_active', true)
            .order('category', { ascending: true })
            .order('display_order', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ services: data || [] });
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        );
    }
}

// POST new service
export async function POST(
    request: NextRequest,
    { params }: { params: { clientId: string } }
) {
    try {
        const { clientId } = await params;
        const body = await request.json();

        // Validate required fields
        if (!body.service_name) {
            return NextResponse.json(
                { error: 'Service name is required' },
                { status: 400 }
            );
        }

        const serviceData = {
            ...body,
            client_id: clientId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabaseAdmin
            .from('client_services')
            .insert(serviceData)
            .select()
            .single();

        if (error) throw error;

        // Trigger Pinecone update
        await triggerPineconeUpdate(clientId);

        return NextResponse.json({ service: data });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json(
            { error: 'Failed to create service' },
            { status: 500 }
        );
    }
}

// PUT update service
export async function PUT(
    request: NextRequest,
    { params }: { params: { clientId: string } }
) {
    try {
        const { clientId } = await params;
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Service ID is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from('client_services')
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('client_id', clientId) // Extra security check
            .select()
            .single();

        if (error) throw error;

        // Trigger Pinecone update
        await triggerPineconeUpdate(clientId);

        return NextResponse.json({ service: data });
    } catch (error) {
        console.error('Error updating service:', error);
        return NextResponse.json(
            { error: 'Failed to update service' },
            { status: 500 }
        );
    }
}

// DELETE service
export async function DELETE(
    request: NextRequest,
    { params }: { params: { clientId: string } }
) {
    try {
        const { clientId } = params;
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Service ID is required' },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('client_services')
            .delete()
            .eq('id', id)
            .eq('client_id', clientId); // Extra security check

        if (error) throw error;

        // Trigger Pinecone update
        await triggerPineconeUpdate(clientId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting service:', error);
        return NextResponse.json(
            { error: 'Failed to delete service' },
            { status: 500 }
        );
    }
}

// Helper function to trigger Pinecone update
async function triggerPineconeUpdate(clientId: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/admin/setup-client-pinecone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clientId,
                forceUpdate: true,
                updateType: 'services'
            }),
        });

        if (!response.ok) {
            console.error('Failed to update Pinecone');
        }
    } catch (err) {
        console.error('Error updating Pinecone:', err);
    }
}