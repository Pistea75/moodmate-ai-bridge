
import { 
  Home, 
  MessageSquare, 
  Heart, 
  CheckSquare, 
  Calendar, 
  User, 
  FileText,
  Target 
} from 'lucide-react';

export const patientNavItems = [
  {
    title: 'Dashboard',
    href: '/patient/dashboard',
    icon: Home,
  },
  {
    title: 'AI Chat',
    href: '/patient/chat',
    icon: MessageSquare,
  },
  {
    title: 'Mood Tracking',
    href: '/patient/mood',
    icon: Heart,
  },
  {
    title: 'Tasks',
    href: '/patient/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Goals',
    href: '/patient/goals',
    icon: Target,
  },
  {
    title: 'Sessions',
    href: '/patient/sessions',
    icon: Calendar,
  },
  {
    title: 'Reports',
    href: '/patient/reports',
    icon: FileText,
  },
  {
    title: 'Profile',
    href: '/patient/profile',
    icon: User,
  },
];
