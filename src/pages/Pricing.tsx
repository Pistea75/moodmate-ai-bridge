
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { PublicNav } from '../components/PublicNav';

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      features: [
        "Access to AI companion",
        "Basic progress tracking",
        "Message support",
        "Limited sessions"
      ]
    },
    {
      name: "Professional",
      price: "$99",
      features: [
        "Everything in Basic",
        "Advanced analytics",
        "Priority support",
        "Unlimited sessions"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-mood-purple/10 to-transparent py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Pricing Plans</h1>
            <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
              Choose the plan that best fits your needs
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.name} className="p-6 border shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold mb-6">{plan.price}<span className="text-sm text-muted-foreground">/month</span></p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="text-mood-purple" size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-mood-purple hover:bg-mood-purple/90">Get Started</Button>
              </Card>
            ))}
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
