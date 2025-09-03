
import { Home, Calendar, MessageSquare, BarChart, ListCheck, Users, Bot, User, Heart, Target, Store } from "lucide-react";

export const patientNavItems = [
  { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
  { name: 'AI Chat', path: '/patient/chat', icon: MessageSquare },
  { name: 'Direct Messages', path: '/patient/messages', icon: MessageSquare },
  { name: 'Mood Log', path: '/patient/mood-insights', icon: Heart },
  { name: 'Tasks', path: '/patient/tasks', icon: ListCheck },
  { name: 'Goals', path: '/patient/goals', icon: Target },
  { name: 'Sessions', path: '/patient/sessions', icon: Calendar },
  { name: 'Insights', path: '/patient/insights', icon: BarChart },
  { name: 'Settings', path: '/patient/settings', icon: User },
];

export const clinicianNavItems = [
  { name: 'Dashboard', path: '/clinician/dashboard', icon: Home },
  { name: 'Patients', path: '/clinician/patients', icon: Users },
  { name: 'Sessions', path: '/clinician/sessions', icon: Calendar },
  { name: 'Tasks', path: '/clinician/tasks', icon: ListCheck },
  { name: 'AI Reports', path: '/clinician/reports', icon: MessageSquare },
  { name: 'Train AI', path: '/clinician/train-ai', icon: Bot },
  { name: 'Direct Messages', path: '/clinician/communications', icon: MessageSquare },
  { name: 'Marketplace', path: '/clinician/marketplace-profile', icon: Store },
  { name: 'Analytics', path: '/clinician/analytics', icon: BarChart },
  { name: 'Settings', path: '/clinician/settings', icon: User },
];
