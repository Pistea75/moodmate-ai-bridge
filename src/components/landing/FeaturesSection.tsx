
import { Brain, Shield, CheckCircle2, Clock } from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-8 w-8 text-mood-purple" />,
    title: "AI Companion",
    description: "24/7 support with personalized AI assistance for continuous care between sessions."
  },
  {
    icon: <Shield className="h-8 w-8 text-mood-purple" />,
    title: "Secure Platform",
    description: "End-to-end encryption and HIPAA compliance for complete privacy and security."
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-mood-purple" />,
    title: "Progress Tracking",
    description: "Monitor emotional patterns with intuitive visualizations and insights."
  },
  {
    icon: <Clock className="h-8 w-8 text-mood-purple" />,
    title: "Flexible Sessions",
    description: "Connect with your therapist through scheduled or on-demand sessions."
  }
];

export function FeaturesSection() {
  return (
    <section className="w-full bg-muted/30 py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Mental Health Support</h2>
          <p className="text-muted-foreground">
            Experience a new era of mental healthcare with our innovative platform that combines
            human expertise with advanced AI technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
