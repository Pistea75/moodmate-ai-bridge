import { useLanguage } from '@/contexts/LanguageContext';

export function MobileAppSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content on the left */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {t('mobileApp.title') || 'Acceso desde cualquier dispositivo'}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('mobileApp.description') || 'Nuestra plataforma está optimizada para funcionar perfectamente en tu teléfono, tablet o computadora. Accede a tus sesiones de terapia, realiza el seguimiento de tu estado de ánimo y comunícate con tu psicólogo desde cualquier lugar.'}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                <span className="text-foreground font-medium">
                  {t('mobileApp.feature1') || 'Interfaz intuitiva y fácil de usar'}
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                <span className="text-foreground font-medium">
                  {t('mobileApp.feature2') || 'Sincronización en tiempo real entre dispositivos'}
                </span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-3 h-3 bg-gradient-to-r from-primary to-primary/80 rounded-full group-hover:scale-110 transition-transform duration-200"></div>
                <span className="text-foreground font-medium">
                  {t('mobileApp.feature3') || 'Seguridad y privacidad garantizadas'}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm text-primary font-medium">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                Disponible en todos los dispositivos
              </div>
            </div>
          </div>

          {/* Mobile phones image on the right */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="/lovable-uploads/f03b878a-bd15-48b2-834e-65620674c6c8.png" 
                alt={t('mobileApp.imageAlt') || 'Vista previa de la aplicación móvil de MoodMate'}
                className="w-full max-w-lg h-auto hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
              />
              {/* Subtle glow effect behind the phones */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-30 -z-10 scale-110"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}