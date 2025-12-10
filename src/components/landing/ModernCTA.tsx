import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function ModernCTA() {
  return (
    <section className="bg-gradient-to-br from-primary to-purple-700 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Comienza tu camino hacia el bienestar hoy
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Únete a la lista de espera y sé de los primeros en experimentar la nueva 
            era de la salud mental. Sin tarjeta de crédito requerida.
          </p>
          <Link to="/waitlist">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-slate-100 font-semibold px-8 py-6 rounded-lg text-lg transition-all duration-300 group"
            >
              Solicitar Acceso Anticipado
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
