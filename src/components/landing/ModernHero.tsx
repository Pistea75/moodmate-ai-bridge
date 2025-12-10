import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Brain } from 'lucide-react';

export function ModernHero() {
  return (
    <section className="bg-white pt-20 pb-10">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-900 mb-6">
              Plataforma de{' '}
              <span className="text-primary">salud mental</span>{' '}
              para el siglo XXI
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              MoodMate combina IA avanzada con profesionales certificados para ofrecer 
              seguimiento emocional en tiempo real, terapia personalizada y soporte 24/7. 
              La herramienta que psicólogos y pacientes necesitan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/waitlist">
                <Button 
                  size="lg" 
                  className="group bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 rounded-lg text-lg transition-all duration-300"
                >
                  Solicitar Demo
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/waitlist">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="group border-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold px-8 py-6 rounded-lg text-lg transition-all duration-300"
                >
                  Unirse a la Lista de Espera
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative">
              {/* Main Illustration Card */}
              <div className="bg-gradient-to-br from-primary/10 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-8 left-4 w-16 h-16 bg-pink-300/30 rounded-full blur-lg"></div>
                
                {/* Central Icon */}
                <div className="flex items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <span className="text-white text-sm">💬</span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-primary">24/7</p>
                    <p className="text-sm text-slate-600">Soporte IA</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-sm">
                    <p className="text-2xl font-bold text-green-600">HIPAA</p>
                    <p className="text-sm text-slate-600">Certificado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
