
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
    <div className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 backdrop-blur supports-[backdrop-filter]:bg-purple-600/95 sticky top-0 z-50 w-full border-b border-purple-300/30 shadow-lg">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-white to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
        <span className="text-2xl font-bold text-white">MoodMate</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="gap-4 md:gap-6">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.path}>
              <Link 
                to={item.path} 
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-white font-semibold"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <Link to="/login">
              <Button variant="ghost" className="text-sm text-white/80 hover:text-white hover:bg-white/10">Log In</Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/signup/patient">
              <Button className="text-sm bg-white text-purple-600 hover:bg-white/90 hover:text-purple-700 font-semibold rounded-full px-6">Start Your Journey</Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
