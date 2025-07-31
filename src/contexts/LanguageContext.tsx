
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth & Navigation
    welcomeBack: 'Welcome Back',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password?',
    loading: 'Loading...',
    
    // Landing Page
    mentalHealthReimagined: 'Mental Health Reimagined',
    landingSubtitle: 'The first AI-powered platform that combines professional therapy, real-time mood tracking, and 24/7 support in one seamless experience.',
    startFreeTrial: 'Start Free Trial',
    forClinicians: 'For Clinicians',
    noCardRequired: 'No credit card required • Setup in 2 minutes • Cancel anytime',
    trustedBy: 'Trusted by 10,000+ users worldwide',
    
    // Navigation
    about: 'About',
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact',
    privacy: 'Privacy',
    help: 'Help',
    logIn: 'Log In',
    startYourJourney: 'Start Your Journey',
    
    // Dashboard & Common
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    patients: 'Patients',
    sessions: 'Sessions',
    tasks: 'Tasks',
    reports: 'Reports',
    analytics: 'Analytics',
    chat: 'AI Chat',
    directMessages: 'Direct Messages',
    moodLog: 'Mood Log',
    goals: 'Goals',
    insights: 'Insights',
    
    // Mobile App Section
    'mobileApp.title': 'Access from any device',
    'mobileApp.description': 'Our platform is optimized to work perfectly on your phone, tablet, or computer. Access your therapy sessions, track your mood, and communicate with your psychologist from anywhere.',
    'mobileApp.feature1': 'Intuitive and easy-to-use interface',
    'mobileApp.feature2': 'Real-time synchronization across devices',
    'mobileApp.feature3': 'Security and privacy guaranteed',
    'mobileApp.imageAlt': 'MoodMate mobile app preview',
  },
  es: {
    // Auth & Navigation
    welcomeBack: 'Bienvenido de Nuevo',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    forgotPassword: '¿Olvidaste tu Contraseña?',
    loading: 'Cargando...',
    
    // Landing Page
    mentalHealthReimagined: 'Salud Mental Reimaginada',
    landingSubtitle: 'La primera plataforma impulsada por IA que combina terapia profesional, seguimiento del estado de ánimo en tiempo real y soporte 24/7 en una experiencia perfecta.',
    startFreeTrial: 'Comenzar Prueba Gratuita',
    forClinicians: 'Para Clínicos',
    noCardRequired: 'No se requiere tarjeta de crédito • Configuración en 2 minutos • Cancela en cualquier momento',
    trustedBy: 'Confiado por más de 10,000 usuarios en todo el mundo',
    
    // Navigation
    about: 'Acerca de',
    features: 'Características',
    pricing: 'Precios',
    contact: 'Contacto',
    privacy: 'Privacidad',
    help: 'Ayuda',
    logIn: 'Iniciar Sesión',
    startYourJourney: 'Comienza tu Viaje',
    
    // Dashboard & Common
    dashboard: 'Panel',
    profile: 'Perfil',
    settings: 'Configuración',
    patients: 'Pacientes',
    sessions: 'Sesiones',
    tasks: 'Tareas',
    reports: 'Reportes',
    analytics: 'Análisis',
    chat: 'Chat IA',
    directMessages: 'Mensajes Directos',
    moodLog: 'Registro de Ánimo',
    goals: 'Objetivos',
    insights: 'Perspectivas',
    
    // Mobile App Section
    'mobileApp.title': 'Acceso desde cualquier dispositivo',
    'mobileApp.description': 'Nuestra plataforma está optimizada para funcionar perfectamente en tu teléfono, tablet o computadora. Accede a tus sesiones de terapia, realiza el seguimiento de tu estado de ánimo y comunícate con tu psicólogo desde cualquier lugar.',
    'mobileApp.feature1': 'Interfaz intuitiva y fácil de usar',
    'mobileApp.feature2': 'Sincronización en tiempo real entre dispositivos', 
    'mobileApp.feature3': 'Seguridad y privacidad garantizadas',
    'mobileApp.imageAlt': 'Vista previa de la aplicación móvil de MoodMate',
  },
  fr: {
    welcomeBack: 'Bon Retour',
    email: 'E-mail',
    password: 'Mot de Passe',
    signIn: 'Se Connecter',
    signUp: 'S\'inscrire',
    forgotPassword: 'Mot de Passe Oublié?',
    loading: 'Chargement...',
  },
  de: {
    welcomeBack: 'Willkommen Zurück',
    email: 'E-Mail',
    password: 'Passwort',
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    forgotPassword: 'Passwort Vergessen?',
    loading: 'Laden...',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  
  // Try to get auth context, but don't require it
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    // AuthContext not available, that's okay
    console.log('LanguageProvider: AuthContext not available yet');
  }

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && ['en', 'es', 'fr', 'de'].includes(savedLanguage)) {
      setLanguage(savedLanguage as Language);
    }
  }, []);

  // Save language preference to localStorage
  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: updateLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
