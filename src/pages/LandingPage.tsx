import { PublicNav } from '@/components/PublicNav';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, MessageCircle, TrendingUp, Shield, Users, Zap, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {

  const chatMessages = [
    { sender: 'ai', message: "Hello! I'm your AI companion. How are you feeling today?" },
    { sender: 'user', message: "I've been feeling a bit anxious lately." },
    { sender: 'ai', message: "I understand. Can you tell me what might be causing this anxiety?" },
    { sender: 'user', message: "Work has been really stressful this week." },
    { sender: 'ai', message: "That sounds challenging. Let's explore some coping strategies together." }
  ];

  const moodData = [
    { day: 'Mon', mood: 6 },
    { day: 'Tue', mood: 7 },
    { day: 'Wed', mood: 5 },
    { day: 'Thu', mood: 8 },
    { day: 'Fri', mood: 9 },
    { day: 'Sat', mood: 8 },
    { day: 'Sun', mood: 7 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-300/30 to-pink-300/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-300/20 to-purple-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-300/20 to-purple-300/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center min-h-screen">
          {/* Left side - Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left lg:pr-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">Your AI-Powered</span>
                <br />
                <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                  Mental Health Ally
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                24/7 emotional support, real-time monitoring, and data-driven care — all in one intelligent platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup/patient">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/signup/clinician">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-purple-700 font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Join as Clinician
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5,000+</div>
                <p className="text-white/80 text-sm">Patients Helped</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50,000+</div>
                <p className="text-white/80 text-sm">AI Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">98%</div>
                <p className="text-white/80 text-sm">Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right side - AI Companion illustration */}
          <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative">
              {/* Main AI companion */}
              <div className="relative w-96 h-96 flex items-center justify-center">
                {/* Central AI figure */}
                <div className="relative z-10 w-48 h-64 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-32 h-32 bg-gradient-to-b from-purple-300 to-purple-500 rounded-full flex items-center justify-center">
                    <Brain className="h-16 w-16 text-white animate-pulse" />
                  </div>
                </div>
                
                {/* Floating elements around AI */}
                <div className="absolute top-10 -left-8 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center animate-float shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute bottom-10 -right-8 w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center animate-float shadow-lg" style={{ animationDelay: '1s' }}>
                  <Zap className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute top-1/2 -right-12 w-12 h-12 bg-pink-400 rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>

                <div className="absolute bottom-1/3 -left-12 w-12 h-12 bg-blue-400 rounded-2xl flex items-center justify-center animate-pulse shadow-lg" style={{ animationDelay: '1.5s' }}>
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              See <span className="text-purple-600">MoodMate</span> in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience how our AI companion and mood tracking work together to support your mental health journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Chat Demo */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">AI Chat Support</h3>
                  </div>
                  <p className="text-purple-100 mt-2">24/7 intelligent conversations</p>
                </div>
                
                <div className="p-6 h-80 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.sender === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-white text-gray-800 shadow-sm'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mood Tracking Demo */}
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Mood Tracking</h3>
                  </div>
                  <p className="text-blue-100 mt-2">Smart pattern recognition</p>
                </div>
                
                <div className="p-6 h-80 bg-gray-50">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>This Week</span>
                      <span className="text-green-600 font-medium">↗ Improving</span>
                    </div>
                      
                      <div className="h-32 flex items-end justify-between gap-2">
                        {moodData.map((data, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div 
                              className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-500"
                              style={{ height: `${(data.mood / 10) * 100}%` }}
                            />
                            <span className="text-xs text-gray-500 mt-2">{data.day}</span>
                          </div>
                        ))}
                      </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-blue-700">
                        <strong>AI Insight:</strong> Your mood has improved 25% this week! 
                        Keep up the great work with your daily routines.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Why Choose <span className="text-purple-600">MoodMate</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive mental health support powered by cutting-edge AI technology and human expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Brain,
                title: "AI-Powered Support",
                description: "24/7 intelligent conversations that understand your emotions and provide personalized guidance"
              },
              {
                icon: TrendingUp,
                title: "Smart Mood Tracking",
                description: "Advanced analytics to identify patterns and triggers in your mental health journey"
              },
              {
                icon: Users,
                title: "Professional Care",
                description: "Connect with licensed therapists and mental health professionals when you need human support"
              },
              {
                icon: Shield,
                title: "Privacy & Security",
                description: "Your mental health data is encrypted and protected with enterprise-grade security"
              },
              {
                icon: Zap,
                title: "Instant Insights",
                description: "Real-time analysis of your mood patterns with actionable recommendations"
              },
              {
                icon: Heart,
                title: "Holistic Approach",
                description: "Comprehensive care that addresses all aspects of your mental wellbeing"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Mental Health?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have improved their wellbeing with MoodMate's AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/patient">
              <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-xl">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/signup/clinician">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-700 font-semibold px-8 py-4 rounded-full">
                For Clinicians
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}