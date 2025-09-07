import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface InvitationData {
  valid: boolean;
  patient_preview?: {
    first_name: string;
    last_name: string;
  };
  psychologist_name?: string;
  error?: string;
}

export default function PatientInviteSignup() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/patient/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (code) {
      validateInvitation();
    }
  }, [code]);

  const validateInvitation = async () => {
    if (!code) {
      setInvitationData({ valid: false, error: 'Código de invitación no proporcionado' });
      setIsValidating(false);
      return;
    }

    try {
      const response = await fetch(`https://otrhbyzjrhsqrltdedon.supabase.co/functions/v1/validate-invitation/${code}`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cmhieXpqcmhzcXJsdGRlZG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDA1NDgsImV4cCI6MjA2MTA3NjU0OH0.fYYYcmUDiG7GYVy_zH0xKyo1JGDqxrAVWfCD_pptkhU',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error validating invitation:', data);
        setInvitationData({ valid: false, error: data.error || 'Error al validar la invitación' });
        return;
      }


      setInvitationData(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setInvitationData({ valid: false, error: 'Error inesperado al validar la invitación' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://otrhbyzjrhsqrltdedon.supabase.co/functions/v1/accept-invitation/${code}`, {
        method: 'POST',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cmhieXpqcmhzcXJsdGRlZG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDA1NDgsImV4cCI6MjA2MTA3NjU0OH0.fYYYcmUDiG7GYVy_zH0xKyo1JGDqxrAVWfCD_pptkhU',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error accepting invitation:', data);
        toast.error(data.error || 'Error al crear la cuenta');
        return;
      }


      if (data.ok) {
        toast.success(`¡Listo! Quedaste vinculado/a con ${invitationData?.psychologist_name || 'tu psicólogo/a'}.`);
        
        // Try to sign in the user after successful registration
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (signInError) {
          console.error('Error signing in after registration:', signInError);
          toast.error('Cuenta creada exitosamente. Por favor inicia sesión.');
          navigate('/auth');
        } else {
          navigate('/patient/dashboard');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Error inesperado al crear la cuenta');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Validando invitación...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!invitationData?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Invitación Inválida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {invitationData?.error || 'Esta invitación no es válida o ha expirado.'}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            Registro para {invitationData.psychologist_name}
          </CardTitle>
          <CardDescription>
            Hola {invitationData.patient_preview?.first_name}! Completá tu email y creá una contraseña para vincularte con tu psicólogo/a.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="tu-email@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 8 caracteres"
                minLength={8}
              />
              <p className="text-xs text-muted-foreground">
                La contraseña debe tener al menos 8 caracteres
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                'Crear cuenta y vincular'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Al crear tu cuenta, quedarás automáticamente vinculado/a con {invitationData.psychologist_name}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}