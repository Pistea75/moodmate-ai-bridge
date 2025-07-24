
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserRole {
  role: string;
  is_super_admin: boolean;
}

export function useSecureRoleValidation(user: User | null) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = useCallback(async () => {
    if (!user) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch role directly from profiles table (secure)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_super_admin')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      setUserRole({
        role: profile.role,
        is_super_admin: profile.is_super_admin || false
      });
    } catch (err: any) {
      console.error('Error fetching user role:', err);
      setError(err.message || 'Failed to verify user role');
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  const hasRole = useCallback((requiredRole: string | string[]): boolean => {
    if (!userRole) return false;
    
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return allowedRoles.includes(userRole.role);
  }, [userRole]);

  const isSuperAdmin = useCallback((): boolean => {
    return userRole?.is_super_admin === true;
  }, [userRole]);

  const refreshRole = useCallback(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  return {
    userRole: userRole?.role || null,
    isSuperAdmin: userRole?.is_super_admin || false,
    hasRole,
    isSuperAdmin: isSuperAdmin,
    loading,
    error,
    refreshRole
  };
}
