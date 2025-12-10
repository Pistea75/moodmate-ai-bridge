import { Quote } from 'lucide-react';

export function TestimonialSection() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <figure className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-primary" />
              </div>
            </div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-slate-900 mb-8 leading-relaxed">
              "MoodMate ha revolucionado la forma en que manejo mi práctica clínica. 
              La combinación de IA y herramientas profesionales me permite dar mejor 
              seguimiento a mis pacientes y ofrecer un cuidado más personalizado."
            </blockquote>
            <figcaption className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                DM
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">Dra. María González</p>
                <p className="text-slate-500">Psicóloga Clínica, Barcelona</p>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
