
import { Link, useLocation } from "react-router-dom";
import { MenuIcon, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogoutButton } from "@/components/LogoutButton";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  navItems: Array<{ name: string; path: string; icon: any }>;
  username: string;
}

export function MobileNavigation({ navItems, username }: MobileNavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b border-border z-50 flex items-center justify-between px-4 md:hidden">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-muted/80 active:bg-muted transition-colors"
              >
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="p-0 w-80 bg-background border-r border-border"
            >
              <div className="flex flex-col h-full bg-background">
                {/* Header */}
                <div className="p-6 border-b border-border bg-background">
                  <div className="flex items-center gap-3 mb-4">
                    <Link to="/patient/dashboard" className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-xl font-bold text-primary">MoodMate</span>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {username.split(' ').map(n => n[0]).join('') || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-foreground truncate">
                        {username}
                      </p>
                      <p className="text-sm text-muted-foreground">Patient</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 bg-background">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 active:scale-95",
                        location.pathname === item.path
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/80'
                      )}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-background">
                  <LogoutButton 
                    variant="ghost" 
                    className="w-full justify-start text-base font-medium py-4 hover:bg-muted/50 active:bg-muted/80 transition-colors" 
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-primary">MoodMate</span>
          </Link>
        </div>

        {/* Optional: Quick action button */}
        <Link to="/patient/chat">
          <Button 
            size="sm" 
            variant="outline"
            className="h-9 px-3 text-sm font-medium border-primary/20 text-primary hover:bg-primary/10 active:bg-primary/20 transition-colors"
          >
            Chat
          </Button>
        </Link>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16 md:hidden"></div>
    </>
  );
}
