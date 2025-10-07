import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyUserRequest {
  waitingListId: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== NOTIFY APPROVED USER FUNCTION STARTED ===');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const requestBody = await req.json();
    console.log('Request body received:', { ...requestBody, email: requestBody.email });
    
    const { waitingListId, email, firstName, lastName, userType }: NotifyUserRequest = requestBody;

    if (!waitingListId || !email || !firstName || !lastName || !userType) {
      console.error('Missing required fields:', { waitingListId, email, firstName, lastName, userType });
      throw new Error('Missing required fields');
    }

    console.log('Creating registration token for approved user:', { email, firstName, lastName, userType });

    // Create registration token
    console.log('Inserting registration token into database...');
    const { data: tokenData, error: tokenError } = await supabase
      .from('registration_tokens')
      .insert([{
        waiting_list_id: waitingListId,
        email,
        first_name: firstName,
        last_name: lastName,
        user_type: userType
      }])
      .select('token')
      .single();

    if (tokenError) {
      console.error('Error creating registration token:', tokenError);
      throw new Error(`Failed to create registration token: ${tokenError.message}`);
    }

    console.log('Registration token created successfully:', { token: tokenData.token.substring(0, 10) + '...' });

    // Use the correct app domain
    const appDomain = 'https://moodmate-ai-bridge.lovable.app';
    const registrationUrl = `${appDomain}/complete-registration/${tokenData.token}`;
    
    console.log('Registration URL generated:', registrationUrl);

    // Send approval email with registration link
    console.log('Attempting to send email via Resend to:', email);
    const emailResponse = await resend.emails.send({
      from: "MoodMate <onboarding@resend.dev>",
      to: [email],
      subject: "¡Tu solicitud de acceso ha sido aprobada! - MoodMate",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #7C3AED; margin: 0;">MoodMate</h1>
          </div>
          
          <div style="background: linear-gradient(135deg, #7C3AED, #EC4899); padding: 30px; border-radius: 12px; text-align: center; color: white; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0;">¡Felicitaciones ${firstName}!</h2>
            <p style="margin: 0; font-size: 18px;">Tu solicitud de acceso a MoodMate ha sido aprobada</p>
          </div>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0;">Completa tu registro</h3>
            <p style="color: #475569; margin: 0 0 20px 0;">
              Para comenzar a usar MoodMate, necesitas completar tu registro y crear tu contraseña.
              Haz clic en el botón de abajo para acceder a la página de registro:
            </p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${registrationUrl}" 
                 style="background: linear-gradient(135deg, #7C3AED, #EC4899); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Completar Registro
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin: 20px 0 0 0;">
              <strong>Importante:</strong> Este enlace expira en 7 días. Si no completas tu registro dentro de este tiempo, deberás solicitar acceso nuevamente.
            </p>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>Tipo de cuenta:</strong> ${userType === 'patient' ? 'Paciente' : userType === 'clinician' ? 'Clínico' : 'Profesional'}
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
            <p style="margin: 0;">
              ¿Problemas con el enlace? Copia y pega esta URL en tu navegador:<br>
              <span style="word-break: break-all;">${registrationUrl}</span>
            </p>
            <p style="margin: 15px 0 0 0;">
              Si no solicitaste acceso a MoodMate, puedes ignorar este email.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Approval email sent successfully:", { 
      id: emailResponse.id || emailResponse,
      to: email 
    });

    console.log('=== NOTIFY APPROVED USER FUNCTION COMPLETED SUCCESSFULLY ===');

    return new Response(JSON.stringify({ 
      success: true, 
      token: tokenData.token,
      registrationUrl 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("=== ERROR in notify-approved-user function ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);