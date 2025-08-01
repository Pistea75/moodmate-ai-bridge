import { useTranslation } from 'react-i18next';

export function MobileAppSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-indigo-950/20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(139_92_246_/_0.15)_1px,transparent_0)] [background-size:20px_20px]"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          
          {/* Content on the left */}
          <div className="flex-1 max-w-xl">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                📱 Multiplataforma
              </span>
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
                {t('mobileApp.title') || 'Acceso desde cualquier dispositivo'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t('mobileApp.description') || 'Nuestra plataforma está optimizada para funcionar perfectamente en tu teléfono, tablet o computadora. Accede a tus sesiones de terapia, realiza el seguimiento de tu estado de ánimo y comunícate con tu psicólogo desde cualquier lugar.'}
              </p>
            </div>
            
            <div className="space-y-5 mb-8">
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-2 h-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('mobileApp.feature1') || 'Interfaz intuitiva y fácil de usar'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Diseño pensado para la experiencia del usuario</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-2 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('mobileApp.feature2') || 'Sincronización en tiempo real'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Tus datos siempre actualizados en todos tus dispositivos</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-2 h-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {t('mobileApp.feature3') || 'Seguridad y privacidad garantizadas'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Protección de datos con estándares internacionales</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>En línea</span>
              </div>
              <span>•</span>
              <span>iOS, Android, Web</span>
            </div>
          </div>

          {/* Mobile phones on the right */}
          <div className="flex-1 max-w-lg flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="/lovable-uploads/f03b878a-bd15-48b2-834e-65620674c6c8.png" 
                alt={t('mobileApp.imageAlt') || 'Vista previa de la aplicación móvil de MoodMate'}
                className="w-full h-auto max-w-md hover:scale-[1.02] transition-all duration-700 ease-out"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-60 animate-bounce [animation-delay:0s]"></div>
              <div className="absolute top-1/3 -left-6 w-4 h-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-40 animate-bounce [animation-delay:1s]"></div>
              <div className="absolute bottom-1/4 -right-2 w-6 h-6 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-full opacity-50 animate-bounce [animation-delay:2s]"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}