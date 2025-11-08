import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { userId, newRole } = await request.json();

    // Validate input
    if (!userId || !newRole) {
      return NextResponse.json(
        { error: 'User ID and new role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['member', 'admin', 'owner'].includes(newRole)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "member", "admin", or "owner"' },
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

    // Prevent users from changing their own role
    if (userId === user.id) {
      return NextResponse.json(
        { error: 'You cannot change your own role' },
        { status: 400 }
      );
    }

    // Get current user's organization and role
    const { data: currentUser, error: currentUserError } = await supabaseAdmin
      .from('users')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (currentUserError || !currentUser || !currentUser.organization_id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the user whose role is being changed
    const { data: userToUpdate, error: userToUpdateError } = await supabaseAdmin
      .from('users')
      .select('id, organization_id, role, email')
      .eq('id', userId)
      .single();

    if (userToUpdateError || !userToUpdate) {
      return NextResponse.json(
        { error: 'User to update not found' },
        { status: 404 }
      );
    }

    // Verify the user belongs to the same organization
    if (userToUpdate.organization_id !== currentUser.organization_id) {
      return NextResponse.json(
        { error: 'User does not belong to your organization' },
        { status: 403 }
      );
    }

    // Permission checks based on current user role
    if (currentUser.role === 'owner') {
      // Owners can change anyone's role, but need special checks for owner transfers
      if (newRole === 'owner') {
        // If promoting someone to owner, this is a transfer/share scenario
        // Allow it, but typically you'd want to notify the current owner
      }

      // If demoting an owner, check if there are other owners
      if (userToUpdate.role === 'owner' && newRole !== 'owner') {
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

        // Prevent demoting the last owner
        if (!owners || owners.length <= 1) {
          return NextResponse.json(
            { error: 'Cannot demote the last owner. Promote another user to owner first.' },
            { status: 400 }
          );
        }
      }
    } else if (currentUser.role === 'admin') {
      // Admins can only change member roles to member or admin
      // They cannot promote to owner or change owner/admin roles
      if (userToUpdate.role === 'owner') {
        return NextResponse.json(
          { error: 'Only owners can change owner roles' },
          { status: 403 }
        );
      }

      if (userToUpdate.role === 'admin') {
        return NextResponse.json(
          { error: 'Only owners can change administrator roles' },
          { status: 403 }
        );
      }

      if (newRole === 'owner') {
        return NextResponse.json(
          { error: 'Only owners can promote users to owner' },
          { status: 403 }
        );
      }

      if (newRole === 'admin') {
        return NextResponse.json(
          { error: 'Only owners can promote users to administrator' },
          { status: 403 }
        );
      }
    } else {
      // Members cannot change roles
      return NextResponse.json(
        { error: 'You do not have permission to change user roles' },
        { status: 403 }
      );
    }

    // Update the user's role
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${newRole} successfully`
    });

  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user role' },
      { status: 500 }
    );
  }
}