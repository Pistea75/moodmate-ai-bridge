import { PublicNav } from '@/components/PublicNav';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Heart, Brain, Award, Shield, Sparkles } from 'lucide-react';
export default function About() {
  return <div className="min-h-screen bg-background">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About MoodMate
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make mental healthcare accessible, personalized, and effective for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-slate-900">Our Mission</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Mental health shouldn't be a luxury. We believe everyone deserves access to 
              high-quality mental healthcare, regardless of location, time, or circumstances. 
              That's why we created MoodMate - to bridge the gap between traditional therapy 
              and the always-on support people need.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Compassionate Care</h3>
                <p className="text-slate-600">Every interaction is designed with empathy and understanding at its core.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Evidence-Based</h3>
                <p className="text-slate-600">Our AI is trained on proven therapeutic methods and clinical best practices.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Privacy First</h3>
                <p className="text-slate-600">Your mental health data is protected with the highest security standards.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-slate-900">Our Story</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">The Problem We Saw</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Traditional mental healthcare has gaps. Therapy sessions are limited to once a week, 
                    crisis support isn't always available when needed, and many people never get help 
                    because of barriers like cost, location, or stigma.
                  </p>
                </div>
                <div className="w-full md:w-1/3">
                  <div className="bg-red-100 rounded-2xl p-8 text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">1 in 4</div>
                    <p className="text-red-700 font-medium">People experience mental health issues</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">Our Solution</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We combined the best of AI technology with human expertise to create a platform 
                    that provides continuous support, personalized insights, and professional care 
                    when and where it's needed most.
                  </p>
                </div>
                <div className="w-full md:w-1/3">
                  <div className="bg-green-100 rounded-2xl p-8 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                    <p className="text-green-700 font-medium">AI support available</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900">The Impact</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Today, MoodMate serves over 50,000 users worldwide, helping people manage their 
                    mental health proactively and connecting them with professional care when needed. 
                    We're just getting started.
                  </p>
                </div>
                <div className="w-full md:w-1/3">
                  <div className="bg-purple-100 rounded-2xl p-8 text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                    <p className="text-purple-700 font-medium">User satisfaction rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          

          
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              These principles guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[{
            icon: Heart,
            title: "Empathy First",
            description: "We lead with compassion and understanding in every interaction."
          }, {
            icon: Shield,
            title: "Trust & Privacy",
            description: "Your data and privacy are sacred to us. We protect them fiercely."
          }, {
            icon: Award,
            title: "Clinical Excellence",
            description: "We maintain the highest standards of clinical care and evidence-based practice."
          }, {
            icon: Sparkles,
            title: "Innovation",
            description: "We continuously push the boundaries of what's possible in mental healthcare."
          }, {
            icon: Users,
            title: "Accessibility",
            description: "Mental healthcare should be available to everyone, everywhere."
          }, {
            icon: Brain,
            title: "Science-Based",
            description: "All our features are grounded in psychological research and clinical evidence."
          }].map((value, index) => <Card key={index} className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <CardContent className="p-8 text-center">
                  <value.icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>;
}