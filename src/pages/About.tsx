import { PublicNav } from '../components/PublicNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Target, Award, Heart, Zap, Globe, Shield } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Every interaction is designed with empathy and understanding at its core."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your mental health data is protected with industry-leading security measures."
    },
    {
      icon: Brain,
      title: "AI Innovation",
      description: "Cutting-edge technology that learns and adapts to provide personalized support."
    },
    {
      icon: Users,
      title: "Human Connection",
      description: "Technology that enhances, never replaces, the therapeutic relationship."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Mood Entries Logged" },
    { number: "95%", label: "User Satisfaction" },
    { number: "24/7", label: "AI Support Available" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      <PublicNav />
      
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            About MoodMate
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Transforming Mental Healthcare Through AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of mental health support by combining cutting-edge AI technology 
            with compassionate human care to create better outcomes for patients and clinicians.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Mental health challenges affect millions of people worldwide, yet access to quality care remains limited. 
              We believe that everyone deserves compassionate, personalized mental health support that's available 
              when they need it most.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              MoodMate bridges the gap between patients and clinicians by providing AI-powered insights, 
              24/7 support, and data-driven treatment recommendations that enhance the therapeutic relationship 
              and improve outcomes.
            </p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Dr. Sarah Chen</h3>
                <p className="text-primary text-sm mb-2">Chief Medical Officer</p>
                <p className="text-sm text-muted-foreground">
                  Licensed psychiatrist with 15+ years of experience in digital mental health innovation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Brain className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Alex Rodriguez</h3>
                <p className="text-primary text-sm mb-2">CTO & Co-Founder</p>
                <p className="text-sm text-muted-foreground">
                  AI researcher and former Google engineer specializing in natural language processing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Maria Thompson</h3>
                <p className="text-primary text-sm mb-2">Head of Patient Experience</p>
                <p className="text-sm text-muted-foreground">
                  Licensed clinical social worker focused on improving access to mental health care.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vision Section */}
        <div className="text-center">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <Globe className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                We envision a world where mental health support is accessible, personalized, and effective for everyone. 
                Through the thoughtful integration of AI and human expertise, we're creating a future where technology 
                empowers both patients and clinicians to achieve better mental health outcomes together.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="border-t py-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} MoodMate. All rights reserved.
        </div>
      </footer>
    </div>
  );
}