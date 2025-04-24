import { ReactNode } from 'react';
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

type PatientLayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({ children }: PatientLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
    { name: 'AI Chat', path: '/patient/chat', icon: MessageCircle },
    { name: 'Tasks', path: '/patient/tasks', icon: ListCheck },
    { name: 'Sessions', path: '/patient/sessions', icon: Calendar },
    { name: 'Insights', path: '/patient/insights', icon: BarChart },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];
  
  return (
    <div className="flex min-h-screen bg-[var(--mood-accent)]">
      {/* Mobile Top Nav */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-30 md:hidden">
        <div className="container h-full flex items-center justify-between px-4">
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--mood-primary)] to-[var(--mood-secondary)] flex items-center justify-center">
              <span className="font-bold text-white">M</span>
            </div>
            <span className="text-lg font-semibold" style={{ color: 'var(--mood-primary)' }}>MoodMate</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/patient/profile" className="rounded-full bg-muted size-8 flex items-center justify-center">
              <User size={18} className="text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-background border-r fixed h-screen">
        <div className="p-4">
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--mood-primary)] to-[var(--mood-secondary)] flex items-center justify-center">
              <span className="font-bold text-white">M</span>
            </div>
            <span className="text-xl font-semibold" style={{ color: 'var(--mood-primary)' }}>MoodMate</span>
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                    location.pathname === item.path 
                      ? 'bg-[var(--mood-primary)] text-white' 
                      : 'hover:bg-[var(--mood-muted)] text-[var(--mood-foreground)]'
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Link 
            to="/patient/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--mood-muted)]"
          >
            <div className="rounded-full bg-muted size-9 flex items-center justify-center">
              <User size={20} className="text-[var(--mood-foreground)]" />
            </div>
            <div className="flex-1 text-sm">
              <div className="font-medium text-[var(--mood-foreground)]">Patient Name</div>
              <div className="text-muted-foreground">View Profile</div>
            </div>
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 md:ml-64">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
