import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PsychologistProfile {
  id: string;
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
  created_at: string;
  updated_at: string;
}

export interface MarketplaceFilters {
  specialization?: string;
  language?: string;
  minRate?: number;
  maxRate?: number;
  country?: string;
  experienceYears?: number;
  search?: string;
}

export function usePsychologistMarketplace() {
  const { user } = useAuth();
  const [psychologists, setPsychologists] = useState<PsychologistProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MarketplaceFilters>({});

  const fetchPsychologists = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('psychologist_profiles')
        .select('*')
        .eq('is_visible_marketplace', true)
        .eq('is_accepting_patients', true);

      // Apply filters
      if (filters.specialization) {
        query = query.contains('specializations', [filters.specialization]);
      }

      if (filters.language) {
        query = query.contains('languages', [filters.language]);
      }

      if (filters.minRate !== undefined) {
        query = query.gte('hourly_rate', filters.minRate);
      }

      if (filters.maxRate !== undefined) {
        query = query.lte('hourly_rate', filters.maxRate);
      }

      if (filters.country) {
        query = query.eq('country', filters.country);
      }

      if (filters.experienceYears !== undefined) {
        query = query.gte('experience_years', filters.experienceYears);
      }

      if (filters.search) {
        query = query.or(`display_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      setPsychologists(data || []);
    } catch (err) {
      console.error('Error fetching psychologists:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch psychologists');
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<MarketplaceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  useEffect(() => {
    fetchPsychologists();
  }, [user, filters]);

  return {
    psychologists,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchPsychologists
  };
}