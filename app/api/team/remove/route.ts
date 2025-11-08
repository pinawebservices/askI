import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { resend } from '@/lib/resend';
import { getAccountDeactivationEmailHtml, getAccountDeactivationEmailText } from '@/lib/emails/team-invite';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Validate input
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    // Prevent users from removing themselves
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot remove yourself. Please contact an administrator.' },
        { status: 400 }
      );
    }

    // Get current user's organization and role
    const { data: currentUser, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUser || !currentUser.role || !currentUser.organization_id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to remove members (only owner or admin)
    if (!['owner', 'admin'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to remove team members' },
        { status: 403 }
      );
    }

    // Get the user to be removed
    const { data: userToRemove, error: userToRemoveError } = await supabaseAdmin
      .from('users')
      .select('id, organization_id, role, email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userToRemoveError || !userToRemove) {
      return NextResponse.json(
        { error: 'User to remove not found' },
        { status: 404 }
      );
    }

    // Verify the user belongs to the same organization
    if (userToRemove.organization_id !== currentUser.organization_id) {
      return NextResponse.json(
        { error: 'User does not belong to your organization' },
        { status: 403 }
      );
    }

    // Check if trying to remove an owner
    if (userToRemove.role === 'owner') {
      // Check if there are other owners
      const { data: owners, error: ownersError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('organization_id', currentUser.organization_id)
        .eq('role', 'owner');

      if (ownersError) {
        console.error('Error checking owners:', ownersError);
        return NextResponse.json(
          { error: 'Failed to verify ownership' },
          { status: 500 }
        );
      }

      // Prevent removing the last owner
      if (!owners || owners.length <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last owner. Transfer ownership first or delete the organization.' },
          { status: 400 }
        );
      }
    }

    // Only owners can remove admins
    if (userToRemove.role === 'admin' && currentUser.role !== 'owner') {
      return NextResponse.json(
        { error: 'Only owners can remove administrators' },
        { status: 403 }
      );
    }

    // Soft delete: Mark user as 'removed' instead of deleting
    const { error: updateUserError } = await supabaseAdmin
      .from('users')
      .update({
        status: 'removed',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateUserError) {
      console.error('Error marking user as removed:', updateUserError);
      return NextResponse.json(
        { error: 'Failed to remove user' },
        { status: 500 }
      );
    }

    // Ban the Supabase Auth account so they can't log in
    // Set ban until year 2099 (effectively permanent until re-invited)
    // Note: Banning automatically invalidates all existing sessions
    const { error: banAuthError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        ban_duration: '876000h', // 100 years in hours
      }
    );

    if (banAuthError) {
      console.error('Error banning auth account:', banAuthError);
      // Continue anyway - user is marked as removed in DB which is the main gate
    }

    // Get organization name for the email
    const { data: organization } = await supabaseAdmin
      .from('organizations')
      .select('name')
      .eq('id', currentUser.organization_id)
      .single();

    // Send deactivation notification email
    if (organization) {
      try {
        const recipientName = userToRemove.first_name || undefined;

        await resend.emails.send({
          from: 'WidgetWise <noreply@notifications.aiwidgetwise.com>',
          to: userToRemove.email,
          subject: 'Your WidgetWise Account Has Been Deactivated',
          html: getAccountDeactivationEmailHtml({
            organizationName: organization.name,
            recipientName: recipientName
          }),
          text: getAccountDeactivationEmailText({
            organizationName: organization.name,
            recipientName: recipientName
          })
        });
      } catch (emailError: any) {
        console.error('Failed to send deactivation email:', emailError);
        // Don't fail the request if email fails - user is already removed
      }
    }

    return NextResponse.json({
      success: true,
      message: `User removed successfully. They can be re-invited if needed.`,
      email: userToRemove.email
    });

  } catch (error: any) {
    console.error('Error removing user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove user' },
      { status: 500 }
    );
  }
}