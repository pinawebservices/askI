/**
 * Seat limit configuration for different plan types
 * -1 means unlimited seats
 */
export const SEAT_LIMITS = {
  none: 1,      // Owner only (free plan - no team members allowed)
  basic: 10,    // Owner + 9 team members
  pro: 20,      // Owner + 19 team members
  premium: -1   // Unlimited seats
} as const;

export type PlanType = keyof typeof SEAT_LIMITS;

/**
 * Get the seat limit for a given plan type
 */
export function getSeatLimit(planType: string): number {
  return SEAT_LIMITS[planType as PlanType] ?? SEAT_LIMITS.none;
}

/**
 * Check if a plan allows team invitations
 */
export function canInviteTeamMembers(planType: string): boolean {
  const limit = getSeatLimit(planType);
  return limit !== 1; // Only 'none' plan has limit of 1
}

/**
 * Check if organization has available seats
 * @param planType - Organization's plan type
 * @param currentUserCount - Current number of active users
 * @param pendingInvitationCount - Number of pending invitations
 * @returns true if seats are available, false otherwise
 */
export function hasAvailableSeats(
  planType: string,
  currentUserCount: number,
  pendingInvitationCount: number
): boolean {
  const limit = getSeatLimit(planType);

  // Unlimited seats
  if (limit === -1) {
    return true;
  }

  const totalUsedSeats = currentUserCount + pendingInvitationCount;
  return totalUsedSeats < limit;
}

/**
 * Get remaining seats for an organization
 * @returns number of remaining seats, or -1 for unlimited
 */
export function getRemainingSeats(
  planType: string,
  currentUserCount: number,
  pendingInvitationCount: number
): number {
  const limit = getSeatLimit(planType);

  // Unlimited seats
  if (limit === -1) {
    return -1;
  }

  const totalUsedSeats = currentUserCount + pendingInvitationCount;
  const remaining = limit - totalUsedSeats;
  return Math.max(0, remaining);
}

/**
 * Get seat usage information for display
 */
export function getSeatUsageInfo(
  planType: string,
  currentUserCount: number,
  pendingInvitationCount: number
): {
  used: number;
  limit: number;
  remaining: number;
  isUnlimited: boolean;
  percentUsed: number;
} {
  const limit = getSeatLimit(planType);
  const isUnlimited = limit === -1;
  const used = currentUserCount + pendingInvitationCount;
  const remaining = isUnlimited ? -1 : Math.max(0, limit - used);
  const percentUsed = isUnlimited ? 0 : Math.min(100, (used / limit) * 100);

  return {
    used,
    limit,
    remaining,
    isUnlimited,
    percentUsed
  };
}