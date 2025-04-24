
import { MainNav } from '../components/MainNav';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </div>
      <Footer />
    </div>
  );
}
