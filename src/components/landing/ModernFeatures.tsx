
import { Card, CardContent } from '@/components/ui/card';
import { Brain, TrendingUp, Users, Shield, MessageCircle, Clock, Heart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI Companion",
    description: "Advanced AI that understands your emotions and provides personalized support 24/7",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description: "Track patterns, triggers, and progress with intelligent insights and recommendations",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Expert Therapists",
    description: "Connect with licensed mental health professionals for personalized care",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Bank-level encryption and HIPAA compliance ensure your data stays secure",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: MessageCircle,
    title: "Crisis Support",
    description: "Immediate intervention and emergency resources when you need them most",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Clock,
    title: "Real-time Care",
    description: "Instant mood tracking and immediate feedback to support your wellbeing",
    color: "from-indigo-500 to-purple-500"
  }
];

export function ModernFeatures() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            Platform Features
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
            Everything you need for
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              complete wellness
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive platform combines cutting-edge AI technology with human expertise 
            to provide unparalleled mental health support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-slate-600">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            <span className="font-medium">Designed with care for your mental wellness journey</span>
          </div>
        </div>
      </div>
    </section>
  );
}
