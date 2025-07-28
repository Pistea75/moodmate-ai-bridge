
import { Card, CardContent } from '@/components/ui/card';
import { useClinicianProfile } from '@/layouts/clinician/useClinicianProfile';

export function WelcomeBanner() {
  const { clinicianFullName, isSuperAdmin } = useClinicianProfile();
  
  return (
    <Card className={`${isSuperAdmin ? 'bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 border-gray-700 dark:border-gray-800' : 'bg-gradient-to-r from-mood-purple to-mood-purple/80'} text-white`}>
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {isSuperAdmin ? 'Super Admin' : 'Dr.'} {clinicianFullName}!
        </h1>
        <p className={`${isSuperAdmin ? 'text-gray-300 dark:text-gray-400' : 'text-mood-purple-light'}`}>
          {isSuperAdmin 
            ? "You have full system access. Monitor and manage all accounts and system settings."
            : "Here's an overview of your patients and upcoming sessions for today."
          }
        </p>
      </CardContent>
    </Card>
  );
}
