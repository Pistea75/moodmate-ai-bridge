import { ReactNode, useState } from 'react';
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
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type PatientLayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({ children }: PatientLayoutProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
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
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="flex items-center justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <nav className="flex flex-col h-full bg-background">
                <div className="p-4 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                  </Avatar>
                  <div className="mt-2 font-medium">Patient Name</div>
                </div>
                <div className="flex-1 overflow-auto py-2">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-2 text-sm ${
                          location.pathname === item.path 
                            ? 'bg-[var(--mood-primary)] text-white' 
                            : 'hover:bg-[var(--mood-muted)] text-[var(--mood-foreground)]'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon size={18} />
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-t p-4">
                  <Link 
                    to="/patient/profile"
                    className="flex items-center gap-2 text-sm text-[var(--mood-foreground)]"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    <span>View Profile</span>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          
          {/* Centered Logo */}
          <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--mood-primary)] to-[var(--mood-secondary)] flex items-center justify-center">
              <span className="font-bold text-white">M</span>
            </div>
            <span className="text-lg font-semibold" style={{ color: 'var(--mood-primary)' }}>MoodMate</span>
          </Link>
          
          {/* Empty div to maintain flex spacing */}
          <div className="w-8"></div>
        </div>
      </header>
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-background border-r fixed h-screen">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2">
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
