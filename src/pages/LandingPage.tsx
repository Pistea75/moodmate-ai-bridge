import React from 'react';
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
  Award
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">MoodMate</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Mental Health Support
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Transform Mental Health Care with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect patients with clinicians through intelligent AI assistance, mood tracking, and personalized care plans. 
            Join thousands of mental health professionals already using MoodMate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/patient">
              <Button size="lg" className="min-w-[200px]">
                <Users className="w-5 h-5 mr-2" />
                Start as Patient
              </Button>
            </Link>
            <Link to="/signup/clinician">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                <Award className="w-5 h-5 mr-2" />
                Join as Clinician
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose MoodMate?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with proven therapeutic methods to deliver exceptional mental health care.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Conversations</CardTitle>
              <CardDescription>
                Intelligent chatbot provides 24/7 support with personalized responses based on patient history and clinician guidance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Comprehensive Mood Tracking</CardTitle>
              <CardDescription>
                Advanced analytics and insights help clinicians understand patterns and make data-driven treatment decisions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>HIPAA Compliant</CardTitle>
              <CardDescription>
                Bank-level security with end-to-end encryption ensures patient data is always protected and compliant.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* For Patients Section */}
      <section className="bg-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Heart className="w-4 h-4 mr-2" />
                For Patients
              </Badge>
              <h2 className="text-3xl font-bold mb-6">Get the support you need, when you need it</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">24/7 AI Support</h3>
                    <p className="text-muted-foreground">Chat with our AI whenever you need emotional support or guidance.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Track Your Progress</h3>
                    <p className="text-muted-foreground">Monitor your mood, complete tasks, and see your improvement over time.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Connect with Clinicians</h3>
                    <p className="text-muted-foreground">Work with qualified mental health professionals who understand your needs.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/signup/patient">
                  <Button size="lg">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Chat Interface</h3>
                  <p className="text-muted-foreground">Experience intelligent conversations tailored to your needs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Clinicians Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground">Gain insights into patient progress and treatment effectiveness</p>
                </div>
              </div>
            </div>
            <div>
              <Badge variant="outline" className="mb-4">
                <Award className="w-4 h-4 mr-2" />
                For Clinicians
              </Badge>
              <h2 className="text-3xl font-bold mb-6">Enhance your practice with AI-powered insights</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Patient Management</h3>
                    <p className="text-muted-foreground">Comprehensive dashboard to track multiple patients and their progress.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">AI-Generated Reports</h3>
                    <p className="text-muted-foreground">Automatically generate detailed reports from patient interactions and data.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Risk Assessment</h3>
                    <p className="text-muted-foreground">AI-powered risk scoring helps identify patients who need immediate attention.</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/signup/clinician">
                  <Button size="lg">
                    Join as Clinician
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform mental health care?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients and clinicians already using MoodMate to improve mental health outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup/patient">
              <Button size="lg" className="min-w-[200px]">
                Get Started as Patient
              </Button>
            </Link>
            <Link to="/signup/clinician">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Join as Clinician
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">MoodMate</span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered mental health support connecting patients with clinicians.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link to="/security" className="text-muted-foreground hover:text-primary">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/help" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
                <li><Link to="/faq" className="text-muted-foreground hover:text-primary">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link to="/about" className="text-muted-foreground hover:text-primary">About</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 MoodMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}