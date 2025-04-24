
import MainLayout from '../layouts/MainLayout';
import { Card } from '@/components/ui/card';

export default function Features() {
  const features = [
    {
      title: "AI-Powered Therapy Support",
      description: "24/7 mental health support with our advanced AI companion."
    },
    {
      title: "Secure Communication",
      description: "End-to-end encrypted messaging between patients and clinicians."
    },
    {
      title: "Progress Tracking",
      description: "Comprehensive tools for monitoring mental health progress."
    },
    {
      title: "Customizable Experience",
      description: "Personalize the platform to match your preferences."
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Platform Features</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6">
              <h2 className="text-xl font-semibold mb-3">{feature.title}</h2>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
