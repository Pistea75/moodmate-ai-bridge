
import { SubscriptionCard, subscriptionPlans } from '@/components/subscription/SubscriptionCard';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { PublicNav } from '../components/PublicNav';
import { useAuth } from '@/contexts/AuthContext';

export default function Pricing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Choose Your Mental Health Journey
            </h1>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Unlock the power of AI-driven mental health support with our flexible pricing plans designed to fit your needs
            </p>
          </div>
        </div>

        {/* Subscription Status for Logged-in Users */}
        {user && (
          <div className="container mx-auto px-4 py-8">
            <SubscriptionStatus />
          </div>
        )}

        {/* Pricing Cards */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id}>
                <SubscriptionCard plan={plan} />
              </div>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">AI Companion</h3>
                <p className="text-muted-foreground">24/7 intelligent support that learns and adapts to your needs</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">Detailed analytics and insights into your mental health journey</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">HIPAA-compliant security with end-to-end encryption</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
                <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">We offer a 7-day free trial for all new users to experience our platform risk-free.</p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
