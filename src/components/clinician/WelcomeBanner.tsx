
import { Card, CardContent } from '@/components/ui/card';
import { useClinicianProfile } from '@/layouts/clinician/useClinicianProfile';

export function WelcomeBanner() {
  const { clinicianName } = useClinicianProfile();
  
  return (
    <Card className="bg-gradient-to-r from-mood-purple to-mood-purple/80 text-white">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Dr. {clinicianName}!
        </h1>
        <p className="text-mood-purple-light">
          Here's an overview of your patients and upcoming sessions for today.
        </p>
      </CardContent>
    </Card>
  );
}
