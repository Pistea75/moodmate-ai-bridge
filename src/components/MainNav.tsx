
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

  // Desktop navigation for patient and public pages only
  return (
    <DesktopNavigation 
      isLoggedIn={isLoggedIn} 
      navItems={isLoggedIn ? navItems : undefined}
      username={isLoggedIn ? username : undefined}
    />
  );
}
