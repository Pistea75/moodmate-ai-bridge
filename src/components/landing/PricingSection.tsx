import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const plans = [
  {
    name: "Paciente",
    description: "Para individuos que buscan apoyo personal",
    price: "Gratis",
    priceDetail: "para comenzar",
    features: [
      "Acceso a compañero IA 24/7",
      "Seguimiento de estado de ánimo",
      "Reportes básicos",
      "Recursos de bienestar",
      "Soporte por email",
    ],
    cta: "Comenzar Gratis",
    highlighted: false,
  },
  {
    name: "Profesional",
    description: "Para psicólogos y terapeutas individuales",
    price: "€49",
    priceDetail: "/mes",
    features: [
      "Hasta 25 pacientes",
      "Dashboard clínico completo",
      "Reportes IA de sesiones",
      "Videollamadas integradas",
      "Soporte prioritario",
      "Integraciones avanzadas",
    ],
    cta: "Solicitar Demo",
    highlighted: true,
  },
  {
    name: "Clínica",
    description: "Para clínicas y equipos de salud mental",
    price: "€199",
    priceDetail: "/mes",
    features: [
      "Pacientes ilimitados",
      "Múltiples profesionales",
      "Gestión de equipo",
      "Analytics avanzados",
      "API completa",
      "Soporte dedicado 24/7",
      "Onboarding personalizado",
    ],
    cta: "Contactar Ventas",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Diseñado para cada necesidad
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Planes flexibles para pacientes, profesionales y clínicas. 
            Sin costos ocultos, sin compromisos a largo plazo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-8 ${
                plan.highlighted 
                  ? 'bg-primary text-white ring-4 ring-primary/20 scale-105' 
                  : 'bg-white border-2 border-slate-200'
              }`}
            >
              <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mb-6 ${plan.highlighted ? 'text-white/80' : 'text-slate-500'}`}>
                {plan.description}
              </p>
              
              <div className="mb-6">
                <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-slate-500'}`}>
                  {plan.priceDetail}
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'bg-white/20' : 'bg-primary/10'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-primary'}`} />
                    </div>
                    <span className={`text-sm ${plan.highlighted ? 'text-white/90' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/waitlist" className="block">
                <Button 
                  className={`w-full py-5 font-semibold ${
                    plan.highlighted 
                      ? 'bg-white text-primary hover:bg-slate-100' 
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
