import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sessionId, audioData, duration } = await req.json();

    if (!sessionId || !audioData) {
      throw new Error('Missing required parameters');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing session recording for session:', sessionId);

    // Step 1: Save recording metadata
    const { data: recordingData, error: recordingError } = await supabase
      .from('session_recordings')
      .insert({
        session_id: sessionId,
        file_path: `sessions/${sessionId}/recording.webm`,
        duration_seconds: duration,
        recording_started_at: new Date().toISOString(),
        recording_ended_at: new Date().toISOString()
      })
      .select()
      .single();

    if (recordingError) {
      console.error('Error saving recording metadata:', recordingError);
      throw recordingError;
    }

    console.log('Recording metadata saved:', recordingData.id);

    // Step 2: Transcribe audio using OpenAI Whisper
    console.log('Starting transcription...');
    
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: (() => {
        const formData = new FormData();
        const binaryString = atob(audioData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: 'audio/webm' });
        formData.append('file', blob, 'recording.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'en');
        return formData;
      })()
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('Transcription failed:', errorText);
      throw new Error(`Transcription failed: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcriptionText = transcriptionResult.text;

    console.log('Transcription completed, length:', transcriptionText.length);

    // Step 3: Update session with transcription
    await supabase
      .from('sessions')
      .update({
        transcription_status: 'completed',
        transcription_text: transcriptionText,
        ai_report_status: 'pending'
      })
      .eq('id', sessionId);

    // Step 4: Generate AI report
    console.log('Generating AI report...');
    
    const reportResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a clinical psychologist analyzing therapy session transcripts. Generate a comprehensive session report including:

1. SESSION SUMMARY (2-3 sentences overview)
2. KEY TOPICS DISCUSSED (bullet points)
3. PATIENT EMOTIONAL STATE (mood, affect, engagement level)
4. THERAPEUTIC INTERVENTIONS USED
5. PATIENT RESPONSES AND INSIGHTS
6. HOMEWORK/ACTION ITEMS (if mentioned)
7. CLINICAL OBSERVATIONS (behavior, body language if mentioned)
8. RECOMMENDATIONS FOR NEXT SESSION
9. RISK ASSESSMENT (any concerning statements or behaviors)
10. PROGRESS NOTES (compared to previous sessions if mentioned)

Keep the report professional, concise, and focused on clinically relevant information. Use clear headings and bullet points for readability.`
          },
          {
            role: 'user',
            content: `Please analyze this therapy session transcript and generate a comprehensive clinical report:\n\n${transcriptionText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!reportResponse.ok) {
      const errorText = await reportResponse.text();
      console.error('AI report generation failed:', errorText);
      throw new Error(`AI report generation failed: ${errorText}`);
    }

    const reportResult = await reportResponse.json();
    const reportContent = reportResult.choices[0].message.content;

    console.log('AI report generated, length:', reportContent.length);

    // Step 5: Get session and patient details for the report
    const { data: sessionData, error: sessionError } = await supabase
      .from('sessions')
      .select(`
        *,
        patient:profiles!sessions_patient_id_fkey(first_name, last_name),
        clinician:profiles!sessions_clinician_id_fkey(first_name, last_name)
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      console.error('Error fetching session data:', sessionError);
      throw sessionError;
    }

    // Step 6: Create AI chat report
    const reportTitle = `Session Report - ${sessionData.patient?.first_name} ${sessionData.patient?.last_name} - ${new Date(sessionData.scheduled_time).toLocaleDateString()}`;
    
    const { data: chatReport, error: reportError } = await supabase
      .from('ai_chat_reports')
      .insert({
        patient_id: sessionData.patient_id,
        clinician_id: sessionData.clinician_id,
        title: reportTitle,
        content: reportContent,
        report_type: 'session_analysis',
        status: 'Completed',
        chat_date: sessionData.scheduled_time
      })
      .select()
      .single();

    if (reportError) {
      console.error('Error creating AI chat report:', reportError);
      throw reportError;
    }

    console.log('AI chat report created:', chatReport.id);

    // Step 7: Update session with completed AI report
    await supabase
      .from('sessions')
      .update({
        ai_report_status: 'completed',
        ai_report_id: chatReport.id,
        recording_status: 'completed'
      })
      .eq('id', sessionId);

    // Step 8: Schedule cleanup of recording file (in a real implementation, you'd use a background job)
    console.log('Recording processing completed. File cleanup will be handled automatically.');

    return new Response(JSON.stringify({
      success: true,
      transcriptionLength: transcriptionText.length,
      reportId: chatReport.id,
      message: 'Session recording processed successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-session-recording function:', error);
    
    // Update session status to failed if we have the sessionId
    if (error.sessionId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase
        .from('sessions')
        .update({
          recording_status: 'failed',
          transcription_status: 'failed',
          ai_report_status: 'failed'
        })
        .eq('id', error.sessionId);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});