
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
  Sparkles,
  ArrowRight,
  Star,
  Heart,
  Zap
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI Companion",
    description: "Advanced AI that understands your emotions and provides personalized support 24/7",
    benefits: [
      "Natural conversation flow",
      "Emotional intelligence",
      "Personalized responses",
      "Available anytime"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description: "Track patterns, triggers, and progress with intelligent insights and recommendations",
    benefits: [
      "Mood pattern recognition",
      "Trigger identification",
      "Progress tracking",
      "Predictive insights"
    ],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Expert Therapists",
    description: "Connect with licensed mental health professionals for personalized care",
    benefits: [
      "Licensed professionals",
      "Video sessions",
      "Treatment plans",
      "Secure messaging"
    ],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Bank-level encryption and HIPAA compliance ensure your data stays secure",
    benefits: [
      "End-to-end encryption",
      "HIPAA compliant",
      "Secure servers",
      "Privacy controls"
    ],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: MessageCircle,
    title: "Crisis Support",
    description: "Immediate intervention and emergency resources when you need them most",
    benefits: [
      "24/7 emergency line",
      "Immediate response",
      "Professional support",
      "Safety protocols"
    ],
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Clock,
    title: "Real-time Care",
    description: "Instant mood tracking and immediate feedback to support your wellbeing",
    benefits: [
      "Instant feedback",
      "Real-time monitoring",
      "Immediate alerts",
      "Continuous support"
    ],
    color: "from-indigo-500 to-purple-500"
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-slate-900">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-white font-semibold mb-8">
            <Sparkles className="h-4 w-4" />
            Platform Features
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Everything you need for
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              complete wellness
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Discover all the powerful features that make MoodMate the most comprehensive 
            mental health platform available.
          </p>
          
          <Link to="/signup/patient">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              Try Features Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group bg-slate-700/50 backdrop-blur-md border border-slate-600/50 hover:bg-slate-700 transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose MoodMate?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We've built the most comprehensive mental health platform with features 
              that actually make a difference in your daily life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Evidence-Based</h3>
                <p className="text-slate-300">All our features are grounded in clinical research and proven therapeutic methods.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Instant Impact</h3>
                <p className="text-slate-300">Start feeling the benefits immediately with our intuitive interface and smart features.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 bg-slate-800/50 backdrop-blur-md border border-slate-600/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Trusted Quality</h3>
                <p className="text-slate-300">Rated 5 stars by thousands of users and trusted by healthcare professionals worldwide.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to experience these features?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands who have transformed their mental health with MoodMate's powerful features.
          </p>
          <Link to="/signup/patient">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-slate-100 font-bold px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
