
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, MessageCircle, TrendingUp, Shield, Users, Heart, Zap, Clock, Target, Star } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
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
              <Button className="bg-cyan-400 hover:bg-cyan-500 text-purple-900 font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-12">
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
                  <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 text-purple-900 font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Your Journey
                  </Button>
                </Link>
                
                <Link to="/signup-clinician">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full backdrop-blur-sm font-semibold">
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

            {/* Hero Illustration */}
            <div className="relative flex justify-center">
              <div className="relative w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="w-80 h-80 bg-gradient-to-br from-cyan-300 to-purple-400 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="h-12 w-12 text-white animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">AI Companion</h3>
                    <p className="text-white/90 px-4">Always here for you</p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-10 left-10 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-2xl">😊</span>
                </div>
                <div className="absolute bottom-16 right-8 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="absolute top-1/3 right-4 w-14 h-14 bg-pink-400 rounded-xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            Reimagining Mental Health
            <br />
            <span className="text-cyan-300">Access & Continuity</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {problemSolutions.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-red-300 text-lg font-semibold mb-4">
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

      {/* Features Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              <span className="text-cyan-300">Revolutionary</span> Features
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Experience the future of mental healthcare with our cutting-edge AI technology
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
      <section className="relative px-6 py-20 bg-gradient-to-r from-cyan-600/30 to-purple-600/30 backdrop-blur-sm">
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
              <Button size="lg" className="bg-cyan-400 hover:bg-cyan-500 text-purple-900 font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
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
      <footer className="relative bg-purple-900/50 backdrop-blur-sm px-6 py-12">
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
