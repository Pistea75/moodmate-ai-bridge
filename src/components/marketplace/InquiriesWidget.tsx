import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Calendar, Clock, User, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SessionInquiry {
  id: string;
  patient_first_name: string;
  patient_last_name: string;
  session_topic: string;
  patient_message: string;
  preferred_date: string | null;
  preferred_time_slot: string | null;
  status: string;
  created_at: string;
  clinician_response: string | null;
}

export function InquiriesWidget() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<SessionInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, [user]);

  const fetchInquiries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('session_inquiries')
        .select('*')
        .eq('psychologist_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async (inquiryId: string, status: 'accepted' | 'declined') => {
    if (!response.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe una respuesta antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setResponding(inquiryId);
    try {
      const { error } = await supabase
        .from('session_inquiries')
        .update({
          status,
          clinician_response: response
        })
        .eq('id', inquiryId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? "Solicitud aceptada" : "Solicitud rechazada",
        description: "Tu respuesta ha sido enviada al paciente."
      });

      setResponse('');
      setResponding(null);
      fetchInquiries();
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast({
        title: "Error",
        description: "No se pudo procesar la respuesta. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setResponding(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", text: string }> = {
      pending: { variant: "outline", text: "Pendiente" },
      accepted: { variant: "default", text: "Aceptada" },
      declined: { variant: "destructive", text: "Rechazada" },
      completed: { variant: "secondary", text: "Completada" }
    };
    
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Solicitudes de Sesión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Cargando solicitudes...</p>
        </CardContent>
      </Card>
    );
  }

  const pendingInquiries = inquiries.filter(inquiry => inquiry.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Solicitudes de Sesión
          </div>
          <Badge variant="secondary">
            {pendingInquiries.length} pendiente{pendingInquiries.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {inquiries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No tienes solicitudes de sesión aún.
          </p>
        ) : (
          <div className="space-y-4">
            {inquiries.slice(0, 3).map((inquiry) => (
              <div key={inquiry.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium">
                        {inquiry.patient_first_name} {inquiry.patient_last_name}
                      </span>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <p className="text-sm font-medium text-primary">{inquiry.session_topic}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground">{inquiry.patient_message}</p>

                {inquiry.preferred_date && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(inquiry.preferred_date).toLocaleDateString()}
                    </div>
                    {inquiry.preferred_time_slot && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {inquiry.preferred_time_slot}
                      </div>
                    )}
                  </div>
                )}

                {inquiry.status === 'pending' && (
                  <div className="space-y-3 pt-2 border-t">
                    <Textarea
                      placeholder="Escribe tu respuesta al paciente..."
                      value={responding === inquiry.id ? response : ''}
                      onChange={(e) => {
                        if (responding === inquiry.id) {
                          setResponse(e.target.value);
                        } else {
                          setResponding(inquiry.id);
                          setResponse(e.target.value);
                        }
                      }}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleResponseSubmit(inquiry.id, 'accepted')}
                        disabled={responding === inquiry.id}
                        className="flex-1"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResponseSubmit(inquiry.id, 'declined')}
                        disabled={responding === inquiry.id}
                        className="flex-1"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                )}

                {inquiry.clinician_response && (
                  <div className="text-sm bg-muted p-2 rounded">
                    <span className="font-medium">Tu respuesta: </span>
                    {inquiry.clinician_response}
                  </div>
                )}
              </div>
            ))}
            {inquiries.length > 3 && (
              <p className="text-center text-sm text-muted-foreground">
                Y {inquiries.length - 3} solicitud{inquiries.length - 3 !== 1 ? 'es' : ''} más...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}