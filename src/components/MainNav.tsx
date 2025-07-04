
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

  // Mobile navigation for clinician
  if (isLoggedIn && userRole === 'clinician' && isMobile) {
    return <MobileNavigation navItems={navItems} username={username} />;
  }

  // Desktop navigation for clinician, patient, and public pages
  return (
    <DesktopNavigation 
      isLoggedIn={isLoggedIn} 
      navItems={isLoggedIn ? navItems : undefined}
      username={isLoggedIn ? username : undefined}
    />
  );
}
