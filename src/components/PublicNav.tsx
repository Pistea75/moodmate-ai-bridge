
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Brain, MenuIcon, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LanguageSelector } from './LanguageSelector';

export function PublicNav() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Define navigation items
  const navItems = [
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy", path: "/privacy" },
    { name: "Help", path: "/help" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between py-6 px-6 sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">MoodMate</span>
        </Link>

        <nav className="flex items-center justify-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105",
                location.pathname === item.path
                  ? "text-white font-semibold bg-white/10"
                  : "text-white/80 hover:text-white hover:bg-white/5"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Link to="/login">
            <Button 
              variant="ghost" 
              className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Log In
            </Button>
          </Link>
          <Link to="/signup/choice">
            <Button className="text-sm font-semibold rounded-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-b border-white/10 z-50">
        <div className="flex items-center justify-between px-4 h-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">MoodMate</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 text-white hover:bg-white/10 active:bg-white/20 transition-colors"
              >
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-80 bg-slate-900 border-l border-white/10"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">MoodMate</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-white hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-6 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 active:scale-95",
                        location.pathname === item.path
                          ? "text-white bg-white/10 font-semibold"
                          : "text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 space-y-3">
                  <div className="flex justify-center mb-3">
                    <LanguageSelector />
                  </div>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-base font-medium text-white/90 hover:text-white hover:bg-white/10 py-4"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup/choice" onClick={() => setIsOpen(false)}>
                    <Button className="w-full text-base font-semibold rounded-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
                      Start Your Journey
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for mobile */}
      <div className="h-16 md:hidden"></div>
    </>
  );
}
