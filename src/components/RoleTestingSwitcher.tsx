import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';
import { Users, UserCheck, Crown } from 'lucide-react';
import { TestPatientSignup } from '@/components/auth/TestPatientSignup';

export function RoleTestingSwitcher() {
  const { user } = useAuth();
  const { userRole, isSuperAdmin } = useSecureRoleValidation(user);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'patient': return <Users className="h-4 w-4" />;
      case 'clinician': return <UserCheck className="h-4 w-4" />;
      case 'super_admin': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'patient': return 'secondary' as const;
      case 'clinician': return 'default' as const;
      case 'super_admin': return 'destructive' as const;
      default: return 'outline' as const;
    }
  };

  const getMarketplaceLink = () => {
    if (userRole === 'patient') {
      return '/patient/marketplace';
    } else if (userRole === 'clinician' || isSuperAdmin) {
      return '/clinician/marketplace-profile';
    }
    return null;
  };

  const marketplaceLink = getMarketplaceLink();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Current Role Status
            {getRoleIcon(userRole || 'unknown')}
          </CardTitle>
          <CardDescription>
            Your current role and marketplace access information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Current Role:</span>
            <Badge variant={getRoleBadgeVariant(userRole || 'unknown')}>
              {userRole?.toUpperCase() || 'UNKNOWN'}
            </Badge>
            {isSuperAdmin && (
              <Badge variant="destructive">SUPER ADMIN</Badge>
            )}
          </div>
          
          {marketplaceLink && (
            <div className="pt-2">
              <Button asChild className="w-full">
                <a href={marketplaceLink}>
                  {userRole === 'patient' ? 'Browse Marketplace' : 'Manage Marketplace Profile'}
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {(userRole === 'clinician' || isSuperAdmin) && (
        <Card>
          <CardHeader>
            <CardTitle>Test Patient Marketplace</CardTitle>
            <CardDescription>
              Create a test patient account to test the marketplace from a patient's perspective
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestPatientSignup />
          </CardContent>
        </Card>
      )}
    </div>
  );
}