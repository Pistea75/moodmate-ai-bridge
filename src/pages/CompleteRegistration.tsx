import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurePasswordField } from '@/components/security/SecurePasswordField';

interface RegistrationToken {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  expires_at: string;
  used_at: string | null;
}

export default function CompleteRegistration() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tokenData, setTokenData] = useState<RegistrationToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  useEffect(() => {
    if (!token) {
      setError('Token de registro no válido');
      setLoading(false);
      return;
    }

    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const { data, error } = await supabase
        .from('registration_tokens')
        .select('*')
        .eq('token', token)
        .gt('expires_at', new Date().toISOString())
        .is('used_at', null)
        .single();

      if (error || !data) {
        setError('Token de registro inválido o expirado');
        return;
      }

      setTokenData(data);
    } catch (err) {
      console.error('Error validating token:', err);
      setError('Error al validar el token de registro');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.password || formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error", 
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !tokenData) return;

    setSubmitting(true);

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: tokenData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            first_name: tokenData.first_name,
            last_name: tokenData.last_name,
            role: tokenData.user_type,
            language: 'es',
            referral_code: null
          }
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "Error",
          description: authError.message === 'User already registered' 
            ? "Ya existe un usuario con este email" 
            : "Error al crear la cuenta",
          variant: "destructive"
        });
        return;
      }

      // Mark token as used
      await supabase
        .from('registration_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('token', token);

      setSuccess(true);
      
      toast({
        title: "¡Registro completado!",
        description: "Tu cuenta ha sido creada exitosamente"
      });

      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registro completado. Inicia sesión con tu nueva cuenta.' 
          }
        });
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      toast({
        title: "Error",
        description: "Error inesperado al completar el registro",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-white/80 mt-4">Validando token de registro...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-400" />
            </div>
            <CardTitle className="text-2xl text-white">Token Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white/80">{error}</p>
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
            <CardTitle className="text-2xl text-white">¡Registro Completado!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white/80">
              Tu cuenta ha sido creada exitosamente. Serás redirigido al login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-16 w-16 text-purple-400" />
          </div>
          <CardTitle className="text-2xl text-white">Completa tu Registro</CardTitle>
          <p className="text-white/80">
            Hola {tokenData?.first_name}, crea tu contraseña para acceder a MoodMate
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={tokenData?.email || ''}
                disabled
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">Nombre completo</Label>
              <Input
                id="fullName"
                type="text"
                value={`${tokenData?.first_name} ${tokenData?.last_name}`}
                disabled
                className="bg-white/10 border-white/30 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Contraseña</Label>
              <SecurePasswordField
                id="password"
                name="password"
                label="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 6 caracteres"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirmar contraseña</Label>
              <SecurePasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repite tu contraseña"
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="rounded border-white/30"
                required
              />
              <Label htmlFor="acceptTerms" className="text-sm text-white/80">
                Acepto los términos y condiciones de uso
              </Label>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}