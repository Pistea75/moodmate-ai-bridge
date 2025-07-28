
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/LogoutButton";
import { Brain } from "lucide-react";

interface DesktopNavigationProps {
  isLoggedIn: boolean;
  navItems?: Array<{ name: string; path: string; icon: any }>;
  username?: string;
}

export function DesktopNavigation({ isLoggedIn, navItems, username }: DesktopNavigationProps) {
  return (
    <div className="flex items-center justify-between py-4 px-6 bg-background border-b sticky top-0 z-50 w-full">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-semibold text-primary">MoodMate</span>
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
                  <Button className="text-sm">Sign up</Button>
                </Link>
              </NavigationMenuItem>
            </>
          ) : (
            navItems && username && (
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline">{username}</span>
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
                    <DropdownMenuItem asChild>
                      <LogoutButton variant="ghost" className="w-full justify-start" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
