
import { Link, useLocation } from "react-router-dom";
import { Settings, User, LogOut, Home, Calendar, MessageSquare, BarChart, ListCheck, Users, Bot } from "lucide-react";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MainNav() {
  const location = useLocation();
  const isLoggedIn = location.pathname.includes('/patient') || location.pathname.includes('/clinician');
  const userType = location.pathname.includes('/patient') ? 'patient' : 'clinician';

  const patientNavItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: Home },
    { name: 'AI Chat', path: '/patient/chat', icon: MessageSquare },
    { name: 'Tasks', path: '/patient/tasks', icon: ListCheck },
    { name: 'Sessions', path: '/patient/sessions', icon: Calendar },
    { name: 'Insights', path: '/patient/insights', icon: BarChart },
    { name: 'Settings', path: '/patient/settings', icon: Settings },
  ];

  const clinicianNavItems = [
    { name: 'Dashboard', path: '/clinician/dashboard', icon: Home },
    { name: 'Patients', path: '/clinician/patients', icon: Users },
    { name: 'Sessions', path: '/clinician/sessions', icon: Calendar },
    { name: 'Tasks', path: '/clinician/tasks', icon: ListCheck },
    { name: 'AI Chat Reports', path: '/clinician/reports', icon: MessageSquare },
    { name: 'Train AI', path: '/clinician/train-ai', icon: Bot },
    { name: 'Settings', path: '/clinician/settings', icon: Settings },
  ];

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <Link to={isLoggedIn ? `/${userType}/dashboard` : "/"} className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--mood-primary)] to-[var(--mood-secondary)] flex items-center justify-center">
          <span className="font-bold text-white">M</span>
        </div>
        <span className="text-xl font-semibold" style={{ color: 'var(--mood-primary)' }}>MoodMate</span>
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
                  <Button className="text-sm bg-[var(--mood-primary)] hover:bg-[var(--mood-primary)]/90">Sign up</Button>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            <NavigationMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(userType === 'patient' ? patientNavItems : clinicianNavItems).map((item) => (
                    <DropdownMenuItem key={item.path} asChild>
                      <Link to={item.path} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
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
