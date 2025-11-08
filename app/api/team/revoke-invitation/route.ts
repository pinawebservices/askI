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

    // Check if user has permission to revoke invitations (only owner or admin)
    if (!['owner', 'admin'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to revoke invitations' },
        { status: 403 }
      );
    }

    // Get the invitation
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('invitations')
      .select('id, organization_id, email, status')
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

    // Check if invitation is already accepted, expired, or revoked
    if (invitation.status !== 'pending') {
      return NextResponse.json(
        { error: `Cannot revoke invitation with status: ${invitation.status}` },
        { status: 400 }
      );
    }

    // Update invitation status to revoked
    const { error: updateError } = await supabaseAdmin
      .from('invitations')
      .update({
        status: 'revoked',
        revoked_at: new Date().toISOString(),
        revoked_by: user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', invitationId);

    if (updateError) {
      console.error('Error revoking invitation:', updateError);
      return NextResponse.json(
        { error: 'Failed to revoke invitation' },
        { status: 500 }
      );
    }

    // Delete the Supabase Auth user account for the invited email
    // This ensures they can't use the invitation link and cleans up orphaned accounts
    try {
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const authUser = authUsers?.users?.find(u => u.email === invitation.email);

      if (authUser) {
        const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(authUser.id);

        if (deleteAuthError) {
          console.error('Error deleting auth account for revoked invitation:', deleteAuthError);
          // Don't fail the request - invitation is already marked as revoked
        }
      }
    } catch (authError) {
      console.error('Error cleaning up auth account:', authError);
      // Don't fail the request - invitation is already marked as revoked
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation revoked successfully'
    });

  } catch (error: any) {
    console.error('Error revoking invitation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revoke invitation' },
      { status: 500 }
    );
  }
}