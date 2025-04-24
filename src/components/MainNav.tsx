import { Link, useLocation } from "react-router-dom";
import { Settings, User, LogOut, Home, Calendar, MessageSquare, BarChart, ListCheck, Users, Bot, Menu } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainNav() {
  const location = useLocation();
  const isMobile = useIsMobile();
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

  const navItems = userType === 'patient' ? patientNavItems : clinicianNavItems;

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      {isMobile && isLoggedIn ? (
        <>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="border-t mt-4 pt-4">
                  <Button variant="ghost" className="w-full justify-start text-destructive">
                    <LogOut className="h-5 w-5 mr-2" />
                    Log out
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--mood-primary)] to-[var(--mood-secondary)] flex items-center justify-center">
              <span className="font-bold text-white">M</span>
            </div>
            <span className="text-xl font-semibold" style={{ color: 'var(--mood-primary)' }}>MoodMate</span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/" className="flex items-center gap-2">
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
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-avatar.jpg" />
                          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                        </Avatar>
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
                      <DropdownMenuItem className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </>
      )}
    </div>
  );
}
