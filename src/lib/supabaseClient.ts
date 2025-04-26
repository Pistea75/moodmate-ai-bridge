
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://otrhbyzjrhsqrltdedon.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cmhieXpqcmhzcXJsdGRlZG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDA1NDgsImV4cCI6MjA2MTA3NjU0OH0.fYYYcmUDiG7GYVy_zH0xKyo1JGDqxrAVWfCD_pptkhU";

export const supabaseClient = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: localStorage
    }
  }
);
