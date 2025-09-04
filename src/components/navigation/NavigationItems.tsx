
import { Home, Calendar, MessageSquare, BarChart, ListCheck, Users, Bot, User, Heart, Target, Store } from "lucide-react";

export const getPatientNavItems = (t: (key: string) => string) => [
  { name: t('nav.dashboard'), path: '/patient/dashboard', icon: Home },
  { name: t('nav.chat'), path: '/patient/chat', icon: MessageSquare },
  { name: t('nav.messages'), path: '/patient/messages', icon: MessageSquare },
  { name: t('nav.mood'), path: '/patient/mood-insights', icon: Heart },
  { name: t('nav.tasks'), path: '/patient/tasks', icon: ListCheck },
  { name: t('nav.goals'), path: '/patient/goals', icon: Target },
  { name: t('nav.sessions'), path: '/patient/sessions', icon: Calendar },
  { name: t('nav.insights'), path: '/patient/insights', icon: BarChart },
  { name: t('nav.settings'), path: '/patient/settings', icon: User },
];

export const getClinicianNavItems = (t: (key: string) => string) => [
  { name: t('nav.dashboard'), path: '/clinician/dashboard', icon: Home },
  { name: t('nav.patients'), path: '/clinician/patients', icon: Users },
  { name: t('nav.sessions'), path: '/clinician/sessions', icon: Calendar },
  { name: t('nav.tasks'), path: '/clinician/tasks', icon: ListCheck },
  { name: t('nav.reports'), path: '/clinician/reports', icon: MessageSquare },
  { name: t('nav.trainAI'), path: '/clinician/train-ai', icon: Bot },
  { name: t('nav.messages'), path: '/clinician/communications', icon: MessageSquare },
  { name: t('nav.marketplace'), path: '/clinician/marketplace-profile', icon: Store },
  { name: t('nav.analytics'), path: '/clinician/analytics', icon: BarChart },
  { name: t('nav.settings'), path: '/clinician/settings', icon: User },
];
