
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export function HeroSection() {
  return (
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
  );
}
