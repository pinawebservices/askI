import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getSeatUsageInfo } from '@/lib/team/seat-limits';

export async function GET(request: Request) {
  try {
    // Get current user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user's organization and verify they're active
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('organization_id, role, status')
      .eq('id', user.id)
      .single();

    if (userError || !currentUser || !currentUser.organization_id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Additional safety check: ensure user is active
    if (currentUser.status !== 'active') {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact your administrator.' },
        { status: 403 }
      );
    }

    // Get organization details
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id, name, plan_type')
      .eq('id', currentUser.organization_id)
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Get all active users in the organization
    const { data: members, error: membersError } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, invited_by, created_at, updated_at')
      .eq('organization_id', organization.id)
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    // Get removed users (for previous team members section)
    const { data: removedUsers, error: removedUsersError } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, role, invited_by, created_at, updated_at')
      .eq('organization_id', organization.id)
      .eq('status', 'removed')
      .order('updated_at', { ascending: false });

    if (removedUsersError) {
      console.error('Error fetching removed users:', removedUsersError);
      // Don't fail the request, just continue without removed users
    }

    // Get pending invitations
    const { data: invitations, error: invitationsError } = await supabaseAdmin
      .from('invitations')
      .select('id, email, first_name, last_name, role, invited_by, status, expires_at, created_at')
      .eq('organization_id', organization.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return NextResponse.json(
        { error: 'Failed to fetch pending invitations' },
        { status: 500 }
      );
    }

    // Get inviter names for display
    const memberInviterIds = members?.map(m => m.invited_by).filter((id): id is string => id !== null) || [];
    const invitationInviterIds = invitations?.map(i => i.invited_by).filter((id): id is string => id !== null) || [];
    const removedUserInviterIds = removedUsers?.map(r => r.invited_by).filter((id): id is string => id !== null) || [];
    const inviterIds = Array.from(new Set([...memberInviterIds, ...invitationInviterIds, ...removedUserInviterIds]));

    let inviters: any[] = [];
    if (inviterIds.length > 0) {
      const { data: inviterData } = await supabaseAdmin
        .from('users')
        .select('id, first_name, last_name, email')
        .in('id', inviterIds);

      inviters = inviterData || [];
    }

    // Map inviter info to members and invitations
    const membersWithInviterInfo = members?.map(member => ({
      ...member,
      invited_by_user: member.invited_by
        ? inviters.find(i => i.id === member.invited_by)
        : null
    })) || [];

    const invitationsWithInviterInfo = invitations?.map(invitation => ({
      ...invitation,
      invited_by_user: invitation.invited_by
        ? inviters.find(i => i.id === invitation.invited_by)
        : null
    })) || [];

    const removedUsersWithInviterInfo = removedUsers?.map(removedUser => ({
      ...removedUser,
      invited_by_user: removedUser.invited_by
        ? inviters.find(i => i.id === removedUser.invited_by)
        : null
    })) || [];

    // Calculate seat usage
    const seatUsage = getSeatUsageInfo(
      organization.plan_type,
      members?.length || 0,
      invitations?.length || 0
    );

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        plan_type: organization.plan_type
      },
      members: membersWithInviterInfo,
      invitations: invitationsWithInviterInfo,
      removedUsers: removedUsersWithInviterInfo,
      seatUsage,
      currentUserId: user.id,
      currentUserRole: currentUser.role
    });

  } catch (error: any) {
    console.error('Error fetching team data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team data' },
      { status: 500 }
    );
  }
}