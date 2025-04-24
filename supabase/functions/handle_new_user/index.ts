
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // This function handles new user creation
  const body = await req.json()
  
  try {
    // Insert user profile with "full_name" field (not "full name")
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: body.id,
        full_name: body.raw_user_meta_data?.full_name || 'Unknown User',
        language: body.raw_user_meta_data?.language || 'en',
        role: body.raw_user_meta_data?.role || 'patient'
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
