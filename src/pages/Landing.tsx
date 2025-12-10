import { PublicNav } from '@/components/PublicNav';
import { ModernHero } from '@/components/landing/ModernHero';
import { ModernFeatures } from '@/components/landing/ModernFeatures';
import { TrustedSection } from '@/components/landing/TrustedSection';
import { TestimonialSection } from '@/components/landing/TestimonialSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { ModernCTA } from '@/components/landing/ModernCTA';
import { ModernFooter } from '@/components/landing/ModernFooter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      <ModernHero />
      <ModernFeatures />
      <TrustedSection />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <ModernCTA />
      <ModernFooter />
    </div>
  );
}
