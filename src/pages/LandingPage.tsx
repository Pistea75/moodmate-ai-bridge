
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, MessageCircle, TrendingUp, Shield, Users, Heart, Zap, Clock, Target, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [counters, setCounters] = useState({ patients: 0, sessions: 0, satisfaction: 0 });

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Mental Health Support",
      description: "24/7 emotional support with advanced AI trained in CBT, DBT, and ACT therapeutic approaches."
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Real-Time Monitoring",
      description: "Continuous mood tracking and sentiment analysis to provide immediate support when needed."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Data-Driven Care",
      description: "Adaptive care plans that evolve based on patient behavior and treatment progress."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "End-to-end encryption ensuring your mental health data remains completely confidential."
    }
  ];

  const problemSolutions = [
    {
      problem: "Gaps between therapy sessions",
      solution: "24/7 AI support trained in CBT, DBT, ACT"
    },
    {
      problem: "Emotional crises at odd hours", 
      solution: "Instant crisis intervention & support"
    },
    {
      problem: "Treatment personalization",
      solution: "Adaptive care plans based on patient behavior"
    },
    {
      problem: "Limited access to quality care",
      solution: "Real-time data & sentiment analysis reports"
    }
  ];

  const benefits = [
    "Improved Outcomes",
    "Privacy-First Approach", 
    "Better Patient Experience",
    "24/7 Availability",
    "Evidence-Based Care",
    "Seamless Integration"
  ];

  useEffect(() => {
    // Animate counters
    const animateCounter = (target: number, key: keyof typeof counters) => {
      let current = 0;
      const increment = target / 100;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, 20);
    };

    animateCounter(5000, 'patients');
    animateCounter(50000, 'sessions');
    animateCounter(98, 'satisfaction');

    // Rotate features
    const featureTimer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(featureTimer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-blue-700 text-white overflow-hidden relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              MoodMate
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white/80 hover:text-white transition-colors px-4 py-2">
              Login
            </Link>
            <Link to="/signup-patient">
              <Button className="bg-cyan-400 hover:bg-cyan-300 text-purple-900 font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Your AI-Powered
                  <br />
                  <span className="text-cyan-300">Mental Health Ally</span>
                </h1>
                
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  24/7 emotional support, real-time monitoring, and data-driven care — all in one intelligent platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup-patient">
                  <Button size="lg" className="bg-cyan-400 hover:bg-cyan-300 text-purple-900 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-w-[200px]">
                    Start Your Journey
                  </Button>
                </Link>
                
                <Link to="/signup-clinician">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full backdrop-blur-sm font-semibold min-w-[180px]">
                    Join as Clinician
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">{counters.patients.toLocaleString()}+</div>
                  <div className="text-sm text-white/70">Patients Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">{counters.sessions.toLocaleString()}+</div>
                  <div className="text-sm text-white/70">AI Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-300">{counters.satisfaction}%</div>
                  <div className="text-sm text-white/70">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Hero Illustration - Inspired by the reference image */}
            <div className="relative flex justify-center">
              <div className="relative">
                {/* Main illustration container */}
                <div className="relative w-96 h-96 flex items-center justify-center">
                  {/* Background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse" />
                  
                  {/* Person holding AI companion - Simplified illustration */}
                  <div className="relative z-10 text-center space-y-6">
                    {/* Person illustration */}
                    <div className="relative">
                      <div className="w-48 h-64 mx-auto relative">
                        {/* Body */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-3xl" />
                        
                        {/* Head */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full" />
                        
                        {/* Hair */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-purple-800 to-purple-700 rounded-full" />
                        
                        {/* Face features */}
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                          {/* Eyes */}
                          <div className="flex space-x-2 justify-center mb-2">
                            <div className="w-1 h-1 bg-purple-900 rounded-full" />
                            <div className="w-1 h-1 bg-purple-900 rounded-full" />
                          </div>
                          {/* Smile */}
                          <div className="w-3 h-1 bg-purple-900 rounded-full mx-auto" />
                        </div>

                        {/* AI Companion being held */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                            {/* AI face */}
                            <div className="text-center">
                              <div className="flex space-x-1 justify-center mb-1">
                                <div className="w-1 h-1 bg-purple-700 rounded-full" />
                                <div className="w-1 h-1 bg-purple-700 rounded-full" />
                              </div>
                              <div className="w-2 h-0.5 bg-purple-700 rounded-full mx-auto" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-400/80 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                  <Heart className="h-8 w-8 text-purple-700" />
                </div>
                <div className="absolute bottom-16 right-8 w-12 h-12 bg-green-400/80 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-1/3 right-4 w-14 h-14 bg-pink-400/80 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section - Matching the reference style */}
      <section className="relative px-6 py-16 bg-purple-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Reimagining Mental Health
            <br />
            <span className="text-cyan-300">Access & Continuity</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-6xl mx-auto">
            {problemSolutions.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all">
                <div className="text-red-200 text-lg font-semibold mb-4">
                  {item.problem}
                </div>
                <div className="text-cyan-300 text-lg font-semibold">
                  {item.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Why Choose <span className="text-cyan-300">MoodMate</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experience the future of mental healthcare with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-6 flex items-center space-x-4">
                  <CheckCircle className="h-6 w-6 text-cyan-300 flex-shrink-0" />
                  <span className="text-white font-medium">{benefit}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-16 bg-purple-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              <span className="text-cyan-300">Revolutionary</span> Features
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Cutting-edge AI technology combined with human expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">
            Ready to Transform Your
            <br />
            <span className="text-cyan-300">Mental Health Journey?</span>
          </h2>
          
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands who have already discovered a new way to access quality mental healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/signup-patient">
              <Button size="lg" className="bg-cyan-400 hover:bg-cyan-300 text-purple-900 font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Heart className="h-5 w-5 mr-2" />
                Start Your Journey
              </Button>
            </Link>
            
            <Link to="/signup-clinician">
              <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 rounded-full backdrop-blur-sm font-semibold">
                <Users className="h-5 w-5 mr-2" />
                For Clinicians
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-purple-900/50 backdrop-blur-sm px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">MoodMate</span>
              </div>
              <p className="text-white/70 max-w-md">
                Revolutionizing mental healthcare through AI-powered support and human-centered design.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">For Patients</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Clinicians</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2024 MoodMate. All rights reserved. Transforming mental healthcare with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
