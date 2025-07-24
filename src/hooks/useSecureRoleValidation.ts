
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/securityUtils';

interface SecureRoleValidationResult {
  userRole: string | null;
  hasRole: (roles: string[]) => boolean;
  loading: boolean;
  error: string | null;
  refreshRole: () => Promise<void>;
  validateRole: (expectedRole: string) => boolean;
  validateSuperAdmin: () => boolean;
}

export function useSecureRoleValidation(user: User | null): SecureRoleValidationResult {
  const [role, setRole] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoleFromDatabase = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        setRole(null);
        setIsSuperAdmin(false);
        return;
      }

      // Query role directly from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user role:', profileError);
        await logSecurityEvent('role_fetch_failed', 'database', { error: profileError.message }, false);
        setError('Failed to validate user role');
        return;
      }

      // For now, assume no super admin functionality
      setRole(profileData?.role || null);
      setIsSuperAdmin(false);

      // Log successful role validation
      await logSecurityEvent('role_validated', 'database', { 
        role: profileData?.role, 
        isSuperAdmin: false 
      });

    } catch (err) {
      console.error('Unexpected error during role validation:', err);
      await logSecurityEvent('role_validation_error', 'system', { error: String(err) }, false);
      setError('Unexpected error during role validation');
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles: string[]): boolean => {
    return role ? roles.includes(role) : false;
  };

  const validateRole = (expectedRole: string): boolean => {
    const isValid = role === expectedRole;
    if (!isValid) {
      logSecurityEvent('unauthorized_role_access', 'authorization', { 
        expectedRole, 
        actualRole: role 
      }, false);
    }
    return isValid;
  };

  const validateSuperAdmin = (): boolean => {
    if (!isSuperAdmin) {
      logSecurityEvent('unauthorized_admin_access', 'authorization', { 
        role, 
        isSuperAdmin 
      }, false);
    }
    return isSuperAdmin;
  };

  useEffect(() => {
    fetchRoleFromDatabase();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchRoleFromDatabase();
      } else if (event === 'SIGNED_OUT') {
        setRole(null);
        setIsSuperAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [user]);

  return {
    userRole: role,
    hasRole,
    loading,
    error,
    refreshRole: fetchRoleFromDatabase,
    validateRole,
    validateSuperAdmin
  };
}
