
import { 
  Brain, 
  Shield, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  LineChart 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Feature = {
  icon: JSX.Element;
  title: string;
  description: string;
  category: "ai" | "security" | "analytics" | "communication";
};

const features: Feature[] = [
  {
    icon: <Brain className="h-8 w-8 text-mood-purple" />,
    title: "AI-Powered Therapy Support",
    description: "24/7 mental health support with our advanced AI companion that learns and adapts to your needs.",
    category: "ai"
  },
  {
    icon: <Shield className="h-8 w-8 text-mood-purple" />,
    title: "Secure Communication",
    description: "End-to-end encrypted messaging and HIPAA-compliant platform ensuring complete privacy.",
    category: "security"
  },
  {
    icon: <CheckCircle2 className="h-8 w-8 text-mood-purple" />,
    title: "Progress Tracking",
    description: "Comprehensive tools for monitoring mental health progress with detailed insights.",
    category: "analytics"
  },
  {
    icon: <Clock className="h-8 w-8 text-mood-purple" />,
    title: "Flexible Sessions",
    description: "Schedule sessions at your convenience with easy-to-use booking system.",
    category: "communication"
  },
  {
    icon: <Users className="h-8 w-8 text-mood-purple" />,
    title: "Matched Care",
    description: "Get paired with the right mental health professional for your specific needs.",
    category: "communication"
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-mood-purple" />,
    title: "Analytics Dashboard",
    description: "Visual representation of your progress and treatment effectiveness over time.",
    category: "analytics"
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-mood-purple" />,
    title: "Multi-Channel Support",
    description: "Connect through text, voice, or video calls based on your comfort level.",
    category: "communication"
  },
  {
    icon: <LineChart className="h-8 w-8 text-mood-purple" />,
    title: "Outcome Measurement",
    description: "Track treatment outcomes with standardized assessment tools.",
    category: "analytics"
  }
];

export function FeatureGrid() {
  const getFeaturesByCategory = (category: Feature["category"]) => {
    return features.filter(feature => feature.category === category);
  };

  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All Features</TabsTrigger>
              <TabsTrigger value="ai">AI Features</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFeaturesByCategory("ai").map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFeaturesByCategory("security").map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFeaturesByCategory("analytics").map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="communication" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getFeaturesByCategory("communication").map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="rounded-full bg-mood-purple/10 w-12 h-12 flex items-center justify-center mb-4">
        {feature.icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </Card>
  );
}
