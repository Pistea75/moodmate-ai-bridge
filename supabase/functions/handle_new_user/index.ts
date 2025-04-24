
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
    console.log('Processing user creation for user ID:', body.id)
    console.log('User metadata received:', body.raw_user_meta_data)
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Create client with service role key for admin privileges
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get user data from metadata
    const fullName = body.raw_user_meta_data?.full_name || '';
    const language = body.raw_user_meta_data?.language || 'en';
    const role = body.raw_user_meta_data?.role || 'patient';
    const referralCode = body.raw_user_meta_data?.referral_code ? 
      body.raw_user_meta_data.referral_code.trim().toUpperCase() : null;
    
    // Split full name into first and last name
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    try {
      // Check if profile already exists to prevent duplicate inserts
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', body.id)
        .maybeSingle();
        
      if (profileCheckError) {
        console.error('Error checking existing profile:', profileCheckError);
        throw profileCheckError;
      }
      
      if (!existingProfile) {
        console.log('Creating new profile for user:', body.id);
        
        // Prepare profile data, ensuring proper format for all fields
        const profileData = {
          id: body.id,
          first_name: firstName,
          last_name: lastName,
          language: language,
          role: role
        };
        
        // Only add referral_code if it exists and is not empty
        if (referralCode) {
          profileData.referral_code = referralCode;
        }
        
        console.log('Profile data to be inserted:', profileData);
        
        // Insert user profile with service role to bypass RLS
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);
        
        if (insertError) {
          console.error('Error creating user profile:', insertError);
          throw insertError;
        }
        
        console.log('Successfully created profile for user:', body.id);
      } else {
        console.log('Profile already exists for user:', body.id);
      }
      
      // If referral code is provided, check for a clinician profile with that code
      if (referralCode) {
        console.log('Processing referral code:', referralCode);
        
        try {
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
            console.log('Found clinician for referral code:', clinicianData);
            
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
          } else {
            console.log('No clinician found with referral code:', referralCode);
          }
        } catch (referralError) {
          console.error('Error processing referral code:', referralError);
          // Continue execution even if referral processing fails
        }
      }
      
      console.log('Successfully processed user profile with id:', body.id);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (dbError) {
      console.error('Database error processing user profile:', dbError);
      return new Response(JSON.stringify({ error: `Database error: ${dbError.message || 'Unknown database error'}` }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    console.error('Unexpected error processing user profile:', err);
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
