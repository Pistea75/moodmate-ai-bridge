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

    // 4) Validar invitación (ajusta la tabla/campos a tu esquema real)
    const { data, error } = await supabase
      .from('invitations')
      .select('id, code, expires_at, used_at')
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

    // 5) OK
    return new Response(JSON.stringify({ ok: true, invitationId: data.id }), {
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