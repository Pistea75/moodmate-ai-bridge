
import { PublicNav } from '@/components/PublicNav';
import { ModernHero } from '@/components/landing/ModernHero';
import { ModernFeatures } from '@/components/landing/ModernFeatures';
import { ModernCTA } from '@/components/landing/ModernCTA';
import { ModernFooter } from '@/components/landing/ModernFooter';
import { MobileAppSection } from '@/components/landing/MobileAppSection';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <ModernHero />
      <ModernFeatures />
      <MobileAppSection />
      <ModernCTA />
      <ModernFooter />
    </div>
  );
}
