import { useState, useCallback } from 'react';
import type { User, MembershipStatus } from '../types';
import { apiService } from '../services/api';

export const useMembership = (user: User | null) => {
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus | null>(null);

  const fetchMembershipStatus = useCallback(async () => {
    if (!user?.token) {
      setMembershipStatus(null);
      return;
    }

    try {
      const status = await apiService.getMembershipStatus(user.token);
      setMembershipStatus(status);
    } catch (error) {
      console.error('Error fetching membership status:', error);
      setMembershipStatus(null);
    }
  }, [user?.token]);

  return {
    membershipStatus,
    fetchMembershipStatus
  };
};