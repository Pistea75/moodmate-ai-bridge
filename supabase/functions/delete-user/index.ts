import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    console.log(`Deleting user: ${userId}`);

    // Delete all related records first (in order to avoid foreign key conflicts)
    
    // 1. Delete patient-clinician links
    await supabase.from('patient_clinician_links').delete().or(`patient_id.eq.${userId},clinician_id.eq.${userId}`);
    
    // 2. Delete mood entries
    await supabase.from('mood_entries').delete().eq('patient_id', userId);
    
    // 3. Delete AI chat logs
    await supabase.from('ai_chat_logs').delete().eq('patient_id', userId);
    
    // 4. Delete exercise logs
    await supabase.from('exercise_logs').delete().eq('patient_id', userId);
    
    // 5. Delete session ratings
    await supabase.from('session_ratings').delete().or(`patient_id.eq.${userId},psychologist_id.eq.${userId}`);
    
    // 6. Delete sessions
    await supabase.from('sessions').delete().or(`patient_id.eq.${userId},clinician_id.eq.${userId}`);
    
    // 7. Delete session inquiries
    await supabase.from('session_inquiries').delete().or(`patient_id.eq.${userId},psychologist_id.eq.${userId}`);
    
    // 8. Delete direct messages
    await supabase.from('direct_messages').delete().or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);
    
    // 9. Delete notifications
    await supabase.from('notifications').delete().eq('user_id', userId);
    
    // 10. Delete AI chat reports
    await supabase.from('ai_chat_reports').delete().or(`patient_id.eq.${userId},clinician_id.eq.${userId}`);
    
    // 11. Delete brodi interactions
    await supabase.from('brodi_interactions').delete().eq('user_id', userId);
    
    // 12. Delete brodi preferences
    await supabase.from('brodi_user_preferences').delete().eq('user_id', userId);
    
    // 13. Delete patient risk assessments
    await supabase.from('patient_risk_assessments').delete().or(`patient_id.eq.${userId},clinician_id.eq.${userId}`);
    
    // 14. Delete invited patients
    await supabase.from('invited_patients').delete().or(`user_id.eq.${userId},psychologist_id.eq.${userId}`);
    
    // 15. Delete psychologist profiles
    await supabase.from('psychologist_profiles').delete().eq('user_id', userId);
    
    // 16. Delete from clinician marketplace
    await supabase.from('clinician_marketplace').delete().eq('id', userId);
    
    // 17. Delete subscribers data
    await supabase.from('subscribers').delete().eq('user_id', userId);

    // Finally, delete user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting profile:', profileError);
      throw new Error('Failed to delete user profile');
    }

    // Delete the user from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('Error deleting user from auth:', authError);
      throw new Error('Failed to delete user from authentication');
    }

    console.log(`✅ User ${userId} and all related records deleted successfully`);

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in delete-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});