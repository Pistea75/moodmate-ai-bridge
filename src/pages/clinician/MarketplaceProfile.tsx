import { usePsychologistProfile } from '@/hooks/usePsychologistProfile';
import { MarketplaceProfileForm } from '@/components/clinician/MarketplaceProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

export default function MarketplaceProfile() {
  const { profile, loading, saving, saveProfile } = usePsychologistProfile();

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Marketplace Profile</h1>
        <p className="text-muted-foreground">
          Manage your public profile that patients see in the marketplace
        </p>
      </div>

      {profile.is_visible_marketplace && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">Profile Active</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Your profile is visible in the marketplace and patients can find you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>Status:</span>
                <Badge variant={profile.is_accepting_patients ? "default" : "secondary"}>
                  {profile.is_accepting_patients ? "Accepting Patients" : "Not Accepting"}
                </Badge>
              </div>
              {profile.hourly_rate > 0 && (
                <div>
                  <span>Rate: ${profile.hourly_rate}/hour</span>
                </div>
              )}
              {profile.specializations.length > 0 && (
                <div>
                  <span>{profile.specializations.length} specializations</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!profile.is_visible_marketplace && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-800">Profile Hidden</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              Your profile is not visible in the marketplace. Enable visibility below to start receiving patient inquiries.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <MarketplaceProfileForm
        profile={profile}
        loading={loading}
        saving={saving}
        onSave={saveProfile}
      />
    </div>
  );
}