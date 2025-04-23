import { Link } from 'react-router-dom';
import { MainNav } from '../components/MainNav';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Brain, Shield, Clock } from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-mood-purple" />,
      title: "AI Companion",
      description: "24/7 support with personalized AI assistance for continuous care between sessions."
    },
    {
      icon: <Shield className="h-8 w-8 text-mood-purple" />,
      title: "Secure Platform",
      description: "End-to-end encryption and HIPAA compliance for complete privacy and security."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-mood-purple" />,
      title: "Progress Tracking",
      description: "Monitor emotional patterns with intuitive visualizations and insights."
    },
    {
      icon: <Clock className="h-8 w-8 text-mood-purple" />,
      title: "Flexible Sessions",
      description: "Connect with your therapist through scheduled or on-demand sessions."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Transform Mental Healthcare with <span className="text-mood-purple">AI-Powered Support</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                MoodMate revolutionizes therapy by combining professional care with AI assistance, 
                providing continuous support and insights for better mental health outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup/patient" 
                  className="px-6 py-3 bg-mood-purple hover:bg-mood-purple/90 text-white font-medium rounded-full text-center"
                >
                  Start Your Journey
                </Link>
                <Link 
                  to="/signup/clinician" 
                  className="px-6 py-3 bg-white border border-mood-purple text-mood-purple hover:bg-mood-purple/10 font-medium rounded-full text-center"
                >
                  Join as Clinician
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-mood-purple/20 rounded-full animate-pulse" />
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-mood-purple/10 rounded-full animate-pulse delay-150" />
                <img 
                  src="https://placehold.co/600x400/E5DEFF/9b87f5?text=Mental+Health+Support" 
                  alt="MoodMate Platform" 
                  className="relative z-10 rounded-2xl shadow-lg w-full max-w-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-muted/30 py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Mental Health Support</h2>
              <p className="text-muted-foreground">
                Experience a new era of mental healthcare with our innovative platform that combines
                human expertise with advanced AI technology.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted by Healthcare Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "MoodMate has transformed how I provide care to my patients. The AI insights are incredibly valuable.",
                  author: "Dr. Sarah Johnson",
                  role: "Clinical Psychologist"
                },
                {
                  quote: "The platform's ability to track patient progress and provide continuous support is revolutionary.",
                  author: "Dr. Michael Chen",
                  role: "Psychiatrist"
                },
                {
                  quote: "My patients love having 24/7 support through the AI companion. It's a game-changer.",
                  author: "Dr. Emily Wilson",
                  role: "Therapist"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-background p-6 rounded-xl border">
                  <p className="text-lg mb-4 italic text-muted-foreground">{testimonial.quote}</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-mood-purple/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Mental Healthcare?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals and patients who are already experiencing
              the benefits of AI-enhanced mental health support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup/patient" 
                className="px-8 py-3 bg-mood-purple hover:bg-mood-purple/90 text-white font-medium rounded-full"
              >
                Get Started Now
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 bg-white border border-mood-purple text-mood-purple hover:bg-mood-purple/10 font-medium rounded-full"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link to="/security" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
