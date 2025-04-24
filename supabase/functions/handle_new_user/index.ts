
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

serve(async (req) => {
  const body = await req.json()
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    console.log('Processing user creation for user ID:', body.id)
    console.log('User metadata received:', body.raw_user_meta_data)
    
    // Get the full name from metadata
    const fullName = body.raw_user_meta_data?.full_name || 'Unknown User';
    const language = body.raw_user_meta_data?.language || 'en';
    const role = body.raw_user_meta_data?.role || 'patient';
    
    // Insert user profile with correct field names matching the database schema
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: body.id,
        user_id: body.id,
        full_name: fullName,
        language: language,
        role: role
      })
    
    if (error) {
      console.error('Error creating user profile:', error)
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    console.log('Successfully created user profile with id:', body.id)
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Unexpected error creating user profile:', err)
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
