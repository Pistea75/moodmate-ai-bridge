
import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar, 
  ListCheck, 
  MessageCircle,
  Settings,
  User,
  Bot
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/providers/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { themeColor } = useTheme();
  const [clinicianName, setClinicianName] = useState('');
  
  const navItems = [
    { name: 'Dashboard', path: '/clinician/dashboard', icon: Home },
    { name: 'Patients', path: '/clinician/patients', icon: Users },
    { name: 'Sessions', path: '/clinician/sessions', icon: Calendar },
    { name: 'Tasks', path: '/clinician/tasks', icon: ListCheck },
    { name: 'AI Chat Reports', path: '/clinician/reports', icon: MessageCircle },
    { name: 'Train AI', path: '/clinician/train-ai', icon: Bot },
    { name: 'Settings', path: '/clinician/settings', icon: Settings },
  ];
  
  useEffect(() => {
    const fetchClinicianProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching clinician profile:', error);
            return;
          }
          
          if (data) {
            const firstName = data.first_name || '';
            const lastName = data.last_name || '';
            
            const fullName = [firstName, lastName].filter(Boolean).join(' ');
            if (fullName) {
              setClinicianName(fullName);
            } else {
              setClinicianName('Clinician');
            }
          }
        } catch (error) {
          console.error('Error in fetchClinicianProfile:', error);
        }
      }
    };
    
    fetchClinicianProfile();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-col bg-background border-r fixed h-screen hidden md:flex">
        <div className="p-4">
          <Link to="/clinician/dashboard" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground">M</span>
            </div>
            <span className="text-xl font-semibold text-primary">MoodMate</span>
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
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-accent hover:text-accent-foreground'
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
            to="/clinician/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent"
          >
            <div className="rounded-full bg-muted size-9 flex items-center justify-center">
              <User size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Dr. {clinicianName}</div>
              {user?.user_metadata?.referral_code && (
                <div className="text-xs text-muted-foreground font-mono">
                  {user.user_metadata.referral_code}
                </div>
              )}
            </div>
          </Link>
        </div>
      </aside>
      
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-30 md:hidden">
        <div className="container h-full flex items-center justify-between px-4">
          <Link to="/clinician/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="font-bold text-primary-foreground text-sm">M</span>
            </div>
            <span className="text-lg font-semibold text-primary">MoodMate</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/clinician/profile" className="rounded-full bg-muted size-8 flex items-center justify-center">
              <User size={18} className="text-muted-foreground" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-30 md:hidden">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 ${
                location.pathname === item.path 
                  ? 'text-primary' 
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
