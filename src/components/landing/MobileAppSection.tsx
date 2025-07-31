import { useLanguage } from '@/contexts/LanguageContext';
import mobileAppImage from '@/assets/mobile-app-preview.jpg';

export function MobileAppSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {t('mobileApp.title') || 'Acceso desde cualquier dispositivo'}
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {t('mobileApp.description') || 'Nuestra plataforma está optimizada para funcionar perfectamente en tu teléfono, tablet o computadora. Accede a tus sesiones de terapia, realiza el seguimiento de tu estado de ánimo y comunícate con tu psicólogo desde cualquier lugar.'}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">
                  {t('mobileApp.feature1') || 'Interfaz intuitiva y fácil de usar'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">
                  {t('mobileApp.feature2') || 'Sincronización en tiempo real entre dispositivos'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground">
                  {t('mobileApp.feature3') || 'Seguridad y privacidad garantizadas'}
                </span>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <img 
                src={mobileAppImage} 
                alt={t('mobileApp.imageAlt') || 'Vista previa de la aplicación móvil de MoodMate'}
                className="w-64 md:w-80 h-auto rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
              />
              <div className="absolute -z-10 top-8 left-8 w-full h-full bg-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}