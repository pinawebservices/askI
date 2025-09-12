// app/api/create-organization/route.ts
import { supabaseAdmin } from '@/lib/supabase-admin';  // Your existing admin client
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { userId, email, firstName, lastName, businessName } = await request.json();

        // Check if user already has an organization
        const { data: existingUser } = await supabaseAdmin
            .from('users')
            .select('id, organization_id')
            .eq('id', userId)
            .single();

        if (existingUser) {
            return NextResponse.json({
                success: true,
                message: 'User already has an organization',
                organizationId: existingUser.organization_id
            });
        }

        // Create organization
        const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + userId.substring(0, 8);

        const { data: org, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert({
                name: businessName,
                slug: slug,
                billing_email: email,
                plan_type: 'none'  // Start with none/free tier
            })
            .select()
            .single();

        if (orgError) throw orgError;

        // Create user record
        const { error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                id: userId,
                email: email,
                first_name: firstName,
                last_name: lastName,
                organization_id: org.id,
                role: 'owner',
            });

        if (userError) {
            // Rollback - delete the organization
            await supabaseAdmin
                .from('organizations')
                .delete()
                .eq('id', org.id);

            throw userError;
        }

        // Create client record
        const clientId = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + org.id.substring(0, 8);

        const { error: clientError } = await supabaseAdmin
            .from('clients')
            .insert({
                client_id: clientId,
                business_name: businessName,
                email: email,
                plan_type: 'none',  // Match the organization plan
                is_active: false,
                organization_id: org.id,
                pinecone_namespace: clientId,  // Reserve the namespace
            });

        if (clientError) {
            console.error('Failed to create client record:', clientError);
        }

        return NextResponse.json({
            success: true,
            organizationId: org.id,
            clientId: clientId
        });

    } catch (error: any) {
        console.error('Error creating organization:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create organization' },
            { status: 500 }
        );
    }
}