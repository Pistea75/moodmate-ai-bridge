import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Shield, 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  ArrowRight,
  Heart,
  Zap,
  Award,
  Sparkles,
  Activity,
  Globe,
  Target,
  BarChart3,
  Lightbulb,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

const AnimatedCounter = ({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const increment = target / 100;
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= target) {
          clearInterval(timer);
          return target;
        }
        return Math.min(prev + increment, target);
      });
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  
  return <span>{prefix}{Math.floor(count)}{suffix}</span>;
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { icon: any; title: string; description: string; delay?: number }) => (
  <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm bg-card/80" style={{ animationDelay: `${delay}ms` }}>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <CardHeader className="relative">
      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
      <CardDescription className="text-base leading-relaxed">
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
);

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div 
    className="animate-bounce" 
    style={{ 
      animationDelay: `${delay}ms`,
      animationDuration: '3s',
      animationIterationCount: 'infinite'
    }}
  >
    {children}
  </div>
);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('animate-fade-in');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-bounce delay-500" />
      </div>

      {/* Header */}
      <nav className="relative z-50 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Brain className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-ping" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MoodMate
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="hover:bg-primary/10 hover:border-primary">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
                    Get Started
                  </Button>
                </Link>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
              <Link to="/features" className="block text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link to="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/login">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary">Get Started</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <FloatingElement delay={0}>
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-4 h-4 mr-2" />
              Revolutionary AI-Powered Mental Health Platform
            </Badge>
          </FloatingElement>
          
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                Mental Health
              </span>
              <span className="block mt-2 text-foreground">
                Reimagined
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the future of mental healthcare with our AI-powered platform that connects 
              <span className="text-primary font-semibold"> patients</span> and 
              <span className="text-secondary font-semibold"> clinicians</span> through 
              intelligent insights, personalized care, and continuous support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup/patient">
                <Button size="lg" className="min-w-[250px] h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                  <Users className="w-6 h-6 mr-3" />
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </Link>
              
              <Link to="/signup/clinician">
                <Button size="lg" variant="outline" className="min-w-[250px] h-14 text-lg border-2 border-primary/30 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300">
                  <Award className="w-6 h-6 mr-3" />
                  Join as Clinician
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-10 opacity-20">
          <FloatingElement delay={500}>
            <Brain className="w-12 h-12 text-primary" />
          </FloatingElement>
        </div>
        <div className="absolute top-40 right-10 opacity-20">
          <FloatingElement delay={1000}>
            <Heart className="w-10 h-10 text-secondary" />
          </FloatingElement>
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <FloatingElement delay={1500}>
            <Zap className="w-8 h-8 text-accent" />
          </FloatingElement>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 animate-on-scroll">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 50000, suffix: "+", label: "Active Users" },
            { value: 2500, suffix: "+", label: "Clinicians" },
            { value: 98, suffix: "%", label: "Satisfaction Rate" },
            { value: 24, suffix: "/7", label: "AI Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 animate-on-scroll">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Lightbulb className="w-4 h-4 mr-2" />
            Revolutionary Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            The Future of Mental Healthcare
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our AI-powered platform is transforming mental health support through innovative technology and personalized care.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={MessageCircle}
            title="AI Emotional Support"
            description="Our advanced AI provides 24/7 emotional support with personalized conversations trained on best therapeutic practices."
            delay={0}
          />
          <FeatureCard 
            icon={BarChart3}
            title="Advanced Analytics"
            description="Real-time mood tracking and comprehensive analytics help clinicians make data-driven treatment decisions."
            delay={100}
          />
          <FeatureCard 
            icon={Shield}
            title="Bank-Level Security"
            description="HIPAA-compliant platform with end-to-end encryption ensures your data is always protected and secure."
            delay={200}
          />
          <FeatureCard 
            icon={Target}
            title="Personalized Care Plans"
            description="AI-generated treatment plans adapted to individual patient needs and progress patterns."
            delay={300}
          />
          <FeatureCard 
            icon={Activity}
            title="Real-Time Monitoring"
            description="Continuous health monitoring with intelligent alerts for clinicians when immediate attention is needed."
            delay={400}
          />
          <FeatureCard 
            icon={Globe}
            title="Global Accessibility"
            description="Available worldwide with multi-language support and culturally sensitive AI responses."
            delay={500}
          />
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20 animate-on-scroll">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Experience MoodMate in Action</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            See how our platform transforms the mental health experience for both patients and clinicians.
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 text-left hover:bg-card/80 transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse" />
                  <span className="text-sm text-muted-foreground">AI Assistant Active</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-primary/10 rounded-lg p-3 ml-8">
                    <p className="text-sm">"I'm feeling anxious about my upcoming presentation..."</p>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-3 mr-8">
                    <p className="text-sm">"I understand you're feeling anxious. Let's try a breathing exercise together. Can you take a deep breath with me?"</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 text-left hover:bg-card/80 transition-all duration-300">
                <h3 className="font-semibold mb-3">Clinician Dashboard</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Patient Risk Assessment</span>
                    <Badge variant="outline" className="text-xs">Low Risk</Badge>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-12 backdrop-blur-sm">
                <div className="text-center">
                  <Brain className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse" />
                  <h3 className="text-2xl font-bold mb-4">AI-Powered Insights</h3>
                  <p className="text-muted-foreground mb-6">Our AI analyzes patterns, predicts needs, and provides personalized recommendations.</p>
                  <Button variant="outline" className="bg-background/50 hover:bg-background/80">
                    <Sparkles className="w-4 h-4 mr-2" />
                    See Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 animate-on-scroll">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Trusted by Thousands</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what mental health professionals and patients are saying about MoodMate.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "MoodMate has revolutionized how I provide care to my patients. The AI insights are incredibly accurate and helpful.",
              author: "Dr. Sarah Chen",
              role: "Clinical Psychologist",
              rating: 5
            },
            {
              quote: "The 24/7 support has been a game-changer for my mental health journey. I always feel supported and understood.",
              author: "Maria Rodriguez",
              role: "Patient",
              rating: 5
            },
            {
              quote: "As a busy clinician, MoodMate helps me stay connected with my patients between sessions. The platform is intuitive and powerful.",
              author: "Dr. Michael Thompson",
              role: "Psychiatrist",
              rating: 5
            }
          ].map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to Transform Mental Healthcare?
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of patients and clinicians who are already experiencing the future of mental health support.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup/patient">
                <Button size="lg" className="min-w-[250px] h-14 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
                  <Heart className="w-6 h-6 mr-3" />
                  Start Your Journey
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="min-w-[250px] h-14 text-lg border-2 border-primary/30 hover:bg-primary/10 hover:border-primary hover:scale-105 transition-all duration-300">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">MoodMate</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-sm">
                Revolutionizing mental healthcare through AI-powered insights, personalized care, and continuous support for patients and clinicians worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MoodMate. All rights reserved. Made with ❤️ for mental health.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}