import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DemoModal } from './DemoModal';

export function HeroSection() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary-light to-secondary overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-light/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center min-h-screen">
        {/* Left side - Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left lg:pr-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">Transform Mental</span>
              <br />
              <span className="text-white">Healthcare with</span>
              <br />
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                AI-Powered Support
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              MoodMate revolutionizes therapy by combining professional care with AI assistance, 
              providing continuous support and insights for better mental health outcomes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/signup/patient" 
              className="group relative px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"></div>
            </Link>
            <Link 
              to="/signup/clinician" 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105"
            >
              Join as Clinician
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)} 
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Try Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
              <div className="text-white/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">500+</div>
              <div className="text-white/80">Clinicians</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">95%</div>
              <div className="text-white/80">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Right side - Hero Image */}
        <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-accent rounded-full"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-secondary rounded-full"></div>
            <div className="absolute top-1/4 -right-8 w-4 h-4 bg-white/60 rounded-full"></div>
            <div className="absolute bottom-1/4 -left-8 w-5 h-5 bg-accent/60 rounded-full"></div>
            
            {/* Main illustration container */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
              <img 
                alt="MoodMate Platform Illustration" 
                className="relative z-10 rounded-2xl w-full max-w-md mx-auto" 
                src="/lovable-uploads/9c9fcb8a-16c4-4de9-88a8-c42d7d26b21a.png" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </section>
  );
}