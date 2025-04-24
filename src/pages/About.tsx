
import MainLayout from '../layouts/MainLayout';

export default function About() {
  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">About MoodMate</h1>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg text-muted-foreground">
            MoodMate was founded with a simple mission: to make mental healthcare more
            accessible and effective through technology. Our platform combines the expertise
            of mental health professionals with advanced AI technology to provide
            comprehensive support for both patients and clinicians.
          </p>
          <p className="text-lg text-muted-foreground">
            We believe in creating a supportive environment where individuals can work
            on their mental health journey with the guidance of qualified professionals
            and the assistance of cutting-edge AI technology.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
