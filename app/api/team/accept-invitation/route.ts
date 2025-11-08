import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server-client';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const {
      userId,
      email,
      firstName,
      lastName,
      role,
      organizationId,
      invitedBy,
      invitationId
    } = await request.json();

    // Validate required fields
    if (!userId || !email || !role || !organizationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify invitation is still pending
    if (invitationId) {
      const { data: invitation, error: invitationError } = await supabaseAdmin
        .from('invitations')
        .select('status')
        .eq('id', invitationId)
        .single();

      if (invitationError || !invitation) {
        return NextResponse.json(
          { error: 'Invitation not found' },
          { status: 404 }
        );
      }

      if (invitation.status !== 'pending') {
        return NextResponse.json(
          { error: `Cannot accept invitation with status: ${invitation.status}` },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user record
    const { error: createUserError } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email: email.toLowerCase(),
        first_name: firstName || null,
        last_name: lastName || null,
        role: role,
        organization_id: organizationId,
        invited_by: invitedBy || null,
        status: 'active'
      });

    if (createUserError) {
      console.error('Error creating user:', createUserError);
      return NextResponse.json(
        { error: 'Failed to create user record' },
        { status: 500 }
      );
    }

    // Update invitation status to accepted
    if (invitationId) {
      const { error: updateInvitationError } = await supabaseAdmin
        .from('invitations')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', invitationId);

      if (updateInvitationError) {
        console.error('Error updating invitation:', updateInvitationError);
        // Don't fail the request if invitation update fails
        // User was created successfully which is the main goal
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation accepted successfully'
    });

  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}