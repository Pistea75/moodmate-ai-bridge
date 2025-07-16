import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Loader2, Settings, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function SubscriptionStatus() {
  const { subscription, loading, checkSubscription, openCustomerPortal } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      console.error('Failed to open customer portal:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading subscription status...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Subscription Status</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkSubscription}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant={subscription.subscribed ? 'default' : 'secondary'}>
            {subscription.subscribed ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {subscription.subscription_tier && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Plan:</span>
            <Badge variant="outline" className="capitalize">
              {subscription.subscription_tier}
            </Badge>
          </div>
        )}

        {subscription.subscription_end && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Renews:</span>
            <span className="text-sm">
              {format(new Date(subscription.subscription_end), 'MMM dd, yyyy')}
            </span>
          </div>
        )}

        {subscription.subscribed && (
          <Button 
            onClick={handleManageSubscription}
            className="w-full gap-2"
          >
            <Settings className="w-4 h-4" />
            Manage Subscription
          </Button>
        )}
      </div>
    </Card>
  );
}