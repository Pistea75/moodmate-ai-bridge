
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, FileText, Settings, AlertTriangle } from 'lucide-react';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { PHIAccessRequestModal } from '@/components/admin/PHIAccessRequestModal';
import { PHIAccessAuditPanel } from '@/components/admin/PHIAccessAuditPanel';
import { useNavigate } from 'react-router-dom';

export default function SuperAdminPanel() {
  const navigate = useNavigate();
  const { isSuperAdmin, loading, requestPHIAccess } = useSuperAdmin();
  const [showPHIModal, setShowPHIModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{id: string, name: string} | null>(null);

  // Redirect if not super admin
  if (!loading && !isSuperAdmin) {
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              Super Admin Panel
            </h1>
            <p className="text-gray-600 mt-1">Operational management with PHI protection</p>
          </div>
          <Badge variant="destructive" className="px-3 py-1">
            SUPER ADMIN ACCESS
          </Badge>
        </div>

        {/* PHI Protection Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">PHI Protection Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This panel provides operational access while protecting PHI. Access to patient data requires explicit 
                justification and is logged for compliance. Use responsibly and only when necessary.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="phi-access">PHI Access</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">User Management</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Available</div>
                  <p className="text-xs text-muted-foreground">
                    Manage clinicians and patients
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">PHI Access</CardTitle>
                  <Shield className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Protected</div>
                  <p className="text-xs text-muted-foreground">
                    Requires justification and logging
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Audit Trail</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-xs text-muted-foreground">
                    All actions logged
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>User management interface will be implemented here</p>
                  <p className="text-sm">This will include user listing, role management, and account controls</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PHI Access Tab */}
          <TabsContent value="phi-access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  PHI Access Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">PHI Access Policy</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Access to Protected Health Information requires explicit justification and is strictly logged. 
                          Only request access when absolutely necessary for legal compliance, user requests, or escalated support.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedPatient({id: 'demo-patient', name: 'Demo Patient'});
                      setShowPHIModal(true);
                    }}
                    className="w-full"
                  >
                    Request PHI Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <PHIAccessAuditPanel />
          </TabsContent>
        </Tabs>

        {/* PHI Access Request Modal */}
        {selectedPatient && (
          <PHIAccessRequestModal
            open={showPHIModal}
            onOpenChange={setShowPHIModal}
            onSubmit={requestPHIAccess}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />
        )}
      </div>
    </div>
  );
}
