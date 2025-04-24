
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  const body = await req.json()
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('Processing user creation for user ID:', body.id)
    console.log('User metadata received:', body.raw_user_meta_data)
    
    // Get user data from metadata
    const fullName = body.raw_user_meta_data?.full_name || '';
    const language = body.raw_user_meta_data?.language || 'en';
    const role = body.raw_user_meta_data?.role || 'patient';
    const referralCode = body.raw_user_meta_data?.referral_code ? 
      body.raw_user_meta_data.referral_code.trim().toUpperCase() : null;
    
    // Split full name into first and last name
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Check if profile already exists to avoid duplicates
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', body.id)
      .maybeSingle();
      
    if (!existingProfile) {
      // Insert user profile with correct field names matching the database schema
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: body.id,
          first_name: firstName,
          last_name: lastName,
          language: language,
          role: role,
          referral_code: referralCode
        });
      
      if (error) {
        console.error('Error creating user profile:', error);
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // If referral code is provided, check for a clinician profile with that code
    if (referralCode) {
      console.log('Processing referral code:', referralCode);
      
      // Find the clinician with this referral code
      const { data: clinicianData, error: clinicianError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'clinician')
        .eq('referral_code', referralCode)
        .maybeSingle();
      
      if (clinicianError) {
        console.error('Error finding clinician with referral code:', clinicianError);
        // We still want to continue even if referral code connection fails
      } else if (clinicianData) {
        // Update the user's metadata to include the clinician's information
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          body.id,
          {
            user_metadata: {
              connected_clinician_id: clinicianData.id,
              connected_clinician_name: `${clinicianData.first_name || ''} ${clinicianData.last_name || ''}`.trim()
            }
          }
        );
        
        if (updateError) {
          console.error('Error updating user with clinician info:', updateError);
        } else {
          console.log('Successfully connected user to clinician via referral code');
        }
      }
    }
    
    console.log('Successfully processed user profile with id:', body.id);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Unexpected error processing user profile:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
