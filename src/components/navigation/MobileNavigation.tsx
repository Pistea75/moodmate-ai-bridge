
import { Link, useLocation } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogoutButton } from "@/components/LogoutButton";
import { useState } from "react";

interface MobileNavigationProps {
  navItems: Array<{ name: string; path: string; icon: any }>;
  username: string;
}

export function MobileNavigation({ navItems, username }: MobileNavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-16 border-b bg-background z-50 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-background border-r">
            <div className="flex flex-col h-full bg-background">
              {/* Header */}
              <div className="p-6 border-b bg-background">
                <Link to="/clinician/dashboard" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="font-bold text-primary-foreground text-sm">M</span>
                  </div>
                  <span className="text-lg font-semibold text-primary">MoodMate</span>
                </Link>
                <p className="text-sm text-muted-foreground mt-2">Welcome, {username}</p>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 bg-background">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t bg-background">
                <LogoutButton variant="ghost" className="w-full justify-start text-sm" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-sm">M</span>
          </div>
          <span className="text-lg font-semibold text-primary">MoodMate</span>
        </div>
      </div>
    </div>
  );
}
