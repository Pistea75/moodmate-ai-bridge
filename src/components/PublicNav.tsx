
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

  return (
    <div className="flex items-center justify-between py-6 px-6 sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-white/10">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <Brain className="h-7 w-7 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">MoodMate</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="flex items-center justify-center gap-1">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.path}>
              <Link 
                to={item.path} 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                  location.pathname === item.path
                    ? "text-white font-semibold bg-white/10"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button 
            variant="ghost" 
            className="text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-105"
          >
            Log In
          </Button>
        </Link>
        <Link to="/signup/patient">
          <Button className="text-sm font-semibold rounded-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            Start Your Journey
          </Button>
        </Link>
      </div>
    </div>
  );
}
