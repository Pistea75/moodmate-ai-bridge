
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
    welcomeBack: 'Welcome Back',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password?',
    loading: 'Loading...',
    // Add more translations as needed
  },
  es: {
    welcomeBack: 'Bienvenido de Nuevo',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    forgotPassword: '¿Olvidaste tu Contraseña?',
    loading: 'Cargando...',
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
