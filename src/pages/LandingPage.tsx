
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Shield, 
  MessageCircle, 
  Heart,
  Zap,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
  ArrowRight,
  Users,
  Clock,
  Activity,
  Globe
} from 'lucide-react';

const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

const FloatingCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <div 
    className="transform transition-all duration-1000 hover:scale-105 hover:-translate-y-2"
    style={{ 
      animationDelay: `${delay}ms`,
    }}
  >
    {children}
  </div>
);

const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, delay + currentIndex * 50);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return <span>{displayText}</span>;
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden relative">
      {/* Interactive Background */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(155, 135, 245, 0.15) 0%, transparent 50%)`
        }}
      />
      
      <ParticleEffect />

      {/* Floating Geometric Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 border border-primary/20 rounded-full animate-spin-slow" />
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl rotate-45 animate-bounce" />
        <div className="absolute bottom-1/4 left-1/4 w-24 h-24 border-2 border-secondary/30 rotate-12 animate-pulse" />
      </div>

      {/* Header */}
      <nav className="relative z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Brain className="h-7 w-7 text-white" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MoodMate
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105">Features</Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105">Pricing</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105">Contact</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden md:flex">
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="hover:bg-primary/10 hover:border-primary transition-all duration-300">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
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
      <section className="relative container mx-auto px-4 py-24 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-6 px-6 py-3 text-base bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 mr-2" />
              The Future of Mental Healthcare is Here
            </Badge>
          </div>
          
          <div className="space-y-12">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
                <span className="block text-foreground mb-4">
                  Where Technology
                </span>
                <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  <TypewriterText text="Meets Humanity" delay={1000} />
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                MoodMate revolutionizes mental healthcare by seamlessly blending cutting-edge AI technology 
                with genuine human compassion. Experience personalized therapy that adapts to your unique journey, 
                24/7 support that truly understands you, and professional care that scales with your needs.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup/patient">
                <Button size="lg" className="min-w-[280px] h-16 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-110 group">
                  <Heart className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Begin Your Healing Journey
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/signup/clinician">
                <Button size="lg" variant="outline" className="min-w-[280px] h-16 text-lg border-2 border-primary/30 hover:bg-primary/10 hover:border-primary hover:scale-110 transition-all duration-500 group">
                  <Users className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Join Our Clinician Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Innovation
            </span>
            <span className="text-foreground"> That Cares</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature is designed with one goal: to make mental healthcare more accessible, 
            effective, and deeply human.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FloatingCard delay={0}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">AI That Listens</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Our AI companion learns your unique patterns, preferences, and needs. It's not just smart—it's empathetic, 
                  providing 24/7 support that feels genuinely human.
                </CardDescription>
              </CardHeader>
            </Card>
          </FloatingCard>

          <FloatingCard delay={200}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">Real-Time Insights</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Advanced analytics track your emotional patterns and progress, providing clinicians with deep insights 
                  to personalize your treatment journey.
                </CardDescription>
              </CardHeader>
            </Card>
          </FloatingCard>

          <FloatingCard delay={400}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">Unbreakable Security</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Bank-level encryption and HIPAA compliance ensure your most personal conversations remain 
                  completely private and secure.
                </CardDescription>
              </CardHeader>
            </Card>
          </FloatingCard>

          <FloatingCard delay={600}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">Always Available</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Mental health doesn't follow business hours. Our platform provides instant support 
                  whenever you need it most, day or night.
                </CardDescription>
              </CardHeader>
            </Card>
          </FloatingCard>

          <FloatingCard delay={800}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">Global Reach</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Connect with qualified mental health professionals worldwide, breaking down geographical 
                  barriers to quality care.
                </CardDescription>
              </CardHeader>
            </Card>
          </FloatingCard>

          <FloatingCard delay={1000}>
            <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors duration-300">Adaptive Learning</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Our AI continuously learns and evolves, becoming more effective at understanding 
                  and supporting your unique mental health journey.
                </CardDescription>
              </CardHeader>
            </Card>
          </FloatingCard>
        </div>
      </section>

      {/* Innovation Showcase */}
      <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Built for the <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Future</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            MoodMate represents the next evolution in mental healthcare—where artificial intelligence 
            enhances human connection rather than replacing it.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                <TypewriterText text="24/7" delay={2000} />
              </div>
              <div className="text-lg text-muted-foreground">AI Support Available</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                <TypewriterText text="∞" delay={2500} />
              </div>
              <div className="text-lg text-muted-foreground">Personalized Experiences</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                <TypewriterText text="100%" delay={3000} />
              </div>
              <div className="text-lg text-muted-foreground">Privacy Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Transform
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your Mental Health Journey?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join the revolution in mental healthcare. Experience the perfect blend of AI innovation 
              and human compassion that's changing lives every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/signup/patient">
                <Button size="lg" className="min-w-[280px] h-16 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-110 group">
                  <Heart className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                  Start Your Journey Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/80 backdrop-blur-lg py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-70" />
                  <div className="relative w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Brain className="h-7 w-7 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  MoodMate
                </span>
              </Link>
              <p className="text-muted-foreground text-base max-w-md leading-relaxed">
                Revolutionizing mental healthcare through the perfect fusion of artificial intelligence 
                and human compassion. Where technology meets humanity to create better mental health outcomes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <ul className="space-y-3 text-base">
                <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors duration-300">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors duration-300">Pricing</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-primary transition-colors duration-300">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <ul className="space-y-3 text-base">
                <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors duration-300">Help Center</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-300">Contact</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors duration-300">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Legal</h3>
              <ul className="space-y-3 text-base">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300">Terms of Service</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300">About</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-base text-muted-foreground">
            <p>&copy; 2024 MoodMate. All rights reserved. Made with ❤️ for mental health innovation.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
