
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
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Top Nav */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-30 md:hidden">
        <div className="container h-full flex items-center justify-between px-4">
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-mood-purple to-mood-purple-light flex items-center justify-center">
              <span className="font-bold text-white text-sm">M</span>
            </div>
            <span className="text-lg font-semibold text-mood-purple">MoodMate</span>
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
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mood-purple to-mood-purple-light flex items-center justify-center">
              <span className="font-bold text-white">M</span>
            </div>
            <span className="text-xl font-semibold text-mood-purple">MoodMate</span>
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
                      ? 'bg-mood-purple text-white' 
                      : 'hover:bg-muted'
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted"
          >
            <div className="rounded-full bg-muted size-9 flex items-center justify-center">
              <User size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1 text-sm">
              <div className="font-medium">Patient Name</div>
              <div className="text-muted-foreground">View Profile</div>
            </div>
          </Link>
        </div>
      </aside>
      
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-30 md:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 ${
                location.pathname === item.path 
                  ? 'text-mood-purple' 
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="flex-1 pt-16 pb-20 md:pt-0 md:pb-0 md:ml-64">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
