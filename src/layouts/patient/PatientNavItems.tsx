
import { 
  Home, 
  MessageSquare, 
  Heart, 
  CheckSquare, 
  Calendar, 
  User, 
  Target,
  TrendingUp
} from 'lucide-react';

export const patientNavItems = [
  {
    title: 'dashboard',
    href: '/patient/dashboard',
    icon: Home,
  },
  {
    title: 'aiChat',
    href: '/patient/chat',
    icon: MessageSquare,
  },
  {
    title: 'mood',
    href: '/patient/mood-insights',
    icon: Heart,
  },
  {
    title: 'tasks',
    href: '/patient/tasks',
    icon: CheckSquare,
  },
  {
    title: 'goals',
    href: '/patient/goals',
    icon: Target,
  },
  {
    title: 'sessions',
    href: '/patient/sessions',
    icon: Calendar,
  },
  {
    title: 'profile',
    href: '/patient/profile',
    icon: User,
  },
];

export function PatientNavItems() {
  return patientNavItems;
}
