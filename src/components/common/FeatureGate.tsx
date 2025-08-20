import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeatureGateProps {
  capability: 'voiceChat' | 'advancedAnalytics' | 'prioritySupport' | 'customIntegrations';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FEATURE_REQUIREMENTS = {
  voiceChat: ['professional', 'enterprise'],
  advancedAnalytics: ['professional', 'enterprise'],
  prioritySupport: ['professional', 'enterprise'],
  customIntegrations: ['enterprise']
};

const FEATURE_NAMES = {
  voiceChat: 'Voice Chat',
  advancedAnalytics: 'Advanced Analytics',
  prioritySupport: 'Priority Support',
  customIntegrations: 'Custom Integrations'
};

export function FeatureGate({ capability, children, fallback }: FeatureGateProps) {
  const { subscription } = useSubscription();
  
  // Grant voice chat access to all users for testing/demo purposes
  if (capability === 'voiceChat') {
    return <>{children}</>;
  }
  
  const requiredPlans = FEATURE_REQUIREMENTS[capability];
  const hasAccess = subscription.subscribed && 
    subscription.subscription_tier && 
    requiredPlans.includes(subscription.subscription_tier);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const featureName = FEATURE_NAMES[capability];

  return (
    <Card className="p-6 text-center border-dashed">
      <div className="flex flex-col items-center gap-4">
        <Lock className="w-12 h-12 text-muted-foreground" />
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{featureName} - Premium Feature</h3>
          <p className="text-muted-foreground text-sm">
            {featureName} is available in higher tier plans.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="w-4 h-4" />
          <span>Available in: {requiredPlans.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')}</span>
        </div>

        <Button asChild>
          <Link to="/pricing">
            Upgrade Plan
          </Link>
        </Button>
      </div>
    </Card>
  );
}