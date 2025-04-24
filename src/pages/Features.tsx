
import { FeaturesHero } from '../components/features/FeaturesHero';
import { FeatureGrid } from '../components/features/FeatureGrid';
import { FeatureBenefits } from '../components/features/FeatureBenefits';
import { CTASection } from '../components/landing/CTASection';
import { PublicNav } from '../components/PublicNav';

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="flex-1">
        <FeaturesHero />
        <FeatureGrid />
        <FeatureBenefits />
        <CTASection />
      </div>
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
