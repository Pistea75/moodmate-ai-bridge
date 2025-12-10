import { Brain, TrendingUp, Users, Shield, MessageCircle, Clock, Check } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "Compañero IA 24/7",
    description: "Inteligencia artificial que entiende tus emociones y proporciona apoyo personalizado en cualquier momento",
  },
  {
    icon: TrendingUp,
    title: "Análisis Inteligente",
    description: "Seguimiento de patrones emocionales con insights y recomendaciones basadas en datos",
  },
  {
    icon: Users,
    title: "Terapeutas Certificados",
    description: "Conecta con profesionales de salud mental licenciados para atención personalizada",
  },
  {
    icon: Shield,
    title: "Privacidad Primero",
    description: "Encriptación de nivel bancario y cumplimiento HIPAA para proteger tus datos",
  },
  {
    icon: MessageCircle,
    title: "Soporte en Crisis",
    description: "Intervención inmediata y recursos de emergencia cuando más los necesitas",
  },
  {
    icon: Clock,
    title: "Seguimiento en Tiempo Real",
    description: "Registro instantáneo del estado de ánimo con retroalimentación inmediata",
  }
];

const featureHighlights = [
  "Integración continua con tu rutina diaria",
  "Flujo de trabajo optimizado para clínicos",
  "Gestión del conocimiento emocional",
];

export function ModernFeatures() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-4">
        {/* First Feature Block - Text Left, Image Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Herramientas que se integran con tu práctica
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Ofrece experiencias de atención excepcionales sin la complejidad de soluciones tradicionales. 
              Acelera el trabajo clínico crítico, elimina tareas repetitivas y aplica cambios con facilidad.
            </p>
            
            <div className="border-t border-slate-200 pt-6 mb-6">
              <ul className="space-y-4">
                {featureHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-slate-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <p className="text-slate-600 leading-relaxed">
              Entrega atención de calidad rápidamente sin complicaciones innecesarias.
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-purple-200 rounded-lg mb-3 flex items-end justify-center pb-2">
                    <div className="flex gap-1">
                      {[40, 60, 45, 80, 55, 70].map((h, i) => (
                        <div key={i} className="w-3 bg-primary/60 rounded-t" style={{height: `${h}%`}}></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">Progreso Semanal</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {Array.from({length: 35}).map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center ${i % 7 === 3 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {(i % 7) + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">Calendario</p>
                </div>
                <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-slate-900">87%</div>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Tasa de Bienestar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Feature Block - Image Left, Text Right */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">Análisis IA Activado</p>
                    <p className="text-sm text-slate-500">Procesando patrones emocionales...</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Estado de Ánimo</span>
                    <span className="text-sm text-primary font-semibold">+12% esta semana</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-slate-600 mb-2">"¿Cómo te sientes hoy?"</p>
                  <div className="flex gap-2">
                    {['😊', '😌', '😐', '😔', '😢'].map((emoji, i) => (
                      <button key={i} className={`w-10 h-10 rounded-lg transition-all ${i === 0 ? 'bg-primary/10 scale-110' : 'bg-slate-100 hover:bg-slate-200'}`}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">
              Invertimos en el potencial de tu bienestar
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Nuestra plataforma combina tecnología de punta con expertise humano para proporcionar 
              un apoyo de salud mental sin precedentes.
            </p>
            
            <div className="border-t border-slate-200 pt-6 mb-6">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-slate-700">Reportes dinámicos y dashboards</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-slate-700">Plantillas para cada situación</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-slate-700">Automatización inteligente del flujo de trabajo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Todo lo que necesitas para el bienestar completo
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Funcionalidades diseñadas para pacientes y profesionales de la salud mental.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
