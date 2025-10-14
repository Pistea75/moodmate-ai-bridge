import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface PendingRequest {
  id: string;
  patient_id: string;
  referral_code: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function PendingRequestsButton() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('patient_link_requests')
      .select(`
        id,
        patient_id,
        referral_code,
        created_at,
        profiles!patient_link_requests_patient_id_fkey (
          first_name,
          last_name,
          email
        )
      `)
      .eq('clinician_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
      return;
    }

    setRequests(data || []);
  };

  useEffect(() => {
    fetchRequests();

    // Subscribe to changes
    const channel = supabase
      .channel('pending-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patient_link_requests'
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprove = async (requestId: string, patientId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Create the link
      const { error: linkError } = await supabase
        .from('patient_clinician_links')
        .insert({
          patient_id: patientId,
          clinician_id: user.id
        });

      if (linkError) throw linkError;

      // Update request status
      const { error: updateError } = await supabase
        .from('patient_link_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      toast({
        title: '¡Solicitud Aprobada!',
        description: 'El paciente ha sido vinculado exitosamente',
      });

      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'No se pudo aprobar la solicitud',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('patient_link_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Solicitud Rechazada',
        description: 'La solicitud ha sido rechazada',
      });

      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la solicitud',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Solicitudes
        {requests.length > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {requests.length}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solicitudes Pendientes</DialogTitle>
            <DialogDescription>
              Aprueba o rechaza las solicitudes de vinculación de pacientes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No hay solicitudes pendientes
              </p>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {request.profiles.first_name} {request.profiles.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {request.profiles.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Código usado: {request.referral_code}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id, request.patient_id)}
                      disabled={loading}
                    >
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      disabled={loading}
                    >
                      Rechazar
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
