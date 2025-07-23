
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNav } from '@/components/PublicNav';
import { DemoSection } from '@/components/landing/DemoSection';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, MessageCircle, TrendingUp, Shield, Users, Zap, Heart, Star } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-hero-primary via-hero-secondary to-hero-accent overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-hero-glow/30 to-hero-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-hero-secondary/20 to-hero-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-hero-glow/20 to-hero-accent/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center min-h-screen">
          {/* Left side - Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left lg:pr-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white">Transform Your</span>
                <br />
                <span className="bg-gradient-to-r from-white via-hero-glow to-white bg-clip-text text-transparent">
                  Mental Health
                </span>
                <br />
                <span className="text-white">Journey</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                AI-powered support, real-time mood tracking, and professional care - all integrated into one seamless platform designed for your wellbeing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup/patient">
                <Button size="lg" className="bg-white text-hero-primary hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Start Your Journey
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white text-white hover:bg-white hover:text-hero-primary font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Watch Demo
              </Button>
            </div>

            {/* Features highlight */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">AI Support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Mood Tracking</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <p className="text-white/80 text-sm font-medium">Expert Care</p>
              </div>
            </div>
          </div>

          {/* Right side - Modern illustration */}
          <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="relative">
              {/* Main container */}
              <div className="relative w-96 h-96 flex items-center justify-center">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-full blur-3xl animate-pulse" />
                
                {/* Phone mockup */}
                <div className="relative z-10 w-64 h-80 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4">
                  <div className="w-full h-full bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                    {/* Chat interface preview */}
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="w-10 h-10 bg-hero-primary rounded-full flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">MoodMate AI</p>
                        <p className="text-xs text-gray-500">Online</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
                        <p className="text-sm text-gray-700">How are you feeling today?</p>
                      </div>
                      <div className="bg-hero-primary rounded-2xl p-3 max-w-[80%] ml-auto text-right">
                        <p className="text-sm text-white">Much better, thank you!</p>
                      </div>
                    </div>
                    
                    {/* Mood chart preview */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-medium text-gray-600">This Week</p>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="h-20 bg-gradient-to-r from-hero-primary/20 to-hero-accent/20 rounded-lg flex items-end justify-between p-2">
                        {[60, 70, 80, 90, 85, 95, 88].map((height, i) => (
                          <div
                            key={i}
                            className="bg-hero-primary rounded-sm w-4"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-10 -left-8 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center animate-float border border-white/20">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute bottom-10 -right-8 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center animate-float border border-white/20" style={{ animationDelay: '1s' }}>
                  <Heart className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute top-1/2 -right-12 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse border border-white/20">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Brodi Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Brodi Character */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* 3D Brodi Character Container */}
                <div className="w-80 h-96 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-3xl blur-2xl transform rotate-6"></div>
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {/* Actual Brodi Image */}
                    <div className="relative animate-float">
                      <img 
                        src="/lovable-uploads/619f204f-5934-420a-8d58-dcc54b8b176c.png" 
                        alt="Brodi - Your AI wellness companion"
                        className="w-64 h-64 object-contain drop-shadow-2xl"
                      />
                      
                      {/* Floating hearts */}
                      <div className="absolute -top-4 -right-6 animate-float">
                        <Heart className="h-4 w-4 text-pink-400 fill-pink-400" />
                      </div>
                      <div className="absolute top-2 -left-8 animate-float" style={{ animationDelay: '1s' }}>
                        <Zap className="h-3 w-3 text-yellow-400" />
                      </div>
                      <div className="absolute -bottom-2 right-8 animate-pulse">
                        <Star className="h-3 w-3 text-purple-400 fill-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Speech bubble */}
                <div className="absolute -top-4 -right-12 bg-white rounded-2xl p-4 shadow-xl border border-purple-100 max-w-xs">
                  <div className="absolute bottom-0 left-8 w-4 h-4 bg-white transform rotate-45 translate-y-2 border-r border-b border-purple-100"></div>
                  <p className="text-sm text-gray-700 font-medium">
                    "Hi! I'm Brodi, your AI wellness companion. I'm here to support your mental health journey!"
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Brodi's Story */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  Meet <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Brodi</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Your AI wellness companion, designed with care and compassion
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
                  <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    Born from Compassion
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Brodi was created by a team of mental health professionals and AI researchers who understood that healing requires both intelligence and empathy. Named after the gentle, nurturing qualities we all need during difficult times.
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
                  <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Designed to Understand
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    With advanced emotional intelligence and thousands of hours of training with real mental health conversations, Brodi learns to recognize patterns, offer support, and provide gentle nudges toward wellness.
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
                  <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Always Growing
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Just like you, Brodi is on a journey of continuous growth. Every interaction helps him become more helpful, more understanding, and more attuned to what you need for your unique wellness path.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link to="/signup/patient">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Start Chatting with Brodi
                  </Button>
                </Link>
                <Button variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-6 py-3 rounded-full transition-all duration-300">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection />

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
              Why Choose <span className="text-hero-primary">MoodMate</span>?
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
                  <div className="w-16 h-16 bg-gradient-to-br from-hero-primary to-hero-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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
      <section className="py-20 bg-gradient-to-r from-hero-primary to-hero-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Transform Your Mental Health?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have improved their wellbeing with MoodMate's AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/patient">
              <Button size="lg" className="bg-white text-hero-primary hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-xl">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/signup/clinician">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-hero-primary font-semibold px-8 py-4 rounded-full">
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
