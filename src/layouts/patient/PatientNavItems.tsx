
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  ListCheck, 
  Calendar, 
  BarChart, 
  Settings, 
  User
} from 'lucide-react';

export type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

export const patientNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
  { name: 'AI Chat', path: '/patient/chat', icon: MessageCircle },
  { name: 'Tasks', path: '/patient/tasks', icon: ListCheck },
  { name: 'Sessions', path: '/patient/sessions', icon: Calendar },
  { name: 'Insights', path: '/patient/insights', icon: BarChart },
  { name: 'Settings', path: '/patient/settings', icon: Settings },
];

type PatientNavItemsProps = {
  isMobile?: boolean;
  onItemClick?: () => void;
};

export function PatientNavItems({ isMobile = false, onItemClick }: PatientNavItemsProps) {
  const location = useLocation();
  
  if (isMobile) {
    return (
      <div className="space-y-1">
        {patientNavItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 text-sm ${
              location.pathname === item.path 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent text-foreground'
            }`}
            onClick={onItemClick}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    );
  }
  
  return (
    <ul className="space-y-1">
      {patientNavItems.map((item) => (
        <li key={item.path}>
          <Link 
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              location.pathname === item.path 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-accent text-foreground'
            }`}
            onClick={onItemClick}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
