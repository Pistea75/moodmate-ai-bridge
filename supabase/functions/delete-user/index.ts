
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Get authorization header
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'No authorization header' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
    )
  }

  // Verify JWT
  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Verify the JWT from the auth header
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: jwtError } = await supabase.auth.getUser(token)
    
    if (jwtError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid JWT', details: jwtError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    // Parse request body
    const { userId } = await req.json()
    
    // Check if user is trying to delete their own account
    if (user.id !== userId) {
      return new Response(
        JSON.stringify({ error: 'You can only delete your own account' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }
    
    // Delete user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
    
    if (deleteError) {
      return new Response(
        JSON.stringify({ error: 'Failed to delete user', details: deleteError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
