
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  supabaseUrl || '',
  serviceRoleKey || ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, userId, isClinicianView } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format: messages must be an array' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId: User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let finalSystemPrompt = systemPrompt || 
      'You are Dr. Martinez, a compassionate mental health assistant. Provide supportive and professional responses.';

    // If this is a clinician using the chat, add patient information to the system prompt
    if (isClinicianView) {
      try {
        // Get the clinician's patients
        const { data: patientLinks, error: linksError } = await supabase
          .from('patient_clinician_links')
          .select('patient_id')
          .eq('clinician_id', userId);

        if (linksError) {
          console.error('Error fetching patient links:', linksError);
        } else if (patientLinks && patientLinks.length > 0) {
          const patientIds = patientLinks.map(link => link.patient_id);

          // Get patient profiles
          const { data: patients, error: patientsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', patientIds)
            .eq('role', 'patient');

          if (patientsError) {
            console.error('Error fetching patients:', patientsError);
          } else if (patients && patients.length > 0) {
            // Add patient information to system prompt
            const patientList = patients.map(p => 
              `- ${p.first_name || 'Unknown'} ${p.last_name || 'Patient'} (ID: ${p.id})`
            ).join('\n');

            finalSystemPrompt += `\n\nYour Current Patients:\n${patientList}\n\nYou can discuss these patients by name to help with AI personalization, treatment planning, and clinical insights. When discussing patients, you can reference their names and help create personalized treatment approaches.`;
          }
        }
      } catch (error) {
        console.error('Error fetching patient information:', error);
        // Continue without patient info if there's an error
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'OpenAI API error');
    }
    
    const reply = data.choices[0].message;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate response' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
