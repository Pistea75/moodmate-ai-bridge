
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
  myProfile: string;
  professionalInformation: string;
  personalInformation: string;
  specialization: string;
  licenseNumber: string;
  
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
  
  // Settings
  accountSettings: string;
  languageSettings: string;
  notificationSettings: string;
  privacySettings: string;
  
  // Forms
  selectLanguage: string;
  selectALanguage: string;
  
  // Sidebar
  clinicianPortal: string;
  patientPortal: string;
  riskManagement: string;
  trainAI: string;
  
  // General
  welcome: string;
  pleaseWait: string;
  noDataAvailable: string;
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
    myProfile: 'My Profile',
    professionalInformation: 'Professional Information',
    personalInformation: 'Personal Information',
    specialization: 'Specialization',
    licenseNumber: 'License Number',
    
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
    
    // Settings
    accountSettings: 'Account Settings',
    languageSettings: 'Language Settings',
    notificationSettings: 'Notification Settings',
    privacySettings: 'Privacy Settings',
    
    // Forms
    selectLanguage: 'Select a language',
    selectALanguage: 'Select a language',
    
    // Sidebar
    clinicianPortal: 'Clinician Portal',
    patientPortal: 'Patient Portal',
    riskManagement: 'Risk Management',
    trainAI: 'Train AI',
    
    // General
    welcome: 'Welcome',
    pleaseWait: 'Please wait',
    noDataAvailable: 'No data available',
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
    myProfile: 'Mi Perfil',
    professionalInformation: 'Información Profesional',
    personalInformation: 'Información Personal',
    specialization: 'Especialización',
    licenseNumber: 'Número de Licencia',
    
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
    
    // Settings
    accountSettings: 'Configuración de Cuenta',
    languageSettings: 'Configuración de Idioma',
    notificationSettings: 'Configuración de Notificaciones',
    privacySettings: 'Configuración de Privacidad',
    
    // Forms
    selectLanguage: 'Selecciona un idioma',
    selectALanguage: 'Selecciona un idioma',
    
    // Sidebar
    clinicianPortal: 'Portal del Médico',
    patientPortal: 'Portal del Paciente',
    riskManagement: 'Gestión de Riesgos',
    trainAI: 'Entrenar IA',
    
    // General
    welcome: 'Bienvenido',
    pleaseWait: 'Por favor espera',
    noDataAvailable: 'No hay datos disponibles',
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
    myProfile: 'Mon Profil',
    professionalInformation: 'Informations Professionnelles',
    personalInformation: 'Informations Personnelles',
    specialization: 'Spécialisation',
    licenseNumber: 'Numéro de Licence',
    
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
    
    // Settings
    accountSettings: 'Paramètres du Compte',
    languageSettings: 'Paramètres de Langue',
    notificationSettings: 'Paramètres de Notification',
    privacySettings: 'Paramètres de Confidentialité',
    
    // Forms
    selectLanguage: 'Sélectionner une langue',
    selectALanguage: 'Sélectionner une langue',
    
    // Sidebar
    clinicianPortal: 'Portail Clinicien',
    patientPortal: 'Portail Patient',
    riskManagement: 'Gestion des Risques',
    trainAI: 'Former l\'IA',
    
    // General
    welcome: 'Bienvenue',
    pleaseWait: 'Veuillez patienter',
    noDataAvailable: 'Aucune donnée disponible',
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
    myProfile: 'Mein Profil',
    professionalInformation: 'Berufliche Informationen',
    personalInformation: 'Persönliche Informationen',
    specialization: 'Spezialisierung',
    licenseNumber: 'Lizenznummer',
    
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
    
    // Settings
    accountSettings: 'Kontoeinstellungen',
    languageSettings: 'Spracheinstellungen',
    notificationSettings: 'Benachrichtigungseinstellungen',
    privacySettings: 'Datenschutzeinstellungen',
    
    // Forms
    selectLanguage: 'Sprache auswählen',
    selectALanguage: 'Sprache auswählen',
    
    // Sidebar
    clinicianPortal: 'Arzt-Portal',
    patientPortal: 'Patienten-Portal',
    riskManagement: 'Risikomanagement',
    trainAI: 'KI Trainieren',
    
    // General
    welcome: 'Willkommen',
    pleaseWait: 'Bitte warten',
    noDataAvailable: 'Keine Daten verfügbar',
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
