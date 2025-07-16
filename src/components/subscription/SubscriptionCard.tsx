import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface SubscriptionCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    popular?: boolean;
    icon: React.ComponentType<{ className?: string }>;
  };
}

export function SubscriptionCard({ plan }: SubscriptionCardProps) {
  const { subscription, createCheckout } = useSubscription();
  const { user } = useAuth();

  const isCurrentPlan = subscription.subscription_tier === plan.id;
  const isPlanActive = subscription.subscribed && isCurrentPlan;

  const handleSubscribe = async () => {
    if (!user) return;
    
    try {
      await createCheckout(plan.id);
    } catch (error) {
      console.error('Failed to create checkout:', error);
    }
  };

  return (
    <Card className={`relative p-6 ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
        </div>
      )}
      
      <div className="text-center mb-6">
        <plan.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
        
        <div className="mb-4">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {user ? (
        <Button 
          onClick={handleSubscribe}
          disabled={isPlanActive}
          className={`w-full ${isPlanActive ? 'bg-green-600 hover:bg-green-700' : ''}`}
        >
          {isPlanActive ? '✓ Current Plan' : `Subscribe to ${plan.name}`}
        </Button>
      ) : (
        <Button asChild className="w-full">
          <Link to="/login">Sign up to Subscribe</Link>
        </Button>
      )}
    </Card>
  );
}

export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    description: 'Perfect for individuals starting their mental health journey',
    icon: Check,
    features: [
      '24/7 AI companion support',
      'Basic mood tracking',
      'Progress analytics',
      'Email support',
      'Mobile app access'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    description: 'For serious users who want advanced features',
    icon: Star,
    popular: true,
    features: [
      'Everything in Basic',
      'Advanced analytics & insights',
      'Priority support',
      'Custom AI personalization',
      'Unlimited sessions',
      'Export data',
      'Third-party integrations'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    description: 'For organizations and healthcare providers',
    icon: Crown,
    features: [
      'Everything in Professional',
      'Multi-user management',
      'Advanced compliance features',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom reporting',
      'White-label options'
    ]
  }
];