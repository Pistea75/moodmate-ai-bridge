
import { SubscriptionCard, subscriptionPlans } from '@/components/subscription/SubscriptionCard';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { PublicNav } from '../components/PublicNav';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Brain, MessageCircle, BarChart3, Shield, Users, Zap } from 'lucide-react';

export default function Pricing() {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI Companion",
      description: "24/7 intelligent support that learns and adapts to your needs"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Detailed analytics and insights into your mental health journey"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "HIPAA-compliant security with end-to-end encryption"
    },
    {
      icon: MessageCircle,
      title: "Clinician Connect",
      description: "Seamless communication with your healthcare providers"
    },
    {
      icon: Users,
      title: "Care Coordination",
      description: "Collaborative tools for your entire care team"
    },
    {
      icon: Zap,
      title: "Real-time Insights",
      description: "Instant feedback and personalized recommendations"
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Is there a free trial?",
      answer: "We offer a 7-day free trial for all new users to experience our platform risk-free."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise plans."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We're HIPAA compliant and use bank-level encryption to protect your sensitive health information."
    },
    {
      question: "Do you offer discounts for students or nonprofits?",
      answer: "Yes, we offer special pricing for students, educational institutions, and qualifying nonprofit organizations."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Choose Your Mental Health Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enterprise Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Enterprise Solutions</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Custom solutions for healthcare organizations, hospitals, and large practices. 
                  Get advanced analytics, white-label options, and dedicated support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                    Contact Sales
                  </Button>
                  <Button variant="outline" size="lg">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have improved their mental health with MoodMate's AI-powered platform.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Start Your Free Trial
            </Button>
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
