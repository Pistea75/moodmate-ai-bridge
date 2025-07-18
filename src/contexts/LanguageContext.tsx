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
  
  // Dashboard - General
  totalPatients: string;
  upcomingSessions: string;
  activeTasks: string;
  recentActivity: string;
  welcomeBackMessage: string;
  mentalHealthOverview: string;
  
  // Dashboard - Patient
  patientDashboard: string;
  yourMentalHealthOverview: string;
  todaysMood: string;
  weeklyProgress: string;
  upcomingAppointments: string;
  completedTasks: string;
  tasksCompleted: string;
  
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
  
  // Common UI Text
  viewAll: string;
  seeMore: string;
  showLess: string;
  today: string;
  thisWeek: string;
  thisMonth: string;
  
  // Status and Labels
  active: string;
  completed: string;
  pending: string;
  scheduled: string;
  cancelled: string;
  
  // Time and Dates
  morning: string;
  afternoon: string;
  evening: string;
  yesterday: string;
  tomorrow: string;
  
  // Actions and Buttons
  scheduleSession: string;
  addTask: string;
  viewDetails: string;
  editProfile: string;
  changePassword: string;
  logout: string;
  
  // Navigation Items
  mood: string;
  chat: string;
  goals: string;
  insights: string;
  treatmentPlans: string;
  resourceLibrary: string;
  
  // Landing Page
  about: string;
  features: string;
  pricing: string;
  contact: string;
  help: string;
  faq: string;
  privacy: string;
  terms: string;
  security: string;
  
  // App Name
  appName: string;

  // New Patient Dashboard Translations
  quickActions: string;
  logMood: string;
  viewTasks: string;
  aiChat: string;
  progressOverview: string;
  weeklyGoals: string;
  moodStability: string;
  sessionAttendance: string;
  improvingWell: string;
  wellnessStreak: string;
  daysInARow: string;
  longestStreak: string;
  weeklyTarget: string;
  recentAchievements: string;
  mood_tracker: string;
  task_master: string;
  session_regular: string;
  dailyInspiration: string;
  patient: string;
  goalsProgress: string;
  setTrackGoalsAI: string;
  moodTracking: string;
  trackMoodPatternsOverTime: string;
  myTasks: string;
  refresh: string;
  noTasksAssigned: string;
  due: string;
  overdue: string;
  deleteTask: string;
  areYouSure: string;
  deleteTaskConfirmation: string;
  deleting: string;
  weeklyMoodSummary: string;
  moodStableThisWeek: string;
  activityImpact: string;
  exercisePositiveImpact: string;
  moodTrends: string;
  aiPersonalizedByClinician: string;
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
    
    // Dashboard - General
    totalPatients: 'Total Patients',
    upcomingSessions: 'Upcoming Sessions',
    activeTasks: 'Active Tasks',
    recentActivity: 'Recent Activity',
    welcomeBackMessage: 'Welcome back!',
    mentalHealthOverview: 'Here\'s your mental health overview.',
    
    // Dashboard - Patient
    patientDashboard: 'Dashboard',
    yourMentalHealthOverview: 'Welcome back! Here\'s your mental health overview.',
    todaysMood: 'Today\'s Mood',
    weeklyProgress: 'Weekly Progress',
    upcomingAppointments: 'Upcoming Appointments',
    completedTasks: 'Completed Tasks',
    tasksCompleted: 'Tasks Completed',
    
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
    
    // Common UI Text
    viewAll: 'View All',
    seeMore: 'See More',
    showLess: 'Show Less',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    
    // Status and Labels
    active: 'Active',
    completed: 'Completed',
    pending: 'Pending',
    scheduled: 'Scheduled',
    cancelled: 'Cancelled',
    
    // Time and Dates
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    
    // Actions and Buttons
    scheduleSession: 'Schedule Session',
    addTask: 'Add Task',
    viewDetails: 'View Details',
    editProfile: 'Edit Profile',
    changePassword: 'Change Password',
    logout: 'Logout',
    
    // Navigation Items
    mood: 'Mood',
    chat: 'Chat',
    goals: 'Goals',
    insights: 'Insights',
    treatmentPlans: 'Treatment Plans',
    resourceLibrary: 'Resource Library',
    
    // Landing Page
    about: 'About',
    features: 'Features',
    pricing: 'Pricing',
    contact: 'Contact',
    help: 'Help',
    faq: 'FAQ',
    privacy: 'Privacy',
    terms: 'Terms',
    security: 'Security',
    
    // App Name
    appName: 'MoodMate',
    
    // New Patient Dashboard Translations
    quickActions: 'Quick Actions',
    logMood: 'Log Mood',
    viewTasks: 'View Tasks',
    aiChat: 'AI Chat',
    progressOverview: 'Progress Overview',
    weeklyGoals: 'Weekly Goals',
    moodStability: 'Mood Stability',
    sessionAttendance: 'Session Attendance',
    improvingWell: 'Improving Well!',
    wellnessStreak: 'Wellness Streak',
    daysInARow: 'days in a row',
    longestStreak: 'Longest Streak',
    weeklyTarget: 'Weekly Target',
    recentAchievements: 'Recent Achievements',
    mood_tracker: 'Mood Tracker',
    task_master: 'Task Master',
    session_regular: 'Session Regular',
    dailyInspiration: 'Daily Inspiration',
    patient: 'Patient',
    goalsProgress: 'Goals & Progress',
    setTrackGoalsAI: 'Set and track your mental health goals with AI assistance.',
    moodTracking: 'Mood Tracking',
    trackMoodPatternsOverTime: 'Track and monitor your mood patterns over time.',
    myTasks: 'My Tasks',
    refresh: 'Refresh',
    noTasksAssigned: 'No tasks assigned yet.',
    due: 'Due',
    overdue: 'overdue',
    deleteTask: 'Delete task',
    areYouSure: 'Are you sure?',
    deleteTaskConfirmation: 'This will permanently delete this task. This action cannot be undone.',
    deleting: 'Deleting...',
    weeklyMoodSummary: 'Weekly Mood Summary',
    moodStableThisWeek: 'Your mood has been more stable this week compared to last week. Great progress!',
    activityImpact: 'Activity Impact',
    exercisePositiveImpact: 'Exercise sessions seem to positively impact your mood. Consider maintaining this routine.',
    moodTrends: 'Mood Trends',
    aiPersonalizedByClinician: 'AI behavior personalized by your clinician'
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
    
    // Dashboard - General
    totalPatients: 'Total de Pacientes',
    upcomingSessions: 'Próximas Sesiones',
    activeTasks: 'Tareas Activas',
    recentActivity: 'Actividad Reciente',
    welcomeBackMessage: '¡Bienvenido de vuelta!',
    mentalHealthOverview: 'Aquí está tu resumen de salud mental.',
    
    // Dashboard - Patient
    patientDashboard: 'Panel de Control',
    yourMentalHealthOverview: '¡Bienvenido de vuelta! Aquí está tu resumen de salud mental.',
    todaysMood: 'Estado de Ánimo de Hoy',
    weeklyProgress: 'Progreso Semanal',
    upcomingAppointments: 'Próximas Citas',
    completedTasks: 'Tareas Completadas',
    tasksCompleted: 'Tareas Completadas',
    
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
    
    // Common UI Text
    viewAll: 'Ver Todo',
    seeMore: 'Ver Más',
    showLess: 'Mostrar Menos',
    today: 'Hoy',
    thisWeek: 'Esta Semana',
    thisMonth: 'Este Mes',
    
    // Status and Labels
    active: 'Activo',
    completed: 'Completado',
    pending: 'Pendiente',
    scheduled: 'Programado',
    cancelled: 'Cancelado',
    
    // Time and Dates
    morning: 'Mañana',
    afternoon: 'Tarde',
    evening: 'Noche',
    yesterday: 'Ayer',
    tomorrow: 'Mañana',
    
    // Actions and Buttons
    scheduleSession: 'Programar Sesión',
    addTask: 'Agregar Tarea',
    viewDetails: 'Ver Detalles',
    editProfile: 'Editar Perfil',
    changePassword: 'Cambiar Contraseña',
    logout: 'Cerrar Sesión',
    
    // Navigation Items
    mood: 'Estado de Ánimo',
    chat: 'Chat',
    goals: 'Objetivos',
    insights: 'Insights',
    treatmentPlans: 'Planes de Tratamiento',
    resourceLibrary: 'Biblioteca de Recursos',
    
    // Landing Page
    about: 'Acerca de',
    features: 'Características',
    pricing: 'Precios',
    contact: 'Contacto',
    help: 'Ayuda',
    faq: 'Preguntas Frecuentes',
    privacy: 'Privacidad',
    terms: 'Términos',
    security: 'Seguridad',
    
    // App Name
    appName: 'MoodMate',
    
    // New Patient Dashboard Translations
    quickActions: 'Acciones Rápidas',
    logMood: 'Registrar Estado de Ánimo',
    viewTasks: 'Ver Tareas',
    aiChat: 'Chat IA',
    progressOverview: 'Resumen de Progreso',
    weeklyGoals: 'Objetivos Semanales',
    moodStability: 'Estabilidad del Estado de Ánimo',
    sessionAttendance: 'Asistencia a Sesiones',
    improvingWell: '¡Mejorando Bien!',
    wellnessStreak: 'Racha de Bienestar',
    daysInARow: 'días seguidos',
    longestStreak: 'Racha Más Larga',
    weeklyTarget: 'Objetivo Semanal',
    recentAchievements: 'Logros Recientes',
    mood_tracker: 'Seguidor de Estado de Ánimo',
    task_master: 'Maestro de Tareas',
    session_regular: 'Regular en Sesiones',
    dailyInspiration: 'Inspiración Diaria',
    patient: 'Paciente',
    goalsProgress: 'Objetivos y Progreso',
    setTrackGoalsAI: 'Establece y rastrea tus objetivos de salud mental con asistencia de IA.',
    moodTracking: 'Seguimiento del Estado de Ánimo',
    trackMoodPatternsOverTime: 'Rastrea y monitorea tus patrones de estado de ánimo a lo largo del tiempo.',
    myTasks: 'Mis Tareas',
    refresh: 'Actualizar',
    noTasksAssigned: 'Aún no hay tareas asignadas.',
    due: 'Vence',
    overdue: 'vencida',
    deleteTask: 'Eliminar tarea',
    areYouSure: '¿Estás seguro?',
    deleteTaskConfirmation: 'Esto eliminará permanentemente esta tarea. Esta acción no se puede deshacer.',
    deleting: 'Eliminando...',
    weeklyMoodSummary: 'Resumen Semanal del Estado de Ánimo',
    moodStableThisWeek: 'Tu estado de ánimo ha sido más estable esta semana comparado con la semana pasada. ¡Gran progreso!',
    activityImpact: 'Impacto de la Actividad',
    exercisePositiveImpact: 'Las sesiones de ejercicio parecen impactar positivamente tu estado de ánimo. Considera mantener esta rutina.',
    moodTrends: 'Tendencias del Estado de Ánimo',
    aiPersonalizedByClinician: 'Comportamiento de la IA personalizado por tu médico'
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
    
    // Dashboard - General
    totalPatients: 'Total des Patients',
    upcomingSessions: 'Sessions à Venir',
    activeTasks: 'Tâches Actives',
    recentActivity: 'Activité Récente',
    welcomeBackMessage: 'Bon retour!',
    mentalHealthOverview: 'Voici votre aperçu de santé mentale.',
    
    // Dashboard - Patient
    patientDashboard: 'Tableau de Bord',
    yourMentalHealthOverview: 'Bon retour! Voici votre aperçu de santé mentale.',
    todaysMood: 'Humeur d\'Aujourd\'hui',
    weeklyProgress: 'Progrès Hebdomadaire',
    upcomingAppointments: 'Rendez-vous à Venir',
    completedTasks: 'Tâches Terminées',
    tasksCompleted: 'Tâches Terminées',
    
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
    
    // Common UI Text
    viewAll: 'Voir Tout',
    seeMore: 'Voir Plus',
    showLess: 'Voir Moins',
    today: 'Aujourd\'hui',
    thisWeek: 'Cette Semaine',
    thisMonth: 'Ce Mois',
    
    // Status and Labels
    active: 'Actif',
    completed: 'Terminé',
    pending: 'En Attente',
    scheduled: 'Programmé',
    cancelled: 'Annulé',
    
    // Time and Dates
    morning: 'Matin',
    afternoon: 'Après-midi',
    evening: 'Soir',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    
    // Actions and Buttons
    scheduleSession: 'Programmer Session',
    addTask: 'Ajouter Tâche',
    viewDetails: 'Voir Détails',
    editProfile: 'Modifier Profil',
    changePassword: 'Changer Mot de Passe',
    logout: 'Déconnexion',
    
    // Navigation Items
    mood: 'Humeur',
    chat: 'Chat',
    goals: 'Objectifs',
    insights: 'Insights',
    treatmentPlans: 'Plans de Traitement',
    resourceLibrary: 'Bibliothèque de Ressources',
    
    // Landing Page
    about: 'À Propos',
    features: 'Fonctionnalités',
    pricing: 'Tarifs',
    contact: 'Contact',
    help: 'Aide',
    faq: 'FAQ',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    security: 'Sécurité',
    
    // App Name
    appName: 'MoodMate',
    
    // New Patient Dashboard Translations
    quickActions: 'Actions Rapides',
    logMood: 'Enregistrer Humeur',
    viewTasks: 'Voir les Tâches',
    aiChat: 'Chat IA',
    progressOverview: 'Aperçu des Progrès',
    weeklyGoals: 'Objectifs Hebdomadaires',
    moodStability: 'Stabilité de l\'Humeur',
    sessionAttendance: 'Présence aux Sessions',
    improvingWell: 'Amélioration Excellente!',
    wellnessStreak: 'Série de Bien-être',
    daysInARow: 'jours d\'affilée',
    longestStreak: 'Plus Longue Série',
    weeklyTarget: 'Objectif Hebdomadaire',
    recentAchievements: 'Réalisations Récentes',
    mood_tracker: 'Suiveur d\'Humeur',
    task_master: 'Maître des Tâches',
    session_regular: 'Régulier en Sessions',
    dailyInspiration: 'Inspiration Quotidienne',
    patient: 'Patient',
    goalsProgress: 'Objectifs et Progrès',
    setTrackGoalsAI: 'Définissez et suivez vos objectifs de santé mentale avec l\'assistance IA.',
    moodTracking: 'Suivi de l\'Humeur',
    trackMoodPatternsOverTime: 'Suivez et surveillez vos schémas d\'humeur au fil du temps.',
    myTasks: 'Mes Tâches',
    refresh: 'Actualiser',
    noTasksAssigned: 'Aucune tâche assignée pour le moment.',
    due: 'Échéance',
    overdue: 'en retard',
    deleteTask: 'Supprimer la tâche',
    areYouSure: 'Êtes-vous sûr?',
    deleteTaskConfirmation: 'Cela supprimera définitivement cette tâche. Cette action ne peut pas être annulée.',
    deleting: 'Suppression...',
    weeklyMoodSummary: 'Résumé Hebdomadaire de l\'Humeur',
    moodStableThisWeek: 'Votre humeur a été plus stable cette semaine par rapport à la semaine dernière. Excellent progrès!',
    activityImpact: 'Impact de l\'Activité',
    exercisePositiveImpact: 'Les sessions d\'exercice semblent impacter positivement votre humeur. Considérez maintenir cette routine.',
    moodTrends: 'Tendances de l\'Humeur',
    aiPersonalizedByClinician: 'Comportement de l\'IA personnalisé par votre médecin'
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
    
    // Dashboard - General
    totalPatients: 'Patienten Gesamt',
    upcomingSessions: 'Bevorstehende Sitzungen',
    activeTasks: 'Aktive Aufgaben',
    recentActivity: 'Letzte Aktivität',
    welcomeBackMessage: 'Willkommen zurück!',
    mentalHealthOverview: 'Hier ist Ihre psychische Gesundheitsübersicht.',
    
    // Dashboard - Patient
    patientDashboard: 'Dashboard',
    yourMentalHealthOverview: 'Willkommen zurück! Hier ist Ihre psychische Gesundheitsübersicht.',
    todaysMood: 'Heutige Stimmung',
    weeklyProgress: 'Wöchentlicher Fortschritt',
    upcomingAppointments: 'Bevorstehende Termine',
    completedTasks: 'Erledigte Aufgaben',
    tasksCompleted: 'Erledigte Aufgaben',
    
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
    
    // Common UI Text
    viewAll: 'Alle anzeigen',
    seeMore: 'Mehr anzeigen',
    showLess: 'Weniger anzeigen',
    today: 'Heute',
    thisWeek: 'Diese Woche',
    thisMonth: 'Dieser Monat',
    
    // Status and Labels
    active: 'Aktiv',
    completed: 'Abgeschlossen',
    pending: 'Ausstehend',
    scheduled: 'Geplant',
    cancelled: 'Abgesagt',
    
    // Time and Dates
    morning: 'Morgen',
    afternoon: 'Nachmittag',
    evening: 'Abend',
    yesterday: 'Gestern',
    tomorrow: 'Morgen',
    
    // Actions and Buttons
    scheduleSession: 'Sitzung planen',
    addTask: 'Aufgabe hinzufügen',
    viewDetails: 'Details anzeigen',
    editProfile: 'Profil bearbeiten',
    changePassword: 'Passwort ändern',
    logout: 'Abmelden',
    
    // Navigation Items
    mood: 'Stimmung',
    chat: 'Chat',
    goals: 'Ziele',
    insights: 'Erkenntnisse',
    treatmentPlans: 'Behandlungspläne',
    resourceLibrary: 'Ressourcenbibliothek',
    
    // Landing Page
    about: 'Über Uns',
    features: 'Funktionen',
    pricing: 'Preise',
    contact: 'Kontakt',
    help: 'Hilfe',
    faq: 'FAQ',
    privacy: 'Datenschutz',
    terms: 'Bedingungen',
    security: 'Sicherheit',
    
    // App Name
    appName: 'MoodMate',
    
    // New Patient Dashboard Translations
    quickActions: 'Schnellaktionen',
    logMood: 'Stimmung Protokollieren',
    viewTasks: 'Aufgaben Anzeigen',
    aiChat: 'KI Chat',
    progressOverview: 'Fortschrittsübersicht',
    weeklyGoals: 'Wöchentliche Ziele',
    moodStability: 'Stimmungsstabilität',
    sessionAttendance: 'Sitzungsteilnahme',
    improvingWell: 'Gut Verbessernd!',
    wellnessStreak: 'Wellness-Serie',
    daysInARow: 'Tage in Folge',
    longestStreak: 'Längste Serie',
    weeklyTarget: 'Wöchentliches Ziel',
    recentAchievements: 'Aktuelle Erfolge',
    mood_tracker: 'Stimmungsverfolger',
    task_master: 'Aufgabenmeister',
    session_regular: 'Sitzungsregulär',
    dailyInspiration: 'Tägliche Inspiration',
    patient: 'Patient',
    goalsProgress: 'Ziele und Fortschritt',
    setTrackGoalsAI: 'Setzen und verfolgen Sie Ihre psychischen Gesundheitsziele mit KI-Unterstützung.',
    moodTracking: 'Stimmungsverfolgung',
    trackMoodPatternsOverTime: 'Verfolgen und überwachen Sie Ihre Stimmungsmuster über die Zeit.',
    myTasks: 'Meine Aufgaben',
    refresh: 'Aktualisieren',
    noTasksAssigned: 'Noch keine Aufgaben zugewiesen.',
    due: 'Fällig',
    overdue: 'überfällig',
    deleteTask: 'Aufgabe löschen',
    areYouSure: 'Sind Sie sicher?',
    deleteTaskConfirmation: 'Dies wird diese Aufgabe dauerhaft löschen. Diese Aktion kann nicht rückgängig gemacht werden.',
    deleting: 'Löschen...',
    weeklyMoodSummary: 'Wöchentliche Stimmungsübersicht',
    moodStableThisWeek: 'Ihre Stimmung war diese Woche stabiler im Vergleich zur letzten Woche. Großer Fortschritt!',
    activityImpact: 'Aktivitätseinfluss',
    exercisePositiveImpact: 'Übungssitzungen scheinen Ihre Stimmung positiv zu beeinflussen. Erwägen Sie, diese Routine beizubehalten.',
    moodTrends: 'Stimmungstrends',
    aiPersonalizedByClinician: 'KI-Verhalten, das von Ihrem Arzt personalisiert wurde'
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
