import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  try {
    // Get current authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user metadata set during invitation
    const metadata = user.user_metadata;
    const email = user.email;

    if (!metadata?.organization_id || !metadata?.role || !email) {
      return NextResponse.json(
        { error: 'Invalid invitation data' },
        { status: 400 }
      );
    }

    // Check if invitation has been revoked in our database (using admin client)
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .select('id, status, organization_id')
      .eq('email', email)
      .eq('organization_id', metadata.organization_id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'This invitation has been revoked or has expired' },
        { status: 404 }
      );
    }

    // Check if user already exists in users table (already accepted)
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingUser) {
      // Get client for redirect
      const { data: client } = await supabaseAdmin
        .from('clients')
        .select('client_id')
        .eq('organization_id', metadata.organization_id)
        .single();

      return NextResponse.json({
        alreadyAccepted: true,
        redirectTo: client ? `/dashboard/${client.client_id}` : '/dashboard'
      });
    }

    // Get organization name for display
    const { data: org } = await supabaseAdmin
      .from('organizations')
      .select('name')
      .eq('id', metadata.organization_id)
      .single();

    return NextResponse.json({
      success: true,
      invitationData: {
        email,
        organizationName: org?.name || 'the organization',
        firstName: metadata.first_name,
        lastName: metadata.last_name,
        role: metadata.role,
        organizationId: metadata.organization_id,
        invitedBy: metadata.invited_by,
        userId: user.id,
        invitationId: invitation.id
      }
    });

  } catch (error: any) {
    console.error('Error verifying invitation:', error);
    return NextResponse.json(
      { error: 'Failed to verify invitation' },
      { status: 500 }
    );
  }
}