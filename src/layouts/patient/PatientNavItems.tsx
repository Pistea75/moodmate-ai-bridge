
import { 
  Home, 
  MessageSquare, 
  Heart, 
  CheckSquare, 
  Calendar, 
  User, 
  Target,
  TrendingUp,
  Settings,
  Mail,
  Store
} from 'lucide-react';

export const patientNavItems = [
  {
    title: 'nav.dashboard',
    href: '/patient/dashboard',
    icon: Home,
  },
  {
    title: 'nav.chat',
    href: '/patient/chat',
    icon: MessageSquare,
  },
  {
    title: 'nav.marketplace',
    href: '/patient/marketplace',
    icon: Store,
  },
  {
    title: 'nav.messages',
    href: '/patient/messages',
    icon: Mail,
  },
  {
    title: 'nav.mood',
    href: '/patient/mood-insights',
    icon: Heart,
  },
  {
    title: 'nav.tasks',
    href: '/patient/tasks',
    icon: CheckSquare,
  },
  {
    title: 'nav.goals',
    href: '/patient/goals',
    icon: Target,
  },
  {
    title: 'nav.sessions',
    href: '/patient/sessions',
    icon: Calendar,
  },
];

export function PatientNavItems() {
  return patientNavItems;
}
