import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "¿Cómo funciona el compañero IA de MoodMate?",
    answer: "Nuestro compañero IA utiliza tecnología avanzada de procesamiento de lenguaje natural para entender tus emociones y proporcionar apoyo personalizado 24/7. Está diseñado para complementar, no reemplazar, la atención profesional de salud mental. El sistema aprende de tus interacciones para ofrecer respuestas cada vez más relevantes y útiles."
  },
  {
    question: "¿Es segura mi información personal?",
    answer: "Absolutamente. MoodMate cumple con los estándares más estrictos de seguridad, incluyendo HIPAA y GDPR. Utilizamos encriptación AES-256 para todos los datos en tránsito y en reposo. Tu información nunca se comparte con terceros sin tu consentimiento explícito, y puedes solicitar la eliminación de tus datos en cualquier momento."
  },
  {
    question: "¿Puedo usar MoodMate como profesional de salud mental?",
    answer: "Sí, MoodMate ofrece planes específicos para psicólogos, terapeutas y clínicas de salud mental. Incluye un dashboard clínico completo, herramientas de seguimiento de pacientes, reportes generados por IA, y funcionalidades de videollamada integradas. Puedes solicitar una demo para ver cómo puede optimizar tu práctica."
  },
  {
    question: "¿Qué diferencia a MoodMate de otras aplicaciones de salud mental?",
    answer: "MoodMate es la primera plataforma que combina IA avanzada con acceso a profesionales certificados en un solo lugar. A diferencia de apps de meditación o seguimiento básico, ofrecemos un ecosistema completo que incluye análisis predictivo, conexión directa con terapeutas, y herramientas tanto para pacientes como para profesionales."
  },
  {
    question: "¿Hay un período de prueba gratuito?",
    answer: "Sí, ofrecemos acceso gratuito a las funcionalidades básicas para pacientes, incluyendo el compañero IA y el seguimiento de estado de ánimo. Para profesionales, ofrecemos una demo personalizada y un período de prueba de 14 días con todas las funcionalidades incluidas, sin necesidad de tarjeta de crédito."
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Respuestas a las dudas más comunes sobre MoodMate.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between bg-white rounded-xl p-5 text-left shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {openIndex === index && (
                <div className="bg-white rounded-b-xl px-5 pb-5 -mt-2 pt-4 border-t border-slate-100">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
