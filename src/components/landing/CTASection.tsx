
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function CTASection() {
  const { t } = useTranslation();
  
  return (
    <section className="w-full bg-mood-purple/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('landing.cta.title')}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('landing.cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup/patient" 
            className="px-8 py-3 bg-mood-purple hover:bg-mood-purple/90 text-white font-medium rounded-full"
          >
            {t('landing.cta.getStarted')}
          </Link>
          <Link 
            to="/contact" 
            className="px-8 py-3 bg-white border border-mood-purple text-mood-purple hover:bg-mood-purple/10 font-medium rounded-full"
          >
            {t('landing.cta.contactSales')}
          </Link>
        </div>
      </div>
    </section>
  );
}
