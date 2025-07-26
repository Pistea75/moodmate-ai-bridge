
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { Brain } from "lucide-react";

export function PublicNav() {
  const location = useLocation();
  
  // Define navigation items
  const navItems = [
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy", path: "/privacy" },
    { name: "Help", path: "/help" },
  ];

  const isLandingPage = location.pathname === '/';

  return (
    <div className={`flex items-center justify-between py-6 px-6 sticky top-0 z-50 w-full transition-all duration-300 ${
      isLandingPage 
        ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/10' 
        : 'bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm'
    }`}>
      <Link to="/" className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
          isLandingPage
            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
            : 'bg-gradient-to-br from-purple-600 to-pink-600'
        }`}>
          <Brain className="h-7 w-7 text-white" />
        </div>
        <span className={`text-2xl font-bold transition-colors duration-300 ${
          isLandingPage ? 'text-white' : 'text-slate-900'
        }`}>MoodMate</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="gap-4 md:gap-8">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.path}>
              <Link 
                to={item.path} 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  location.pathname === item.path
                    ? isLandingPage 
                      ? "text-white font-semibold border-b-2 border-purple-400"
                      : "text-purple-600 font-semibold"
                    : isLandingPage
                      ? "text-white/80 hover:text-white"
                      : "text-slate-600 hover:text-purple-600"
                }`}
              >
                {item.name}
              </Link>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <Link to="/login">
              <Button 
                variant="ghost" 
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isLandingPage
                    ? 'text-white/90 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                Log In
              </Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/signup/patient">
              <Button className={`text-sm font-semibold rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                isLandingPage
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
              }`}>
                Start Your Journey
              </Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
