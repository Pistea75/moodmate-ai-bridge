
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
  Users,
  Clock,
  Activity,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: any) => (
  <Card 
    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-700 bg-white/80 backdrop-blur-sm"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <CardHeader className="relative z-10">
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      <CardDescription className="text-base leading-relaxed">{description}</CardDescription>
    </CardHeader>
  </Card>
);

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Psychologist",
      content: "MoodMate has transformed how I provide care. The AI insights help me understand my patients better than ever before.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content: "Having 24/7 support when I need it most has been life-changing. The AI feels like talking to a real therapist.",
      rating: 5
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Psychiatrist",
      content: "The analytics and progress tracking give me unprecedented visibility into patient outcomes.",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      {/* Navigation */}
      <nav className="relative z-50 border-b bg-background/95 backdrop-blur-lg">
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
              <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" className="hover:bg-primary/10">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
              <Link to="/features" className="block text-muted-foreground hover:text-primary">Features</Link>
              <Link to="/pricing" className="block text-muted-foreground hover:text-primary">Pricing</Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary">About</Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary">Contact</Link>
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
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="outline" className="px-4 py-2 bg-primary/10 border-primary/20">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Mental Healthcare
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Mental Health
                  <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Reimagined
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Experience the future of mental healthcare with AI that understands, 
                  professionals who care, and support that's always there when you need it most.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup/patient">
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-secondary hover:shadow-xl">
                    <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/signup/clinician">
                  <Button size="lg" variant="outline" className="group border-primary/30 hover:bg-primary/10">
                    <Users className="w-5 h-5 mr-2" />
                    Join as Professional
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter target={10000} />+
                  </div>
                  <p className="text-sm text-muted-foreground">Lives Improved</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    <AnimatedCounter target={500} />+
                  </div>
                  <p className="text-sm text-muted-foreground">Professionals</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <p className="text-sm text-muted-foreground">AI Support</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/f49385ce-797f-420f-913f-d89d2b9b664a.jpg" 
                  alt="Mental Health Platform Interface" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl transform rotate-6 scale-105" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Why Choose <span className="text-primary">MoodMate</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced AI technology meets human compassion to deliver personalized mental healthcare
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={MessageCircle}
              title="AI That Understands"
              description="Our advanced AI learns your unique patterns and provides empathetic, 24/7 support that feels genuinely human."
              delay={0}
            />
            
            <FeatureCard
              icon={Activity}
              title="Real-Time Insights"
              description="Track your mental health journey with advanced analytics that help both you and your clinician make informed decisions."
              delay={200}
            />
            
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Bank-level encryption and HIPAA compliance ensure your conversations remain completely private and secure."
              delay={400}
            />
            
            <FeatureCard
              icon={Clock}
              title="Always Available"
              description="Mental health doesn't follow business hours. Get instant support whenever you need it most."
              delay={600}
            />
            
            <FeatureCard
              icon={Users}
              title="Professional Network"
              description="Connect with qualified mental health professionals who use AI insights to provide better care."
              delay={800}
            />
            
            <FeatureCard
              icon={Zap}
              title="Adaptive Technology"
              description="Our AI continuously learns and evolves to become more effective at supporting your unique journey."
              delay={1000}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Trusted by Thousands</h2>
            <p className="text-xl text-muted-foreground">See what our users are saying</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-12 text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-2xl font-medium mb-8 leading-relaxed">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
                
                <div className="space-y-2">
                  <p className="font-semibold text-lg">{testimonials[activeTestimonial].name}</p>
                  <p className="text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                </div>
                
                <div className="flex justify-center space-x-2 mt-8">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === activeTestimonial ? 'bg-primary' : 'bg-muted'
                      }`}
                      onClick={() => setActiveTestimonial(index)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Transform Your Mental Health?
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Join thousands who have already started their journey to better mental health. 
              Experience the perfect blend of AI innovation and human care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link to="/signup/patient">
                <Button size="lg" variant="secondary" className="group bg-white text-primary hover:bg-white/90">
                  <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Free Today
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="group border-white text-white hover:bg-white/10">
                  <Play className="w-5 h-5 mr-2" />
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-md opacity-70" />
                  <div className="relative w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold">MoodMate</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                Revolutionizing mental healthcare through AI innovation and human compassion.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-primary transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 MoodMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
