import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { messages, patientId, privacyLevel = 'partial_share' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log(`Summarizing ${messages.length} messages with privacy level: ${privacyLevel}`);

    // Prepare the conversation for summarization
    const conversationText = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');

    // Determine system prompt based on privacy level
    let systemPrompt = '';
    
    if (privacyLevel === 'full_share') {
      systemPrompt = `Eres un asistente especializado en salud mental que genera resúmenes clínicos detallados para psicólogos.

IMPORTANTE: El chat está anonimizado (nombres → [NOMBRE], lugares → [LUGAR], etc.).
      
Analiza la conversación y crea un reporte profesional que incluya:
1. Resumen ejecutivo del estado emocional del paciente
2. Temas principales discutidos
3. Patrones de pensamiento identificados
4. Progreso observado
5. Áreas de preocupación
6. Citas textuales relevantes del chat anonimizado (máximo 3-4 citas)
7. Recomendaciones para el seguimiento

El reporte debe ser clínico, empático y útil para el tratamiento.`;
    } else if (privacyLevel === 'partial_share') {
      systemPrompt = `Eres un asistente especializado en salud mental que genera insights y reportes agregados para psicólogos.

IMPORTANTE: NO tienes acceso al chat completo. Solo genera insights basados en patrones generales.

Analiza la conversación y crea un reporte con insights que incluya:
1. Tendencias emocionales generales (sin citas textuales)
2. Temas frecuentes de discusión (categorías generales)
3. Cambios en el tono emocional a lo largo del tiempo
4. Nivel de engagement con la terapia
5. Palabras clave y conceptos recurrentes
6. Recomendaciones basadas en patrones observados

CRÍTICO: No incluyas citas textuales ni detalles específicos de conversaciones. Solo proporciona análisis agregado y tendencias.`;
    } else {
      // 'private' level - psicólogo NO tiene acceso
      systemPrompt = `Eres un asistente que genera métricas básicas de actividad.

IMPORTANTE: El psicólogo NO tiene acceso a las conversaciones. Solo métricas generales.

Proporciona solo:
1. Número de interacciones en el período
2. Nivel de actividad (bajo/medio/alto)
3. Estado emocional promedio (escala general)

NO incluyas detalles de conversaciones, insights específicos, ni tendencias detalladas.`;
    }

    console.log('Calling OpenAI API for summarization with model: gpt-4o-mini');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Analiza esta conversación:\n\n${conversationText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content || 'Unable to generate summary';

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in summarize-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});