
import { Shield, CheckCircle2, Heart } from 'lucide-react';

export function FeatureBenefits() {
  const benefits = [
    {
      icon: <CheckCircle2 className="h-12 w-12 text-mood-purple" />,
      title: "Improved Outcomes",
      description: "Our platform has been shown to improve treatment outcomes by up to 40% compared to traditional therapy methods."
    },
    {
      icon: <Shield className="h-12 w-12 text-mood-purple" />,
      title: "Privacy-First Approach",
      description: "Your data security is our priority with end-to-end encryption and strict compliance with all healthcare privacy regulations."
    },
    {
      icon: <Heart className="h-12 w-12 text-mood-purple" />,
      title: "Better Patient Experience",
      description: "95% of our users report higher satisfaction with their mental healthcare compared to previous providers."
    }
  ];

  return (
    <section className="w-full py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Why Choose MoodMate</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our platform offers unique advantages that transform the mental healthcare experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-mood-purple/10 p-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
