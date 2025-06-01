
import { Link, useLocation } from "react-router-dom";
import { User, Home, Calendar, MessageSquare, BarChart, ListCheck, Users, Bot } from "lucide-react";
import { Button } from "./ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton } from "@/components/LogoutButton";
import { useTheme } from "@/providers/ThemeProvider";

export function MainNav() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user, userRole } = useAuth();
  const { themeColor } = useTheme();
  
  const isLoggedIn = !!user;
  
  const patientNavItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
    { name: 'AI Chat', path: '/patient/chat', icon: MessageSquare },
    { name: 'Tasks', path: '/patient/tasks', icon: ListCheck },
    { name: 'Sessions', path: '/patient/sessions', icon: Calendar },
    { name: 'Insights', path: '/patient/insights', icon: BarChart },
    { name: 'Settings', path: '/patient/settings', icon: User },
  ];

  const clinicianNavItems = [
    { name: 'Dashboard', path: '/clinician/dashboard', icon: Home },
    { name: 'Patients', path: '/clinician/patients', icon: Users },
    { name: 'Sessions', path: '/clinician/sessions', icon: Calendar },
    { name: 'Tasks', path: '/clinician/tasks', icon: ListCheck },
    { name: 'AI Chat Reports', path: '/clinician/reports', icon: MessageSquare },
    { name: 'Train AI', path: '/clinician/train-ai', icon: Bot },
    { name: 'Settings', path: '/clinician/settings', icon: User },
  ];

  const navItems = userRole === 'clinician' ? clinicianNavItems : patientNavItems;
  const dashboardPath = userRole === 'clinician' ? '/clinician/dashboard' : '/patient/dashboard';
  const username = user?.user_metadata?.full_name || 'User';

  // For patient routes, don't show MainNav - the PatientLayout will handle navigation
  if (isLoggedIn && userRole === 'patient') {
    return null;
  }

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-background border-b sticky top-0 z-50 w-full">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <span className="font-bold text-primary-foreground">M</span>
        </div>
        <span className="text-xl font-semibold text-primary">MoodMate</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="gap-6">
          {!isLoggedIn ? (
            <>
              <NavigationMenuItem>
                <Link to="/features" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Features
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  About
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">Log in</Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/signup/patient">
                  <Button className="text-sm">Sign up</Button>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutButton variant="ghost" className="w-full justify-start" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
