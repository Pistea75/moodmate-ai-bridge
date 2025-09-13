import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ----- CORS -----
function buildCorsHeaders(origin: string | null) {
  const allowed = new Set([
    'https://moodmate.io',
    'https://staging.moodmate.io',
    'http://localhost:5173'
  ]);
  const allowOrigin = origin && allowed.has(origin) ? origin : 'https://moodmate.io';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Vary': 'Origin'
  } as const;
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const corsHeaders = buildCorsHeaders(origin);

  // 1) Preflight OK siempre
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200, headers: { ...corsHeaders } });
  }

  try {
    // 2) Obtener el code desde query o body
    const url = new URL(req.url);
    let code = url.searchParams.get('code');
    if (!code) {
      const body = await req.json().catch(() => ({}));
      code = body?.code ?? null;
    }
    if (!code) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 3) Supabase client (Service Role para leer invitaciones)
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

    // 4) Validar invitación y obtener datos del paciente
    const { data, error } = await supabase
      .from('patient_invitations')
      .select(`
        id, code, expires_at, used_at,
        patient_id,
        psychologist_id,
        invited_patients!inner(
          first_name,
          last_name,
          phone_e164
        ),
        profiles!psychologist_id(
          referral_code
        )
      `)
      .eq('code', code)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ ok: false, error: 'INVALID_CODE' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const now = new Date();
    const expires = data.expires_at ? new Date(data.expires_at) : null;
    if (!expires || expires < now || data.used_at) {
      return new Response(JSON.stringify({ ok: false, error: 'EXPIRED_OR_USED' }), {
        status: 410,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // 5) OK - Devolver datos del paciente y código del clínico
    const patientData = data.invited_patients;
    const referralCode = data.profiles?.referral_code;
    
    return new Response(JSON.stringify({ 
      ok: true, 
      invitationId: data.id,
      patientData: {
        firstName: patientData.first_name,
        lastName: patientData.last_name,
        phone: patientData.phone_e164,
        referralCode: referralCode
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});