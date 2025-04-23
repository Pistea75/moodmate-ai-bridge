
import { Link } from 'react-router-dom';
import { MainNav } from '../components/MainNav';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-10 md:py-20 px-4">
          <div className="container mx-auto flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Bridge the gap between <span className="text-mood-purple">therapy sessions</span>
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
                MoodMate uses AI to provide personalized mental health support, 
                mood tracking, and therapy management for patients and clinicians.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/signup/patient" 
                  className="px-6 py-3 bg-mood-purple hover:bg-mood-purple/90 text-white font-medium rounded-full text-center"
                >
                  I'm a Patient
                </Link>
                <Link 
                  to="/signup/clinician" 
                  className="px-6 py-3 bg-white border border-mood-purple text-mood-purple hover:bg-mood-purple/10 font-medium rounded-full text-center"
                >
                  I'm a Clinician
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-mood-purple/20 rounded-full animate-pulse" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-mood-purple/10 rounded-full animate-pulse delay-150" />
                <img 
                  src="https://placehold.co/600x400/E5DEFF/9b87f5?text=MoodMate" 
                  alt="MoodMate App" 
                  className="relative z-10 rounded-2xl shadow-lg w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-muted/30 py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How MoodMate Helps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Companion",
                  description: "24/7 support with personalized AI assistance for continuous care between sessions.",
                  icon: "🤖"
                },
                {
                  title: "Mood Tracking",
                  description: "Monitor emotional patterns with intuitive visualizations and insights.",
                  icon: "📊"
                },
                {
                  title: "Secure Sessions",
                  description: "Connect with your therapist through encrypted video sessions.",
                  icon: "🔒"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-background p-6 rounded-xl shadow-sm border">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
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
