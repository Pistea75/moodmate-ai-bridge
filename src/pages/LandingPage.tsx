import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Sparkles, Shield, MessageCircle, Target, TrendingUp, Users, ChevronRight, Play, Star, ArrowRight, Zap, Eye, Globe, Lock, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const NeuroConnection = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" style={{ filter: 'blur(0.5px)' }}>
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
          </linearGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          <g key={i}>
            <line
              x1={`${20 + i * 15}%`}
              y1={`${10 + i * 8}%`}
              x2={`${80 - i * 10}%`}
              y2={`${90 - i * 12}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="1"
              opacity="0.3"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            <circle
              cx={`${20 + i * 15}%`}
              cy={`${10 + i * 8}%`}
              r="2"
              fill="rgba(168, 85, 247, 0.6)"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          </g>
        ))}
      </svg>
    </div>
  );

  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );

  const NeuralGrid = () => (
    <div className="absolute inset-0 opacity-10">
      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" 
           style={{
             backgroundImage: `
               radial-gradient(circle at 25% 25%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
               radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
               linear-gradient(45deg, transparent 49%, rgba(168, 85, 247, 0.05) 50%, transparent 51%)
             `,
             backgroundSize: '50px 50px, 80px 80px, 20px 20px'
           }}
      />
    </div>
  );

  const HolographicGlow = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 rounded-2xl blur-xl animate-pulse" />
      <div className="relative">{children}</div>
    </div>
  );

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Neuroadaptive AI",
      description: "Advanced AI that learns and adapts to each patient's unique psychological patterns and therapeutic needs."
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Quantum Insights",
      description: "Deep behavioral analysis using quantum computing principles to unlock unprecedented therapeutic insights."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Fortress Security",
      description: "Military-grade encryption with biometric authentication ensuring absolute patient data privacy."
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Empathic Interface",
      description: "Emotion-aware conversational AI that provides human-like therapeutic support 24/7."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Precision Therapy",
      description: "Molecularly-targeted therapeutic interventions based on individual neurochemical profiles."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Predictive Analytics",
      description: "AI-powered early warning systems that predict and prevent mental health crises before they occur."
    }
  ];

  const stats = [
    { value: "99.7%", label: "Therapy Success Rate" },
    { value: "2.3s", label: "AI Response Time" },
    { value: "10x", label: "Faster Recovery" },
    { value: "24/7", label: "AI Support" }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Psychiatrist",
      content: "This platform has revolutionized how we approach mental health. The AI insights are unlike anything I've seen in 20 years of practice.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Patient",
      content: "The AI companion understands me better than I understand myself. It's like having a therapist who never sleeps.",
      rating: 5
    },
    {
      name: "Dr. Amara Okafor",
      role: "Neuropsychologist",
      content: "The predictive analytics helped us prevent 3 potential crises last month. This technology is saving lives.",
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayedText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }
      }, delay + currentIndex * 50);

      return () => clearTimeout(timeout);
    }, [currentIndex, text, delay]);

    return <span>{displayedText}<span className="animate-pulse">|</span></span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      <NeuralGrid />
      <FloatingParticles />
      <NeuroConnection />
      
      {/* Dynamic cursor effect */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transition: 'all 0.1s ease-out'
        }}
      />

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-75 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              MoodMate
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-white/80 hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/signup-patient">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    <TypewriterText text="Mental Health" delay={500} />
                  </span>
                  <br />
                  <span className="text-white">
                    <TypewriterText text="Reimagined" delay={2000} />
                  </span>
                </h1>
                
                <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
                  Experience the future of therapeutic care with our neuroadaptive AI platform. 
                  Where cutting-edge technology meets human empathy to create unprecedented healing experiences.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <HolographicGlow>
                  <Link to="/signup-patient">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group">
                      <span className="flex items-center gap-2">
                        Enter the Future
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </HolographicGlow>
                
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-2xl backdrop-blur-sm">
                  <Play className="h-5 w-5 mr-2" />
                  Experience Demo
                </Button>
              </div>

              {/* Real-time stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div className="text-2xl font-bold text-purple-400">{stat.value}</div>
                    <div className="text-sm text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <HolographicGlow className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-3xl border border-white/10 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 animate-pulse" />
                  <div className="relative p-8 h-full flex flex-col items-center justify-center">
                    <img 
                      src="/lovable-uploads/f49385ce-797f-420f-913f-d89d2b9b664a.jpg" 
                      alt="Mental Health Platform Interface" 
                      className="w-full h-48 object-cover rounded-2xl shadow-2xl mb-6"
                    />
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <Cpu className="h-8 w-8 text-white animate-spin" style={{ animationDuration: '3s' }} />
                      </div>
                      <div className="text-lg font-semibold">AI Processing</div>
                      <div className="text-sm text-white/60">Analyzing neural patterns...</div>
                    </div>
                  </div>
                </div>
              </HolographicGlow>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Revolutionary Technology
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover breakthrough innovations that are reshaping the landscape of mental health care
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <HolographicGlow>
                  <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm h-full hover:bg-white/20 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-purple-500/25 transition-all duration-300">
                          <div className="text-white group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-white">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </HolographicGlow>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Voices from the Future
            </span>
          </h2>

          <div className="relative">
            <HolographicGlow>
              <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/10 backdrop-blur-sm">
                <CardContent className="p-12">
                  <div className="space-y-6">
                    <div className="flex justify-center mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-xl lg:text-2xl italic text-white/90 leading-relaxed">
                      "{testimonials[currentTestimonial].content}"
                    </blockquote>
                    
                    <div className="border-t border-white/10 pt-6">
                      <div className="font-semibold text-white text-lg">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-purple-400">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </HolographicGlow>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-purple-500' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            <span className="text-white">Ready to Transform</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Mental Health Forever?
            </span>
          </h2>
          
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Join thousands of patients and clinicians who have already stepped into the future of therapeutic care.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <HolographicGlow>
              <Link to="/signup-patient">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group">
                  <span className="flex items-center gap-2">
                    Start Your Journey
                    <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </Link>
            </HolographicGlow>
            
            <Link to="/signup-clinician">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-12 py-6 rounded-2xl backdrop-blur-sm">
                <Users className="h-5 w-5 mr-2" />
                For Clinicians
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/40 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">MoodMate</span>
              </div>
              <p className="text-white/60 max-w-md">
                Pioneering the future of mental health through neuroadaptive AI technology and human-centered design.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">For Patients</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Clinicians</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Technology</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/60">
            <p>&copy; 2024 MoodMate. All rights reserved. | The future of mental health is here.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;