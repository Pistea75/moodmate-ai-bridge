
import { PublicNav } from '@/components/PublicNav';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Shield, 
  MessageCircle, 
  Clock, 
  Heart, 
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI Companion",
    description: "Advanced AI that understands your emotions and provides personalized support 24/7",
    color: "from-purple-500 to-pink-500",
    details: ["Natural conversation flow", "Emotional intelligence", "Personalized responses", "Crisis detection"]
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description: "Track patterns, triggers, and progress with intelligent insights and recommendations",
    color: "from-blue-500 to-cyan-500",
    details: ["Mood trend analysis", "Trigger identification", "Progress tracking", "Predictive insights"]
  },
  {
    icon: Users,
    title: "Expert Therapists",
    description: "Connect with licensed mental health professionals for personalized care",
    color: "from-green-500 to-emerald-500",
    details: ["Licensed professionals", "Video sessions", "Treatment plans", "Progress monitoring"]
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Bank-level encryption and HIPAA compliance ensure your data stays secure",
    color: "from-orange-500 to-red-500",
    details: ["End-to-end encryption", "HIPAA compliance", "Secure data storage", "Privacy controls"]
  },
  {
    icon: MessageCircle,
    title: "Crisis Support",
    description: "Immediate intervention and emergency resources when you need them most",
    color: "from-pink-500 to-rose-500",
    details: ["24/7 crisis hotline", "Emergency protocols", "Immediate intervention", "Safety planning"]
  },
  {
    icon: Clock,
    title: "Real-time Care",
    description: "Instant mood tracking and immediate feedback to support your wellbeing",
    color: "from-indigo-500 to-purple-500",
    details: ["Real-time monitoring", "Instant feedback", "Mood tracking", "Continuous support"]
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <Sparkles className="h-4 w-4" />
            Complete Feature Overview
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Everything you need for
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              complete wellness
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover how MoodMate's comprehensive platform combines cutting-edge AI technology 
            with human expertise to provide unparalleled mental health support.
          </p>
          <Link to="/signup/patient">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-bold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Every feature is designed to support your mental health journey with precision and care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Why Choose MoodMate?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              See how our features translate into real benefits for your mental health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Personalized Experience</h3>
                  <p className="text-slate-600">Every interaction is tailored to your unique mental health needs and preferences.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Always Available</h3>
                  <p className="text-slate-600">24/7 support means help is always there when you need it most.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Clinically Proven</h3>
                  <p className="text-slate-600">All our methods are based on evidence-based therapeutic practices.</p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Privacy Protected</h3>
                  <p className="text-slate-600">Your mental health data is secured with the highest standards of privacy and encryption.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Expert Support</h3>
                  <p className="text-slate-600">Access to licensed therapists when you need professional human guidance.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-900">Track Progress</h3>
                  <p className="text-slate-600">Visualize your mental health journey with detailed analytics and insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to experience the future of mental healthcare?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their mental health journey with MoodMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/patient">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100 font-bold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
