
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
  Users
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
    icon: Users,
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
  {
    title: 'nav.profile',
    href: '/patient/profile',
    icon: User,
  },
];

export function PatientNavItems() {
  return patientNavItems;
}
