import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { hasAvailableSeats, canInviteTeamMembers } from '@/lib/team/seat-limits';
import { resend } from '@/lib/resend';
import { getReInviteEmailHtml, getReInviteEmailText } from '@/lib/emails/team-invite';

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, role } = await request.json();

    // Validate input
    if (!email || !role) {
      return NextResponse.json(
        { error: 'Email and role are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate role (only member or admin can be invited)
    if (!['member', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "member" or "admin"' },
        { status: 400 }
      );
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

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
    const { data: currentUser, error: userError } = await supabaseAdmin
      .from('users')
      .select('organization_id, role')
      .eq('id', user.id)
      .single();

    if (userError || !currentUser || !currentUser.role || !currentUser.organization_id) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to invite (only owner or admin)
    if (!['owner', 'admin'].includes(currentUser.role)) {
      return NextResponse.json(
        { error: 'You do not have permission to invite team members' },
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

    // Check if organization plan allows team members
    if (!canInviteTeamMembers(organization.plan_type)) {
      return NextResponse.json(
        { error: 'Your plan does not support team members. Please upgrade to add team members.' },
        { status: 403 }
      );
    }

    // Check if email exists in this organization (including removed users)
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, email, status, role, first_name, last_name')
      .eq('organization_id', organization.id)
      .eq('email', normalizedEmail)
      .single();

    // If user exists and is active, they're already a member
    if (existingUser && existingUser.status === 'active') {
      return NextResponse.json(
        { error: 'This user is already a member of your organization' },
        { status: 400 }
      );
    }

    // If user exists but is removed, we'll reactivate them
    const isReactivating = existingUser && existingUser.status === 'removed';

    // Check if there's already a pending or revoked invitation for this email
    const { data: existingInvitation } = await supabaseAdmin
      .from('invitations')
      .select('id, status')
      .eq('organization_id', organization.id)
      .eq('email', normalizedEmail)
      .in('status', ['pending', 'revoked'])
      .single();

    // If there's a pending invitation, don't allow duplicate
    if (existingInvitation && existingInvitation.status === 'pending') {
      return NextResponse.json(
        { error: 'An invitation has already been sent to this email address' },
        { status: 400 }
      );
    }

    // If there's a revoked invitation, we need to delete the old Auth account
    // so we can send a fresh invitation (keep the revoked record for tracking)
    if (existingInvitation && existingInvitation.status === 'revoked') {
      // Try to find and delete the old Auth user account
      const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
      const oldAuthUser = authUsers?.users?.find(u => u.email === normalizedEmail);

      if (oldAuthUser) {
        const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(oldAuthUser.id);

        if (deleteAuthError) {
          console.error('Error deleting old auth account for revoked invitation:', deleteAuthError);
          // Continue anyway - we'll try to send the invitation
        }
      }
    }

    // Get current active user count and pending invitation count for seat limit check
    const { count: userCount } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization.id)
      .eq('status', 'active');

    const { count: pendingInvitationCount } = await supabaseAdmin
      .from('invitations')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organization.id)
      .eq('status', 'pending');

    // Check seat availability (don't count against limit if reactivating)
    const effectiveUserCount = isReactivating ? (userCount || 0) : (userCount || 0) + 1;
    if (!hasAvailableSeats(organization.plan_type, effectiveUserCount - 1, pendingInvitationCount || 0)) {
      return NextResponse.json(
        { error: 'You have reached your seat limit. Please upgrade your plan or remove existing members.' },
        { status: 403 }
      );
    }

    // Handle reactivation or new invitation
    if (isReactivating && existingUser) {
      // Reactivate the removed user in database
      const { error: reactivateError } = await supabaseAdmin
        .from('users')
        .update({
          status: 'active',
          role: role, // Update role to new role
          first_name: firstName || existingUser.first_name || null,
          last_name: lastName || existingUser.last_name || null,
          invited_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id);

      if (reactivateError) {
        console.error('Failed to reactivate user:', reactivateError);
        return NextResponse.json(
          { error: 'Failed to reactivate user' },
          { status: 500 }
        );
      }

      // Unban the Supabase Auth account so they can log in again
      const { error: unbanAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          ban_duration: 'none', // Remove the ban
        }
      );

      if (unbanAuthError) {
        console.error('Failed to unban auth account:', unbanAuthError);
        // Continue anyway - user is marked as active in DB
      }

      // Generate password reset token for re-invited user
      const siteUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!siteUrl) {
        throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
      }

      const { data: resetLinkData, error: resetLinkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: normalizedEmail,
      });

      if (resetLinkError || !resetLinkData) {
        console.error('Failed to generate password reset link:', resetLinkError);
        return NextResponse.json(
          { error: 'Failed to generate password reset link' },
          { status: 500 }
        );
      }

      // Extract the hashed token from the generated link
      const hashedToken = resetLinkData.properties.hashed_token;

      // Build the reset URL in the same format as Supabase password reset email template
      // Format: {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=recovery&redirect_to={{ .SiteURL }}/reset-password
      const resetLink = `${siteUrl}/auth/callback?token_hash=${hashedToken}&type=recovery&redirect_to=${siteUrl}/reset-password`;

      // Send custom re-invite email via Resend
      try {
        const recipientName = firstName || existingUser.first_name || undefined;

        await resend.emails.send({
          from: 'WidgetWise <noreply@notifications.aiwidgetwise.com>',
          to: normalizedEmail,
          subject: `Welcome Back to ${organization.name}!`,
          html: getReInviteEmailHtml({
            organizationName: organization.name,
            resetLink: resetLink,
            recipientName: recipientName
          }),
          text: getReInviteEmailText({
            organizationName: organization.name,
            resetLink: resetLink,
            recipientName: recipientName
          })
        });
      } catch (emailError: any) {
        console.error('Failed to send re-invite email:', emailError);
        return NextResponse.json(
          { error: 'Failed to send re-invite email. User has been reactivated but did not receive the email.' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `User re-invited successfully. They have been reactivated with ${role} role and will receive an email to reset their password.`,
        reactivated: true
      });
    }

    // For new users: Send invitation via Supabase Auth
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!siteUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
    }

    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      normalizedEmail,
      {
        data: {
          organization_id: organization.id,
          invited_by: user.id,
          role: role,
          first_name: firstName || null,
          last_name: lastName || null,
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

    // Store new invitation in database
    const { data: invitation, error: insertError } = await supabaseAdmin
      .from('invitations')
      .insert({
        organization_id: organization.id,
        invited_by: user.id,
        email: normalizedEmail,
        role: role,
        first_name: firstName || null,
        last_name: lastName || null,
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to store invitation:', insertError);
      // Note: Invitation email was sent but record wasn't stored
      // This is logged but not considered a fatal error
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully',
      invitation: invitation
    });

  } catch (error: any) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send invitation' },
      { status: 500 }
    );
  }
}