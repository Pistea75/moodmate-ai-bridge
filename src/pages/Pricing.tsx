
import { PublicNav } from '@/components/PublicNav';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight, Star, Zap } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started with your mental health journey",
    features: [
      "Basic AI companion access",
      "Mood tracking",
      "5 chat sessions per month",
      "Basic analytics",
      "Community support"
    ],
    buttonText: "Get Started Free",
    buttonLink: "/signup/patient",
    popular: false,
    gradient: "from-slate-500 to-slate-600"
  },
  {
    name: "Personal",
    price: "$29",
    period: "/month",
    description: "Comprehensive mental health support for individuals",
    features: [
      "Unlimited AI companion",
      "Advanced mood analytics",
      "Unlimited chat sessions",
      "Crisis support access",
      "Therapist matching",
      "2 video sessions/month",
      "Progress reports",
      "Mobile app access"
    ],
    buttonText: "Start Personal Plan",
    buttonLink: "/signup/patient",
    popular: true,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For mental health professionals and clinics",
    features: [
      "Everything in Personal",
      "Patient management dashboard",
      "Unlimited video sessions",
      "Advanced analytics suite",
      "Custom AI training",
      "White-label options",
      "Priority support",
      "API access"
    ],
    buttonText: "Start Professional",
    buttonLink: "/signup/clinician",
    popular: false,
    gradient: "from-blue-500 to-cyan-500"
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-slate-900">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <Zap className="h-4 w-4" />
            Simple, Transparent Pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Choose the perfect plan
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              for your wellness journey
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as your needs grow. All plans include our core AI companion 
            and basic mental health tracking features.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative border-0 bg-slate-700/50 backdrop-blur-md border border-slate-600/50 shadow-lg hover:shadow-2xl transition-all duration-500 ${
                plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <span className="text-2xl font-bold text-white">{plan.name.charAt(0)}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-300">{plan.period}</span>}
                  </div>
                  <p className="text-slate-300 mb-6">{plan.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to={plan.buttonLink} className="block">
                    <Button className={`w-full py-3 font-semibold rounded-full text-lg transition-all duration-300 transform hover:scale-105 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                        : 'bg-white text-slate-900 hover:bg-slate-100'
                    }`}>
                      {plan.buttonText}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Got questions about our pricing? We've got answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Can I change plans anytime?</h3>
                <p className="text-slate-300">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Is there a free trial?</h3>
                <p className="text-slate-300">Yes! The Starter plan is completely free forever. Paid plans come with a 14-day free trial.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-white">What payment methods do you accept?</h3>
                <p className="text-slate-300">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Is my data secure?</h3>
                <p className="text-slate-300">Absolutely. We use bank-level encryption and are fully HIPAA compliant to protect your privacy.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Can I cancel anytime?</h3>
                <p className="text-slate-300">Yes, you can cancel your subscription at any time with no cancellation fees or penalties.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2 text-white">Do you offer discounts?</h3>
                <p className="text-slate-300">We offer student discounts, annual plan savings, and special rates for non-profit organizations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to transform your mental health?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who have already started their wellness journey with MoodMate.
          </p>
          <Link to="/signup/patient">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100 font-bold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
