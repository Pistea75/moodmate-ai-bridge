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

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, audioData, duration } = await req.json();

    if (!sessionId || !audioData) {
      throw new Error('Session ID and audio data are required');
    }

    console.log(`Processing session recording for session: ${sessionId}`);

    // Convert base64 to blob for OpenAI
    const binaryData = atob(audioData);
    const bytes = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      bytes[i] = binaryData.charCodeAt(i);
    }

    const audioBlob = new Blob([bytes], { type: 'audio/webm' });

    // Create form data for OpenAI
    const formData = new FormData();
    formData.append('file', audioBlob, 'session_recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    // Send to OpenAI Whisper for transcription
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorData = await transcriptionResponse.text();
      throw new Error(`OpenAI transcription error: ${errorData}`);
    }

    const transcriptionData = await transcriptionResponse.json();
    const transcriptionText = transcriptionData.text;

    console.log('✅ Transcription completed');

    // Generate session summary using GPT
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional mental health session analyzer. Create a structured summary of this therapy session transcript.

Please provide:
1. Session Overview (2-3 sentences)
2. Key Topics Discussed
3. Patient's Emotional State
4. Therapeutic Interventions Used
5. Progress Notes
6. Recommendations for Next Session

Keep the summary professional, confidential, and suitable for clinical records.`
          },
          {
            role: 'user',
            content: `Please analyze this session transcript and provide a structured summary:\n\n${transcriptionText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!summaryResponse.ok) {
      const errorData = await summaryResponse.json();
      throw new Error(`OpenAI summary error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const summaryData = await summaryResponse.json();
    const sessionSummary = summaryData.choices[0]?.message?.content || 'Unable to generate session summary';

    // Create session recording record
    const recordingData = {
      session_id: sessionId,
      file_path: `session_recordings/${sessionId}_${Date.now()}.webm`,
      duration_seconds: duration,
      transcription_text: transcriptionText,
      file_size: audioBlob.size,
      recording_started_at: new Date().toISOString(),
      recording_ended_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: recording, error: recordingError } = await supabase
      .from('session_recordings')
      .insert(recordingData)
      .select()
      .single();

    if (recordingError) {
      console.error('Error creating session recording:', recordingError);
      throw new Error('Failed to save session recording');
    }

    // Update session with transcription and summary
    const { error: sessionError } = await supabase
      .from('sessions')
      .update({
        transcription_text: transcriptionText,
        transcription_status: 'completed',
        recording_status: 'completed',
        recording_file_path: recordingData.file_path,
        notes: sessionSummary,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (sessionError) {
      console.error('Error updating session:', sessionError);
      throw new Error('Failed to update session');
    }

    console.log('✅ Session recording processed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        recording,
        transcription: transcriptionText,
        summary: sessionSummary,
        message: 'Session recording processed successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in process-session-recording function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});