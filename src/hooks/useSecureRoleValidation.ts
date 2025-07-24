
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/securityUtils';

interface SecureRoleValidationResult {
  role: string | null;
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  refreshRole: () => Promise<void>;
  validateRole: (expectedRole: string) => boolean;
  validateSuperAdmin: () => boolean;
}

export function useSecureRoleValidation(): SecureRoleValidationResult {
  const [role, setRole] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoleFromDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRole(null);
        setIsSuperAdmin(false);
        return;
      }

      // Query role directly from database to prevent tampering
      const { data: roleData, error: roleError } = await supabase
        .rpc('get_user_role', { user_id: user.id });

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        await logSecurityEvent('role_fetch_failed', 'database', { error: roleError.message }, false);
        setError('Failed to validate user role');
        return;
      }

      // Query super admin status directly from database
      const { data: superAdminData, error: superAdminError } = await supabase
        .rpc('is_super_admin', { user_id: user.id });

      if (superAdminError) {
        console.error('Error fetching super admin status:', superAdminError);
        await logSecurityEvent('super_admin_check_failed', 'database', { error: superAdminError.message }, false);
        setError('Failed to validate admin status');
        return;
      }

      setRole(roleData);
      setIsSuperAdmin(Boolean(superAdminData));

      // Log successful role validation
      await logSecurityEvent('role_validated', 'database', { 
        role: roleData, 
        isSuperAdmin: Boolean(superAdminData) 
      });

    } catch (err) {
      console.error('Unexpected error during role validation:', err);
      await logSecurityEvent('role_validation_error', 'system', { error: String(err) }, false);
      setError('Unexpected error during role validation');
    } finally {
      setIsLoading(false);
    }
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
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    role,
    isSuperAdmin,
    isLoading,
    error,
    refreshRole: fetchRoleFromDatabase,
    validateRole,
    validateSuperAdmin
  };
}
