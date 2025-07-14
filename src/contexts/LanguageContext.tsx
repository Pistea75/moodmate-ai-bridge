import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Translation interface
export interface Translations {
  // Navigation
  dashboard: string;
  patients: string;
  sessions: string;
  tasks: string;
  reports: string;
  analytics: string;
  communications: string;
  profile: string;
  settings: string;
  
  // Common actions
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  create: string;
  update: string;
  
  // Auth
  signIn: string;
  signUp: string;
  signOut: string;
  email: string;
  password: string;
  welcomeBack: string;
  forgotPassword: string;
  
  // Profile
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  close: string;
  confirm: string;
  
  // Dashboard
  totalPatients: string;
  upcomingSessions: string;
  activeTasks: string;
  recentActivity: string;
}

// Translation data
const translations: Record<string, Translations> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    patients: 'Patients',
    sessions: 'Sessions',
    tasks: 'Tasks',
    reports: 'Reports',
    analytics: 'Analytics',
    communications: 'Communications',
    profile: 'Profile',
    settings: 'Settings',
    
    // Common actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    create: 'Create',
    update: 'Update',
    
    // Auth
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    welcomeBack: 'Welcome Back',
    forgotPassword: 'Forgot password?',
    
    // Profile
    firstName: 'First Name',
    lastName: 'Last Name',
    preferredLanguage: 'Preferred Language',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    confirm: 'Confirm',
    
    // Dashboard
    totalPatients: 'Total Patients',
    upcomingSessions: 'Upcoming Sessions',
    activeTasks: 'Active Tasks',
    recentActivity: 'Recent Activity',
  },
  es: {
    // Navigation
    dashboard: 'Panel de Control',
    patients: 'Pacientes',
    sessions: 'Sesiones',
    tasks: 'Tareas',
    reports: 'Informes',
    analytics: 'Análisis',
    communications: 'Comunicaciones',
    profile: 'Perfil',
    settings: 'Configuración',
    
    // Common actions
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    add: 'Agregar',
    create: 'Crear',
    update: 'Actualizar',
    
    // Auth
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar Sesión',
    email: 'Correo Electrónico',
    password: 'Contraseña',
    welcomeBack: 'Bienvenido de Vuelta',
    forgotPassword: '¿Olvidaste tu contraseña?',
    
    // Profile
    firstName: 'Nombre',
    lastName: 'Apellido',
    preferredLanguage: 'Idioma Preferido',
    
    // Common
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    close: 'Cerrar',
    confirm: 'Confirmar',
    
    // Dashboard
    totalPatients: 'Total de Pacientes',
    upcomingSessions: 'Próximas Sesiones',
    activeTasks: 'Tareas Activas',
    recentActivity: 'Actividad Reciente',
  },
  fr: {
    // Navigation
    dashboard: 'Tableau de Bord',
    patients: 'Patients',
    sessions: 'Sessions',
    tasks: 'Tâches',
    reports: 'Rapports',
    analytics: 'Analyses',
    communications: 'Communications',
    profile: 'Profil',
    settings: 'Paramètres',
    
    // Common actions
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    create: 'Créer',
    update: 'Mettre à jour',
    
    // Auth
    signIn: 'Se Connecter',
    signUp: 'S\'inscrire',
    signOut: 'Se Déconnecter',
    email: 'Email',
    password: 'Mot de passe',
    welcomeBack: 'Bon Retour',
    forgotPassword: 'Mot de passe oublié?',
    
    // Profile
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    preferredLanguage: 'Langue Préférée',
    
    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    close: 'Fermer',
    confirm: 'Confirmer',
    
    // Dashboard
    totalPatients: 'Total des Patients',
    upcomingSessions: 'Sessions à Venir',
    activeTasks: 'Tâches Actives',
    recentActivity: 'Activité Récente',
  },
  de: {
    // Navigation
    dashboard: 'Dashboard',
    patients: 'Patienten',
    sessions: 'Sitzungen',
    tasks: 'Aufgaben',
    reports: 'Berichte',
    analytics: 'Analysen',
    communications: 'Kommunikation',
    profile: 'Profil',
    settings: 'Einstellungen',
    
    // Common actions
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    add: 'Hinzufügen',
    create: 'Erstellen',
    update: 'Aktualisieren',
    
    // Auth
    signIn: 'Anmelden',
    signUp: 'Registrieren',
    signOut: 'Abmelden',
    email: 'E-Mail',
    password: 'Passwort',
    welcomeBack: 'Willkommen zurück',
    forgotPassword: 'Passwort vergessen?',
    
    // Profile
    firstName: 'Vorname',
    lastName: 'Nachname',
    preferredLanguage: 'Bevorzugte Sprache',
    
    // Common
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    close: 'Schließen',
    confirm: 'Bestätigen',
    
    // Dashboard
    totalPatients: 'Patienten Gesamt',
    upcomingSessions: 'Bevorstehende Sitzungen',
    activeTasks: 'Aktive Aufgaben',
    recentActivity: 'Letzte Aktivität',
  },
};

interface LanguageContextType {
  language: string;
  translations: Translations;
  setLanguage: (lang: string) => void;
  t: (key: keyof Translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState('en');

  // Load user's preferred language
  useEffect(() => {
    if (user?.user_metadata?.language) {
      setLanguageState(user.user_metadata.language);
    }
  }, [user]);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    
    // Update user metadata if logged in
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { language: lang }
        });
        
        // Also update profile table
        await supabase
          .from('profiles')
          .update({ language: lang })
          .eq('id', user.id);
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }
  };

  const currentTranslations = translations[language] || translations.en;

  const t = (key: keyof Translations): string => {
    return currentTranslations[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        translations: currentTranslations,
        setLanguage,
        t,
      }}
    >
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