import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL!, import.meta.env.VITE_SUPABASE_ANON_KEY!);

export default function PatientInviteSignup() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get('code') || window.location.pathname.split('/invite/')[1] || '';
    if (!code) { setError('Código de invitación faltante'); setLoading(false); return; }

    const validate = async () => {
      setLoading(true);
      setError(null);
      // ✅ Invocar Edge Function (maneja CORS internamente)
      const { data, error } = await supabase.functions.invoke('validate-invitation', {
        body: { code }
      });
      if (error || !data || !data.ok) {
        setError('Invitación inválida o expirada');
        setLoading(false);
        return;
      }
      
      // Redirigir a signup con datos pre-completados
      const { patientData } = data;
      const fullName = `${patientData.firstName} ${patientData.lastName}`.trim();
      const queryParams = new URLSearchParams({
        fullName,
        phone: patientData.phone,
        referralCode: patientData.referralCode || '',
        fromInvite: 'true'
      });
      
      navigate(`/signup-patient?${queryParams.toString()}`);
    };

    validate();
  }, [params]);

  if (loading) return <div className="p-6">Validando invitación…</div>;
  if (error) return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">Invitación inválida</h2>
      <p className="mb-4">{error}</p>
      <button className="btn" onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Crear cuenta de paciente</h1>
    </div>
  );
}
