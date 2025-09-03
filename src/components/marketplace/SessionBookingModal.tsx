import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SessionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  psychologist: {
    id: string;
    display_name: string;
    user_id: string;
  };
}

export function SessionBookingModal({ isOpen, onClose, psychologist }: SessionBookingModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    sessionTopic: '',
    message: '',
    preferredDate: '',
    timeSlot: ''
  });

  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('session_inquiries')
        .insert({
          patient_id: user.id,
          psychologist_id: psychologist.user_id,
          patient_first_name: formData.firstName,
          patient_last_name: formData.lastName,
          session_topic: formData.sessionTopic,
          patient_message: formData.message,
          preferred_date: formData.preferredDate ? new Date(formData.preferredDate).toISOString() : null,
          preferred_time_slot: formData.timeSlot
        });

      if (error) throw error;

      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de sesión ha sido enviada al psicólogo. Te contactarán pronto."
      });

      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        sessionTopic: '',
        message: '',
        preferredDate: '',
        timeSlot: ''
      });
    } catch (error) {
      console.error('Error creating session inquiry:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Reservar sesión con {psychologist.display_name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sessionTopic">Tema de la sesión</Label>
            <Input
              id="sessionTopic"
              value={formData.sessionTopic}
              onChange={(e) => setFormData(prev => ({ ...prev, sessionTopic: e.target.value }))}
              placeholder="ej. Ansiedad, depresión, terapia de pareja..."
              required
            />
          </div>

          <div>
            <Label htmlFor="message">¿Qué te gustaría tratar en esta sesión?</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Describe brevemente lo que te gustaría trabajar o discutir..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="preferredDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha preferida (opcional)
            </Label>
            <Input
              id="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horario preferido (opcional)
            </Label>
            <Select
              value={formData.timeSlot}
              onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un horario" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}