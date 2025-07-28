
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PHIAccessRequest {
  patient_id: string;
  access_type: 'read_chat_logs' | 'read_session_notes' | 'read_mood_entries' | 'read_reports';
  reason: 'legal_compliance' | 'user_request' | 'escalated_support' | 'system_debug';
  justification: string;
  expires_hours?: number;
}

export interface PHIAccessLog {
  id: string;
  admin_id: string;
  patient_id: string;
  accessed_table: string;
  access_reason: string;
  justification: string;
  created_at: string;
  environment: string;
}

export function useSuperAdmin() {
  const { user } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [phiAccessLogs, setPhiAccessLogs] = useState<PHIAccessLog[]>([]);

  // Check if current user is super admin
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_super_admin, user_role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setIsSuperAdmin(data?.is_super_admin || data?.user_role === 'super_admin');
      } catch (error) {
        console.error('Error checking super admin status:', error);
        setIsSuperAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkSuperAdminStatus();
  }, [user]);

  // Request PHI access with proper justification
  const requestPHIAccess = async (request: PHIAccessRequest) => {
    if (!user || !isSuperAdmin) {
      toast.error('Unauthorized: Super admin access required');
      return false;
    }

    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (request.expires_hours || 1));

      const { error } = await supabase
        .from('phi_access_permissions')
        .insert({
          admin_id: user.id,
          patient_id: request.patient_id,
          access_type: request.access_type,
          reason: request.reason,
          justification: request.justification,
          expires_at: expiresAt.toISOString(),
          granted_by: user.id,
          environment: process.env.NODE_ENV || 'production'
        });

      if (error) throw error;

      // Log the PHI access request
      await supabase.rpc('log_phi_access', {
        _admin_id: user.id,
        _patient_id: request.patient_id,
        _table_name: request.access_type,
        _reason: request.reason,
        _justification: request.justification
      });

      toast.success('PHI access granted and logged');
      return true;
    } catch (error) {
      console.error('Error requesting PHI access:', error);
      toast.error('Failed to request PHI access');
      return false;
    }
  };

  // Get PHI access logs for audit
  const fetchPHIAccessLogs = async () => {
    if (!user || !isSuperAdmin) return;

    try {
      const { data, error } = await supabase
        .from('phi_access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setPhiAccessLogs(data || []);
    } catch (error) {
      console.error('Error fetching PHI access logs:', error);
      toast.error('Failed to fetch PHI access logs');
    }
  };

  // Disable user account
  const disableUser = async (userId: string, reason: string) => {
    if (!user || !isSuperAdmin) {
      toast.error('Unauthorized: Super admin access required');
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', userId);

      if (error) throw error;

      // Log the action
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: user.id,
          action: 'disable_user',
          target_user_id: userId,
          metadata: { reason }
        });

      toast.success('User account disabled');
      return true;
    } catch (error) {
      console.error('Error disabling user:', error);
      toast.error('Failed to disable user account');
      return false;
    }
  };

  // Enable user account
  const enableUser = async (userId: string, reason: string) => {
    if (!user || !isSuperAdmin) {
      toast.error('Unauthorized: Super admin access required');
      return false;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .eq('id', userId);

      if (error) throw error;

      // Log the action
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: user.id,
          action: 'enable_user',
          target_user_id: userId,
          metadata: { reason }
        });

      toast.success('User account enabled');
      return true;
    } catch (error) {
      console.error('Error enabling user:', error);
      toast.error('Failed to enable user account');
      return false;
    }
  };

  // Link patient to clinician
  const linkPatientToClinician = async (patientId: string, clinicianId: string) => {
    if (!user || !isSuperAdmin) {
      toast.error('Unauthorized: Super admin access required');
      return false;
    }

    try {
      const { error } = await supabase
        .from('patient_clinician_links')
        .insert({
          patient_id: patientId,
          clinician_id: clinicianId
        });

      if (error) throw error;

      // Log the action
      await supabase
        .from('admin_logs')
        .insert({
          admin_id: user.id,
          action: 'link_patient_clinician',
          target_user_id: patientId,
          metadata: { clinician_id: clinicianId }
        });

      toast.success('Patient linked to clinician');
      return true;
    } catch (error) {
      console.error('Error linking patient to clinician:', error);
      toast.error('Failed to link patient to clinician');
      return false;
    }
  };

  return {
    isSuperAdmin,
    loading,
    phiAccessLogs,
    requestPHIAccess,
    fetchPHIAccessLogs,
    disableUser,
    enableUser,
    linkPatientToClinician
  };
}
