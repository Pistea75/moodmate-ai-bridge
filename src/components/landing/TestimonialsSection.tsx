
import { useTranslation } from 'react-i18next';

export function TestimonialsSection() {
  const { t } = useTranslation();
  
  return (
    <section className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('landing.testimonials.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "MoodMate has transformed how I provide care to my patients. The AI insights are incredibly valuable.",
              author: "Dr. Sarah Johnson",
              role: "Clinical Psychologist"
            },
            {
              quote: "The platform's ability to track patient progress and provide continuous support is revolutionary.",
              author: "Dr. Michael Chen",
              role: "Psychiatrist"
            },
            {
              quote: "My patients love having 24/7 support through the AI companion. It's a game-changer.",
              author: "Dr. Emily Wilson",
              role: "Therapist"
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-background p-6 rounded-xl border">
              <p className="text-lg mb-4 italic text-muted-foreground">{testimonial.quote}</p>
              <div>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
