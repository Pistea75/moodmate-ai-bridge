
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Settings,
  Brain,
  BarChart3,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

const navigationItems = [
  { 
    title: 'Dashboard', 
    href: '/clinician/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    title: 'Analytics', 
    href: '/clinician/analytics', 
    icon: BarChart3 
  },
  { 
    title: 'Risk Management', 
    href: '/clinician/risk-management', 
    icon: AlertTriangle 
  },
  { 
    title: 'Patients', 
    href: '/clinician/patients', 
    icon: Users 
  },
  { 
    title: 'Sessions', 
    href: '/clinician/sessions', 
    icon: Calendar 
  },
  { 
    title: 'Tasks', 
    href: '/clinician/tasks', 
    icon: CheckSquare 
  },
  { 
    title: 'Reports', 
    href: '/clinician/reports', 
    icon: FileText 
  },
  { 
    title: 'Train AI', 
    href: '/clinician/train-ai', 
    icon: Brain 
  },
];

const bottomItems = [
  { 
    title: 'Settings', 
    href: '/clinician/settings', 
    icon: Settings 
  }
];

export function ClinicianSidebarContent() {
  const location = useLocation();

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-sm' 
            : 'text-muted-foreground'
        }`}
      >
        <item.icon className="h-4 w-4" />
        <span className="font-medium">{item.title}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Navigation */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t">
        <nav className="space-y-1">
          {bottomItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </nav>
      </div>
    </div>
  );
}
