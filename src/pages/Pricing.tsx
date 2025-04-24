
import MainLayout from '../layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

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
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <Card key={plan.name} className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-3xl font-bold mb-6">{plan.price}<span className="text-sm text-muted-foreground">/month</span></p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="text-primary" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">Get Started</Button>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
