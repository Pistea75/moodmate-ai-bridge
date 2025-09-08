import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, Copy, Check } from 'lucide-react';

interface InvitePatientFormProps {
  onSuccess?: () => void;
}

interface InvitationResponse {
  patient_id: string;
  invite_code: string;
  invite_url: string;
  whatsapp_deeplink: string;
}

export function InvitePatientForm({ onSuccess }: InvitePatientFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [invitation, setInvitation] = useState<InvitationResponse | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-patient-invitation', {
        body: formData
      });

      if (error) {
        console.error('Error creating invitation:', error);
        toast.error(error.message || 'Error al crear la invitación');
        return;
      }

      setInvitation(data);
      toast.success('Invitación creada exitosamente');
      // Don't call onSuccess immediately to allow user to copy link/open WhatsApp
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Error inesperado al crear la invitación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!invitation) return;

    try {
      await navigator.clipboard.writeText(invitation.invite_url);
      setCopiedUrl(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el enlace');
    }
  };

  const handleOpenWhatsApp = () => {
    if (!invitation) return;
    window.open(invitation.whatsapp_deeplink, '_blank');
  };

  const handleReset = () => {
    setFormData({ first_name: '', last_name: '', phone: '' });
    setInvitation(null);
    setCopiedUrl(false);
    onSuccess?.(); // Notify parent to refresh list and close modal
  };

  if (invitation) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Invitación Creada</CardTitle>
          <CardDescription>
            La invitación para {formData.first_name} {formData.last_name} ha sido creada exitosamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Enlace de invitación</Label>
            <div className="flex gap-2">
              <Input
                value={invitation.invite_url}
                readOnly
                className="text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                disabled={copiedUrl}
              >
                {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleOpenWhatsApp}
              className="flex-1"
              variant="default"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Abrir WhatsApp
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Nueva Invitación
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Código: {invitation.invite_code}</p>
            <p>La invitación expira en 72 horas.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Invitar Nuevo Paciente</CardTitle>
        <CardDescription>
          Crea un perfil preliminar del paciente para enviarle una invitación por WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">Nombre *</Label>
            <Input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
              placeholder="Ingresa el nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">Apellido *</Label>
            <Input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
              placeholder="Ingresa el apellido"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+54911234567"
            />
            <p className="text-xs text-muted-foreground">
              Formato internacional (ej: +54911234567)
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creando invitación...' : 'Crear Invitación'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}