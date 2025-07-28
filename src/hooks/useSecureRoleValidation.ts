
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent, validateSession } from '@/utils/securityUtils';

interface SecureRoleValidationResult {
  userRole: string | null;
  hasRole: (roles: string[]) => boolean;
  loading: boolean;
  error: string | null;
  refreshRole: () => Promise<void>;
  validateRole: (expectedRole: string) => boolean;
  validateSuperAdmin: () => boolean;
  isSuperAdmin: boolean;
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

      // Validate current session before proceeding
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !validateSession(session)) {
        setError('Invalid session');
        await logSecurityEvent('invalid_session', 'role_validation', { user_id: user.id }, false);
        return;
      }

      // Query role and super admin status directly from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_super_admin')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user role:', profileError);
        await logSecurityEvent('role_fetch_failed', 'database', { 
          error: profileError.message,
          user_id: user.id 
        }, false);
        setError('Failed to validate user role');
        return;
      }

      if (!profileData) {
        setError('User profile not found');
        await logSecurityEvent('profile_not_found', 'database', { user_id: user.id }, false);
        return;
      }

      // Use the role column for now, will be updated when schema is migrated
      const userRole = profileData.role;
      const superAdmin = profileData.is_super_admin || userRole === 'super_admin';

      // Set role and super admin status
      setRole(userRole || null);
      setIsSuperAdmin(superAdmin || false);

      // Log successful role validation
      await logSecurityEvent('role_validated', 'database', { 
        role: userRole,
        isSuperAdmin: superAdmin,
        user_id: user.id
      });

    } catch (err) {
      console.error('Unexpected error during role validation:', err);
      await logSecurityEvent('role_validation_error', 'system', { 
        error: String(err),
        user_id: user?.id
      }, false);
      setError('Unexpected error during role validation');
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles: string[]): boolean => {
    if (!role || !Array.isArray(roles) || roles.length === 0) {
      return false;
    }
    return roles.includes(role);
  };

  const validateRole = (expectedRole: string): boolean => {
    const isValid = role === expectedRole;
    if (!isValid) {
      logSecurityEvent('unauthorized_role_access', 'authorization', { 
        expectedRole, 
        actualRole: role,
        user_id: user?.id
      }, false);
    }
    return isValid;
  };

  const validateSuperAdmin = (): boolean => {
    if (!isSuperAdmin) {
      logSecurityEvent('unauthorized_admin_access', 'authorization', { 
        role, 
        isSuperAdmin,
        user_id: user?.id
      }, false);
    }
    return isSuperAdmin;
  };

  useEffect(() => {
    fetchRoleFromDatabase();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session && validateSession(session)) {
          fetchRoleFromDatabase();
        } else {
          setRole(null);
          setIsSuperAdmin(false);
          setError('Invalid session');
        }
      } else if (event === 'SIGNED_OUT') {
        setRole(null);
        setIsSuperAdmin(false);
        setLoading(false);
        setError(null);
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
    validateSuperAdmin,
    isSuperAdmin
  };
}
