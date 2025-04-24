
import MainLayout from '../layouts/MainLayout';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Server } from 'lucide-react';

export default function Security() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Data Encryption",
      description: "All data is protected with enterprise-grade encryption both in transit and at rest."
    },
    {
      icon: Lock,
      title: "Access Control",
      description: "Multi-factor authentication and role-based access control protect your account."
    },
    {
      icon: Server,
      title: "Secure Infrastructure",
      description: "Our infrastructure is hosted on secure, HIPAA-compliant servers with regular security audits."
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Security Measures</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {securityFeatures.map((feature) => (
            <Card key={feature.title} className="p-6">
              <feature.icon className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-3">{feature.title}</h2>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
