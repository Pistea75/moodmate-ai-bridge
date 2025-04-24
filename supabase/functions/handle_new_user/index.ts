
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Implement the function to handle new user creation
  // Align with the new database structure using "full name"
  const body = await req.json()
  
  // Insert user profile with the new "full name" field
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: body.id,
      "full name": body.raw_user_meta_data?.["full name"] || 'Unknown User',
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
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
