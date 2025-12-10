import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, Shield } from 'lucide-react';

const stats = [
  { value: "99.99%", label: "Tiempo de actividad garantizado" },
  { value: "24/7", label: "Soporte disponible siempre" },
  { value: "HIPAA", label: "Cumplimiento certificado" },
  { value: "AES-256", label: "Encriptación de datos" },
];

export function TrustedSection() {
  return (
    <section className="bg-primary py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Confianza Mundial
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Confiado por profesionales de salud mental
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Nuestros rigurosos estándares de seguridad y cumplimiento están en el corazón 
              de todo lo que hacemos. Trabajamos incansablemente para protegerte a ti y a tus pacientes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/waitlist">
                <Button 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-slate-100 font-semibold px-6 py-5"
                >
                  Solicitar Demo
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/security">
                <Button 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold px-6 py-5"
                >
                  Centro de Seguridad
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <p className="text-3xl md:text-4xl font-extrabold text-white mb-2">{stat.value}</p>
                <p className="text-white/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
