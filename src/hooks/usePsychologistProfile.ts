import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface PsychologistProfileData {
  id?: string;
  user_id: string;
  display_name: string;
  bio: string;
  specializations: string[];
  languages: string[];
  experience_years: number;
  hourly_rate: number;
  country: string;
  region: string;
  is_accepting_patients: boolean;
  is_visible_marketplace: boolean;
}

export function usePsychologistProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<PsychologistProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('psychologist_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      } else {
        // Initialize with default values if no profile exists
        setProfile({
          user_id: user.id,
          display_name: '',
          bio: '',
          specializations: [],
          languages: [],
          experience_years: 0,
          hourly_rate: 0,
          country: '',
          region: '',
          is_accepting_patients: false,
          is_visible_marketplace: false,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData: PsychologistProfileData) => {
    if (!user) return false;

    try {
      setSaving(true);
      
      if (profile?.id) {
        // Update existing profile
        const { error } = await supabase
          .from('psychologist_profiles')
          .update(profileData)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { data, error } = await supabase
          .from('psychologist_profiles')
          .insert([profileData])
          .select()
          .single();

        if (error) throw error;
        setProfile(data);
      }

      toast({
        title: "Success",
        description: "Profile saved successfully"
      });
      
      await fetchProfile(); // Refresh the profile
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    saving,
    saveProfile,
    refetch: fetchProfile
  };
}