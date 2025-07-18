
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
    <div className="flex items-center justify-between py-4 px-6 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50 w-full border-b border-white/20">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-900">MoodMate</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="gap-4 md:gap-6">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.path}>
              <Link 
                to={item.path} 
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "text-purple-600 font-semibold"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                {item.name}
              </Link>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <Link to="/login">
              <Button variant="ghost" className="text-sm text-gray-600 hover:text-purple-600">SIGN IN</Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/signup/patient">
              <Button className="text-sm bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full px-6">SIGN UP</Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
