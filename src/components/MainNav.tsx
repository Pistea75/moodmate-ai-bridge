
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";

export function MainNav() {
  return (
    <div className="flex items-center justify-between py-4 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-mood-purple to-mood-purple-light flex items-center justify-center">
          <span className="font-bold text-white">M</span>
        </div>
        <span className="text-xl font-semibold text-mood-purple">MoodMate</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList className="gap-6">
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
              <Button className="text-sm bg-mood-purple hover:bg-mood-purple/90">Sign up</Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
