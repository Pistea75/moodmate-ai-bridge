
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Users, Shield, Zap } from 'lucide-react';

export function ModernHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 text-sm font-medium text-white">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>Trusted by 10,000+ users worldwide</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              <span className="text-white">Mental Health</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              The first AI-powered platform that combines professional therapy, 
              real-time mood tracking, and 24/7 support in one seamless experience.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/waitlist">
                <Button 
                  size="lg" 
                  className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-bold px-12 py-6 rounded-full text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 backdrop-blur-sm"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Solicitar Demo
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              
              <Link to="/waitlist">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold px-12 py-6 rounded-full text-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Unirse a Waiting List
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-400 mt-4 font-medium text-center">
              Acceso limitado • Solicita una demo personalizada • Aprobación manual
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-6 pt-12">
            <p className="text-slate-400 font-medium">Trusted by leading healthcare organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Mayo Clinic', 'Johns Hopkins', 'Cleveland Clinic', 'Kaiser Permanente'].map((org) => (
                <div key={org} className="text-white/60 font-semibold text-lg">
                  {org}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-purple-400 mr-2" />
                <span className="text-3xl font-bold text-white">50K+</span>
              </div>
              <p className="text-slate-400 text-sm">Active Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-3xl font-bold text-white">99.9%</span>
              </div>
              <p className="text-slate-400 text-sm">Uptime</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-yellow-400 mr-2" />
                <span className="text-3xl font-bold text-white">24/7</span>
              </div>
              <p className="text-slate-400 text-sm">AI Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
