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
    const { userId, userMetadata } = await req.json();

    if (!userId || !userMetadata) {
      throw new Error('User ID and metadata are required');
    }

    console.log(`Processing new user: ${userId}`, userMetadata);

    const {
      first_name,
      last_name,
      email,
      role,
      language = 'en',
      referral_code,
      specialization,
      license_number
    } = userMetadata;

    // Create user profile
    const profileData = {
      id: userId,
      first_name: first_name || '',
      last_name: last_name || '',
      email: email || '',
      role: role || 'patient',
      language,
      referral_code,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      onboarding_completed: false,
      onboarding_step: 1,
      status: 'active'
    };

    // Add clinician-specific fields
    if (role === 'clinician') {
      // Generate referral code for clinicians
      if (!referral_code) {
        profileData.referral_code = generateReferralCode();
      }
      
      // Note: specialization and license_number would need to be added to profiles table
      // For now, we'll store them in the initial_assessment field as JSON
      if (specialization || license_number) {
        profileData.initial_assessment = JSON.stringify({
          specialization,
          license_number
        });
      }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw new Error('Failed to create user profile');
    }

    console.log('✅ Profile created successfully:', profile.id);

    // Link patient to clinician if referral code provided
    if (role === 'patient' && referral_code) {
      const { data: clinician, error: clinicianError } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referral_code)
        .eq('role', 'clinician')
        .single();

      if (!clinicianError && clinician) {
        const { error: linkError } = await supabase
          .from('patient_clinician_links')
          .insert({
            patient_id: userId,
            clinician_id: clinician.id
          });

        if (linkError) {
          console.error('Error linking patient to clinician:', linkError);
        } else {
          console.log('✅ Patient linked to clinician successfully');
        }
      }
    }

    // Send welcome notification
    const welcomeMessage = role === 'clinician' 
      ? `Welcome to MoodMate! Your clinician account has been created successfully. Your referral code is: ${profileData.referral_code}`
      : `Welcome to MoodMate! Your patient account has been created successfully. Start by completing your profile and tracking your first mood entry.`;

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'welcome',
        title: 'Welcome to MoodMate!',
        description: welcomeMessage,
        priority: 'medium',
        metadata: {
          onboarding: true,
          role: role
        }
      });

    if (notificationError) {
      console.error('Error creating welcome notification:', notificationError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        profile,
        message: 'User processed successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in handle_new_user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}