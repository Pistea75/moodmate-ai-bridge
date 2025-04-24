
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PublicNav } from '../components/PublicNav';
import { HeroSection } from '../components/landing/HeroSection';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/landing/Footer';

export default function Landing() {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (userRole === 'clinician') {
        navigate('/clinician/dashboard');
      } else if (userRole === 'patient') {
        navigate('/patient/dashboard');
      }
    }
  }, [user, userRole, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
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
