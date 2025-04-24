
import MainLayout from '../layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { PublicNav } from '../components/PublicNav';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-mood-purple/10 to-transparent py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">About MoodMate</h1>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Transforming mental healthcare through technology and compassion
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-mood-purple">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                MoodMate was founded with a simple mission: to make mental healthcare more
                accessible and effective through technology. Our platform combines the expertise
                of mental health professionals with advanced AI technology to provide
                comprehensive support for both patients and clinicians.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-mood-purple">Our Approach</h2>
              <p className="text-lg text-muted-foreground">
                We believe in creating a supportive environment where individuals can work
                on their mental health journey with the guidance of qualified professionals
                and the assistance of cutting-edge AI technology. Our approach is holistic,
                focusing on both immediate support and long-term growth.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-mood-purple mb-6">Our Values</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-medium mb-3">Accessibility</h3>
                  <p className="text-muted-foreground">Making mental healthcare available to everyone, regardless of location or circumstances.</p>
                </Card>
                <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-medium mb-3">Empowerment</h3>
                  <p className="text-muted-foreground">Providing tools and knowledge that empower individuals to take control of their mental wellbeing.</p>
                </Card>
                <Card className="p-6 shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-medium mb-3">Innovation</h3>
                  <p className="text-muted-foreground">Continuously improving our technology to better serve the mental health community.</p>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
