import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Refresh subscription status after successful payment
    const refreshSubscription = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s for Stripe webhook
      await checkSubscription();
    };
    refreshSubscription();
  }, [checkSubscription]);

  const getPlanDetails = (planType: string | null) => {
    switch (planType) {
      case 'personal':
        return {
          name: 'Personal Plan',
          features: ['Unlimited messages with Brodi', 'Access to psychologist marketplace', 'Monthly workshops']
        };
      case 'professional_basic':
        return {
          name: 'Professional Basic',
          features: ['Up to 30 patients', 'Patient management dashboard', 'Points system']
        };
      case 'professional_advanced':
        return {
          name: 'Professional Advanced',
          features: ['Up to 50 patients', 'Advanced analytics', 'API access']
        };
      default:
        return {
          name: 'Plan',
          features: ['Premium features activated']
        };
    }
  };

  const planDetails = getPlanDetails(plan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-green-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Subscription Successful!</h1>
            <p className="text-gray-600">
              Welcome to the {planDetails.name}
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Your Benefits</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-700">
              {planDetails.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Your subscription is now active and ready to use.
            </p>
            
            <div className="space-y-2">
              <Link to="/patient/dashboard">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/patient/chat">
                <Button variant="outline" className="w-full border-green-200 text-green-600 hover:bg-green-50">
                  Start Chatting with Brodi
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}