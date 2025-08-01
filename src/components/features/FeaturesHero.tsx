
import { Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function FeaturesHero() {
  const { t } = useTranslation();
  
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-mood-purple/5">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-mood-purple/10 p-4">
            <Brain className="h-10 w-10 text-mood-purple" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            {t('landing.features.title')}
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            {t('landing.features.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/signup/patient">{t('landing.hero.getStarted')}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/contact">{t('landing.hero.learnMore')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
