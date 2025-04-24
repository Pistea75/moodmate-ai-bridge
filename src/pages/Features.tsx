
import MainLayout from '../layouts/MainLayout';
import { FeaturesHero } from '../components/features/FeaturesHero';
import { FeatureGrid } from '../components/features/FeatureGrid';
import { FeatureBenefits } from '../components/features/FeatureBenefits';
import { CTASection } from '../components/landing/CTASection';

export default function Features() {
  return (
    <MainLayout>
      <FeaturesHero />
      <FeatureGrid />
      <FeatureBenefits />
      <CTASection />
    </MainLayout>
  );
}
