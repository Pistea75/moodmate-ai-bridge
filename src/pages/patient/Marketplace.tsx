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
import { useTranslation } from 'react-i18next';

export default function Marketplace() {
  const { t } = useTranslation();
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

  // All users have marketplace access now, but with different session fees
  const hasMarketplaceAccess = true;
  
  // Get session management fee based on plan
  const getSessionManagementFee = () => {
    if (!subscription.subscribed || subscription.plan_type === 'free') return '$5';
    if (subscription.plan_type === 'personal') return '$2';
    if (subscription.plan_type === 'premium') return '$0';
    return '$5'; // Default for unknown plans
  };

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


  return (
    <PatientLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Main Content */}
        <div className="">
          {/* Clinician Status Banner */}
          {!clinicianLoading && (
            <Alert className="mb-6 border-l-4 border-l-primary bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasExistingClinician ? (
                    <>
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <span>
                        {t('marketplace.existingClinician', 'You already have an assigned psychologist')}: <strong>{clinicianInfo?.first_name} {clinicianInfo?.last_name}</strong>. 
                        {t('marketplace.additionalSessions', 'You can still book additional sessions with other professionals from the marketplace')}.
                      </span>
                    </>
                  ) : (
                    <>
                      <UserX className="h-4 w-4 text-orange-600" />
                      <span>{t('marketplace.noClinician', 'You currently have no assigned psychologist. Explore our marketplace to find the ideal professional')}</span>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {t('marketplace.title', 'Psychologist Marketplace')}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {t('marketplace.subtitle', 'Find and connect with verified psychologists specialized in your needs')}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <MarketplaceFiltersComponent
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onClearFilters={clearFilters}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6 p-4 bg-card border rounded-lg">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {loading ? t('marketplace.searching', 'Searching...') : `${psychologists.length} ${t('marketplace.psychologistsFound', 'psychologist(s) found')}`}
                  </span>
                </div>
                {psychologists.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    {t('marketplace.clearFilters', 'Clear Filters')}
                  </Button>
                )}
              </div>

              {/* Error State */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>
                    {t('marketplace.errorLoading', 'Error loading psychologists')}: {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="border-0 bg-card shadow-sm">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-5 w-48" />
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-16 w-full" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && psychologists.length === 0 && (
                <Card className="text-center py-16 border-dashed border-2">
                  <CardContent>
                    <div className="space-y-6">
                      <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                        <Search className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {t('marketplace.noPsychologistsFound', 'No psychologists found')}
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          {t('marketplace.adjustFilters', 'Try adjusting your search filters to find more results')}
                        </p>
                      </div>
                      <Button variant="outline" onClick={clearFilters} size="lg">
                        <Filter className="h-4 w-4 mr-2" />
                        {t('marketplace.clearFilters', 'Clear Filters')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results Grid */}
              {!loading && !error && psychologists.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
        </div>
      </div>
    </PatientLayout>
  );
}