import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Check, X, Users, Filter, Copy, Link2 } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface WaitingListEntry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export default function WaitingListManagement() {
  const [entries, setEntries] = useState<WaitingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { user } = useAuth();
  const { toast } = useToast();
  const [registrationTokens, setRegistrationTokens] = useState<{[key: string]: string}>({});

  const fetchEntries = async () => {
    try {
      let query = supabase
        .from('waiting_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (typeFilter !== 'all') {
        query = query.eq('user_type', typeFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      setEntries((data || []) as WaitingListEntry[]);
    } catch (error) {
      console.error('Error fetching waiting list:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar las solicitudes de la waiting list.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    // Load registration tokens for approved entries
    entries.filter(e => e.status === 'approved').forEach(entry => {
      if (!registrationTokens[entry.id]) {
        getRegistrationToken(entry.id);
      }
    });
  }, [entries]);

  const updateEntryStatus = async (entryId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const entry = entries.find(e => e.id === entryId);
      if (!entry) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se encontró la entrada.'
        });
        return;
      }

      const { error } = await supabase
        .from('waiting_list')
        .update({
          status: newStatus,
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', entryId);

      if (error) throw error;

      // If approved, send notification email
      if (newStatus === 'approved') {
        try {
          console.log('Calling notify-approved-user edge function with:', {
            waitingListId: entryId,
            email: entry.email,
            firstName: entry.first_name,
            lastName: entry.last_name,
            userType: entry.user_type
          });

          const { data: functionData, error: emailError } = await supabase.functions.invoke('notify-approved-user', {
            body: {
              waitingListId: entryId,
              email: entry.email,
              firstName: entry.first_name,
              lastName: entry.last_name,
              userType: entry.user_type
            }
          });

          console.log('Edge function response:', { data: functionData, error: emailError });

          if (emailError) {
            console.error('Error sending approval email:', emailError);
            toast({
              title: 'Parcialmente completado',
              description: 'Usuario aprobado pero no se pudo enviar el email de notificación.',
              variant: 'destructive'
            });
          } else {
            console.log('Email sent successfully, registration URL:', functionData?.registrationUrl);
            toast({
              title: 'Usuario aprobado',
              description: 'Se ha enviado un email con instrucciones de registro al usuario.'
            });
          }
          
          // Get the registration token to show it in the UI
          await getRegistrationToken(entryId);
        } catch (emailError) {
          console.error('Error invoking email function:', emailError);
          toast({
            title: 'Parcialmente completado',
            description: 'Usuario aprobado pero no se pudo enviar el email de notificación.',
            variant: 'destructive'
          });
        }
      } else {
        toast({
          title: 'Status actualizado',
          description: 'Solicitud rechazada exitosamente.'
        });
      }

      fetchEntries();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el status de la solicitud.'
      });
    }
  };

  const getRegistrationToken = async (waitingListId: string) => {
    try {
      const { data, error } = await supabase
        .from('registration_tokens')
        .select('token')
        .eq('waiting_list_id', waitingListId)
        .eq('used_at', null)
        .single();

      if (data && !error) {
        setRegistrationTokens(prev => ({
          ...prev,
          [waitingListId]: data.token
        }));
      }
    } catch (error) {
      console.error('Error fetching registration token:', error);
    }
  };

  const copyRegistrationLink = (token: string) => {
    const link = `${window.location.origin}/complete-registration/${token}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link copiado',
      description: 'El link de registro ha sido copiado al portapapeles.'
    });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: 'Token copiado',
      description: 'El token de registro ha sido copiado al portapapeles.'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    const colors = {
      patient: 'bg-blue-100 text-blue-800',
      clinician: 'bg-purple-100 text-purple-800',
      psychologist: 'bg-green-100 text-green-800'
    };

    return (
      <Badge variant="outline" className={colors[userType as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {userType === 'patient' ? 'Paciente' : userType === 'clinician' ? 'Clínico' : 'Psicólogo'}
      </Badge>
    );
  };

  const pendingCount = entries.filter(e => e.status === 'pending').length;
  const approvedCount = entries.filter(e => e.status === 'approved').length;
  const rejectedCount = entries.filter(e => e.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Waiting List</h1>
          <p className="text-muted-foreground">Administra las solicitudes de acceso a la plataforma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{entries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aprobados</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rechazados</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="approved">Aprobados</SelectItem>
                  <SelectItem value="rejected">Rechazados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Usuario</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="patient">Pacientes</SelectItem>
                  <SelectItem value="clinician">Clínicos</SelectItem>
                  <SelectItem value="psychologist">Psicólogos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Acceso</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              No se encontraron solicitudes con los filtros seleccionados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mensaje</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Link/Token</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.first_name} {entry.last_name}
                    </TableCell>
                    <TableCell>{entry.email}</TableCell>
                    <TableCell>{getUserTypeBadge(entry.user_type)}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
                    <TableCell>
                      {entry.message ? (
                        <div className="max-w-xs truncate" title={entry.message}>
                          {entry.message}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Sin mensaje</span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(entry.created_at), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      {entry.status === 'approved' && registrationTokens[entry.id] && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyRegistrationLink(registrationTokens[entry.id])}
                            title="Copiar link de registro"
                          >
                            <Link2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToken(registrationTokens[entry.id])}
                            title="Copiar token"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {entry.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateEntryStatus(entry.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateEntryStatus(entry.id, 'rejected')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}