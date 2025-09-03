import { usePsychologistProfile } from '@/hooks/usePsychologistProfile';
import { MarketplaceProfileForm } from '@/components/clinician/MarketplaceProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Store, TrendingUp, Users, Eye, DollarSign, Calendar, MessageSquare, Star } from 'lucide-react';
import ClinicianLayout from '../../layouts/ClinicianLayout';

export default function MarketplaceProfile() {
  const { profile, loading, saving, saveProfile } = usePsychologistProfile();

  if (!profile) {
    return (
      <ClinicianLayout>
        <div className="space-y-6 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </ClinicianLayout>
    );
  }

  return (
    <ClinicianLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Store className="h-8 w-8 text-primary" />
            Marketplace
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your professional profile and connect with patients
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
              </div>
            </CardContent>
          </Card>

           <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                   <MessageSquare className="h-5 w-5 text-primary" />
                 </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inquiries</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

           <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                   <Calendar className="h-5 w-5 text-primary" />
                 </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sessions Booked</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>

           <Card>
             <CardContent className="p-4">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-lg">
                   <Star className="h-5 w-5 text-primary" />
                 </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">4.9</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Status */}
        {profile.is_visible_marketplace ? (
          <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-800 dark:text-green-400">Profile Active</CardTitle>
                </div>
                <Badge variant="default" className="bg-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
              <CardDescription className="text-green-700 dark:text-green-300">
                Your profile is visible in the marketplace and patients can find you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Status:</span>
                  <Badge variant={profile.is_accepting_patients ? "default" : "secondary"}>
                    {profile.is_accepting_patients ? "Accepting Patients" : "Not Accepting"}
                  </Badge>
                </div>
                {profile.hourly_rate > 0 && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Rate: ${profile.hourly_rate}/hour</span>
                  </div>
                )}
                {profile.specializations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{profile.specializations.length} specializations</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-orange-800 dark:text-orange-400">Profile Hidden</CardTitle>
              </div>
              <CardDescription className="text-orange-700 dark:text-orange-300">
                Your profile is not visible in the marketplace. Enable visibility below to start receiving patient inquiries.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Activate Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Form - Takes up 2/3 of the space */}
          <div className="lg:col-span-2">
            <MarketplaceProfileForm
              profile={profile}
              loading={loading}
              saving={saving}
              onSave={saveProfile}
            />
          </div>

          {/* Sidebar Widgets - Takes up 1/3 of the space */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New patient inquiry</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profile viewed</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Session booked</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-400">Complete your bio</p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">Profiles with detailed bios get 3x more views</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">Add more specializations</p>
                  <p className="text-xs text-green-600 dark:text-green-300">Increase your discoverability</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-800 dark:text-purple-400">Upload a photo</p>
                  <p className="text-xs text-purple-600 dark:text-purple-300">Profiles with photos get more trust</p>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sessions</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Hours</span>
                  <span className="font-semibold">36</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Earnings</span>
                  <span className="font-semibold text-green-600">$3,240</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">+12% from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClinicianLayout>
  );
}