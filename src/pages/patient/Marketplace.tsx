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


  return (
    <PatientLayout>
      <div className="p-8 relative">
        {/* Upgrade Overlay for non-subscribers */}
        {!hasMarketplaceAccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="max-w-md mx-auto text-center space-y-6 bg-white p-8 rounded-xl shadow-2xl">
              <div className="space-y-2">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('marketplace.upgradeTitle', 'Psychologist Marketplace')}
                </h2>
                <p className="text-gray-600">
                  {t('marketplace.upgradeDescription', 'Connect with verified psychologists and book personalized sessions')}
                </p>
              </div>

              <Alert className="text-left">
                <Crown className="h-4 w-4" />
                <AlertDescription>
                  {t('marketplace.upgradeMessage', "Currently you don't have the plan needed. Upgrade it for just $5USD!")}
                </AlertDescription>
              </Alert>

              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full">
                <Link to="/pricing">
                  <Crown className="h-5 w-5 mr-2" />
                  {t('marketplace.upgradeButton', 'Upgrade for $5USD')}
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Main Content - Always shown but blurred if no access */}
        <div className={!hasMarketplaceAccess ? 'blur-sm pointer-events-none' : ''}>
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
          <div className="space-y-2 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              {t('marketplace.title', 'Psychologist Marketplace')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('marketplace.subtitle', 'Find and connect with verified psychologists specialized in your needs')}
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
                    {loading ? t('marketplace.searching', 'Searching...') : `${psychologists.length} ${t('marketplace.psychologistsFound', 'psychologist(s) found')}`}
                  </span>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <Alert className="mb-6">
                  <AlertDescription>
                    {t('marketplace.errorLoading', 'Error loading psychologists')}: {error}
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
                          {t('marketplace.noPsychologistsFound', 'No psychologists found')}
                        </h3>
                        <p className="text-gray-600">
                          {t('marketplace.adjustFilters', 'Try adjusting your search filters to find more results')}
                        </p>
                      </div>
                      <Button variant="outline" onClick={clearFilters}>
                        <Filter className="h-4 w-4 mr-2" />
                        {t('marketplace.clearFilters', 'Clear Filters')}
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
      </div>
    </PatientLayout>
  );
}