import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { usePsychologistMarketplace } from '@/hooks/usePsychologistMarketplace';
import { useSubscription } from '@/hooks/useSubscription';
import { usePatientClinicianLink } from '@/hooks/usePatientClinicianLink';
import { PsychologistCard } from '@/components/marketplace/PsychologistCard';
import { MarketplaceFiltersComponent } from '@/components/marketplace/MarketplaceFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Crown, Users, Search, Filter, UserCheck, UserX, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Marketplace() {
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { hasExistingClinician, clinicianInfo, loading: clinicianLoading } = usePatientClinicianLink();
  const { 
    psychologists, 
    loading, 
    error, 
    filters, 
    updateFilters, 
    clearFilters 
  } = usePsychologistMarketplace();

  // Check if user has access to marketplace
  const hasMarketplaceAccess = subscription.subscribed && 
    (subscription.plan_type === 'personal' || 
     subscription.plan_type === 'professional_basic' || 
     subscription.plan_type === 'professional_advanced');

  if (subscriptionLoading || clinicianLoading) {
    return (
      <PatientLayout>
        <div className="p-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </PatientLayout>
    );
  }

  if (!hasMarketplaceAccess) {
    return (
      <PatientLayout>
        <div className="p-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="space-y-2">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Marketplace de Psicólogos
              </h1>
              <p className="text-lg text-gray-600">
                Conecta con psicólogos verificados y reserva sesiones personalizadas
              </p>
            </div>

            <Alert className="text-left">
              <Crown className="h-4 w-4" />
              <AlertDescription>
                El marketplace de psicólogos está disponible para usuarios con plan Personal o superior. 
                Actualiza tu plan para acceder a psicólogos verificados y reservar sesiones.
              </AlertDescription>
            </Alert>

            <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Link to="/pricing">
                <Crown className="h-5 w-5 mr-2" />
                Actualizar Plan
              </Link>
            </Button>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="p-8">
        {/* Clinician Status Banner */}
        {!clinicianLoading && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasExistingClinician ? (
                  <>
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <span>
                      Ya tienes un psicólogo asignado: <strong>{clinicianInfo?.first_name} {clinicianInfo?.last_name}</strong>. 
                      Aún puedes reservar sesiones adicionales con otros profesionales del marketplace.
                    </span>
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 text-orange-600" />
                    <span>No tienes un psicólogo asignado actualmente. Explora nuestro marketplace para encontrar el profesional ideal.</span>
                  </>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Marketplace de Psicólogos
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra y conecta con psicólogos verificados especializados en tus necesidades
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <MarketplaceFiltersComponent
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Search className="h-5 w-5" />
                <span>
                  {loading ? 'Buscando...' : `${psychologists.length} psicólogo${psychologists.length !== 1 ? 's' : ''} encontrado${psychologists.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <Alert className="mb-6">
                <AlertDescription>
                  Error al cargar los psicólogos: {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-16 w-16 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-16 w-full" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && psychologists.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        No se encontraron psicólogos
                      </h3>
                      <p className="text-gray-600">
                        Intenta ajustar tus filtros de búsqueda para encontrar más resultados.
                      </p>
                    </div>
                    <Button variant="outline" onClick={clearFilters}>
                      <Filter className="h-4 w-4 mr-2" />
                      Limpiar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Grid */}
            {!loading && !error && psychologists.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {psychologists.map((psychologist) => (
                  <PsychologistCard 
                    key={psychologist.id} 
                    psychologist={psychologist} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}