
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DemoModal } from './DemoModal';
import { Brain, MessageCircle, TrendingUp } from 'lucide-react';

export function HeroSection() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse opacity-60" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center min-h-screen">
        {/* Left side - Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left lg:pr-12">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="text-white">All In One</span>
              <br />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                Mental Health
              </span>
              <br />
              <span className="text-white">Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Transform your mental health journey with AI-powered support, real-time monitoring, 
              and professional care - all integrated into one seamless platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              to="/signup/patient" 
              className="group relative px-8 py-4 bg-white text-purple-700 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              <span className="relative z-10">START MOODMATE</span>
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)} 
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Try Demo
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center lg:justify-start pt-8">
            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-sm">01</span>
              <div className="h-0.5 w-16 bg-white/30">
                <div className="h-full w-1/3 bg-white"></div>
              </div>
              <span className="text-white/60 text-sm">05</span>
            </div>
          </div>
        </div>

        {/* Right side - Illustration */}
        <div className="flex-1 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <div className="relative">
            {/* Main illustration container */}
            <div className="relative w-96 h-96 flex items-center justify-center">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-3xl animate-pulse" />
              
              {/* Central figure */}
              <div className="relative z-10 w-64 h-80">
                {/* Head */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full"></div>
                
                {/* Hair */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-gradient-to-b from-purple-900 to-purple-800 rounded-full"></div>
                
                {/* Body */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-48 bg-gradient-to-b from-purple-500 to-purple-600 rounded-t-3xl"></div>
                
                {/* Arms holding devices/tools */}
                <div className="absolute top-24 left-1/4 w-8 h-24 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full transform -rotate-12"></div>
                <div className="absolute top-24 right-1/4 w-8 h-24 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full transform rotate-12"></div>
                
                {/* Digital elements floating around */}
                <div className="absolute top-20 -left-8 w-16 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center transform rotate-12 animate-float">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute top-32 -right-8 w-16 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center transform -rotate-12 animate-float" style={{ animationDelay: '1s' }}>
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                
                <div className="absolute bottom-20 left-0 w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-10 left-10 w-6 h-6 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-16 right-8 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce"></div>
            <div className="absolute top-1/3 right-4 w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 left-8 w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <DemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </section>
  );
}
