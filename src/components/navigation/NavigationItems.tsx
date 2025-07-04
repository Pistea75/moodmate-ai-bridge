
import { Home, Calendar, MessageSquare, BarChart, ListCheck, Users, Bot, User } from "lucide-react";

export const patientNavItems = [
  { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
  { name: 'AI Chat', path: '/patient/chat', icon: MessageSquare },
  { name: 'Tasks', path: '/patient/tasks', icon: ListCheck },
  { name: 'Sessions', path: '/patient/sessions', icon: Calendar },
  { name: 'Insights', path: '/patient/insights', icon: BarChart },
  { name: 'Settings', path: '/patient/settings', icon: User },
];

export const clinicianNavItems = [
  { name: 'Dashboard', path: '/clinician/dashboard', icon: Home },
  { name: 'Patients', path: '/clinician/patients', icon: Users },
  { name: 'Sessions', path: '/clinician/sessions', icon: Calendar },
  { name: 'Tasks', path: '/clinician/tasks', icon: ListCheck },
  { name: 'AI Chat Reports', path: '/clinician/reports', icon: MessageSquare },
  { name: 'Train AI', path: '/clinician/train-ai', icon: Bot },
  { name: 'Settings', path: '/clinician/settings', icon: User },
];
