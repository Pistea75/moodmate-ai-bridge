
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/providers/ThemeProvider";
import { patientNavItems, clinicianNavItems } from "./navigation/NavigationItems";
import { MobileNavigation } from "./navigation/MobileNavigation";
import { DesktopNavigation } from "./navigation/DesktopNavigation";

export function MainNav() {
  const isMobile = useIsMobile();
  const { user, userRole } = useAuth();
  const { themeColor } = useTheme();
  
  const isLoggedIn = !!user;
  const navItems = userRole === 'clinician' ? clinicianNavItems : patientNavItems;
  const username = user?.user_metadata?.full_name || 'User';

  // For clinician views, don't render MainNav since ClinicianLayout handles its own navigation
  if (isLoggedIn && userRole === 'clinician') {
    return null;
  }

  // Mobile navigation for patient pages
  if (isMobile && isLoggedIn && userRole === 'patient') {
    return (
      <MobileNavigation 
        navItems={navItems}
        username={username}
      />
    );
  }

  // Desktop navigation for patient and public pages
  if (!isMobile) {
    return (
      <DesktopNavigation 
        isLoggedIn={isLoggedIn} 
        navItems={isLoggedIn ? navItems : undefined}
        username={isLoggedIn ? username : undefined}
      />
    );
  }

  // For mobile public pages, no navigation (handled by PublicNav)
  return null;
}
