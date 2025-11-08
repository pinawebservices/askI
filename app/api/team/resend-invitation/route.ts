import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { invitationId } = await request.json();

    // Validate input
    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user's organization and role
    const { data: currentUser, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUser || !currentUser.role) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to resend invitations (only owner or admin)
    if (!['owner', 'admin'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to resend invitations' },
        { status: 403 }
      );
    }

    // Get the invitation
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .select('id, organization_id, email, first_name, last_name, role, status')
      .eq('id', invitationId)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Verify the invitation belongs to the same organization
    if (invitation.organization_id !== currentUser.organization_id) {
      return NextResponse.json(
        { error: 'Invitation does not belong to your organization' },
        { status: 403 }
      );
    }

    // Check if invitation is pending or expired (can only resend these)
    if (!['pending', 'expired'].includes(invitation.status)) {
      return NextResponse.json(
        { error: `Cannot resend invitation with status: ${invitation.status}` },
        { status: 400 }
      );
    }

    // Check if email is already a user (in case they signed up in the meantime)
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('organization_id', invitation.organization_id)
      .eq('email', invitation.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'This user has already joined your organization' },
        { status: 400 }
      );
    }

    // Mark old invitation as revoked
    const { error: revokeError } = await supabaseAdmin
      .from('invitations')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', invitationId);

    if (revokeError) {
      console.error('Error revoking old invitation:', revokeError);
      return NextResponse.json(
        { error: 'Failed to revoke old invitation' },
        { status: 500 }
      );
    }

    // Send new invitation via Supabase Auth
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!siteUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
    }

    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      invitation.email,
      {
        data: {
          organization_id: invitation.organization_id,
          invited_by: user.id,
          role: invitation.role,
          first_name: invitation.first_name,
          last_name: invitation.last_name,
        },
        redirectTo: `${siteUrl}/auth/accept-invite`
      }
    );

    if (inviteError) {
      console.error('Supabase invite error:', inviteError);
      return NextResponse.json(
        { error: `Failed to send invitation: ${inviteError.message}` },
        { status: 500 }
      );
    }

    // Create new invitation record
    const { data: newInvitation, error: insertError } = await supabaseAdmin
      .from('invitations')
      .insert({
        organization_id: invitation.organization_id,
        invited_by: user.id,
        email: invitation.email,
        role: invitation.role,
        first_name: invitation.first_name,
        last_name: invitation.last_name,
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to store new invitation:', insertError);
      // Email was sent but record wasn't stored - logged but not fatal
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation resent successfully',
      invitation: newInvitation
    });

  } catch (error: any) {
    console.error('Error resending invitation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to resend invitation' },
      { status: 500 }
    );
  }
}