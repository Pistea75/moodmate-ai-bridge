
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function MotivationalQuoteCard() {
  const { t } = useLanguage();

  // Mock data - in real implementation, this could be dynamic based on user's progress/mood
  const quotes = {
    en: [
      "Every small step forward is progress worth celebrating.",
      "Your mental health journey is unique and valuable.",
      "Today is a new opportunity to take care of yourself.",
      "Healing isn't linear, and that's perfectly okay."
    ],
    es: [
      "Cada pequeño paso adelante es un progreso que vale la pena celebrar.",
      "Tu viaje de salud mental es único y valioso.",
      "Hoy es una nueva oportunidad para cuidarte.",
      "La sanación no es lineal, y eso está perfectamente bien."
    ],
    fr: [
      "Chaque petit pas en avant est un progrès qui mérite d'être célébré.",
      "Votre parcours de santé mentale est unique et précieux.",
      "Aujourd'hui est une nouvelle opportunité de prendre soin de vous.",
      "La guérison n'est pas linéaire, et c'est tout à fait normal."
    ],
    de: [
      "Jeder kleine Schritt vorwärts ist ein Fortschritt, der gefeiert werden sollte.",
      "Ihre psychische Gesundheitsreise ist einzigartig und wertvoll.",
      "Heute ist eine neue Gelegenheit, für sich selbst zu sorgen.",
      "Heilung ist nicht linear, und das ist völlig in Ordnung."
    ]
  };

  const { language } = useLanguage();
  const currentQuotes = quotes[language] || quotes.en;
  const todayQuote = currentQuotes[new Date().getDay() % currentQuotes.length];

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Quote className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm text-gray-700 italic leading-relaxed">
                "{todayQuote}"
              </p>
              <div className="text-xs text-green-600 font-medium">
                {t('dailyInspiration')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
