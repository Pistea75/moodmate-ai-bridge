import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Use OpenAI to anonymize the text
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres un sistema de anonimización de datos para cumplir con GDPR/HIPAA. 
            
Tu tarea es:
1. Identificar y reemplazar toda información personal identificable (PII):
   - Nombres propios → [NOMBRE]
   - Apellidos → [APELLIDO]
   - Direcciones → [DIRECCIÓN]
   - Teléfonos → [TELÉFONO]
   - Emails → [EMAIL]
   - Lugares específicos → [LUGAR]
   - Fechas específicas → [FECHA]
   - Números de identificación → [ID]
   - Nombres de familiares/amigos → [PERSONA]
   - Redes sociales → [RED_SOCIAL]

2. Mantener el contexto emocional y clínico del texto
3. Preservar la estructura y el sentido del mensaje
4. NUNCA inventar información
5. Devolver SOLO el texto anonimizado, sin explicaciones adicionales

Ejemplo:
Input: "Hola, soy Juan Pérez. Vivo en Calle Falsa 123, Madrid. Mi teléfono es 555-1234"
Output: "Hola, soy [NOMBRE] [APELLIDO]. Vivo en [DIRECCIÓN], [LUGAR]. Mi teléfono es [TELÉFONO]"`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const anonymizedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        anonymized: anonymizedText,
        original_length: text.length,
        anonymized_length: anonymizedText.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in anonymize-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
