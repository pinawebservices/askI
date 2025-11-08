'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase-client';
import InviteMemberModal from './invite-member-modal';
import ConfirmationModal from './confirmation-modal';
import CollapsibleSection from './collapsible-section';
import { useRouter } from 'next/navigation';

interface TeamPageProps {
  params: Promise<{
    clientId: string;
  }>;
}

interface TeamMember {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  invited_by: string | null;
  created_at: string;
  updated_at: string;
  invited_by_user?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

interface PendingInvitation {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  invited_by: string;
  status: string;
  expires_at: string;
  created_at: string;
  invited_by_user?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

interface SeatUsage {
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
  percentUsed: number;
}

export default function TeamPage({ params }: TeamPageProps) {
  const router = useRouter();
  const supabase = createClient();

  const [clientId, setClientId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<PendingInvitation[]>([]);
  const [removedUsers, setRemovedUsers] = useState<TeamMember[]>([]);
  const [seatUsage, setSeatUsage] = useState<SeatUsage | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');
  const [planType, setPlanType] = useState<string>('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [showRevokeConfirmation, setShowRevokeConfirmation] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ userId: string; name: string } | null>(null);
  const [invitationToRevoke, setInvitationToRevoke] = useState<{ invitationId: string; email: string } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showActiveMembers, setShowActiveMembers] = useState(true);
  const [showPendingInvitations, setShowPendingInvitations] = useState(true);
  const [showPreviousMembers, setShowPreviousMembers] = useState(false);
  const [userToReinvite, setUserToReinvite] = useState<{ email: string; firstName: string | null; lastName: string | null } | null>(null);

  // Resolve the promise for params
  useEffect(() => {
    params.then(p => setClientId(p.clientId));
  }, [params]);

  const loadTeamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/team/members');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load team data');
      }

      setMembers(data.members || []);
      setInvitations(data.invitations || []);
      setRemovedUsers(data.removedUsers || []);
      setSeatUsage(data.seatUsage || null);
      setCurrentUserId(data.currentUserId || '');
      setCurrentUserRole(data.currentUserRole || '');
      setOrganizationName(data.organization?.name || '');
      setPlanType(data.organization?.plan_type || '');

    } catch (error: any) {
      console.error('Error loading team data:', error);
      setError(error.message || 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      loadTeamData();
    }
  }, [clientId, loadTeamData]);

  const handleInviteSent = () => {
    setSuccessMessage('Invitation sent successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
    loadTeamData();
  };

  const handleRemoveMember = (userId: string, memberName: string) => {
    setMemberToRemove({ userId, name: memberName });
    setShowRemoveConfirmation(true);
  };

  const confirmRemoveMember = async () => {
    if (!memberToRemove) return;

    setIsRemoving(true);

    try {
      const response = await fetch('/api/team/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberToRemove.userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove member');
      }

      setShowRemoveConfirmation(false);
      setSuccessMessage(`${memberToRemove.name} has been removed. ${data.email ? `You can re-invite them at ${data.email}` : 'They can be re-invited if needed.'}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      loadTeamData();
    } catch (error: any) {
      setShowRemoveConfirmation(false);
      setError(error.message || 'Failed to remove member');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsRemoving(false);
      setMemberToRemove(null);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string, memberName: string) => {
    try {
      const response = await fetch('/api/team/update-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update role');
      }

      setSuccessMessage(`${memberName}'s role has been updated to ${newRole}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      loadTeamData();
    } catch (error: any) {
      setError(error.message || 'Failed to update role');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleRevokeInvitation = (invitationId: string, email: string) => {
    setInvitationToRevoke({ invitationId, email });
    setShowRevokeConfirmation(true);
  };

  const confirmRevokeInvitation = async () => {
    if (!invitationToRevoke) return;

    setIsRevoking(true);

    try {
      const response = await fetch('/api/team/revoke-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: invitationToRevoke.invitationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to revoke invitation');
      }

      setShowRevokeConfirmation(false);
      setSuccessMessage(`Invitation for ${invitationToRevoke.email} has been revoked`);
      setTimeout(() => setSuccessMessage(null), 5000);
      loadTeamData();
    } catch (error: any) {
      setShowRevokeConfirmation(false);
      setError(error.message || 'Failed to revoke invitation');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsRevoking(false);
      setInvitationToRevoke(null);
    }
  };

  const handleResendInvitation = async (invitationId: string, email: string) => {
    try {
      const response = await fetch('/api/team/resend-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend invitation');
      }

      setSuccessMessage(`Invitation resent to ${email}`);
      setTimeout(() => setSuccessMessage(null), 5000);
      loadTeamData();
    } catch (error: any) {
      setError(error.message || 'Failed to resend invitation');
      setTimeout(() => setError(null), 5000);
    }
  };

  const canInviteMembers = ['owner', 'admin'].includes(currentUserRole) && planType !== 'none';
  const canManageMembers = ['owner', 'admin'].includes(currentUserRole);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDisplayName = (member: TeamMember | PendingInvitation) => {
    if (member.first_name && member.last_name) {
      return `${member.first_name} ${member.last_name}`;
    }
    if (member.first_name) {
      return member.first_name;
    }
    return member.email;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Team</h1>
        <p className="mt-2 text-gray-600">
          Manage your team members and invitations for {organizationName}
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}

      {/* Seat Usage Card */}
      {seatUsage && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Seat Usage</h3>
              <p className="mt-1 text-sm text-gray-600">
                {seatUsage.isUnlimited ? (
                  <span>
                    <span className="font-semibold">{seatUsage.used}</span> members (Unlimited plan)
                  </span>
                ) : (
                  <span>
                    <span className="font-semibold">{seatUsage.used}</span> of{' '}
                    <span className="font-semibold">{seatUsage.limit}</span> seats used
                    {seatUsage.remaining > 0 && (
                      <span className="text-green-600 ml-2">
                        ({seatUsage.remaining} remaining)
                      </span>
                    )}
                    {seatUsage.remaining === 0 && (
                      <span className="text-red-600 ml-2">(No seats available)</span>
                    )}
                  </span>
                )}
              </p>
            </div>
            {canInviteMembers && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowInviteModal(true);
                }}
                disabled={!seatUsage.isUnlimited && seatUsage.remaining <= 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Invite Member
              </button>
            )}
          </div>
          {!seatUsage.isUnlimited && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    seatUsage.percentUsed >= 90
                      ? 'bg-red-600'
                      : seatUsage.percentUsed >= 75
                      ? 'bg-yellow-600'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${seatUsage.percentUsed}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Notice for Free Plan */}
      {planType === 'none' && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900">Upgrade to Add Team Members</h3>
          <p className="mt-2 text-sm text-blue-700">
            Team collaboration is available on our paid plans. Upgrade to start inviting team members!
          </p>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/${clientId}/subscription`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Plans
          </button>
        </div>
      )}

      {/* Team Members Section - Collapsible */}
      <CollapsibleSection
        title="Team Members"
        count={members.length}
        isOpen={showActiveMembers}
        onToggle={() => setShowActiveMembers(!showActiveMembers)}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              {canManageMembers && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {getDisplayName(member)}
                      {member.id === currentUserId && (
                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {canManageMembers && member.id !== currentUserId && currentUserRole === 'owner' ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.id, e.target.value, getDisplayName(member))}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(member.role)} border-0 cursor-pointer`}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(member.role)}`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(member.created_at)}
                </td>
                {canManageMembers && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {member.id !== currentUserId && (member.role !== 'owner' || currentUserRole === 'owner') && (
                      <button
                        onClick={() => handleRemoveMember(member.id, getDisplayName(member))}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection>

      {/* Pending Invitations Section - Collapsible */}
      {invitations.length > 0 && (
        <CollapsibleSection
          title="Pending Invitations"
          count={invitations.length}
          isOpen={showPendingInvitations}
          onToggle={() => setShowPendingInvitations(!showPendingInvitations)}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invited
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                {canManageMembers && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invitation.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(invitation.role)}`}>
                      {invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(invitation.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(invitation.expires_at)}
                  </td>
                  {canManageMembers && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleResendInvitation(invitation.id, invitation.email)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Resend
                      </button>
                      <button
                        onClick={() => handleRevokeInvitation(invitation.id, invitation.email)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Revoke
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>
      )}

      {/* Previous Team Members Section - Collapsible (Collapsed by default) */}
      {removedUsers.length > 0 && (
        <CollapsibleSection
          title="Previous Team Members"
          count={removedUsers.length}
          isOpen={showPreviousMembers}
          onToggle={() => setShowPreviousMembers(!showPreviousMembers)}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Removed
                </th>
                {canManageMembers && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {removedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 opacity-75">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getDisplayName(user)}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.updated_at)}
                  </td>
                  {canManageMembers && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setUserToReinvite({
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name
                          });
                          setShowInviteModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Re-invite
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <InviteMemberModal
          onClose={() => {
            setShowInviteModal(false);
            setUserToReinvite(null);
          }}
          onSuccess={handleInviteSent}
          currentUserRole={currentUserRole}
          prefillEmail={userToReinvite?.email}
          prefillFirstName={userToReinvite?.firstName || undefined}
          prefillLastName={userToReinvite?.lastName || undefined}
        />
      )}

      {/* Remove Member Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRemoveConfirmation}
        onClose={() => {
          setShowRemoveConfirmation(false);
          setMemberToRemove(null);
        }}
        onConfirm={confirmRemoveMember}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${memberToRemove?.name} from your team?\n\nThey will lose access to the dashboard, but you can re-invite them later if needed.`}
        confirmText="Remove Member"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isRemoving}
      />

      {/* Revoke Invitation Confirmation Modal */}
      <ConfirmationModal
        isOpen={showRevokeConfirmation}
        onClose={() => {
          setShowRevokeConfirmation(false);
          setInvitationToRevoke(null);
        }}
        onConfirm={confirmRevokeInvitation}
        title="Revoke Invitation"
        message={`Are you sure you want to revoke the invitation for ${invitationToRevoke?.email}?\n\nThe invitation link will no longer work and they will need to be invited again.`}
        confirmText="Revoke Invitation"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isLoading={isRevoking}
      />
    </div>
  );
}